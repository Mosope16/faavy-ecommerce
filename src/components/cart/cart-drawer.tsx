"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, ArrowRight } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { formatNaira } from "@/lib/utils";
import { buildCartWhatsAppUrl } from "@/lib/whatsapp";
import { drawerVariants } from "@/components/motion/motion-variants";

export function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    subtotalInKobo,
    totalItemsCount,
  } = useCart();
  const pathname = usePathname();

  // Hide cart drawer on administrative routes
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Lock body scroll when cart drawer is open
  React.useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  const FREE_SHIPPING_THRESHOLD = 10000000; // ₦100,000 in kobo
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotalInKobo / FREE_SHIPPING_THRESHOLD) * 100)
  );
  const remainingForFreeShipping = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD - subtotalInKobo
  );

  const whatsappUrl = buildCartWhatsAppUrl({
    items: items.map((i) => ({
      productName: i.name,
      variantName: i.variantName,
      sku: i.sku,
      unitPriceInKobo: i.priceInKobo,
      quantity: i.quantity,
    })),
    subtotalInKobo,
  });

  if (!isMounted) return null;

  return createPortal(
    <AnimatePresence>
      {isCartOpen && (
        <div className="fixed inset-0 z-[9999] flex justify-end">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          {/* Drawer Panel */}
          <motion.div
            variants={drawerVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="relative z-10 flex h-full h-[100dvh] max-h-screen w-full max-w-md flex-col bg-[#FAF8F5] text-[#1A1A1A] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E8E3D8] px-4 sm:px-6 py-4 sm:py-5">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-[#C5A880]" />
                <h2 className="font-serif-luxury text-lg sm:text-xl font-medium tracking-wide">
                  Shopping Bag ({totalItemsCount})
                </h2>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-neutral-500 hover:text-[#1A1A1A] transition-colors focus:outline-hidden"
                aria-label="Close bag"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free Shipping Progress Indicator */}
            <div className="border-b border-[#E8E3D8] bg-[#F5F2EB] px-4 sm:px-6 py-3">
              {remainingForFreeShipping > 0 ? (
                <p className="text-xs text-neutral-600">
                  Add <span className="font-semibold text-[#1A1A1A]">{formatNaira(remainingForFreeShipping)}</span> more for complimentary nationwide delivery.
                </p>
              ) : (
                <p className="text-xs font-medium text-[#8C6F45]">
                  ✓ You have unlocked complimentary nationwide delivery!
                </p>
              )}
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[#E5E0D5]">
                <div
                  className="h-full bg-[#C5A880] transition-[width] duration-500"
                  style={{ width: `${progressToFreeShipping}%` }}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 divide-y divide-[#E8E3D8]">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-[#F5F2EB] p-4 text-[#C5A880] mb-4">
                    <ShoppingBag className="h-8 w-8" />
                  </div>
                  <h3 className="font-serif-luxury text-lg font-medium text-[#1A1A1A]">
                    Your bag is empty
                  </h3>
                  <p className="mt-1 text-sm text-neutral-500 max-w-xs">
                    Explore our bespoke corporate wear, tailored suits, and handcrafted accessories.
                  </p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="mt-6 rounded-none bg-[#1A1A1A] px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] hover:bg-[#C5A880] transition-colors min-h-[44px]"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.variantId} className="flex gap-3 sm:gap-4 py-4">
                    <div className="relative h-20 w-16 sm:h-24 sm:w-20 shrink-0 overflow-hidden bg-[#F5F2EB] border border-[#E8E3D8] flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#F5F2EB] to-[#E8E3D8]">
                          <span className="font-serif-luxury text-sm text-[#8C6F45] italic">F</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-serif-luxury text-xs sm:text-sm font-medium text-[#1A1A1A] line-clamp-1">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeItem(item.variantId)}
                            className="btn-tactile active:scale-90 p-1 min-h-[36px] min-w-[36px] flex items-center justify-center text-neutral-400 hover:text-red-700 transition-colors"
                            aria-label={`Remove ${item.name} from bag`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          {item.variantName}
                        </p>
                        {item.isMadeToOrder && (
                          <span className="inline-block mt-1 text-[9px] sm:text-[10px] uppercase font-semibold text-[#8C6F45] bg-[#F5F2EB] px-1.5 py-0.5">
                            Made to Order ({item.leadTimeDays || 7}d)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-2.5 sm:mt-3">
                        <div className="flex items-center border border-[#E8E3D8] bg-[#FFFFFF]">
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity - 1)
                            }
                            className="btn-tactile active:scale-90 p-1.5 sm:p-2 min-h-[36px] min-w-[36px] flex items-center justify-center text-neutral-600 hover:text-[#1A1A1A] hover:bg-[#F5F2EB] transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 sm:px-2.5 text-xs font-medium tabular-nums select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.variantId, item.quantity + 1)
                            }
                            className="btn-tactile active:scale-90 p-1.5 sm:p-2 min-h-[36px] min-w-[36px] flex items-center justify-center text-neutral-600 hover:text-[#1A1A1A] hover:bg-[#F5F2EB] transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-xs sm:text-sm font-semibold tabular-nums text-[#1A1A1A]">
                          {formatNaira(item.priceInKobo * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="border-t border-[#E8E3D8] bg-[#F5F2EB] px-4 sm:px-6 py-4 sm:py-5">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-serif-luxury tabular-nums text-base sm:text-lg font-semibold text-[#1A1A1A]">
                    {formatNaira(subtotalInKobo)}
                  </span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-neutral-500 mb-3 sm:mb-4">
                  Taxes and regional delivery calculated at checkout.
                </p>

                <div className="flex flex-col gap-2.5">
                  <Link
                    href="/checkout"
                    onClick={() => setIsCartOpen(false)}
                    className="btn-tactile active:scale-[0.97] flex w-full items-center justify-center gap-2 bg-[#1A1A1A] px-4 sm:px-5 py-3 sm:py-3.5 text-xs font-semibold uppercase tracking-wider sm:tracking-widest text-[#FAF8F5] hover:bg-[#C5A880] transition-colors min-h-[44px]"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-tactile active:scale-[0.97] flex w-full items-center justify-center gap-2 border border-[#C5A880] bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-[11px] sm:text-xs font-semibold uppercase tracking-wider sm:tracking-widest text-[#8C6F45] hover:bg-[#FAF8F5] transition-colors min-h-[44px]"
                  >
                    <MessageCircle className="h-4 w-4 text-[#25D366] shrink-0" />
                    <span className="truncate">Order via WhatsApp</span>
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
