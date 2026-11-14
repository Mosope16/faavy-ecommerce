import React from "react";
import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";

export default function ShippingReturnsPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 lg:py-20">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#E8E3D8] pb-8 mb-12">
          <FadeIn direction="up">
            <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6F45]">
              Logistics Policy
            </span>
            <h1 className="font-serif-luxury mt-2 text-4xl sm:text-5xl font-normal text-[#1A1A1A]">
              Shipping, Delivery & Returns
            </h1>
            <p className="mt-3 text-sm text-neutral-600 font-light leading-relaxed">
              Transparent fulfillment policies governing dispatches from our Oye-Ekiti atelier across Nigeria.
            </p>
          </FadeIn>
        </div>

        <div className="space-y-12 text-sm text-neutral-700 leading-relaxed font-light">
          {/* Section 1 */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5 text-[#1A1A1A]">
              <Truck className="h-5 w-5 text-[#8C6F45]" />
              <h2 className="font-serif-luxury text-xl font-medium">
                1. Nationwide Delivery & Timelines
              </h2>
            </div>
            <p>
              All orders are fulfilled from our central atelier in Oye-Ekiti, Ekiti State, Nigeria. We partner with reputable national logistics carriers alongside our dedicated regional dispatch team.
            </p>
            <div className="bg-[#F5F2EB] border border-[#E8E3D8] p-5 space-y-3">
              <h3 className="font-semibold uppercase tracking-wider text-xs text-[#1A1A1A]">
                Regional Timelines & Rates
              </h3>
              <ul className="space-y-2 text-xs">
                <li>
                  <strong>Ekiti State (Intrastate):</strong> 1 - 2 business days (₦2,500 flat fee).
                </li>
                <li>
                  <strong>Southwest Hubs (Lagos, Ogun, Oyo, Osun, Ondo):</strong> 2 - 3 business days (₦3,500 flat fee).
                </li>
                <li>
                  <strong>Abuja FCT & Major South-South Hubs (Rivers, Edo, Delta):</strong> 3 - 4 business days (₦4,500 flat fee).
                </li>
                <li>
                  <strong>Rest of Nigeria:</strong> 4 - 6 business days (₦5,500 flat fee).
                </li>
                <li>
                  <strong className="text-[#8C6F45]">Complimentary Shipping:</strong> Orders with a product subtotal exceeding ₦100,000 qualify automatically for free nationwide delivery.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 2 */}
          <div className="space-y-4 border-t border-[#E8E3D8] pt-8">
            <div className="flex items-center gap-2.5 text-[#1A1A1A]">
              <RotateCcw className="h-5 w-5 text-[#8C6F45]" />
              <h2 className="font-serif-luxury text-xl font-medium">
                2. Ready-to-Wear Returns & Exchanges
              </h2>
            </div>
            <p>
              We want you to feel complete confidence in your FAAVY garments. Ready-to-wear items may be exchanged or returned for store credit within <strong>7 days</strong> of delivery, provided that:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs">
              <li>The garment is unworn, unwashed, and unaltered.</li>
              <li>All original FAAVY tags and fabric seals remain intact.</li>
              <li>The piece is returned in its original protective garment packaging.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-4 border-t border-[#E8E3D8] pt-8">
            <div className="flex items-center gap-2.5 text-[#1A1A1A]">
              <ShieldCheck className="h-5 w-5 text-[#8C6F45]" />
              <h2 className="font-serif-luxury text-xl font-medium">
                3. Made-to-Order & Bespoke Policy
              </h2>
            </div>
            <p>
              Made-to-order commissions and customized suits are crafted specifically to your requested sizing and lead times (typically 7 to 14 business days).
            </p>
            <p>
              Because each bespoke item is cut specifically for the commissioning client, made-to-order garments cannot be refunded once cutting has begun. However, FAAVY provides complimentary alteration assistance if an item requires fine-tuning.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
