import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paystack } from "@/lib/paystack";
import { shippingService } from "@/lib/shipping";

export async function POST(req: NextRequest) {
  try {
    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
      return NextResponse.json(
        { error: "Missing Paystack webhook signature header" },
        { status: 401 }
      );
    }

    const rawBody = await req.text();

    // Verify cryptographic HMAC-SHA512 signature
    const isValidSignature = paystack.verifyWebhookSignature(signature, rawBody);
    if (!isValidSignature) {
      console.warn("Invalid Paystack webhook signature rejected.");
      return NextResponse.json(
        { error: "Invalid cryptographic signature" },
        { status: 401 }
      );
    }

    const event = JSON.parse(rawBody);

    // Idempotent handling of 'charge.success'
    if (event.event === "charge.success") {
      const { reference, channel, paid_at, amount } = event.data;

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
        console.warn(`Payment record with reference ${reference} not found in database.`);
        return NextResponse.json({ received: true });
      }

      // IDEMPOTENCY CHECK: If already marked PAID, return 200 without duplicate action
      if (payment.status === "PAID") {
        return NextResponse.json({
          received: true,
          message: "Payment already processed idempotently.",
        });
      }

      // Verify that amount matches expected order amount
      if (payment.amountInKobo !== amount) {
        console.error(
          `Amount mismatch for payment ${reference}: expected ${payment.amountInKobo}, received ${amount}`
        );
        return NextResponse.json(
          { error: "Amount mismatch detected" },
          { status: 400 }
        );
      }

      // Execute status update inside transaction
      await prisma.$transaction(async (tx) => {
        await tx.payment.update({
          where: { id: payment.id },
          data: {
            status: "PAID",
            channel: channel || "card",
            paidAt: paid_at ? new Date(paid_at) : new Date(),
            rawPayload: event.data,
          },
        });

        await tx.order.update({
          where: { id: payment.orderId },
          data: {
            status: "CONFIRMED",
          },
        });

        // Ensure shipment record exists
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

      console.log(`Payment and Order successfully confirmed for reference: ${reference}`);
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error during webhook processing" },
      { status: 500 }
    );
  }
}
