import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatNaira, formatDate } from "@/lib/utils";
import { CheckCircle2, Package, Truck, MessageCircle, ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";

export const dynamic = "force-dynamic";

interface ConfirmationPageProps {
  searchParams: Promise<{
    orderNumber?: string;
  }>;
}

export default async function ConfirmationPage({ searchParams }: ConfirmationPageProps) {
  const { orderNumber } = await searchParams;

  if (!orderNumber) {
    notFound();
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      payments: true,
      shipments: true,
      shippingAddress: true,
    },
  });

  if (!order) {
    notFound();
  }

  const payment = order.payments[0];

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <FadeIn direction="up">
          {/* Header Card */}
          <div className="bg-white border border-[#E8E3D8] p-8 sm:p-12 text-center shadow-lg space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F8EE] text-[#25D366]">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6F45]">
              Commission Confirmed
            </span>

            <h1 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1A1A1A]">
              Thank You for Dressing with FAAVY
            </h1>

            <p className="text-sm text-neutral-600 max-w-md mx-auto font-light leading-relaxed">
              Your order <strong className="text-[#1A1A1A] font-mono">{order.orderNumber}</strong> has been successfully received by our atelier in Oye-Ekiti.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs text-neutral-500">
              <span>Date: {formatDate(order.createdAt)}</span>
              <span>•</span>
              <span>
                Payment:{" "}
                <strong className="text-emerald-700 font-semibold uppercase">
                  {payment?.status || "CONFIRMED"}
                </strong>
              </span>
              <span>•</span>
              <span>Total: {formatNaira(order.totalInKobo)}</span>
            </div>
          </div>
        </FadeIn>

        {/* Order Details Breakdown */}
        <div className="mt-8 bg-white border border-[#E8E3D8] divide-y divide-[#E8E3D8] shadow-sm">
          {/* Destination */}
          <div className="p-6 text-xs text-neutral-600 space-y-1">
            <h3 className="font-serif-luxury text-sm font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2 flex items-center gap-2">
              <Truck className="h-4 w-4 text-[#8C6F45]" />
              <span>Delivery Details</span>
            </h3>
            <p>
              <strong>Recipient:</strong> {order.customerName} ({order.customerPhone})
            </p>
            <p>
              <strong>Address:</strong> {order.shippingAddress?.streetAddress},{" "}
              {order.shippingAddress?.city}, {order.shippingAddress?.state} State
            </p>
            {order.notes && (
              <p>
                <strong>Instructions:</strong> {order.notes}
              </p>
            )}
          </div>

          {/* Items List */}
          <div className="p-6 space-y-3">
            <h3 className="font-serif-luxury text-sm font-semibold uppercase tracking-wider text-[#1A1A1A] mb-2">
              Commission Items ({order.items.length})
            </h3>
            <div className="divide-y divide-[#E8E3D8]">
              {order.items.map((item) => (
                <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                  <div>
                    <h4 className="font-serif-luxury text-sm font-medium text-[#1A1A1A]">
                      {item.productName}
                    </h4>
                    <span className="text-neutral-500">
                      {item.variantName || "Standard"} • Qty: {item.quantity} • SKU: {item.sku}
                    </span>
                  </div>
                  <span className="font-semibold text-sm text-[#1A1A1A]">
                    {formatNaira(item.totalInKobo)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="p-6 bg-[#FAF8F5] space-y-2 text-xs">
            <div className="flex justify-between text-neutral-600">
              <span>Subtotal</span>
              <span>{formatNaira(order.subtotalInKobo)}</span>
            </div>
            {order.discountInKobo > 0 && (
              <div className="flex justify-between text-[#8C6F45]">
                <span>Discount ({order.discountCode})</span>
                <span>-{formatNaira(order.discountInKobo)}</span>
              </div>
            )}
            <div className="flex justify-between text-neutral-600">
              <span>Shipping Fee</span>
              <span>
                {order.shippingFeeInKobo === 0
                  ? "Complimentary"
                  : formatNaira(order.shippingFeeInKobo)}
              </span>
            </div>
            <div className="border-t border-[#E8E3D8] pt-2 flex justify-between font-serif-luxury text-base font-bold text-[#1A1A1A]">
              <span>Total Paid</span>
              <span>{formatNaira(order.totalInKobo)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Link
            href={`/track?orderNumber=${order.orderNumber}`}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1A1A1A] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#C5A880] hover:text-[#121212] transition-colors"
          >
            <Package className="h-4 w-4" />
            <span>Track Order Status</span>
          </Link>

          <Link
            href="/shop"
            className="flex-1 flex items-center justify-center gap-2 border border-[#1A1A1A] bg-transparent px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors"
          >
            <span>Return to Collections</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
