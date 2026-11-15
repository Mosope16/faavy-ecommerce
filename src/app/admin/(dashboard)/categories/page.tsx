import React from "react";
import Link from "next/link";
import { prisma, withDbRetry } from "@/lib/prisma";
import { Layers, Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  let categories: Awaited<ReturnType<typeof prisma.category.findMany<{
    include: { _count: { select: { products: true } } };
  }>>> = [];

  try {
    categories = await withDbRetry(() =>
      prisma.category.findMany({
        include: {
          _count: { select: { products: true } },
        },
        orderBy: { displayOrder: "asc" },
      })
    );
  } catch (error) {
    console.error("[AdminCategoriesPage] Failed to fetch categories:", error);
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#262626] pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
          Department Taxonomy
        </span>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-white mt-0.5">
          Product Categories ({categories.length})
        </h1>
        <p className="text-xs text-neutral-400">
          Organizational structure for corporate wear, accessories, and bespoke services.
        </p>
      </div>

      <div className="bg-[#161616] border border-[#27272A] rounded-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-xs">
            <thead>
              <tr className="border-b border-[#27272A] bg-[#1E1E1E] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-4">Category Name</th>
                <th className="p-4">Slug</th>
                <th className="p-4">Active Pieces</th>
                <th className="p-4">Order</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Storefront</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-[#1C1C1C]">
                  <td className="p-4 text-white font-medium">
                    {cat.name}
                    {cat.description && (
                      <span className="text-[10px] text-neutral-400 block font-normal">
                        {cat.description}
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-mono text-neutral-400 text-[10px]">
                    /{cat.slug}
                  </td>
                  <td className="p-4 text-[#C5A880] font-semibold">
                    {cat._count.products} garments
                  </td>
                  <td className="p-4 text-neutral-400">{cat.displayOrder}</td>
                  <td className="p-4">
                    <span className="text-emerald-400 text-[10px] font-bold uppercase">
                      Active
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Link
                      href={`/category/${cat.slug}`}
                      target="_blank"
                      className="text-[#C5A880] hover:underline"
                    >
                      View ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
