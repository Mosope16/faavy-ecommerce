import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
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
} from "lucide-react";
import { getAdminSession } from "@/lib/admin-auth";
import { AdminLogoutButton } from "@/components/admin/admin-logout-button";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/admin/login");
  }
  const adminEmail = session.user.email;
  const navItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Products", href: "/admin/products", icon: Package },
    { label: "Categories", href: "/admin/categories", icon: Layers },
    { label: "Inventory Audit", href: "/admin/inventory", icon: Package },
    { label: "Shipments & Waybills", href: "/admin/shipments", icon: Truck },
    { label: "Client Records", href: "/admin/customers", icon: Users },
    { label: "Vouchers & Discounts", href: "/admin/discounts", icon: Tag },
    { label: "Store Configuration", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#FAF8F5] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 shrink-0 bg-[#141414] border-r border-[#262626] flex flex-col justify-between">
        <div>
          {/* Brand & Portal Header */}
          <div className="p-6 border-b border-[#262626]">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-sm bg-[#1F1F1F] border border-[#333333] flex items-center justify-center text-[#C5A880]">
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

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-[#1E1E1E] rounded-xs transition-colors"
                >
                  <Icon className="h-4 w-4 text-[#C5A880]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar actions */}
        <div className="p-4 border-t border-[#262626] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 text-xs text-neutral-400 hover:text-white hover:bg-[#1E1E1E] rounded-xs transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="h-3.5 w-3.5 text-neutral-500" />
          </Link>
          <div className="px-3.5 py-2 text-[10px] text-neutral-500">
            <span>Oye-Ekiti Node • NGN Kobo</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0D0D0D]">
        {/* Topbar */}
        <header className="h-16 border-b border-[#262626] bg-[#141414] px-6 flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-neutral-400">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
            <span>Database Connected (Neon PostgreSQL)</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-neutral-400">Signed in as:</span>
            <span className="font-semibold text-[#C5A880]">{adminEmail}</span>
            <AdminLogoutButton />
          </div>
        </header>

        {/* Child Pages */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
