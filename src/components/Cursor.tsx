"use client";

import { useRef } from "react";
import { MQ, useMotion } from "@/motion/gsap";

/**
 * Ink dot + orange ring. The ring grows over interactive elements and shows the
 * element's `data-cursor` label ("VIEW", "COPY", "OPEN ↗"). Pointer devices only;
 * the native cursor stays available.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useMotion(({ gsap }) => {
    const mm = gsap.matchMedia();
    mm.add(MQ.fine, () => {
      const d = dot.current!;
      const r = ring.current!;
      const l = label.current!;
      gsap.set([d, r], { xPercent: -50, yPercent: -50, opacity: 0 });
      const dx = gsap.quickTo(d, "x", { duration: 0.12, ease: "power3.out" });
      const dy = gsap.quickTo(d, "y", { duration: 0.12, ease: "power3.out" });
      const rx = gsap.quickTo(r, "x", { duration: 0.5, ease: "expo.out" });
      const ry = gsap.quickTo(r, "y", { duration: 0.5, ease: "expo.out" });
      let active: Element | null = null;

      const move = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        gsap.to([d, r], { opacity: 1, duration: 0.3, overwrite: "auto" });
        dx(e.clientX);
        dy(e.clientY);
        rx(e.clientX);
        ry(e.clientY);
        const target = (e.target as Element | null)?.closest?.(
          "[data-cursor], a, button, summary, input, [role=button]",
        );
        if (target === active) return;
        active = target ?? null;
        const text = active?.getAttribute("data-cursor") ?? "";
        const isText = active?.matches("input, textarea");
        l.textContent = text;
        gsap.to(r, {
          width: text ? 84 : active && !isText ? 44 : 28,
          height: text ? 84 : active && !isText ? 44 : 28,
          backgroundColor: text ? "var(--accent)" : "transparent",
          duration: 0.35,
          ease: "expo.out",
        });
        gsap.to(d, { scale: active ? 0 : 1, duration: 0.25 });
        gsap.to(l, { opacity: text ? 1 : 0, duration: 0.2 });
      };
      const leave = () => gsap.to([d, r], { opacity: 0, duration: 0.3 });
      const down = () => gsap.to(r, { scale: 0.85, duration: 0.2 });
      const up = () => gsap.to(r, { scale: 1, duration: 0.4 });

      window.addEventListener("pointermove", move, { passive: true });
      document.documentElement.addEventListener("pointerleave", leave);
      window.addEventListener("pointerdown", down);
      window.addEventListener("pointerup", up);
      return () => {
        window.removeEventListener("pointermove", move);
        document.documentElement.removeEventListener("pointerleave", leave);
        window.removeEventListener("pointerdown", down);
        window.removeEventListener("pointerup", up);
      };
    });
  });

  return (
    <div
      ref={root}
      className="cursor-root pointer-events-none fixed inset-0 z-[300]"
      aria-hidden="true"
    >
      <div
        ref={ring}
        className="border-accent fixed top-0 left-0 grid size-7 place-items-center rounded-full border"
      >
        <span ref={label} className="mono text-accent-ink text-[10px] font-medium opacity-0" />
      </div>
      <div ref={dot} className="bg-ink fixed top-0 left-0 size-1.5 rounded-full" />
    </div>
  );
}
