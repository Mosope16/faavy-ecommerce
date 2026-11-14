import React from "react";
import { FadeIn } from "@/components/motion/fade-in";

export default function TermsPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#E8E3D8] pb-8 mb-12">
          <FadeIn direction="up">
            <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6F45]">
              Legal Governance
            </span>
            <h1 className="font-serif-luxury mt-2 text-4xl sm:text-5xl font-normal text-[#1A1A1A]">
              Terms & Conditions
            </h1>
            <p className="mt-3 text-sm text-neutral-600 font-light leading-relaxed">
              Standard commercial terms governing purchases from FAAVY.
            </p>
          </FadeIn>
        </div>

        <div className="space-y-8 text-sm text-neutral-700 leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg font-medium text-[#1A1A1A]">
              1. Single-Vendor Operation
            </h2>
            <p>
              FAAVY is a single-vendor luxury fashion house. All products displayed on the platform are produced or directly curated by FAAVY. We do not operate as an open marketplace for third-party sellers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg font-medium text-[#1A1A1A]">
              2. Currency & Pricing Integrity
            </h2>
            <p>
              All prices are quoted in Nigerian Naira (NGN) and calculated in integer kobo. Prices displayed at checkout are binding once payment is initialized. FAAVY reserves the right to correct manifest pricing errors before order fulfillment.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg font-medium text-[#1A1A1A]">
              3. WhatsApp Assisted Orders
            </h2>
            <p>
              Enquiries and draft orders initiated via WhatsApp Concierge are confirmed only upon issuance of an official order reference code and receipt of payment confirmation through Paystack or verified invoice transfer.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg font-medium text-[#1A1A1A]">
              4. Governing Law
            </h2>
            <p>
              These terms are governed by the laws of the Federal Republic of Nigeria, with jurisdiction in Ekiti State.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
