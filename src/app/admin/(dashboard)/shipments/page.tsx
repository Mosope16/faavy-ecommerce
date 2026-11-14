import React from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { Truck, MapPin, CheckCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminShipmentsPage() {
  const shipments = await prisma.shipment.findMany({
    include: {
      order: {
        include: {
          shippingAddress: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="border-b border-[#262626] pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
          Logistics & Dispatches
        </span>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-white mt-0.5">
          Shipments & Courier Waybills ({shipments.length})
        </h1>
        <p className="text-xs text-neutral-400">
          Monitor deliveries from Oye-Ekiti across all 36 Nigerian states.
        </p>
      </div>

      <div className="bg-[#161616] border border-[#27272A] rounded-xs overflow-hidden">
        {shipments.length === 0 ? (
          <div className="p-16 text-center text-xs text-neutral-500">
            No shipments active yet. Orders generate automatic waybills upon payment.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead>
                <tr className="border-b border-[#27272A] bg-[#1E1E1E] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Tracking Waybill</th>
                  <th className="p-4">Order Ref</th>
                  <th className="p-4">Recipient</th>
                  <th className="p-4">Destination State</th>
                  <th className="p-4">Carrier</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {shipments.map((s) => (
                  <tr key={s.id} className="hover:bg-[#1C1C1C]">
                    <td className="p-4 font-mono font-medium text-[#C5A880]">
                      {s.trackingNumber || "PENDING-ASSIGN"}
                    </td>
                    <td className="p-4 font-mono text-white">
                      {s.order.orderNumber}
                    </td>
                    <td className="p-4">
                      <strong className="block text-white">
                        {s.order.customerName}
                      </strong>
                      <span className="text-neutral-400 text-[10px]">
                        {s.order.customerPhone}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-300">
                      {s.order.shippingAddress?.state || "Ekiti"} State
                    </td>
                    <td className="p-4 text-neutral-300">
                      {s.carrierName || s.provider}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded-xs bg-[#222222] text-neutral-300 border border-[#333333]">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders/${s.orderId}`}
                        className="text-[#C5A880] hover:underline"
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
    </div>
  );
}
