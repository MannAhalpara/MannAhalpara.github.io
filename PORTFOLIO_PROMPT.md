# Build my portfolio — Mann Ahalpara (AI/ML Researcher)

You are building my personal portfolio from scratch in this folder. It's empty apart from my résumé PDF, `Mann_Ahalpara_Research.pdf`. Build it to Awwwards Site-of-the-Day quality: a strong concept, careful typography, smooth and purposeful motion, and solid engineering (fast, accessible, responsive). Work in stages, commit-sized steps, and check your work in the browser as you go.

---

## 0. Ground rules

- **Never invent facts.** Every claim, number, date, link and title must come from §2 (Content). If something is missing, leave a clearly marked `TODO` in `content.ts`. Don't make up metrics, testimonials, clients, awards or logos.
- **One source of truth.** Put all copy and data in `src/content/content.ts` (typed). Components only render that data.
- **Résumé download.** Move `Mann_Ahalpara_Research.pdf` from the project root to `public/resume/Mann_Ahalpara_Research.pdf`. Every "Résumé" button links there with `download="Mann_Ahalpara_Research.pdf"`. Also add an "open in new tab" variant. Verify the file is served.
- **Privacy.** Don't publish my phone number. Email, LinkedIn and GitHub only.
- Ask me before adding any paid service, analytics, or anything that needs an API key. The site must work with zero secrets.

---

## 1. Who I am (positioning)

**One-liner:** AI/ML researcher building memory for conversational agents. Ranked #1 in my department, and I ship what I study.

**Positioning statement (hero/about tone):**
I'm Mann Ahalpara, a final-year B.Tech ICT student at Adani University (ranked 1st in the ICT department, CGPA 9.13/10). I'm a Research Intern with Prof. Erik Cambria's Sentic Team at NTU Singapore. I research how LLM agents can **remember** people across long, multi-session conversations, privately and consistently. Alongside the research I build and deploy end-to-end AI systems: citation-grounded RAG, explainable answer evaluation, ML pipelines, voice agents. I've co-authored an ICIDS 2025 paper.

**Three pillars** (use as section kickers or a 3-up):

1. **Research:** long-term conversational memory, retrieval and personalization for LLM agents (NTU Sentic).
2. **Systems:** RAG, semantic search, vector databases, LLM apps. Built, deployed, cited.
3. **Rigor:** benchmarking, explainable scoring, published quantitative analysis.

**Voice:** confident, precise, a little dry. Short sentences. No buzzword soup, no "passionate", no emoji in copy.

---

## 2. Content (verbatim facts, use exactly)

### Identity

- Name: **Mann Ahalpara**
- Title: **AI/ML Researcher — Conversational AI · LLMs · Information Retrieval**
- Location: Ahmedabad, India (show a live local clock, IST / Asia/Kolkata)
- Email: mannahalpara@gmail.com
- LinkedIn: https://www.linkedin.com/in/mannahalpara/
- GitHub: https://github.com/MannAhalpara
- Status chip: "● Currently — Research Intern, Sentic Team @ NTU Singapore"
- Open to: research collaborations, MS/PhD opportunities, AI/ML engineering roles

### Research interests

Large Language Models · Conversational AI · Long-Term Memory in AI Agents · Retrieval-Augmented Generation & Information Retrieval · Agentic Systems & LLM Reasoning · Personalized & Affective AI · Trustworthy, Privacy-Preserving & On-Device AI

**Research direction (for a "What I want to work on next" block):** Privacy-preserving memory for trustworthy LLM agents. The goal is memory architectures that let agents keep useful long-term context while enforcing privacy, provenance, access control and selective forgetting, and that resist unsafe memory retrieval or manipulation. A key open question is how memory sharing and retrieval should be controlled when agents operate across tools, sessions or multiple interacting agents.

### Education

- **B.Tech, Information & Communication Technology**, Adani University, Ahmedabad, 2023–2027 (expected). CGPA **9.13/10**, **Ranked 1st in the ICT Department**.
  Relevant coursework: Machine Learning, Artificial Intelligence, Analysis & Design of Algorithms, Data Mining & Business Intelligence, Discrete Mathematics & Graph Theory, Numerical Methods & Optimization, Database Management Systems, Data Structures, Signals and Systems.
