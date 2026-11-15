"use client";

import { useRef } from "react";
import { MQ, useMotion } from "./gsap";

type Props = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  duration?: number;
  /** Count from this value instead of 0 (e.g. years). */
  from?: number;
};

/**
 * Counts up to `value` when scrolled into view. SSR renders the final value;
 * screen readers only ever get the final value.
 */
export function CountUp({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
  duration = 1.6,
  from = 0,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const fmt = (n: number) => `${prefix}${n.toFixed(decimals)}${suffix}`;

  useMotion(
    ({ gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const el = ref.current;
        if (!el) return;
        if (el.getBoundingClientRect().top < window.innerHeight) return; // already seen
        const state = { n: from };
        el.textContent = fmt(from);
        const tween = gsap.to(state, {
          n: value,
          duration,
          ease: "expo.out",
          paused: true,
          onUpdate: () => {
            el.textContent = fmt(state.n);
          },
        });
        const st = ScrollTrigger.create({
          trigger: el,
          start: "top 92%",
          once: true,
          onEnter: () => tween.play(),
        });
        return () => {
          st.kill();
          tween.kill();
          el.textContent = fmt(value);
        };
      });
    },
    { scope: ref },
  );

  return (
    <span className={className}>
      <span className="sr-only">{fmt(value)}</span>
      <span ref={ref} aria-hidden="true">
        {fmt(value)}
      </span>
    </span>
  );
}
