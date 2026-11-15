"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import { formatNaira } from "@/lib/utils";
import { buildCartWhatsAppUrl } from "@/lib/whatsapp";
import {
  ShieldCheck,
  ShoppingBag,
  CreditCard,
  MessageCircle,
  AlertCircle,
  Truck,
  Check,
  ArrowLeft,
  Loader2,
  Tag,
  X,
} from "lucide-react";

const NIGERIAN_STATES = [
  "Ekiti",
  "Lagos",
  "Abuja (FCT)",
  "Oyo",
  "Ogun",
  "Ondo",
  "Osun",
  "Rivers",
  "Delta",
  "Edo",
  "Enugu",
  "Anambra",
  "Kano",
  "Kaduna",
  "Abia",
  "Akwa Ibom",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Ebonyi",
  "Gombe",
  "Imo",
  "Jigawa",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Nasarawa",
  "Niger",
  "Plateau",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("Lagos");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [discountCodeInput, setDiscountCodeInput] = useState("");
  const [discountFeedback, setDiscountFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);

  // Validation & pricing from server
  const [isValidating, setIsValidating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [serverSummary, setServerSummary] = useState<{
    subtotalInKobo: number;
    discountInKobo: number;
    discountCode: string | null;
    shippingFeeInKobo: number;
    totalInKobo: number;
    shippingTier: string;
  } | null>(null);

  // Validate prices with server whenever state or items change
  const validateWithServer = async (appliedCode?: string) => {
    if (items.length === 0) return;

    setIsValidating(true);
    setErrorMsg(null);

    const codeToSend =
      appliedCode !== undefined ? appliedCode : discountCodeInput;

    try {
      const res = await fetch("/api/checkout/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          state,
          discountCode: codeToSend || null,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to validate cart pricing.");
      } else {
        setServerSummary({
          subtotalInKobo: data.subtotalInKobo,
          discountInKobo: data.discountInKobo,
          discountCode: data.discountCode,
          shippingFeeInKobo: data.shippingFeeInKobo,
          totalInKobo: data.totalInKobo,
          shippingTier:
            data.shippingEstimate?.serviceTier || "Nationwide Delivery",
        });

        // Provide explicit voucher feedback if user submitted a code
        if (codeToSend && codeToSend.trim().length > 0) {
          if (data.discountError) {
            setDiscountFeedback({
              type: "error",
              message: data.discountError,
            });
          } else if (data.discountMessage) {
            setDiscountFeedback({
              type: "success",
              message: data.discountMessage,
            });
          }
        } else if (appliedCode === "") {
          setDiscountFeedback(null);
        }
      }
    } catch {
      setErrorMsg("Network error verifying pricing with FAAVY server.");
    } finally {
      setIsValidating(false);
      setIsApplyingDiscount(false);
    }
  };

  useEffect(() => {
    validateWithServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, items.length]);

  const handleApplyDiscount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!discountCodeInput.trim()) return;
    setIsApplyingDiscount(true);
    validateWithServer(discountCodeInput.trim());
  };

  const handleRemoveDiscount = () => {
    setDiscountCodeInput("");
    setDiscountFeedback(null);
    validateWithServer("");
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          streetAddress,
          city,
          state,
          deliveryInstructions,
          discountCode: serverSummary?.discountCode || discountCodeInput || undefined,
          items: items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Order creation could not be completed.");
        setIsSubmitting(false);
      } else if (data.authorizationUrl) {
        // Clear local shopping bag before redirecting to payment
        clearCart();
        window.location.href = data.authorizationUrl;
      } else {
        router.push(`/checkout/confirmation?orderNumber=${data.orderNumber}`);
      }
    } catch {
      setErrorMsg("A network exception occurred while initiating payment.");
      setIsSubmitting(false);
    }
  };

  const whatsappUrl = buildCartWhatsAppUrl({
    items: items.map((i) => ({
      productName: i.name,
      variantName: i.variantName,
      sku: i.sku,
      unitPriceInKobo: i.priceInKobo,
      quantity: i.quantity,
    })),
    subtotalInKobo: serverSummary?.subtotalInKobo || 0,
    customerName: fullName || undefined,
    deliveryState: state,
  });

  if (items.length === 0) {
    return (
      <div className="bg-[#FAF8F5] min-h-screen py-24 px-4 text-center">
        <div className="mx-auto max-w-md bg-white border border-[#E8E3D8] p-10 space-y-4 shadow-sm">
          <div className="rounded-full bg-[#F5F2EB] p-4 text-[#8C6F45] mx-auto w-16 h-16 flex items-center justify-center">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <h2 className="font-serif-luxury text-2xl font-medium text-[#1A1A1A]">
            Your Bag is Empty
          </h2>
          <p className="text-xs text-neutral-500 font-light">
            You have no garments selected for checkout. Please explore our executive catalogue.
          </p>
          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-block bg-[#1A1A1A] px-7 py-3 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#C5A880] transition-colors"
            >
              Browse Collections
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back */}
        <div className="mb-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-neutral-500 hover:text-[#1A1A1A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Header */}
        <div className="border-b border-[#E8E3D8] pb-6 mb-10">
          <span className="text-xs uppercase font-semibold tracking-[0.25em] text-[#8C6F45]">
            Secure Checkout
          </span>
          <h1 className="font-serif-luxury mt-1 text-3xl sm:text-4xl font-normal text-[#1A1A1A]">
            Complete Your Commission
          </h1>
          <p className="mt-1 text-xs text-neutral-500 font-light">
            Guest checkout enabled. All transactions encrypted and verified via Paystack.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-8 flex items-center gap-3 bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800">
            <AlertCircle className="h-5 w-5 text-rose-600 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left: Customer Information & Delivery Form */}
          <div className="lg:col-span-7">
            <form onSubmit={handleCheckoutSubmit} className="space-y-8">
              {/* 1. Contact Information */}
              <div className="bg-white border border-[#E8E3D8] p-4 sm:p-8 space-y-4">
                <h3 className="font-serif-luxury text-base sm:text-lg font-medium text-[#1A1A1A] border-b border-[#E8E3D8] pb-3">
                  1. Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chief Adeyemi Ogunlesi"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E3D8] p-3 text-base sm:text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      Phone Number (WhatsApp Active) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+234 803 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E3D8] p-3 text-base sm:text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1">
                    Email Address (Order Confirmation) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="adeyemi@executives.ng"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D8] p-3 text-base sm:text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-hidden"
                  />
                  <p className="mt-1 text-[10px] text-neutral-400">
                    Your digital receipt and shipment tracking links will be sent here.
                  </p>
                </div>
              </div>

              {/* 2. Delivery Address */}
              <div className="bg-white border border-[#E8E3D8] p-4 sm:p-8 space-y-4">
                <h3 className="font-serif-luxury text-base sm:text-lg font-medium text-[#1A1A1A] border-b border-[#E8E3D8] pb-3">
                  2. Nationwide Delivery Destination
                </h3>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1">
                    Street Address & Suite / Floor *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 14 Glover Road, Ikoyi, Floor 3"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D8] p-3 text-base sm:text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      City / Area *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ikoyi or Ado-Ekiti"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E3D8] p-3 text-base sm:text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1">
                      State in Nigeria *
                    </label>
                    <select
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full bg-[#FAF8F5] border border-[#E8E3D8] p-3 text-base sm:text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-hidden"
                    >
                      {NIGERIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st} State
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A] mb-1">
                    Delivery Instructions / Sizing Requests
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Leave with security at the reception, or specific sleeve measurement notes..."
                    value={deliveryInstructions}
                    onChange={(e) => setDeliveryInstructions(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-[#E8E3D8] p-3 text-base sm:text-xs text-[#1A1A1A] focus:border-[#1A1A1A] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || isValidating}
                  className="w-full flex items-center justify-center gap-2.5 bg-[#1A1A1A] px-6 sm:px-8 py-3.5 sm:py-4 text-xs font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#FAF8F5] hover:bg-[#C5A880] hover:text-[#121212] transition-colors shadow-lg disabled:bg-neutral-400 min-h-[48px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Initiating Paystack Gateway...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" />
                      <span>
                        Pay{" "}
                        {serverSummary
                          ? formatNaira(serverSummary.totalInKobo)
                          : "Now"}{" "}
                        with Paystack
                      </span>
                    </>
                  )}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2.5 border border-[#25D366] bg-white px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] text-[#121212] hover:bg-[#E8F8EE] transition-colors min-h-[48px]"
                >
                  <MessageCircle className="h-4 w-4 text-[#25D366]" />
                  <span>Order via WhatsApp Concierge</span>
                </a>
              </div>
            </form>
          </div>

          {/* Right: Order Summary Breakdown */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-[#E8E3D8] p-4 sm:p-8 space-y-6 relative lg:sticky lg:top-28 shadow-sm">
              <h3 className="font-serif-luxury text-lg font-medium text-[#1A1A1A] border-b border-[#E8E3D8] pb-3">
                Order Summary ({items.length})
              </h3>

              {/* Items List */}
              <div className="divide-y divide-[#E8E3D8] max-h-72 overflow-y-auto pr-2">
                {items.map((item) => (
                  <div key={item.variantId} className="flex gap-3 py-3">
                    <div className="relative h-16 w-14 shrink-0 bg-[#F5F2EB] border border-[#E8E3D8] overflow-hidden flex items-center justify-center">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#F5F2EB] to-[#E8E3D8]">
                          <span className="font-serif-luxury text-xs text-[#8C6F45] italic">F</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-serif-luxury text-xs font-medium text-[#1A1A1A] line-clamp-1">
                        {item.name}
                      </h4>
                      <p className="text-[10px] text-neutral-500">
                        {item.variantName} • Qty: {item.quantity}
                      </p>
                      <span className="text-xs font-semibold text-[#1A1A1A] mt-1 block">
                        {formatNaira(item.priceInKobo * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Form */}
              <div className="border-t border-[#E8E3D8] pt-4">
                <label className="block text-[10px] font-semibold uppercase tracking-wider text-neutral-500 mb-1.5">
                  Have a promotional voucher?
                </label>

                {serverSummary?.discountCode ? (
                  <div className="flex items-center justify-between p-2.5 bg-[#F5F2EB] border border-[#C5A880]/50 rounded-xs">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-[#8C6F45]" />
                      <div>
                        <span className="font-mono text-xs font-bold text-[#1A1A1A]">
                          {serverSummary.discountCode}
                        </span>
                        <span className="text-[11px] text-[#8C6F45] block font-medium">
                          {discountFeedback?.type === "success"
                            ? discountFeedback.message
                            : `-${formatNaira(serverSummary.discountInKobo)} applied`}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveDiscount}
                      className="text-[11px] text-neutral-500 hover:text-rose-600 font-medium px-2 py-1 rounded-xs hover:bg-white transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyDiscount} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. FAAVYFIRST"
                        value={discountCodeInput}
                        onChange={(e) => {
                          setDiscountCodeInput(e.target.value);
                          if (discountFeedback) setDiscountFeedback(null);
                        }}
                        className="flex-1 bg-[#FAF8F5] border border-[#E8E3D8] px-3 py-2 text-base sm:text-xs uppercase tracking-wider focus:border-[#1A1A1A] focus:outline-hidden min-h-[40px]"
                      />
                      <button
                        type="submit"
                        disabled={isApplyingDiscount || !discountCodeInput.trim()}
                        className="bg-[#1A1A1A] px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-[#C5A880] disabled:opacity-50 transition-colors min-h-[40px] flex items-center justify-center gap-1.5"
                      >
                        {isApplyingDiscount ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <span>Apply</span>
                        )}
                      </button>
                    </div>

                    {discountFeedback?.type === "error" && (
                      <p className="text-xs text-rose-600 flex items-center gap-1.5 pt-0.5">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{discountFeedback.message}</span>
                      </p>
                    )}
                  </form>
                )}
              </div>

              {/* Cost Calculation Rows */}
              <div className="border-t border-[#E8E3D8] pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>
                    {serverSummary
                      ? formatNaira(serverSummary.subtotalInKobo)
                      : "Calculating..."}
                  </span>
                </div>

                {serverSummary && serverSummary.discountInKobo > 0 && (
                  <div className="flex justify-between text-[#8C6F45] font-medium">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" />
                      <span>Voucher ({serverSummary.discountCode || "Applied"})</span>
                    </span>
                    <span>-{formatNaira(serverSummary.discountInKobo)}</span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <Truck className="h-3.5 w-3.5 text-[#8C6F45]" />
                    <span>Nationwide Delivery ({state})</span>
                  </div>
                  <span>
                    {serverSummary?.shippingFeeInKobo === 0
                      ? "Complimentary"
                      : serverSummary
                      ? formatNaira(serverSummary.shippingFeeInKobo)
                      : "₦3,500"}
                  </span>
                </div>

                <div className="border-t border-[#E8E3D8] pt-3 flex justify-between font-serif-luxury text-lg font-bold text-[#1A1A1A]">
                  <span>Total Amount</span>
                  <span>
                    {serverSummary
                      ? formatNaira(serverSummary.totalInKobo)
                      : "..."}
                  </span>
                </div>
              </div>

              {/* Assurance Trust Badges */}
              <div className="border-t border-[#E8E3D8] pt-4 text-[11px] text-neutral-500 space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-[#8C6F45]" />
                  <span>Secured by Paystack (Card, Transfer, USSD)</span>
                </div>
                <p className="text-[10px] text-neutral-400">
                  Orders dispatched directly from FAAVY Atelier, Oye-Ekiti, Nigeria.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
