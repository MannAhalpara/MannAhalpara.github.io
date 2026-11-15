"use client";

import { useRef, type ReactNode } from "react";
import { MQ, useMotion } from "./gsap";

/** Pulls its child toward the pointer (max `strength` px). Pointer devices only. */
export function Magnetic({
  children,
  strength = 12,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  useMotion(
    ({ gsap }) => {
      const mm = gsap.matchMedia();
      mm.add(MQ.fine, () => {
        const el = ref.current;
        if (!el) return;
        const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "expo.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "expo.out" });
        const move = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
          const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
          xTo(Math.max(-1, Math.min(1, dx)) * strength);
          yTo(Math.max(-1, Math.min(1, dy)) * strength);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
          gsap.set(el, { x: 0, y: 0 });
        };
      });
    },
    { scope: ref },
  );
  return (
    <span ref={ref} className={className ?? "inline-block"}>
      {children}
    </span>
  );
}
