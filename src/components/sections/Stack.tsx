import { skills } from "@/content/content";
import { SectionHeader, TickB } from "../SectionHeader";

export function Stack() {
  return (
    <section
      id="stack"
      aria-labelledby="stack-title"
      className="relative pt-24 pb-4 md:pt-36 md:pb-8"
    >
      <div className="container-x">
        <SectionHeader
          id="stack"
          kicker="Semantic memory / tools in active use"
          title="Stack"
          headingId="stack-title"
        />
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((g, i) => (
            <li key={g.group} className="ticked bg-surface/50 flex flex-col p-5">
              <TickB />
              <p className="mono mb-8 flex justify-between">
                <span>{g.group}</span>
                <span className="dot text-muted">{String(i + 1).padStart(2, "0")}</span>
              </p>
              <ul className="mt-auto flex flex-wrap gap-1.5">
                {g.items.map((s) => (
                  <li key={s} className="tag tracking-normal normal-case">
                    {s}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
