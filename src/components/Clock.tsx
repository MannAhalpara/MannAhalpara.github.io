"use client";

import { useEffect, useState } from "react";
import { identity } from "@/content/content";

const fmt = new Intl.DateTimeFormat("en-GB", {
  timeZone: identity.timezone,
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

/** Live local clock in Asia/Kolkata. Renders a stable placeholder on the server. */
export function Clock({ className, seconds = true }: { className?: string; seconds?: boolean }) {
  const [now, setNow] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const text = now ? (seconds ? now : now.slice(0, 5)) : seconds ? "--:--:--" : "--:--";
  return (
    <span className={className}>
      <time className="tabular-nums">{text}</time> {identity.tzLabel}
    </span>
  );
}
