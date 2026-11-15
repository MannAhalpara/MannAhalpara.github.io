"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import type { SplitText } from "gsap/SplitText";
import { MQ, useMotion } from "./gsap";

type Props = {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  id?: string;
  /** "lines" for paragraphs/headings, "chars" for display words. */
  type?: "lines" | "words" | "chars";
  delay?: number;
  stagger?: number;
};

/**
 * Masked text reveal (y: 110% → 0). The split is created lazily when the element
 * approaches the viewport, so page load doesn't pay for every SplitText at once.
 * Screen readers read the untouched text (chars mode keeps an sr-only copy).
 */
export function RevealText({
  as: Tag = "div",
  children,
  className,
  id,
  type = "lines",
  delay = 0,
  stagger,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const target = useRef<HTMLSpanElement>(null);

  useMotion(
    ({ gsap, ScrollTrigger, SplitText: Split }) => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current;
        const splitEl = type === "chars" ? target.current : el;
        if (!el || !splitEl) return;
        // already on screen (e.g. loaded mid-page): leave it as is
        if (el.getBoundingClientRect().top < window.innerHeight * 0.85) return;
        let split: SplitText | null = null;
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () => {
            split = Split.create(splitEl, {
              type: type === "chars" ? "words,chars" : type,
              mask: type === "chars" ? "words" : type,
              aria: "none",
              onSplit(self) {
                const els =
                  type === "chars" ? self.chars : type === "words" ? self.words : self.lines;
                return gsap.from(els, {
                  yPercent: 110,
                  duration: 1.1,
                  ease: "expo.out",
                  delay,
                  stagger: stagger ?? (type === "chars" ? 0.03 : 0.08),
                  onComplete: () => {
                    // lines mode: drop the wrappers so text reflows naturally afterwards
                    if (type === "lines") split?.revert();
                  },
                });
              },
            });
          },
        });
        return () => {
          st.kill();
          split?.revert();
        };
      });
    },
    { scope: ref },
  );

  if (type === "chars") {
    return (
      <Tag ref={ref} className={className} id={id}>
        <span className="sr-only">{children}</span>
        <span ref={target} aria-hidden="true">
          {children}
        </span>
      </Tag>
    );
  }
  return (
    <Tag ref={ref} className={className} id={id}>
      {children}
    </Tag>
  );
}
