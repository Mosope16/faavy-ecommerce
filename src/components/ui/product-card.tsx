"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingBag, Check } from "lucide-react";
import { formatNaira } from "@/lib/utils";
import { useCart } from "@/context/cart-context";
import { cardHoverVariants } from "@/components/motion/motion-variants";

export interface ProductCardProps {
  id: string;
  name: string;
  slug: string;
  basePriceInKobo: number;
  categoryName: string;
  imageUrl?: string | null;
  secondaryImageUrl?: string | null;
  isMadeToOrder: boolean;
  leadTimeDays?: number;
  variantsCount?: number;
  defaultVariant?: {
    id: string;
    sku: string;
    name: string;
    stockQuantity: number;
    additionalPriceInKobo: number;
  };
}

export function ProductCard({
  id,
  name,
  slug,
  basePriceInKobo,
  categoryName,
  imageUrl,
  secondaryImageUrl,
  isMadeToOrder,
  leadTimeDays,
  defaultVariant,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isHovered, setIsHovered] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const displayImage =
    isHovered && secondaryImageUrl ? secondaryImageUrl : imageUrl;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant) {
      window.location.href = `/product/${slug}`;
      return;
    }

    addItem({
      productId: id,
      variantId: defaultVariant.id,
      name,
      variantName: defaultVariant.name,
      sku: defaultVariant.sku,
      priceInKobo: basePriceInKobo + defaultVariant.additionalPriceInKobo,
      image: imageUrl || "",
      maxStock: defaultVariant.stockQuantity,
      isMadeToOrder,
      leadTimeDays,
    });

    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <motion.div
      variants={cardHoverVariants}
      initial="rest"
      whileHover="hover"
      className="group relative flex flex-col bg-[#FAF8F5] border border-[#E8E3D8] hover:border-[#C5A880]/60 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <Link href={`/product/${slug}`} className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F2EB] flex items-center justify-center">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#F5F2EB] to-[#ECE7DD] p-6 text-center select-none">
            <div className="w-12 h-12 rounded-full border border-[#C5A880]/50 flex items-center justify-center mb-3 transition-transform duration-500 group-hover:scale-110">
              <span className="font-serif-luxury text-xl text-[#8C6F45] italic">F</span>
            </div>
            <span className="text-[10px] uppercase font-semibold tracking-[0.25em] text-[#8C6F45]">
              FAAVY
            </span>
            <span className="font-serif-luxury text-xs text-neutral-700 mt-1 line-clamp-1">
              {name}
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10 max-w-[85%]">
          {isMadeToOrder ? (
            <span className="bg-[#121212]/90 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase font-medium tracking-wider text-[#C5A880] border border-[#C5A880]/30 truncate">
              Made to Order ({leadTimeDays || 7}d)
            </span>
          ) : (
            <span className="bg-[#FAF8F5]/90 backdrop-blur-xs px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] uppercase font-medium tracking-wider text-neutral-800 border border-[#E8E3D8] truncate">
              Ready to Wear
            </span>
          )}
        </div>

        {/* Quick Add Button Overlay (Desktop hover + mobile accessible) */}
        <div className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleQuickAdd}
            disabled={justAdded}
            className="w-full flex items-center justify-center gap-1.5 sm:gap-2 bg-[#121212]/95 backdrop-blur-sm px-3 sm:px-4 py-2 sm:py-2.5 text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-[#FAF8F5] hover:bg-[#C5A880] hover:text-[#121212] transition-colors shadow-lg min-h-[36px]"
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#25D366]" />
                <span className="truncate">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="truncate">Quick Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#8C6F45] font-semibold block">
            {categoryName}
          </span>
          <h3 className="font-serif-luxury mt-1 text-xs sm:text-sm font-medium text-[#1A1A1A] line-clamp-1 group-hover:text-[#8C6F45] transition-colors">
            <Link href={`/product/${slug}`}>{name}</Link>
          </h3>
        </div>

        <div className="mt-2.5 sm:mt-3 flex items-center justify-between border-t border-[#E8E3D8]/60 pt-2.5 sm:pt-3 gap-1">
          <span className="font-serif-luxury text-sm sm:text-base font-semibold text-[#1A1A1A]">
            {formatNaira(basePriceInKobo)}
          </span>
          <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-neutral-500 hover:text-[#1A1A1A] shrink-0">
            View →
          </span>
        </div>
      </div>
    </motion.div>
  );
}
