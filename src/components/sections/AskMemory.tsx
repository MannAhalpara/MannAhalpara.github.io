"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/hooks";
import { BM25, buildPassages, tokenize, type Hit } from "@/lib/memory-index";
import { scrollToTarget } from "@/lib/scroll";
import { SectionHeader, TickB } from "../SectionHeader";

const SUGGESTIONS = [
  "What did he build with Qdrant?",
  "Where is he doing research?",
  "Best AQI model?",
  "What is the ICIDS paper about?",
  "Which projects use Gemini?",
];

type Result = { q: string; hits: (Hit & { snippet: string })[]; ms: number };

/** Pick the 1–2 sentences of a passage with the most query-term overlap. */
function snippet(text: string, q: string[]) {
  const sentences = text.split(/(?<=[.!?])\s+(?=[A-Z0-9])/);
  const scored = sentences.map((s, i) => {
    const toks = new Set(tokenize(s));
    return { s, i, score: q.reduce((n, t) => n + (toks.has(t) ? 1 : 0), 0) };
  });
  const best = [...scored]
    .sort((a, b) => b.score - a.score || a.i - b.i)
    .slice(0, 2)
    .sort((a, b) => a.i - b.i);
  const out = best.map((b) => b.s).join(" ");
  return out.length > 320 ? `${out.slice(0, 317).trimEnd()}…` : out;
}