- **Class XII (HSC), Science**, GSHSEB, 2023. Percentile **97.03**.

### Experience

1. **Research Intern (Remote), Sentic Team, Nanyang Technological University (NTU), Singapore**. May 2026–Present. Mentor: Tiesunlong Shen. PI: Prof. Erik Cambria.
   - Research privacy-preserving, long-term Emotional Support Conversation (ESC) systems: how agents retain relevant information and give consistent, personalized support across multi-session interactions.
   - Investigate hierarchical and agentic memory architectures for storing, retrieving, updating and selectively using information across sessions.
   - Experiment with memory-conditioned AFlow pipelines and Monte Carlo Tree Search (MCTS) on local language models to study contextual continuity and memory-guided reasoning.
   - Explore on-device and privacy-preserving approaches for persistent agents; review work on personalized agents, affective computing and retrieval-augmented systems to find open research gaps.
2. **AI & ML Intern, Edunet Foundation (AICTE × IBM SkillsBuild)**. Jan 2026–Feb 2026.
   - Built and deployed **Study Buddy**, an AI learning assistant (Gemini API + Streamlit) for explanations, summarization, quiz and flashcard generation, and PDF-based learning, using document-processing and prompt-engineering workflows.
3. **Product & UX Research Fellow, Aspir**. Jul 2025–Aug 2025.
   - Six-week product sprint with a cross-functional startup team on AI-assisted entrepreneurship tools: AI-generated interface concepts, product workflows and early feature ideation.

### Publication

**Analyzing Indian Stock Markets through Correlations: Comparative Insights**. Co-author. Proceedings of the International Conference on Infrastructure Development and Sustainability (**ICIDS 2025**), Atlantis Press. Guided by Dr. Ashlesha Bhise.

- Comparative study across **ten major Indian market sectors** using Pearson, Spearman, Kendall's Tau and time-lagged cross-correlation.
- Correlation analysis, network representations and comparative visualization of inter-sector dependencies and diversification opportunities.
- Extended into **CorrelationX**, an interactive platform for multi-method correlation analysis.
- Links: Paper https://www.atlantis-press.com/proceedings/icids-25/126024506 · Code https://github.com/MannAhalpara/Correlation_X

### Projects (order = priority)

Each project gets: `slug, title, tagline, year (TODO if unknown), category[], problem, approach[], architecture (steps for a diagram), stack[], metrics[], links{github, live?}`.

1. **AnswerIQ: AI-Powered Answer Evaluation System** (categories: AI Systems, Full-stack)
   - Automates grading of student answer sheets with OCR, semantic analysis and LLM-assisted scoring.
   - Hybrid, explainable score: **concept coverage 50% · semantic similarity 30% · keyword matching 20%**.
   - Question-normalization and answer-mapping pipeline that aligns answers despite inconsistent numbering (Q1 / Q-1 / Question 1) and submission order.
   - Role-based faculty/student workflows.
   - Stack: OCR, Sentence Transformers, Gemini, FastAPI, Next.js/TypeScript, Supabase.
   - GitHub: https://github.com/MannAhalpara/AnswerIQ
2. **Mini-RAG: Citation-Grounded Retrieval-Augmented Generation** (AI Systems, Retrieval)
   - Upload PDF/text, ask questions, get answers grounded in retrieved evidence with inline citations.
   - Pipeline: ingestion → text extraction → character-based chunking → metadata → Gemini `text-embedding-004` embeddings → Qdrant Cloud cosine top-k → lightweight reranking (filters low-relevance chunks) → grounded generation.
   - FastAPI backend on Render, frontend on Vercel, credentials and vector-DB ops kept server-side.
   - Stack: Gemini, Qdrant Cloud, FastAPI, Render, Vercel.
   - GitHub: https://github.com/MannAhalpara/Mini-RAG · Live: https://minirag-three.vercel.app/
