import { site } from "./site";
import { findCity } from "./shipping";
import type { PaymentMethod, ShippingMethod } from "./types";

export function discountFor(
  subtotal: number,
  code?: string,
): { discount: number; error?: string; applied?: string } {
  if (!code?.trim()) return { discount: 0 };
  const normalized = code.trim().toUpperCase();
  if (normalized === "EVOLVE10") {
    return { discount: Math.min(subtotal, Math.round(subtotal * 0.1)), applied: normalized };
  }
  if (normalized === "WELCOME500") {
    if (subtotal < 5000) {
      return {
        discount: 0,
        error: "WELCOME500 applies on orders of PKR 5,000 or more.",
      };
    }
    return { discount: Math.min(500, subtotal), applied: normalized };
  }
  return { discount: 0, error: "This code is not recognised." };
}

export function shippingQuote(input: {
  merchandise: number;
  city?: string;
  method: ShippingMethod;
}): { shipping: number; eta: string; error?: string } {
  if (!input.city) {
    return { shipping: 0, eta: "Choose a city to see delivery timing.", error: "city" };
  }
  const city = findCity(input.city);
  if (!city) return { shipping: 0, eta: "", error: "We do not deliver to that city yet." };

  const standardFree = input.merchandise >= site.freeShippingThreshold;
  if (input.method === "express") {
    if (city.zone !== "metro") {
      return {
        shipping: 0,
        eta: "",
        error: "Express delivery is available in Karachi, Lahore, Islamabad and Rawalpindi.",
      };
    }
    return {
      shipping: standardFree ? 400 : 650,
      eta: "1–2 days after dispatch",
    };
  }

  const rate = city.zone === "metro" ? 250 : city.zone === "major" ? 400 : 550;
  const eta =
    city.zone === "metro" ? "2–4 days after dispatch" : city.zone === "major" ? "3–5 days after dispatch" : "4–7 days after dispatch";
  return { shipping: standardFree ? 0 : rate, eta };
}

export function codFeeFor(merchandise: number, method: PaymentMethod): number {
  if (method !== "cod") return 0;
  if (merchandise >= site.freeShippingThreshold) return 0;
  return site.codFee;
}

export function orderTotal(input: {
  subtotal: number;
  discount: number;
  shipping: number;
  codFee: number;
}): number {
  return Math.max(0, input.subtotal - input.discount) + input.shipping + input.codFee;
}
