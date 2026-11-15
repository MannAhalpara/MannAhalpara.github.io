/**
 * Generates abstract, ordered-dithered preview images for each project.
 * Output: public/work/<slug>/preview.png (ink pixels on a transparent background).
 *
 * These are deliberately abstract — not screenshots. Drop real screenshots into
 * public/work/<slug>/ later and point the card at them.
 *
 * Run: pnpm previews
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const W = 960;
const H = 600;
const CELL = 4; // px per dither cell
const CW = W / CELL;
const CH = H / CELL;
const INK = [14, 14, 14];

/* ---- tiny PNG encoder (RGBA, 8-bit) ---- */
const crcTable = new Uint32Array(256).map((_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};
const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};
function encodePNG(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ---- helpers ---- */
const bayer8 = (() => {
  const m = [[0]];
  let out = m;
  for (let n = 1; n < 8; n *= 2) {
    const next = Array.from({ length: n * 2 }, () => Array(n * 2).fill(0));
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++) {
        const v = out[y][x] * 4;
        next[y][x] = v;
        next[y][x + n] = v + 2;
        next[y + n][x] = v + 3;
        next[y + n][x + n] = v + 1;
      }
    out = next;
  }
  return out.map((r) => r.map((v) => (v + 0.5) / 64));
})();

function rng(seed) {
  let s = 0;
  for (const ch of seed) s = (s * 31 + ch.charCodeAt(0)) >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v) => Math.max(0, Math.min(1, v));
