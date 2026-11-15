"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2, AlertCircle, CheckCircle, ExternalLink, ArrowLeft, AlertTriangle, X } from "lucide-react";
import { ImageUploadDropzone } from "@/components/admin/image-upload-dropzone";

export interface CategoryOption {
  id: string;
  name: string;
}

export interface InitialProductData {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  basePriceInKobo: number;
  description: string;
  details?: string | null;
  careInstructions?: string | null;
  isFeatured: boolean;
  isActive: boolean;
  isMadeToOrder: boolean;
  leadTimeDays: number;
  images: Array<{
    id?: string;
    url: string;
    publicId?: string | null;
    altText?: string | null;
    isPrimary: boolean;
    displayOrder?: number;
  }>;
  variants: Array<{
    id?: string;
    name: string;
    sku: string;
    size?: string | null;
    color?: string | null;
    stockQuantity: number;
    additionalPriceInKobo?: number;
    isActive?: boolean;
  }>;
}

interface ProductFormProps {
  categories: CategoryOption[];
  initialProduct?: InitialProductData;
  isEditing?: boolean;
}

export function ProductForm({ categories, initialProduct, isEditing = false }: ProductFormProps) {
  const router = useRouter();

  const [name, setName] = useState(initialProduct?.name || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [categoryId, setCategoryId] = useState(
    initialProduct?.categoryId || categories[0]?.id || ""
  );
  const [basePriceNaira, setBasePriceNaira] = useState(
    initialProduct ? (initialProduct.basePriceInKobo / 100).toString() : ""
  );
  const [description, setDescription] = useState(initialProduct?.description || "");
  const [details, setDetails] = useState(initialProduct?.details || "");
  const [careInstructions, setCareInstructions] = useState(
    initialProduct?.careInstructions || ""
  );
  const [isFeatured, setIsFeatured] = useState(initialProduct?.isFeatured ?? false);
  const [isActive, setIsActive] = useState(initialProduct?.isActive ?? true);
  const [isMadeToOrder, setIsMadeToOrder] = useState(
    initialProduct?.isMadeToOrder ?? false
  );
  const [leadTimeDays, setLeadTimeDays] = useState(initialProduct?.leadTimeDays ?? 0);

  // Extract initial images
  const primaryImg = initialProduct?.images?.find((img) => img.isPrimary) || initialProduct?.images?.[0];
  const secondaryImg = initialProduct?.images?.find((img) => img !== primaryImg);
  const tertiaryImg = initialProduct?.images?.find((img) => img !== primaryImg && img !== secondaryImg);

  const [imageUrl, setImageUrl] = useState(primaryImg?.url || "");
  const [imagePublicId, setImagePublicId] = useState(primaryImg?.publicId || "");

  const [secondaryImageUrl, setSecondaryImageUrl] = useState(secondaryImg?.url || "");
  const [secondaryImagePublicId, setSecondaryImagePublicId] = useState(secondaryImg?.publicId || "");

  const [tertiaryImageUrl, setTertiaryImageUrl] = useState(tertiaryImg?.url || "");
  const [tertiaryImagePublicId, setTertiaryImagePublicId] = useState(tertiaryImg?.publicId || "");

  // Variants state
  const [variants, setVariants] = useState<
    Array<{
      id?: string;
      name: string;
      sku: string;
      size: string;
      color: string;
      stockQuantity: number;
      additionalPriceNaira: number;
      isActive: boolean;
    }>
  >(
    initialProduct?.variants?.length
      ? initialProduct.variants.map((v) => ({
          id: v.id,
          name: v.name,
          sku: v.sku,
          size: v.size || "",
          color: v.color || "",
          stockQuantity: v.stockQuantity,
          additionalPriceNaira: (v.additionalPriceInKobo || 0) / 100,
          isActive: v.isActive ?? true,
        }))
      : [
          {
            name: "Standard / Medium",
            sku: "",
            size: "M",
            color: "Classic",
            stockQuantity: 5,
            additionalPriceNaira: 0,
            isActive: true,
          },
        ]
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Deletion state
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const markAllOutOfStock = () => {
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        stockQuantity: 0,
      }))
    );
  };

  const restockAll = (amount: number = 5) => {
    setVariants((prev) =>
      prev.map((v) => ({
        ...v,
        stockQuantity: v.stockQuantity + amount,
      }))
    );
  };

  const handleDeleteProduct = async () => {
    if (!initialProduct?.id) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/admin/products/${initialProduct.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to permanently delete product.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err: unknown) {
      console.error("Delete product error:", err);
      setDeleteError(
        err instanceof Error ? err.message : "Error deleting product from database."
      );
      setIsDeleting(false);
    }
  };

  // Auto slug generation on name change (only for brand new products)
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      const generatedSlug = val
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generatedSlug);
    }
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
        isActive: true,
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
    setSuccessMsg(null);

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
        publicId: imagePublicId || null,
        altText: name,
        isPrimary: true,
        displayOrder: 0,
      });
    }
    if (secondaryImageUrl.trim()) {
      imagesPayload.push({
        url: secondaryImageUrl.trim(),
        publicId: secondaryImagePublicId || null,
        altText: `${name} - Model / Reverse Angle`,
        isPrimary: false,
        displayOrder: 1,
      });
    }
    if (tertiaryImageUrl.trim()) {
      imagesPayload.push({
        url: tertiaryImageUrl.trim(),
        publicId: tertiaryImagePublicId || null,
        altText: `${name} - Texture & Craft Detail`,
        isPrimary: false,
        displayOrder: 2,
      });
    }

    const variantsPayload = variants.map((v, i) => ({
      id: v.id,
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
      isActive: v.isActive,
    }));

    try {
      const endpoint = isEditing && initialProduct?.id
        ? `/api/admin/products/${initialProduct.id}`
        : "/api/admin/products";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(endpoint, {
        method,
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
          isActive,
          isMadeToOrder,
          leadTimeDays: Number(leadTimeDays) || 0,
          images: imagesPayload,
          variants: variantsPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to save garment changes.");
        setIsSubmitting(false);
      } else {
        if (isEditing) {
          setSuccessMsg("Garment details, pricing, and images updated successfully.");
          setIsSubmitting(false);
          router.refresh();
        } else {
          router.push("/admin/products");
          router.refresh();
        }
      }
    } catch {
      setErrorMsg("A network error occurred while communicating with the server.");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
      {/* Success Notification */}
      {successMsg && (
        <div className="bg-emerald-950/80 border border-emerald-600/80 p-4 text-xs text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg rounded-xs">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
            <span className="font-medium">{successMsg}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/product/${slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-[#C5A880] hover:underline font-semibold"
            >
              <span>View Piece</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/admin/products"
              className="px-2.5 py-1 bg-emerald-900/60 hover:bg-emerald-800 text-white rounded-xs text-[11px] font-medium"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {errorMsg && (
        <div className="bg-rose-950/80 border border-rose-800 p-4 text-xs text-rose-300 flex items-center gap-2 rounded-xs shadow-md">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. Core Garment Identity */}
      <div className="bg-[#161616] border border-[#27272A] p-4 sm:p-6 space-y-4 rounded-xs">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
          <h3 className="font-serif-luxury text-base font-medium text-white">
            1. Garment Identity & Classification
          </h3>
          {isEditing && (
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 bg-[#222222] text-[#C5A880] border border-[#333333]">
              Editing ID: {initialProduct?.id?.slice(0, 8)}...
            </span>
          )}
        </div>

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
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
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
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-base sm:text-xs font-mono text-white focus:border-[#C5A880] focus:outline-hidden"
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
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-hidden min-h-[44px]"
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
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
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
            className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
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
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
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
              placeholder="e.g. Specialist dry clean only. Steam gently between wearings..."
              className="w-full bg-[#1F1F1F] border border-[#333333] p-3 text-base sm:text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* 2. Tailoring Modes & Visibility */}
      <div className="bg-[#161616] border border-[#27272A] p-4 sm:p-6 space-y-4 rounded-xs">
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

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="h-4 w-4 rounded-xs border-[#333333] bg-[#1F1F1F] text-[#C5A880]"
            />
            <span className="text-xs text-neutral-300 font-medium">
              Active in Storefront Catalogue
            </span>
          </label>
        </div>
      </div>

      {/* 3. Imagery Assets (Direct Cloudinary Upload & Edit) */}
      <div className="bg-[#161616] border border-[#27272A] p-4 sm:p-6 space-y-6 rounded-xs">
        <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
          <div>
            <h3 className="font-serif-luxury text-base font-medium text-white">
              3. Garment Imagery & Atelier Photos
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Upload high-resolution photography, replace existing images, or choose Cloudinary presets.
            </p>
          </div>
          <span className="text-[10px] text-[#C5A880] uppercase tracking-wider font-medium px-2 py-1 bg-[#202020] border border-[#333333]">
            Cloudinary Powered
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ImageUploadDropzone
            label="Primary Garment Image *"
            value={imageUrl}
            onChange={(url, pubId) => {
              setImageUrl(url);
              if (pubId) setImagePublicId(pubId);
            }}
            required
            folder="faavy/products"
            helperText="Main hero visual displayed on the homepage, catalogue grid, and bag."
          />

          <ImageUploadDropzone
            label="Secondary / Hover Perspective"
            value={secondaryImageUrl}
            onChange={(url, pubId) => {
              setSecondaryImageUrl(url);
              if (pubId) setSecondaryImagePublicId(pubId);
            }}
            folder="faavy/products"
            helperText="Revealed when patrons hover over cards on desktop or swipe on mobile."
          />
        </div>

        <div className="border-t border-[#262626] pt-6">
          <ImageUploadDropzone
            label="Tertiary Detail / Fabric Close-Up (Optional)"
            value={tertiaryImageUrl}
            onChange={(url, pubId) => {
              setTertiaryImageUrl(url);
              if (pubId) setTertiaryImagePublicId(pubId);
            }}
            folder="faavy/products"
            helperText="Close-up detailing textile weave, lapel stitching, or signature hardware."
          />
        </div>
      </div>

      {/* 4. Variants Matrix */}
      <div className="bg-[#161616] border border-[#27272A] p-4 sm:p-6 space-y-4 rounded-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#27272A] pb-3">
          <div>
            <h3 className="font-serif-luxury text-base font-medium text-white">
              4. Variants & Stock Allocation Matrix ({variants.length})
            </h3>
            <p className="text-xs text-neutral-400 mt-0.5">
              Manage size allocations, stock units, and surcharges.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <button
              type="button"
              onClick={markAllOutOfStock}
              className="px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-800 text-amber-300 text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-colors"
              title="Set all variant quantities to 0"
            >
              Zero All (Out of Stock)
            </button>
            <button
              type="button"
              onClick={() => restockAll(5)}
              className="px-2.5 py-1 bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800 text-emerald-300 text-[11px] font-semibold uppercase tracking-wider rounded-xs transition-colors"
              title="Add 5 units to every variant"
            >
              Restock All (+5)
            </button>
            <button
              type="button"
              onClick={addVariantRow}
              className="inline-flex items-center gap-1.5 text-xs text-[#C5A880] hover:underline font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Variant</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {variants.map((v, idx) => (
            <div
              key={v.id || idx}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end bg-[#1C1C1C] p-3 border border-[#2A2A2A] rounded-xs"
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
                  className="w-full bg-[#161616] border border-[#333333] p-2 text-base sm:text-xs text-white"
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
                  className="w-full bg-[#161616] border border-[#333333] p-2 text-base sm:text-xs font-mono text-white"
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
                  className="w-full bg-[#161616] border border-[#333333] p-2 text-base sm:text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">
                  Stock Units
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
                  className="w-full bg-[#161616] border border-[#333333] p-2 text-base sm:text-xs text-white"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">
                  +₦ Price
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
                  className="w-full bg-[#161616] border border-[#333333] p-2 text-base sm:text-xs text-white"
                />
              </div>

              <div className="sm:col-span-1 flex justify-end pb-1">
                <button
                  type="button"
                  disabled={variants.length <= 1}
                  onClick={() => removeVariantRow(idx)}
                  className="p-1.5 text-neutral-500 hover:text-rose-400 disabled:opacity-30"
                  title="Remove variant"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Danger Zone / Permanent Deletion (Editing Mode Only) */}
      {isEditing && initialProduct && (
        <div className="bg-[#1C1414] border border-rose-900/40 p-4 sm:p-6 space-y-4 rounded-xs mt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-rose-400">
                Atelier Danger Zone
              </span>
              <h3 className="font-serif-luxury text-base font-medium text-white mt-0.5">
                Permanent Garment Removal
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Permanently purge this piece, all variant inventory records, and photo associations from the database.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-700/60 text-rose-200 text-xs font-semibold uppercase tracking-wider rounded-xs transition-colors shrink-0 shadow-sm"
            >
              <Trash2 className="h-4 w-4 text-rose-400" />
              <span>Delete Piece Permanently</span>
            </button>
          </div>
        </div>
      )}

      {/* Action Submit */}
      <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 bg-[#FAF8F5] px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-[#0D0D0D] hover:bg-[#C5A880] transition-colors shadow-lg disabled:bg-neutral-600 rounded-xs min-h-[48px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{isEditing ? "Saving Changes to Database..." : "Publishing Piece to Catalogue..."}</span>
            </>
          ) : (
            <span>{isEditing ? "Save Garment & Image Changes" : "Publish Piece to Atelier Catalogue"}</span>
          )}
        </button>

        {isEditing && (
          <Link
            href="/admin/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 border border-[#333333] hover:border-neutral-400 text-neutral-300 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors rounded-xs min-h-[48px]"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Cancel</span>
          </Link>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#161616] border border-[#2A2A2A] rounded-xs shadow-2xl p-5 space-y-4 text-left">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle className="h-4 w-4" />
                <h3 className="font-serif-luxury text-sm font-semibold uppercase tracking-wider text-white">
                  Confirm Permanent Deletion
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsConfirmingDelete(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-white">“{name || initialProduct?.name}”</strong>?
            </p>

            <div className="bg-[#1C1C1C] p-3 border border-[#27272A] rounded-xs text-[11px] text-neutral-400 space-y-1">
              <p>• All variant sizes, SKU allocations, and stock will be permanently removed.</p>
              <p>• All associated gallery imagery and inventory logs will be deleted.</p>
              <p>• This action cannot be undone.</p>
            </div>

            {deleteError && (
              <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 border border-rose-900 rounded-xs">
                {deleteError}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setIsConfirmingDelete(false)}
                className="px-3.5 py-2 text-xs uppercase tracking-wider text-neutral-400 hover:text-white border border-[#333333] rounded-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteProduct}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 rounded-xs transition-colors shadow-md"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting from Database...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete Piece</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
