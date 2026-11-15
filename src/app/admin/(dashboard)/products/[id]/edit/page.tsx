import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma, withDbRetry } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { ArrowLeft, ExternalLink, Sparkles } from "lucide-react";

export const dynamic = "force-dynamic";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [categories, product] = await withDbRetry(() =>
    Promise.all([
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        select: { id: true, name: true },
      }),
      prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          images: { orderBy: { displayOrder: "asc" } },
          variants: { orderBy: { createdAt: "asc" } },
        },
      }),
    ])
  );

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>

        <Link
          href={`/product/${product.slug}`}
          target="_blank"
          className="inline-flex items-center gap-1.5 text-xs text-[#C5A880] hover:underline uppercase tracking-wider font-medium"
        >
          <span>View on Storefront</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* Header Banner */}
      <div className="border-b border-[#262626] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
              Atelier Garment Editor
            </span>
            <span className="text-neutral-600">•</span>
            <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
              /{product.slug}
            </span>
          </div>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-white">
            Edit {product.name}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Update garment imagery, pricing, editorial narrative, and variant allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#231E12] border border-[#C5A880]/40 text-[#C5A880] text-[10px] font-semibold uppercase tracking-wider rounded-xs">
              <Sparkles className="h-3 w-3" />
              <span>Featured</span>
            </span>
          )}
          <span
            className={`px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded-xs border ${
              product.isActive
                ? "bg-emerald-950/60 border-emerald-800 text-emerald-400"
                : "bg-neutral-900 border-neutral-700 text-neutral-400"
            }`}
          >
            {product.isActive ? "Active in Catalogue" : "Archived Piece"}
          </span>
        </div>
      </div>

      {/* Form Component */}
      <ProductForm
        categories={categories}
        initialProduct={product}
        isEditing={true}
      />
    </div>
  );
}
