"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, X, Shield, Phone, Truck, ChevronRight } from "lucide-react";
import { useCart } from "@/context/cart-context";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const { totalItemsCount, setIsCartOpen } = useCart();

  const navLinks = [
    { label: "Collections", href: "/shop" },
    { label: "Suits & Blazers", href: "/category/jackets-suits" },
    { label: "Corporate Gowns", href: "/category/corporate-gowns" },
    { label: "Shirts", href: "/category/shirts" },
    { label: "Made to Order", href: "/shop?madeToOrder=true" },
    { label: "Our Story", href: "/about" },
    { label: "Concierge", href: "/contact" },
  ];

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E3D8] transition-all">
      <div className="relative mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Mobile Menu Trigger (Hairline Luxury Bars) */}
        <div className="flex items-center lg:hidden z-10">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="group flex items-center gap-2 p-2 min-h-[44px] min-w-[44px] text-[#1A1A1A] hover:text-[#C5A880] transition-colors focus:outline-hidden"
            aria-label="Open Navigation Menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="flex flex-col justify-center items-start w-5 h-4 gap-1.5">
              <span className="h-[1.5px] w-5 bg-current transition-all duration-300" />
              <span className="h-[1.5px] w-3.5 bg-current transition-all duration-300 group-hover:w-5" />
            </div>
            <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.2em] font-medium text-neutral-600 group-hover:text-[#1A1A1A] transition-colors">
              Menu
            </span>
          </button>
        </div>

        {/* Brand Logo - Centered on Mobile, Natural on Desktop */}
        <div className="flex items-center lg:static absolute left-1/2 -translate-x-1/2 lg:translate-x-0 z-0">
          <Link href="/" className="group flex flex-col items-center py-1">
            <span className="font-serif-luxury text-xl sm:text-2xl lg:text-3xl font-semibold tracking-[0.22em] sm:tracking-[0.25em] text-[#1A1A1A] uppercase transition-colors group-hover:text-[#C5A880]">
              FAAVY
            </span>
            <span className="text-[8px] sm:text-[9px] tracking-[0.3em] sm:tracking-[0.35em] text-neutral-500 uppercase -mt-0.5">
              Oye-Ekiti
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs uppercase tracking-[0.18em] transition-colors hover:text-[#C5A880] ${
                  isActive
                    ? "font-semibold text-[#1A1A1A] border-b border-[#C5A880] pb-1"
                    : "text-neutral-700"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-1 sm:space-x-3 z-10">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-700 hover:text-[#C5A880] transition-colors focus:outline-hidden"
            aria-label="Search items"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Admin link */}
          <Link
            href="/admin"
            className="p-2 min-h-[44px] min-w-[44px] items-center justify-center text-neutral-700 hover:text-[#C5A880] transition-colors hidden sm:inline-flex"
            title="Admin Portal"
            aria-label="Admin Portal"
          >
            <Shield className="h-5 w-5" />
          </Link>

          {/* Shopping Bag Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#1A1A1A] hover:text-[#C5A880] transition-colors focus:outline-hidden"
            aria-label={`Open Cart (${totalItemsCount} items)`}
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItemsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#1A1A1A] text-[9px] font-bold text-[#FAF8F5]">
                {totalItemsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-[#E8E3D8] bg-[#F5F2EB]"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto flex max-w-3xl items-center px-3 sm:px-4 py-2.5 sm:py-3 gap-2"
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400 shrink-0" />
              <input
                type="text"
                placeholder="Search bespoke suits, gowns, shirts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-base sm:text-sm text-[#1A1A1A] placeholder-neutral-400 focus:outline-hidden"
              />
              <button
                type="submit"
                className="shrink-0 rounded-none bg-[#1A1A1A] px-3 sm:px-4 py-1.5 text-[11px] sm:text-xs uppercase tracking-wider text-white hover:bg-[#C5A880] transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-[#1A1A1A] focus:outline-hidden"
                aria-label="Close search"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Navigation (Haute Luxury Slide-out) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop with Soft Luxury Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#0D0D0D]/65 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col h-full w-[88%] max-w-[390px] bg-[#FAF8F5] shadow-2xl z-10 border-r border-[#E8E3D8]"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E3D8] bg-[#FAF8F5]">
                <div className="flex flex-col">
                  <span className="font-serif-luxury text-xl font-bold tracking-[0.25em] text-[#1A1A1A] uppercase">
                    FAAVY
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.32em] text-[#8C6F45] font-medium mt-0.5">
                    Haute Corporate • Oye-Ekiti
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="h-10 w-10 rounded-full border border-[#E8E3D8] hover:border-[#1A1A1A] hover:bg-[#F5F2EB] flex items-center justify-center text-[#1A1A1A] transition-all min-h-[44px] min-w-[44px]"
                  aria-label="Close Navigation Menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {/* Section 1: Curated Collections */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-[#8C6F45]">
                      Collections & Garments
                    </span>
                    <span className="h-px flex-1 bg-[#E8E3D8]" />
                  </div>
                  <nav className="flex flex-col space-y-1">
                    {[
                      { label: "All Collections", href: "/shop", num: "01" },
                      { label: "Suits & Tailored Blazers", href: "/category/jackets-suits", num: "02" },
                      { label: "Corporate Gowns", href: "/category/corporate-gowns", num: "03" },
                      { label: "Executive Shirts", href: "/category/shirts", num: "04" },
                      { label: "Made to Order & Bespoke", href: "/shop?madeToOrder=true", num: "05" },
                    ].map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`group flex items-center justify-between py-2.5 px-2 rounded-xs transition-all ${
                            isActive
                              ? "bg-[#F5F2EB] text-[#1A1A1A] font-semibold"
                              : "text-neutral-800 hover:text-[#1A1A1A] hover:bg-[#F5F2EB]/60"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-[#8C6F45]">
                              {item.num}
                            </span>
                            <span className="font-serif-luxury text-base tracking-wide group-hover:translate-x-1 transition-transform">
                              {item.label}
                            </span>
                          </div>
                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#8C6F45]" />
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* Section 2: The Maison */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[9px] uppercase tracking-[0.25em] font-semibold text-[#8C6F45]">
                      The Maison
                    </span>
                    <span className="h-px flex-1 bg-[#E8E3D8]" />
                  </div>
                  <nav className="flex flex-col space-y-1">
                    {[
                      { label: "Our Story & Heritage", href: "/about" },
                      { label: "Bespoke Concierge", href: "/contact" },
                      { label: "Track Commission", href: "/track" },
                    ].map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={`flex items-center justify-between py-2 px-2 text-xs uppercase tracking-[0.16em] rounded-xs transition-colors ${
                            isActive
                              ? "text-[#8C6F45] font-semibold bg-[#F5F2EB]"
                              : "text-neutral-600 hover:text-[#1A1A1A] hover:bg-[#F5F2EB]/50"
                          }`}
                        >
                          <span>{item.label}</span>
                          {isActive && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#8C6F45]" />
                          )}
                        </Link>
                      );
                    })}
                  </nav>
                </div>

                {/* Section 3: Bespoke Stylist WhatsApp Card */}
                <div className="p-4 rounded-xs bg-[#F5F2EB] border border-[#E8E3D8] space-y-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#1A1A1A]">
                      Private Atelier Concierge
                    </span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    Direct styling consultations, measurement scheduling & bespoke tailoring inquiries.
                  </p>
                  <a
                    href="https://wa.me/2348000000000?text=Hello%20FAAVY%20Concierge%2C%20I%20would%20like%20to%20inquire%20about%20a%20bespoke%20commission."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-[#1A1A1A] hover:bg-[#8C6F45] text-white text-[11px] uppercase tracking-[0.16em] font-medium transition-colors rounded-xs min-h-[42px]"
                  >
                    <Phone className="h-3.5 w-3.5 text-[#C5A880]" />
                    <span>WhatsApp Stylist</span>
                  </a>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-5 bg-[#F5F2EB]/80 border-t border-[#E8E3D8] space-y-3">
                <div className="flex items-center justify-between text-[11px] text-neutral-600">
                  <span className="uppercase tracking-wider">Currency: NGN (₦)</span>
                  <Link
                    href="/admin/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-1.5 text-neutral-700 hover:text-[#1A1A1A] uppercase tracking-wider text-[10px] font-medium"
                  >
                    <Shield className="h-3.5 w-3.5 text-[#8C6F45]" />
                    <span>Staff Portal</span>
                  </Link>
                </div>
                <p className="text-[9px] uppercase tracking-[0.25em] text-neutral-500 text-center">
                  Handcrafted in Oye-Ekiti, Ekiti State, Nigeria
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
