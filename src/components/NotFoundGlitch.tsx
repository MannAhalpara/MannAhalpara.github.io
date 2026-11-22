"use client";

import { useEffect, useRef } from "react";

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const GLYPHS: Record<string, string[]> = {
  "4": ["10001", "10001", "10001", "11111", "00001", "00001", "00001"],
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
};

/** A dithered "404" that glitches: rows shear and tear at random intervals. */
export function NotFoundGlitch() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const text = "404";
    const cell = 6;
    const sub = 4; // dither sub-cells per glyph pixel
    const cols = text.length * 6 * sub;
    const rows = 7 * sub;
    c.width = cols * cell;
    c.height = rows * cell;
    let raf = 0;
    let t = 0;

    const draw = () => {
      const cs = getComputedStyle(document.documentElement);
      const ink = cs.getPropertyValue("--ink").trim() || "#1E1414";
      const accent = cs.getPropertyValue("--accent-text").trim() || "#7B1E22";
      ctx.clearRect(0, 0, c.width, c.height);
      const tear = !reduce && Math.random() < 0.18;
      const tearRow = Math.floor(Math.random() * rows);
      const tearH = 2 + Math.floor(Math.random() * 6);
      for (let y = 0; y < rows; y++) {
        const shift =
          tear && y >= tearRow && y < tearRow + tearH ? Math.round((Math.random() - 0.5) * 14) : 0;
        for (let x = 0; x < cols; x++) {
          const gi = Math.floor(x / (6 * sub));
          const gx = Math.floor((x % (6 * sub)) / sub);
          const gy = Math.floor(y / sub);
          const on = gx < 5 && GLYPHS[text[gi]!]![gy]![gx] === "1";
          const shade = on ? 1.02 - (y / rows) * 0.42 + Math.sin(x * 0.3 + t) * 0.04 : 0;
          if (shade > BAYER[(y % 4) * 4 + (x % 4)]!) {
            ctx.fillStyle = ink;
            ctx.fillRect((x + shift) * cell, y * cell, cell - 1, cell - 1);
          }
        }
      }
      if (tear) {
        ctx.fillStyle = accent;
        ctx.fillRect(0, tearRow * cell, c.width, 2);
      }
    };

    draw();
    if (reduce) return;
    let last = 0;
    const loop = (now: number) => {
      if (now - last > 90) {
        t += 0.4;
        draw();
        last = now;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="h-auto w-full max-w-[720px]"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
