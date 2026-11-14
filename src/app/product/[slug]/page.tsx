import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductDetailView } from "@/components/product/product-detail-view";
import { ProductCard } from "@/components/ui/product-card";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-container";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const [product, storeSettings] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: { orderBy: { displayOrder: "asc" } },
        variants: { where: { isActive: true }, orderBy: { stockQuantity: "desc" } },
      },
    }),
    prisma.storeSettings.findUnique({
      where: { id: "default" },
    }),
  ]);

  if (!product || !product.isActive) {
    notFound();
  }

  // Load related products from the same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      id: { not: product.id },
      isActive: true,
    },
    include: {
      category: true,
      images: { orderBy: { displayOrder: "asc" } },
      variants: { where: { isActive: true }, orderBy: { stockQuantity: "desc" } },
    },
    take: 3,
  });

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-8 lg:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-8 flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider">
          <Link href="/" className="hover:text-[#1A1A1A]">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-[#1A1A1A]">
            Collections
          </Link>
          <span>/</span>
          <Link
            href={`/category/${product.category.slug}`}
            className="hover:text-[#1A1A1A]"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-[#1A1A1A] font-medium truncate max-w-xs">
            {product.name}
          </span>
        </div>

        {/* Product Detail Interactive Component */}
        <ProductDetailView
          product={product}
          whatsappNumber={storeSettings?.whatsappNumber}
        />

        {/* Related Creations Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 border-t border-[#E8E3D8] pt-16">
            <div className="mb-8">
              <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6F45]">
                Harmonious Pairings
              </span>
              <h2 className="font-serif-luxury mt-1 text-2xl sm:text-3xl font-normal text-[#1A1A1A]">
                You May Also Consider
              </h2>
            </div>

            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map((rel) => {
                const primaryImg =
                  rel.images.find((i) => i.isPrimary)?.url ||
                  rel.images[0]?.url ||
                  null;
                const secondaryImg = rel.images[1]?.url || null;
                const defaultVariant = rel.variants[0];

                return (
                  <StaggerItem key={rel.id}>
                    <ProductCard
                      id={rel.id}
                      name={rel.name}
                      slug={rel.slug}
                      basePriceInKobo={rel.basePriceInKobo}
                      categoryName={rel.category.name}
                      imageUrl={primaryImg}
                      secondaryImageUrl={secondaryImg}
                      isMadeToOrder={rel.isMadeToOrder}
                      leadTimeDays={rel.leadTimeDays}
                      defaultVariant={defaultVariant}
                    />
                  </StaggerItem>
                );
              })}
            </StaggerContainer>
          </div>
        )}
      </div>
    </div>
  );
}
