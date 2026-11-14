import React from "react";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/motion/fade-in";
import { Scissors, Award, Sparkles, MapPin } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 lg:py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Header */}
        <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
          <FadeIn direction="up">
            <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6F45]">
              Heritage & Craftsmanship
            </span>
            <h1 className="font-serif-luxury mt-2 text-4xl sm:text-5xl font-normal text-[#1A1A1A]">
              The House of FAAVY
            </h1>
            <p className="mt-4 text-sm text-neutral-600 leading-relaxed font-light">
              Born in Oye-Ekiti, Nigeria, FAAVY was established on a radical standard: that corporate dress for African leaders should rival the finest tailoring houses of London, Milan, and Paris without compromising Nigerian dignity or cultural presence.
            </p>
          </FadeIn>
        </div>

        {/* Feature Visual */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#1A1A1A] border border-[#E8E3D8] mb-16">
          <Image
            src="/images/editorial/hero-banner.jpg"
            alt="The FAAVY Atelier in Ekiti"
            fill
            className="object-cover"
          />
        </div>

        {/* Story Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm text-neutral-700 leading-relaxed font-light">
          <div className="space-y-4">
            <h3 className="font-serif-luxury text-xl font-medium text-[#1A1A1A]">
              Sculptural Precision & Textile Dignity
            </h3>
            <p>
              Corporate wear in Nigeria has too frequently been dominated by synthetic imports poorly suited to our tropical climate and demanding schedules. At FAAVY, we source Super 140s virgin wool, breathable Egyptian Giza cottons, and high-twist crepes that allow our garments to maintain razor-sharp drape from morning strategy sessions to evening galas.
            </p>
            <p>
              Each seam is reinforced, each canvas chest piece hand-basted, and every buttonhole inspected before a piece receives the FAAVY seal of approval.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-serif-luxury text-xl font-medium text-[#1A1A1A]">
              Rooted in Oye-Ekiti, Delivered Nationwide
            </h3>
            <p>
              Our primary atelier operates from Oye-Ekiti, Ekiti State. By anchoring our production in the serene intellectual and cultural cradle of Ekiti, we foster local master tailors, pattern drafters, and artisans who take genuine pride in every single stitch.
            </p>
            <p>
              Through our integrated logistics network and private WhatsApp concierge, we deliver promptly across Lagos, Abuja, Port Harcourt, and every state in the Federation.
            </p>
          </div>
        </div>

        {/* Core Values Pillars */}
        <div className="mt-16 border-t border-[#E8E3D8] pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-[#F5F2EB] border border-[#E8E3D8]">
            <Scissors className="h-6 w-6 text-[#8C6F45] mx-auto mb-3" />
            <h4 className="font-serif-luxury text-base font-medium text-[#1A1A1A]">
              Single-Vendor Integrity
            </h4>
            <p className="mt-1 text-xs text-neutral-500">
              We never drop-ship. Every creation is designed and inspected by FAAVY artisans.
            </p>
          </div>

          <div className="p-6 bg-[#F5F2EB] border border-[#E8E3D8]">
            <Award className="h-6 w-6 text-[#8C6F45] mx-auto mb-3" />
            <h4 className="font-serif-luxury text-base font-medium text-[#1A1A1A]">
              Integer Kobo Accuracy
            </h4>
            <p className="mt-1 text-xs text-neutral-500">
              Zero hidden fees, transparent Nigerian Naira pricing, verified through Paystack.
            </p>
          </div>

          <div className="p-6 bg-[#F5F2EB] border border-[#E8E3D8]">
            <Sparkles className="h-6 w-6 text-[#8C6F45] mx-auto mb-3" />
            <h4 className="font-serif-luxury text-base font-medium text-[#1A1A1A]">
              Bespoke Fit Promise
            </h4>
            <p className="mt-1 text-xs text-neutral-500">
              Personalized made-to-order sizing guidance with concierge alterations support.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-block bg-[#1A1A1A] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAF8F5] hover:bg-[#C5A880] hover:text-[#121212] transition-colors"
          >
            Explore Our Collections
          </Link>
        </div>
      </div>
    </div>
  );
}
