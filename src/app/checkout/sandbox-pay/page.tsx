import React from "react";
import Link from "next/link";
import { formatNaira } from "@/lib/utils";
import { ShieldCheck, CreditCard, AlertTriangle, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

interface SandboxPayProps {
  searchParams: Promise<{
    reference?: string;
    orderNumber?: string;
    amount?: string;
  }>;
}

export default async function SandboxPayPage({ searchParams }: SandboxPayProps) {
  const params = await searchParams;
  const reference = params.reference || "FAV-REF-SAMPLE";
  const orderNumber = params.orderNumber || "FAV-SAMPLE";
  const amountInKobo = parseInt(params.amount || "0", 10);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-16 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-[#E8E3D8] shadow-xl p-8 space-y-6">
        {/* Sandbox Notice Banner */}
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900">
          <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
          <span>Paystack Sandbox Environment (Dev Mode)</span>
        </div>

        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#8C6F45]">
            FAAVY Secured Checkout
          </span>
          <h1 className="font-serif-luxury text-2xl font-medium text-[#1A1A1A]">
            Pay with Paystack Test Gateway
          </h1>
          <p className="text-xs text-neutral-500">
            Order Reference: <strong className="text-[#1A1A1A]">{orderNumber}</strong>
          </p>
        </div>

        <div className="bg-[#F5F2EB] p-4 text-center border border-[#E8E3D8]">
          <span className="text-xs text-neutral-500 block">Amount Payable</span>
          <span className="font-serif-luxury text-3xl font-semibold text-[#1A1A1A] mt-1 block">
            {formatNaira(amountInKobo)}
          </span>
          <span className="text-[10px] text-neutral-400 mt-1 block font-mono">
            Trx Ref: {reference}
          </span>
        </div>

        <div className="space-y-3 pt-2">
          <form action="/checkout/verify" method="GET">
            <input type="hidden" name="reference" value={reference} />
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#09A5DB] px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#078DBB] transition-colors shadow-sm"
            >
              <CreditCard className="h-4 w-4" />
              <span>Authorize Successful Payment (Test)</span>
            </button>
          </form>

          <Link
            href={`/checkout/failed?orderNumber=${orderNumber}&reference=${reference}`}
            className="w-full flex items-center justify-center gap-2 border border-neutral-300 bg-white px-6 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-600 hover:bg-neutral-50 transition-colors"
          >
            <span>Simulate Payment Decline</span>
          </Link>
        </div>

        <div className="text-center pt-4 border-t border-[#E8E3D8] text-[11px] text-neutral-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-[#C5A880]" />
          <span>256-bit TLS Encrypted Transaction</span>
        </div>
      </div>
    </div>
  );
}
