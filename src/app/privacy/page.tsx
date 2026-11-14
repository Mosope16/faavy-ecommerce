import React from "react";
import { FadeIn } from "@/components/motion/fade-in";

export default function PrivacyPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#E8E3D8] pb-8 mb-12">
          <FadeIn direction="up">
            <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6F45]">
              Legal & Compliance
            </span>
            <h1 className="font-serif-luxury mt-2 text-3xl sm:text-4xl lg:text-5xl font-normal text-[#1A1A1A]">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-neutral-600 font-light leading-relaxed">
              Effective Date: November 2026. House of FAAVY, Oye-Ekiti, Nigeria.
            </p>
          </FadeIn>
        </div>

        <div className="space-y-8 text-sm text-neutral-700 leading-relaxed font-light">
          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg font-medium text-[#1A1A1A]">
              1. Information We Collect
            </h2>
            <p>
              When you purchase or enquire on FAAVY, we collect essential information required to fulfill your order and maintain concierge communication: your name, contact telephone number (for dispatch coordination and WhatsApp updates), email address, delivery street address, and garment sizing preferences.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg font-medium text-[#1A1A1A]">
              2. Payment Security & Processing
            </h2>
            <p>
              FAAVY does not store or process debit/credit card numbers or banking credentials on our servers. All financial transactions are secured through Paystack, a licensed Central Bank of Nigeria (CBN) payment gateway adhering to PCI-DSS Level 1 compliance.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg font-medium text-[#1A1A1A]">
              3. Guest Checkout & Data Protection
            </h2>
            <p>
              We honor guest checkout. Customers are never forced to register an account to place an order. Your details are utilized strictly for order verification, nationwide delivery dispatch, and customer service. We never sell or lease customer contact lists to third-party advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-serif-luxury text-lg font-medium text-[#1A1A1A]">
              4. Contacting Our Data Controller
            </h2>
            <p>
              For privacy enquiries or to request deletion of your order records, please contact:
              <br />
              <strong className="text-[#1A1A1A]">House of FAAVY Privacy Officer</strong>
              <br />
              Email: <code>privacy@faavy.ng</code>
              <br />
              Oye-Ekiti, Ekiti State, Nigeria.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
