import { identity, publication } from "@/content/content";
import { Magnetic } from "@/motion/Magnetic";
import { RevealText } from "@/motion/RevealText";
import { SectionHeader, TickB } from "../SectionHeader";
import { Heatmap } from "./Heatmap";

export function Publication() {
  const p = publication;
  return (
    <section
      id="publication"
      aria-labelledby="publication-title"
      className="container-x relative pt-24 pb-4 md:pt-36 md:pb-8"
    >
      <SectionHeader
        id="publication"
        kicker="Peer-reviewed / written to long-term storage"
        title="Publication"
        headingId="publication-title"
      />

      <div className="grid grid-cols-12 gap-x-4 gap-y-12">
        <article className="ticked bg-surface/50 col-span-12 p-6 md:p-10 lg:col-span-7">
          <TickB />
          <p className="mono mb-8 flex flex-wrap items-center justify-between gap-3">
            <span className="text-muted">[1] {p.venueShort}</span>
            <span className="dot text-[15px]">{p.year}</span>
          </p>
          <RevealText as="h3" className="serif text-[clamp(32px,3.6vw,56px)] leading-[1.04]">
            “{p.title}”
          </RevealText>
          <p className="text-muted mt-6 text-[15px] leading-relaxed">
            <span className="text-ink">{identity.name}</span> ({p.role}). <em>{p.venue}</em>,{" "}
            {p.publisher}. {p.guide}.
          </p>
          <ul className="border-line-strong mt-8 space-y-3 border-t pt-6">
            {p.bullets.map((b, i) => (
              <li key={i} className="grid grid-cols-[1.6rem_1fr] gap-2 text-[16px]">
                <span aria-hidden="true" className="text-muted">
                  —
                </span>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <Magnetic>
              <a
                href={p.links.paper}
                target="_blank"
                rel="noopener noreferrer"
                className="pill pill-ink"
                data-cursor="OPEN ↗"
              >
                Read paper <span aria-hidden="true">↗</span>
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href={p.links.code}
                target="_blank"
                rel="noopener noreferrer"
                className="pill pill-outline"
                data-cursor="OPEN ↗"
              >
                CorrelationX code <span aria-hidden="true">↗</span>
              </a>
            </Magnetic>
          </div>
        </article>

        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <Heatmap />
          <p className="mono text-muted mt-6">Methods</p>
          <p className="mt-2 text-[15px]">
            Pearson · Spearman · Kendall&apos;s Tau · Time-lagged cross-correlation
          </p>
        </div>
      </div>
    </section>
  );
}
