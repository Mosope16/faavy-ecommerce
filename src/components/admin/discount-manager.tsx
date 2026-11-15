"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { formatNaira, formatDate } from "@/lib/utils";
import {
  Tag,
  Plus,
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  X,
  AlertCircle,
  Percent,
  DollarSign,
} from "lucide-react";

export interface DiscountRecord {
  id: string;
  code: string;
  description: string | null;
  discountPercent: number | null;
  discountAmountInKobo: number | null;
  minSpendInKobo: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: Date | string | null;
  isActive: boolean;
  createdAt: Date | string;
}

interface DiscountManagerProps {
  initialDiscounts: DiscountRecord[];
}

export function DiscountManager({ initialDiscounts }: DiscountManagerProps) {
  const router = useRouter();

  const [discounts, setDiscounts] = useState<DiscountRecord[]>(initialDiscounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENT" | "FIXED">("PERCENT");
  const [discountValue, setDiscountValue] = useState("");
  const [minSpendNaira, setMinSpendNaira] = useState("");
  const [maxUses, setMaxUses] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Toggle active/inactive
  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/admin/discounts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !currentStatus }),
      });

      if (res.ok) {
        setDiscounts((prev) =>
          prev.map((d) => (d.id === id ? { ...d, isActive: !currentStatus } : d))
        );
        router.refresh();
      }
    } catch (err) {
      console.error("Toggle discount status error:", err);
    }
  };

  // Delete discount
  const handleDelete = async (id: string, codeName: string) => {
    if (!window.confirm(`Are you sure you want to delete voucher "${codeName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/discounts?id=${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setDiscounts((prev) => prev.filter((d) => d.id !== id));
        router.refresh();
      }
    } catch (err) {
      console.error("Delete discount error:", err);
    }
  };

  // Create new voucher
  const handleCreateDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const val = parseFloat(discountValue);
    if (isNaN(val) || val <= 0) {
      setErrorMsg("Please enter a valid discount amount or percentage.");
      setIsSubmitting(false);
      return;
    }

    if (discountType === "PERCENT" && val > 100) {
      setErrorMsg("Percentage discount cannot exceed 100%.");
      setIsSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim(),
          description: description.trim() || null,
          discountType,
          discountValue: val,
          minSpendNaira: parseFloat(minSpendNaira) || 0,
          maxUses: maxUses ? parseInt(maxUses, 10) : null,
          expiresAt: expiresAt || null,
          isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to create voucher code.");
      } else {
        setDiscounts((prev) => [data.discount, ...prev]);
        setIsModalOpen(false);
        setCode("");
        setDescription("");
        setDiscountValue("");
        setMinSpendNaira("");
        setMaxUses("");
        setExpiresAt("");
        router.refresh();
      }
    } catch {
      setErrorMsg("Network error creating discount voucher.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#262626] pb-6">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
            Promotions & Privileges
          </span>
          <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-white mt-0.5">
            Vouchers & Discount Codes ({discounts.length})
          </h1>
          <p className="text-xs text-neutral-400">
            Promotional codes automatically applied during server-side checkout calculations.
          </p>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              setErrorMsg(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 bg-[#FAF8F5] px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#0D0D0D] hover:bg-[#C5A880] transition-colors rounded-xs shadow-md"
          >
            <Plus className="h-4 w-4" />
            <span>New Voucher Code</span>
          </button>
        </div>
      </div>

      {/* Discounts Table */}
      <div className="bg-[#161616] border border-[#27272A] rounded-xs overflow-hidden">
        {discounts.length === 0 ? (
          <div className="p-16 text-center text-xs text-neutral-500">
            No voucher codes registered in the catalogue yet. Click &ldquo;New Voucher Code&rdquo; to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-xs">
              <thead>
                <tr className="border-b border-[#27272A] bg-[#1E1E1E] text-neutral-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Voucher Code</th>
                  <th className="p-4">Benefit</th>
                  <th className="p-4">Min. Spend</th>
                  <th className="p-4">Redemptions</th>
                  <th className="p-4">Expires</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#222222]">
                {discounts.map((d) => (
                  <tr key={d.id} className="hover:bg-[#1C1C1C] transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Tag className="h-3.5 w-3.5 text-[#C5A880]" />
                        <span className="font-mono font-bold text-white text-sm">
                          {d.code}
                        </span>
                      </div>
                      {d.description && (
                        <span className="text-[11px] text-neutral-400 block mt-0.5 max-w-xs truncate">
                          {d.description}
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-white font-medium">
                      {d.discountPercent ? (
                        <span className="text-emerald-400 font-semibold">
                          {d.discountPercent}% Off
                        </span>
                      ) : d.discountAmountInKobo ? (
                        <span className="text-[#C5A880] font-semibold">
                          {formatNaira(d.discountAmountInKobo)} Off
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="p-4 text-neutral-300">
                      {d.minSpendInKobo > 0 ? formatNaira(d.minSpendInKobo) : "No minimum"}
                    </td>
                    <td className="p-4 text-neutral-300">
                      <span className="font-mono">
                        {d.usedCount} {d.maxUses ? `/ ${d.maxUses}` : "uses"}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400">
                      {d.expiresAt ? formatDate(new Date(d.expiresAt)) : "Never"}
                    </td>
                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(d.id, d.isActive)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-xs border transition-colors ${
                          d.isActive
                            ? "bg-emerald-950/60 border-emerald-800 text-emerald-400 hover:bg-emerald-900/60"
                            : "bg-neutral-900 border-neutral-700 text-neutral-400 hover:bg-neutral-800"
                        }`}
                        title="Click to toggle active state"
                      >
                        {d.isActive ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3" />
                            <span>Inactive</span>
                          </>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(d.id, d.code)}
                        className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-[#222222] rounded-xs transition-colors"
                        title="Delete voucher"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Voucher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-[#161616] border border-[#27272A] rounded-xs shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-[#C5A880]" />
                <h3 className="font-serif-luxury text-base font-semibold uppercase tracking-wider text-white">
                  Create Promotional Voucher
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/40 border border-rose-900 rounded-xs text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleCreateDiscount} className="space-y-4 text-left">
              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                  Voucher Code *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. FAAVY15, LUXURY5K"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#1C1C1C] border border-[#333333] p-2.5 text-xs font-mono uppercase tracking-widest text-white focus:border-[#C5A880] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                  Description / Purpose
                </label>
                <input
                  type="text"
                  placeholder="e.g. 15% Welcome discount for bespoke suits"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#333333] p-2.5 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                    Discount Type *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setDiscountType("PERCENT")}
                      className={`p-2 text-xs font-semibold rounded-xs border transition-colors flex items-center justify-center gap-1.5 ${
                        discountType === "PERCENT"
                          ? "bg-[#FAF8F5] text-[#0D0D0D] border-white"
                          : "bg-[#1C1C1C] text-neutral-400 border-[#333333]"
                      }`}
                    >
                      <Percent className="h-3.5 w-3.5" />
                      <span>Percentage</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setDiscountType("FIXED")}
                      className={`p-2 text-xs font-semibold rounded-xs border transition-colors flex items-center justify-center gap-1.5 ${
                        discountType === "FIXED"
                          ? "bg-[#FAF8F5] text-[#0D0D0D] border-white"
                          : "bg-[#1C1C1C] text-neutral-400 border-[#333333]"
                      }`}
                    >
                      <span>₦ Fixed</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                    {discountType === "PERCENT" ? "Discount Percentage (%)" : "Discount Amount (₦)"} *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max={discountType === "PERCENT" ? 100 : undefined}
                    placeholder={discountType === "PERCENT" ? "15" : "5000"}
                    value={discountValue}
                    onChange={(e) => setDiscountValue(e.target.value)}
                    className="w-full bg-[#1C1C1C] border border-[#333333] p-2.5 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                    Minimum Spend (₦)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 50000 (0 for no min)"
                    value={minSpendNaira}
                    onChange={(e) => setMinSpendNaira(e.target.value)}
                    className="w-full bg-[#1C1C1C] border border-[#333333] p-2.5 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                    Max Redemptions (Limit)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Leave empty for unlimited"
                    value={maxUses}
                    onChange={(e) => setMaxUses(e.target.value)}
                    className="w-full bg-[#1C1C1C] border border-[#333333] p-2.5 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                  Expiration Date (Optional)
                </label>
                <input
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#333333] p-2.5 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="voucher-active"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded-xs border-neutral-600 bg-neutral-900 text-[#C5A880]"
                />
                <label htmlFor="voucher-active" className="text-xs text-neutral-300 select-none">
                  Activate voucher code immediately
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262626]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs uppercase tracking-wider text-neutral-400 hover:text-white border border-[#333333] rounded-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#FAF8F5] hover:bg-[#C5A880] text-[#0D0D0D] text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Create Voucher</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
