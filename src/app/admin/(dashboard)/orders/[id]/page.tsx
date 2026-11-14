import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatNaira, formatDate } from "@/lib/utils";
import { OrderStatusController } from "@/components/admin/order-status-controller";
import { ArrowLeft, User, MapPin, CreditCard, Package } from "lucide-react";

export const dynamic = "force-dynamic";

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminOrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: true,
      payments: true,
      shipments: true,
      shippingAddress: true,
      customer: true,
    },
  });

  if (!order) {
    notFound();
  }

  const payment = order.payments[0];
  const shipment = order.shipments[0];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Back button */}
      <div>
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-[#262626] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
            Commission Dossier
          </span>
          <h1 className="font-serif-luxury text-3xl font-medium text-white mt-1">
            {order.orderNumber}
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            Placed on {formatDate(order.createdAt)} • Status: {order.status}
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs text-neutral-400 block">Total Amount</span>
          <span className="font-serif-luxury text-2xl font-bold text-[#FAF8F5]">
            {formatNaira(order.totalInKobo)}
          </span>
        </div>
      </div>

      {/* Interactive Controller */}
      <OrderStatusController
        orderId={order.id}
        orderNumber={order.orderNumber}
        initialStatus={order.status}
        initialTracking={shipment?.trackingNumber}
        initialCarrier={shipment?.carrierName}
        customerPhone={order.customerPhone}
        customerName={order.customerName}
      />

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Information */}
        <div className="bg-[#161616] border border-[#27272A] p-6 space-y-4">
          <h3 className="font-serif-luxury text-base font-medium text-white border-b border-[#27272A] pb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-[#C5A880]" />
            <span>Client Profile</span>
          </h3>
          <div className="text-xs text-neutral-300 space-y-2">
            <p>
              <strong className="text-neutral-500 uppercase tracking-wider block text-[10px]">
                Full Name
              </strong>
              {order.customerName}
            </p>
            <p>
              <strong className="text-neutral-500 uppercase tracking-wider block text-[10px]">
                Email Address
              </strong>
              {order.customerEmail}
            </p>
            <p>
              <strong className="text-neutral-500 uppercase tracking-wider block text-[10px]">
                Phone / WhatsApp
              </strong>
              {order.customerPhone}
            </p>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-[#161616] border border-[#27272A] p-6 space-y-4">
          <h3 className="font-serif-luxury text-base font-medium text-white border-b border-[#27272A] pb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#C5A880]" />
            <span>Delivery Destination</span>
          </h3>
          <div className="text-xs text-neutral-300 space-y-2">
            <p>
              <strong className="text-neutral-500 uppercase tracking-wider block text-[10px]">
                Street Address
              </strong>
              {order.shippingAddress?.streetAddress || "Not specified"}
            </p>
            <p>
              <strong className="text-neutral-500 uppercase tracking-wider block text-[10px]">
                City & State
              </strong>
              {order.shippingAddress?.city}, {order.shippingAddress?.state} State
            </p>
            {order.notes && (
              <p>
                <strong className="text-neutral-500 uppercase tracking-wider block text-[10px]">
                  Special Delivery Instructions
                </strong>
                {order.notes}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Items Table Snapshot */}
      <div className="bg-[#161616] border border-[#27272A] p-6 space-y-4">
        <h3 className="font-serif-luxury text-base font-medium text-white border-b border-[#27272A] pb-3 flex items-center gap-2">
          <Package className="h-4 w-4 text-[#C5A880]" />
          <span>Commission Items Snapshot ({order.items.length})</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#27272A] text-neutral-500 uppercase tracking-wider text-[10px]">
                <th className="pb-3">Product Description</th>
                <th className="pb-3">SKU</th>
                <th className="pb-3">Unit Price</th>
                <th className="pb-3">Qty</th>
                <th className="pb-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#222222]">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-3">
                    <strong className="block text-white font-medium">
                      {item.productName}
                    </strong>
                    <span className="text-neutral-400 text-[10px]">
                      {item.variantName || "Standard Variant"}
                    </span>
                  </td>
                  <td className="py-3 font-mono text-neutral-400">{item.sku}</td>
                  <td className="py-3 text-neutral-300">
                    {formatNaira(item.unitPriceInKobo)}
                  </td>
                  <td className="py-3 text-white font-semibold">{item.quantity}</td>
                  <td className="py-3 text-right font-semibold text-white">
                    {formatNaira(item.totalInKobo)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment & Audit Record */}
      <div className="bg-[#161616] border border-[#27272A] p-6 space-y-4">
        <h3 className="font-serif-luxury text-base font-medium text-white border-b border-[#27272A] pb-3 flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-[#C5A880]" />
          <span>Payment Gateway Audit</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-neutral-300">
          <div>
            <span className="text-neutral-500 text-[10px] uppercase block">
              Payment Reference
            </span>
            <span className="font-mono text-white">
              {payment?.reference || "None"}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 text-[10px] uppercase block">
              Provider & Status
            </span>
            <span className="font-semibold text-emerald-400">
              {payment?.provider} • {payment?.status}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 text-[10px] uppercase block">
              Settlement Amount
            </span>
            <span className="font-semibold text-white">
              {formatNaira(payment?.amountInKobo || order.totalInKobo)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
