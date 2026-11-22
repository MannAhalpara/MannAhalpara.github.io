/**
 * Single source of truth for every word, number and link on the site.
 * Components only render this data. Facts come verbatim from the résumé brief.
 *
 * Anything unknown is `null` and marked with a `TODO:` comment. Search the repo
 * for "TODO:" to find everything that still needs to be supplied.
 */

/* ------------------------------------------------------------------ types */

export type Category =
  | "AI Systems"
  | "Retrieval"
  | "Machine Learning"
  | "Full-stack"
  | "Data"
  | "Agents"
  | "Research"
  | "Algorithms"
  | "BI";

export type Stat = { value: string; label: string };

export type Project = {
  slug: string;
  title: string;
  /** Short name used in condensed caps on cards. */
  name: string;
  tagline: string;
  /** TODO: project years are not in the résumé. `null` hides the field. */
  year: string | null;
  /** TODO: role per project is not in the résumé. `null` hides the field. */
  role: string | null;
  category: Category[];
  problem: string;
  approach: string[];
  /** System diagram on the case-study page, drawn on scroll. */
  architecture: Diagram;
  details: string[];
  stack: string[];
  /** 2×2 stat block on cards; also the "Results" section on case studies. */
  metrics: Stat[];
  links: { github: string | null; live?: string; paper?: string; kaggle?: string };
};

/** One stage of a project diagram. Keep labels short: they don't wrap. */
export type DiagramRow = {
  label: string;
  sub?: string;
  /** Side-by-side branches; the flow fans out into them and back in. */
  parts?: { label: string; sub?: string }[];
  /** Extra visual inside a taller box. */
  viz?: { type: "dots" } | { type: "slots"; labels: string[]; highlight: number };
  /** Outside input arrow entering from the left, e.g. a user's question. */
  input?: string;
  /** Highlights the output / key result. */
  accent?: boolean;
};

export type Diagram = {
  rows: DiagramRow[];
  /** Dashed region around rows `from`..`to` (inclusive). */
  boundary?: { from: number; to: number; label: string };
};

export type Experience = {
  id: string;
  role: string;
  org: string;
  place?: string;
  start: string;
  end: string;
  meta?: string;
  bullets: string[];
};

/* --------------------------------------------------------------- identity */

export const identity = {
  name: "Mann Ahalpara",
  firstName: "Mann",
  lastName: "Ahalpara",
  title: "AI/ML Researcher - Conversational AI · LLMs · Information Retrieval",
  oneLiner:
    "AI/ML researcher building memory for conversational agents. Ranked #1 in my department, and I ship what I study.",
  location: "Ahmedabad, India",
  timezone: "Asia/Kolkata",
  tzLabel: "IST",
  coords: "23.02°N 72.57°E",
  email: "mannahalpara@gmail.com",
  linkedin: "https://www.linkedin.com/in/mannahalpara/",
  github: "https://github.com/MannAhalpara",
  status: "Currently - Research Intern, Sentic Team @ NTU Singapore",
  openTo: ["Research collaborations", "MS/PhD opportunities", "AI/ML engineering roles"],
  resume: {
    href: "/resume/Mann_Ahalpara_Research.pdf",
    filename: "Mann_Ahalpara_Research.pdf",
  },
  /**
   * TODO: set NEXT_PUBLIC_SITE_URL in Vercel once you have a custom domain.
   * Vercel's production URL is used automatically otherwise.
   */
  siteUrl:
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000"),
} as const;

/* ---------------------------------------------------------- positioning */

/** `**text**` marks a highlighted phrase; use `plain()` wherever markup can't render. */
const about =
  "I'm **Mann Ahalpara**, an AI/ML researcher working on a question that sounds simple and isn't: **how can an LLM agent truly remember the people it talks to?** As a **Research Intern with Prof. Erik Cambria's Sentic Team at NTU Singapore**, I study long-term memory for conversational agents: how they retain, retrieve and update what matters across many sessions, while staying private and consistent. I'm a final-year B.Tech ICT student at Adani University, **ranked 1st in my department with a CGPA of 9.13/10**. Beyond research, I **build and deploy end-to-end AI systems**, from citation-grounded RAG and explainable answer evaluation to ML pipelines and voice agents, and I've **co-authored a paper at ICIDS 2025**.";

const plain = (s: string) => s.replace(/\*\*/g, "");

export const positioning = {
  about,
  aboutPlain: plain(about),
  /** Short summary for meta descriptions. */
  summary:
    "Mann Ahalpara: AI/ML researcher on long-term memory for LLM agents, Research Intern at NTU Singapore's Sentic Team, ranked 1st in ICT at Adani University.",
} as const;