3. **AirVision: AQI Prediction & Analytics Platform** (Machine Learning)
   - AQI prediction from pollutant measurements across multiple Indian cities.
   - Benchmarked **11 regression algorithms** (Random Forest, XGBoost, LightGBM, CatBoost, SVR, KNN, AdaBoost, ElasticNet, Decision Tree, Gradient Boosting, Linear Regression).
   - Best: **CatBoost, R² = 0.91, MAE = 12, RMSE = 19**.
   - Imputation, date features, encoding, scaling, evaluation, artifacts. Interactive Streamlit dashboard.
   - Stack: Python, scikit-learn, XGBoost, LightGBM, CatBoost, Streamlit.
   - GitHub: https://github.com/MannAhalpara/AQI · Live: https://airvision-aqi.streamlit.app/
4. **AXON: AI-Powered Desktop Assistant** (AI Systems, Agents)
   - Voice- and text-controlled assistant: system commands, app launching, web search, conversational Q&A.
   - **Dual-LLM routing:** Gemini for command interpretation and screen-image analysis, LLaMA for open-ended conversation.
   - Fuzzy command matching (robust to speech-recognition errors), speech synthesis, interaction logging.
   - Stack: Python, Gemini, LLaMA, speech recognition/synthesis.
   - GitHub: https://github.com/MannAhalpara/AXON
5. **Learnistic: AI-Powered Personalized Learning Platform** (Full-stack, AI)
   - Personalized course and project recommendations, adaptive quizzes, intelligent chat, file analysis, progress tracking.
   - Auth with OTP email verification, password hashing, profile management, persistent progress.
   - Stack: Flask, MySQL, Gemini.
   - GitHub: https://github.com/MannAhalpara/Learnistic
6. **CorrelationX** (Data, Research): the interactive platform from the ICIDS paper. GitHub: https://github.com/MannAhalpara/Correlation_X
7. **A\* Pathfinding Visualizer: Graph Algorithms & Route Planning** (Algorithms)
   - Interactive A\* on custom graphs, random networks and real road maps. OSMnx + NetworkX for city-scale routing across Indian and international cities.
   - GitHub: `TODO` (not in résumé links)
8. **Blinkit Retail Analytics Dashboard** (Data / BI)
   - Designed and published a multi-table retail dataset (customer, order, product, delivery, marketing, inventory) and an interactive Power BI dashboard with relational modeling.
   - Public traction: **800+ views, 250+ downloads** on Kaggle.
   - Kaggle: https://www.kaggle.com/datasets/mad2112/blinkit-retail-analytics-and-dashboard

### Skills (grouped)

- **Languages:** Python, SQL, Java, TypeScript/JavaScript
- **ML / DL:** PyTorch, JAX, scikit-learn, Transformers, regression, classification, feature engineering, model evaluation, statistical analysis
- **LLMs & Agents:** Gemini, LLaMA, Ollama, Groq, prompt engineering, AI agents, conversational memory, MCTS, AFlow
- **Retrieval:** RAG, Sentence Transformers, embeddings, semantic/vector search, reranking, Qdrant
- **Backend & Web:** FastAPI, Flask, Next.js, Streamlit, REST APIs, auth & role-based workflows
- **Data:** PostgreSQL, MySQL, Supabase, Pandas, NumPy, NetworkX, OSMnx
- **Viz & BI:** Power BI, Tableau, Matplotlib, Seaborn
- **Ship:** Git, Docker, Vercel, Render, Streamlit Community Cloud

### Achievements & training

- Ranked **1st** in the B.Tech ICT cohort, Adani University (CGPA 9.13/10)
- Represented Adani University at **National Technology Day 2024**, hosted by **SAC-ISRO**, Ahmedabad (selected on academic performance)
- **600+** DSA problems solved on LeetCode
- Co-author, **ICIDS 2025**
- NVIDIA Deep Learning Institute: Retrieval-Augmented Generation
- Google Quantum AI: hands-on Quantum Error Correction (stabilizer formalism, surface codes)
- Tata GenAI-Powered Data Analytics Job Simulation (Forage)

---

## 3. Concept & art direction

