/**
 * "Ask my memory": a tiny client-side retrieval system over the curated Q&A bank
 * in memory-qa.ts. Entries are indexed with Okapi BM25 (field-weighted, BM25F-style),
 * no LLM, no network.
 */
import { MEMORY_QA, type MemoryEntry } from "./memory-qa";

/* --------------------------------------------------------------- tokens */

const STOP = new Set(
  "a an and are as at be by did do does for from has have he him his how i in is it its me my of on or so that the their them they this to was what when where which why will with you your ahalpara".split(
    " ",
  ),
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/r²/g, "r2")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 1 && !STOP.has(t))
    .map(stem);
}

/** Very small suffix stemmer, enough for "built/build", "models/model", etc. */
function stem(t: string) {
  if (t.length <= 4) return t;
  return t
    .replace(/(ies)$/, "y")
    .replace(/(ing|ed|es|s)$/, "")
    .replace(/(ation)$/, "ate");
}

/* ----------------------------------------------------------------- BM25 */

/** The question and its aliases are what visitors actually type, so they count most. */
const FIELD_WEIGHTS = { question: 3, aliases: 3, keywords: 1 } as const;

/**
 * Minimum score for an entry to count as an answer. Every real query in the bank
 * scores well above this; it only filters out a lone, weak, incidental term match.
 */
const MIN_SCORE = 1.2;

/**
 * Added per token when the query contains a whole question or alias as a phrase,
 * so "what is he working on" lands on the entry that lists it verbatim.
 */
const PHRASE_BONUS = 1.5;

type Doc = { tf: Map<string, number>; len: number; phrases: string[][] };

/** True when `phrase` appears as a contiguous run inside `tokens`. */
function containsRun(tokens: string[], phrase: string[]) {
  if (!phrase.length || phrase.length > tokens.length) return false;
  outer: for (let i = 0; i + phrase.length <= tokens.length; i++) {
    for (let j = 0; j < phrase.length; j++) if (tokens[i + j] !== phrase[j]) continue outer;
    return true;
  }
  return false;
}

export class MemoryIndex {
  private docs: Doc[];
  private df = new Map<string, number>();
  private avgdl: number;

  constructor(
    private entries: MemoryEntry[] = MEMORY_QA,
    private k1 = 1.4,
    private b = 0.72,
  ) {
    this.docs = entries.map((e) => {
      const tf = new Map<string, number>();
      const add = (text: string, w: number) => {
        for (const t of tokenize(text)) tf.set(t, (tf.get(t) ?? 0) + w);
      };
      add(e.question, FIELD_WEIGHTS.question);
      e.aliases.forEach((a) => add(a, FIELD_WEIGHTS.aliases));
      e.keywords.forEach((k) => add(k, FIELD_WEIGHTS.keywords));
      for (const t of tf.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1);
      let len = 0;
      for (const f of tf.values()) len += f;
      const phrases = [e.question, ...e.aliases].map(tokenize).filter((p) => p.length);
      return { tf, len, phrases };
    });
    this.avgdl = this.docs.reduce((s, d) => s + d.len, 0) / Math.max(1, this.docs.length);
  }

  private score(d: Doc, q: string[], seq: string[]) {
    const N = this.docs.length;
    let score = 0;
    for (const term of q) {
      const f = d.tf.get(term);
      if (!f) continue;
      const n = this.df.get(term) ?? 0;
      const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
      score +=
        (idf * (f * (this.k1 + 1))) / (f + this.k1 * (1 - this.b + (this.b * d.len) / this.avgdl));
    }
    if (score > 0) {
      const run = Math.max(0, ...d.phrases.filter((p) => containsRun(seq, p)).map((p) => p.length));
      score += run * PHRASE_BONUS;
    }
    return score;
  }

  /** The single best entry for a query, with its score (0 when nothing matches). */
  best(query: string): { entry: MemoryEntry | null; score: number } {
    const seq = tokenize(query);
    const q = Array.from(new Set(seq));
    let best: { entry: MemoryEntry | null; score: number } = { entry: null, score: 0 };
    if (!q.length) return best;
    this.docs.forEach((d, i) => {
      const s = this.score(d, q, seq);
      if (s > best.score) best = { entry: this.entries[i]!, score: s };
    });
    return best;
  }

  /** The best entry if it clears the threshold, otherwise null (show the fallback). */
  answer(query: string): MemoryEntry | null {
    const { entry, score } = this.best(query);
    return entry && score >= MIN_SCORE ? entry : null;
  }

  byId(id: string) {
    return this.entries.find((e) => e.id === id) ?? null;
  }
}
