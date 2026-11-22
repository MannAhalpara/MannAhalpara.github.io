"use client";

import { useEffect, useRef } from "react";

/**
 * The memory field: a few thousand dithered points (Bayer threshold over a smooth
 * noise field) that drift slowly. Near the cursor they gather and connect to their
 * nearest neighbours, like retrieval. On scroll they drift up and fade out, so
 * they never pile up over the hero's bottom line of text.
 *
 * Raw Canvas2D, DPR capped at 2, paused offscreen and when the tab is hidden.
 */

const BAYER4 = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);

function noise(x: number, y: number, s: number) {
  return (
    Math.sin(x * 0.0042 + s) * Math.cos(y * 0.0061 - s * 0.7) * 0.5 +
    Math.sin((x + y) * 0.0023 + s * 1.3) * 0.35 +
    Math.cos(x * 0.011 - y * 0.004) * 0.15
  );
}

type Field = {
  n: number;
  hx: Float32Array;
  hy: Float32Array;
  x: Float32Array;
  y: Float32Array;
  ph: Float32Array;
  tone: Uint8Array;
};

export default function MemoryField({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let W = 0;
    let H = 0;
    let dpr = 1;
    let field: Field | null = null;
    let ink = "#1E1414";
    let accent = "#7B1E22";
    let progress = 0; // scroll compression 0..1
    let running = false;
    let visible = true;
    let raf = 0;
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };
    const seed = Math.random() * 10;

    const readThemeColors = () => {
      const cs = getComputedStyle(document.documentElement);
      ink = cs.getPropertyValue("--ink").trim() || "#1E1414";
      accent = cs.getPropertyValue("--accent-text").trim() || "#7B1E22";
    };

    const build = () => {
      const rect = host.getBoundingClientRect();
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;

      const target = W < 768 ? 1800 : W < 1440 ? 5000 : 6800;
      // pick a lattice step so the dither grid yields roughly `target` points
      const density = 0.42;
      const step = Math.max(5, Math.sqrt((W * H * density) / target));
      const cols = Math.ceil(W / step);
      const rows = Math.ceil(H / step);
      const hx: number[] = [];
      const hy: number[] = [];
      const tone: number[] = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * step + step / 2;
          const py = r * step + step / 2;
          const v = 0.5 + 0.5 * noise(px, py, seed);
          // fade toward the left/top edges where the type sits
          const fall = 0.55 + 0.45 * Math.min(1, px / (W * 0.55));
          const t = BAYER4[(r % 4) * 4 + (c % 4)]!;
          if (v * fall > t + 0.12) {
            hx.push(px);
            hy.push(py);
            tone.push(v > 0.78 ? 2 : v > 0.58 ? 1 : 0);
          }
        }
      }
      const n = hx.length;
      field = {
        n,
        hx: Float32Array.from(hx),
        hy: Float32Array.from(hy),
        x: Float32Array.from(hx),
        y: Float32Array.from(hy),
        ph: Float32Array.from({ length: n }, () => Math.random() * Math.PI * 2),
        tone: Uint8Array.from(tone),
      };
    };

    const near: number[] = [];
    const draw = (time: number) => {
      if (!field) return;
      const f = field;
      const t = time * 0.001;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      // ease mouse
      mouse.x += (mouse.tx - mouse.x) * 0.18;
      mouse.y += (mouse.ty - mouse.y) * 0.18;
      const R = W < 768 ? 110 : 150;
      const R2 = R * R;
      const p = progress * progress * (3 - 2 * progress);
      // fully scrolled away: nothing to draw
      if (p > 0.99) return;
      const fade = 1 - p;
      near.length = 0;

      for (let i = 0; i < f.n; i++) {
        const hx = f.hx[i]!;
        const hy = f.hy[i]!;
        const ph = f.ph[i]!;
        let x = hx + Math.sin(t * 0.35 + ph) * 3.2;
        let y = hy + Math.cos(t * 0.28 + ph * 1.3) * 3.2;
        // dissolve on scroll: drift upward (faster for denser points) while fading
        if (p > 0) y -= p * (40 + f.tone[i]! * 30);
        if (mouse.active && p < 0.5) {
          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const d2 = dx * dx + dy * dy;
          if (d2 < R2) {
            const k = (1 - d2 / R2) * 0.22;
            x += dx * k;
            y += dy * k;
            if (near.length < 70) near.push(i);
          }
        }
        f.x[i] = x;
        f.y[i] = y;
      }

      // points, batched by tone
      const size = W < 768 ? 1.6 : 1.8;
      for (let tone = 0; tone < 3; tone++) {
        ctx.fillStyle = ink;
        ctx.globalAlpha = (tone === 0 ? 0.28 : tone === 1 ? 0.55 : 0.9) * fade;
        ctx.beginPath();
        for (let i = 0; i < f.n; i++) {
          if (f.tone[i] !== tone) continue;
          ctx.rect(f.x[i]!, f.y[i]!, size, size);
        }
        ctx.fill();
      }

      // retrieval graph near the cursor
      if (near.length > 2) {
        ctx.globalAlpha = 0.5 * fade;
        ctx.strokeStyle = ink;
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        let best = -1;
        let bestD = Infinity;
        for (let a = 0; a < near.length; a++) {
          const i = near[a]!;
          const ax = f.x[i]!;
          const ay = f.y[i]!;
          const md = (ax - mouse.x) ** 2 + (ay - mouse.y) ** 2;
          if (md < bestD) {
            bestD = md;
            best = i;
          }
          // two nearest neighbours within the set
          let n1 = -1;
          let n2 = -1;
          let d1 = Infinity;
          let d2 = Infinity;
          for (let b = 0; b < near.length; b++) {
            if (a === b) continue;
            const j = near[b]!;
            const d = (f.x[j]! - ax) ** 2 + (f.y[j]! - ay) ** 2;
            if (d < d1) {
              d2 = d1;
              n2 = n1;
              d1 = d;
              n1 = j;
            } else if (d < d2) {
              d2 = d;
              n2 = j;
            }
          }
          if (n1 >= 0) {
            ctx.moveTo(ax + 0.9, ay + 0.9);
            ctx.lineTo(f.x[n1]! + 0.9, f.y[n1]! + 0.9);
          }
          if (n2 >= 0 && d2 < 2600) {
            ctx.moveTo(ax + 0.9, ay + 0.9);
            ctx.lineTo(f.x[n2]! + 0.9, f.y[n2]! + 0.9);
          }
        }
        ctx.stroke();
        // node boxes
        ctx.globalAlpha = 0.9 * fade;
        for (const i of near) ctx.strokeRect(f.x[i]! - 1.5, f.y[i]! - 1.5, 4.8, 4.8);
        // the retrieved memory (top-1) in the accent
        if (best >= 0) {
          ctx.globalAlpha = fade;
          ctx.fillStyle = accent;
          ctx.fillRect(f.x[best]! - 2.5, f.y[best]! - 2.5, 6.8, 6.8);
          ctx.beginPath();
          ctx.strokeStyle = accent;
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(f.x[best]! + 0.9, f.y[best]! + 0.9);
          ctx.stroke();
        }
      }
      ctx.globalAlpha = 1;
    };

    const loop = (time: number) => {
      draw(time);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (running || reduce || !visible || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    readThemeColors();
    build();
    draw(0);
    canvas.style.opacity = "1";

    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(host);

    let resizeId = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeId);
      resizeId = window.setTimeout(() => {
        const r = host.getBoundingClientRect();
        if (Math.abs(r.width - W) < 2 && Math.abs(r.height - H) < 80) return;
        build();
        draw(performance.now());
      }, 150);
    });
    ro.observe(host);

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = e.clientX - r.left;
      mouse.ty = e.clientY - r.top;
      if (!mouse.active) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      }
      mouse.active = mouse.ty > 0 && mouse.ty < r.height;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    const onVis = () => (document.hidden ? stop() : start());
    const onTheme = () => {
      requestAnimationFrame(() => {
        readThemeColors();
        if (!running) draw(performance.now());
      });
    };
    if (!reduce) {
      host.addEventListener("pointermove", onMove, { passive: true });
      host.addEventListener("pointerleave", onLeave);
    }
    document.addEventListener("visibilitychange", onVis);
    window.addEventListener("themechange", onTheme);
    const schemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    schemeMq.addEventListener("change", onTheme);

    // scroll fade: 0 at the top of the hero → 1 when ~60% of it has scrolled away
    const onScroll = () => {
      const r = host.getBoundingClientRect();
      progress = Math.max(0, Math.min(1, (-r.top / Math.max(1, r.height)) * 1.6));
    };
    if (!reduce) {
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }

    start();
    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(resizeId);
      host.removeEventListener("pointermove", onMove);
      host.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("themechange", onTheme);
      schemeMq.removeEventListener("change", onTheme);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
      style={{ opacity: 0, transition: "opacity 1.2s cubic-bezier(.16,1,.3,1)" }}
    />
  );
}
