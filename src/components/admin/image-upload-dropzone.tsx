"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import {
  UploadCloud,
  Check,
  X,
  Loader2,
  AlertCircle,
  Copy,
  ExternalLink,
  Edit2,
  Sparkles,
} from "lucide-react";

interface ImageUploadDropzoneProps {
  label: string;
  value: string;
  onChange: (url: string, publicId?: string) => void;
  required?: boolean;
  folder?: string;
  helperText?: string;
}

const CLOUDINARY_SAMPLES = [
  {
    name: "Executive Gown",
    publicId: "cld-sample-5",
    description: "Yellow couture dress",
  },
  {
    name: "Editorial Style",
    publicId: "cld-sample",
    description: "Fashion editorial portrait",
  },
  {
    name: "Handcrafted Bag",
    publicId: "samples/ecommerce/accessories-bag",
    description: "Corporate leather accessory",
  },
  {
    name: "Executive Shoes",
    publicId: "samples/ecommerce/shoes",
    description: "Bespoke formal footwear",
  },
  {
    name: "Leather Tote",
    publicId: "samples/ecommerce/leather-bag-gray",
    description: "Charcoal leather bag",
  },
  {
    name: "Executive Portrait",
    publicId: "samples/people/smiling-man",
    description: "Gentleman corporate style",
  },
];

export function ImageUploadDropzone({
  label,
  value,
  onChange,
  required = false,
  folder = "faavy/products",
  helperText,
}: ImageUploadDropzoneProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [showSamples, setShowSamples] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    // Validate file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/avif",
    ];
    if (!validTypes.includes(file.type)) {
      setUploadError("Please select a JPEG, PNG, WebP, or AVIF image.");
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("Image file size must be less than 10MB.");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url, data.publicId);
    } catch (err: any) {
      console.error("Cloudinary upload failed:", err);
      setUploadError(err.message || "Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleCopyUrl = () => {
    if (value) {
      navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400">
          {label} {required && <span className="text-[#C5A880]">*</span>}
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setShowSamples(!showSamples);
              setShowManualInput(false);
            }}
            className="text-[10px] text-[#C5A880] hover:underline transition-colors flex items-center gap-1"
          >
            <Sparkles className="h-3 w-3" />
            <span>{showSamples ? "Hide Samples" : "Cloudinary Samples"}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setShowManualInput(!showManualInput);
              setShowSamples(false);
            }}
            className="text-[10px] text-neutral-500 hover:text-[#C5A880] transition-colors"
          >
            {showManualInput ? "Hide manual URL" : "Manual URL input"}
          </button>
        </div>
      </div>

      {/* Cloudinary Sample Selector */}
      {showSamples && (
        <div className="p-3 bg-[#161616] border border-[#2E2E2E] rounded-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#C5A880]">
              Cloudinary Account Samples ({CLOUDINARY_SAMPLES.length})
            </span>
            <span className="text-[9px] text-neutral-500">
              Instant 1-Click Select
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {CLOUDINARY_SAMPLES.map((sample) => {
              const cloudName =
                process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "y7rd6ddp";
              const sampleUrl = `https://res.cloudinary.com/${cloudName}/image/upload/${sample.publicId}.jpg`;
              const isSelected = value === sampleUrl;
              return (
                <button
                  key={sample.publicId}
                  type="button"
                  onClick={() => {
                    onChange(sampleUrl, sample.publicId);
                    setShowSamples(false);
                  }}
                  className={`flex items-center gap-2.5 p-2 rounded-xs border text-left transition-all ${
                    isSelected
                      ? "border-[#C5A880] bg-[#C5A880]/15 text-white"
                      : "border-[#262626] bg-[#1E1E1E] hover:border-[#383838] text-neutral-300 hover:text-white"
                  }`}
                >
                  <div className="relative h-10 w-10 shrink-0 rounded-xs overflow-hidden bg-black/40 border border-[#333333]">
                    <Image
                      src={sampleUrl}
                      alt={sample.name}
                      fill
                      className="object-cover"
                      sizes="40px"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-medium block truncate text-white">
                      {sample.name}
                    </span>
                    <span className="text-[9px] text-neutral-500 block truncate">
                      {sample.description}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Dropzone or Preview */}
      {value ? (
        <div className="relative rounded-xs border border-[#333333] bg-[#1F1F1F] p-3 flex flex-col sm:flex-row items-center gap-4">
          {/* Thumbnail preview */}
          <div className="relative h-24 w-24 sm:h-20 sm:w-20 shrink-0 rounded-xs overflow-hidden border border-[#2E2E2E] bg-neutral-900">
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover"
              sizes="96px"
              unoptimized={!value.includes("res.cloudinary.com")}
            />
          </div>

          {/* Details & Actions */}
          <div className="flex-1 min-w-0 space-y-1.5 w-full text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-emerald-400">
              <Check className="h-3.5 w-3.5" />
              <span className="font-medium text-[11px]">
                {value.includes("res.cloudinary.com")
                  ? "Cloudinary Asset Ready"
                  : "External Image Linked"}
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 truncate font-mono">
              {value}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-xs bg-[#2A2A2A] hover:bg-[#333333] text-neutral-200 hover:text-white transition-colors"
              >
                <Edit2 className="h-3 w-3" />
                <span>Replace</span>
              </button>

              <button
                type="button"
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] rounded-xs bg-[#2A2A2A] hover:bg-[#333333] text-neutral-200 hover:text-white transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-neutral-400 hover:text-white transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
              </a>

              <button
                type="button"
                onClick={() => onChange("")}
                disabled={isUploading}
                className="inline-flex items-center gap-1 px-2 py-1 text-[11px] text-red-400 hover:text-red-300 transition-colors ml-auto"
                title="Remove image"
              >
                <X className="h-3.5 w-3.5" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragOver(true);
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={() => !isUploading && fileInputRef.current?.click()}
          className={`relative rounded-xs border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
            isDragOver
              ? "border-[#C5A880] bg-[#C5A880]/5"
              : "border-[#333333] hover:border-[#C5A880]/60 bg-[#1A1A1A]/70 hover:bg-[#1A1A1A]"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center justify-center space-y-2 py-2">
              <Loader2 className="h-7 w-7 text-[#C5A880] animate-spin" />
              <span className="text-xs font-medium text-white">
                Uploading directly to Cloudinary...
              </span>
              <span className="text-[10px] text-neutral-400">
                Optimizing image for luxury storefront presentation
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="h-10 w-10 rounded-full bg-[#242424] border border-[#333333] flex items-center justify-center text-[#C5A880]">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-white">
                  Click to browse or drag & drop garment photo
                </p>
                <p className="text-[10px] text-neutral-500">
                  JPEG, PNG, WebP or AVIF (Up to 10MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Manual Input Fallback */}
      {showManualInput && (
        <div className="pt-2">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://res.cloudinary.com/... or paste image URL"
            className="w-full bg-[#1F1F1F] border border-[#333333] p-2.5 text-xs text-white focus:border-[#C5A880] focus:outline-hidden font-mono"
          />
        </div>
      )}

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950/40 border border-red-900/60 p-2.5 rounded-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {helperText && !uploadError && (
        <p className="text-[10px] text-neutral-500">{helperText}</p>
      )}
    </div>
  );
}