export const stats: {
  value: string;
  numeric?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
}[] = [
  { value: "#1", numeric: 1, prefix: "#", label: "ICT Department rank" },
  { value: "9.13", numeric: 9.13, decimals: 2, label: "CGPA / 10" },
  { value: "600+", numeric: 600, suffix: "+", label: "LeetCode problems solved" },
];

/* ------------------------------------------------------------- research */

export const researchInterests = [
  "Large Language Models",
  "Conversational AI",
  "Long-Term Memory in AI Agents",
  "Retrieval-Augmented Generation & Information Retrieval",
  "Agentic Systems & LLM Reasoning",
  "Personalized & Affective AI",
  "Trustworthy, Privacy-Preserving & On-Device AI",
] as const;

/* ----------------------------------------------------------- experience */

export const experience: Experience[] = [
  {
    id: "ntu",
    role: "Research Intern (Remote)",
    org: "Sentic Team, Nanyang Technological University (NTU)",
    place: "Singapore",
    start: "May 2026",
    end: "Present",
    meta: "Mentor: Tiesunlong Shen · PI: Prof. Erik Cambria",
    bullets: [
      "Research privacy-preserving, long-term Emotional Support Conversation (ESC) systems: how agents retain relevant information and give consistent, personalized support across multi-session interactions.",
      "Investigate hierarchical and agentic memory architectures for storing, retrieving, updating and selectively using information across sessions.",
      "Experiment with memory-conditioned AFlow pipelines and Monte Carlo Tree Search (MCTS) on local language models to study contextual continuity and memory-guided reasoning.",
      "Explore on-device and privacy-preserving approaches for persistent agents; review work on personalized agents, affective computing and retrieval-augmented systems to find open research gaps.",
    ],
  },
  {
    id: "edunet",
    role: "AI & ML Intern",
    org: "Edunet Foundation (AICTE × IBM SkillsBuild)",
    start: "Jan 2026",
    end: "Feb 2026",
    bullets: [
      "Built and deployed Study Buddy, an AI learning assistant (Gemini API + Streamlit) for explanations, summarization, quiz and flashcard generation, and PDF-based learning, using document-processing and prompt-engineering workflows.",
    ],
  },
  {
    id: "aspir",
    role: "Product & UX Research Fellow",
    org: "Aspir",
    start: "Jul 2025",
    end: "Aug 2025",
    bullets: [
      "Six-week product sprint with a cross-functional startup team on AI-assisted entrepreneurship tools: AI-generated interface concepts, product workflows and early feature ideation.",
    ],
  },
];

/** The NTU role, featured in the pinned "Research (Now)" section. */
export const currentResearch = experience[0]!;

/** Conceptual memory-architecture diagram (no claims of results). */
export const memoryArchitecture = [
  { id: "session", label: "Session n", sub: "multi-session dialogue" },
  { id: "encoder", label: "Encoder", sub: "turns → representations" },
  { id: "store", label: "Hierarchical Memory Store", sub: "episodic / semantic" },
  { id: "retrieve", label: "Retrieval & Update", sub: "store · retrieve · update · forget" },
  { id: "reason", label: "Memory-guided reasoning", sub: "AFlow · MCTS" },
  { id: "response", label: "Response", sub: "consistent, personalized" },
] as const;

/* ------------------------------------------------------------ education */

export const education = [
  {
    degree: "B.Tech, Information & Communication Technology",
    school: "Adani University, Ahmedabad",
    years: "2023 - 2027 (expected)",
    result: "CGPA 9.13/10 · Ranked 1st in the ICT Department",
    coursework: [
      "Machine Learning",
      "Artificial Intelligence",
      "Analysis & Design of Algorithms",
      "Data Mining & Business Intelligence",
      "Discrete Mathematics & Graph Theory",
      "Numerical Methods & Optimization",
      "Database Management Systems",
      "Data Structures",
      "Signals and Systems",
    ],
  },
  {
    degree: "Class XII (HSC), Science",
    school: "GSHSEB",
    years: "2023",
    result: "Percentile 97.03",
    coursework: [],
  },
] as const;

/* ---------------------------------------------------------- publication */

