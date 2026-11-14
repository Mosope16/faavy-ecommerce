import React from "react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Users, Mail, Phone } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const customers = await prisma.customer.findMany({
    include: {
      _count: { select: { orders: true } },
      orders: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-[#262626] pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
          Client Relationship Directory
        </span>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-white mt-0.5">
          Clients & Patrons ({customers.length})
        </h1>
        <p className="text-xs text-neutral-400">
          Executive clients who have commissioned bespoke garments or made guest purchases.
        </p>
      </div>

      <div className="bg-[#161616] border border-[#27272A] rounded-xs overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-16 text-center text-xs text-neutral-500">
            No client records registered yet. Guest orders populate customer records automatically.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-xs">
              <thead>
                <tr className="border-b border-[#27272A] bg-[#1E1E1E] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Client Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone / WhatsApp</th>
                  <th className="p-4">Commissions</th>
                  <th className="p-4">Last Order</th>
                  <th className="p-4 text-right">Client Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-[#1C1C1C]">
                    <td className="p-4 font-medium text-white">
                      {c.fullName}
                    </td>
                    <td className="p-4 text-neutral-300">{c.email}</td>
                    <td className="p-4 text-neutral-400 font-mono">
                      {c.phone}
                    </td>
                    <td className="p-4 font-semibold text-[#C5A880]">
                      {c._count.orders} orders
                    </td>
                    <td className="p-4 text-neutral-400">
                      {c.orders[0] ? formatDate(c.orders[0].createdAt) : "—"}
                    </td>
                    <td className="p-4 text-right text-neutral-500">
                      {formatDate(c.createdAt)}
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