**Concept: "Long-Term Memory."** My research is about how agents remember. The site behaves like a calm, precise memory system: content is "retrieved" as you scroll, sections carry index IDs like memory entries (`MEM_01 / RESEARCH`), and the hero is a field of dithered points that gather into structure when you interact. The overall look is a lab notebook crossed with a technical blueprint. Editorial, not gamer-neon.

**References (blend, don't copy):** a brutalist thin-border technical grid with bracketed nav and big pixel headings (ChainGPT Labs style); dot-matrix / LED numerals and node-and-connector diagrams on a warm grey background (PlayerZero style); dithered ASCII imagery with a high-contrast serif for statements (Axial.ai style); a bold condensed poster headline with one hot accent (editorial portfolio cover).

### Design tokens

- **Background:** warm paper `#EDEBE6`. Surface `#F6F5F2`. Ink `#0E0E0E`. Muted `#6B6B66`. Hairlines `rgba(14,14,14,.12)`.
- **One accent only:** signal orange-red `#FF4A1C`. Use it for the active state, the CTA, the cursor dot and live indicators. Nowhere else.
- **Dark mode:** an optional toggle (ink `#0E0E0E` bg, paper text, same accent) that respects `prefers-color-scheme`.
- **Faint 12-column grid:** visible hairline column lines in the background (1px, ~6% opacity), like graph paper. Corner tick marks (`+`) on cards.
- **Type** (self-host with `next/font`, all free):
  - Display: **"Anton"** or **"Bebas Neue"**, condensed caps, huge (clamp up to ~22vw for the hero name).
  - Pixel/dot-matrix for numbers, counters and section IDs: **"Doto"** or **"DotGothic16"** (Google Fonts).
  - Statement serif: **"Instrument Serif"** (italic) for manifesto lines and pull quotes.
  - UI/body: **"Inter"** or **"Geist"**. Mono labels: **"JetBrains Mono"** / **"Geist Mono"**, uppercase, tracking +0.08em, 11–12px.
- **Shapes:** 1px borders everywhere. Cards have radius 14–20px OR are square with corner ticks; pick one system and stay consistent. Pills for buttons and tags.
- **Texture:** a subtle animated film grain overlay (CSS/canvas, ≤4% opacity, off for reduced motion).

---

## 4. Tech stack

- **Next.js (App Router) + TypeScript + Tailwind CSS v4**, deployable to Vercel. Prefer static rendering (`generateStaticParams` for case studies).
- **GSAP 3.13+** (free incl. SplitText, ScrollTrigger, Flip) via `@gsap/react` `useGSAP`.
- **Lenis** for smooth scroll, synced with ScrollTrigger (`lenis.on('scroll', ScrollTrigger.update)` + `gsap.ticker`). Disabled when `prefers-reduced-motion`.
- **Hero visual:** a raw Canvas2D or **OGL**/Three.js points shader. Keep it under ~60 kB of JS. Lazy-init after first paint, pause when offscreen (IntersectionObserver), and cap DPR at 2.
- **Page transitions:** native **View Transitions API** where supported (Next `unstable_ViewTransition` or a small wrapper), with a GSAP curtain fallback.
- No UI kits. Hand-built components. `lucide-react` for icons is fine.
- Lint/format: ESLint + Prettier. `pnpm`.

---

## 5. Information architecture & sections

Single long home page + `/work/[slug]` case-study pages + `/404`. Each home section has an ID label (`MEM_00`…), a mono kicker and a display heading.

**00 · Preloader** (first visit per session only, ≤1.8s, skippable on click/keypress)

- A dot-matrix counter 000→100 next to the mono line `retrieving memory…`. On 100 the screen splits along the grid lines and reveals the hero. Use real asset/font-loading progress where possible.

**Nav** (fixed, floating pill on the paper background, 1px border)

- Left: logo mark "M/A" in pixel font. Center links in brackets: `[Work] Research Publication About Contact`, with the active section bracketed via ScrollTrigger. Right: local IST clock, theme toggle, orange **"Résumé ↓"** pill.
- Mobile: a full-screen overlay menu with staggered huge links and the résumé button.

**01 · Hero**

- Giant condensed **MANN / AHALPARA** on two lines, letters revealed with a SplitText mask (y: 110% → 0, stagger 0.04, ease `expo.out`).
- Behind or through the letters: the **memory field**, ~4–8k dithered points in ink. They drift slowly, and near the cursor they connect into a small graph (lines to nearest neighbors, like retrieval). On scroll they compress into a horizontal "timeline" band that becomes the divider into About.
- Below: the kicker "AI/ML Researcher — Conversational AI · LLMs · Information Retrieval", the status chip with a pulsing orange dot, and two CTAs (`View work →` black pill, `Download résumé ↓` outline pill).
- Bottom: an infinite marquee of research interests separated by `✳`. Speed responds to scroll velocity, and the direction flips on scroll-up.
- Corner meta in mono: `AHMEDABAD, IN — 23.02°N 72.57°E`, `©2026`, `SCROLL TO RETRIEVE ↓`.

**02 · About / Manifesto**

- A large Instrument Serif statement, scrubbed word by word from muted to ink on scroll: _"I study how machines remember — and build the systems that prove it."_ (you may refine the wording without adding facts).
- Short bio paragraph from §1.
- **Stats bento** (dot-matrix numbers that count up when in view): `#1` ICT Dept · `9.13` CGPA · `R² 0.91` best AQI model · `11` models benchmarked · `600+` LeetCode · `2025` ICIDS paper.

**03 · Research (Now)**: pinned section

- Left (sticky): "NOW — SENTIC TEAM, NTU SINGAPORE", role, dates, mentor/PI, the 4 bullets.
- Right: an **animated memory-architecture diagram** in thin SVG lines, drawn on scroll (stroke-dashoffset): `Session n → Encoder → Hierarchical Memory Store (episodic / semantic) → Retrieval & Update → Memory-guided reasoning (AFlow · MCTS) → Response`, with a lock icon on an "on-device / private" boundary. Label it "conceptual overview" so it doesn't claim specific results.
- Below: research-interest tags and the "What I want to work on next" block.

**04 · Publication**

- A paper card styled like a citation: title, venue, year, co-author role, 3 bullets, buttons `Read paper ↗` and `CorrelationX code ↗`.
- Decorative 10×10 correlation heatmap built in SVG with random-seeded values, captioned "illustrative". Cells animate in on a diagonal stagger.

**05 · Selected Work**

- Filter chips: `All · AI Systems · Retrieval · Machine Learning · Full-stack · Data` (GSAP Flip on filter).
- Layout: a ChainGPT-style grid of project cards. Each card has a category tag, the title in condensed caps, a one-line tagline, and a **2×2 stat block** (e.g. AnswerIQ: `50/30/20` scoring · `OCR→LLM` pipeline · `Next+FastAPI` · `Supabase`; AirVision: `R² 0.91` · `11 models` · `MAE 12` · `RMSE 19`) with an arrow cell ↗.
- Hover (pointer devices): the card's dithered preview image warps slightly (WebGL displacement or a CSS fallback), and the cursor becomes a "VIEW" label.
- Previews: generate tasteful **dithered/ASCII abstract images** per project (canvas → PNG at build time, or simple SVG). No fake screenshots. Leave `public/work/<slug>/` slots for real screenshots I'll add later.
- Each card links to `/work/[slug]`.

**Case study page `/work/[slug]`**

- Hero: title, tagline, year, role, stack tags, links.
- Sections: Problem → Approach → Architecture (animated node diagram from the `architecture` steps) → Key details (bullets) → Results/metrics (dot-matrix) → Links. Next-project footer link with a page transition.

**06 · Experience**

- A vertical timeline of 3 entries. On scroll, a line draws downward and each entry's date flips in dot-matrix. Expand/collapse bullets (accessible `<details>` or a button with aria-expanded).

**07 · Stack**

- A grid of the skill groups from §2, each group in a bordered cell with corner ticks. A second slow marquee of tools.

**08 · Ask my memory** (signature interaction, client-side only)

- A terminal-style panel: "Ask anything about Mann — e.g. _What did he build with Qdrant?_"
- Implementation: chunk `content.ts` into passages, index with **BM25** (small hand-written implementation or `minisearch`), return the top 3 passages with **[1][2][3] citations** that scroll to and highlight the source section. Typewriter output.
- Honest label: "Local keyword retrieval over this site's content — no LLM, no data leaves your browser." This mirrors Mini-RAG without any API keys.
- Fully keyboard-usable, with a real `<input>` and `aria-live="polite"` results.

**09 · Achievements & Training**

- A numbered index list with hairline rows. On hover, a row inverts (ink bg, paper text) with an accent arrow.

**10 · Footer / Contact**

- A huge condensed CTA spanning the full width: **LET'S BUILD / MEMORY THAT LASTS**, with the second line in the orange accent bar (like a highlighted marker).
- Big email link with a click-to-copy toast. LinkedIn, GitHub and Résumé ↓ buttons. Live IST clock. A "Back to top" link that uses Lenis scrollTo.
- Bottom line in mono: `Designed & built by Mann Ahalpara — Next.js · GSAP · Lenis`.

---

## 6. Motion system

- **Easing:** `expo.out` for reveals, `power3.inOut` for transitions, `none` for scrubbed timelines. Durations: 0.6–1.2s for reveals, 0.35s for hovers.
- **Reusable primitives** (in `src/motion/`): `RevealText` (SplitText lines with mask), `CountUp`, `DrawSVG` (stroke-dashoffset), `Magnetic` (buttons pull toward the cursor ≤12px), `Marquee`, `ParallaxImage`, `ScrubWords`.
- **Custom cursor:** a small ink dot with an orange ring that grows over links and shows labels ("VIEW", "COPY", "OPEN ↗"). Pointer devices only (`(hover:hover) and (pointer:fine)`). Keep the native cursor available.
- Everything is wrapped in `gsap.matchMedia()`: a full set for desktop, a lighter set for mobile, and **no motion** under `prefers-reduced-motion: reduce` (content visible immediately, no smooth scroll, no preloader, no grain).
- Clean up every ScrollTrigger/Lenis instance on route change. No layout shift caused by animations.

---

## 7. Quality bar (acceptance criteria)

- **Performance:** Lighthouse mobile ≥ 90 Performance, LCP < 2.5s, CLS < 0.05, INP < 200ms. Hero text is server-rendered HTML (not canvas) so LCP is text. Canvas and WebGL are lazy-loaded. Images use `next/image` with AVIF/WebP. Fonts are subset and preloaded.
- **Accessibility:** Lighthouse a11y ≥ 95. Semantic landmarks, one `h1`, logical heading order, visible focus rings (accent), skip-to-content link, alt text, AA contrast for muted text, everything keyboard-operable, aria labels on icon buttons.
- **Responsive:** test at 360, 768, 1024, 1440 and 1920. On mobile, the hero name still fills the width and no horizontal scroll appears.
- **SEO:** metadata, Open Graph image (generate a 1200×630 OG card with `next/og` in the site style), `sitemap.xml`, `robots.txt`, and JSON-LD `Person` schema (name, jobTitle, alumniOf, sameAs links, email).
- **No console errors**, no hydration warnings, `pnpm build` passes, TypeScript strict.

---

## 8. Build order

1. Scaffold Next.js + TS + Tailwind v4 + ESLint/Prettier. Move the PDF into `public/resume/`.
2. Write `src/content/content.ts` with all §2 data (typed), including TODOs for unknowns.
3. Design tokens, fonts, grid background, grain, base layout, nav, footer.
4. Static versions of all sections, readable with JS disabled.
5. Motion layer: Lenis + GSAP primitives, then section-by-section animations, preloader and cursor.
6. Hero memory field (canvas/OGL) with performance safeguards.
7. Work grid + filters + `/work/[slug]` pages + transitions.
8. "Ask my memory" BM25 terminal.
9. SEO, OG image, 404 page ("Memory not found" with a dithered glitch).
10. QA: run Lighthouse, check reduced motion, keyboard-only and mobile, and fix issues. Write a short `README.md` covering how to run, how to edit content, and how to deploy to Vercel.

When done, give me a summary of what was built, the Lighthouse scores, every remaining `TODO` (things I need to supply, like screenshots, project years and the A\* repo link), and the command to deploy.
