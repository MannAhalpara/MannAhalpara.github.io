"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { projects, workFilters, type WorkFilter } from "@/content/content";
import { cn } from "@/lib/utils";
import type { Flip } from "gsap/Flip";
import { getFlip, getMotion, loadFlip, MQ, useMotion } from "@/motion/gsap";
import { ProjectCard } from "./ProjectCard";

/** Filterable project grid. Filtering animates with GSAP Flip. */
export function WorkGrid() {
  const [filter, setFilter] = useState<WorkFilter>("All");
  const grid = useRef<HTMLUListElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);

  const matches = (cats: readonly string[]) => filter === "All" || cats.includes(filter);
  const count = projects.filter((p) => matches(p.category)).length;

  const choose = (f: WorkFilter) => {
    if (f === filter) return;
    if (grid.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      flipState.current = getFlip()?.getState(grid.current.querySelectorAll("[data-flip]")) ?? null;
    }
    setFilter(f);
  };

  useLayoutEffect(() => {
    const state = flipState.current;
    if (!state || !grid.current) return;
    flipState.current = null;
    const Flip = getFlip();
    const gsap = getMotion()?.gsap;
    if (!Flip || !gsap) return;
    Flip.from(state, {
      duration: 0.7,
      ease: "power3.inOut",
      absolute: true,
      nested: true,
      prune: true,
      onEnter: (els) =>
        gsap.fromTo(
          els,
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" },
        ),
      onLeave: (els) =>
        gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.35, ease: "power2.in" }),
    });
  }, [filter]);

  // warp the hovered card's dithered preview (pointer devices)
  useMotion(
    ({ gsap }) => {
      const mm = gsap.matchMedia();
      mm.add(MQ.fine, () => {
        const disp = document.querySelector<SVGFEDisplacementMapElement>("#warp-map");
        const turb = document.querySelector<SVGFETurbulenceElement>("#warp-turb");
        if (!disp || !turb || !grid.current) return;
        const state = { s: 0, f: 0.012 };
        const apply = () => {
          disp.setAttribute("scale", state.s.toFixed(2));
          turb.setAttribute("baseFrequency", `${state.f.toFixed(4)} ${(state.f * 1.6).toFixed(4)}`);
        };
        const cards = Array.from(grid.current.querySelectorAll<HTMLElement>(".project-card"));
        const handlers = cards.map((card) => {
          const img = card.querySelector<HTMLElement>(".project-preview");
          const enter = () => {
            if (img) img.style.filter = "invert(var(--invert)) url(#warp)";
            gsap.fromTo(
              state,
              { s: 0, f: 0.012 },
              { s: 14, f: 0.02, duration: 0.5, ease: "expo.out", onUpdate: apply },
            );
            gsap.to(state, {
              s: 0,
              duration: 0.9,
              delay: 0.45,
              ease: "power3.out",
              onUpdate: apply,
            });
          };
          const leave = () => {
            if (img) img.style.filter = "";
          };
          card.addEventListener("pointerenter", enter);
          card.addEventListener("pointerleave", leave);
          return () => {
            card.removeEventListener("pointerenter", enter);
            card.removeEventListener("pointerleave", leave);
          };
        });
        return () => handlers.forEach((h) => h());
      });
    },
    { scope: grid },
  );

  return (
    <div>
      <svg aria-hidden="true" width="0" height="0" className="absolute">
        <filter id="warp" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            id="warp-turb"
            type="fractalNoise"
            baseFrequency="0.012 0.02"
            numOctaves="2"
            seed="3"
          />
          <feDisplacementMap
            id="warp-map"
            in="SourceGraphic"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div
          role="group"
          aria-label="Filter projects by category"
          onPointerEnter={() => void loadFlip()}
          onFocus={() => void loadFlip()}
          className="flex flex-wrap gap-2"
        >
          {workFilters.map((f) => {
            const on = f === filter;
            return (
              <button
                key={f}
                type="button"
                aria-pressed={on}
                onClick={() => choose(f)}
                className={cn(
                  "pill pill-sm",
                  on
                    ? "border-accent bg-accent text-[#0e0e0e]"
                    : "border-line-strong hover:border-ink",
                )}
              >
                {f}
              </button>
            );
          })}
        </div>
        <p className="mono text-muted" aria-live="polite">
          <span className="dot text-ink">{String(count).padStart(2, "0")}</span> /{" "}
          {String(projects.length).padStart(2, "0")} entries retrieved
        </p>
      </div>

      <ul ref={grid} className="grid grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-4">
        {projects.map((p, i) => (
          <li
            key={p.slug}
            id={`project-${p.slug}`}
            data-flip
            data-flip-id={p.slug}
            hidden={!matches(p.category)}
          >
            <ProjectCard project={p} index={i} />
          </li>
        ))}
      </ul>
    </div>
  );
}
