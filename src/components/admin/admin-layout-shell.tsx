"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Truck,
  Users,
  Tag,
  Settings,
  ExternalLink,
  Shield,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

interface AdminLayoutShellProps {
  adminEmail: string;
  children: React.ReactNode;
}

export function AdminLayoutShell({
  adminEmail,
  children,
}: AdminLayoutShellProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  const navSections = [
    {
      title: "Operations",
      items: [
        { label: "Overview", href: "/admin", icon: LayoutDashboard },
        { label: "Orders & Commissions", href: "/admin/orders", icon: ShoppingBag },
        { label: "Shipments & Waybills", href: "/admin/shipments", icon: Truck },
      ],
    },
    {
      title: "Catalogue & Atelier",
      items: [
        { label: "Products Directory", href: "/admin/products", icon: Package },
        { label: "Garment Categories", href: "/admin/categories", icon: Layers },
        { label: "Inventory & Matrix Audit", href: "/admin/inventory", icon: Package },
      ],
    },
    {
      title: "Patrons & Marketing",
      items: [
        { label: "Client Records", href: "/admin/customers", icon: Users },
        { label: "Vouchers & Discounts", href: "/admin/discounts", icon: Tag },
      ],
    },
    {
      title: "Settings",
      items: [
        { label: "Store Configuration", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileNavOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileNavOpen]);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#FAF8F5] flex flex-col md:flex-row">
      {/* Desktop Permanent Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 bg-[#141414] border-r border-[#262626] flex-col justify-between">
        <div className="overflow-y-auto">
          {/* Brand & Portal Header */}
          <div className="p-6 border-b border-[#262626]">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-xs bg-[#1F1F1F] border border-[#333333] flex items-center justify-center text-[#C5A880]">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <span className="font-serif-luxury text-base font-semibold tracking-wider text-white block">
                  FAAVY ADMIN
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A880] block">
                  Atelier Control
                </span>
              </div>
            </Link>
          </div>

          {/* Categorized Navigation Links */}
          <div className="p-3.5 space-y-4">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="px-3 py-1 text-[9px] uppercase tracking-[0.2em] font-semibold text-neutral-500">
                  {section.title}
                </div>
                <nav className="space-y-0.5">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    const isActive =
                      item.href === "/admin"
                        ? pathname === "/admin"
                        : pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-xs transition-colors ${
                          isActive
                            ? "bg-[#1E1E1E] text-white font-semibold border-l-2 border-[#C5A880]"
                            : "text-neutral-400 hover:text-white hover:bg-[#1E1E1E]/60"
                        }`}
                      >
                        <Icon
                          className={`h-4 w-4 ${
                            isActive ? "text-[#C5A880]" : "text-neutral-500"
                          }`}
                        />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Sidebar actions */}
        <div className="p-4 border-t border-[#262626] space-y-2 shrink-0">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 text-xs text-neutral-400 hover:text-white hover:bg-[#1E1E1E] rounded-xs transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="h-3.5 w-3.5 text-neutral-500" />
          </Link>
          <div className="px-3.5 py-1 text-[10px] text-neutral-500">
            <span>Oye-Ekiti Node • NGN Kobo</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0D0D0D]">
        {/* Topbar: Responsive across all devices */}
        <header className="h-16 border-b border-[#262626] bg-[#141414] px-4 sm:px-6 flex items-center justify-between gap-2">
          {/* Left: Mobile Menu Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden group flex items-center gap-2 px-3 py-2 rounded-xs bg-[#1C1C1C] border border-[#2D2D2D] hover:border-[#C5A880]/60 text-neutral-300 hover:text-white transition-all min-h-[44px]"
              aria-label="Toggle admin navigation menu"
            >
              <div className="flex flex-col justify-center items-start w-4 h-3 gap-1">
                <span className="h-[1.5px] w-4 bg-current transition-all" />
                <span className="h-[1.5px] w-2.5 bg-current transition-all group-hover:w-4" />
              </div>
              <span className="text-[11px] font-medium tracking-wider uppercase text-neutral-400 group-hover:text-white">
                Menu
              </span>
            </button>

            {/* Mobile Brand Title */}
            <div className="flex items-center gap-2 md:hidden">
              <span className="font-serif-luxury text-sm font-semibold tracking-wider text-white">
                FAAVY
              </span>
              <span className="text-[9px] uppercase tracking-wider text-[#C5A880] px-1.5 py-0.5 rounded-xs bg-[#1F1F1F] border border-[#333333]">
                Admin
              </span>
            </div>

            {/* Desktop Database Connection Indicator */}
            <div className="hidden md:flex items-center gap-2 text-xs text-neutral-400">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span>Database Connected (Neon PostgreSQL)</span>
            </div>
          </div>

          {/* Right: User Pill & Logout Button */}
          <div className="flex items-center gap-2 sm:gap-4 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 text-neutral-400">
              <span>Admin:</span>
              <span className="font-semibold text-[#C5A880] truncate max-w-[160px] lg:max-w-xs">
                {adminEmail}
              </span>
            </div>
            <AdminLogoutButton />
          </div>
        </header>

        {/* Mobile Navigation Drawer (Luxury Back-Office Shell) */}
        <AnimatePresence>
          {isMobileNavOpen && (
            <div className="fixed inset-0 z-50 md:hidden">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setIsMobileNavOpen(false)}
                className="absolute inset-0 bg-black/80 backdrop-blur-xs"
                aria-hidden="true"
              />

              {/* Drawer Content */}
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "tween", duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative flex flex-col h-full w-[88%] max-w-[340px] bg-[#121212] border-r border-[#262626] shadow-2xl z-10"
              >
                {/* Drawer Header */}
                <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-[#161616]">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-xs bg-[#1F1F1F] border border-[#333333] flex items-center justify-center text-[#C5A880]">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="font-serif-luxury text-sm font-semibold tracking-wider text-white block">
                        FAAVY ADMIN
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.2em] text-[#C5A880] block">
                        Atelier Control
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMobileNavOpen(false)}
                    className="h-9 w-9 rounded-full bg-[#1F1F1F] border border-[#2E2E2E] hover:border-neutral-500 text-neutral-400 hover:text-white flex items-center justify-center transition-all min-h-[44px] min-w-[44px]"
                    aria-label="Close navigation"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* User info on mobile */}
                <div className="px-5 py-3 border-b border-[#262626] bg-[#0A0A0A] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-neutral-400 truncate text-[11px]">{adminEmail}</span>
                  </div>
                  <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-mono shrink-0">
                    Active
                  </span>
                </div>

                {/* Categorized Navigation Links */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {navSections.map((section) => (
                    <div key={section.title} className="space-y-1">
                      <div className="px-2 py-1 text-[9px] uppercase tracking-[0.2em] font-semibold text-neutral-500">
                        {section.title}
                      </div>
                      <nav className="space-y-1">
                        {section.items.map((item) => {
                          const Icon = item.icon;
                          const isActive =
                            item.href === "/admin"
                              ? pathname === "/admin"
                              : pathname.startsWith(item.href);
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsMobileNavOpen(false)}
                              className={`flex items-center justify-between px-3 py-2.5 text-xs font-medium rounded-xs transition-colors min-h-[44px] ${
                                isActive
                                  ? "bg-gradient-to-r from-[#C5A880]/20 via-[#C5A880]/10 to-transparent text-white font-semibold border-l-2 border-[#C5A880]"
                                  : "text-neutral-400 hover:text-white hover:bg-[#1E1E1E]/60"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Icon
                                  className={`h-4 w-4 ${
                                    isActive ? "text-[#C5A880]" : "text-neutral-500"
                                  }`}
                                />
                                <span>{item.label}</span>
                              </div>
                              {isActive && (
                                <span className="h-1.5 w-1.5 rounded-full bg-[#C5A880]" />
                              )}
                            </Link>
                          );
                        })}
                      </nav>
                    </div>
                  ))}
                </div>

                {/* Drawer Footer Actions */}
                <div className="p-4 border-t border-[#262626] bg-[#0E0E0E] space-y-3">
                  <div className="flex items-center justify-between">
                    <Link
                      href="/"
                      target="_blank"
                      className="inline-flex items-center gap-2 text-xs text-neutral-400 hover:text-white transition-colors py-1"
                    >
                      <ExternalLink className="h-3.5 w-3.5 text-[#C5A880]" />
                      <span>Live Storefront</span>
                    </Link>
                    <AdminLogoutButton />
                  </div>
                  <div className="text-[9px] uppercase tracking-widest text-neutral-600 text-center border-t border-[#1F1F1F] pt-2">
                    Oye-Ekiti Node • NGN Kobo
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Child Pages */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
