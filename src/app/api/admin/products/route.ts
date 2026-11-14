import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(5),
  details: z.string().optional().nullable(),
  careInstructions: z.string().optional().nullable(),
  categoryId: z.string().min(1),
  basePriceInKobo: z.number().int().positive(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isMadeToOrder: z.boolean().default(false),
  leadTimeDays: z.number().int().default(0),
  images: z
    .array(
      z.object({
        url: z.string().min(1),
        altText: z.string().optional().nullable(),
        isPrimary: z.boolean().default(false),
      })
    )
    .optional(),
  variants: z
    .array(
      z.object({
        name: z.string().min(1),
        sku: z.string().min(2),
        size: z.string().optional().nullable(),
        color: z.string().optional().nullable(),
        stockQuantity: z.number().int().default(0),
        additionalPriceInKobo: z.number().int().default(0),
      })
    )
    .min(1, "At least one variant must be defined"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = productSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { images, variants, ...prodData } = parsed.data;

    // Check slug collision
    const existingSlug = await prisma.product.findUnique({
      where: { slug: prodData.slug },
    });
    if (existingSlug) {
      return NextResponse.json(
        { error: `Product slug "${prodData.slug}" is already in use.` },
        { status: 400 }
      );
    }

    // Check SKU collisions
    for (const v of variants) {
      const existingSku = await prisma.productVariant.findUnique({
        where: { sku: v.sku },
      });
      if (existingSku) {
        return NextResponse.json(
          { error: `SKU "${v.sku}" is already assigned to another variant.` },
          { status: 400 }
        );
      }
    }

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          ...prodData,
          images: {
            create: (images || []).map((img, idx) => ({
              url: img.url,
              altText: img.altText,
              isPrimary: img.isPrimary,
              displayOrder: idx,
            })),
          },
          variants: {
            create: variants.map((v) => ({
              ...v,
            })),
          },
        },
        include: {
          variants: true,
          images: true,
          category: true,
        },
      });

      // Record initial inventory movements
      for (const v of created.variants) {
        if (v.stockQuantity > 0) {
          await tx.inventoryMovement.create({
            data: {
              variantId: v.id,
              quantityChange: v.stockQuantity,
              reason: "RESTOCK",
              notes: "Initial inventory allocation on product creation",
            },
          });
        }
      }

      return created;
    });

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Product creation error:", error);
    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}
