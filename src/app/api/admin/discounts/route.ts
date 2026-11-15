import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma, withDbRetry } from "@/lib/prisma";

const createDiscountSchema = z.object({
  code: z
    .string()
    .min(2, "Code must be at least 2 characters")
    .max(30, "Code cannot exceed 30 characters"),
  description: z.string().optional().nullable(),
  discountType: z.enum(["PERCENT", "FIXED"]),
  discountValue: z.number().positive("Discount value must be greater than 0"),
  minSpendNaira: z.number().min(0).default(0),
  maxUses: z.number().int().positive().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createDiscountSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const {
      code,
      description,
      discountType,
      discountValue,
      minSpendNaira,
      maxUses,
      expiresAt,
      isActive,
    } = parsed.data;

    const cleanCode = code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "");

    // Check if code already exists
    const existing = await withDbRetry(() =>
      prisma.discount.findUnique({
        where: { code: cleanCode },
      })
    );

    if (existing) {
      return NextResponse.json(
        { error: `Voucher code "${cleanCode}" already exists in catalogue.` },
        { status: 400 }
      );
    }

    const discountPercent =
      discountType === "PERCENT" ? Math.min(100, Math.round(discountValue)) : null;
    const discountAmountInKobo =
      discountType === "FIXED" ? Math.round(discountValue * 100) : null;
    const minSpendInKobo = Math.round((minSpendNaira || 0) * 100);

    const discount = await withDbRetry(() =>
      prisma.discount.create({
        data: {
          code: cleanCode,
          description: description?.trim() || null,
          discountPercent,
          discountAmountInKobo,
          minSpendInKobo,
          maxUses: maxUses || null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          isActive,
        },
      })
    );

    return NextResponse.json({ success: true, discount }, { status: 201 });
  } catch (error) {
    console.error("Admin create discount error:", error);
    return NextResponse.json(
      { error: "Server failed to create voucher code in database." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, isActive } = body;

    if (!id || typeof isActive !== "boolean") {
      return NextResponse.json(
        { error: "Missing required fields: id, isActive" },
        { status: 400 }
      );
    }

    const updated = await withDbRetry(() =>
      prisma.discount.update({
        where: { id },
        data: { isActive },
      })
    );

    return NextResponse.json({ success: true, discount: updated });
  } catch (error) {
    console.error("Admin toggle discount error:", error);
    return NextResponse.json(
      { error: "Failed to update voucher status." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing discount id in query params" },
        { status: 400 }
      );
    }

    await withDbRetry(() =>
      prisma.discount.delete({
        where: { id },
      })
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin delete discount error:", error);
    return NextResponse.json(
      { error: "Failed to delete voucher code." },
      { status: 500 }
    );
  }
}
