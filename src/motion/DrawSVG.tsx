"use client";

import { useRef, type ReactNode } from "react";
import { MQ, useMotion } from "./gsap";

/**
 * Draws every `[data-draw]` path inside on scroll (stroke-dashoffset), and fades
 * in `[data-draw-fade]` elements. `data-order` sequences them.
 */
export function DrawSVG({
  children,
  className,
  scrub = true,
  start = "top 75%",
  end = "bottom 60%",
}: {
  children: ReactNode;
  className?: string;
  scrub?: boolean | number;
  start?: string;
  end?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useMotion(
    ({ gsap }) => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const root = ref.current;
        if (!root) return;
        const paths = Array.from(root.querySelectorAll<SVGGeometryElement>("[data-draw]"));
        const fades = Array.from(root.querySelectorAll<Element>("[data-draw-fade]"));
        paths.forEach((p) => {
          const len = Math.ceil(p.getTotalLength());
          gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
        });
        const tl = gsap.timeline({
          defaults: { ease: scrub ? "none" : "power3.inOut" },
          scrollTrigger: { trigger: root, start, end, scrub: scrub || false },
        });
        const order = (el: Element) => Number(el.getAttribute("data-order") ?? 0);
        [...paths, ...fades]
          .sort((a, b) => order(a) - order(b))
          .forEach((el) => {
            const at = order(el) * 0.5;
            if (el.hasAttribute("data-draw")) tl.to(el, { strokeDashoffset: 0, duration: 1 }, at);
            else tl.from(el, { opacity: 0, y: 8, duration: 0.6 }, at);
          });
      });
    },
    { scope: ref },
  );
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
