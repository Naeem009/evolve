"use client";

export function PrintButton() {
  return (
    <button type="button" className="no-print min-h-11 text-[12px] uppercase tracking-[0.14em] underline" onClick={() => window.print()}>
      Print
    </button>
  );
}