export const publication = {
  title: "Analyzing Indian Stock Markets through Correlations: Comparative Insights",
  role: "Co-author",
  venue:
    "Proceedings of the International Conference on Infrastructure Development and Sustainability (ICIDS 2025)",
  venueShort: "ICIDS 2025",
  publisher: "Atlantis Press",
  year: "2025",
  guide: "Guided by Dr. Ashlesha Bhise",
  bullets: [
    "Comparative study across ten major Indian market sectors using Pearson, Spearman, Kendall's Tau and time-lagged cross-correlation.",
    "Correlation analysis, network representations and comparative visualization of inter-sector dependencies and diversification opportunities.",
    "Extended into CorrelationX, an interactive platform for multi-method correlation analysis.",
  ],
  links: {
    paper: "https://www.atlantis-press.com/proceedings/icids-25/126024506",
    code: "https://github.com/MannAhalpara/Correlation_X",
  },
} as const;

/* -------------------------------------------------------------- projects */

export const projects: Project[] = [
  {
    slug: "answeriq",
    name: "AnswerIQ",
    title: "AnswerIQ: AI-Powered Answer Evaluation System",
    tagline: "Explainable, automated grading of student answer sheets.",
    year: null, // TODO: add project year
    role: null, // TODO: add your role
    category: ["AI Systems", "Full-stack"],
    problem:
      "Grading student answer sheets by hand is slow. AnswerIQ automates it with OCR, semantic analysis and LLM-assisted scoring, and keeps every score explainable.",
    approach: [
      "Hybrid, explainable score: concept coverage 50% · semantic similarity 30% · keyword matching 20%.",
      "Question-normalization and answer-mapping pipeline that aligns answers despite inconsistent numbering (Q1 / Q-1 / Question 1) and submission order.",
      "Role-based faculty/student workflows.",
    ],
    architecture: {
      rows: [
        { label: "Answer sheet", sub: "scanned student answer pages" },
        { label: "OCR", sub: "page images → raw text" },
        { label: "Question normalization", sub: "Q1 · Q-1 · Question 1 → Q1" },
        { label: "Answer mapping", sub: "aligned to the key, in any order" },
        {
          label: "Hybrid scoring",
          parts: [
            { label: "Concepts", sub: "coverage · 50%" },
            { label: "Semantics", sub: "similarity · 30%" },
            { label: "Keywords", sub: "match · 20%" },
          ],
        },
        { label: "LLM-assisted scoring", sub: "Gemini reviews and justifies" },
        { label: "Explainable score", sub: "per-question breakdown", accent: true },
      ],
      boundary: { from: 1, to: 5, label: "FASTAPI BACKEND" },
    },
    details: [
      "Automates grading of student answer sheets with OCR, semantic analysis and LLM-assisted scoring.",
      "Hybrid, explainable score: concept coverage 50% · semantic similarity 30% · keyword matching 20%.",
      "Aligns answers despite inconsistent numbering (Q1 / Q-1 / Question 1) and submission order.",
      "Role-based faculty/student workflows.",
    ],
    stack: [
      "OCR",
      "Sentence Transformers",
      "Gemini",
      "FastAPI",
      "Next.js",
      "TypeScript",
      "Supabase",
    ],
    metrics: [
      { value: "50/30/20", label: "Hybrid scoring" },
      { value: "OCR→LLM", label: "Pipeline" },
      { value: "Next+FastAPI", label: "Stack" },
      { value: "Supabase", label: "Data & auth" },
    ],
    links: { github: "https://github.com/MannAhalpara/AnswerIQ" },
  },
  {
    slug: "mini-rag",
    name: "Mini-RAG",
    title: "Mini-RAG: Citation-Grounded Retrieval-Augmented Generation",
    tagline: "Ask your documents. Get answers with inline citations.",
    year: null, // TODO: add project year
    role: null, // TODO: add your role
    category: ["AI Systems", "Retrieval"],
    problem:
      "Upload PDF or text, ask questions, and get answers grounded in retrieved evidence with inline citations.",
    approach: [
      "Character-based chunking with metadata, embedded with Gemini text-embedding-004.",
      "Qdrant Cloud cosine top-k search, then lightweight reranking that filters low-relevance chunks.",
      "Grounded generation with inline citations to the retrieved evidence.",
      "FastAPI backend on Render, frontend on Vercel, credentials and vector-DB ops kept server-side.",
    ],
    architecture: {
      rows: [
        { label: "Upload", sub: "PDF or plain text" },
        { label: "Extract & chunk", sub: "character-based chunks + metadata" },
        { label: "Embed", sub: "Gemini text-embedding-004" },
        { label: "Qdrant Cloud", sub: "cosine vector index", viz: { type: "dots" } },
        { label: "Retrieve top-k", sub: "query embedded, cosine search", input: "QUERY" },
        { label: "Rerank", sub: "drop low-relevance chunks" },
        { label: "Grounded answer", sub: "Gemini · inline citations [1][2]", accent: true },
      ],
      boundary: { from: 1, to: 6, label: "SERVER-SIDE · RENDER" },
    },
    details: [
      "Pipeline: ingestion → text extraction → character-based chunking → metadata → Gemini text-embedding-004 embeddings → Qdrant Cloud cosine top-k → lightweight reranking → grounded generation.",
      "Reranking filters low-relevance chunks before generation.",
      "FastAPI backend on Render, frontend on Vercel, credentials and vector-DB ops kept server-side.",
    ],
    stack: ["Gemini", "Qdrant Cloud", "FastAPI", "Render", "Vercel"],
    metrics: [
      { value: "top-k", label: "Qdrant cosine search" },
      { value: "[1][2]", label: "Inline citations" },
      { value: "Rerank", label: "Low-relevance filter" },
      { value: "Live", label: "Render + Vercel" },
    ],
    links: {
      github: "https://github.com/MannAhalpara/Mini-RAG",
      live: "https://minirag-three.vercel.app/",
    },
  },
  {
    slug: "axon",
    name: "AXON",
    title: "AXON: AI-Powered Desktop Assistant",
    tagline: "A voice- and text-controlled desktop assistant with dual-LLM routing.",
    year: null, // TODO: add project year
    role: null, // TODO: add your role
    category: ["AI Systems", "Agents"],
    problem:
      "A voice- and text-controlled assistant for system commands, app launching, web search and conversational Q&A.",
    approach: [
      "Dual-LLM routing: Gemini for command interpretation and screen-image analysis, LLaMA for open-ended conversation.",
      "Fuzzy command matching, robust to speech-recognition errors.",
      "Speech synthesis and interaction logging.",
    ],
    architecture: {
      rows: [
        { label: "Voice or text", sub: "mic → speech recognition · keyboard" },
        { label: "Fuzzy command matching", sub: "tolerates recognition errors" },
        { label: "LLM router", sub: "command or conversation?" },
        {
          label: "Dual LLM",
          parts: [
            { label: "Gemini", sub: "commands · screen vision" },
            { label: "LLaMA", sub: "open conversation" },
          ],
        },
        { label: "Action or answer", sub: "apps · system · web search · Q&A" },
        { label: "Speech synthesis", sub: "spoken reply · interaction log", accent: true },
      ],
    },
    details: [
      "System commands, app launching, web search and conversational Q&A.",
      "Gemini handles command interpretation and screen-image analysis; LLaMA handles open-ended conversation.",
      "Fuzzy command matching robust to speech-recognition errors.",
      "Speech synthesis and interaction logging.",
    ],
    stack: ["Python", "Gemini", "LLaMA", "Speech recognition", "Speech synthesis"],
    metrics: [
      { value: "2 LLMs", label: "Dual routing" },
      { value: "Voice+Text", label: "Input modes" },
      { value: "Fuzzy", label: "Command matching" },
      { value: "Vision", label: "Screen analysis" },
    ],
    links: { github: "https://github.com/MannAhalpara/AXON" },
  },
  {
    slug: "airvision",
    name: "AirVision",
    title: "AirVision: AQI Prediction & Analytics Platform",
    tagline: "Eleven regressors, one benchmark, a live AQI dashboard.",
    year: null, // TODO: add project year
    role: null, // TODO: add your role
    category: ["Machine Learning"],
    problem:
      "Predict the Air Quality Index from pollutant measurements across multiple Indian cities.",
    approach: [
      "Imputation, date features, encoding, scaling, evaluation and saved artifacts.",
      "Benchmarked 11 regression algorithms: Random Forest, XGBoost, LightGBM, CatBoost, SVR, KNN, AdaBoost, ElasticNet, Decision Tree, Gradient Boosting, Linear Regression.",
      "Interactive Streamlit dashboard.",
    ],
    architecture: {
      rows: [
        { label: "Pollutant data", sub: "measurements across Indian cities" },
        {
          label: "Preprocessing",
          parts: [
            { label: "Imputation", sub: "missing values" },
            { label: "Date features", sub: "from timestamps" },
            { label: "Encode & scale", sub: "model-ready" },
          ],
        },
        {
          label: "11-model benchmark",
          sub: "compared on R² · MAE · RMSE",
          viz: {
            type: "slots",
            labels: ["RF", "XGB", "LGBM", "CAT", "SVR", "KNN", "ADA", "ENET", "DT", "GB", "LR"],
            highlight: 3,
          },
        },
        { label: "Best: CatBoost", sub: "R² 0.91 · MAE 12 · RMSE 19", accent: true },
        { label: "Saved artifacts", sub: "model + preprocessing" },
        { label: "Streamlit dashboard", sub: "live AQI prediction & analytics" },
      ],
      boundary: { from: 1, to: 3, label: "TRAINING PIPELINE" },
    },
    details: [
      "AQI prediction from pollutant measurements across multiple Indian cities.",
      "Benchmarked 11 regression algorithms.",
      "Best: CatBoost, R² = 0.91, MAE = 12, RMSE = 19.",
      "Interactive Streamlit dashboard.",
    ],
    stack: ["Python", "scikit-learn", "XGBoost", "LightGBM", "CatBoost", "Streamlit"],
    metrics: [
      { value: "R² 0.91", label: "CatBoost" },
      { value: "11", label: "Models benchmarked" },
      { value: "MAE 12", label: "Mean abs. error" },
      { value: "RMSE 19", label: "Root mean sq. error" },
    ],
    links: {
      github: "https://github.com/MannAhalpara/AQI",
      live: "https://airvision-aqi.streamlit.app/",
    },
  },
];

