import React from "react";

export function AnnouncementBar() {
  return (
    <div className="bg-[#121212] px-3 sm:px-4 py-2 sm:py-2.5 text-center text-[10px] sm:text-[11px] font-medium tracking-wider sm:tracking-widest uppercase text-[#FAF8F5]/90 border-b border-[#2A2A2A]">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 sm:gap-4 flex-wrap leading-tight">
        <span>Complimentary nationwide delivery on orders over ₦100,000</span>
        <span className="hidden md:inline text-[#C5A880]">•</span>
        <span className="hidden md:inline text-neutral-400">Handcrafted in Oye-Ekiti, Nigeria</span>
        <span className="hidden lg:inline text-[#C5A880]">•</span>
        <span className="hidden lg:inline text-neutral-400">WhatsApp Concierge Available</span>
      </div>
    </div>
  );
}
