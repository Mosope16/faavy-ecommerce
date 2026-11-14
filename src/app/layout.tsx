import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/cart-context";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

export const metadata: Metadata = {
  title: "FAAVY | Luxury Nigerian Corporate Fashion House",
  description:
    "Bespoke two-piece suits, executive gowns, Egyptian cotton shirts, and handcrafted fashion accessories. Crafted with distinction in Oye-Ekiti, Nigeria.",
  keywords: [
    "FAAVY",
    "Nigerian corporate wear",
    "bespoke suits Nigeria",
    "luxury fashion Ekiti",
    "executive gowns Lagos",
    "corporate fashion Nigeria",
    "Paystack fashion store",
  ],
  openGraph: {
    title: "FAAVY | Haute Corporate Fashion",
    description: "Bespoke corporate wear and luxury fashion accessories.",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1A1A]">
        <CartProvider>
          <AnnouncementBar />
          <Header />
          <main className="flex-1">{children}</main>
          <CartDrawer />
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
