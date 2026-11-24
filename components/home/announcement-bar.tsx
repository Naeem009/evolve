"use client";

import { useEffect, useState } from "react";
import { homeChrome } from "@/lib/home/content";

export function AnnouncementBar() {
  const { messages } = homeChrome();
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || messages.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setVisible(false);
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % messages.length);
        setVisible(true);
      }, 400);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [messages.length, paused]);

  if (messages.length === 0) return null;
  const message = messages[index] ?? messages[0];

  return (
    <div
      className="flex h-8 items-center justify-center bg-ink px-4 text-bone sm:h-9"
      role="region"
      aria-label="Announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <p className={`max-w-full truncate text-center text-[11px] uppercase tracking-[0.16em] transition-opacity duration-500 sm:text-[12px] ${visible ? "opacity-100" : "opacity-0"}`} aria-live="polite">
        {message}
      </p>
    </div>
  );
}
