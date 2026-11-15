"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface ShopSortSelectProps {
  currentSort: string;
}

export function ShopSortSelect({ currentSort }: ShopSortSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === "newest") {
      params.delete("sort");
    } else {
      params.set("sort", newSort);
    }
    const query = params.toString();
    router.push(query ? `/shop?${query}` : "/shop");
  };

  return (
    <select
      value={currentSort}
      onChange={handleSortChange}
      aria-label="Sort products"
      className="bg-white border border-[#E8E3D8] px-2.5 py-2 text-xs uppercase tracking-wider text-neutral-800 focus:border-[#1A1A1A] focus:outline-hidden min-h-[36px]"
    >
      <option value="newest">Sort: Newest</option>
      <option value="price-low">Price: Low to High</option>
      <option value="price-high">Price: High to Low</option>
    </select>
  );
}
