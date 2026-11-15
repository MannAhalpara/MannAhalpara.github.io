"use client";

import { useRef } from "react";
import { seeded } from "@/lib/utils";
import { MQ, useMotion } from "@/motion/gsap";

const N = 10;

/** Build a symmetric, seeded matrix in [-1, 1] with a unit diagonal. */
function matrix() {
  const r = seeded("icids-2025");
  const m: number[][] = Array.from({ length: N }, () => Array(N).fill(0));
  for (let i = 0; i < N; i++) {
    m[i]![i] = 1;
    for (let j = 0; j < i; j++) {
      const v = Math.round((r() * 1.6 - 0.5) * 100) / 100;
      m[i]![j] = v;
      m[j]![i] = v;
    }
  }
  return m;
}
const M = matrix();

/** Decorative 10×10 correlation heatmap, captioned "illustrative". */
export function Heatmap() {
  const ref = useRef<HTMLDivElement>(null);
  useMotion(
    ({ gsap }) => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const cells = ref.current!.querySelectorAll("[data-cell]");
        gsap.from(cells, {
          scale: 0,
          opacity: 0,
          transformOrigin: "50% 50%",
          duration: 0.7,
          ease: "expo.out",
          stagger: (i) => {
            const row = Math.floor(i / N);
            const col = i % N;
            return (row + col) * 0.035;
          },
          scrollTrigger: { trigger: ref.current, start: "top 80%", once: true },
        });
      });
    },
    { scope: ref },
  );

  const s = 30;
  return (
    <figure ref={ref} className="ticked bg-surface/50 p-5 md:p-7">
      <span className="tick-b" aria-hidden="true" />
      <svg viewBox={`0 0 ${N * s} ${N * s}`} className="h-auto w-full" aria-hidden="true">
        {M.map((row, i) =>
          row.map((v, j) => {
            const a = Math.abs(v);
            return (
              <rect
                key={`${i}-${j}`}
                data-cell
                x={j * s + 1.5}
                y={i * s + 1.5}
                width={s - 3}
                height={s - 3}
                style={{ transformBox: "fill-box" }}
                fill={v >= 0 ? "var(--ink)" : "none"}
                fillOpacity={v >= 0 ? 0.08 + a * 0.82 : 0}
                stroke={v < 0 ? "var(--ink)" : "none"}
                strokeOpacity={0.25 + a * 0.6}
                strokeDasharray={v < 0 ? "2 2" : undefined}
              />
            );
          }),
        )}
      </svg>
      <figcaption className="mono text-muted mt-4 flex flex-wrap justify-between gap-2">
        <span>Fig. 02 — 10 × 10 sector matrix</span>
        <span>Illustrative · random-seeded</span>
      </figcaption>
    </figure>
  );
}
