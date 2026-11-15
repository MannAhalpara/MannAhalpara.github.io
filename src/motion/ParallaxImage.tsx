"use client";

import { useRef, type ReactNode } from "react";
import { MQ, useMotion } from "./gsap";

/** Moves its first child slightly against the scroll direction (desktop only). */
export function ParallaxImage({
  children,
  amount = 6,
  className,
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useMotion(
    ({ gsap }) => {
      const mm = gsap.matchMedia();
      mm.add(MQ.desktop, () => {
        const inner = ref.current?.firstElementChild;
        if (!inner) return;
        gsap.fromTo(
          inner,
          { yPercent: -amount, scale: 1 + amount / 50 },
          {
            yPercent: amount,
            ease: "none",
            scrollTrigger: {
              trigger: ref.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      {children}
    </div>
  );
}
