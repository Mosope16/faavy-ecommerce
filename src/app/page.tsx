import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Scissors, Clock, ShieldCheck, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { ProductCard } from "@/components/ui/product-card";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-container";
import { Reveal } from "@/components/motion/reveal";

type FeaturedProduct = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: true;
    variants: true;
  };
}>;

type CategoryItem = Prisma.CategoryGetPayload<Record<string, never>>;

// Force dynamic or revalidate to ensure live database data
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch featured products and categories from database.
  // Graceful fallback: if DB is unreachable (e.g. Neon cold-start), render
  // the page with empty data rather than throwing a 500 error.
  let featuredProducts: FeaturedProduct[] = [];
  let categories: CategoryItem[] = [];
  let storeSettings: Awaited<ReturnType<typeof prisma.storeSettings.findUnique>> = null;
  try {
    [featuredProducts, categories, storeSettings] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: {
          category: true,
          images: { orderBy: { displayOrder: "asc" } },
          variants: { where: { isActive: true }, orderBy: { stockQuantity: "desc" } },
        },
        take: 6,
      }),
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { displayOrder: "asc" },
        take: 4,
      }),
      prisma.storeSettings.findUnique({
        where: { id: "default" },
      }),
    ]);
  } catch (err) {
    // Log server-side; storefront renders with empty collections gracefully.
    console.error("[HomePage] Database fetch failed:", err);
  }

  return (
    <div className="flex flex-col bg-[#FAF8F5]">
      {/* 1. HERO SECTION: Luxury Editorial Choreography */}
      <section className="relative overflow-hidden border-b border-[#E8E3D8] bg-[#FAF8F5] pt-8 pb-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Editorial Typography */}
            <div className="lg:col-span-7 space-y-6">
              <FadeIn direction="up">
                <div className="inline-flex items-center gap-2 border border-[#C5A880]/50 bg-[#F5F2EB] px-3.5 py-1 text-xs uppercase tracking-[0.2em] font-medium text-[#8C6F45]">
                  <Sparkles className="h-3.5 w-3.5 text-[#C5A880]" />
                  <span>The Corporate Collection • 2026</span>
                </div>
              </FadeIn>

              <Reveal duration={0.85}>
                <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1A1A1A] leading-[1.15]">
                  Dignity in Tailoring. <br />
                  <span className="italic font-light text-[#8C6F45]">
                    Authority in Presence.
                  </span>
                </h1>
              </Reveal>

              <FadeIn delay={0.2} direction="up">
                <p className="text-sm sm:text-base leading-relaxed text-neutral-600 max-w-xl font-normal">
                  FAAVY reimagines Nigerian corporate attire with sculptural precision. From hand-canvassed Super 140s wool suits to bespoke executive gowns, each piece is engineered for commanders of industry.
                </p>
              </FadeIn>

              <FadeIn delay={0.3} direction="up">
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center gap-2.5 bg-[#1A1A1A] px-6 sm:px-7 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#FAF8F5] hover:bg-[#C5A880] hover:text-[#121212] transition-all shadow-md group min-h-[44px]"
                  >
                    <span>Explore The Edit</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/shop?madeToOrder=true"
                    className="inline-flex items-center justify-center gap-2 border border-[#1A1A1A] bg-transparent px-6 sm:px-7 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all min-h-[44px]"
                  >
                    <Scissors className="h-4 w-4 text-[#C5A880]" />
                    <span>Bespoke Service</span>
                  </Link>
                </div>
              </FadeIn>

              {/* Origin badge */}
              <FadeIn delay={0.4} direction="up">
                <div className="pt-6 border-t border-[#E8E3D8] flex flex-wrap sm:flex-nowrap items-center justify-between sm:justify-start gap-4 sm:gap-6 text-xs text-neutral-500">
                  <div>
                    <span className="block font-serif-luxury text-base sm:text-lg font-semibold text-[#1A1A1A]">
                      100%
                    </span>
                    <span className="uppercase tracking-wider text-[9px] sm:text-[10px]">
                      Single-Vendor Integrity
                    </span>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-[#E8E3D8]" />
                  <div>
                    <span className="block font-serif-luxury text-base sm:text-lg font-semibold text-[#1A1A1A]">
                      Oye-Ekiti
                    </span>
                    <span className="uppercase tracking-wider text-[9px] sm:text-[10px]">
                      Atelier Location
                    </span>
                  </div>
                  <div className="hidden sm:block h-8 w-px bg-[#E8E3D8]" />
                  <div>
                    <span className="block font-serif-luxury text-base sm:text-lg font-semibold text-[#1A1A1A]">
                      NGN (₦)
                    </span>
                    <span className="uppercase tracking-wider text-[9px] sm:text-[10px]">
                      Direct Pricing
                    </span>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: Visual Composition */}
            <div className="lg:col-span-5 relative">
              <FadeIn delay={0.15}>
                <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-[#161616] border border-[#C5A880]/30 shadow-2xl flex flex-col justify-between p-5 sm:p-8 text-white">
                  <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                    <span className="text-[10px] uppercase font-bold tracking-[0.3em] text-[#C5A880]">
                      Atelier Oye-Ekiti
                    </span>
                    <span className="text-[10px] font-mono text-neutral-400">
                      Nº 01 / 2026
                    </span>
                  </div>

                  <div className="my-auto text-center space-y-3">
                    <div className="mx-auto w-16 h-16 rounded-full border border-[#C5A880]/40 flex items-center justify-center">
                      <span className="font-serif-luxury text-2xl text-[#C5A880] italic">F</span>
                    </div>
                    <h2 className="font-serif-luxury text-2xl sm:text-3xl font-light tracking-wide text-[#FAF8F5]">
                      FAAVY
                    </h2>
                    <p className="text-[11px] uppercase tracking-[0.25em] text-[#C5A880] font-medium">
                      Haute Corporate Sartorial
                    </p>
                  </div>

                  <div className="border-t border-[#2A2A2A] pt-4">
                    <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
                      Flagship Commission
                    </span>
                    <h3 className="font-serif-luxury text-xl font-normal text-white mt-1">
                      The Sovereign Double-Breasted
                    </h3>
                    <p className="text-xs text-neutral-300 mt-1">
                      Super 140s Wool • Hand-Canvassed Peak Lapels
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CURATED COLLECTIONS GRID */}
      <section className="border-b border-[#E8E3D8] bg-[#F5F2EB] py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase font-semibold tracking-[0.2em] text-[#8C6F45]">
                Curated Departures
              </span>
              <h2 className="font-serif-luxury mt-1 text-3xl sm:text-4xl font-normal text-[#1A1A1A]">
                The Pillars of the House
              </h2>
            </div>
            <Link
              href="/shop"
              className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#8C6F45] inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View All Collections</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => (
              <StaggerItem key={cat.id}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="group relative block aspect-[4/3] sm:aspect-[3/4] overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A] p-5 sm:p-6 flex flex-col justify-between"
                >
                  {cat.imageUrl ? (
                    <>
                      <Image
                        src={cat.imageUrl}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover opacity-85 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-95"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1E1E1E] to-[#121212] group-hover:from-[#252525] group-hover:to-[#171717] transition-colors" />
                  )}
                  {!cat.imageUrl && (
                    <div className="relative z-10 text-right">
                      <span className="font-serif-luxury text-3xl font-light text-[#C5A880]/30 group-hover:text-[#C5A880]/60 transition-colors">
                        {String(cat.displayOrder || "").padStart(2, "0")}
                      </span>
                    </div>
                  )}
                  <div className="relative z-10 mt-auto text-white">
                    <h3 className="font-serif-luxury text-xl font-normal tracking-wide text-white group-hover:text-[#C5A880] transition-colors">
                      {cat.name}
                    </h3>
                    <p className="mt-1 text-xs text-neutral-300 line-clamp-2">
                      {cat.description}
                    </p>
                    <span className="mt-3 inline-block text-[10px] uppercase font-semibold tracking-[0.2em] text-[#C5A880]">
                      Discover →
                    </span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* 3. FEATURED PIECES SHOWCASE */}
      <section className="border-b border-[#E8E3D8] py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs uppercase font-semibold tracking-[0.2em] text-[#8C6F45]">
                Signature Creations
              </span>
              <h2 className="font-serif-luxury mt-1 text-3xl sm:text-4xl font-normal text-[#1A1A1A]">
                The Executive Selection
              </h2>
            </div>
            <Link
              href="/shop"
              className="mt-4 sm:mt-0 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] hover:text-[#8C6F45] inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View Full Catalogue</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredProducts.map((product) => {
              const primaryImg =
                product.images.find((i) => i.isPrimary)?.url ||
                product.images[0]?.url ||
                null;
              const secondaryImg =
                product.images[1]?.url || null;
              const defaultVariant = product.variants[0];

              return (
                <StaggerItem key={product.id}>
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    slug={product.slug}
                    basePriceInKobo={product.basePriceInKobo}
                    categoryName={product.category.name}
                    imageUrl={primaryImg}
                    secondaryImageUrl={secondaryImg}
                    isMadeToOrder={product.isMadeToOrder}
                    leadTimeDays={product.leadTimeDays}
                    defaultVariant={defaultVariant}
                  />
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      {/* 4. BESPOKE VS READY-TO-WEAR VALUE PROPOSITION */}
      <section className="border-b border-[#E8E3D8] bg-[#121212] text-white py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#C5A880]">
                Tailoring Philosophy
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal leading-tight text-white">
                Two Modes of Excellence: <br />
                Ready-to-Wear & Made-to-Order.
              </h2>
              <p className="text-sm text-neutral-400 leading-relaxed font-light">
                Every executive requires versatility. FAAVY stocks limited ready-to-wear silhouettes for immediate dispatch across Nigeria, while simultaneously accommodating full bespoke commissions with tailored measurements and personalized fabric selections.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                <div className="border border-[#2A2A2A] bg-[#1A1A1A] p-5">
                  <div className="flex items-center gap-2.5 text-[#C5A880] mb-2">
                    <Clock className="h-5 w-5" />
                    <h3 className="font-serif-luxury text-base font-medium text-white">
                      Ready to Wear
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Stocked garments dispatched within 24 hours. Ideal for upcoming boardroom presentations and urgent engagements.
                  </p>
                </div>

                <div className="border border-[#2A2A2A] bg-[#1A1A1A] p-5">
                  <div className="flex items-center gap-2.5 text-[#C5A880] mb-2">
                    <Scissors className="h-5 w-5" />
                    <h3 className="font-serif-luxury text-base font-medium text-white">
                      Made to Order
                    </h3>
                  </div>
                  <p className="text-xs text-neutral-400">
                    Crafted specifically to your proportions. Production lead times range from 7 to 14 business days.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative aspect-auto min-h-[300px] sm:min-h-0 sm:aspect-[4/3] overflow-hidden bg-[#181818] border border-[#2A2A2A] p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-3 text-[10px] uppercase font-medium tracking-[0.25em] text-[#C5A880]">
                <span>Bespoke Commissioning</span>
                <span>Atelier Standards</span>
              </div>
              <div className="my-auto space-y-4">
                <blockquote className="font-serif-luxury text-xl sm:text-2xl text-[#FAF8F5] leading-relaxed italic">
                  &ldquo;Every seam must reflect authority, precision, and uncompromised dignity.&rdquo;
                </blockquote>
                <p className="text-xs text-neutral-400 font-light">
                  Handcrafted in Oye-Ekiti for corporate leaders across the nation.
                </p>
              </div>
              <div className="flex items-center gap-4 border-t border-[#2A2A2A] pt-4 text-xs text-neutral-400">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880]" />
                  <span>Individual Patterns</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880]" />
                  <span>Super 140s Fabrics</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. WHATSAPP CONCIERGE ASSISTANCE CALLOUT */}
      <section className="bg-[#FAF8F5] py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center rounded-full bg-[#E8F8EE] p-4 text-[#25D366]">
            <MessageCircle className="h-8 w-8" />
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl font-normal text-[#1A1A1A]">
            Prefer Personal Concierge Assistance?
          </h2>
          <p className="text-sm text-neutral-600 max-w-xl mx-auto leading-relaxed">
            Connect directly with our master stylists in Oye-Ekiti via WhatsApp. We assist with custom sizing measurements, corporate fleet orders, fabric swatches, and private consultations.
          </p>
          <div className="pt-2">
            <a
              href={`https://wa.me/${storeSettings?.whatsappNumber || "2348140000000"}?text=${encodeURIComponent(
                "Hello FAAVY, I would like to consult with a stylist regarding your corporate collections."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 bg-[#1A1A1A] px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#FAF8F5] hover:bg-[#C5A880] hover:text-[#121212] transition-colors w-full sm:w-auto min-h-[44px]"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366] shrink-0" />
              <span>Initiate WhatsApp Consultation</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
