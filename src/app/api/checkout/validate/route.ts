import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma, withDbRetry } from "@/lib/prisma";
import { shippingService } from "@/lib/shipping";
import { formatNaira } from "@/lib/utils";

const validateCartSchema = z.object({
  state: z.string().min(2),
  discountCode: z.string().optional().nullable(),
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string(),
      quantity: z.number().int().positive(),
    })
  ).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = validateCartSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid cart payload", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { state, discountCode, items } = parsed.data;

    let subtotalInKobo = 0;
    const validatedItems = [];

    // Verify each item against database
    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId, isActive: true },
        include: {
          variants: { where: { id: item.variantId, isActive: true } },
          images: { orderBy: { displayOrder: "asc" }, take: 1 },
        },
      });

      if (!product || product.variants.length === 0) {
        return NextResponse.json(
          { error: `Item not available or variant changed.` },
          { status: 400 }
        );
      }

      const variant = product.variants[0];

      // Stock check if ready-to-wear
      if (!product.isMadeToOrder && variant.stockQuantity < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name} (${variant.name}). Only ${variant.stockQuantity} remaining.`,
          },
          { status: 400 }
        );
      }

      const unitPriceInKobo =
        product.basePriceInKobo + variant.additionalPriceInKobo;
      const totalItemKobo = unitPriceInKobo * item.quantity;
      subtotalInKobo += totalItemKobo;

      validatedItems.push({
        productId: product.id,
        variantId: variant.id,
        productName: product.name,
        variantName: variant.name,
        sku: variant.sku,
        unitPriceInKobo,
        quantity: item.quantity,
        totalInKobo: totalItemKobo,
        imageUrl: product.images[0]?.url || "",
        isMadeToOrder: product.isMadeToOrder,
        leadTimeDays: product.leadTimeDays,
      });
    }

    // Validate discount if supplied
    let discountInKobo = 0;
    let appliedDiscountCode: string | null = null;
    let discountMessage: string | null = null;
    let discountError: string | null = null;

    if (discountCode && discountCode.trim()) {
      const cleanCode = discountCode.trim().toUpperCase();
      const discount = await withDbRetry(() =>
        prisma.discount.findUnique({
          where: { code: cleanCode },
        })
      );

      if (!discount || !discount.isActive) {
        discountError = `Voucher code "${cleanCode}" is invalid or inactive.`;
      } else {
        const isNotExpired =
          !discount.expiresAt || discount.expiresAt > new Date();
        const hasUsesLeft =
          !discount.maxUses || discount.usedCount < discount.maxUses;
        const meetsMinSpend = subtotalInKobo >= discount.minSpendInKobo;

        if (!isNotExpired) {
          discountError = `Voucher "${discount.code}" has expired.`;
        } else if (!hasUsesLeft) {
          discountError = `Voucher "${discount.code}" has reached its maximum redemptions.`;
        } else if (!meetsMinSpend) {
          const diffInKobo = discount.minSpendInKobo - subtotalInKobo;
          discountError = `Voucher "${discount.code}" requires a minimum spend of ${formatNaira(
            discount.minSpendInKobo
          )} (add ${formatNaira(diffInKobo)} more).`;
        } else {
          if (discount.discountPercent) {
            discountInKobo = Math.round(
              (subtotalInKobo * discount.discountPercent) / 100
            );
            discountMessage = `${discount.discountPercent}% off applied! (${formatNaira(
              discountInKobo
            )} saved)`;
          } else if (discount.discountAmountInKobo) {
            discountInKobo = Math.min(
              subtotalInKobo,
              discount.discountAmountInKobo
            );
            discountMessage = `${formatNaira(discountInKobo)} voucher applied!`;
          }
          appliedDiscountCode = discount.code;
        }
      }
    }

    // Calculate shipping rate using shipping service abstraction
    const shippingEstimate = await shippingService.calculateRate(
      state,
      subtotalInKobo
    );
    const shippingFeeInKobo = shippingEstimate.rateInKobo;

    const totalInKobo = Math.max(
      0,
      subtotalInKobo - discountInKobo + shippingFeeInKobo
    );

    return NextResponse.json({
      success: true,
      subtotalInKobo,
      discountInKobo,
      discountCode: appliedDiscountCode,
      discountMessage,
      discountError,
      shippingFeeInKobo,
      totalInKobo,
      shippingEstimate,
      items: validatedItems,
    });
  } catch (error) {
    console.error("Cart validation error:", error);
    return NextResponse.json(
      { error: "Server failed to validate cart prices and inventory." },
      { status: 500 }
    );
  }
}
