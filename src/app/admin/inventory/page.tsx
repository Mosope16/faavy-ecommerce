import React from "react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { InventoryAdjustModal } from "@/components/admin/inventory-adjust-modal";
import { Package, History, ArrowDownRight, ArrowUpRight } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const [variants, movements] = await Promise.all([
    prisma.productVariant.findMany({
      include: {
        product: { select: { name: true, slug: true, isMadeToOrder: true } },
      },
      orderBy: [{ stockQuantity: "asc" }, { updatedAt: "desc" }],
    }),
    prisma.inventoryMovement.findMany({
      take: 15,
      orderBy: { createdAt: "desc" },
      include: {
        variant: {
          include: { product: { select: { name: true } } },
        },
      },
    }),
  ]);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="border-b border-[#262626] pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
          Stock Integrity & Audit Log
        </span>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-white mt-0.5">
          Inventory Matrix ({variants.length} Variants)
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Atomic variant-level stock management with immutable movement logs.
        </p>
      </div>

      {/* 1. Variants Stock Matrix */}
      <div className="bg-[#161616] border border-[#27272A] rounded-xs overflow-hidden space-y-4">
        <div className="p-4 border-b border-[#27272A] flex items-center justify-between">
          <h2 className="font-serif-luxury text-base font-medium text-white flex items-center gap-2">
            <Package className="h-4 w-4 text-[#C5A880]" />
            <span>Variant Sizing Matrix</span>
          </h2>
          <span className="text-xs text-neutral-400">
            Ordered by lowest stock first
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#27272A] bg-[#1E1E1E] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-4">Piece</th>
                <th className="p-4">Variant</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Tailoring Mode</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4 text-right">Adjustment</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {variants.map((v) => (
                <tr key={v.id} className="hover:bg-[#1C1C1C]">
                  <td className="p-4 text-white font-medium">
                    {v.product.name}
                  </td>
                  <td className="p-4 text-neutral-300">{v.name}</td>
                  <td className="p-4 font-mono text-neutral-400 text-[10px]">
                    {v.sku}
                  </td>
                  <td className="p-4">
                    {v.product.isMadeToOrder ? (
                      <span className="text-[9px] uppercase font-bold text-[#C5A880] bg-[#222222] px-2 py-0.5 border border-[#333333]">
                        Bespoke
                      </span>
                    ) : (
                      <span className="text-[9px] uppercase font-bold text-neutral-400 bg-[#1A1A1A] px-2 py-0.5">
                        Stocked
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <span
                      className={`font-semibold ${
                        v.stockQuantity <= 3
                          ? "text-rose-400"
                          : v.stockQuantity <= 7
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {v.stockQuantity} units
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <InventoryAdjustModal
                      variant={{
                        id: v.id,
                        name: v.name,
                        sku: v.sku,
                        productName: v.product.name,
                        stockQuantity: v.stockQuantity,
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Immutable Inventory Movements Audit Log */}
      <div className="bg-[#161616] border border-[#27272A] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
          <h2 className="font-serif-luxury text-base font-medium text-white flex items-center gap-2">
            <History className="h-4 w-4 text-[#C5A880]" />
            <span>Immutable Inventory Movement Log (Recent 15 Events)</span>
          </h2>
        </div>

        {movements.length === 0 ? (
          <p className="text-xs text-neutral-500 py-6 text-center">
            No stock adjustments recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#27272A] text-neutral-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3">Garment & Variant</th>
                  <th className="pb-3">Reason</th>
                  <th className="pb-3">Change</th>
                  <th className="pb-3">Notes / Reference</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {movements.map((m) => (
                  <tr key={m.id}>
                    <td className="py-3 text-neutral-400">
                      {formatDate(m.createdAt)}
                    </td>
                    <td className="py-3 text-white">
                      <strong>{m.variant.product.name}</strong>
                      <span className="text-neutral-400 text-[10px] block">
                        {m.variant.name} ({m.variant.sku})
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-[#222222] text-[#C5A880] border border-[#333333] rounded-xs uppercase">
                        {m.reason}
                      </span>
                    </td>
                    <td className="py-3 font-semibold font-mono">
                      {m.quantityChange > 0 ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <ArrowUpRight className="h-3.5 w-3.5" />+
                          {m.quantityChange}
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <ArrowDownRight className="h-3.5 w-3.5" />
                          {m.quantityChange}
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-neutral-400 text-[11px]">
                      {m.notes || m.orderNumber || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
