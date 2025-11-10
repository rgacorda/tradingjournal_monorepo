import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse a DATEONLY string (YYYY-MM-DD) to a Date object in local timezone
 * This prevents timezone shifts when the backend sends date-only strings
 *
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns Date object in local timezone representing that calendar date
 *
 * @example
 * // Backend sends "2025-10-08"
 * // In PH timezone (UTC+8):
 * new Date("2025-10-08") // ❌ Oct 7, 2025 8:00 PM (timezone shift!)
 * parseDateOnly("2025-10-08") // ✅ Oct 8, 2025 12:00 AM (correct!)
 */
export function parseDateOnly(dateString: string): Date {
  // Split the date string to get year, month, day
  const [year, month, day] = dateString.split('-').map(Number);

  // Create date in local timezone (month is 0-indexed in JS)
  return new Date(year, month - 1, day);
}

/**
 * Format a DATEONLY string for display
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns The same date string (no conversion needed for display)
 */
export function getDateOnlyString(dateString: string): string {
  return dateString;
}
