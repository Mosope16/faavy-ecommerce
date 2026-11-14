import React from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, MessageCircle, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

interface FailedPageProps {
  searchParams: Promise<{
    orderNumber?: string;
    reference?: string;
  }>;
}

export default async function FailedPage({ searchParams }: FailedPageProps) {
  const { orderNumber, reference } = await searchParams;

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-16 sm:py-20 px-4">
      <div className="mx-auto max-w-md bg-white border border-[#E8E3D8] p-5 sm:p-10 shadow-lg text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-700">
          <AlertCircle className="h-8 w-8" />
        </div>

        <span className="text-xs uppercase font-semibold tracking-[0.25em] text-rose-700">
          Transaction Incomplete
        </span>

        <h1 className="font-serif-luxury text-xl sm:text-2xl font-medium text-[#1A1A1A]">
          Payment Could Not Be Processed
        </h1>

        <p className="text-xs text-neutral-600 font-light leading-relaxed">
          Your financial institution or card issuer declined the transaction, or the checkout session was discontinued. No funds were debited from your account.
        </p>

        {orderNumber && (
          <div className="bg-[#F5F2EB] p-3 text-xs text-neutral-600 font-mono border border-[#E8E3D8] break-all">
            Order: {orderNumber} {reference ? `• Ref: ${reference}` : ""}
          </div>
        )}

        <div className="pt-4 flex flex-col gap-3">
          <Link
            href="/checkout"
            className="flex items-center justify-center gap-2 bg-[#1A1A1A] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#C5A880] hover:text-[#121212] transition-colors min-h-[44px]"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Try Payment Again</span>
          </Link>

          <a
            href={`https://wa.me/2349138304922?text=${encodeURIComponent(
              `Hello FAAVY, I encountered an issue completing payment for order ${
                orderNumber || "commission"
              }. Could you assist me with bank transfer details?`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 border border-[#25D366] bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#121212] hover:bg-[#E8F8EE] transition-colors min-h-[44px]"
          >
            <MessageCircle className="h-4 w-4 text-[#25D366]" />
            <span>Assist via WhatsApp Concierge</span>
          </a>
        </div>
      </div>
    </div>
  );
}
