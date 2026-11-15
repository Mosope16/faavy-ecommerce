import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { ProductCard } from "@/components/ui/product-card";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-container";
import { Filter, Search as SearchIcon, X } from "lucide-react";
import { ShopSortSelect } from "@/components/shop/shop-sort-select";

type ShopProduct = Prisma.ProductGetPayload<{
  include: { category: true; images: true; variants: true };
}>;

type ShopCategory = Prisma.CategoryGetPayload<Record<string, never>>;

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{
    category?: string;
    madeToOrder?: string;
    search?: string;
    sort?: string;
  }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const selectedCategory = params.category;
  const isMadeToOrderFilter =
    params.madeToOrder === "true"
      ? true
      : params.madeToOrder === "false"
      ? false
      : undefined;
  const searchQuery = params.search?.trim();
  const sortParam = params.sort || "newest";

  // Build Prisma where filter
  const whereClause: Record<string, unknown> = {
    isActive: true,
  };

  if (selectedCategory) {
    whereClause.category = { slug: selectedCategory };
  }

  if (isMadeToOrderFilter !== undefined) {
    whereClause.isMadeToOrder = isMadeToOrderFilter;
  }

  if (searchQuery) {
    whereClause.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } },
      { details: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  // Sorting logic
  let orderBy: Record<string, "asc" | "desc"> = { createdAt: "desc" };
  if (sortParam === "price-low") {
    orderBy = { basePriceInKobo: "asc" };
  } else if (sortParam === "price-high") {
    orderBy = { basePriceInKobo: "desc" };
  }

  let products: ShopProduct[] = [];
  let categories: ShopCategory[] = [];

  try {
    [products, categories] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        include: {
          category: true,
          images: { orderBy: { displayOrder: "asc" } },
          variants: { where: { isActive: true }, orderBy: { stockQuantity: "desc" } },
        },
        orderBy,
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
      }),
    ]);
  } catch (err) {
    console.error("[ShopPage] Database fetch failed:", err);
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header Title */}
        <div className="border-b border-[#E8E3D8] pb-8 mb-8">
          <FadeIn direction="up">
            <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6F45]">
              Atelier Collections
            </span>
            <h1 className="font-serif-luxury mt-2 text-4xl sm:text-5xl font-normal text-[#1A1A1A]">
              {selectedCategory
                ? categories.find((c) => c.slug === selectedCategory)?.name ||
                  "Selected Collection"
                : "The Complete Corporate Edit"}
            </h1>
            <p className="mt-2 text-sm text-neutral-600 max-w-2xl font-light">
              Meticulously tailored executive suits, corporate gowns, shirts, pleated trousers, and bespoke accessories. Handcrafted in Nigeria with integer-level precision.
            </p>
          </FadeIn>
        </div>

        {/* Filter & Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 sm:gap-6 bg-[#F5F2EB] border border-[#E8E3D8] p-3 sm:p-5 mb-8 sm:mb-10">
          {/* Categories Pill Bar - Horizontally scrollable on mobile */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 sm:pb-0 sm:flex-wrap scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0">
            <Link
              href={`/shop${sortParam !== "newest" ? `?sort=${sortParam}` : ""}`}
              className={`shrink-0 px-3.5 py-2 text-xs uppercase tracking-wider transition-colors min-h-[36px] flex items-center ${
                !selectedCategory
                  ? "bg-[#1A1A1A] text-white font-semibold"
                  : "bg-white text-neutral-700 border border-[#E8E3D8] hover:border-[#1A1A1A]"
              }`}
            >
              All Pieces
            </Link>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}${
                    sortParam !== "newest" ? `&sort=${sortParam}` : ""
                  }`}
                  className={`shrink-0 px-3.5 py-2 text-xs uppercase tracking-wider transition-colors min-h-[36px] flex items-center ${
                    isSelected
                      ? "bg-[#1A1A1A] text-white font-semibold"
                      : "bg-white text-neutral-700 border border-[#E8E3D8] hover:border-[#1A1A1A]"
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>

          {/* Availability & Sorting Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-2 sm:pt-0 border-t border-[#E8E3D8]/60 lg:border-t-0">
            <Link
              href={`/shop?${new URLSearchParams({
                ...(selectedCategory ? { category: selectedCategory } : {}),
                ...(isMadeToOrderFilter !== true ? { madeToOrder: "true" } : {}),
                ...(sortParam !== "newest" ? { sort: sortParam } : {}),
              }).toString()}`}
              className={`px-3 py-2 text-xs uppercase tracking-wider border transition-colors min-h-[36px] flex items-center ${
                isMadeToOrderFilter === true
                  ? "bg-[#8C6F45] text-white border-[#8C6F45] font-semibold"
                  : "bg-white text-neutral-700 border-[#E8E3D8] hover:border-[#8C6F45]"
              }`}
            >
              Made to Order
            </Link>

            <Link
              href={`/shop?${new URLSearchParams({
                ...(selectedCategory ? { category: selectedCategory } : {}),
                ...(isMadeToOrderFilter !== false ? { madeToOrder: "false" } : {}),
                ...(sortParam !== "newest" ? { sort: sortParam } : {}),
              }).toString()}`}
              className={`px-3 py-2 text-xs uppercase tracking-wider border transition-colors min-h-[36px] flex items-center ${
                isMadeToOrderFilter === false
                  ? "bg-[#1A1A1A] text-white border-[#1A1A1A] font-semibold"
                  : "bg-white text-neutral-700 border-[#E8E3D8] hover:border-[#1A1A1A]"
              }`}
            >
              Ready to Wear
            </Link>

            {/* Sort Dropdown */}
            <ShopSortSelect currentSort={sortParam} />

            {/* Clear Filters Reset */}
            {(selectedCategory ||
              isMadeToOrderFilter !== undefined ||
              searchQuery ||
              sortParam !== "newest") && (
              <Link
                href="/shop"
                className="inline-flex items-center gap-1 px-2.5 py-2 text-xs text-red-700 hover:underline min-h-[36px]"
              >
                <X className="h-3.5 w-3.5" />
                <span>Reset</span>
              </Link>
            )}
          </div>
        </div>

        {/* Results Metadata */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-6">
          <span>
            Showing <strong className="text-[#1A1A1A]">{products.length}</strong>{" "}
            distinguished {products.length === 1 ? "piece" : "pieces"}
          </span>
          {searchQuery && (
            <span>
              Search query: &ldquo;
              <strong className="text-[#1A1A1A]">{searchQuery}</strong>&rdquo;
            </span>
          )}
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="border border-[#E8E3D8] bg-[#F5F2EB] py-20 px-4 text-center">
            <h3 className="font-serif-luxury text-xl font-medium text-[#1A1A1A]">
              No creations found
            </h3>
            <p className="mt-2 text-sm text-neutral-500 max-w-sm mx-auto">
              We could not find any garments matching your current filter criteria.
            </p>
            <div className="mt-6">
              <Link
                href="/shop"
                className="inline-block bg-[#1A1A1A] px-6 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#C5A880] transition-colors"
              >
                Clear Filters
              </Link>
            </div>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 min-[360px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {products.map((product) => {
              const primaryImg =
                product.images.find((i) => i.isPrimary)?.url ||
                product.images[0]?.url ||
                null;
              const secondaryImg =
                product.images[1]?.url || null;
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
