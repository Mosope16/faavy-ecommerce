import React from "react";
import Link from "next/link";
import { prisma, withDbRetry } from "@/lib/prisma";
import { formatNaira, formatDate } from "@/lib/utils";
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  AlertTriangle,
  ArrowRight,
  Package,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  // Aggregate real operational metrics from Neon database
  const [
    totalOrdersCount,
    paidOrders,
    pendingFulfillmentCount,
    lowStockVariants,
    recentOrders,
    productsCount,
  ] = await withDbRetry(() =>
    Promise.all([
      prisma.order.count(),
      prisma.order.findMany({
        where: {
          payments: { some: { status: "PAID" } },
        },
        select: { totalInKobo: true },
      }),
      prisma.order.count({
        where: {
          status: { in: ["CONFIRMED", "PROCESSING", "READY_FOR_DISPATCH"] },
        },
      }),
      prisma.productVariant.findMany({
        where: {
          stockQuantity: { lte: 3 },
          product: { isMadeToOrder: false },
        },
        include: { product: true },
        take: 5,
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          payments: true,
          items: true,
        },
      }),
      prisma.product.count({ where: { isActive: true } }),
    ])
  );

  const grossRevenueInKobo = paidOrders.reduce(
    (acc, order) => acc + order.totalInKobo,
    0
  );

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
    <div className="space-y-8">
      {/* Title */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
          Executive Operations
        </span>
        <h1 className="font-serif-luxury text-3xl font-medium text-white mt-1">
          Atelier Overview Dashboard
        </h1>
        <p className="text-xs text-neutral-400 mt-0.5">
          Real-time metrics compiled directly from Neon PostgreSQL transactions.
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-[#161616] border border-[#27272A] p-5 rounded-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Gross Settled Revenue</span>
            <TrendingUp className="h-4 w-4 text-[#C5A880]" />
          </div>
          <span className="font-serif-luxury text-2xl font-bold text-white block">
            {formatNaira(grossRevenueInKobo)}
          </span>
          <p className="text-[10px] text-neutral-500">
            From {paidOrders.length} verified Paystack payments
          </p>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#161616] border border-[#27272A] p-5 rounded-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Total Commissions Placed</span>
            <ShoppingBag className="h-4 w-4 text-[#C5A880]" />
          </div>
          <span className="font-serif-luxury text-2xl font-bold text-white block">
            {totalOrdersCount}
          </span>
          <p className="text-[10px] text-neutral-500">
            {productsCount} active products in catalogue
          </p>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#161616] border border-[#27272A] p-5 rounded-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Pending Fulfillment</span>
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
          <span className="font-serif-luxury text-2xl font-bold text-amber-400 block">
            {pendingFulfillmentCount}
          </span>
          <p className="text-[10px] text-neutral-500">
            Awaiting packaging or dispatch
          </p>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#161616] border border-[#27272A] p-5 rounded-xs space-y-2">
          <div className="flex items-center justify-between text-neutral-400 text-xs">
            <span>Low Stock Alerts</span>
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
          <span className="font-serif-luxury text-2xl font-bold text-rose-400 block">
            {lowStockVariants.length}
          </span>
          <p className="text-[10px] text-neutral-500">
            Variants with stock &le; 3 units
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Orders Table */}
        <div className="lg:col-span-8 bg-[#161616] border border-[#27272A] p-4 sm:p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#27272A] pb-4">
            <h2 className="font-serif-luxury text-base sm:text-lg font-medium text-white">
              Recent Order Commissions
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs text-[#C5A880] hover:underline inline-flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-500">
              No orders have been submitted yet. Store is ready for incoming commissions.
            </div>
          ) : (
            <div className="overflow-x-auto -mx-1 px-1">
              <table className="w-full min-w-[640px] text-left text-xs">
                <thead>
                  <tr className="border-b border-[#27272A] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                    <th className="pb-3">Order Number</th>
                    <th className="pb-3">Customer</th>
                    <th className="pb-3">Date</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Total Amount</th>
                    <th className="pb-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222]">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-[#1C1C1C]">
                      <td className="py-3 font-mono font-medium text-white">
                        {order.orderNumber}
                      </td>
                      <td className="py-3 text-neutral-300">
                        {order.customerName}
                      </td>
                      <td className="py-3 text-neutral-400">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="py-3">
                        <span
                          className={`inline-block border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded-xs ${
                            statusBadgeClasses[order.status] ||
                            "bg-neutral-800 text-neutral-300 border-neutral-700"
                          }`}
                        >
                          {order.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3 font-medium text-[#FAF8F5]">
                        {formatNaira(order.totalInKobo)}
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="text-[#C5A880] hover:underline font-medium"
                        >
                          Inspect →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Low Stock Warning Sidebar */}
        <div className="lg:col-span-4 bg-[#161616] border border-[#27272A] p-6 space-y-4">
          <div className="border-b border-[#27272A] pb-4 flex items-center justify-between">
            <h2 className="font-serif-luxury text-lg font-medium text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <span>Low Inventory Watch</span>
            </h2>
            <Link
              href="/admin/inventory"
              className="text-xs text-[#C5A880] hover:underline"
            >
              Audit All
            </Link>
          </div>

          {lowStockVariants.length === 0 ? (
            <p className="text-xs text-neutral-500 py-6 text-center">
              All variant stock counts are above minimum thresholds.
            </p>
          ) : (
            <div className="divide-y divide-[#262626]">
              {lowStockVariants.map((v) => (
                <div key={v.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <strong className="block text-white font-medium">
                      {v.product.name}
                    </strong>
                    <span className="text-neutral-400">
                      {v.name} • SKU: {v.sku}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800 rounded-xs">
                    {v.stockQuantity} left
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-2">
            <Link
              href="/admin/products/new"
              className="w-full flex items-center justify-center gap-2 bg-[#FAF8F5] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0D0D0D] hover:bg-[#C5A880] transition-colors"
            >
              <Package className="h-4 w-4" />
              <span>Create New Product</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
