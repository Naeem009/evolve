"use client";

import { useEffect, useState } from "react";
import { btn, btnGhost } from "./styles";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem("evolve-consent")) setVisible(true);
  }, []);

  if (!visible) return null;

  function choose(value: "granted" | "denied") {
    window.localStorage.setItem("evolve-consent", value);
    setVisible(false);
  }

  return (
    <div className="no-print fixed inset-x-0 bottom-16 z-30 border-t border-sand bg-bone px-4 py-4 lg:bottom-0">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl text-sm text-stone-deep">
          Essential cookies keep your bag. Analytics and advertising pixels run only if you allow them, and only once those accounts are connected.
        </p>
        <div className="flex gap-2">
          <button type="button" className={btnGhost} onClick={() => choose("denied")}>
            Essential only
          </button>
          <button type="button" className={btn} onClick={() => choose("granted")}>
            Allow
          </button>
        </div>
      </div>
    </div>
  );
}
