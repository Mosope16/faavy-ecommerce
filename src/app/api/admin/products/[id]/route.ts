import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma, withDbRetry } from "@/lib/prisma";

const updateProductSchema = z.object({
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
        id: z.string().optional(),
        url: z.string().min(1),
        publicId: z.string().optional().nullable(),
        altText: z.string().optional().nullable(),
        isPrimary: z.boolean().default(false),
      })
    )
    .optional(),
  variants: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(1),
        sku: z.string().min(2),
        size: z.string().optional().nullable(),
        color: z.string().optional().nullable(),
        stockQuantity: z.number().int().default(0),
        additionalPriceInKobo: z.number().int().default(0),
        isActive: z.boolean().default(true),
      })
    )
    .min(1, "At least one variant must be defined"),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

// GET: Fetch single product details for admin
export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const product = await withDbRetry(() =>
      prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: { orderBy: { displayOrder: "asc" } },
          variants: { orderBy: { createdAt: "asc" } },
        },
      })
    );

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Admin fetch product error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve product details." },
      { status: 500 }
    );
  }
}

// PUT: Update existing product, its images, and variants
export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await req.json();
    const parsed = updateProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.format() },
        { status: 400 }
      );
    }

    // Verify existing product exists
    const existing = await withDbRetry(() =>
      prisma.product.findUnique({
        where: { id },
        include: { variants: true, images: true },
      })
    );

    if (!existing) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    const { images = [], variants, ...prodData } = parsed.data;

    // Check slug collision with any other product
    if (prodData.slug !== existing.slug) {
      const slugConflict = await withDbRetry(() =>
        prisma.product.findFirst({
          where: {
            slug: prodData.slug,
            id: { not: id },
          },
        })
      );
      if (slugConflict) {
        return NextResponse.json(
          { error: `The slug "${prodData.slug}" is already used by another piece.` },
          { status: 400 }
        );
      }
    }

    // Check SKU collisions with other products' variants
    for (const v of variants) {
      const skuConflict = await withDbRetry(() =>
        prisma.productVariant.findFirst({
          where: {
            sku: v.sku,
            productId: { not: id },
          },
        })
      );
      if (skuConflict) {
        return NextResponse.json(
          { error: `SKU "${v.sku}" is already assigned to a variant of another product.` },
          { status: 400 }
        );
      }
    }

    // Perform atomic update inside transaction with extended timeout for serverless latency
    const updatedProduct = await prisma.$transaction(
      async (tx) => {
        // 1. Update basic product info
        await tx.product.update({
          where: { id },
          data: {
            ...prodData,
            updatedAt: new Date(),
          },
        });

        // 2. Refresh Images: replace existing images with the new set
        await tx.productImage.deleteMany({
          where: { productId: id },
        });

        if (images.length > 0) {
          await tx.productImage.createMany({
            data: images.map((img, idx) => ({
              productId: id,
              url: img.url,
              publicId: img.publicId || null,
              altText: img.altText || prodData.name,
              isPrimary: img.isPrimary ?? idx === 0,
              displayOrder: idx,
            })),
          });
        }

        // 3. Update Variants & Inventory Movements in parallel
        const existingVariantIds = new Set(existing.variants.map((v) => v.id));
        const submittedVariantIds = new Set(
          variants.map((v) => v.id).filter(Boolean) as string[]
        );

        const variantOperations: Promise<unknown>[] = [];

        // Deactivate variants removed in form
        for (const ev of existing.variants) {
          if (!submittedVariantIds.has(ev.id)) {
            variantOperations.push(
              tx.productVariant.update({
                where: { id: ev.id },
                data: { isActive: false },
              })
            );
          }
        }

        // Update existing or create new variants
        for (const v of variants) {
          if (v.id && existingVariantIds.has(v.id)) {
            const oldVar = existing.variants.find((item) => item.id === v.id);
            const stockDelta = v.stockQuantity - (oldVar?.stockQuantity || 0);

            variantOperations.push(
              tx.productVariant.update({
                where: { id: v.id },
                data: {
                  name: v.name,
                  sku: v.sku,
                  size: v.size || null,
                  color: v.color || null,
                  stockQuantity: v.stockQuantity,
                  additionalPriceInKobo: v.additionalPriceInKobo,
                  isActive: v.isActive ?? true,
                },
              })
            );

            if (stockDelta !== 0) {
              variantOperations.push(
                tx.inventoryMovement.create({
                  data: {
                    variantId: v.id,
                    quantityChange: stockDelta,
                    reason: stockDelta > 0 ? "RESTOCK" : "CORRECTION",
                    notes: `Stock adjusted from ${oldVar?.stockQuantity} to ${v.stockQuantity} by admin editor`,
                  },
                })
              );
            }
          } else {
            // New variant added during edit
            variantOperations.push(
              (async () => {
                const createdVar = await tx.productVariant.create({
                  data: {
                    productId: id,
                    name: v.name,
                    sku: v.sku,
                    size: v.size || null,
                    color: v.color || null,
                    stockQuantity: v.stockQuantity,
                    additionalPriceInKobo: v.additionalPriceInKobo,
                    isActive: v.isActive ?? true,
                  },
                });

                if (v.stockQuantity > 0) {
                  await tx.inventoryMovement.create({
                    data: {
                      variantId: createdVar.id,
                      quantityChange: v.stockQuantity,
                      reason: "RESTOCK",
                      notes: "Initial inventory allocation for newly added variant",
                    },
                  });
                }
              })()
            );
          }
        }

        await Promise.all(variantOperations);

        // Return refreshed full product
        return tx.product.findUnique({
          where: { id },
          include: {
            category: true,
            images: { orderBy: { displayOrder: "asc" } },
            variants: { orderBy: { createdAt: "asc" } },
          },
        });
      },
      {
        maxWait: 15000, // 15 seconds to check out connection
        timeout: 30000, // 30 seconds for entire transaction execution
      }
    );

    return NextResponse.json({
      success: true,
      message: "Garment and images updated successfully.",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Admin update product error:", error);
    return NextResponse.json(
      { error: "Failed to update product details." },
      { status: 500 }
    );
  }
}

// DELETE: Permanently delete or archive product
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const isArchive = req.nextUrl.searchParams.get("archive") === "true";

    if (isArchive) {
      await withDbRetry(() =>
        prisma.product.update({
          where: { id },
          data: { isActive: false },
        })
      );

      return NextResponse.json({
        success: true,
        message: "Garment archived from storefront successfully.",
      });
    }

    // Permanent cascade delete: deletes variants, inventory movements, and imagery
    await withDbRetry(() =>
      prisma.product.delete({
        where: { id },
      })
    );

    return NextResponse.json({
      success: true,
      message: "Garment deleted permanently from catalogue.",
    });
  } catch (error) {
    console.error("Admin delete product error:", error);
    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
