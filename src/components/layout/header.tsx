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
      <div className="mx-auto flex h-16 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Mobile Menu Trigger */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="rounded-none p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#1A1A1A] hover:text-[#C5A880] transition-colors focus:outline-hidden"
            aria-label="Open Navigation Menu"
            aria-expanded={isMobileMenuOpen}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Brand Logo */}
        <div className="flex items-center">
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
        <div className="flex items-center space-x-1 sm:space-x-3">
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

      {/* Mobile Drawer Navigation (Slide-in Overlay) */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-[#0D0D0D]/60 backdrop-blur-xs"
              aria-hidden="true"
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col h-full w-[85%] max-w-[340px] bg-[#FAF8F5] shadow-2xl z-10 border-r border-[#E8E3D8]"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E3D8]">
                <div className="flex flex-col">
                  <span className="font-serif-luxury text-xl font-bold tracking-[0.2em] text-[#1A1A1A] uppercase">
                    FAAVY
                  </span>
                  <span className="text-[8px] tracking-[0.3em] text-neutral-500 uppercase -mt-0.5">
                    Haute Corporate
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#1A1A1A] hover:text-[#C5A880] transition-colors focus:outline-hidden"
                  aria-label="Close Navigation Menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <nav className="flex flex-col divide-y divide-[#E8E3D8]/60">
                  {navLinks.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center justify-between py-3.5 text-sm uppercase tracking-[0.16em] transition-colors ${
                          isActive
                            ? "font-semibold text-[#8C6F45]"
                            : "text-[#1A1A1A] hover:text-[#8C6F45]"
                        }`}
                      >
                        <span>{link.label}</span>
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      </Link>
                    );
                  })}
                </nav>

                {/* Secondary Helpful Actions */}
                <div className="mt-6 pt-5 border-t border-[#E8E3D8] flex flex-col gap-3">
                  <Link
                    href="/track"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2 text-xs uppercase tracking-wider text-neutral-700 hover:text-[#1A1A1A]"
                  >
                    <Truck className="h-4 w-4 text-[#8C6F45]" />
                    <span>Track Your Commission</span>
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2 text-xs uppercase tracking-wider text-neutral-700 hover:text-[#1A1A1A]"
                  >
                    <Phone className="h-4 w-4 text-[#8C6F45]" />
                    <span>WhatsApp Concierge</span>
                  </Link>
                  <Link
                    href="/admin/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-2 text-xs uppercase tracking-wider text-neutral-700 hover:text-[#1A1A1A]"
                  >
                    <Shield className="h-4 w-4 text-[#8C6F45]" />
                    <span>Staff Portal</span>
                  </Link>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="p-6 bg-[#F5F2EB] border-t border-[#E8E3D8]">
                <p className="text-[10px] uppercase tracking-widest text-neutral-500 text-center">
                  Handcrafted in Oye-Ekiti, Nigeria
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
