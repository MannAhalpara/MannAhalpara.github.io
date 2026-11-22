export type MemoryLink = { label: string; href: string };
export type MemoryEntry = {
  id: string;
  question: string;
  aliases: string[];
  keywords: string[];
  answer: string;
  links: MemoryLink[];
  related: string[]; // ids of other entries
};

export const MEMORY_QA: MemoryEntry[] = [
  // ---------- Research & publication ----------
  {
    id: "research-now",
    question: "What is Mann researching right now?",
    aliases: ["what is he working on", "current research", "where is he doing research", "ntu internship", "sentic team"],
    keywords: ["research", "researching", "ntu", "sentic", "cambria", "memory", "intern", "singapore", "current", "now", "working"],
    answer:
      "Long-term memory for conversational AI. Since May 2026 he's been a Research Intern with Prof. Erik Cambria's Sentic Team at NTU Singapore (remote). He works on privacy-preserving emotional support conversation systems, hierarchical and agentic memory, and agents that remember users across sessions while running on local models.",
    links: [{ label: "Research", href: "#research" }],
    related: ["why-memory", "research-next", "open-to"],
  },
  {
    id: "why-memory",
    question: "Why is he focused on AI memory?",
    aliases: ["why memory", "research question", "what problem does he want to solve", "motivation"],
    keywords: ["why", "memory", "remember", "forget", "question", "problem", "motivation", "focus"],
    answer:
      "His core question: how can an LLM agent truly remember the people it talks to? Today's assistants mostly forget you after each chat. He wants agents that know what to keep, recall and update over time, while staying private and consistent.",
    links: [{ label: "About", href: "#about" }],
    related: ["research-now", "research-next", "publication"],
  },
  {
    id: "publication",
    question: "What has he published?",
    aliases: ["paper", "publication", "icids", "what is the icids paper about", "research paper", "conference"],
    keywords: ["paper", "published", "publication", "icids", "atlantis", "stock", "markets", "correlation", "correlationx", "conference"],
    answer:
      "He co-authored \"Analyzing Indian Stock Markets through Correlations: Comparative Insights\" at ICIDS 2025 (Atlantis Press). It compares ten Indian market sectors using four correlation methods. He later turned it into CorrelationX, an interactive analysis platform.",
    links: [
      { label: "Read paper", href: "https://www.atlantis-press.com/proceedings/icids-25/126024506" },
      { label: "CorrelationX code", href: "https://github.com/MannAhalpara/Correlation_X" },
    ],
    related: ["research-now", "who", "open-to"],
  },
  {
    id: "lab-fit",
    question: "What kind of lab or team is he looking for?",
    aliases: ["what lab", "what team", "ideal lab", "which companies", "what kind of company", "fit"],
    keywords: ["lab", "team", "group", "company", "companies", "nlp", "fit", "looking", "ideal", "industry"],
    answer:
      "For research, NLP labs, especially groups working on language models, conversational AI and memory, where he can contribute as a research intern. For industry, companies where AI/ML is the core of the product, not a side feature.",
    links: [{ label: "Get in touch", href: "#contact" }],
    related: ["open-to", "research-next", "contact"],
  },
  {
    id: "research-next",
    question: "What would he like to research next?",
    aliases: ["future research", "next research", "research goals", "phd topic", "long term goals"],
    keywords: ["next", "future", "goals", "plan", "nlp", "topic", "phd", "direction"],
    answer:
      "Going deeper into NLP: how language agents build, organise and use long-term memory, and how to make that memory trustworthy, private and personal.",
    links: [{ label: "Research", href: "#research" }],
    related: ["lab-fit", "why-memory", "open-to"],
  },

  // ---------- Projects ----------
  {
    id: "start-here",
    question: "Which project should I look at first?",
    aliases: ["best project", "top project", "short on time", "what should i see", "highlight project", "favourite project"],
    keywords: ["project", "first", "best", "start", "recommend", "highlight", "favourite", "favorite", "answeriq"],
    answer:
      "AnswerIQ: it grades scanned student answer sheets with OCR and an LLM, and explains every mark it gives, which shows how he builds AI that people can trust. For retrieval work, try Mini-RAG's live demo. For ML depth, see AirVision.",
    links: [
      { label: "AnswerIQ", href: "/work/answeriq/" },
      { label: "Mini-RAG", href: "/work/mini-rag/" },
      { label: "AirVision", href: "/work/airvision/" },
    ],
    related: ["projects", "mini-rag", "ml-results"],
  },
  {
    id: "projects",
    question: "What has he built?",
    aliases: ["projects", "portfolio", "show me his work", "list projects", "what did he make"],
    keywords: ["projects", "built", "build", "work", "made", "apps", "systems", "answeriq", "axon", "airvision"],
    answer:
      "Four main projects. AnswerIQ grades student answer sheets and explains every mark. Mini-RAG answers questions about your documents with citations. AXON is a voice-controlled desktop assistant that uses two LLMs. AirVision predicts air quality and compares 11 ML models.",
    links: [{ label: "All work", href: "#work" }],
    related: ["start-here", "mini-rag", "agents"],
  },
  {
    id: "mini-rag",
    question: "How does Mini-RAG work?",
    aliases: ["mini rag", "rag", "retrieval augmented generation", "what did he build with qdrant", "vector search"],
    keywords: ["mini-rag", "minirag", "rag", "retrieval", "qdrant", "vector", "embeddings", "citations", "pdf", "documents"],
    answer:
      "You upload a PDF and ask a question. It splits the text into chunks, embeds them with Gemini, finds the closest chunks in Qdrant, filters out weak matches, and generates an answer that cites its sources. Backend on Render, frontend on Vercel, with a live demo.",
    links: [
      { label: "Mini-RAG", href: "/work/mini-rag/" },
      { label: "Live demo", href: "https://minirag-three.vercel.app" },
    ],
    related: ["projects", "agents", "start-here"],
  },
  {
    id: "agents",
    question: "Has he built AI agents?",
    aliases: ["agents", "agentic", "llm agents", "axon", "voice assistant", "mcts", "aflow"],
    keywords: ["agent", "agents", "agentic", "axon", "assistant", "voice", "mcts", "aflow", "llama", "gemini", "routing"],
    answer:
      "Yes. At NTU he experiments with agent pipelines (AFlow and Monte Carlo Tree Search) on local LLMs. In projects, AXON sends commands and screen analysis to Gemini and open conversation to LLaMA, and it tolerates speech-recognition mistakes.",
    links: [{ label: "AXON", href: "/work/axon/" }],
    related: ["research-now", "projects", "mini-rag"],
  },
  {
    id: "ml-results",
    question: "What are his best ML results?",
    aliases: ["best aqi model", "airvision", "machine learning results", "metrics", "benchmark"],
    keywords: ["ml", "machine", "learning", "airvision", "aqi", "air", "quality", "catboost", "metrics", "benchmark", "results", "accuracy"],
    answer:
      "AirVision: he benchmarked 11 regression models to predict the Air Quality Index across Indian cities. CatBoost won with R² 0.91, MAE 12 and RMSE 19. It powers a live dashboard.",
    links: [
      { label: "AirVision", href: "/work/airvision/" },
      { label: "Live demo", href: "https://airvision-aqi.streamlit.app" },
    ],
    related: ["projects", "start-here", "who"],
  },

  // ---------- Personal & contact ----------
  {
    id: "who",
    question: "Who is Mann, in a few lines?",
    aliases: ["who is mann", "tell me about him", "about mann", "introduce him", "summary", "who are you"],
    keywords: ["who", "about", "mann", "introduce", "summary", "background", "student", "adani"],
    answer:
      "A final-year B.Tech ICT student at Adani University, ranked 1st in his department (CGPA 9.13/10), and a Research Intern at NTU Singapore working on memory for conversational AI. He co-authored a paper at ICIDS 2025 and likes building AI systems end to end, from research idea to live demo.",
    links: [
      { label: "About", href: "#about" },
      { label: "Résumé", href: "/resume/Mann_Ahalpara_Research.pdf" },
    ],
    related: ["research-now", "outside-work", "open-to"],
  },
  {
    id: "open-to",
    question: "Is he open to MS/PhD positions or jobs?",
    aliases: ["is he looking for phd", "masters", "internship", "is he available", "hiring", "open to work", "roles"],
    keywords: ["phd", "ms", "masters", "internship", "intern", "graduate", "open", "available", "hire", "hiring", "job", "role", "opportunity"],
    answer:
      "Yes. He's actively looking for NLP research internships, and he's open to MS/PhD opportunities, research collaborations and AI/ML engineering roles. He graduates in 2027.",
    links: [
      { label: "Get in touch", href: "#contact" },
      { label: "Résumé", href: "/resume/Mann_Ahalpara_Research.pdf" },
    ],
    related: ["lab-fit", "who", "contact"],
  },
  {
    id: "outside-work",
    question: "What does he do outside of work?",
    aliases: ["hobbies", "interests", "free time", "fun facts", "personal life"],
    keywords: ["hobbies", "hobby", "interests", "outside", "free", "time", "fun", "painting", "reading", "space", "table", "tennis"],
    answer:
      "He paints, reads, and plays table tennis. He's endlessly curious about space, especially black holes, and about science in general. He loves exploring new ideas, often well outside his own field.",
    links: [],
    related: ["who", "why-memory", "contact"],
  },
  {
    id: "contact",
    question: "How do I get in touch?",
    aliases: ["contact", "email", "linkedin", "github", "reach him", "resume", "cv"],
    keywords: ["contact", "email", "mail", "linkedin", "github", "reach", "message", "resume", "cv", "touch"],
    answer:
      "Email is fastest: mannahalpara@gmail.com. You can also use the form below, find him on LinkedIn and GitHub, or download his résumé.",
    links: [
      { label: "Email", href: "mailto:mannahalpara@gmail.com" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/mannahalpara/" },
      { label: "GitHub", href: "https://github.com/MannAhalpara" },
      { label: "Résumé", href: "/resume/Mann_Ahalpara_Research.pdf" },
    ],
    related: ["open-to", "lab-fit"],
  },
];

export const MEMORY_FALLBACK = {
  answer:
    "That one isn't in my memory yet. Try a suggested question, or ask Mann directly at mannahalpara@gmail.com.",
  links: [{ label: "Email", href: "mailto:mannahalpara@gmail.com" }],
  related: ["who", "research-now", "open-to"],
};

export const MEMORY_SUGGESTED = ["who", "research-now", "open-to"];
