"use client";

import { useRef, type ElementType } from "react";
import { MQ, useMotion } from "./gsap";

/**
 * Words scrub from muted to ink as the block crosses the viewport. Each word's
 * colour is `color-mix(ink, muted, --p)`, so the resting state stays readable
 * (muted passes AA) and theme switches keep working mid-scroll.
 */
export function ScrubWords({
  text,
  as: Tag = "p",
  className,
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  useMotion(
    ({ gsap, SplitText }) => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current;
        if (!el) return;
        const split = SplitText.create(el, {
          type: "words",
          wordsClass: "scrub-word",
          aria: "none",
        });
        gsap.fromTo(
          split.words,
          { "--p": 0 },
          {
            "--p": 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 45%", scrub: true },
          },
        );
        return () => split.revert();
      });
    },
    { scope: ref },
  );
  return (
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  );
}
