"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, MapPin, Mail, Phone, ShieldCheck } from "lucide-react";

export function Footer() {
  const pathname = usePathname();

  // Hide storefront footer on administrative routes (/admin, /admin/login, etc.)
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="border-t border-[#E8E3D8] bg-[#121212] text-[#FAF8F5]">
      {/* Top Value Banner */}
      <div className="border-b border-[#222222] px-4 py-8 sm:py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="rounded-full bg-[#1A1A1A] p-3 text-[#C5A880] border border-[#2A2A2A] shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-sm font-medium uppercase tracking-wider text-white">
                Bespoke & Ready-to-Wear
              </h4>
              <p className="mt-1 text-xs text-neutral-400">
                Crafted with Italian Super 140s wool, Egyptian Giza cotton, and artisanal perfection.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="rounded-full bg-[#1A1A1A] p-3 text-[#C5A880] border border-[#2A2A2A] shrink-0">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-sm font-medium uppercase tracking-wider text-white">
                Nationwide Delivery
              </h4>
              <p className="mt-1 text-xs text-neutral-400">
                Direct dispatch from Oye-Ekiti across all 36 Nigerian states and Abuja FCT.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:col-span-2 md:col-span-1">
            <div className="rounded-full bg-[#1A1A1A] p-3 text-[#C5A880] border border-[#2A2A2A] shrink-0">
              <MessageCircle className="h-6 w-6 text-[#25D366]" />
            </div>
            <div>
              <h4 className="font-serif-luxury text-sm font-medium uppercase tracking-wider text-white">
                WhatsApp Concierge
              </h4>
              <p className="mt-1 text-xs text-neutral-400">
                One-on-one styling guidance and assisted orders directly via WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10">
          {/* Brand Col */}
          <div className="sm:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-serif-luxury text-2xl font-bold tracking-[0.25em] text-white uppercase">
                FAAVY
              </span>
              <span className="block text-[10px] tracking-[0.3em] text-[#C5A880] uppercase">
                Haute Corporate Wear
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-neutral-400 max-w-sm">
              FAAVY is a premier Nigerian corporate fashion house founded in Oye-Ekiti, Nigeria. We redefine executive dressing through sculptural tailoring, impeccable silhouettes, and dignified luxury.
            </p>
            <div className="pt-2 text-xs text-neutral-400 space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#C5A880] shrink-0" />
                <span>Oye-Ekiti, Ekiti State, Nigeria</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#C5A880] shrink-0" />
                <a href="mailto:favourohieku@gmail.com" className="hover:text-white transition-colors">favourohieku@gmail.com</a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#C5A880] shrink-0" />
                <a href="tel:+2349138304922" className="hover:text-white transition-colors">+234 913 830 4922</a>
              </p>
            </div>
          </div>

          {/* Col 1: Collections */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A880] mb-4">
              Collections
            </h3>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li>
                <Link href="/category/jackets-suits" className="inline-block py-1 hover:text-white transition-colors">
                  Suits & Power Blazers
                </Link>
              </li>
              <li>
                <Link href="/category/corporate-gowns" className="inline-block py-1 hover:text-white transition-colors">
                  Executive Gowns
                </Link>
              </li>
              <li>
                <Link href="/category/shirts" className="inline-block py-1 hover:text-white transition-colors">
                  Egyptian Cotton Shirts
                </Link>
              </li>
              <li>
                <Link href="/category/trousers" className="inline-block py-1 hover:text-white transition-colors">
                  Pleated Trousers
                </Link>
              </li>
              <li>
                <Link href="/category/perfume-oils" className="inline-block py-1 hover:text-white transition-colors">
                  Artisanal Fragrance Oils
                </Link>
              </li>
              <li>
                <Link href="/category/shoes" className="inline-block py-1 hover:text-white transition-colors">
                  Handcrafted Footwear
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Concierge & Orders */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A880] mb-4">
              Client Care
            </h3>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li>
                <Link href="/track" className="inline-block py-1 hover:text-white transition-colors">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link href="/shop?madeToOrder=true" className="inline-block py-1 hover:text-white transition-colors">
                  Made-to-Order Bespoke
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="inline-block py-1 hover:text-white transition-colors">
                  Shipping & Dispatch
                </Link>
              </li>
              <li>
                <Link href="/shipping-returns" className="inline-block py-1 hover:text-white transition-colors">
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link href="/contact" className="inline-block py-1 hover:text-white transition-colors">
                  Bespoke Consultation
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Company & Legal */}
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#C5A880] mb-4">
              House of FAAVY
            </h3>
            <ul className="space-y-1.5 text-xs text-neutral-400">
              <li>
                <Link href="/about" className="inline-block py-1 hover:text-white transition-colors">
                  Our Story & Heritage
                </Link>
              </li>
              <li>
                <Link href="/contact" className="inline-block py-1 hover:text-white transition-colors">
                  Atelier in Oye-Ekiti
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="inline-block py-1 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="inline-block py-1 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="inline-block py-1 hover:text-white transition-colors text-neutral-500">
                  Staff Login
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-[#222222] pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4 text-center sm:text-left">
          <p>© 2026 FAAVY Corporate Fashion House. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-[#1A1A1A] border border-[#2A2A2A] text-neutral-300">
              <span>Currency:</span>
              <strong className="text-[#C5A880]">NGN (₦)</strong>
            </span>
            <span>Secured by Paystack</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
