import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const updateStatusSchema = z.object({
  status: z.enum([
    "PENDING_PAYMENT",
    "CONFIRMED",
    "PROCESSING",
    "READY_FOR_DISPATCH",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ]),
  trackingNumber: z.string().optional().nullable(),
  carrierName: z.string().optional().nullable(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid status update payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { status, trackingNumber, carrierName } = parsed.data;

    const order = await prisma.order.findUnique({
      where: { id },
      include: { shipments: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Update order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    // Update or create shipment details if tracking provided
    if (trackingNumber || carrierName) {
      const existingShipment = order.shipments[0];
      if (existingShipment) {
        await prisma.shipment.update({
          where: { id: existingShipment.id },
          data: {
            trackingNumber: trackingNumber || existingShipment.trackingNumber,
            carrierName: carrierName || existingShipment.carrierName,
            status:
              status === "DELIVERED"
                ? "DELIVERED"
                : status === "SHIPPED"
                ? "IN_TRANSIT"
                : existingShipment.status,
            deliveredAt: status === "DELIVERED" ? new Date() : undefined,
            dispatchedAt: status === "SHIPPED" ? new Date() : undefined,
          },
        });
      } else {
        await prisma.shipment.create({
          data: {
            orderId: order.id,
            trackingNumber,
            carrierName: carrierName || "FAAVY Dedicated Logistics",
            status: status === "SHIPPED" ? "IN_TRANSIT" : "PENDING",
            dispatchedAt: status === "SHIPPED" ? new Date() : undefined,
          },
        });
      }
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json(
      { error: "Failed to update order status." },
      { status: 500 }
    );
  }
}
