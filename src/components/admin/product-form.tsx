"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, AlertCircle, Check } from "lucide-react";

interface CategoryOption {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: CategoryOption[];
}

export function ProductForm({ categories }: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [basePriceNaira, setBasePriceNaira] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [careInstructions, setCareInstructions] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isMadeToOrder, setIsMadeToOrder] = useState(false);
  const [leadTimeDays, setLeadTimeDays] = useState(0);

  const [imageUrl, setImageUrl] = useState("");
  const [secondaryImageUrl, setSecondaryImageUrl] = useState("");

  const [variants, setVariants] = useState<
    Array<{
      name: string;
      sku: string;
      size: string;
      color: string;
      stockQuantity: number;
      additionalPriceNaira: number;
    }>
  >([
    {
      name: "Standard / Medium",
      sku: "",
      size: "M",
      color: "Classic",
      stockQuantity: 5,
      additionalPriceNaira: 0,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Auto slug generation on name change
  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    setSlug(generatedSlug);
  };

  const addVariantRow = () => {
    setVariants((prev) => [
      ...prev,
      {
        name: "",
        sku: "",
        size: "",
        color: "",
        stockQuantity: 5,
        additionalPriceNaira: 0,
      },
    ]);
  };

  const removeVariantRow = (index: number) => {
    if (variants.length <= 1) return;
    setVariants((prev) => prev.filter((_, i) => i !== index));
  };

  const updateVariantRow = (index: number, field: string, value: unknown) => {
    setVariants((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const basePriceNum = parseFloat(basePriceNaira);
    if (isNaN(basePriceNum) || basePriceNum <= 0) {
      setErrorMsg("Please enter a valid base price in Naira.");
      setIsSubmitting(false);
      return;
    }

    const basePriceInKobo = Math.round(basePriceNum * 100);

    const imagesPayload = [];
    if (imageUrl.trim()) {
      imagesPayload.push({
        url: imageUrl.trim(),
        altText: name,
        isPrimary: true,
      });
    }
    if (secondaryImageUrl.trim()) {
      imagesPayload.push({
        url: secondaryImageUrl.trim(),
        altText: `${name} Secondary`,
        isPrimary: false,
      });
    }

    const variantsPayload = variants.map((v, i) => ({
      name: v.name.trim() || `Variant ${i + 1}`,
      sku:
        v.sku.trim() ||
        `${slug.toUpperCase().slice(0, 6)}-${v.size || "STD"}-${i + 1}`,
      size: v.size.trim() || null,
      color: v.color.trim() || null,
      stockQuantity: Number(v.stockQuantity) || 0,
      additionalPriceInKobo: Math.round(
        (Number(v.additionalPriceNaira) || 0) * 100
      ),
    }));

    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          description,
          details: details.trim() || null,
          careInstructions: careInstructions.trim() || null,
          categoryId,
          basePriceInKobo,
          isFeatured,
          isMadeToOrder,
          leadTimeDays: Number(leadTimeDays) || 0,
          images: imagesPayload,
          variants: variantsPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to create product.");
        setIsSubmitting(false);
      } else {
        router.push("/admin/products");
        router.refresh();
      }
    } catch {
      setErrorMsg("A network error occurred while submitting product.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {errorMsg && (
        <div className="bg-rose-950/80 border border-rose-800 p-4 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Core Garment Identity */}
      <div className="bg-[#161616] border border-[#27272A] p-6 space-y-4">
        <h3 className="font-serif-luxury text-base font-medium text-white border-b border-[#27272A] pb-3">
          1. Garment Identity & Classification
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              Garment Title *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="e.g. The Sovereign Peak Lapel Blazer"
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              Unique URL Slug *
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. sovereign-peak-lapel-blazer"
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-xs font-mono text-white focus:border-[#C5A880] focus:outline-hidden"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              Category Department *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              Base Price in Naira (₦) *
            </label>
            <input
              type="number"
              required
              step="500"
              value={basePriceNaira}
              onChange={(e) => setBasePriceNaira(e.target.value)}
              placeholder="e.g. 85000"
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
            Editorial Description *
          </label>
          <textarea
            rows={3}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="High-fashion narrative describing the piece's cut, silhouette, and authority..."
            className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              Construction & Details
            </label>
            <textarea
              rows={2}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="e.g. Super 140s wool, hand-stitched pick stitching, horn buttons..."
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              Care Instructions
            </label>
            <textarea
              rows={2}
              value={careInstructions}
              onChange={(e) => setCareInstructions(e.target.value)}
              placeholder="e.g. Specialist dry clean only. Steam gently..."
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 2. Made to Order & Featured Parameters */}
      <div className="bg-[#161616] border border-[#27272A] p-6 space-y-4">
        <h3 className="font-serif-luxury text-base font-medium text-white border-b border-[#27272A] pb-3">
          2. Tailoring Modes & Visibility
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isMadeToOrder}
              onChange={(e) => setIsMadeToOrder(e.target.checked)}
              className="h-4 w-4 rounded-xs border-[#333333] bg-[#1F1F1F] text-[#C5A880]"
            />
            <span className="text-xs text-neutral-300 font-medium">
              Made-to-Order Piece
            </span>
          </label>

          {isMadeToOrder && (
            <div>
              <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1">
                Lead Time in Days
              </label>
              <input
                type="number"
                min="1"
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(parseInt(e.target.value, 10))}
                className="w-full bg-[#1F1F1F] border border-[#333333] p-2.5 text-xs text-white focus:border-[#C5A880]"
              />
            </div>
          )}

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-4 w-4 rounded-xs border-[#333333] bg-[#1F1F1F] text-[#C5A880]"
            />
            <span className="text-xs text-neutral-300 font-medium">
              Highlight on Homepage (Featured)
            </span>
          </label>
        </div>
      </div>

      {/* 3. Imagery Assets */}
      <div className="bg-[#161616] border border-[#27272A] p-6 space-y-4">
        <h3 className="font-serif-luxury text-base font-medium text-white border-b border-[#27272A] pb-3">
          3. Imagery Assets
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              Primary Image URL / Path *
            </label>
            <input
              type="text"
              required
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://res.cloudinary.com/... or image URL"
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400 mb-1.5">
              Secondary Hover Image URL
            </label>
            <input
              type="text"
              value={secondaryImageUrl}
              onChange={(e) => setSecondaryImageUrl(e.target.value)}
              placeholder="Optional secondary detail angle"
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 4. Variants Matrix */}
      <div className="bg-[#161616] border border-[#27272A] p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
          <h3 className="font-serif-luxury text-base font-medium text-white">
            4. Variants & Stock Allocation Matrix ({variants.length})
          </h3>
          <button
            type="button"
            onClick={addVariantRow}
            className="inline-flex items-center gap-1.5 text-xs text-[#C5A880] hover:underline font-semibold"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Variant</span>
          </button>
        </div>

        <div className="space-y-3">
          {variants.map((v, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end bg-[#1C1C1C] p-3 border border-[#2A2A2A]"
            >
              <div className="sm:col-span-3">
                <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">
                  Variant Name
                </label>
                <input
                  type="text"
                  required
                  value={v.name}
                  onChange={(e) =>
                    updateVariantRow(idx, "name", e.target.value)
                  }
                  placeholder="e.g. Charcoal / 40R"
                  className="w-full bg-[#161616] border border-[#333333] p-2 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">
                  SKU Code
                </label>
                <input
                  type="text"
                  value={v.sku}
                  onChange={(e) => updateVariantRow(idx, "sku", e.target.value)}
                  placeholder="Auto-generated if blank"
                  className="w-full bg-[#161616] border border-[#333333] p-2 text-xs font-mono text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">
                  Size
                </label>
                <input
                  type="text"
                  value={v.size}
                  onChange={(e) => updateVariantRow(idx, "size", e.target.value)}
                  placeholder="40R / M"
                  className="w-full bg-[#161616] border border-[#333333] p-2 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  value={v.stockQuantity}
                  onChange={(e) =>
                    updateVariantRow(
                      idx,
                      "stockQuantity",
                      parseInt(e.target.value, 10) || 0
                    )
                  }
                  className="w-full bg-[#161616] border border-[#333333] p-2 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">
                  +Naira
                </label>
                <input
                  type="number"
                  min="0"
                  value={v.additionalPriceNaira}
                  onChange={(e) =>
                    updateVariantRow(
                      idx,
                      "additionalPriceNaira",
                      parseFloat(e.target.value) || 0
                    )
                  }
                  placeholder="0"
                  className="w-full bg-[#161616] border border-[#333333] p-2 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-1 flex justify-end pb-1">
                <button
                  type="button"
                  disabled={variants.length <= 1}
                  onClick={() => removeVariantRow(idx)}
                  className="p-1.5 text-neutral-500 hover:text-rose-400 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Submit */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-[#FAF8F5] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0D0D0D] hover:bg-[#C5A880] transition-colors shadow-lg disabled:bg-neutral-600"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Saving Creation to Database...</span>
            </>
          ) : (
            <span>Publish Piece to Atelier Catalogue</span>
          )}
        </button>
      </div>
    </form>
  );
}
