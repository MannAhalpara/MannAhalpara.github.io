import Image from "next/image";
import { ViewTransition } from "react";
import type { Project } from "@/content/content";
import { TransitionLink } from "../TransitionLink";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const p = project;
  return (
    <TransitionLink
      href={`/work/${p.slug}`}
      data-cursor="VIEW"
      className="project-card ticked group bg-surface/60 hover:bg-surface flex h-full flex-col transition-colors duration-300"
      aria-label={`${p.title} - case study`}
    >
      <span className="tick-b" aria-hidden="true" />
      <div className="border-line-strong flex items-center justify-between gap-3 border-b px-4 py-3">
        <ul className="flex flex-wrap gap-1.5" aria-label="Categories">
          {p.category.map((c) => (
            <li key={c} className="tag">
              {c}
            </li>
          ))}
        </ul>
        <span className="dot text-muted text-[13px]">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div className="border-line-strong bg-paper relative aspect-[16/10] overflow-hidden border-b">
        <ViewTransition name={`preview-${p.slug}`} share="morph" default="none">
          <Image
            src={`/work/${p.slug}/preview.png`}
            alt=""
            fill
            sizes="(min-width: 1536px) 25vw, (min-width: 768px) 50vw, 100vw"
            className="dither project-preview object-cover transition-transform duration-700 ease-(--ease-expo) group-hover:scale-[1.04]"
          />
        </ViewTransition>
      </div>

      <div className="flex flex-1 flex-col px-4 pt-5 pb-4">
        <h3 className="display text-[clamp(38px,3.6vw,58px)]">{p.name}</h3>
        <p className="text-muted mt-2 mb-6 max-w-[40ch] text-[15px]">{p.tagline}</p>

        <div className="border-line-strong mt-auto grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_48px] border-t border-l sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_56px]">
          {p.metrics.slice(0, 4).map((m, i) => (
            <div
              key={m.label}
              className={`border-line-strong border-r border-b px-3 py-2.5 ${i % 2 === 0 ? "col-start-1" : "col-start-2"}`}
              style={{ gridRow: Math.floor(i / 2) + 1 }}
            >
              <p className="dot truncate text-[clamp(17px,1.5vw,22px)] leading-tight font-black">
                {m.value}
              </p>
              <p className="mono text-muted mt-0.5 truncate text-[10px]">{m.label}</p>
            </div>
          ))}
          <div
            className="border-line-strong group-hover:bg-accent group-hover:text-accent-ink col-start-3 row-span-2 row-start-1 grid place-items-center border-r border-b text-[22px] transition-colors duration-300"
            aria-hidden="true"
          >
            <span className="transition-transform duration-500 ease-(--ease-expo) group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              ↗
            </span>
          </div>
        </div>
      </div>
    </TransitionLink>
  );
}
