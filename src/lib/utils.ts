import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats integer Kobo into a clean Nigerian Naira string.
 * Example: 3500000 kobo -> "₦35,000"
 */
export function formatNaira(amountInKobo: number): string {
  const naira = Math.floor(amountInKobo / 100);
  return `₦${new Intl.NumberFormat("en-NG").format(naira)}`;
}

/**
 * Formats a date into a clean editorial string.
 * Example: "14 Nov 2026"
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(d);
}

/**
 * Generates an order number with FAAVY format: FAV-YYYYMMDD-XXXX
 */
export function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `FAV-${year}${month}${day}-${random}`;
}
