import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Scissors, Clock, ShieldCheck, MessageCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/ui/product-card";
import { FadeIn } from "@/components/motion/fade-in";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger-container";
import { Reveal } from "@/components/motion/reveal";

// Force dynamic or revalidate to ensure live database data
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch featured products and categories from database
  const [featuredProducts, categories, storeSettings] = await Promise.all([
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
                <h1 className="font-serif-luxury text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#1A1A1A] leading-[1.12]">
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
                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2.5 bg-[#1A1A1A] px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAF8F5] hover:bg-[#C5A880] hover:text-[#121212] transition-all shadow-md group"
                  >
                    <span>Explore The Edit</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  <Link
                    href="/shop?madeToOrder=true"
                    className="inline-flex items-center gap-2 border border-[#1A1A1A] bg-transparent px-7 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-all"
                  >
                    <Scissors className="h-4 w-4 text-[#C5A880]" />
                    <span>Bespoke Service</span>
                  </Link>
                </div>
              </FadeIn>

              {/* Origin badge */}
              <FadeIn delay={0.4} direction="up">
                <div className="pt-6 border-t border-[#E8E3D8] flex items-center gap-6 text-xs text-neutral-500">
                  <div>
                    <span className="block font-serif-luxury text-lg font-semibold text-[#1A1A1A]">
                      100%
                    </span>
                    <span className="uppercase tracking-wider text-[10px]">
                      Single-Vendor Integrity
                    </span>
                  </div>
                  <div className="h-8 w-px bg-[#E8E3D8]" />
                  <div>
                    <span className="block font-serif-luxury text-lg font-semibold text-[#1A1A1A]">
                      Oye-Ekiti
                    </span>
                    <span className="uppercase tracking-wider text-[10px]">
                      Atelier Location
                    </span>
                  </div>
                  <div className="h-8 w-px bg-[#E8E3D8]" />
                  <div>
                    <span className="block font-serif-luxury text-lg font-semibold text-[#1A1A1A]">
                      NGN (₦)
                    </span>
                    <span className="uppercase tracking-wider text-[10px]">
                      Direct Pricing
                    </span>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Right Column: Visual Composition */}
            <div className="lg:col-span-5 relative">
              <FadeIn delay={0.15}>
                <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden bg-[#F5F2EB] border border-[#E8E3D8] shadow-2xl">
                  <Image
                    src="/images/products/suit-double-breasted.jpg"
                    alt="The Sovereign Double-Breasted Suit by FAAVY"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 500px"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C5A880]">
                      Flagship Commission
                    </span>
                    <h3 className="font-serif-luxury text-xl font-normal text-white mt-1">
                      The Sovereign Double-Breasted
                    </h3>
                    <p className="text-xs text-neutral-200 mt-1">
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

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <StaggerItem key={cat.id}>
                <Link
                  href={`/category/${cat.slug}`}
                  className="group relative block aspect-[3/4] overflow-hidden bg-[#1A1A1A] border border-[#E8E3D8]"
                >
                  {cat.imageUrl && (
                    <Image
                      src={cat.imageUrl}
                      alt={cat.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover opacity-85 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-95"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5 text-white">
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

          <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => {
              const primaryImg =
                product.images.find((i) => i.isPrimary)?.url ||
                product.images[0]?.url ||
                "/images/products/suit-double-breasted.jpg";
              const secondaryImg =
                product.images[1]?.url || primaryImg;
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

            <div className="relative aspect-[4/3] overflow-hidden bg-[#1A1A1A] border border-[#2A2A2A]">
              <Image
                src="/images/editorial/hero-banner.jpg"
                alt="FAAVY Boardroom Tailoring"
                fill
                sizes="(max-width: 1024px) 100vw, 600px"
                className="object-cover"
              />
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
              className="inline-flex items-center gap-2.5 bg-[#1A1A1A] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#FAF8F5] hover:bg-[#C5A880] hover:text-[#121212] transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span>Initiate WhatsApp Consultation</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