export const workFilters = [
  "All",
  "AI Systems",
  "Retrieval",
  "Machine Learning",
  "Full-stack",
] as const;
export type WorkFilter = (typeof workFilters)[number];

/* ---------------------------------------------------------------- skills */

export const skills = [
  { group: "Languages", items: ["Python", "SQL", "Java", "TypeScript/JavaScript"] },
  {
    group: "ML / DL",
    items: [
      "PyTorch",
      "JAX",
      "scikit-learn",
      "Transformers",
      "Regression",
      "Classification",
      "Feature engineering",
      "Model evaluation",
      "Statistical analysis",
    ],
  },
  {
    group: "LLMs & Agents",
    items: [
      "Gemini",
      "LLaMA",
      "Ollama",
      "Groq",
      "Prompt engineering",
      "AI agents",
      "Conversational memory",
      "MCTS",
      "AFlow",
    ],
  },
  {
    group: "Retrieval",
    items: [
      "RAG",
      "Sentence Transformers",
      "Embeddings",
      "Semantic/vector search",
      "Reranking",
      "Qdrant",
    ],
  },
  {
    group: "Backend & Web",
    items: ["FastAPI", "Flask", "Next.js", "Streamlit", "REST APIs", "Auth & role-based workflows"],
  },
  {
    group: "Data",
    items: ["PostgreSQL", "MySQL", "Supabase", "Pandas", "NumPy", "NetworkX", "OSMnx"],
  },
  { group: "Viz & BI", items: ["Power BI", "Tableau", "Matplotlib", "Seaborn"] },
  { group: "Ship", items: ["Git", "Docker", "Vercel", "Render", "Streamlit Community Cloud"] },
] as const;

