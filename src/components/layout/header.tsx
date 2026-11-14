"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Search, Menu, X, Shield, Phone } from "lucide-react";
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/shop?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E8E3D8] transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu Trigger */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-none p-2 text-[#1A1A1A] hover:text-[#C5A880] transition-colors"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Brand Logo */}
        <div className="flex items-center">
          <Link href="/" className="group flex flex-col items-center">
            <span className="font-serif-luxury text-2xl sm:text-3xl font-semibold tracking-[0.25em] text-[#1A1A1A] uppercase transition-colors group-hover:text-[#C5A880]">
              FAAVY
            </span>
            <span className="text-[9px] tracking-[0.35em] text-neutral-500 uppercase -mt-0.5">
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
        <div className="flex items-center space-x-4 sm:space-x-5">
          {/* Search Trigger */}
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 text-neutral-700 hover:text-[#C5A880] transition-colors"
            aria-label="Search items"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Admin link */}
          <Link
            href="/admin"
            className="p-2 text-neutral-700 hover:text-[#C5A880] transition-colors hidden sm:inline-flex"
            title="Admin Portal"
          >
            <Shield className="h-5 w-5" />
          </Link>

          {/* Shopping Bag Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 text-[#1A1A1A] hover:text-[#C5A880] transition-colors"
            aria-label="Open Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItemsCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#1A1A1A] text-[9px] font-bold text-[#FAF8F5]">
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
            className="overflow-hidden border-t border-[#E8E3D8] bg-[#F5F2EB]"
          >
            <form
              onSubmit={handleSearchSubmit}
              className="mx-auto flex max-w-3xl items-center px-4 py-3"
            >
              <Search className="h-5 w-5 text-neutral-400 mr-3" />
              <input
                type="text"
                placeholder="Search bespoke suits, corporate gowns, shirts, trousers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-transparent text-sm text-[#1A1A1A] placeholder-neutral-400 focus:outline-hidden"
              />
              <button
                type="submit"
                className="ml-3 rounded-none bg-[#1A1A1A] px-4 py-1.5 text-xs uppercase tracking-wider text-white hover:bg-[#C5A880] transition-colors"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="ml-2 p-1 text-neutral-400 hover:text-[#1A1A1A]"
              >
                <X className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-[#E8E3D8] bg-[#FAF8F5] px-6 py-6 lg:hidden"
          >
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-serif-luxury text-lg tracking-wide text-[#1A1A1A] hover:text-[#C5A880] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-4 border-t border-[#E8E3D8] flex flex-col gap-3">
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-600 hover:text-[#1A1A1A]"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin Dashboard</span>
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-600 hover:text-[#1A1A1A]"
                >
                  <Phone className="h-4 w-4" />
                  <span>Concierge Assistance</span>
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