const smooth = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/* ---- fields: (u,v in 0..1, aspect-corrected x) => intensity 0..1 ---- */
const fields = {
  // Grading: the evaluation screen, abstracted. Dark sidebar, student header,
  // reference vs student answer cards (Q-1), metrics panel with three scorers
  // and a score ring.
  answeriq: (r) => {
    const ex = 1 / CW; // one dither cell, in normalized units
    const ey = 1 / CH;
    const inR = (x, y, x0, y0, x1, y1) => x >= x0 && x < x1 && y >= y0 && y < y1;
    const edge = (x, y, x0, y0, x1, y1) =>
      inR(x, y, x0, y0, x1, y1) && (x < x0 + ex || x >= x1 - ex || y < y0 + ey || y >= y1 - ey);
    const circle = (x, y, cx, cy, rad) => Math.hypot((x - cx) * W, (y - cy) * H) <= rad;

    // text lines for one answer box: [y, xStart, xEnd, highlight [a,b] | null, bullet]
    const lines = (x0, x1, y0, spec) => {
      const out = [];
      let y = y0;
      for (const [kind, n] of spec) {
        for (let i = 0; i < n; i++) {
          const bullet = kind !== "para";
          const xs = x0 + (bullet ? 0.018 : 0);
          const full = x1 - xs;
          const len =
            kind === "para"
              ? i === n - 1
                ? 0.45 + r() * 0.2
                : 0.88 + r() * 0.1
              : 0.35 + r() * 0.35;
          const xe = xs + full * len;
          let hi = null;
          if (r() < 0.55) {
            const a = xs + (xe - xs) * (0.05 + r() * 0.5);
            hi = [a, Math.min(xe, a + 0.03 + r() * 0.04)];
          }
          out.push([y, xs, xe, hi, bullet ? kind : null]);
          y += 0.036;
        }
        y += 0.014;
      }
      return out;
    };
    const card = (x0, x1, spec) => ({
      x0,
      x1,
      lines: lines(x0 + 0.035, x1 - 0.035, 0.3, spec),
    });
    const cards = [
      card(0.15, 0.555, [
        ["para", 4],
        ["dot", 5],
      ]),
      card(0.575, 0.98, [
        ["para", 2],
        ["dash", 5],
      ]),
    ];
    const CARD_Y0 = 0.15;
    const CARD_Y1 = 0.62;

    // 3×5 pixel digits for the score, drawn in 3×3 cell pixels
    const font = {
      7: ["111", "001", "001", "010", "010"],
      ".": ["0", "0", "0", "0", "1"],
      5: ["111", "100", "111", "001", "111"],
    };
    const score = "7.5";
    const PX = 3; // cells per font pixel
    const glyphW = (c) => font[c][0].length;
    const scoreW = [...score].reduce((s, c) => s + glyphW(c) + 1, -1) * PX;
    const GX = 0.865;
    const GY = 0.81;
    const scoreAt = (x, y) => {
      const cx = Math.round(x * CW) - Math.round(GX * CW - scoreW / 2);
      const cy = Math.round(y * CH) - Math.round(GY * CH - (5 * PX) / 2);
      if (cy < 0 || cy >= 5 * PX || cx < 0) return false;
      let off = 0;
      for (const c of score) {
        const w = glyphW(c) * PX;
        if (cx < off + w) return font[c][Math.floor(cy / PX)][Math.floor((cx - off) / PX)] === "1";
        off += w + PX;
      }
      return false;
    };

    return (x, y) => {
      // sidebar
      if (x < 0.12) {
        if (inR(x, y, 0.018, 0.035, 0.048, 0.08)) return 0; // logo
        if (inR(x, y, 0.058, 0.05, 0.1, 0.064)) return 0.25; // wordmark
        if (inR(x, y, 0.012, 0.13, 0.108, 0.175)) return 0; // active nav pill
        if (inR(x, y, 0.025, 0.215, 0.09, 0.228)) return 0.5; // nav item
        if (inR(x, y, 0.025, 0.91, 0.07, 0.924)) return 0.5; // log out
        return 0.92;
      }
      // header with student / USN / subject
      if (y < 0.11) {
        if (y >= 0.11 - ey) return 1;
        for (const [a, w] of [
          [0.15, 0.07],
          [0.27, 0.06],
          [0.38, 0.06],
        ]) {
          if (inR(x, y, a, 0.035, a + w, 0.047)) return 0.35;
          if (inR(x, y, a, 0.062, a + w * 0.85, 0.08)) return 0.9;
        }
        return 0;
      }
      // answer cards
      for (const c of cards) {
        if (!inR(x, y, c.x0, CARD_Y0, c.x1, CARD_Y1)) continue;
        if (edge(x, y, c.x0, CARD_Y0, c.x1, CARD_Y1)) return 1;
        // card title + Q-1 badge + question line
        if (inR(x, y, c.x0 + 0.02, 0.18, c.x0 + 0.13, 0.193)) return 0.85;
        if (circle(x, y, c.x0 + 0.032, 0.235, 10)) return 1;
        if (inR(x, y, c.x0 + 0.055, 0.226, c.x0 + 0.2, 0.243)) return 0.85;
        // answer box
        const bx0 = c.x0 + 0.02;
        const bx1 = c.x1 - 0.02;
        if (inR(x, y, bx0, 0.275, bx1, CARD_Y1 - 0.025)) {
          for (const [ly, xs, xe, hi, bullet] of c.lines) {
            if (y < ly || y >= ly + 2 * ey) continue;
            if (bullet === "dot" && circle(x, y, xs - 0.01, ly + 0.008, 2.5)) return 0.8;
            if (bullet === "dash" && inR(x, y, xs - 0.016, ly + 0.006, xs - 0.006, ly + 0.011))
              return 0.8;
            if (hi && x >= hi[0] && x < hi[1]) return 1; // matched concept
            if (x >= xs && x < xe) return 0.5;
          }
          return 0.05;
        }
        return 0;
      }
      // evaluation metrics panel
      const M0 = 0.66;
      const M1 = 0.96;
      if (inR(x, y, 0.15, M0, 0.98, M1)) {
        if (edge(x, y, 0.15, M0, 0.98, M1)) return 1;
        // title with chart glyph
        for (const [bx, bh] of [
          [0.172, 0.012],
          [0.177, 0.02],
          [0.182, 0.016],
        ])
          if (inR(x, y, bx, 0.705 - bh, bx + ex, 0.705)) return 0.9;
        if (inR(x, y, 0.195, 0.69, 0.3, 0.705)) return 0.85;
        // three scorers: concept coverage · keyword matching · semantic verification
        const rows = [
          [0.755, 0.82],
          [0.815, 0.68],
          [0.875, 0.74],
        ];
        for (const [ry, fill] of rows) {
          if (y < ry || y >= ry + 0.022) continue;
          if (inR(x, y, 0.175, ry + 0.004, 0.3, ry + 0.018)) return 0.42;
          const t0 = 0.33;
          const t1 = 0.72;
          if (x >= t0 && x < t1) return x < t0 + (t1 - t0) * fill ? 0.9 : 0.12;
        }
        // score ring + 7.5
        const d = Math.hypot((x - GX) * W, (y - GY) * H);
        if (d >= 64 && d <= 73) {
          const ang = (Math.atan2(x - GX, -(y - GY)) / (2 * Math.PI) + 1) % 1;
          return ang < 0.75 ? 1 : 0.14;
        }
        if (scoreAt(x, y)) return 1;
        return 0;
      }
      return 0.07; // page background
    };
  },
  // Retrieval: query point with concentric similarity rings and top-k blobs
  "mini-rag": (r) => {
    const pts = Array.from({ length: 22 }, () => [0.1 + r() * 0.8, 0.12 + r() * 0.76]);
    return (x, y) => {
      const d = Math.hypot(x - 0.5, y - 0.5);
      let v = 0.5 + 0.5 * Math.cos(d * 70);
      v *= smooth(0.55, 0.05, d) * 0.55;
      for (const [px, py] of pts) {
        const pd = Math.hypot(x - px, y - py);
        const near = Math.hypot(px - 0.5, py - 0.5) < 0.22;
        v = Math.max(v, smooth(near ? 0.05 : 0.03, 0, pd) * (near ? 1 : 0.5));
      }
      return v;
    };
  },
  // Air: drifting turbulent haze bands
  airvision: (r) => {
    const ph = r() * 10;
    return (x, y) => {
      const n =
        Math.sin(x * 6 + ph + Math.sin(y * 9) * 0.8) * 0.5 +
        Math.sin(x * 13 - y * 7 + ph * 2) * 0.25 +
        Math.sin(y * 21 + x * 3) * 0.12;
      return clamp(0.15 + y * 0.55 + n * 0.28);
    };
  },
  // Voice: waveform with a router split
  axon: (r) => {
    const ph = r() * 6;
    return (x, y) => {
      const amp = 0.18 * smooth(0, 0.3, x) * smooth(1, 0.7, x);
      const wave = 0.5 + Math.sin(x * 40 + ph) * amp * Math.sin(x * 5);
      const d = Math.abs(y - wave);
      let v = smooth(0.06, 0, d);
      const bars =
        Math.abs(Math.sin(x * 120)) > 0.6
          ? smooth(amp * 2.2 + 0.02, 0, Math.abs(y - 0.5)) * 0.35
          : 0;
      return Math.max(v, bars, 0.05);
    };
  },
};