/* --------------------------------------------------------- achievements */

export const achievements = [
  { title: "Ranked 1st in the B.Tech ICT cohort", detail: "Adani University · CGPA 9.13/10" },
  {
    title: "National Technology Day 2024",
    detail:
      "Represented Adani University at the event hosted by SAC-ISRO, Ahmedabad (selected on academic performance)",
  },
  { title: "600+ DSA problems solved", detail: "LeetCode" },
  { title: "Co-author, ICIDS 2025", detail: "Atlantis Press" },
  { title: "Retrieval-Augmented Generation", detail: "NVIDIA Deep Learning Institute" },
  {
    title: "Hands-on Quantum Error Correction",
    detail: "Google Quantum AI · stabilizer formalism, surface codes",
  },
  { title: "GenAI-Powered Data Analytics Job Simulation", detail: "Tata · Forage" },
] as const;

/* -------------------------------------------------------------- site nav */

export const sections = [
  { id: "hero", mem: "MEM_01", label: "Index" },
  { id: "about", mem: "MEM_02", label: "About" },
  { id: "research", mem: "MEM_03", label: "Research" },
  { id: "publication", mem: "MEM_04", label: "Publication" },
  { id: "work", mem: "MEM_05", label: "Work" },
  { id: "experience", mem: "MEM_06", label: "Internships" },
  { id: "stack", mem: "MEM_07", label: "Stack" },
  { id: "ask", mem: "MEM_08", label: "Ask my memory" },
  { id: "achievements", mem: "MEM_09", label: "Achievements" },
  { id: "contact", mem: "MEM_10", label: "Contact" },
] as const;

export const navLinks = [
  { id: "work", label: "Work" },
  { id: "research", label: "Research" },
  { id: "publication", label: "Publication" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

export const footer = {
  ctaLine1: "Let's build",
  ctaLine2: "memory that lasts",
  credit: "Designed & built by Mann Ahalpara - Next.js · GSAP · Lenis",
} as const;
