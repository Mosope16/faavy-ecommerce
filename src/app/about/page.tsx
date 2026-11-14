import React from "react";
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

        {/* Feature Visual: Editorial Atelier Banner */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#161616] border border-[#C5A880]/30 mb-16 p-8 sm:p-12 flex flex-col justify-between text-white">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C5A880]">
              The FAAVY Atelier • Oye-Ekiti
            </span>
            <span className="text-[10px] font-mono text-neutral-400">
              Sartorial Excellence
            </span>
          </div>

          <div className="my-auto max-w-2xl space-y-3">
            <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-light text-[#FAF8F5] leading-tight">
              Where Precision Meets African Executive Authority
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              Every garment is conceived, patterned, and crafted with unyielding dedication to single-vendor integrity, master tailoring, and enduring quality.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 border-t border-[#2A2A2A] pt-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880]" />
              <span>Super 140s Virgin Wool</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880]" />
              <span>Egyptian Giza Cottons</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880]" />
              <span>Hand-Basted Canvassing</span>
            </div>
          </div>
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
