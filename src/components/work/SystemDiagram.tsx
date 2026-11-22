import type { Diagram, DiagramRow } from "@/content/content";
import { DrawSVG } from "@/motion/DrawSVG";

/**
 * A project's system diagram, drawn on scroll in the same language as the
 * research memory diagram: numbered stages, branches that fan out and back in,
 * a dashed boundary, a side input and a highlighted output.
 */

const VW = 540;
const X = 70; // box left
const BW = 400; // box width
const CX = X + BW / 2;
const GAP = 44; // vertical space between stages
const PART_GAP = 12;
const TOP = 40;

function rowHeight(r: DiagramRow) {
  if (r.viz?.type === "slots") return 150;
  if (r.viz?.type === "dots") return 124;
  if (r.parts) return 70;
  return 64;
}

function partBoxes(r: DiagramRow) {
  const n = r.parts!.length;
  const w = (BW - PART_GAP * (n - 1)) / n;
  return r.parts!.map((p, k) => ({ ...p, x: X + k * (w + PART_GAP), w }));
}

export function SystemDiagram({
  id,
  name,
  diagram,
  figure,
}: {
  id: string;
  name: string;
  diagram: Diagram;
  figure: number;
}) {
  const marker = `arrow-${id}`;
  const markerAccent = `arrow-${id}-accent`;

  const heights = diagram.rows.map(rowHeight);
  const rows = diagram.rows.map((r, i) => ({
    r,
    h: heights[i]!,
    y: TOP + heights.slice(0, i).reduce((sum, h) => sum + h + GAP, 0),
  }));
  const last = rows[rows.length - 1]!;
  const b = diagram.boundary;
  const height = last.y + last.h + (b && b.to === rows.length - 1 ? 32 : 0) + 24;
  const boundaryBottom = b ? rows[b.to]!.y + rows[b.to]!.h + 18 : 0;

  const desc = diagram.rows
    .map((r) => (r.parts ? `${r.label} (${r.parts.map((p) => p.label).join(", ")})` : r.label))
    .join(", then ");

  // connector segments between consecutive stages
  const connectors: { x1: number; y1: number; x2: number; y2: number; order: number }[] = [];
  rows.slice(0, -1).forEach((cur, i) => {
    const next = rows[i + 1]!;
    const fromXs = cur.r.parts ? partBoxes(cur.r).map((p) => p.x + p.w / 2) : [CX];
    const toXs = next.r.parts ? partBoxes(next.r).map((p) => p.x + p.w / 2) : [CX];
    const pairs =
      fromXs.length === toXs.length
        ? fromXs.map((fx, k) => [fx, toXs[k]!] as const)
        : fromXs.flatMap((fx) => toXs.map((tx) => [fx, tx] as const));
    pairs.forEach(([x1, x2]) =>
      connectors.push({ x1, y1: cur.y + cur.h, x2, y2: next.y - 4, order: i + 0.6 }),
    );
  });

  return (
    <figure className="ticked bg-surface/50 max-w-[640px] p-4 md:p-8">
      <span className="tick-b" aria-hidden="true" />
      <DrawSVG start="top 75%" end="bottom 80%">
        <svg
          viewBox={`0 0 ${VW} ${height}`}
          className="text-ink h-auto w-full"
          role="img"
          aria-labelledby={`${id}-title ${id}-desc`}
        >
          <title id={`${id}-title`}>{`${name} system architecture`}</title>
          <desc id={`${id}-desc`}>{`${desc}.`}</desc>
          <defs>
            {[
              { mid: marker, color: "currentColor" },
              { mid: markerAccent, color: "var(--accent-text)" },
            ].map((m) => (
              <marker
                key={m.mid}
                id={m.mid}
                viewBox="0 0 10 10"
                refX="8"
                refY="5"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L10,5 L0,10" fill="none" stroke={m.color} strokeWidth="1.4" />
              </marker>
            ))}
          </defs>

          {/* boundary */}
          {b && (
            <>
              <rect
                x="34"
                y={rows[b.from]!.y - 18}
                width={VW - 68}
                height={boundaryBottom - (rows[b.from]!.y - 18)}
                fill="none"
                stroke="var(--accent-text)"
                strokeWidth="1"
                strokeDasharray="5 5"
                data-draw-fade
                data-order={b.from + 0.4}
              />
              <g
                data-draw-fade
                data-order={b.from + 0.4}
                transform={`translate(46 ${boundaryBottom - 15})`}
              >
                <rect
                  x="0"
                  y="2"
                  width={b.label.length * 7.2 + 20}
                  height="26"
                  fill="var(--paper)"
                />
                <text
                  x="10"
                  y="20"
                  className="font-mono text-[11px] tracking-[0.08em]"
                  fill="var(--accent-text)"
                >
                  {b.label}
                </text>
              </g>
            </>
          )}

          {/* connectors */}
          {connectors.map((c, i) => (
            <path
              key={`c-${i}`}
              d={
                c.x1 === c.x2
                  ? `M ${c.x1} ${c.y1} V ${c.y2}`
                  : `M ${c.x1} ${c.y1} V ${c.y1 + 12} L ${c.x2} ${c.y2 - 12} V ${c.y2}`
              }
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              markerEnd={`url(#${marker})`}
              data-draw
              data-order={c.order}
            />
          ))}

          {/* stages */}
          {rows.map(({ r, y: ry, h }, i) => {
            const stroke = r.accent ? "var(--accent-text)" : "currentColor";
            return (
              <g key={r.label}>
                <text
                  x={X - 12}
                  y={ry + 26}
                  textAnchor="end"
                  className="fill-current font-mono text-[10px] tracking-[0.1em] opacity-60"
                  data-draw-fade
                  data-order={i + 0.3}
                >
                  {String(i + 1).padStart(2, "0")}
                </text>

                {r.parts ? (
                  partBoxes(r).map((p, k) => (
                    <g key={p.label}>
                      <rect
                        x={p.x}
                        y={ry}
                        width={p.w}
                        height={h}
                        fill="var(--paper)"
                        stroke={stroke}
                        strokeWidth="1"
                        data-draw
                        data-order={i + k * 0.15}
                      />
                      <text
                        x={p.x + 12}
                        y={ry + 29}
                        className="fill-current text-[14.5px] font-medium"
                        data-draw-fade
                        data-order={i + 0.3}
                      >
                        {p.label}
                      </text>
                      {p.sub && (
                        <text
                          x={p.x + 12}
                          y={ry + 50}
                          className="fill-current font-mono text-[9.5px] tracking-[0.06em] opacity-60"
                          data-draw-fade
                          data-order={i + 0.35}
                        >
                          {p.sub.toUpperCase()}
                        </text>
                      )}
                    </g>
                  ))
                ) : (
                  <>
                    <rect
                      x={X}
                      y={ry}
                      width={BW}
                      height={h}
                      fill="var(--paper)"
                      stroke={stroke}
                      strokeWidth={r.accent ? 1.4 : 1}
                      data-draw
                      data-order={i}
                    />
                    {r.accent && (
                      <rect
                        x={X + BW - 22}
                        y={ry + 14}
                        width="8"
                        height="8"
                        fill="var(--accent)"
                        data-draw-fade
                        data-order={i + 0.4}
                      />
                    )}
                    <text
                      x={X + 20}
                      y={ry + 28}
                      className="fill-current text-[16px] font-medium"
                      data-draw-fade
                      data-order={i + 0.3}
                    >
                      {r.label}
                    </text>
                    {r.sub && (
                      <text
                        x={X + 20}
                        y={ry + 48}
                        className="fill-current font-mono text-[10.5px] tracking-[0.06em] opacity-60"
                        data-draw-fade
                        data-order={i + 0.35}
                      >
                        {r.sub.toUpperCase()}
                      </text>
                    )}
                  </>
                )}

                {/* vector-store texture */}
                {r.viz?.type === "dots" &&
                  Array.from({ length: 4 * 24 }, (_, k) => (
                    <rect
                      key={k}
                      x={X + 22 + (k % 24) * 15}
                      y={ry + 68 + Math.floor(k / 24) * 12}
                      width="4"
                      height="4"
                      className="fill-current"
                      opacity={((k * 7) % 5) / 5 + 0.15}
                      data-draw-fade
                      data-order={i + 0.5}
                    />
                  ))}

                {/* benchmark slots, winner highlighted */}
                {r.viz?.type === "slots" &&
                  r.viz.labels.map((l, k, all) => {
                    const span = (BW - 40) / all.length;
                    const sx = X + 20 + k * span;
                    const win = r.viz?.type === "slots" && k === r.viz.highlight;
                    return (
                      <g key={l} data-draw-fade data-order={i + 0.5 + k * 0.03}>
                        <rect
                          x={sx + (span - 22) / 2}
                          y={ry + 66}
                          width="22"
                          height="42"
                          fill={win ? "var(--accent)" : "none"}
                          stroke={win ? "var(--accent-text)" : "currentColor"}
                          strokeWidth="1"
                          opacity={win ? 1 : 0.55}
                        />
                        <text
                          x={sx + span / 2}
                          y={ry + 126}
                          textAnchor="middle"
                          className="font-mono text-[8.5px] tracking-[0.04em]"
                          fill={win ? "var(--accent-text)" : "currentColor"}
                          opacity={win ? 1 : 0.6}
                        >
                          {l}
                        </text>
                      </g>
                    );
                  })}

                {/* side input */}
                {r.input && (
                  <g data-draw-fade data-order={i + 0.2}>
                    <rect
                      x="1"
                      y={ry + h - 33}
                      width={r.input.length * 6.4 + 6}
                      height="14"
                      fill="var(--paper)"
                    />
                    <text
                      x="4"
                      y={ry + h - 22}
                      className="font-mono text-[9px] tracking-[0.08em]"
                      fill="var(--accent-text)"
                    >
                      {r.input}
                    </text>
                    <line
                      x1="4"
                      y1={ry + h - 14}
                      x2={X - 4}
                      y2={ry + h - 14}
                      stroke="var(--accent-text)"
                      strokeWidth="1"
                      markerEnd={`url(#${markerAccent})`}
                    />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </DrawSVG>
      <figcaption className="mono text-muted mt-4 flex justify-between gap-4">
        <span>Fig. {String(figure).padStart(2, "0")} — System architecture</span>
        <span>Simplified</span>
      </figcaption>
    </figure>
  );
}
