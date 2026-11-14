"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Truck, Check, Loader2, AlertCircle } from "lucide-react";

interface ControllerProps {
  orderId: string;
  orderNumber: string;
  initialStatus: string;
  initialTracking?: string | null;
  initialCarrier?: string | null;
  customerPhone: string;
  customerName: string;
}

export function OrderStatusController({
  orderId,
  orderNumber,
  initialStatus,
  initialTracking,
  initialCarrier,
  customerPhone,
  customerName,
}: ControllerProps) {
  const router = useRouter();
  const [status, setStatus] = useState(initialStatus);
  const [trackingNumber, setTrackingNumber] = useState(initialTracking || "");
  const [carrierName, setCarrierName] = useState(
    initialCarrier || "FAAVY Dedicated Logistics"
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          trackingNumber: trackingNumber.trim() || null,
          carrierName: carrierName.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to update order status.");
      } else {
        setSavedSuccess(true);
        router.refresh();
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch {
      setErrorMsg("Network error saving status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const whatsappCustomerUrl = `https://wa.me/${customerPhone.replace(
    /[^0-9]/g,
    ""
  )}?text=${encodeURIComponent(
    `Hello ${customerName}, this is FAAVY Atelier regarding your commission (${orderNumber}). Your order status has been updated to: ${status.replace(
      /_/g,
      " "
    )}.${
      trackingNumber ? ` Tracking number: ${trackingNumber} (${carrierName}).` : ""
    }`
  )}`;

  return (
    <div className="bg-[#161616] border border-[#27272A] p-4 sm:p-6 space-y-6">
      <h3 className="font-serif-luxury text-base sm:text-lg font-medium text-white border-b border-[#27272A] pb-3">
        Lifecycle & Fulfillment Control
      </h3>

      {errorMsg && (
        <div className="bg-rose-950/80 border border-rose-800 p-3 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {savedSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-800 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>Order and shipment status updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
            Order Status Progression
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-hidden min-h-[44px]"
          >
            <option value="PENDING_PAYMENT">PENDING PAYMENT</option>
            <option value="CONFIRMED">CONFIRMED (PAID)</option>
            <option value="PROCESSING">PROCESSING / IN TAILORING</option>
            <option value="READY_FOR_DISPATCH">READY FOR DISPATCH</option>
            <option value="SHIPPED">SHIPPED / IN TRANSIT</option>
            <option value="DELIVERED">DELIVERED TO CLIENT</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              Carrier / Dispatcher Name
            </label>
            <input
              type="text"
              value={carrierName}
              onChange={(e) => setCarrierName(e.target.value)}
              placeholder="e.g. FAAVY Direct or GIG Logistics"
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-hidden min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              Waybill / Tracking Number
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. FAV-TRK-20261114-1234"
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-base sm:text-xs font-mono text-white focus:border-[#C5A880] focus:outline-hidden min-h-[44px]"
            />
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={isUpdating}
            className="flex-1 flex items-center justify-center gap-2 bg-[#FAF8F5] px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#0D0D0D] hover:bg-[#C5A880] transition-colors disabled:bg-neutral-600 min-h-[44px]"
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Fulfillment Changes</span>
            )}
          </button>

          <a
            href={whatsappCustomerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-[#25D366] bg-transparent px-5 py-3 text-xs font-semibold uppercase tracking-wider text-[#25D366] hover:bg-[#25D366]/10 transition-colors min-h-[44px]"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Notify Customer via WhatsApp</span>
          </a>
        </div>
      </form>
    </div>
  );
}
