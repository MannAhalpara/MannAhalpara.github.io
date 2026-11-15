/**
 * "Ask my memory": a tiny client-side retrieval system over this site's content.
 * Passages are built from content.ts, indexed with Okapi BM25, no LLM, no network.
 */
import {
  achievements,
  currentResearch,
  education,
  experience,
  identity,
  positioning,
  projects,
  publication,
  researchInterests,
  skills,
} from "@/content/content";

export type Passage = {
  id: string;
  /** DOM id to scroll to and highlight. */
  anchor: string;
  /** Short label shown in the citation list. */
  source: string;
  text: string;
  /** Extra searchable terms not shown to the user (e.g. slugs, synonyms in content). */
  hidden?: string;
};

export function buildPassages(): Passage[] {
  const out: Passage[] = [];
  out.push({
    id: "bio",
    anchor: "about",
    source: "About",
    text: positioning.aboutPlain,
    hidden: identity.title,
  });
  out.push({
    id: "contact",
    anchor: "contact",
    source: "Contact",
    text: `Email ${identity.email}. Based in ${identity.location}. Open to ${identity.openTo.join(", ").toLowerCase()}.`,
    hidden: "reach contact hire linkedin github resume cv",
  });
  out.push({
    id: "research-now",
    anchor: "research",
    source: "Research · NTU",
    text: `${currentResearch.role}, ${currentResearch.org}, ${currentResearch.start}–${currentResearch.end}. ${currentResearch.meta}.`,
    hidden: "sentic singapore cambria internship current now",
  });
  currentResearch.bullets.forEach((b, i) =>
    out.push({ id: `research-${i}`, anchor: "research", source: "Research · NTU", text: b }),
  );
  out.push({
    id: "interests",
    anchor: "research",
    source: "Research interests",
    text: `Research interests: ${researchInterests.join(", ")}.`,
  });
  out.push({
    id: "publication",
    anchor: "publication",
    source: "Publication",
    text: `${publication.title}. ${publication.role}, ${publication.venue}, ${publication.publisher}. ${publication.guide}. ${publication.bullets.join(" ")}`,
    hidden: "paper published icids stock market finance",
  });
  experience.slice(1).forEach((e) =>
    out.push({
      id: `exp-${e.id}`,
      anchor: `exp-${e.id}`,
      source: `Internship · ${e.org.split(" (")[0]}`,
      text: `${e.role}, ${e.org}, ${e.start}–${e.end}. ${e.bullets.join(" ")}`,
      hidden: "internship work experience",
    }),
  );
  education.forEach((ed, i) =>
    out.push({
      id: `edu-${i}`,
      anchor: "about",
      source: "Education",
      text: `${ed.degree}, ${ed.school}, ${ed.years}. ${ed.result}.${ed.coursework.length ? ` Relevant coursework: ${ed.coursework.join(", ")}.` : ""}`,
      hidden: "education university degree college school grades",
    }),
  );
  projects.forEach((p) =>
    out.push({
      id: `proj-${p.slug}`,
      anchor: `project-${p.slug}`,
      source: `Project · ${p.name}`,
      text: `${p.title}. ${p.problem} ${p.details.join(" ")} Stack: ${p.stack.join(", ") || "—"}.`,
      hidden: `${p.slug} project built ${p.category.join(" ")} ${p.approach.join(" ")}`,
    }),
  );
  out.push({
    id: "skills",
    anchor: "stack",
    source: "Stack",
    text: skills.map((g) => `${g.group}: ${g.items.join(", ")}.`).join(" "),
    hidden: "skills tools technologies languages",
  });
  out.push({
    id: "achievements",
    anchor: "achievements",
    source: "Achievements",
    text: achievements.map((a) => `${a.title} (${a.detail}).`).join(" "),
    hidden: "awards certificates training certification",
  });
  return out;
}

/* --------------------------------------------------------------- BM25 */

const STOP = new Set(
  "a an and are as at be by did do does for from has have he him his how i in is it its me my of on or so that the their them they this to was what when where which who why will with you your about mann ahalpara".split(
    " ",
  ),
);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/r²/g, "r2")
    .replace(/\ba\*/g, "astar")
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

export type Hit = { passage: Passage; score: number };

export class BM25 {
  private docs: { tokens: string[]; tf: Map<string, number>; len: number }[];
  private df = new Map<string, number>();
  private avgdl: number;
  constructor(
    private passages: Passage[],
    private k1 = 1.4,
    private b = 0.72,
  ) {
    this.docs = passages.map((p) => {
      const tokens = tokenize(`${p.source} ${p.text} ${p.hidden ?? ""}`);
      const tf = new Map<string, number>();
      for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
      for (const t of tf.keys()) this.df.set(t, (this.df.get(t) ?? 0) + 1);
      return { tokens, tf, len: tokens.length };
    });
    this.avgdl = this.docs.reduce((s, d) => s + d.len, 0) / Math.max(1, this.docs.length);
  }
  search(query: string, k = 3): Hit[] {
    const q = Array.from(new Set(tokenize(query)));
    if (!q.length) return [];
    const N = this.docs.length;
    const hits: Hit[] = [];
    this.docs.forEach((d, i) => {
      let score = 0;
      for (const term of q) {
        const f = d.tf.get(term);
        if (!f) continue;
        const n = this.df.get(term) ?? 0;
        const idf = Math.log(1 + (N - n + 0.5) / (n + 0.5));
        score +=
          (idf * (f * (this.k1 + 1))) /
          (f + this.k1 * (1 - this.b + (this.b * d.len) / this.avgdl));
      }
      if (score > 0) hits.push({ passage: this.passages[i]!, score });
    });
    hits.sort((a, b) => b.score - a.score);
    // keep results diverse: at most two passages from the same source
    const perSource = new Map<string, number>();
    const out: Hit[] = [];
    for (const h of hits) {
      const n = perSource.get(h.passage.source) ?? 0;
      if (n >= 2) continue;
      perSource.set(h.passage.source, n + 1);
      out.push(h);
      if (out.length === k) break;
    }
    return out;
  }
}
