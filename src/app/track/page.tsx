import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatNaira, formatDate } from "@/lib/utils";
import { Search, Package, Clock, CheckCircle2, AlertCircle, Truck } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

export const dynamic = "force-dynamic";

interface TrackPageProps {
  searchParams: Promise<{
    orderNumber?: string;
  }>;
}

export default async function TrackPage({ searchParams }: TrackPageProps) {
  const params = await searchParams;
  const orderNumber = params.orderNumber?.trim();

  let order = null;
  if (orderNumber) {
    order = await prisma.order.findFirst({
      where: {
        OR: [
          { orderNumber: { equals: orderNumber, mode: "insensitive" } },
          { id: orderNumber },
        ],
      },
      include: {
        items: true,
        payments: true,
        shipments: true,
        shippingAddress: true,
      },
    });
  }

  const statusColors: Record<string, string> = {
    PENDING_PAYMENT: "bg-amber-100 text-amber-900 border-amber-300",
    CONFIRMED: "bg-blue-100 text-blue-900 border-blue-300",
    PROCESSING: "bg-purple-100 text-purple-900 border-purple-300",
    READY_FOR_DISPATCH: "bg-indigo-100 text-indigo-900 border-indigo-300",
    SHIPPED: "bg-cyan-100 text-cyan-900 border-cyan-300",
    DELIVERED: "bg-emerald-100 text-emerald-900 border-emerald-300",
    CANCELLED: "bg-rose-100 text-rose-900 border-rose-300",
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <FadeIn direction="up">
            <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6F45]">
              Real-Time Tracking
            </span>
            <h1 className="font-serif-luxury mt-2 text-3xl sm:text-4xl font-normal text-[#1A1A1A]">
              Track Your Commission
            </h1>
            <p className="text-xs text-neutral-500 font-light">
              Enter your FAAVY order reference to check production, payment, and delivery status.
            </p>
          </FadeIn>
        </div>

        {/* Search Box */}
        <div className="bg-[#F5F2EB] border border-[#E8E3D8] p-6 mb-10 shadow-xs">
          <form method="GET" action="/track" className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-400" />
              <input
                type="text"
                name="orderNumber"
                defaultValue={orderNumber || ""}
                placeholder="e.g. FAV-20261114-1234"
                required
                className="w-full bg-white border border-[#E8E3D8] pl-10 pr-4 py-3 text-xs uppercase tracking-wider text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-hidden"
              />
            </div>
            <button
              type="submit"
              className="bg-[#1A1A1A] px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#C5A880] transition-colors"
            >
              Track Order
            </button>
          </form>
        </div>

        {/* Order Result */}
        {orderNumber && !order && (
          <div className="border border-rose-200 bg-rose-50 p-6 text-center text-rose-800">
            <AlertCircle className="h-6 w-6 mx-auto mb-2 text-rose-600" />
            <h3 className="font-serif-luxury text-base font-semibold">
              Order Reference Not Found
            </h3>
            <p className="mt-1 text-xs text-rose-700">
              We could not find an order matching &ldquo;{orderNumber}&rdquo;. Please verify the reference sent to your confirmation email or WhatsApp concierge.
            </p>
          </div>
        )}

        {order && (
          <div className="bg-white border border-[#E8E3D8] shadow-sm divide-y divide-[#E8E3D8]">
            {/* Order Overview Header */}
            <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F2EB]/50">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6F45]">
                  Order Placed on {formatDate(order.createdAt)}
                </span>
                <h2 className="font-serif-luxury text-xl font-medium text-[#1A1A1A] mt-0.5">
                  {order.orderNumber}
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  Recipient: {order.customerName} ({order.customerEmail})
                </p>
              </div>

              <div>
                <span
                  className={`inline-block border px-3 py-1 text-xs uppercase font-bold tracking-wider ${
                    statusColors[order.status] || "bg-neutral-100 text-neutral-800"
                  }`}
                >
                  {order.status.replace(/_/g, " ")}
                </span>
              </div>
            </div>

            {/* Shipment / Tracking Details */}
            {order.shipments.length > 0 && (
              <div className="p-6 bg-neutral-50/50">
                <h4 className="text-xs uppercase font-bold tracking-wider text-[#1A1A1A] flex items-center gap-2 mb-3">
                  <Truck className="h-4 w-4 text-[#8C6F45]" />
                  <span>Logistics & Dispatch Information</span>
                </h4>
                {order.shipments.map((s) => (
                  <div key={s.id} className="text-xs space-y-1 text-neutral-600">
                    <p>
                      <strong>Carrier:</strong> {s.carrierName || "FAAVY Dedicated Logistics"}
                    </p>
                    {s.trackingNumber && (
                      <p>
                        <strong>Tracking Number:</strong>{" "}
                        <span className="font-mono bg-white px-2 py-0.5 border border-[#E8E3D8]">
                          {s.trackingNumber}
                        </span>
                      </p>
                    )}
                    <p>
                      <strong>Status:</strong> {s.status}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Items List */}
            <div className="p-6 space-y-4">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#1A1A1A]">
                Items in This Commission ({order.items.length})
              </h4>
              <div className="divide-y divide-[#E8E3D8]">
                {order.items.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                    <div>
                      <strong className="block text-sm font-serif-luxury text-[#1A1A1A]">
                        {item.productName}
                      </strong>
                      <span className="text-neutral-500">
                        {item.variantName || "Standard"} • SKU: {item.sku} • Qty: {item.quantity}
                      </span>
                    </div>
                    <span className="font-semibold text-sm text-[#1A1A1A]">
                      {formatNaira(item.totalInKobo)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-6 bg-[#FAF8F5] space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span>{formatNaira(order.subtotalInKobo)}</span>
              </div>
              {order.discountInKobo > 0 && (
                <div className="flex justify-between text-[#8C6F45]">
                  <span>Discount ({order.discountCode || "Promo"})</span>
                  <span>-{formatNaira(order.discountInKobo)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping Delivery Fee</span>
                <span>
                  {order.shippingFeeInKobo === 0
                    ? "Complimentary"
                    : formatNaira(order.shippingFeeInKobo)}
                </span>
              </div>
              <div className="flex justify-between font-serif-luxury text-base font-bold text-[#1A1A1A] border-t border-[#E8E3D8] pt-2">
                <span>Total Amount</span>
                <span>{formatNaira(order.totalInKobo)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
