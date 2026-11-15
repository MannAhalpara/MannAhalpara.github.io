import type { ReactNode } from "react";
import { sections } from "@/content/content";
import { RevealText } from "@/motion/RevealText";

type SectionId = (typeof sections)[number]["id"];

/** `MEM_03 / RESEARCH` index label, mono kicker and a condensed display heading. */
export function SectionHeader({
  id,
  kicker,
  title,
  aside,
  headingId,
  align = "offset",
}: {
  id: SectionId;
  kicker: string;
  title: ReactNode;
  aside?: ReactNode;
  headingId?: string;
  /** "left" stacks the index label above the title so the heading sits flush left. */
  align?: "offset" | "left";
}) {
  const s = sections.find((x) => x.id === id)!;
  const left = align === "left";
  return (
    <div className="border-line-strong mb-12 grid grid-cols-12 items-start gap-x-4 gap-y-6 border-t pt-4 md:mb-20">
      <p className={`mono col-span-12 flex items-center gap-3 ${left ? "" : "md:col-span-3"}`}>
        <span className="dot text-ink text-[13px]">{s.mem}</span>
        <span className="text-muted">/ {s.label}</span>
      </p>
      <div className={`col-span-12 ${left ? "" : "md:col-span-9"}`}>
        <p className="mono text-muted mb-4">{kicker}</p>
        <RevealText
          as="h2"
          id={headingId}
          className="display text-[clamp(52px,9vw,148px)]"
          type="lines"
        >
          {title}
        </RevealText>
        {aside ? <div className="mt-6">{aside}</div> : null}
      </div>
    </div>
  );
}

/** Bottom corner ticks for `.ticked` cells (top ticks come from ::before/::after). */
export function TickB() {
  return <span className="tick-b" aria-hidden="true" />;
}
