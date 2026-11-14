"use client";

import { btn } from "@/components/styles";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-serif text-5xl">Something went wrong.</h1>
      <p className="mt-3 text-sm text-stone-deep">The page did not finish loading. You can try it again.</p>
      <button type="button" className={`${btn} mt-6`} onClick={() => reset()}>
        Try again
      </button>
    </div>
  );
}
