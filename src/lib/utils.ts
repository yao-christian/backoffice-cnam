import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAmount(
  amount: number,
  format: "fr" | "de-DE" = "fr"
): string {
  const newFormat = format || "de-DE";
  let currency: "EUR" | "XOF" = "EUR";

  if (newFormat === "fr") {
    currency = "XOF";
  }

  return new Intl.NumberFormat(newFormat, {
    style: "currency",
    currency,
  }).format(amount);
}
