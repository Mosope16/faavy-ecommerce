import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const adjustSchema = z.object({
  variantId: z.string().min(1),
  quantityChange: z.number().int(), // e.g. +5 or -2
  reason: z.enum(["RESTOCK", "SALE", "DAMAGE", "RETURN", "CORRECTION"]),
  notes: z.string().optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = adjustSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid adjustment payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { variantId, quantityChange, reason, notes } = parsed.data;

    const variant = await prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }

    const newStock = variant.stockQuantity + quantityChange;
    if (newStock < 0) {
      return NextResponse.json(
        {
          error: `Cannot reduce stock below 0. Current stock is ${variant.stockQuantity}, requested change is ${quantityChange}.`,
        },
        { status: 400 }
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const v = await tx.productVariant.update({
        where: { id: variantId },
        data: { stockQuantity: newStock },
      });

      const movement = await tx.inventoryMovement.create({
        data: {
          variantId,
          quantityChange,
          reason,
          notes: notes || `Manual stock adjustment: ${reason}`,
        },
      });

      return { variant: v, movement };
    });

    return NextResponse.json({ success: true, ...updated });
  } catch (error) {
    console.error("Inventory adjustment error:", error);
    return NextResponse.json(
      { error: "Failed to adjust inventory." },
      { status: 500 }
    );
  }
}
