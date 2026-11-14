import { getCart, getWishlist } from "@/lib/server-store";
import { CartSyncClient } from "./cart-sync-client";

export async function CartSync() {
  const [cart, wishlist] = await Promise.all([getCart(), getWishlist()]);
  return <CartSyncClient cart={cart} wishlist={wishlist} />;
}
