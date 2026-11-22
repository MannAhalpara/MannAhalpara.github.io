import { memoryArchitecture } from "@/content/content";
import { DrawSVG } from "@/motion/DrawSVG";

/**
 * Conceptual memory-architecture diagram, drawn on scroll.
 * Session → Encoder → Hierarchical store (episodic/semantic) → Retrieval & Update
 * → Memory-guided reasoning → Response, with a private/on-device boundary.
 */
export function MemoryDiagram() {
  const [session, encoder, store, retrieve, reason, response] = memoryArchitecture;
  const cx = 270;
  const boxX = 70;
  const boxW = 400;
  const rows = [
    { n: session, y: 24, h: 64 },
    { n: encoder, y: 132, h: 64 },
    { n: store, y: 240, h: 132 },
    { n: retrieve, y: 416, h: 64 },
    { n: reason, y: 524, h: 64 },
    { n: response, y: 632, h: 64 },
  ];

  return (
    <figure className="ticked bg-surface/50 p-4 md:p-8">
      <span className="tick-b" aria-hidden="true" />
      <DrawSVG start="top 70%" end="bottom 75%">
        <svg
          viewBox="0 0 540 730"
          className="text-ink h-auto w-full"
          role="img"
          aria-labelledby="memdiag-title memdiag-desc"
        >
          <title id="memdiag-title">Conceptual memory architecture</title>
          <desc id="memdiag-desc">
            Session n flows into an encoder, then a hierarchical memory store with episodic and
            semantic memory, then retrieval and update, then memory-guided reasoning with AFlow and
            MCTS, then a response. The store, retrieval and reasoning sit inside an on-device,
            private boundary.
          </desc>
          <defs>
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M0,0 L10,5 L0,10" fill="none" stroke="currentColor" strokeWidth="1.4" />
            </marker>
          </defs>

          {/* private boundary */}
          <rect
            x="34"
            y="222"
            width="472"
            height="384"
            fill="none"
            stroke="var(--accent-text)"
            strokeWidth="1"
            strokeDasharray="5 5"
            data-draw-fade
            data-order="2"
          />
          <g data-draw-fade data-order="2" transform="translate(46 200)">
            <rect x="0" y="6" width="198" height="26" fill="var(--paper)" />
            {/* lock */}
            <g transform="translate(8 9)" fill="none" stroke="var(--accent-text)" strokeWidth="1.4">
              <rect x="1" y="8" width="14" height="11" />
              <path d="M4 8V5a4 4 0 0 1 8 0v3" />
            </g>
            <text x="30" y="24" className="fill-current font-mono text-[11px] tracking-[0.08em]">
              ON-DEVICE / PRIVATE
            </text>
          </g>

          {/* connectors */}
          {rows.slice(0, -1).map((r, i) => {
            const next = rows[i + 1]!;
            return (
              <line
                key={`c-${i}`}
                x1={cx}
                y1={r.y + r.h}
                x2={cx}
                y2={next.y - 4}
                stroke="currentColor"
                strokeWidth="1"
                markerEnd="url(#arrow)"
                data-draw
                data-order={i + 0.6}
              />
            );
          })}

          {/* update loop: retrieval → store */}
          <path
            d={`M ${boxX + boxW} 448 H 494 V 306 H ${boxX + boxW + 6}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            markerEnd="url(#arrow)"
            data-draw
            data-order="3.6"
          />
          <text
            x="500"
            y="384"
            className="fill-current font-mono text-[9px] tracking-[0.08em]"
            transform="rotate(90 500 384)"
            textAnchor="middle"
            data-draw-fade
            data-order="3.8"
          >
            UPDATE · FORGET
          </text>

          {/* nodes */}
          {rows.map((r, i) => (
            <g key={r.n.id}>
              <rect
                x={boxX}
                y={r.y}
                width={boxW}
                height={r.h}
                fill="var(--paper)"
                stroke="currentColor"
                strokeWidth="1"
                data-draw
                data-order={i}
              />
              <text
                x={boxX + 16}
                y={r.y + 22}
                className="fill-current font-mono text-[10px] tracking-[0.1em] opacity-60"
                data-draw-fade
                data-order={i + 0.3}
              >
                {String(i + 1).padStart(2, "0")}
              </text>
              <text
                x={boxX + 48}
                y={r.y + 27}
                className="fill-current text-[16px] font-medium"
                data-draw-fade
                data-order={i + 0.3}
              >
                {r.n.label}
              </text>
              <text
                x={boxX + 48}
                y={r.y + 48}
                className="fill-current font-mono text-[10.5px] tracking-[0.06em] opacity-60"
                data-draw-fade
                data-order={i + 0.35}
              >
                {r.n.id === "store" ? "" : r.n.sub.toUpperCase()}
              </text>
            </g>
          ))}

          {/* episodic / semantic sub-stores */}
          {[
            { label: "EPISODIC", x: boxX + 48 },
            { label: "SEMANTIC", x: boxX + 48 + 166 },
          ].map((s, i) => (
            <g key={s.label}>
              <rect
                x={s.x}
                y={300}
                width={150}
                height={52}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                data-draw
                data-order={2.5 + i * 0.2}
              />
              {Array.from({ length: 18 }, (_, k) => (
                <rect
                  key={k}
                  x={s.x + 12 + (k % 9) * 14}
                  y={316 + Math.floor(k / 9) * 12}
                  width="4"
                  height="4"
                  className="fill-current"
                  opacity={((k * 7 + i * 3) % 5) / 5 + 0.2}
                  data-draw-fade
                  data-order={2.8 + i * 0.2}
                />
              ))}
              <text
                x={s.x + 150}
                y={296}
                textAnchor="end"
                className="fill-current font-mono text-[9px] tracking-[0.1em] opacity-70"
                data-draw-fade
                data-order={2.7}
              >
                {s.label}
              </text>
            </g>
          ))}
        </svg>
      </DrawSVG>
      <figcaption className="mono text-muted mt-4 flex justify-between gap-4">
        <span>Fig. 01 - Conceptual overview</span>
        <span>Not a reported result</span>
      </figcaption>
    </figure>
  );
}