function useTypewriter(text: string, run: boolean, speed = 6) {
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

/** Remount per result (via key) so the counter restarts at 0. */
function Typed({ text, run, delay = 0 }: { text: string; run: boolean; delay?: number }) {
  const [go, setGo] = useState(delay === 0);
  useEffect(() => {
    if (go) return;
    const id = window.setTimeout(() => setGo(true), delay);
    return () => window.clearTimeout(id);
  }, [go, delay]);
  const shown = useTypewriter(go || !run ? text : "", run);
  return (
    <>
      {shown}
      {run && shown.length < text.length ? (
        <span className="bg-accent ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[0.15em]" />
      ) : null}
    </>
  );
}

export function AskMemory() {
  const passages = useMemo(() => buildPassages(), []);
  const engine = useMemo(() => new BM25(passages), [passages]);
  const [q, setQ] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const animate = !useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);

  const ask = (query: string) => {
    const text = query.trim();
    if (!text) return;
    const t0 = performance.now();
    const hits = engine.search(text, 3);
    const terms = tokenize(text);
    setResult({
      q: text,
      hits: hits.map((h) => ({ ...h, snippet: snippet(h.passage.text, terms) })),
      ms: performance.now() - t0,
    });
  };

  const jump = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (!el) return;
    scrollToTarget(anchor);
    el.classList.remove("mem-highlight");
    void el.offsetWidth;
    el.classList.add("mem-highlight");
    window.setTimeout(() => el.classList.remove("mem-highlight"), 1700);
    window.setTimeout(() => {
      const focusable = el.querySelector<HTMLElement>("a, button, h2, h3");
      if (focusable) {
        if (!focusable.matches("a, button")) focusable.setAttribute("tabindex", "-1");
        focusable.focus({ preventScroll: true });
      }
    }, 900);
  };

  const srSummary = result
    ? result.hits.length
      ? `${result.hits.length} passages retrieved for “${result.q}”. ${result.hits
          .map((h, i) => `[${i + 1}] ${h.passage.source}: ${h.snippet}`)
          .join(" ")}`
      : `No passages matched “${result.q}”.`
    : "";

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

      <div className="ticked overflow-hidden bg-[#0e0e0e] text-[#edebe6]">
        <TickB />
        <div className="mono flex items-center justify-between gap-4 border-b border-white/10 px-4 py-3 text-white/60">
          <span className="flex items-center gap-2">
            <span className="live-dot" aria-hidden="true" />
            memory://mann-ahalpara
          </span>
          <span className="hidden sm:inline">bm25 · k1 1.4 · b 0.72 · top-3</span>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_1.3fr]">
          <div className="border-b border-white/10 p-5 md:p-8 lg:border-r lg:border-b-0">
            <p className="text-[19px] leading-snug md:text-[22px]">
              Ask anything about Mann — e.g.{" "}
              <em className="serif text-[1.15em] text-white">What did he build with Qdrant?</em>
            </p>
            <form
              className="mt-8"
              role="search"
              onSubmit={(e) => {
                e.preventDefault();
                ask(q);
              }}
            >
              <label htmlFor="ask-input" className="mono mb-2 block text-white/60">
                Query
              </label>
              <div className="flex items-center gap-2 border-b border-white/30 pb-2 focus-within:border-[#ff4a1c]">
                <span aria-hidden="true" className="mono text-[#ff4a1c]">
                  &gt;
                </span>
                <input
                  ref={inputRef}
                  id="ask-input"
                  type="text"
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Type a question…"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full bg-transparent py-2 font-mono text-[16px] text-white placeholder:text-white/60 focus:outline-none"
                />
                <button
                  type="submit"
                  className="pill pill-sm border-[#ff4a1c] bg-[#ff4a1c] text-[#0e0e0e] hover:border-white hover:bg-white"
                >
                  Retrieve
                </button>
              </div>
            </form>
            <p className="mono mt-8 mb-3 text-white/60">Try</p>
            <ul className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <li key={s}>
                  <button
                    type="button"
                    onClick={() => {
                      setQ(s);
                      ask(s);
                    }}
                    className="rounded-full border border-white/25 px-3 py-1.5 text-left text-[13px] text-white/85 transition-colors hover:border-white hover:text-white"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mono mt-10 max-w-[48ch] leading-relaxed tracking-normal text-white/60 normal-case">
              Local keyword retrieval over this site&apos;s content — no LLM, no data leaves your
              browser.
            </p>
          </div>

          <div className="min-h-[360px] p-5 md:p-8">
            <p className="sr-only" aria-live="polite" aria-atomic="true">
              {srSummary}
            </p>
            {!result ? (
              <div
                className="mono flex h-full min-h-[300px] flex-col justify-between text-white/60"
                aria-hidden="true"
              >
                <span>awaiting query_</span>
                <span>index ready · {passages.length} passages</span>
              </div>
            ) : (
              <div key={result.q + result.ms}>
                <p className="mono mb-6 text-white/60" aria-hidden="true">
                  &gt; {result.q}
                  <br />
                  {result.hits.length
                    ? `${result.hits.length} passages · ${result.ms.toFixed(2)} ms`
                    : "0 passages · nothing in memory matches that. Try a project, tool or place."}
                </p>
                <ol className="space-y-6">
                  {result.hits.map((h, i) => (
                    <li key={h.passage.id} className="grid grid-cols-[2.4rem_1fr] gap-2">
                      <button
                        type="button"
                        onClick={() => jump(h.passage.anchor)}
                        className="dot h-fit text-left text-[15px] text-[#ff4a1c] hover:underline"
                        aria-label={`Citation ${i + 1}: go to ${h.passage.source}`}
                      >
                        [{i + 1}]
                      </button>
                      <div>
                        <p
                          className="text-[15.5px] leading-relaxed text-white/90"
                          aria-hidden="true"
                        >
                          <Typed text={h.snippet} run={animate} delay={i * 380} />
                        </p>
                        <p className="mono mt-2 flex flex-wrap gap-x-3 text-[10.5px] text-white/60">
                          <button
                            type="button"
                            className="underline-offset-4 hover:text-white hover:underline"
                            onClick={() => jump(h.passage.anchor)}
                            tabIndex={-1}
                            aria-hidden="true"
                          >
                            {h.passage.source} ↗
                          </button>
                          <span aria-hidden="true">score {h.score.toFixed(2)}</span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
