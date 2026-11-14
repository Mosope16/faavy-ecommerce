import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paystack } from "@/lib/paystack";
import { shippingService } from "@/lib/shipping";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  if (!reference) {
    return NextResponse.redirect(`${appUrl}/checkout?error=missing_reference`);
  }

  try {
    const payment = await prisma.payment.findUnique({
      where: { reference },
      include: {
        order: {
          include: {
            items: true,
            shippingAddress: true,
          },
        },
      },
    });

    if (!payment) {
      return NextResponse.redirect(`${appUrl}/checkout?error=payment_not_found`);
    }

    // If already marked PAID (e.g. webhook arrived first), redirect directly to confirmation
    if (payment.status === "PAID") {
      return NextResponse.redirect(
        `${appUrl}/checkout/confirmation?orderNumber=${payment.order.orderNumber}`
      );
    }

    // Verify with Paystack API
    const verifyResult = await paystack.verifyTransaction(reference);

    // If sandbox / demo response or success
    const isSuccessful =
      verifyResult.status && verifyResult.data?.status === "success";

    if (isSuccessful) {
      await prisma.$transaction(async (tx) => {
        // Mark payment paid
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            paidAt: verifyResult.data?.paid_at
              ? new Date(verifyResult.data.paid_at)
              : new Date(),
            channel: verifyResult.data?.channel || "card",
            rawPayload: verifyResult as unknown as object,
          },
        });

        // Mark order confirmed
        await tx.order.update({
          where: { id: payment.orderId },
          data: {
            status: "CONFIRMED",
          },
        });

        // Create shipment record if not exists
        const existingShipment = await tx.shipment.findFirst({
          where: { orderId: payment.orderId },
        });

        if (!existingShipment) {
          const shipmentDetails = await shippingService.createShipment({
            orderId: payment.orderId,
            orderNumber: payment.order.orderNumber,
            recipientName: payment.order.customerName,
            recipientPhone: payment.order.customerPhone,
            recipientEmail: payment.order.customerEmail,
            deliveryAddress:
              payment.order.shippingAddress?.streetAddress || "Atelier Pickup",
            city: payment.order.shippingAddress?.city || "Ado-Ekiti",
            state: payment.order.shippingAddress?.state || "Ekiti",
            itemsCount: payment.order.items.length,
          });

          await tx.shipment.create({
            data: {
              orderId: payment.orderId,
              provider: "MANUAL",
              trackingNumber: shipmentDetails.trackingNumber,
              carrierName: shipmentDetails.carrierName,
              status: "PENDING",
              estimatedDelivery: shipmentDetails.estimatedDelivery,
            },
          });
        }
      });

      return NextResponse.redirect(
        `${appUrl}/checkout/confirmation?orderNumber=${payment.order.orderNumber}`
      );
    } else {
      // Mark payment failed if rejected
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: "FAILED" },
      });

      return NextResponse.redirect(
        `${appUrl}/checkout/failed?orderNumber=${payment.order.orderNumber}&reference=${reference}`
      );
    }
  } catch (error) {
    console.error("Payment verification route error:", error);
    return NextResponse.redirect(
      `${appUrl}/checkout?error=verification_exception`
    );
  }
}
