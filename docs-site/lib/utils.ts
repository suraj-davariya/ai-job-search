import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind class names, de-duplicating conflicts. shadcn convention.
 * Copied from dashboard/lib/utils.ts (build-prompt §6 — no cross-app import). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
