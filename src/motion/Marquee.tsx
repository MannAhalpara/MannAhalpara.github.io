"use client";

import { useRef, type ReactNode } from "react";
import { getLenis } from "@/lib/scroll";
import { MQ, useMotion } from "./gsap";

/**
 * Infinite marquee. Speed responds to scroll velocity; direction flips on scroll-up.
 * Children are rendered twice; the second copy is aria-hidden.
 */
export function Marquee({
  children,
  speed = 40,
  className,
  reactToScroll = true,
}: {
  children: ReactNode;
  /** px per second */
  speed?: number;
  className?: string;
  reactToScroll?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useMotion(
    ({ gsap }) => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const t = track.current;
        const root = ref.current;
        if (!t || !root) return;
        let x = 0;
        let dir = 1;
        let boost = 0;
        let lastY = window.scrollY;
        let visible = true;
        const io = new IntersectionObserver(([e]) => {
          visible = !!e?.isIntersecting;
        });
        io.observe(root);
        const setX = gsap.quickSetter(t, "x", "px");
        const tick = (_time: number, dt: number) => {
          if (reactToScroll) {
            const lenis = getLenis();
            const y = window.scrollY;
            const v = lenis ? lenis.velocity : y - lastY;
            lastY = y;
            if (Math.abs(v) > 0.4) dir = v > 0 ? 1 : -1;
            boost = Math.max(boost * 0.92, Math.min(Math.abs(v) * 0.6, 14));
          }
          if (!visible) return;
          const half = t.scrollWidth / 2;
          if (!half) return;
          x -= ((speed * (1 + boost)) / 1000) * dt * dir;
          if (x <= -half) x += half;
          if (x > 0) x -= half;
          setX(x);
        };
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          io.disconnect();
          gsap.set(t, { x: 0 });
        };
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <div ref={track} className="flex w-max will-change-transform">
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
