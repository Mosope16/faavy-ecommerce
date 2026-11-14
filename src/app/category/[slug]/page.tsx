import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ui/product-card";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-container";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
    include: {
      products: {
        where: { isActive: true },
        include: {
          category: true,
          images: { orderBy: { displayOrder: "asc" } },
          variants: { where: { isActive: true }, orderBy: { stockQuantity: "desc" } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!category) {
    notFound();
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back */}
        <div className="mb-6">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 hover:text-[#1A1A1A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Return to All Collections</span>
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-[#E8E3D8] pb-8 mb-10">
          <FadeIn direction="up">
            <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6F45]">
              Category Catalogue
            </span>
            <h1 className="font-serif-luxury mt-2 text-4xl sm:text-5xl font-normal text-[#1A1A1A]">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-2 text-sm text-neutral-600 max-w-2xl font-light leading-relaxed">
                {category.description}
              </p>
            )}
          </FadeIn>
        </div>

        {/* Products Grid */}
        {category.products.length === 0 ? (
          <div className="border border-[#E8E3D8] bg-[#F5F2EB] py-20 px-4 text-center">
            <h3 className="font-serif-luxury text-xl font-medium text-[#1A1A1A]">
              No pieces in this collection yet
            </h3>
            <p className="mt-2 text-sm text-neutral-500 max-w-sm mx-auto">
              Our atelier is actively tailoring new commissions for this department.
            </p>
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-block bg-[#1A1A1A] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#C5A880] transition-colors"
              >
                Browse Other Collections
              </Link>
            </div>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {category.products.map((product) => {
              const primaryImg =
                product.images.find((i) => i.isPrimary)?.url ||
                product.images[0]?.url ||
                "/images/products/suit-double-breasted.jpg";
              const secondaryImg =
                product.images[1]?.url || primaryImg;
              const defaultVariant = product.variants[0];

              return (
                <StaggerItem key={product.id}>
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    basePriceInKobo={product.basePriceInKobo}
                    categoryName={product.category.name}
                    imageUrl={primaryImg}
                    secondaryImageUrl={secondaryImg}
                    isMadeToOrder={product.isMadeToOrder}
                    leadTimeDays={product.leadTimeDays}
                    defaultVariant={defaultVariant}
                  />
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
