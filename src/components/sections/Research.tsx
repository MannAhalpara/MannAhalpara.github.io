import { currentResearch, researchInterests } from "@/content/content";
import { RevealText } from "@/motion/RevealText";
import { SectionHeader } from "../SectionHeader";
import { MemoryDiagram } from "./MemoryDiagram";

export function Research() {
  const r = currentResearch;
  return (
    <section
      id="research"
      aria-labelledby="research-title"
      className="container-x relative pt-24 pb-4 md:pt-36 md:pb-8"
    >
      <SectionHeader
        id="research"
        kicker="Now — what is being written to memory"
        title="Research"
        headingId="research-title"
      />

      <div className="grid grid-cols-12 gap-x-4 gap-y-14">
        {/* sticky column */}
        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <p className="mono mb-6 inline-flex items-center gap-2.5">
              <span className="live-dot" aria-hidden="true" />
              <span className="text-accent-text">Now</span> — Sentic Team, NTU Singapore
            </p>
            <h3 className="display text-[clamp(40px,4.6vw,72px)]">{r.role}</h3>
            <p className="mt-3 text-[18px]">{r.org}</p>
            <dl className="mono border-line-strong mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 border-y py-4">
              <dt className="text-muted">Dates</dt>
              <dd>
                {r.start} — {r.end}
              </dd>
              <dt className="text-muted">Place</dt>
              <dd>{r.place}, remote</dd>
              <dt className="text-muted">People</dt>
              <dd>{r.meta}</dd>
            </dl>
            <ol className="mt-8 space-y-5">
              {r.bullets.map((b, i) => (
                <li key={i} className="grid grid-cols-[2.2rem_1fr] gap-2">
                  <span className="dot text-muted pt-0.5 text-[14px]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <RevealText as="p" className="text-[16.5px] leading-relaxed">
                    {b}
                  </RevealText>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* diagram */}
        <div className="col-span-12 lg:col-span-6 lg:col-start-7">
          <MemoryDiagram />
        </div>
      </div>

      {/* interests */}
      <div className="mt-24 grid grid-cols-12 gap-x-4 gap-y-6 md:mt-32">
        <p className="mono text-muted col-span-12 md:col-span-3">Research interests</p>
        <ul className="col-span-12 flex flex-wrap gap-2 md:col-span-9">
          {researchInterests.map((t) => (
            <li key={t} className="tag h-auto min-h-9 px-4 py-2 text-[11.5px] whitespace-normal">
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
