"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { identity, researchInterests } from "@/content/content";
import { scrollToTarget } from "@/lib/scroll";
import { Magnetic } from "@/motion/Magnetic";
import { Marquee } from "@/motion/Marquee";

const MemoryField = dynamic(() => import("./MemoryField"), { ssr: false });

/**
 * One masked line of the hero name. The reveal (y: 110% → 0, 0.04s stagger,
 * expo.out) is a CSS transition keyed off `html.hero-in`, so it needs no JS
 * library and the text stays server-rendered HTML.
 */
function Chars({
  word,
  offset = 0,
  className,
}: {
  word: string;
  offset?: number;
  className?: string;
}) {
  return (
    <span
      className={`block overflow-hidden pb-[0.02em]${className ? ` ${className}` : ""}`}
      aria-hidden="true"
    >
      {word.split("").map((c, i) => (
        <span
          key={i}
          className="hero-char inline-block"
          style={{ "--i": offset + i } as React.CSSProperties}
        >
          {c}
        </span>
      ))}
    </span>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const [fieldOn, setFieldOn] = useState(false);

  // Lazy-init the canvas after first paint + intro.
  useEffect(() => {
    let idle = 0;
    const go = () => {
      const ric = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 200));
      idle = ric(() => setFieldOn(true)) as number;
    };
    if (window.__memReady) go();
    else window.addEventListener("mem:ready", go, { once: true });
    return () => {
      window.removeEventListener("mem:ready", go);
      window.cancelIdleCallback?.(idle);
    };
  }, []);

  return (
    <section
      ref={root}
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-[100svh] flex-col overflow-hidden pt-24 md:pt-28"
    >
      {fieldOn && <MemoryField className="pointer-events-none absolute inset-0 z-0" />}

      <div className="container-x relative z-10 flex flex-1 flex-col">
        {/* corner meta */}
        <div className="mono text-muted flex items-start justify-between gap-4" data-hero-fade="0">
          <span>
            {identity.location.split(",")[0]!.toUpperCase()}, IN — {identity.coords}
          </span>
          <span className="hidden sm:inline">MEM_01 / INDEX</span>
          <span suppressHydrationWarning>©{new Date().getFullYear()}</span>
        </div>

        <div className="flex flex-1 flex-col justify-center py-10">
          <h1 id="hero-title" className="display hero-name leading-[0.8] tracking-[-0.01em]">
            <span className="sr-only">{identity.name}</span>
            <Chars word={identity.firstName.toUpperCase()} />
            <Chars
              word={identity.lastName.toUpperCase()}
              offset={identity.firstName.length}
              className="mt-[0.05em]"
            />
          </h1>

          <div className="mt-8 grid grid-cols-12 items-end gap-x-4 gap-y-6 md:mt-10">
            <p className="col-span-12 max-w-[24rem] text-[17px] leading-snug md:col-span-5 md:max-w-[28rem] md:text-[19px]">
              {identity.title}
            </p>
            <div
              className="col-span-12 flex flex-col gap-5 md:col-span-7 md:items-end"
              data-hero-fade="1"
            >
              <p className="mono border-line-strong bg-paper/70 inline-flex w-fit items-center gap-2.5 rounded-full border px-3.5 py-2 backdrop-blur-sm">
                <span className="live-dot" aria-hidden="true" />
                <span>{identity.status}</span>
              </p>
              <div className="flex flex-wrap gap-3">
                <Magnetic>
                  <a
                    href="#work"
                    className="pill pill-ink"
                    data-cursor="VIEW"
                    onClick={(e) => {
                      if (scrollToTarget("work")) e.preventDefault();
                    }}
                  >
                    View work <span aria-hidden="true">→</span>
                  </a>
                </Magnetic>
                <Magnetic>
                  <a
                    href={identity.resume.href}
                    download={identity.resume.filename}
                    className="pill pill-outline bg-paper/60 backdrop-blur-sm"
                    data-cursor="PDF ↓"
                  >
                    Download résumé <span aria-hidden="true">↓</span>
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>
        </div>

        <div className="mono text-muted flex items-center justify-between pb-4" data-hero-fade="2">
          <span className="hidden sm:inline">{identity.openTo.join(" · ")}</span>
          <a
            href="#about"
            className="link-u ml-auto"
            onClick={(e) => {
              if (scrollToTarget("about")) e.preventDefault();
            }}
          >
            Scroll to retrieve ↓
          </a>
        </div>
      </div>

      <div
        className="border-line-strong bg-paper/85 relative z-10 border-y py-3 backdrop-blur-sm"
        data-hero-fade="3"
      >
        <Marquee speed={45}>
          {researchInterests.map((r) => (
            <span key={r} className="mono flex items-center whitespace-nowrap">
              <span className="px-6">{r}</span>
              <span aria-hidden="true" className="text-muted">
                ✳
              </span>
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
