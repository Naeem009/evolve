"use client";

import { useEffect } from "react";
import type { PricedCart } from "@/lib/types";
import { useShop } from "./providers";

export function CartSyncClient({ cart, wishlist }: { cart: PricedCart; wishlist: string[] }) {
  const { acceptServer } = useShop();
  useEffect(() => {
    acceptServer(cart, wishlist);
  }, [acceptServer, cart, wishlist]);
  return null;
}
