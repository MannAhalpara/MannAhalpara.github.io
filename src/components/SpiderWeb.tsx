function webPath(torn = true) {
  const c = 60,
    R = 56,
    spokes = 8,
    rings = [14, 26, 38, 50];
  const pt = (r: number, i: number) => {
    const a = (Math.PI * 2 * i) / spokes - Math.PI / 2;
    return [c + r * Math.cos(a), c + r * Math.sin(a)].map((n) => n.toFixed(1));
  };
  let d = "";
  for (let i = 0; i < spokes; i++) {
    if (torn && i === 3) continue; // one broken spoke
    const [x, y] = pt(R, i);
    d += `M${c} ${c} L${x} ${y} `;
  }
  rings.forEach((r, ri) => {
    for (let i = 0; i < spokes; i++) {
      if (torn && (i === 2 || i === 3) && ri > 0) continue; // torn gap
      const [x1, y1] = pt(r, i);
      const [x2, y2] = pt(r, (i + 1) % spokes);
      d += `M${x1} ${y1} Q${c} ${c} ${x2} ${y2} `;
    }
  });
  return d;
}

const D = webPath(true);

/** Thin, torn web in the ink colour (never the accent), drawn behind the spider. */
export function SpiderWeb({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className={className}>
      <path
        d={D}
        fill="none"
        stroke="var(--ink)"
        strokeOpacity={0.7}
        strokeWidth={0.7}
        strokeLinecap="round"
      />
    </svg>
  );
}