// `pnpm previews answeriq` regenerates just that project
const only = process.argv.slice(2);
const slugs = Object.keys(fields).filter((s) => only.length === 0 || only.includes(s));
for (const slug of slugs) {
  const r = rng(slug);
  const f = fields[slug](r);
  const px = Buffer.alloc(W * H * 4);
  for (let cy = 0; cy < CH; cy++) {
    for (let cx = 0; cx < CW; cx++) {
      const x = cx / CW;
      const y = cy / CH;
      const v = clamp(f(x, y));
      const on = v > bayer8[cy % 8][cx % 8];
      if (!on) continue;
      // draw a CELL-1 square to keep a visible dot-matrix gap
      for (let dy = 0; dy < CELL - 1; dy++)
        for (let dx = 0; dx < CELL - 1; dx++) {
          const i = ((cy * CELL + dy) * W + (cx * CELL + dx)) * 4;
          px[i] = INK[0];
          px[i + 1] = INK[1];
          px[i + 2] = INK[2];
          px[i + 3] = 255;
        }
    }
  }
  const dir = join("public", "work", slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "preview.png"), encodePNG(W, H, px));
  writeFileSync(
    join(dir, "README.txt"),
    `Drop real screenshots for ${slug} here (e.g. screen-1.png).\npreview.png is a generated abstract placeholder (pnpm previews).\n`,
  );
  console.log("wrote", join(dir, "preview.png"));
}
