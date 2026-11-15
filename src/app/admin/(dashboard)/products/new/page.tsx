import React from "react";
import Link from "next/link";
import { prisma, withDbRetry } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  let categories: Array<{ id: string; name: string }> = [];
  try {
    categories = await withDbRetry(() =>
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        select: { id: true, name: true },
      })
    );
  } catch (error) {
    console.error("[NewProductPage] Failed to fetch categories:", error);
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Products</span>
        </Link>
      </div>

      <div className="border-b border-[#262626] pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
          New Atelier Commission
        </span>
        <h1 className="font-serif-luxury text-3xl font-medium text-white mt-1">
          Create New Garment
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Enter product information, multi-variant sizing matrix, and stock levels.
        </p>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
