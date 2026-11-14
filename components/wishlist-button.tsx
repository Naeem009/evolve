"use client";

import { Heart } from "lucide-react";
import { moveWishlist } from "@/app/actions";
import { useShop } from "./providers";

export function WishlistButton({ handle, className }: { handle: string; className?: string }) {
  const { wishlist, setWishlist, notify } = useShop();
  const saved = wishlist.includes(handle);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={className ?? "absolute top-2 right-2 inline-flex h-11 w-11 items-center justify-center bg-bone/90"}
      onClick={async () => {
        const next = await moveWishlist(handle);
        setWishlist(next);
        notify(saved ? "Removed from wishlist" : "Saved to wishlist");
      }}
    >
      <Heart strokeWidth={1.25} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}
