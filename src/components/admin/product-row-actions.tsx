"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit2, Trash2, ExternalLink, Loader2, AlertTriangle, X } from "lucide-react";

interface ProductRowActionsProps {
  productId: string;
  productName: string;
  productSlug: string;
}

export function ProductRowActions({
  productId,
  productName,
  productSlug,
}: ProductRowActionsProps) {
  const router = useRouter();
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to delete product from database.");
      }

      setIsConfirmingDelete(false);
      router.refresh();
    } catch (err: unknown) {
      console.error("Delete product error:", err);
      setDeleteError(
        err instanceof Error ? err.message : "Network error deleting product."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1.5 sm:gap-2">
      {/* Edit Link */}
      <Link
        href={`/admin/products/${productId}/edit`}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-[#242424] hover:bg-[#C5A880] text-neutral-200 hover:text-[#0D0D0D] text-[11px] font-semibold tracking-wider uppercase transition-colors rounded-xs border border-[#333333]"
        title="Edit Piece & Photos"
      >
        <Edit2 className="h-3 w-3" />
        <span className="hidden sm:inline">Edit</span>
      </Link>

      {/* Delete Trigger */}
      <button
        type="button"
        onClick={() => setIsConfirmingDelete(true)}
        className="inline-flex items-center justify-center h-7 w-7 text-neutral-400 hover:text-rose-400 hover:bg-[#222222] transition-colors rounded-xs border border-transparent hover:border-[#333333]"
        title="Delete Piece Permanently"
        aria-label="Delete Piece"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>

      {/* View on Storefront Link */}
      <Link
        href={`/product/${productSlug}`}
        target="_blank"
        className="inline-flex items-center justify-center h-7 w-7 text-neutral-400 hover:text-[#C5A880] hover:bg-[#222222] transition-colors rounded-xs border border-transparent hover:border-[#333333]"
        title="View Piece on Storefront"
      >
        <ExternalLink className="h-3.5 w-3.5" />
      </Link>

      {/* Confirmation Modal */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
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
              <strong className="text-white">“{productName}”</strong>?
            </p>

            <div className="bg-[#1C1C1C] p-3 border border-[#27272A] rounded-xs text-[11px] text-neutral-400 space-y-1">
              <p>• All variant sizes and SKU allocations will be permanently removed.</p>
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
                onClick={handleDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs uppercase tracking-wider font-semibold text-white bg-rose-600 hover:bg-rose-500 disabled:opacity-50 rounded-xs transition-colors shadow-md"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
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
    </div>
  );
}
