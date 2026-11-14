"use client";

import { createContext, useContext, useMemo, useRef, useState } from "react";
import type { PricedCart } from "@/lib/types";

type ShopContextValue = {
  cart: PricedCart | null;
  wishlist: string[];
  setCart: (cart: PricedCart) => void;
  setWishlist: (handles: string[]) => void;
  acceptServer: (cart: PricedCart, wishlist: string[]) => void;
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  toast: string | null;
  notify: (message: string) => void;
};

const ShopContext = createContext<ShopContextValue | null>(null);

export function useShop(): ShopContextValue {
  const value = useContext(ShopContext);
  if (!value) throw new Error("useShop must be used within Providers");
  return value;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [cart, setCartState] = useState<PricedCart | null>(null);
  const [wishlist, setWishlistState] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const touched = useRef(false);
  const toastTimer = useRef<number | null>(null);

  const value = useMemo<ShopContextValue>(
    () => ({
      cart,
      wishlist,
      drawerOpen,
      toast,
      setDrawerOpen,
      setCart: (next) => {
        touched.current = true;
        setCartState(next);
      },
      setWishlist: (handles) => {
        touched.current = true;
        setWishlistState(handles);
      },
      acceptServer: (next, handles) => {
        if (touched.current) return;
        setCartState(next);
        setWishlistState(handles);
      },
      notify: (message) => {
        setToast(message);
        if (toastTimer.current) window.clearTimeout(toastTimer.current);
        toastTimer.current = window.setTimeout(() => setToast(null), 2600);
      },
    }),
    [cart, wishlist, drawerOpen, toast],
  );

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}
