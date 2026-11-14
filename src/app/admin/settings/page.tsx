import React from "react";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  let settings = await prisma.storeSettings.findUnique({
    where: { id: "default" },
  });

  if (!settings) {
    settings = await prisma.storeSettings.create({
      data: {
        id: "default",
        storeName: "FAAVY",
        currency: "NGN",
        whatsappNumber: "2348140000000",
        contactEmail: "concierge@faavy.ng",
        contactPhone: "+234 814 000 0000",
        storeAddress: "Oye-Ekiti, Ekiti State, Nigeria",
        standardShippingFeeInKobo: 350000,
        freeShippingThresholdInKobo: 10000000,
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-[#262626] pb-6">
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
          Atelier Control
        </span>
        <h1 className="font-serif-luxury text-2xl sm:text-3xl font-medium text-white mt-0.5">
          Store Configuration & Settings
        </h1>
        <p className="text-xs text-neutral-400">
          Configure business details, WhatsApp concierge phone, announcement banners, and nationwide delivery rules.
        </p>
      </div>

      <SettingsForm initial={settings} />
    </div>
  );
}
