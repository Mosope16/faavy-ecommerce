import React from "react";
import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatNaira, formatDate } from "@/lib/utils";
import { Package, Plus, CheckCircle, XCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { displayOrder: "asc" }, take: 1 },
      variants: { where: { isActive: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
            Catalogue Inventory
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-white mt-0.5">
            Products & Tailored Garments ({products.length})
          </h1>
          <p className="text-xs text-neutral-400">
            Manage corporate wears, variants, SKU allocations, and made-to-order parameters.
          </p>
        </div>

        <div>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 bg-[#FAF8F5] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0D0D0D] hover:bg-[#C5A880] transition-colors rounded-xs shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Garment</span>
          </Link>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#161616] border border-[#27272A] rounded-xs overflow-hidden">
        {products.length === 0 ? (
          <div className="p-16 text-center text-xs text-neutral-500">
            No products found in catalogue.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#27272A] bg-[#1E1E1E] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Piece</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Variants</th>
                  <th className="p-4">Total Stock</th>
                  <th className="p-4">Base Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Storefront</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {products.map((prod) => {
                  const totalStock = prod.variants.reduce(
                    (sum, v) => sum + v.stockQuantity,
                    0
                  );
                  const thumb =
                    prod.images[0]?.url ||
                    "/images/products/suit-double-breasted.jpg";

                  return (
                    <tr key={prod.id} className="hover:bg-[#1C1C1C]">
                      <td className="p-4 flex items-center gap-3">
                        <div className="relative h-12 w-10 shrink-0 bg-[#222222] border border-[#333333] overflow-hidden">
                          <Image
                            src={thumb}
                            alt={prod.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <strong className="block text-white font-medium">
                            {prod.name}
                          </strong>
                          <span className="text-neutral-500 text-[10px] font-mono">
                            /{prod.slug}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-neutral-300">
                        {prod.category.name}
                      </td>
                      <td className="p-4">
                        {prod.isMadeToOrder ? (
                          <span className="text-[10px] uppercase font-bold text-[#C5A880] bg-[#222222] px-2 py-0.5 border border-[#333333]">
                            Made to Order ({prod.leadTimeDays}d)
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase font-bold text-neutral-300 bg-[#1F1F1F] px-2 py-0.5 border border-[#333333]">
                            Ready to Wear
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-neutral-300">
                        {prod.variants.length} sizes/shades
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-semibold ${
                            totalStock <= 3
                              ? "text-rose-400"
                              : totalStock <= 8
                              ? "text-amber-400"
                              : "text-emerald-400"
                          }`}
                        >
                          {totalStock} units
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-white">
                        {formatNaira(prod.basePriceInKobo)}
                      </td>
                      <td className="p-4">
                        {prod.isActive ? (
                          <span className="text-emerald-400 flex items-center gap-1 text-[10px]">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Active
                          </span>
                        ) : (
                          <span className="text-neutral-500 flex items-center gap-1 text-[10px]">
                            <XCircle className="h-3.5 w-3.5" />
                            Archived
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/product/${prod.slug}`}
                          target="_blank"
                          className="text-[#C5A880] hover:underline"
                        >
                          View Piece ↗
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
