import { achievements } from "@/content/content";
import { SectionHeader } from "../SectionHeader";

export function Achievements() {
  return (
    <section
      id="achievements"
      aria-labelledby="achievements-title"
      className="container-x relative pt-24 pb-4 md:pt-36 md:pb-8"
    >
      <SectionHeader
        id="achievements"
        kicker="Index / achievements & training"
        title="Achievements"
        headingId="achievements-title"
      />
      <ol className="border-line-strong border-t">
        {achievements.map((a, i) => (
          <li
            key={a.title}
            className="group border-line-strong hover:bg-ink hover:text-paper grid grid-cols-[3rem_1fr_auto] items-baseline gap-x-4 border-b px-2 py-5 transition-colors duration-300 md:grid-cols-[6rem_1fr_1fr_3rem] md:px-4 md:py-7"
          >
            <span className="dot text-muted group-hover:text-paper/60 text-[15px]">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-[19px] font-medium md:text-[24px]">{a.title}</span>
            <span className="text-muted group-hover:text-paper/70 col-start-2 text-[14px] md:col-start-3 md:text-[15px]">
              {a.detail}
            </span>
            <span
              aria-hidden="true"
              className="text-accent col-start-3 row-start-1 -translate-x-2 text-right text-[20px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:col-start-4"
            >
              →
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
