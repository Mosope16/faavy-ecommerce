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
} from "lucide-react";

interface ImageUploadDropzoneProps {
  label: string;
  value: string;
  onChange: (url: string, publicId?: string) => void;
  required?: boolean;
  folder?: string;
  helperText?: string;
}

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
    } catch (err: unknown) {
      console.error("Cloudinary upload failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to upload image.";
      setUploadError(msg);
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
        <div>
          <button
            type="button"
            onClick={() => setShowManualInput(!showManualInput)}
            className="text-[10px] text-neutral-500 hover:text-[#C5A880] transition-colors"
          >
            {showManualInput ? "Hide manual URL" : "Paste image URL"}
          </button>
        </div>
      </div>

      {/* Manual URL Input Field */}
      {showManualInput && (
        <div className="p-3 bg-[#1A1A1A] border border-[#2E2E2E] rounded-xs space-y-2">
          <label className="block text-[9px] uppercase font-bold text-neutral-400">
            Direct Image URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://res.cloudinary.com/... or https://..."
              className="flex-1 bg-[#121212] border border-[#333333] px-3 py-2 text-xs text-white focus:border-[#C5A880] focus:outline-hidden"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="px-3 py-2 bg-neutral-800 text-neutral-300 hover:text-white text-xs rounded-xs"
              >
                Clear
              </button>
            )}
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
              <span className="font-medium text-[11px] uppercase tracking-wider">
                Garment Image Ready
              </span>
            </div>
            <p className="text-[10px] text-neutral-400 truncate font-mono max-w-full">
              {value}
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1 flex-wrap">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-[#262626] hover:bg-[#333333] text-neutral-200 rounded-xs border border-[#383838] transition-colors"
              >
                <Edit2 className="h-3 w-3" />
                <span>Replace</span>
              </button>

              <button
                type="button"
                onClick={handleCopyUrl}
                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] text-neutral-400 hover:text-white bg-[#262626] hover:bg-[#333333] rounded-xs border border-[#383838] transition-colors"
                title="Copy URL"
              >
                <Copy className="h-3 w-3" />
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>

              <a
                href={value}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] text-neutral-400 hover:text-[#C5A880] bg-[#262626] hover:bg-[#333333] rounded-xs border border-[#383838] transition-colors"
                title="Open original"
              >
                <ExternalLink className="h-3 w-3" />
              </a>

              <button
                type="button"
                onClick={() => onChange("")}
                className="inline-flex items-center gap-1 px-2 py-1 text-[10px] text-rose-400 hover:text-rose-300 bg-rose-950/40 hover:bg-rose-950/80 rounded-xs border border-rose-900/60 transition-colors ml-auto"
                title="Remove image"
              >
                <X className="h-3 w-3" />
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
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xs cursor-pointer transition-all ${
            isDragOver
              ? "border-[#C5A880] bg-[#C5A880]/10"
              : "border-[#333333] hover:border-[#555555] bg-[#161616]"
          }`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 py-4 text-center">
              <Loader2 className="h-8 w-8 text-[#C5A880] animate-spin" />
              <span className="text-xs font-semibold text-white uppercase tracking-wider">
                Uploading to Cloudinary...
              </span>
              <span className="text-[10px] text-neutral-500">
                Optimizing garment resolution
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2 text-center">
              <div className="h-10 w-10 rounded-full bg-[#222222] border border-[#333333] flex items-center justify-center text-[#C5A880]">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">
                  Click to browse or drag & drop garment photo
                </span>
                <span className="text-[10px] text-neutral-400 block mt-0.5">
                  Supports JPEG, PNG, WebP, AVIF up to 10MB
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Error Message */}
      {uploadError && (
        <div className="flex items-center gap-1.5 text-xs text-rose-400 bg-rose-950/40 p-2 border border-rose-900 rounded-xs">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Helper text */}
      {helperText && (
        <p className="text-[10px] text-neutral-500">{helperText}</p>
      )}
    </div>
  );
}
