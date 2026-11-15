import { education, positioning, stats } from "@/content/content";
import { CountUp } from "@/motion/CountUp";
import { RevealText } from "@/motion/RevealText";
import { SectionHeader, TickB } from "../SectionHeader";

export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="container-x relative pt-24 pb-4 md:pt-36 md:pb-8"
    >
      <SectionHeader
        id="about"
        kicker="Positioning / who is retrieving"
        title="About"
        headingId="about-title"
        align="left"
      />

      {/* intro: one paragraph, key phrases highlighted */}
      <RevealText
        as="p"
        className="text-muted max-w-[62ch] text-[clamp(20px,2.1vw,28px)] leading-[1.45] text-pretty"
      >
        {positioning.about.split("**").map((part, i) =>
          i % 2 === 1 ? (
            <strong key={i} className="text-ink font-semibold">
              {part}
            </strong>
          ) : (
            part
          ),
        )}
      </RevealText>

      {/* stats */}
      <div className="mt-24 md:mt-32">
        <p className="mono text-muted mb-6">Indexed values</p>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((s) => (
            <div
              key={s.label}
              className="ticked bg-surface/60 flex min-h-[150px] flex-col justify-between p-5 md:min-h-[190px]"
            >
              <TickB />
              <dt className="mono text-muted order-2 mt-4">{s.label}</dt>
              <dd className="dot order-1 text-[clamp(56px,6.4vw,104px)] leading-[0.9]">
                {s.numeric !== undefined ? (
                  <CountUp
                    value={s.numeric}
                    decimals={s.decimals}
                    prefix={s.prefix}
                    suffix={s.suffix}
                  />
                ) : (
                  s.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      {/* education */}
      <div className="mt-24 grid grid-cols-12 gap-x-4 gap-y-6 md:mt-32">
        <p className="mono text-muted col-span-12 md:col-span-3">Education</p>
        <ul className="divide-line-strong border-line-strong col-span-12 divide-y border-y md:col-span-9">
          {education.map((e) => (
            <li key={e.degree} className="grid gap-2 py-6 md:grid-cols-[1fr_auto] md:gap-8">
              <div>
                <h3 className="text-[19px] font-medium">{e.degree}</h3>
                <p className="text-muted">{e.school}</p>
                {e.coursework.length > 0 && (
                  <p className="text-muted mt-3 max-w-[70ch] text-[14px]">
                    <span className="mono text-ink mr-2">Coursework</span>
                    {e.coursework.join(" · ")}
                  </p>
                )}
              </div>
              <div className="mono flex flex-col gap-1 md:text-right">
                <span>{e.years}</span>
                <span className="text-muted">{e.result}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
