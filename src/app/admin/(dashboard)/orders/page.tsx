import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira, formatDate } from "@/lib/utils";
import { ShoppingBag, Search, Filter } from "lucide-react";

export const dynamic = "force-dynamic";

interface OrdersPageProps {
  searchParams: Promise<{
    status?: string;
    search?: string;
  }>;
}

export default async function AdminOrdersPage({ searchParams }: OrdersPageProps) {
  const params = await searchParams;
  const statusFilter = params.status;
  const searchFilter = params.search?.trim();

  const whereClause: Record<string, unknown> = {};
  if (statusFilter) {
    whereClause.status = statusFilter;
  }
  if (searchFilter) {
    whereClause.OR = [
      { orderNumber: { contains: searchFilter, mode: "insensitive" } },
      { customerEmail: { contains: searchFilter, mode: "insensitive" } },
      { customerName: { contains: searchFilter, mode: "insensitive" } },
    ];
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    include: {
      items: true,
      payments: true,
      shipments: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const statuses = [
    "ALL",
    "PENDING_PAYMENT",
    "CONFIRMED",
    "PROCESSING",
    "READY_FOR_DISPATCH",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
  ];

  const statusBadgeClasses: Record<string, string> = {
    PENDING_PAYMENT: "bg-amber-950/80 text-amber-300 border-amber-800",
    CONFIRMED: "bg-blue-950/80 text-blue-300 border-blue-800",
    PROCESSING: "bg-purple-950/80 text-purple-300 border-purple-800",
    READY_FOR_DISPATCH: "bg-indigo-950/80 text-indigo-300 border-indigo-800",
    SHIPPED: "bg-cyan-950/80 text-cyan-300 border-cyan-800",
    DELIVERED: "bg-emerald-950/80 text-emerald-300 border-emerald-800",
    CANCELLED: "bg-rose-950/80 text-rose-300 border-rose-800",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
            Fulfillment Lifecycle
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-white mt-0.5">
            Order Commissions ({orders.length})
          </h1>
          <p className="text-xs text-neutral-400">
            Track and advance customer garments across tailoring and dispatch stages.
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-4 sm:flex-wrap border-b border-[#262626] scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0">
        {statuses.map((st) => {
          const isSelected =
            st === "ALL" ? !statusFilter : statusFilter === st;
          return (
            <Link
              key={st}
              href={st === "ALL" ? "/admin/orders" : `/admin/orders?status=${st}`}
              className={`shrink-0 px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold rounded-xs transition-colors min-h-[36px] flex items-center ${
                isSelected
                  ? "bg-[#C5A880] text-black"
                  : "bg-[#1A1A1A] text-neutral-400 hover:text-white border border-[#2B2B2B]"
              }`}
            >
              {st.replace(/_/g, " ")}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-[#161616] border border-[#27272A] rounded-xs overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-16 text-center text-xs text-neutral-500">
            No orders match the selected filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs">
              <thead>
                <tr className="border-b border-[#27272A] bg-[#1E1E1E] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Order Number</th>
                  <th className="p-4">Client</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Payment</th>
                  <th className="p-4">Total</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {orders.map((order) => {
                  const payment = order.payments[0];
                  return (
                    <tr key={order.id} className="hover:bg-[#1C1C1C]">
                      <td className="p-4 font-mono font-medium text-white">
                        {order.orderNumber}
                      </td>
                      <td className="p-4">
                        <strong className="block text-white">
                          {order.customerName}
                        </strong>
                        <span className="text-neutral-400 text-[10px]">
                          {order.customerEmail} • {order.customerPhone}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-400">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="p-4 text-neutral-300">
                        {order.items.length} {order.items.length === 1 ? "piece" : "pieces"}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-xs ${
                            statusBadgeClasses[order.status] ||
                            "bg-neutral-800 text-neutral-300"
                          }`}
                        >
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`text-[10px] font-bold uppercase ${
                            payment?.status === "PAID"
                              ? "text-emerald-400"
                              : "text-amber-400"
                          }`}
                        >
                          {payment?.status || "PENDING"}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-white">
                        {formatNaira(order.totalInKobo)}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-block bg-[#262626] hover:bg-[#C5A880] hover:text-black text-white px-3 py-1.5 text-[10px] uppercase font-semibold tracking-wider transition-colors rounded-xs"
                        >
                          Manage →
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
