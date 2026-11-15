"use client";

import { useId, useRef, useState } from "react";
import { experience } from "@/content/content";
import { MQ, useMotion } from "@/motion/gsap";
import { SectionHeader } from "../SectionHeader";

function Entry({
  e,
  index,
  defaultOpen = true,
}: {
  e: (typeof experience)[number];
  index: number;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();
  return (
    <li
      id={`exp-${e.id}`}
      className="exp-entry relative grid grid-cols-12 gap-x-4 gap-y-3 pb-14 pl-8 md:pl-0"
    >
      {/* node */}
      <span
        aria-hidden="true"
        className="exp-node border-ink bg-paper absolute top-2 left-[-5px] size-[11px] border md:left-[calc(25%-5.5px)]"
      />
      <div className="col-span-12 md:col-span-3 md:pr-10 md:text-right">
        <p
          className="exp-date dot text-[clamp(20px,2vw,28px)] leading-tight"
          style={{ perspective: "400px" }}
        >
          <span className="inline-block">{e.start}</span>
          <span className="text-muted inline-block px-2">—</span>
          <span className="inline-block">{e.end}</span>
        </p>
        <p className="mono text-muted mt-2">ENTRY {String(index + 1).padStart(2, "0")}</p>
      </div>
      <div className="col-span-12 md:col-span-8 md:col-start-5">
        <h3 className="display text-[clamp(34px,3.8vw,60px)]">{e.role}</h3>
        <p className="mt-2 text-[18px]">
          {e.org}
          {e.place ? <span className="text-muted"> · {e.place}</span> : null}
        </p>
        {e.meta ? <p className="mono text-muted mt-2">{e.meta}</p> : null}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="mono border-line-strong hover:border-ink mt-5 inline-flex items-center gap-2 border-b pb-1"
        >
          <span
            aria-hidden="true"
            className={`inline-block transition-transform duration-300 ${open ? "rotate-45" : ""}`}
          >
            +
          </span>
          {open ? "Collapse" : `Expand (${e.bullets.length})`}
        </button>
        <div id={panelId} hidden={!open}>
          <ul className="mt-5 max-w-[68ch] space-y-3">
            {e.bullets.map((b, i) => (
              <li key={i} className="grid grid-cols-[1.4rem_1fr] text-[16.5px] leading-relaxed">
                <span aria-hidden="true" className="text-muted">
                  —
                </span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </li>
  );
}

export function Experience() {
  const ref = useRef<HTMLElement>(null);
  useMotion(
    ({ gsap }) => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const root = ref.current!;
        gsap.fromTo(
          root.querySelector(".exp-line"),
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: root.querySelector("ol"),
              start: "top 70%",
              end: "bottom 70%",
              scrub: true,
            },
          },
        );
        root.querySelectorAll<HTMLElement>(".exp-entry").forEach((entry) => {
          const tl = gsap.timeline({
            scrollTrigger: { trigger: entry, start: "top 72%", once: true },
          });
          tl.from(entry.querySelector(".exp-node"), {
            scale: 0,
            duration: 0.5,
            ease: "back.out(3)",
          })
            .from(
              entry.querySelectorAll(".exp-date > span"),
              {
                rotateX: -90,
                opacity: 0,
                transformOrigin: "50% 50% -10px",
                duration: 0.7,
                stagger: 0.08,
                ease: "expo.out",
              },
              0,
            )
            .from(entry.querySelector("h3"), { y: 24, opacity: 0, duration: 0.9 }, 0.1);
        });
      });
    },
    { scope: ref },
  );

  return (
    <section
      ref={ref}
      id="experience"
      aria-labelledby="experience-title"
      className="container-x relative pt-24 pb-4 md:pt-36 md:pb-8"
    >
      <SectionHeader
        id="experience"
        kicker="Episodic memory / chronological"
        title="Internships"
        headingId="experience-title"
      />
      <div className="relative">
        <span
          aria-hidden="true"
          className="bg-line-strong absolute top-0 bottom-0 left-0 w-px md:left-1/4"
        />
        <span
          aria-hidden="true"
          className="exp-line bg-ink absolute top-0 bottom-0 left-0 w-px origin-top md:left-1/4"
        />
        <ol>
          {experience.map((e, i) => (
            <Entry key={e.id} e={e} index={i} defaultOpen />
          ))}
        </ol>
      </div>
    </section>
  );
}
