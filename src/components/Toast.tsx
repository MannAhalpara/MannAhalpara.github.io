"use client";

import { useEffect, useState } from "react";

export function toast(message: string) {
  window.dispatchEvent(new CustomEvent("app:toast", { detail: message }));
}

/** Single global toast, announced politely to screen readers. */
export function Toaster() {
  const [msg, setMsg] = useState<string | null>(null);
  useEffect(() => {
    let id = 0;
    const on = (e: Event) => {
      setMsg((e as CustomEvent<string>).detail);
      window.clearTimeout(id);
      id = window.setTimeout(() => setMsg(null), 2200);
    };
    window.addEventListener("app:toast", on);
    return () => {
      window.removeEventListener("app:toast", on);
      window.clearTimeout(id);
    };
  }, []);
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[150] -translate-x-1/2"
    >
      <div
        className={`mono bg-ink text-paper flex items-center gap-2 rounded-full px-4 py-2.5 transition-all duration-500 ease-(--ease-expo) ${
          msg ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
        }`}
      >
        <span className="live-dot" aria-hidden="true" />
        {msg ?? ""}
      </div>
    </div>
  );
}
