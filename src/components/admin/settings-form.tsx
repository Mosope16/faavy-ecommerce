"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2, AlertCircle, Save } from "lucide-react";

interface SettingsData {
  storeName: string;
  whatsappNumber: string;
  contactEmail: string;
  contactPhone: string;
  storeAddress: string;
  announcementBanner: string | null;
  standardShippingFeeInKobo: number;
  freeShippingThresholdInKobo: number;
  instagramHandle: string | null;
}

export function SettingsForm({ initial }: { initial: SettingsData }) {
  const router = useRouter();

  const [storeName, setStoreName] = useState(initial.storeName);
  const [whatsappNumber, setWhatsappNumber] = useState(initial.whatsappNumber);
  const [contactEmail, setContactEmail] = useState(initial.contactEmail);
  const [contactPhone, setContactPhone] = useState(initial.contactPhone);
  const [storeAddress, setStoreAddress] = useState(initial.storeAddress);
  const [announcementBanner, setAnnouncementBanner] = useState(
    initial.announcementBanner || ""
  );
  const [standardShippingNaira, setStandardShippingNaira] = useState(
    (initial.standardShippingFeeInKobo / 100).toString()
  );
  const [freeShippingThresholdNaira, setFreeShippingThresholdNaira] = useState(
    (initial.freeShippingThresholdInKobo / 100).toString()
  );
  const [instagramHandle, setInstagramHandle] = useState(
    initial.instagramHandle || ""
  );

  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setErrorMsg(null);
    setSavedSuccess(false);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          whatsappNumber: whatsappNumber.replace(/[^0-9]/g, ""),
          contactEmail,
          contactPhone,
          storeAddress,
          announcementBanner: announcementBanner.trim() || null,
          standardShippingFeeInKobo: Math.round(
            (parseFloat(standardShippingNaira) || 0) * 100
          ),
          freeShippingThresholdInKobo: Math.round(
            (parseFloat(freeShippingThresholdNaira) || 0) * 100
          ),
          instagramHandle: instagramHandle.trim() || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to update store settings.");
      } else {
        setSavedSuccess(true);
        router.refresh();
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch {
      setErrorMsg("Network error saving store settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {errorMsg && (
        <div className="bg-rose-950/80 border border-rose-800 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {savedSuccess && (
        <div className="bg-emerald-950/80 border border-emerald-800 p-4 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="h-4 w-4 shrink-0" />
          <span>Store settings persisted successfully to database.</span>
        </div>
      )}

      {/* Brand & Communications */}
      <div className="bg-[#161616] border border-[#27272A] p-4 sm:p-6 space-y-4">
        <h3 className="font-serif-luxury text-base font-medium text-white border-b border-[#27272A] pb-3">
          Brand Identity & Communications
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              Brand / Store Name
            </label>
            <input
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              WhatsApp Concierge Number *
            </label>
            <input
              type="text"
              required
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 2348140000000"
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-base sm:text-xs font-mono text-white focus:border-[#C5A880] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              Official Email
            </label>
            <input
              type="email"
              required
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              Customer Support Phone
            </label>
            <input
              type="text"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
            Atelier Physical Location
          </label>
          <input
            type="text"
            required
            value={storeAddress}
            onChange={(e) => setStoreAddress(e.target.value)}
            className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
            Announcement Bar Banner Text
          </label>
          <input
            type="text"
            value={announcementBanner}
            onChange={(e) => setAnnouncementBanner(e.target.value)}
            placeholder="e.g. Complimentary nationwide delivery on orders over ₦100,000"
            className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
          />
        </div>
      </div>

      {/* Shipping Pricing & Thresholds */}
      <div className="bg-[#161616] border border-[#27272A] p-6 space-y-4">
        <h3 className="font-serif-luxury text-base font-medium text-white border-b border-[#27272A] pb-3">
          Nationwide Delivery Rules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              Standard Base Shipping (₦)
            </label>
            <input
              type="number"
              value={standardShippingNaira}
              onChange={(e) => setStandardShippingNaira(e.target.value)}
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              Complimentary Shipping Threshold (₦)
            </label>
            <input
              type="number"
              value={freeShippingThresholdNaira}
              onChange={(e) => setFreeShippingThresholdNaira(e.target.value)}
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center gap-2 bg-[#FAF8F5] px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-[#0D0D0D] hover:bg-[#C5A880] transition-colors shadow-md disabled:bg-neutral-600"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              <span>Save Configuration Settings</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
