"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

export function TrackPurchase({ id, value }: { id: string; value: number }) {
  const sent = useRef(false);
  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    const key = `evolve-purchase-${id}`;
    if (window.sessionStorage.getItem(key)) return;
    window.sessionStorage.setItem(key, "1");
    track("purchase", { transaction_id: id, value });
  }, [id, value]);
  return null;
}
