"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, Loader2, AlertCircle, Check } from "lucide-react";

interface VariantInfo {
  id: string;
  name: string;
  sku: string;
  productName: string;
  stockQuantity: number;
}

export function InventoryAdjustModal({ variant }: { variant: VariantInfo }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [quantityChange, setQuantityChange] = useState<number>(5);
  const [reason, setReason] = useState<
    "RESTOCK" | "SALE" | "DAMAGE" | "RETURN" | "CORRECTION"
  >("RESTOCK");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const effectiveChange =
      reason === "DAMAGE" || reason === "SALE"
        ? -Math.abs(quantityChange)
        : Math.abs(quantityChange);

    try {
      const res = await fetch("/api/admin/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: variant.id,
          quantityChange: effectiveChange,
          reason,
          notes: notes.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to adjust stock.");
        setIsSubmitting(false);
      } else {
        setIsOpen(false);
        router.refresh();
      }
    } catch {
      setErrorMsg("Network error saving adjustment.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-[#262626] hover:bg-[#C5A880] hover:text-black text-white px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-xs transition-colors"
      >
        Adjust Stock
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-xs"
          />
          <div className="relative z-10 w-full max-w-md bg-[#161616] border border-[#27272A] p-6 shadow-2xl text-white space-y-4">
            <div className="flex justify-between items-start border-b border-[#27272A] pb-3">
              <div>
                <h3 className="font-serif-luxury text-lg font-medium text-white">
                  Adjust Inventory
                </h3>
                <p className="text-xs text-neutral-400">
                  {variant.productName} ({variant.name})
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-500 hover:text-white"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="bg-rose-950/80 border border-rose-800 p-3 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-[#1F1F1F] p-3 text-xs border border-[#333333] flex justify-between items-center">
                <span className="text-neutral-400">Current Stock Quantity:</span>
                <span className="font-semibold text-white font-mono text-sm">
                  {variant.stockQuantity} units
                </span>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                  Reason for Movement *
                </label>
                <select
                  value={reason}
                  onChange={(e) =>
                    setReason(e.target.value as typeof reason)
                  }
                  className="w-full bg-[#1F1F1F] border border-[#333333] p-2.5 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
                >
                  <option value="RESTOCK">RESTOCK (+ Addition)</option>
                  <option value="RETURN">RETURN (+ Customer Return)</option>
                  <option value="DAMAGE">DAMAGE (- Defective / Scrapped)</option>
                  <option value="SALE">SALE (- Offline Walk-in / Direct)</option>
                  <option value="CORRECTION">CORRECTION (Audit Correction)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                  Quantity Units (Count) *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantityChange}
                  onChange={(e) =>
                    setQuantityChange(Math.max(1, parseInt(e.target.value, 10) || 1))
                  }
                  className="w-full bg-[#1F1F1F] border border-[#333333] p-2.5 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                  Audit Notes / Reason Reference
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Received new roll of Italian Super 140s"
                  className="w-full bg-[#1F1F1F] border border-[#333333] p-2.5 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex-1 border border-[#333333] bg-transparent py-2.5 text-xs uppercase font-semibold text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#FAF8F5] py-2.5 text-xs uppercase font-semibold text-[#0D0D0D] hover:bg-[#C5A880] transition-colors disabled:bg-neutral-600"
                >
                  {isSubmitting ? "Saving..." : "Commit Movement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
