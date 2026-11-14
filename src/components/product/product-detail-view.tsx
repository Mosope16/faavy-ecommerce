"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  MessageCircle,
  Scissors,
  Truck,
  ShieldCheck,
  Check,
  Plus,
  Minus,
  Ruler,
  Info,
} from "lucide-react";
import { formatNaira } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { buildProductWhatsAppUrl } from "@/lib/whatsapp";
import { LUXURY_EASE } from "@/components/motion/motion-variants";

export interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    slug: string;
    description: string;
    details: string | null;
    careInstructions: string | null;
    basePriceInKobo: number;
    isMadeToOrder: boolean;
    leadTimeDays: number;
    category: {
      id: string;
      name: string;
      slug: string;
    };
    images: Array<{
      id: string;
      url: string;
      altText: string | null;
      isPrimary: boolean;
    }>;
    variants: Array<{
      id: string;
      sku: string;
      name: string;
      size: string | null;
      color: string | null;
      colorHex: string | null;
      stockQuantity: number;
      additionalPriceInKobo: number;
    }>;
  };
  whatsappNumber?: string;
}

export function ProductDetailView({
  product,
  whatsappNumber,
}: ProductDetailProps) {
  const { addItem } = useCart();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    product.variants[0]?.id || ""
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const activeVariant =
    product.variants.find((v) => v.id === selectedVariantId) ||
    product.variants[0];

  const currentPriceInKobo =
    product.basePriceInKobo + (activeVariant?.additionalPriceInKobo || 0);

  const images =
    product.images.length > 0
      ? product.images
      : [
          {
            id: "fallback",
            url: "/images/products/suit-double-breasted.jpg",
            altText: product.name,
            isPrimary: true,
          },
        ];

  const currentImage = images[selectedImageIndex] || images[0];

  const isOutOfStock =
    !product.isMadeToOrder && (activeVariant?.stockQuantity || 0) <= 0;

  const handleAddToCart = () => {
    if (isOutOfStock || !activeVariant) return;

    addItem(
      {
        productId: product.id,
        variantId: activeVariant.id,
        name: product.name,
        variantName: activeVariant.name,
        sku: activeVariant.sku,
        priceInKobo: currentPriceInKobo,
        image: currentImage.url,
        maxStock: activeVariant.stockQuantity,
        isMadeToOrder: product.isMadeToOrder,
        leadTimeDays: product.leadTimeDays,
      },
      quantity
    );

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const whatsappUrl = buildProductWhatsAppUrl({
    productName: product.name,
    variantName: activeVariant?.name,
    sku: activeVariant?.sku,
    priceInKobo: currentPriceInKobo,
    quantity,
    isMadeToOrder: product.isMadeToOrder,
    leadTimeDays: product.leadTimeDays,
    whatsappNumber,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      {/* Left: Gallery Component */}
      <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto shrink-0 pb-2 sm:pb-0">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setSelectedImageIndex(idx)}
                className={`relative h-20 w-16 sm:h-24 sm:w-20 overflow-hidden bg-[#F5F2EB] border transition-all ${
                  selectedImageIndex === idx
                    ? "border-[#8C6F45] ring-1 ring-[#8C6F45]"
                    : "border-[#E8E3D8] hover:border-neutral-400 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.url}
                  alt={img.altText || product.name}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Main Image Frame */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EB] border border-[#E8E3D8]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: LUXURY_EASE }}
              className="relative h-full w-full"
            >
              <Image
                src={currentImage.url}
                alt={currentImage.altText || product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 650px"
                className="object-cover object-top"
              />
            </motion.div>
          </AnimatePresence>

          {/* Badge */}
          <div className="absolute top-4 left-4 z-10">
            {product.isMadeToOrder ? (
              <span className="bg-[#121212]/90 backdrop-blur-xs px-3 py-1 text-xs uppercase font-medium tracking-wider text-[#C5A880] border border-[#C5A880]/30">
                Made to Order • {product.leadTimeDays || 7} Days
              </span>
            ) : (
              <span className="bg-[#FAF8F5]/90 backdrop-blur-xs px-3 py-1 text-xs uppercase font-medium tracking-wider text-neutral-800 border border-[#E8E3D8]">
                Ready to Wear
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Product Attributes & Actions */}
      <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
        <div>
          {/* Breadcrumb Category */}
          <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6F45]">
            {product.category.name}
          </span>

          {/* Title */}
          <h1 className="font-serif-luxury mt-2 text-3xl sm:text-4xl font-normal text-[#1A1A1A] leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-serif-luxury text-2xl sm:text-3xl font-semibold text-[#1A1A1A]">
              {formatNaira(currentPriceInKobo)}
            </span>
            <span className="text-xs text-neutral-500 uppercase tracking-wider">
              NGN (Taxes Included)
            </span>
          </div>

          {/* Short Description */}
          <p className="mt-6 text-sm text-neutral-600 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Variant Selection */}
          {product.variants.length > 0 && (
            <div className="mt-8 border-t border-[#E8E3D8] pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  Select Variant / Size
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-xs text-[#8C6F45] hover:underline"
                >
                  <Ruler className="h-3.5 w-3.5" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {product.variants.map((v) => {
                  const isSelected = v.id === selectedVariantId;
                  const isVarOutOfStock =
                    !product.isMadeToOrder && v.stockQuantity <= 0;

                  return (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariantId(v.id);
                        setQuantity(1);
                      }}
                      disabled={isVarOutOfStock}
                      className={`relative flex flex-col items-start p-3 text-left border transition-all ${
                        isSelected
                          ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                          : isVarOutOfStock
                          ? "border-[#E8E3D8] bg-neutral-100 text-neutral-400 cursor-not-allowed line-through"
                          : "border-[#E8E3D8] bg-white text-neutral-800 hover:border-[#8C6F45]"
                      }`}
                    >
                      <span className="text-xs font-semibold tracking-wide">
                        {v.name}
                      </span>
                      <span className="text-[10px] mt-0.5 opacity-80">
                        {product.isMadeToOrder
                          ? "Bespoke"
                          : v.stockQuantity > 0
                          ? `${v.stockQuantity} in stock`
                          : "Sold out"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* SKU & Stock Availability Note */}
              <div className="pt-2 text-xs text-neutral-500 flex items-center justify-between">
                <span>SKU: {activeVariant?.sku}</span>
                {product.isMadeToOrder ? (
                  <span className="text-[#8C6F45] font-medium flex items-center gap-1">
                    <Scissors className="h-3.5 w-3.5" />
                    Bespoke Handcrafted Piece
                  </span>
                ) : (activeVariant?.stockQuantity || 0) > 0 ? (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <Check className="h-3.5 w-3.5" />
                    Available for Immediate Dispatch
                  </span>
                ) : (
                  <span className="text-red-700 font-medium">Sold Out</span>
                )}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="mt-6 flex items-center gap-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#1A1A1A]">
              Quantity:
            </span>
            <div className="flex items-center border border-[#E8E3D8] bg-white">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 text-neutral-600 hover:text-[#1A1A1A] hover:bg-[#F5F2EB]"
                aria-label="Decrease quantity"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="px-4 text-xs font-semibold">{quantity}</span>
              <button
                onClick={() => {
                  const maxAllowed = product.isMadeToOrder
                    ? 10
                    : activeVariant?.stockQuantity || 1;
                  setQuantity(Math.min(maxAllowed, quantity + 1));
                }}
                className="p-2 text-neutral-600 hover:text-[#1A1A1A] hover:bg-[#F5F2EB]"
                aria-label="Increase quantity"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || justAdded}
              className={`w-full flex items-center justify-center gap-2.5 px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] transition-all shadow-md ${
                isOutOfStock
                  ? "bg-neutral-300 text-neutral-500 cursor-not-allowed"
                  : justAdded
                  ? "bg-emerald-800 text-white"
                  : "bg-[#1A1A1A] text-white hover:bg-[#C5A880] hover:text-[#121212]"
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4 text-white" />
                  <span>Added to Shopping Bag</span>
                </>
              ) : isOutOfStock ? (
                <span>Currently Out of Stock</span>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>Add to Shopping Bag</span>
                </>
              )}
            </button>

            {/* Direct WhatsApp Enquiry Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2.5 border border-[#25D366] bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#121212] hover:bg-[#E8F8EE] transition-colors"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              <span>Enquire & Order via WhatsApp</span>
            </a>
          </div>

          {/* Delivery & Assurance Pills */}
          <div className="mt-8 border-t border-[#E8E3D8] pt-6 grid grid-cols-2 gap-4 text-xs text-neutral-600">
            <div className="flex items-start gap-2.5">
              <Truck className="h-4 w-4 text-[#8C6F45] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#1A1A1A]">
                  Nationwide Dispatch
                </strong>
                <span>Direct delivery from Oye-Ekiti across Nigeria</span>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="h-4 w-4 text-[#8C6F45] shrink-0 mt-0.5" />
              <div>
                <strong className="block text-[#1A1A1A]">
                  Guaranteed Tailoring
                </strong>
                <span>Single-vendor quality and custom fitting support</span>
              </div>
            </div>
          </div>
        </div>

        {/* Garment Details & Accordions */}
        <div className="border-t border-[#E8E3D8] pt-6 space-y-4 text-xs">
          {product.details && (
            <div>
              <h4 className="font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1">
                Construction & Details
              </h4>
              <p className="text-neutral-600 leading-relaxed font-light">
                {product.details}
              </p>
            </div>
          )}

          {product.careInstructions && (
            <div className="pt-2">
              <h4 className="font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1">
                Fabric Care
              </h4>
              <p className="text-neutral-600 leading-relaxed font-light">
                {product.careInstructions}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Size Guide Modal */}
      <AnimatePresence>
        {isSizeGuideOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeGuideOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10 w-full max-w-lg bg-[#FAF8F5] p-6 sm:p-8 border border-[#E8E3D8] shadow-2xl"
            >
              <div className="flex justify-between items-start border-b border-[#E8E3D8] pb-4">
                <h3 className="font-serif-luxury text-xl font-medium text-[#1A1A1A]">
                  FAAVY Corporate Sizing Guide
                </h3>
                <button
                  onClick={() => setIsSizeGuideOpen(false)}
                  className="text-neutral-500 hover:text-[#1A1A1A]"
                >
                  ✕
                </button>
              </div>

              <div className="mt-4 space-y-4 text-xs text-neutral-600 leading-relaxed">
                <p>
                  All FAAVY suits, gowns, and shirts follow British / European tailoring specifications with adjustments for Nigerian executive proportions.
                </p>

                <table className="w-full text-left border-collapse border border-[#E8E3D8]">
                  <thead>
                    <tr className="bg-[#F5F2EB] text-[#1A1A1A]">
                      <th className="p-2 border border-[#E8E3D8]">Size</th>
                      <th className="p-2 border border-[#E8E3D8]">Chest (in)</th>
                      <th className="p-2 border border-[#E8E3D8]">Waist (in)</th>
                      <th className="p-2 border border-[#E8E3D8]">Hip (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2 border border-[#E8E3D8]">UK 8 / 38R</td>
                      <td className="p-2 border border-[#E8E3D8]">34 - 36</td>
                      <td className="p-2 border border-[#E8E3D8]">28 - 30</td>
                      <td className="p-2 border border-[#E8E3D8]">36 - 38</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#E8E3D8]">UK 10 / 40R</td>
                      <td className="p-2 border border-[#E8E3D8]">38 - 40</td>
                      <td className="p-2 border border-[#E8E3D8]">32 - 34</td>
                      <td className="p-2 border border-[#E8E3D8]">40 - 42</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#E8E3D8]">UK 12 / 42R</td>
                      <td className="p-2 border border-[#E8E3D8]">42 - 44</td>
                      <td className="p-2 border border-[#E8E3D8]">36 - 38</td>
                      <td className="p-2 border border-[#E8E3D8]">44 - 46</td>
                    </tr>
                    <tr>
                      <td className="p-2 border border-[#E8E3D8]">UK 14 / 44R</td>
                      <td className="p-2 border border-[#E8E3D8]">44 - 46</td>
                      <td className="p-2 border border-[#E8E3D8]">38 - 40</td>
                      <td className="p-2 border border-[#E8E3D8]">46 - 48</td>
                    </tr>
                  </tbody>
                </table>

                <div className="bg-[#F5F2EB] p-3 border border-[#E8E3D8] text-[11px] text-[#8C6F45]">
                  Need bespoke measurements taken? Our WhatsApp Concierge can guide you through exact tailor measurements.
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
