import React from "react";
import { prisma } from "@/lib/prisma";
import { formatNaira, formatDate } from "@/lib/utils";
import { Tag, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDiscountsPage() {
  const discounts = await prisma.discount.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-[#262626] pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
          Promotions & Privileges
        </span>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-white mt-0.5">
          Vouchers & Discount Codes ({discounts.length})
        </h1>
        <p className="text-xs text-neutral-400">
          Executive codes applied during server-side checkout calculations.
        </p>
      </div>

      <div className="bg-[#161616] border border-[#27272A] rounded-xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#27272A] bg-[#1E1E1E] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">Code</th>
              <th className="p-4">Benefit</th>
              <th className="p-4">Min. Spend</th>
              <th className="p-4">Redemptions</th>
              <th className="p-4">Expires</th>
              <th className="p-4 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#222222]">
            {discounts.map((d) => (
              <tr key={d.id} className="hover:bg-[#1C1C1C]">
                <td className="p-4 font-mono font-bold text-[#C5A880]">
                  {d.code}
                </td>
                <td className="p-4 text-white">
                  {d.discountPercent ? `${d.discountPercent}% Off` : ""}
                  {d.discountAmountInKobo
                    ? formatNaira(d.discountAmountInKobo) + " Off"
                    : ""}
                  {d.description && (
                    <span className="text-[10px] text-neutral-400 block font-normal">
                      {d.description}
                    </span>
                  )}
                </td>
                <td className="p-4 text-neutral-300">
                  {formatNaira(d.minSpendInKobo)}
                </td>
                <td className="p-4 text-neutral-300">
                  {d.usedCount} {d.maxUses ? `/ ${d.maxUses}` : "used"}
                </td>
                <td className="p-4 text-neutral-400">
                  {d.expiresAt ? formatDate(d.expiresAt) : "Never"}
                </td>
                <td className="p-4 text-right">
                  {d.isActive ? (
                    <span className="text-emerald-400 text-[10px] uppercase font-bold">
                      Active
                    </span>
                  ) : (
                    <span className="text-neutral-500 text-[10px] uppercase font-bold">
                      Inactive
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
