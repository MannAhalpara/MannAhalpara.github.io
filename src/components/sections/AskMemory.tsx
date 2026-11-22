"use client";

import { useEffect, useMemo, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";
import { MemoryIndex } from "@/lib/memory-index";
import {
  MEMORY_FALLBACK,
  MEMORY_SUGGESTED,
  type MemoryEntry,
  type MemoryLink,
} from "@/lib/memory-qa";
import { scrollToTarget } from "@/lib/scroll";
import { TransitionLink } from "../TransitionLink";
import { SectionHeader, TickB } from "../SectionHeader";

type Shown = {
  /** What the visitor asked (or the chip they clicked). */
  q: string;
  /** null = nothing cleared the threshold, show the fallback. */
  entry: MemoryEntry | null;
  /** Bumped on every ask so the reveal replays even for the same answer. */
  n: number;
};

function useTypewriter(text: string, run: boolean, speed = 4) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run || !text) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += speed;
      setN(Math.min(i, text.length));
      if (i >= text.length) window.clearInterval(id);
    }, 16);
    return () => window.clearInterval(id);
  }, [text, run, speed]);
  return run ? text.slice(0, n) : text;
}

/** Remount per answer (via key) so the counter restarts at 0. */
function Typed({ text, run }: { text: string; run: boolean }) {
  const shown = useTypewriter(text, run);
  return (
    <>
      {shown}
      {run && shown.length < text.length ? (
        <span className="bg-[var(--accent-text)] ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em]" />
      ) : null}
    </>
  );
}

/** Panel colours as theme tokens, so `.pill-outline` reads correctly on the dark terminal. */
const panelTokens = { "--ink": "#F3EEE6", "--paper": "#1E1414" } as React.CSSProperties;

function AnswerLink({ link }: { link: MemoryLink }) {
  const cls = "pill pill-sm pill-outline";
  const { href, label } = link;
  if (href.startsWith("#")) {
    return (
      <a
        href={href}
        className={cls}
        onClick={(e) => {
          if (scrollToTarget(href)) e.preventDefault();
        }}
      >
        {label} <span aria-hidden="true">↓</span>
      </a>
    );
  }
  if (href.startsWith("/work/")) {
    return (
      <TransitionLink href={href} className={cls}>
        {label} <span aria-hidden="true">→</span>
      </TransitionLink>
    );
  }
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls}>
        {label} <span aria-hidden="true">↗</span>
      </a>
    );
  }
  // external sites and the résumé PDF open in a new tab
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cls} data-cursor="OPEN ↗">
      {label} <span aria-hidden="true">↗</span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

const chipCls =
  "rounded-full border border-white/25 px-3 py-1.5 text-left text-[13px] text-white/85 transition-colors hover:border-white hover:text-white";

export function AskMemory() {
  const index = useMemo(() => new MemoryIndex(), []);
  const suggested = useMemo(
    () => MEMORY_SUGGESTED.map((id) => index.byId(id)).filter((e): e is MemoryEntry => !!e),
    [index],
  );
  const [q, setQ] = useState("");
  const [shown, setShown] = useState<Shown | null>(null);
  const animate = !useReducedMotion();

  const ask = (query: string) => {
    const text = query.trim();
    if (!text) return;
    setShown((s) => ({ q: text, entry: index.answer(text), n: (s?.n ?? 0) + 1 }));
  };

  /** Suggested and related chips skip search and show the entry directly. */
  const show = (entry: MemoryEntry) => {
    setQ(entry.question);
    setShown((s) => ({ q: entry.question, entry, n: (s?.n ?? 0) + 1 }));
  };

  const answer = shown ? (shown.entry ?? MEMORY_FALLBACK) : null;
  const related = answer
    ? answer.related.map((id) => index.byId(id)).filter((e): e is MemoryEntry => !!e)
    : [];

  return (
    <section
      id="ask"
      aria-labelledby="ask-title"
      className="container-x relative pt-24 pb-4 md:pt-36 md:pb-8"
    >
      <SectionHeader
        id="ask"
        kicker="Retrieval / query this site"
        title="Ask my memory"
        headingId="ask-title"
      />

      <div
        className="ticked overflow-hidden bg-[#1E1414] text-[#F3EEE6] dark:bg-[#0E0808]"
        style={{ "--accent-text": "#E38A84" } as React.CSSProperties}
      >
        <TickB />
        <div className="mono flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 text-[#B3A69E]">
          <span className="flex items-center gap-2">
            <span className="live-dot" aria-hidden="true" />
            memory://mann-ahalpara
          </span>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_1.3fr]">
          <div className="border-b border-white/10 p-5 md:p-8 lg:border-r lg:border-b-0">
            <p className="text-[19px] leading-snug md:text-[22px]">Ask anything about Mann.</p>
            <form
              className="mt-8"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                ask(q);
              }}
            >
              <label htmlFor="ask-input" className="mono mb-2 block text-[#B3A69E]">
                Query
              </label>
              <div className="flex items-center gap-2 border-b border-white/30 pb-2 focus-within:border-[var(--accent-text)]">
                <span aria-hidden="true" className="mono text-[var(--accent-text)]">
                  &gt;
                </span>
                <input
                  id="ask-input"
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Type a question…"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full bg-transparent py-2 font-mono text-[16px] text-white placeholder:text-[#B3A69E] focus:outline-none"
                />
                <button
                  type="submit"
                  className="pill pill-sm border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-ink)] hover:border-white hover:bg-white hover:text-[#1E1414]"
                >
                  Retrieve
                </button>
              </div>
            </form>
            <p className="mono mt-8 mb-3 text-[#B3A69E]">Try</p>
            <ul className="flex flex-wrap gap-2">
              {suggested.map((e) => (
                <li key={e.id}>
                  <button type="button" onClick={() => show(e)} className={chipCls}>
                    {e.question}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="min-h-[360px] p-5 md:p-8">
            {!shown || !answer ? (
              <div
                className="mono flex h-full min-h-[300px] flex-col justify-between text-[#B3A69E]"
                aria-hidden="true"
              >
                <span>awaiting query_</span>
                <span>ready</span>
              </div>
            ) : null}

            {/* Always mounted so screen readers pick up each new answer. */}
            <div aria-live="polite" aria-atomic="true">
              {shown && answer ? (
                <div key={shown.n}>
                  <p className="mono mb-6 text-[#B3A69E]">
                    <span aria-hidden="true">&gt; </span>
                    {shown.q}
                  </p>
                  <p className="sr-only">{answer.answer}</p>
                  <p className="text-[17px] leading-relaxed text-white/90" aria-hidden="true">
                    <Typed text={answer.answer} run={animate} />
                  </p>
                </div>
              ) : null}
            </div>

            {shown && answer ? (
              <div key={shown.n} className={animate ? "ask-fade" : undefined}>
                {answer.links.length ? (
                  <ul className="mt-8 flex flex-wrap gap-2" style={panelTokens}>
                    {answer.links.map((l) => (
                      <li key={l.href + l.label}>
                        <AnswerLink link={l} />
                      </li>
                    ))}
                  </ul>
                ) : null}
                {related.length ? (
                  <>
                    <p className="mono mt-8 mb-3 text-[#B3A69E]">Related</p>
                    <ul className="flex flex-wrap gap-2">
                      {related.map((e) => (
                        <li key={e.id}>
                          <button type="button" onClick={() => show(e)} className={chipCls}>
                            {e.question}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
