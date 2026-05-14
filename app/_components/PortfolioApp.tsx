"use client";
/* eslint-disable react/jsx-no-comment-textnodes, react/no-unescaped-entities, @typescript-eslint/no-unsafe-function-type */

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";

type Action = { type: "scroll" | "open" | "expand"; target: string; label: string };
type Msg = { role: "user" | "bot"; text: string; action?: Action | null };

const PROJECTS = [
  { id: "01", name: "Hybrid RecSys", title: "Hybrid game-recommendation engine", company: "Quantum Horizon - Production", tag: "Recommender systems", blurb: "Solo-built an end-to-end hybrid recommender (collab + content) over LightFM to recommend casino games to millions of users. Owned the full pipeline: data prep, training, eval, batch scoring, serving, and metrics dashboards.", stack: ["LightFM", "Python", "FastAPI", "AWS S3", "Airflow"], metrics: [["NDCG@10", "+34%"], ["CTR uplift", "+18%"], ["cold-start", "solved"]], href: "https://github.com/AyushDubeyaquagaming/Hybrid-RecSys", art: "matrix" },
  { id: "02", name: "Fraud-Detection", title: "Rules + ML system for live cheat detection", company: "Quantum Horizon - In progress", tag: "Applied ML", blurb: "Hybrid rules-engine + supervised ML to catch players exploiting roulette and similar games. Streaming session features feed tree-based classifiers while rules keep the system interpretable for ops.", stack: ["XGBoost", "Python", "Pandas", "Redis", "Kafka"], metrics: [["recall", "0.91"], ["precision", "0.88"], ["alerts/day", "-62%"]], href: "https://github.com/AyushDubeyaquagaming/Fraud-Detection", art: "anomaly" },
  { id: "03", name: "MLOps - IMDB", title: "End-to-end MLOps for sentiment analysis", company: "Personal - OSS", tag: "MLOps", blurb: "A reference implementation of doing it right: notebook to MLflow registry, DVC data versioning, GitHub Actions CI/CD, Docker, Kubernetes on EKS, Prometheus, and Grafana monitoring.", stack: ["MLflow", "DVC", "K8s/EKS", "Docker", "Prometheus", "Grafana", "AWS"], metrics: [["pipeline", "ci/cd"], ["deploy", "1-click"], ["monitoring", "live"]], href: "https://github.com/MLayush-dubey/MLOps-IMDB-Sentiment-Analysis", art: "pipeline" },
  { id: "04", name: "Stock Multi-Agent", title: "CrewAI agents for stock analysis", company: "Personal - OSS", tag: "LLM Agents", blurb: "A multi-agent system where specialist agents collaborate to produce a synthesized investment view. Tools wrap market data, technical indicators, and structured output.", stack: ["CrewAI", "Google Gemini", "yfinance", "LangChain", "Python"], metrics: [["agents", "4 roles"], ["tools", "12+"], ["latency", "~9s"]], href: "https://github.com/MLayush-dubey/StockMarket-multi-agents", art: "agents" },
  { id: "05", name: "RAG Research-bot", title: "Agentic RAG over ML research papers", company: "Personal - OSS", tag: "RAG", blurb: "Production-grade research assistant over curated ML papers. Multi-hop retrieval, citation grounding, and reasoning traces designed so the answers are checkable.", stack: ["LangChain", "Chroma", "OpenAI", "FastAPI", "Python"], metrics: [["papers", "indexed"], ["hops", "2-3 avg"], ["grounded", "yes"]], href: "https://github.com/MLayush-dubey/RAG-Agentic-Research-Chatbot", art: "rag" },
];

const CORPUS = [
  { id: "doc01", title: "Hybrid RecSys", chunk: "End-to-end hybrid recommender at Quantum Horizon using LightFM. Combines collaborative filtering with content features. NDCG@10 improved 34%; CTR +18%; solved cold-start with item-feature embeddings." },
  { id: "doc02", title: "Fraud Detection", chunk: "Rules + ML hybrid for in-game cheat detection. Streaming session features into XGBoost classifier; rules layer kept for interpretability. Recall 0.91, precision 0.88, alerts/day cut by 62%." },
  { id: "doc03", title: "MLOps IMDB", chunk: "Reference end-to-end MLOps repo: MLflow tracking and registry, DVC, GitHub Actions CI/CD, Docker, Kubernetes on AWS EKS, Prometheus and Grafana monitoring." },
  { id: "doc04", title: "Stock Multi-Agent", chunk: "Multi-agent stock-analysis using CrewAI and Google Gemini. Analyst and trader agents collaborate over financial metrics from Yahoo Finance API to produce trading strategies." },
  { id: "doc05", title: "RAG Research Bot", chunk: "Production RAG over curated ML research papers. LlamaIndex, ChromaDB, Groq Llama 3.1, FastAPI, Streamlit, CrewAI, semantic chunking, and Pydantic validation." },
  { id: "doc06", title: "Food Vision", chunk: "CNN image classifier on Food101. 85% accuracy, EfficientNetB1 with Mixed Precision, 40% memory reduction, Streamlit deployment." },
  { id: "doc07", title: "GAN Image-to-Video", chunk: "At Arkham Archives built GAN models that generate animated videos from static input images and preprocessing pipelines to improve fidelity." },
  { id: "doc08", title: "Samarth RAG Chatbot", chunk: "At Samarth Life Sciences engineered a custom RAG chatbot trained on proprietary pharmaceutical catalogs and built a sales-forecasting dashboard." },
  { id: "doc09", title: "Skills - Stack", chunk: "Python, PyTorch, TensorFlow, scikit-learn, LightFM, XGBoost, BERT, HuggingFace, LangChain, CrewAI, LlamaIndex, RAG, ChromaDB, Pinecone, FastAPI, MLflow, DVC, Docker, Kubernetes, AWS." },
  { id: "doc10", title: "About - Bio", chunk: "Ayush Dubey, AI/ML Engineer at Quantum Horizon in Dubai. B.Tech AI/ML from Thakur College, GPA 8.20. UAE Resident. Specialties: LLMs, Agents, RAG, RecSys, MLOps." },
];

const EXPERIENCE = [
  ["2025 - present", "AI/ML Engineer", "Quantum Horizon", "Dubai, UAE", ["Built and shipped a production hybrid recommender as the sole ML owner.", "Architecting a rules + ML fraud-detection system for real-time game exploits.", "Working across ML modelling, AWS infrastructure, and product analytics."], ["LightFM", "FastAPI", "AWS", "Production"]],
  ["09/2025 - 10/2025", "Fullstack AI Engineer", "Samarth Life Sciences - Freelance", "Andheri, Mumbai", ["Built a predictive analytics dashboard over 6 months of sales data.", "Engineered a RAG chatbot over pharmaceutical catalogs.", "Implemented time-series forecasting for inventory and resource planning."], ["RAG", "Forecasting", "Full-stack", "Pharma"]],
  ["10/2024 - 01/2025", "AI Consultant", "Bhairav Builders and Developers - Internship", "Mumbai", ["Shipped a modular React TypeScript website.", "Consulted sales teams on GenAI workflows.", "Trained 10+ sales professionals on AI-powered proposal generation."], ["GenAI", "React/TS", "Prompt eng"]],
  ["12/2023 - 06/2024", "AI Developer", "Arkham Archives - Internship", "Kolkata, India", ["Developed and deployed GAN-based image-to-video models.", "Balanced creative output with technical constraints.", "Engineered preprocessing pipelines that lifted output fidelity."], ["GANs", "Computer Vision", "PyTorch"]],
  ["06/2023 - 02/2024", "Data Scientist", "IntellAI - Internship", "Mumbai", ["Built scalable Django web applications.", "Shipped 15+ RESTful endpoints with auth and validation.", "Executed 100+ automated API test cases."], ["Django", "DRF", "APIs", "Testing"]],
];

const CERTS = [
  ["MLA-C01", "AWS Certified Machine Learning Engineer", "Amazon Web Services", "In progress - Target: May 2026", "pending"],
  ["NCA-GENL", "NVIDIA Certified Associate - Generative AI LLMs", "NVIDIA", "In progress - Target: May 2026", "pending"],
  ["NCA-AIAA", "NVIDIA Certified Associate - Agentic AI", "NVIDIA", "Planned - 2026", "pending"],
  ["UC-GENAI", "Complete Generative AI: RAG, AI Agents & Deployment", "Udemy", "10/2025 - 11/2025", "earned"],
  ["IITB-PY", "Python Training", "IIT Bombay", "06/2022 - 07/2022", "earned"],
];

type SkillGroup = "lang" | "ml" | "dl" | "nlp" | "llm" | "mlops" | "infra";
type SkillNode = { id: string; label: string; group: SkillGroup; x: number; y: number; r: number };
type ArchNode = { id: string; x: number; y: number; w: number; h: number; label: string; sub: string };
type ArchData = { nodes: ArchNode[]; edges: [string, string][] };

const SKILL_NODES: SkillNode[] = [
  { id: "python", label: "Python", group: "lang", x: 50, y: 50, r: 22 },
  { id: "sql", label: "SQL", group: "lang", x: 40, y: 58, r: 13 },
  { id: "ts", label: "TypeScript", group: "lang", x: 60, y: 58, r: 12 },
  { id: "sklearn", label: "scikit-learn", group: "ml", x: 30, y: 38, r: 14 },
  { id: "lightfm", label: "LightFM", group: "ml", x: 20, y: 50, r: 13 },
  { id: "xgboost", label: "XGBoost", group: "ml", x: 18, y: 32, r: 12 },
  { id: "pytorch", label: "PyTorch", group: "dl", x: 70, y: 30, r: 17 },
  { id: "tf", label: "TensorFlow", group: "dl", x: 82, y: 38, r: 15 },
  { id: "cnn", label: "CNNs", group: "dl", x: 80, y: 22, r: 12 },
  { id: "gan", label: "GANs", group: "dl", x: 90, y: 30, r: 12 },
  { id: "yolo", label: "YOLO", group: "dl", x: 92, y: 44, r: 11 },
  { id: "opencv", label: "OpenCV", group: "dl", x: 72, y: 18, r: 11 },
  { id: "bert", label: "BERT", group: "nlp", x: 36, y: 18, r: 12 },
  { id: "hf", label: "HuggingFace", group: "nlp", x: 48, y: 12, r: 13 },
  { id: "spacy", label: "spaCy", group: "nlp", x: 24, y: 18, r: 11 },
  { id: "lstm", label: "LSTM / RNN", group: "nlp", x: 14, y: 18, r: 11 },
  { id: "langchain", label: "LangChain", group: "llm", x: 70, y: 70, r: 16 },
  { id: "crewai", label: "CrewAI", group: "llm", x: 84, y: 64, r: 14 },
  { id: "agno", label: "Agno", group: "llm", x: 90, y: 76, r: 12 },
  { id: "llamaidx", label: "LlamaIndex", group: "llm", x: 78, y: 82, r: 13 },
  { id: "pydanticai", label: "PydanticAI", group: "llm", x: 62, y: 78, r: 12 },
  { id: "rag", label: "RAG", group: "llm", x: 56, y: 70, r: 14 },
  { id: "pinecone", label: "Pinecone", group: "llm", x: 88, y: 88, r: 11 },
  { id: "chroma", label: "Chroma", group: "llm", x: 74, y: 92, r: 11 },
  { id: "milvus", label: "Milvus", group: "llm", x: 62, y: 92, r: 11 },
  { id: "mlflow", label: "MLflow", group: "mlops", x: 44, y: 28, r: 14 },
  { id: "dvc", label: "DVC", group: "mlops", x: 58, y: 28, r: 12 },
  { id: "docker", label: "Docker", group: "infra", x: 30, y: 80, r: 14 },
  { id: "fastapi", label: "FastAPI", group: "infra", x: 42, y: 80, r: 13 },
  { id: "aws", label: "AWS / EC2", group: "infra", x: 18, y: 72, r: 14 },
  { id: "cicd", label: "GH Actions", group: "infra", x: 12, y: 88, r: 12 },
  { id: "streamlit", label: "Streamlit", group: "infra", x: 50, y: 88, r: 12 },
  { id: "django", label: "Django", group: "infra", x: 6, y: 62, r: 12 },
];

const SKILL_EDGES: [string, string][] = [
  ["python","sklearn"], ["python","pytorch"], ["python","tf"], ["python","langchain"], ["python","fastapi"], ["python","django"],
  ["python","hf"], ["python","sql"], ["python","crewai"], ["python","streamlit"], ["sql","django"], ["ts","fastapi"],
  ["sklearn","xgboost"], ["sklearn","lightfm"], ["sklearn","mlflow"], ["lightfm","mlflow"], ["xgboost","mlflow"],
  ["pytorch","cnn"], ["pytorch","gan"], ["tf","cnn"], ["cnn","yolo"], ["cnn","opencv"], ["gan","opencv"], ["yolo","opencv"],
  ["pytorch","mlflow"], ["tf","mlflow"], ["hf","bert"], ["hf","spacy"], ["bert","lstm"], ["lstm","pytorch"], ["spacy","sklearn"],
  ["langchain","rag"], ["langchain","crewai"], ["langchain","llamaidx"], ["crewai","agno"], ["crewai","pydanticai"],
  ["llamaidx","rag"], ["rag","chroma"], ["rag","pinecone"], ["rag","milvus"], ["rag","fastapi"], ["langchain","hf"],
  ["mlflow","dvc"], ["mlflow","docker"], ["dvc","cicd"], ["cicd","docker"], ["docker","fastapi"], ["docker","aws"],
  ["fastapi","streamlit"], ["aws","cicd"], ["django","docker"],
];

const GROUP_COLORS: Record<SkillGroup, string> = {
  lang: "var(--accent)",
  ml: "oklch(0.78 0.14 145)",
  dl: "oklch(0.78 0.14 175)",
  nlp: "oklch(0.78 0.14 200)",
  llm: "var(--accent-2)",
  mlops: "oklch(0.78 0.14 80)",
  infra: "oklch(0.72 0.12 250)",
};

const ARCH: Record<string, ArchData> = {
  "01": { nodes: [
    { id:"users", x:60, y:60, w:90, h:36, label:"User events", sub:"click / wager / play" },
    { id:"items", x:60, y:130, w:90, h:36, label:"Item catalog", sub:"game features" },
    { id:"feat", x:220, y:95, w:100, h:50, label:"Feature pipeline", sub:"Python + Pandas" },
    { id:"train", x:380, y:55, w:100, h:50, label:"LightFM train", sub:"hybrid model" },
    { id:"reg", x:380, y:135, w:100, h:50, label:"Model registry", sub:"MLflow" },
    { id:"api", x:540, y:95, w:100, h:50, label:"Serving API", sub:"FastAPI ranking" },
    { id:"app", x:700, y:95, w:80, h:50, label:"Game client", sub:"top-N recs" },
  ], edges: [["users","feat"],["items","feat"],["feat","train"],["train","reg"],["reg","api"],["api","app"],["feat","reg"]] },
  "02": { nodes: [
    { id:"sess", x:60, y:95, w:100, h:50, label:"Session stream", sub:"Kafka events" },
    { id:"feat", x:220, y:55, w:100, h:50, label:"Feature store", sub:"Redis windowed" },
    { id:"rules", x:380, y:55, w:100, h:50, label:"Rules engine", sub:"interpretable" },
    { id:"model", x:380, y:135, w:100, h:50, label:"XGBoost", sub:"trained labels" },
    { id:"vote", x:540, y:95, w:100, h:50, label:"Score fusion", sub:"ensemble" },
    { id:"alert", x:700, y:65, w:80, h:36, label:"Alert", sub:"ops dash" },
    { id:"block", x:700, y:125, w:80, h:36, label:"Auto-block", sub:"high-conf" },
  ], edges: [["sess","feat"],["feat","rules"],["feat","model"],["rules","vote"],["model","vote"],["vote","alert"],["vote","block"]] },
  "03": { nodes: [
    { id:"nb", x:50, y:50, w:90, h:36, label:"Notebook", sub:"experiment" },
    { id:"dvc", x:50, y:130, w:90, h:36, label:"DVC", sub:"data version" },
    { id:"mlf", x:200, y:50, w:90, h:36, label:"MLflow", sub:"registry" },
    { id:"ci", x:200, y:130, w:90, h:36, label:"GH Actions", sub:"CI / CD" },
    { id:"docker", x:350, y:90, w:90, h:50, label:"Docker", sub:"image build" },
    { id:"ecr", x:500, y:50, w:90, h:36, label:"AWS ECR", sub:"registry" },
    { id:"eks", x:500, y:130, w:90, h:36, label:"AWS EKS", sub:"k8s deploy" },
    { id:"prom", x:650, y:50, w:90, h:36, label:"Prometheus", sub:"metrics" },
    { id:"graf", x:650, y:130, w:90, h:36, label:"Grafana", sub:"EC2 dash" },
  ], edges: [["nb","mlf"],["dvc","ci"],["mlf","ci"],["ci","docker"],["docker","ecr"],["ecr","eks"],["eks","prom"],["prom","graf"]] },
  "04": { nodes: [
    { id:"q", x:60, y:95, w:90, h:50, label:"User query", sub:"ticker" },
    { id:"orch", x:200, y:95, w:100, h:50, label:"CrewAI", sub:"orchestrator" },
    { id:"an", x:360, y:40, w:110, h:46, label:"Analyst Agent", sub:"fundamentals" },
    { id:"tech", x:360, y:105, w:110, h:46, label:"Technical Agent", sub:"indicators" },
    { id:"trade", x:360, y:170, w:110, h:46, label:"Trader Agent", sub:"strategy" },
    { id:"yf", x:530, y:105, w:90, h:50, label:"yFinance", sub:"tool API" },
    { id:"out", x:680, y:95, w:100, h:50, label:"Strategy", sub:"structured output" },
  ], edges: [["q","orch"],["orch","an"],["orch","tech"],["orch","trade"],["an","yf"],["tech","yf"],["trade","out"],["an","out"],["tech","out"]] },
  "05": { nodes: [
    { id:"papers", x:50, y:60, w:100, h:36, label:"ML papers", sub:"curated corpus" },
    { id:"chunk", x:50, y:130, w:100, h:36, label:"Chunker", sub:"LlamaIndex" },
    { id:"chroma", x:200, y:95, w:100, h:50, label:"ChromaDB", sub:"vector store" },
    { id:"q", x:360, y:60, w:90, h:36, label:"User query", sub:"FastAPI" },
    { id:"agent", x:360, y:130, w:90, h:36, label:"CrewAI", sub:"agent loop" },
    { id:"groq", x:510, y:95, w:100, h:50, label:"Groq Llama", sub:"inference" },
    { id:"pyd", x:650, y:60, w:100, h:36, label:"Pydantic", sub:"validation" },
    { id:"ui", x:650, y:130, w:100, h:36, label:"Streamlit", sub:"UI" },
  ], edges: [["papers","chunk"],["chunk","chroma"],["q","agent"],["agent","chroma"],["chroma","groq"],["agent","groq"],["groq","pyd"],["pyd","ui"]] },
};

function SectionHead({ num, title, meta }: { num: string; title: string; meta?: string }) {
  return <div className="sec-head"><span className="sec-num">{num}</span><span className="sec-title">{title}</span><span className="sec-flex" />{meta && <span className="sec-meta">{meta}</span>}</div>;
}
function Chip({ children, alive }: { children: React.ReactNode; alive?: boolean }) { return <span className={`chip ${alive ? "alive" : ""}`}>{children}</span>; }
function Icon({ name, size = 14 }: { name: string; size?: number }) {
  const p = { width: size, height: size, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.5 } as const;
  if (name === "github") return <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.11.79-.25.79-.55v-1.95c-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.69 1.25 3.34.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11.04 11.04 0 0 1 5.78 0c2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.18c0 .31.21.67.8.55C20.21 21.39 23.5 17.07 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>;
  return <svg {...p}><path d={name === "mail" ? "M2 4h12v8H2z M2.5 4.5 8 8.5l5.5-4" : name === "download" ? "M8 2v9m0 0 3.5-3.5M8 11 4.5 7.5M2.5 13.5h11" : name === "send" ? "M2 8l12-5-5 12-2-5z" : "M2 8h12M9 3l5 5-5 5"} /></svg>;
}
function mulberry32(seed: number) { return function () { let t = seed += 0x6D2B79F5; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}
function parseAction(text: string): { text: string; action: Action | null } {
  const m = text.match(/<action\s+type="(scroll|open|expand)"\s+target="([^"]+)"\s+label="([^"]+)"\s*\/?>/i);
  return m ? { text: text.replace(m[0], "").trim(), action: { type: m[1] as Action["type"], target: m[2], label: m[3] } } : { text, action: null };
}
function score(query: string, chunk: string) {
  const stop = new Set(["the","a","an","of","for","to","and","or","is","in","on","at","with","by","my","you","your","ayush","what","how","tell","me","about"]);
  return (query.toLowerCase().match(/\w+/g) || []).reduce((s, w) => s + (!stop.has(w) && w.length > 2 && chunk.toLowerCase().includes(w) ? 1 : 0), 0);
}

export function PortfolioApp() {
  useEffect(() => {
    console.log("%c> ayush@quantum-horizon:~$ whoami\n%cAyush Dubey - AI/ML Engineer\n%cTry Cmd+K and the Konami code.", "color:#7dd87a;font-family:monospace", "color:#fff;font-weight:bold", "color:#8a8a8a");
  }, []);
  return (
    <>
      <style>{styles}</style>
      <StatusBar />
      <NavBar />
      <main id="app">
        <Hero />
        <NowPlaying />
        <About />
        <RagPlayground />
        <Projects />
        <Experience />
        <Certifications />
        <SkillsGraph />
        <Contact />
        <Footer />
      </main>
      <CommandPalette />
    </>
  );
}

function StatusBar() {
  const [m, setM] = useState({ loss: 0.0247, epoch: 1247, gpu: 73, acc: 94.3, time: "--:--:--" });
  useEffect(() => {
    const metrics = setInterval(() => setM((x) => ({ ...x, loss: Math.max(.0002, x.loss + (Math.random() - .55) * .0008), epoch: x.epoch + 1, gpu: Math.max(45, Math.min(89, x.gpu + (Math.random() - .5) * 3)), acc: Math.max(82, Math.min(99.2, x.acc + (Math.random() - .5) * .4)) })), 1100);
    const clock = setInterval(() => {
      const d = new Date(); const uae = new Date(d.getTime() + d.getTimezoneOffset() * 60000 + 4 * 3600000);
      setM((x) => ({ ...x, time: [uae.getHours(), uae.getMinutes(), uae.getSeconds()].map((n) => String(n).padStart(2, "0")).join(":") }));
    }, 1000);
    return () => { clearInterval(metrics); clearInterval(clock); };
  }, []);
  return <div className="statusbar"><div className="sb-cell"><i className="live-dot" /><b>ayush@quantum-horizon</b><span>:~$</span></div><div className="sb-cell">loc <b>DXB</b></div><div className="sb-cell">epoch <b suppressHydrationWarning>{m.epoch}</b></div><div className="sb-cell">loss <b suppressHydrationWarning>{m.loss.toFixed(4)}</b></div><div className="sb-cell">val_acc <b suppressHydrationWarning>{m.acc.toFixed(2)}%</b></div><div className="sb-cell">gpu <b suppressHydrationWarning>{m.gpu.toFixed(0)}C</b></div><div className="sb-spacer" /><div className="sb-cell">uptime <b>365d</b></div><div className="sb-cell">uae <b suppressHydrationWarning>{m.time}_</b></div><div className="sb-cell"><b>Cmd+K</b></div></div>;
}
function NavBar() {
  return <nav className="navbar"><div className="nav-inner"><a href="#top" className="brand"><span>AD</span>Ayush Dubey<i>.ai</i></a><div className="nav-links">{[["01","About","#about"],["02","Demo","#playground"],["03","Projects","#projects"],["04","Experience","#experience"],["05","Certs","#certs"],["06","Skills","#skills"],["07","Contact","#contact"]].map(([n,l,h]) => <a key={n} href={h}><b>{n}</b><span>{l}</span></a>)}<button onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))}>Cmd+K</button></div></div></nav>;
}
function Hero() {
  return <header id="top" className="hero"><LatentCanvas /><div className="wrap hero-grid"><div className="hero-copy"><div className="row"><Chip alive>Building production AI systems</Chip><Chip>v2.5.1</Chip><Chip>DXB - UTC+4</Chip></div><h1><span>Ayush Dubey.</span><span className="dim glow">/* the AI/ML engineer */</span><small>embedding[2,768] = [0.247, -0.812, ..., 0.617]</small></h1><p>I build <b>LLM agents, recommender systems, and end-to-end ML pipelines</b> that survive contact with production. Currently architecting recsys and fraud-detection at <b>Quantum Horizon</b> in Dubai.</p><div className="hero-cta"><a className="btn primary" href="#projects">View work <Icon name="arrow" /></a><a className="btn" href="#playground">Try the RAG demo</a><a className="btn" href="/resume.pdf" download>resume.pdf <Icon name="download" /></a></div><div className="hero-socials"><a className="link" href="https://github.com/MLayush-dubey" target="_blank">github/MLayush-dubey</a><a className="link" href="https://www.linkedin.com/in/ayush-dubey-69860522a/" target="_blank">linkedin/ayush-dubey</a><a className="link" href="mailto:aadubey1106@gmail.com">aadubey1106@gmail.com</a></div></div><ChatAgent /></div></header>;
}
function LatentCanvas() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const wrapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    type Particle = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; r: number; c: string; phase: number; speed: number; a: number; cluster: string };
    let pts: Particle[] = [];
    let clusters: { x: number; y: number; c: string; r: number; label: string }[] = [];
    let raf = 0;
    let visible = true;
    let mx = -1000;
    let my = -1000;
    let w = 0;
    let h = 0;
    const colors = ["#7dd87a", "#e8b54b", "#5e9c5b", "#9aa8c4"];
    const seed = () => {
      const coarse = matchMedia("(pointer: coarse)").matches;
      const rng = mulberry32(42);
      const count = Math.min(260, Math.max(110, Math.round((w * h) / 12000) * (coarse ? 0.5 : 1)));
      clusters = [
        { x: w * 0.22, y: h * 0.35, c: colors[0], r: Math.min(w, h) * 0.22, label: "LLM" },
        { x: w * 0.72, y: h * 0.28, c: colors[1], r: Math.min(w, h) * 0.18, label: "RecSys" },
        { x: w * 0.55, y: h * 0.72, c: colors[2], r: Math.min(w, h) * 0.20, label: "MLOps" },
        { x: w * 0.18, y: h * 0.80, c: colors[3], r: Math.min(w, h) * 0.16, label: "CV" },
      ];
      pts = Array.from({ length: count }, (_, i) => {
        const cl = clusters[i % clusters.length];
        const angle = rng() * Math.PI * 2;
        const radius = Math.sqrt(rng()) * cl.r * (0.6 + rng() * 0.5);
        const x = cl.x + Math.cos(angle) * radius;
        const y = cl.y + Math.sin(angle) * radius;
        return { x, y, ox: x, oy: y, vx: 0, vy: 0, r: 0.6 + rng() * 1.8, c: cl.c, phase: rng() * Math.PI * 2, speed: 0.0003 + rng() * 0.0007, a: 0.3 + rng() * 0.55, cluster: cl.label };
      });
    };
    const resize = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      const r = wrap.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };
    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      mx = e.clientX - r.left;
      my = e.clientY - r.top;
    };
    const draw = () => {
      if (!visible) {
        raf = requestAnimationFrame(draw);
        return;
      }
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 0.5;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const q = pts[j];
          if (p.cluster !== q.cluster) continue;
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 4000) {
            ctx.strokeStyle = p.c + Math.round((1 - d2 / 4000) * 36).toString(16).padStart(2, "0");
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      const t = performance.now() * 0.001;
      for (const p of pts) {
        const dx0 = p.x - p.ox;
        const dy0 = p.y - p.oy;
        const angle = t * 0.5 + p.phase;
        let fx = Math.cos(angle) * 6 * p.speed * 200 - dx0 * 0.02;
        let fy = Math.sin(angle * 1.3) * 6 * p.speed * 200 - dy0 * 0.02;
        const mdx = p.x - mx;
        const mdy = p.y - my;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < 14000) {
          const force = (1 - md2 / 14000) * 1.8;
          const md = Math.sqrt(md2) || 1;
          fx += (mdx / md) * force;
          fy += (mdy / md) * force;
        }
        p.vx = p.vx * 0.92 + fx * 0.05;
        p.vy = p.vy * 0.92 + fy * 0.05;
        p.x += p.vx;
        p.y += p.vy;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.r > 1.4) {
          ctx.globalAlpha = p.a * 0.22;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      ctx.font = '10px "JetBrains Mono", monospace';
      for (const c of clusters) {
        ctx.fillStyle = c.c + "88";
        ctx.fillText("// " + c.label, c.x - c.r * 0.5, c.y - c.r * 0.5);
      }
      raf = requestAnimationFrame(draw);
    };
    const ro = new ResizeObserver(resize);
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }, { threshold: 0.05 });
    ro.observe(wrap);
    io.observe(wrap);
    wrap.addEventListener("pointermove", onMove);
    wrap.addEventListener("pointerleave", () => { mx = -1000; my = -1000; });
    resize();
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      wrap.removeEventListener("pointermove", onMove);
    };
  }, []);
  return <div className="latent-wrap" ref={wrapRef}><canvas className="latent" ref={ref} aria-hidden /></div>;
}
function ChatAgent() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: "bot", text: "Hey - I'm Ayush.AI. Ask me anything about Ayush's work. I can also scroll you to relevant sections.", action: null }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const body = useRef<HTMLDivElement | null>(null);
  useEffect(() => { if (body.current) body.current.scrollTop = body.current.scrollHeight; }, [msgs, busy]);
  const runAction = (a?: Action | null) => { if (!a) return; if (a.type === "open") window.open(a.target, "_blank"); if (a.type === "scroll") document.querySelector(a.target)?.scrollIntoView({ behavior: "smooth" }); if (a.type === "expand") { window.dispatchEvent(new CustomEvent("portfolio:expand-project", { detail: { id: a.target } })); setTimeout(() => document.querySelector(`#project-${a.target}`)?.scrollIntoView({ behavior: "smooth" }), 100); } };
  const send = async (text?: string) => {
    const q = (text ?? input).trim(); if (!q || busy) return; setInput("");
    const cmd = q.toLowerCase();
    const local: Record<string, Msg> = {
      whoami: { role: "bot", text: "Ayush Dubey - AI/ML Engineer @ Quantum Horizon (Dubai). Specialties: LLMs, Agents, RecSys, and MLOps.", action: { type: "scroll", target: "#about", label: "See full bio" } },
      ls: { role: "bot", text: "01_hybrid-recsys/\n02_fraud-detection/\n03_mlops-imdb/\n04_stock-multi-agent/\n05_rag-agentic-chatbot/", action: { type: "scroll", target: "#projects", label: "Open projects" } },
      "ls projects": { role: "bot", text: "01_hybrid-recsys/\n02_fraud-detection/\n03_mlops-imdb/\n04_stock-multi-agent/\n05_rag-agentic-chatbot/", action: { type: "scroll", target: "#projects", label: "Open projects" } },
      help: { role: "bot", text: "commands: whoami, ls, ls projects, contact, clear. Or ask in plain English.", action: null },
      contact: { role: "bot", text: "DM on LinkedIn or use the contact form below.", action: { type: "scroll", target: "#contact", label: "Open contact form" } },
    };
    if (cmd === "clear") { setMsgs([]); return; }
    if (local[cmd]) { setMsgs((m) => [...m, { role: "user", text: q }, local[cmd]]); return; }
    setMsgs((m) => [...m, { role: "user", text: q }]); setBusy(true);
    try {
      const r = await fetch("/api/chat", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ messages: [...msgs.map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text })), { role: "user", content: q }] }) });
      const j = await r.json(); if (!r.ok) throw new Error(j.error || "request failed");
      const parsed = parseAction(j.text || ""); setMsgs((m) => [...m, { role: "bot", text: parsed.text, action: parsed.action }]);
    } catch { setMsgs((m) => [...m, { role: "bot", text: "Model connection is not configured yet. Local commands still work.", action: null }]); } finally { setBusy(false); }
  };
  return <div className={`chat-shell ${open ? "open" : ""}`}><button className="ai-fab" type="button" onClick={() => setOpen(true)} aria-label="Open Ayush AI chat">AI</button><button className="chat-backdrop" type="button" onClick={() => setOpen(false)} aria-label="Close Ayush AI chat" /><div className="chatframe"><div className="chat-hd"><span className="traffic"><i/><i/><i/></span>ayush-agent - workers-ai + scroll-actions <b>online</b><button className="chat-close" type="button" onClick={() => setOpen(false)} aria-label="Close chat">x</button></div><div className="chat-body" ref={body} role="log" aria-live="polite"><div className="quick">{["What's Ayush working on?","Walk me through the MLOps project","Why hire him?","ls projects"].map((q) => <button key={q} onClick={() => send(q)}>{q}</button>)}</div>{msgs.map((m,i) => <div className={`msg ${m.role}`} key={i}><span className="role">{m.role === "user" ? "U" : "AI"}</span><div><small>{m.role === "user" ? "you" : "ayush.ai"} {m.role === "bot" && "// model=workers-ai"}</small><p>{m.text}</p>{m.action && <button className="action" onClick={() => runAction(m.action)}>{m.action.label} <Icon name="arrow" size={11}/></button>}</div></div>)}{busy && <div className="msg bot"><span className="role">AI</span><p className="dots"><span>.</span><span>.</span><span>.</span></p></div>}</div><form className="chat-input" onSubmit={(e) => { e.preventDefault(); send(); }}><span>&gt;</span><input value={input} onChange={(e) => setInput(e.target.value)} placeholder="ask me anything - i can scroll you to sections" /><button disabled={!input.trim() || busy}><Icon name="send" size={11}/> send</button></form></div></div>;
}

function NowPlaying() {
  const items = [["currently reading","Attention Is All You Need (re-read)","paper"],["shipping","fraud-detect v0.4 - feature pipelines","wip"],["last commit","feat: add session-window aggregations","git"],["model in prod","hybrid-recsys-v2.3 - 4.1M users","prod"],["now learning","AWS MLA-C01 - NCA-GENL","study"],["building toward","agentic eval harness with DSPy","lab"]];
  const [i, setI] = useState(0); const [hover, setHover] = useState(false);
  useEffect(() => { if (hover) return; const id = setInterval(() => setI((x) => (x + 1) % items.length), 3400); return () => clearInterval(id); }, [hover, items.length]);
  return <div className="np" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}><div className="wrap"><b>&gt; live</b><span>// {items[i][0]}</span><strong>{items[i][1]}</strong><em>{items[i][2]}</em></div></div>;
}
function About() {
  const weights = [["LLMs / Agents / RAG", .94], ["Recommender systems", .92], ["MLOps", .9], ["Applied ML / Production", .88], ["Computer Vision", .74], ["Classical NLP", .71]];
  return <section id="about" className="sec"><div className="wrap"><SectionHead num="01 // about" title="A small intro" meta="// 6 weights - last trained: today" /><div className="about-grid"><div className="bio"><p>Hi - I'm Ayush. I'm an <b>AI/ML Engineer</b> based in Dubai, currently building recommender systems and fraud-detection at <b>Quantum Horizon</b>.</p><p>I like ML projects that <b>actually ship</b>. The fun part is the slow grind of containers, registries, drift dashboards, and pipelines that survive production traffic.</p><blockquote>"I'd rather ship a 0.83 F1 in production than print a 0.97 in a notebook nobody runs."</blockquote><p className="dim">When not training models I'm tinkering with multi-agent orchestration, reading papers, or testing eval harnesses.</p></div><div className="weights"><header>// self_assessment.weights <b>norm=L2</b></header>{weights.map(([l,w],i) => <div className="wt" key={String(l)}><span>{l}</span><b>{Number(w).toFixed(2)}</b><i><em style={{ width: `${Number(w)*100}%`, animationDelay: `${i*.08}s` }} /></i></div>)}</div></div></div></section>;
}
function RagPlayground() {
  const [q,setQ]=useState(""); const [stage,setStage]=useState(0); const [retr,setRetr]=useState<typeof CORPUS>([]); const [rer,setRer]=useState<typeof CORPUS>([]); const [ans,setAns]=useState("");
  const run = async (x?: string) => { const Q=(x??q).trim(); if(!Q||stage) return; setAns(""); setStage(1); await new Promise(r=>setTimeout(r,550)); const top=CORPUS.map(d=>({...d,score:score(Q,d.title+" "+d.chunk)})).sort((a,b)=>(b.score||0)-(a.score||0)).slice(0,5); setRetr(top); setStage(2); await new Promise(r=>setTimeout(r,650)); const rr=top.slice(0,3); setRer(rr); setStage(3); try { const r=await fetch("/api/rag-generate",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({query:Q,contexts:rr.map((c,i)=>({n:i+1,title:c.title,text:c.chunk}))})}); const j=await r.json(); setAns(j.text || rr.map((c,i)=>`${c.title}: ${c.chunk} [${i+1}]`).join(" ")); } catch { setAns(rr.map((c,i)=>`${c.title}: ${c.chunk} [${i+1}]`).join(" ")); } setStage(4); };
  const busy=stage>0&&stage<4; const presets=["Tell me about Ayush's MLOps work","How does the fraud-detection system work?","What stack does he use for RAG?","What's his recsys experience?"];
  return <section id="playground" className="sec"><div className="wrap"><SectionHead num="02 // live demo" title="Try the RAG pipeline" meta="// retrieve - rerank - generate" /><div className="pg-card"><header><span className="traffic"><i/><i/><i/></span>rag-playground - corpus=portfolio - top_k=5 - rerank=3 - llm <b>live</b></header><div className="pg-body"><form className="pg-q" onSubmit={(e)=>{e.preventDefault();run();}}><span>&gt;</span><input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="ask anything about Ayush's work" disabled={busy}/><button disabled={!q.trim()||busy}>{busy?"running...":"run pipeline"} <Icon name="arrow" size={12}/></button></form><div className="quick">{presets.map(p=><button key={p} onClick={()=>{setQ(p);run(p);}} disabled={busy}>{p}</button>)}</div><div className="pipe">{["Retrieve","Rerank","Generate"].map((name,idx)=><div className={`stage ${stage===idx+1?"active":stage>idx+1?"done":""}`} key={name}><h4><b>0{idx+1}</b>{name}</h4>{idx===0&&(retr.length?retr:[]).map((r)=><p key={r.id}><b>{r.title}</b>{r.chunk.slice(0,120)}...</p>)}{idx===1&&rer.map((r,i)=><p key={r.id}><b>[{i+1}] {r.title}</b>{r.chunk.slice(0,120)}...</p>)}{idx===2&&(stage===4?<p className="answer">{ans.split(/(\[\d+\])/g).map((part,i)=>/^\[\d+\]$/.test(part)?<em key={i}>{part}</em>:part)}</p>:<span className="empty">{stage===3?"model thinking...":"// waits on rerank"}</span>)}{idx<2&&stage<=idx+1&&!retr.length&&<span className="empty">// awaiting query</span>}</div>)}</div></div></div></div></section>;
}
function Projects() {
  const [expanded,setExpanded]=useState<string|null>(null);
  useEffect(()=>{ const f=(e:Event)=>setExpanded((e as CustomEvent).detail?.id); addEventListener("portfolio:expand-project",f); return()=>removeEventListener("portfolio:expand-project",f);},[]);
  return <section id="projects" className="sec"><div className="wrap"><SectionHead num="03 // projects" title="Featured work" meta="// 5 shipped - 1 in flight" /><div className="proj-grid">{PROJECTS.map(p=><div className="project-wrap" key={p.id}><article className="card pc" id={`project-${p.id}`}><ProjectArt kind={p.art}/><div className="pc-hd"><span>{p.id}</span><em>{p.tag}</em></div><h3><b>{p.name}</b><br/>{p.title}</h3><small>{p.company}</small><p>{p.blurb}</p><div className="metrics">{p.metrics.map(([k,v])=><span key={k}><b>{v}</b>{k}</span>)}</div><div>{p.stack.map(s=><Chip key={s}>{s}</Chip>)}</div><footer><a href={p.href} target="_blank"><Icon name="github" size={12}/> Source</a><button onClick={()=>setExpanded(expanded===p.id?null:p.id)}>{expanded===p.id?"hide arch":"view architecture"}</button></footer></article>{expanded===p.id&&<div className="arch"><header>// {p.id} - architecture <button onClick={()=>setExpanded(null)}>x</button></header><ArchDiagram id={p.id}/><small>// data flows left to right - live trace animation</small></div>}</div>)}</div></div></section>;
}
function ProjectArt({kind}:{kind:string}) { const rng=mulberry32(kind.length); return <svg className="pc-art" viewBox="0 0 130 130">{Array.from({length: kind==="pipeline"?8:32},(_,i)=><circle key={i} cx={15+rng()*100} cy={15+rng()*100} r={1+rng()*3} fill={i%5===0?"var(--accent-2)":"var(--accent)"} opacity={.35+rng()*.55}/>)}</svg>; }
function ArchDiagram({ id }: { id: string }) {
  const data = ARCH[id];
  const [hot, setHot] = useState(0);
  useEffect(() => {
    if (!data) return;
    const timer = setInterval(() => setHot((i) => (i + 1) % data.edges.length), 700);
    return () => clearInterval(timer);
  }, [data]);
  if (!data) return null;
  const byId = Object.fromEntries(data.nodes.map((node) => [node.id, node]));
  return (
    <svg viewBox="0 0 800 220" className="arch-svg">
      <title>Project {id} architecture</title>
      <defs>
        <marker id={`arrow-${id}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--accent)" opacity="0.7" />
        </marker>
      </defs>
      {data.edges.map(([a, b], i) => {
        const A = byId[a];
        const B = byId[b];
        if (!A || !B) return null;
        const x1 = A.x + A.w;
        const y1 = A.y + A.h / 2;
        const x2 = B.x;
        const y2 = B.y + B.h / 2;
        const dx = x2 - x1;
        const d = `M${x1} ${y1} C${x1 + dx * 0.5} ${y1} ${x2 - dx * 0.5} ${y2} ${x2} ${y2}`;
        return (
          <g key={`${a}-${b}`}>
            <path className="arch-edge" d={d} markerEnd={`url(#arrow-${id})`} />
            {hot === i && (
              <circle r="3" fill="var(--accent)">
                <animateMotion dur="0.7s" path={d} repeatCount="1" />
                <animate attributeName="opacity" values="0;1;1;0" dur="0.7s" />
              </circle>
            )}
          </g>
        );
      })}
      {data.nodes.map((node) => (
        <g key={node.id}>
          <rect x={node.x} y={node.y} width={node.w} height={node.h} rx="4" />
          <text className="arch-label" x={node.x + node.w / 2} y={node.y + node.h / 2 - 2}>{node.label}</text>
          <text className="arch-sub" x={node.x + node.w / 2} y={node.y + node.h / 2 + 11}>{node.sub}</text>
        </g>
      ))}
    </svg>
  );
}
function Experience(){ return <section id="experience" className="sec"><div className="wrap"><SectionHead num="04 // experience" title="Where I've been" meta={`// ${EXPERIENCE.length} entries`}/><div className="timeline">{EXPERIENCE.map(([when,role,org,loc,bullets,tags])=><article key={String(role)}><time>{when as string}</time><h3>{role as string}</h3><small>{org as string} - {loc as string}</small><ul>{(bullets as string[]).map(b=><li key={b}>{b}</li>)}</ul><div>{(tags as string[]).map(t=><Chip key={t}>{t}</Chip>)}</div></article>)}</div><div className="edu"><div><b>// education</b><h3>B.Tech, Artificial Intelligence and Machine Learning</h3><p>Thakur College of Engineering and Technology - Kandivali, Mumbai</p></div><p>2021 - 2025 <b>GPA 8.20 / 10</b></p></div></div></section>; }
function Certifications(){ return <section id="certs" className="sec"><div className="wrap"><SectionHead num="05 // certifications" title="Credentials" meta="// 2 earned - 3 in flight"/><div className="cert-grid">{CERTS.map(([code,title,org,when,status])=><article className="cert" key={String(code)}><span className={String(status)}>{status==="earned"?"earned":"in progress"}</span><small>{code as string}</small><h3>{title as string}</h3><p>{org as string}</p><footer>{when as string}<b>{status==="earned"?"verified":"// learning"}</b></footer></article>)}</div></div></section>; }
function SkillsGraph() {
  const [hover, setHover] = useState<string | null>(null);
  const [ref, size] = useElementSize<HTMLDivElement>();
  const W = size.w || 900;
  const H = Math.max(540, Math.min(680, W * 0.66));
  const nodes = SKILL_NODES.map((node) => ({
    ...node,
    color: GROUP_COLORS[node.group],
    px: (node.x / 100) * W,
    py: (node.y / 100) * H,
  }));
  const byId = Object.fromEntries(nodes.map((node) => [node.id, node]));
  const neighbors = new Map<string, Set<string>>();
  SKILL_EDGES.forEach(([a, b]) => {
    if (!neighbors.has(a)) neighbors.set(a, new Set());
    if (!neighbors.has(b)) neighbors.set(b, new Set());
    neighbors.get(a)?.add(b);
    neighbors.get(b)?.add(a);
  });
  const isNodeActive = (id: string) => !hover || hover === id || neighbors.get(hover)?.has(id);
  const groups: { key: SkillGroup; label: string }[] = [
    { key: "lang", label: "Languages" },
    { key: "ml", label: "Classical ML" },
    { key: "dl", label: "Deep Learning / CV" },
    { key: "nlp", label: "NLP" },
    { key: "llm", label: "GenAI / Agents" },
    { key: "mlops", label: "MLOps" },
    { key: "infra", label: "Infra / Cloud" },
  ];
  return (
    <section id="skills" className="sec">
      <div className="wrap">
        <SectionHead num="06 // skills" title="Stack graph" meta={`// ${SKILL_NODES.length} nodes - ${SKILL_EDGES.length} edges`} />
        <div className="skill-box" ref={ref}>
          <svg className="skill-svg" viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
            {SKILL_EDGES.map(([a, b]) => {
              const A = byId[a];
              const B = byId[b];
              if (!A || !B) return null;
              const direct = hover === a || hover === b;
              const active = !hover || direct;
              return (
                <line
                  key={`${a}-${b}`}
                  className="skill-edge"
                  x1={A.px}
                  y1={A.py}
                  x2={B.px}
                  y2={B.py}
                  stroke="var(--accent)"
                  strokeWidth={direct ? 1.4 : 0.55}
                  strokeOpacity={hover ? (active ? 0.65 : 0.04) : 0.16}
                />
              );
            })}
            {nodes.map((node) => {
              const active = isNodeActive(node.id);
              const focused = hover === node.id;
              return (
                <g
                  key={node.id}
                  className={`skill-node ${active ? "" : "dim"}`}
                  transform={`translate(${node.px},${node.py})`}
                  onMouseEnter={() => setHover(node.id)}
                  onMouseLeave={() => setHover(null)}
                  tabIndex={0}
                  onFocus={() => setHover(node.id)}
                  onBlur={() => setHover(null)}
                >
                  <circle className="skill-halo" r={node.r + 12} fill={node.color} opacity={focused ? 0.2 : 0} />
                  <circle className="skill-outer" r={focused ? node.r + 3 : node.r} fill={node.color} />
                  <circle r={Math.max(2, node.r - 4)} fill="var(--bg)" />
                  <text textAnchor="middle" dy="3.5">{node.label}</text>
                </g>
              );
            })}
          </svg>
          <div className="skill-legend">
            {groups.map((group) => <span key={group.key} style={{ color: GROUP_COLORS[group.key] }}>{group.label}</span>)}
          </div>
          <span className="skill-hint">// hover Python, RAG, Docker, etc. to isolate direct connections</span>
        </div>
        <div className="skill-meta"><span><b>shipping daily:</b> Python - PyTorch - FastAPI - Docker</span><span><b>building with:</b> LangChain - CrewAI - LlamaIndex - MLflow</span><span><b>cloud:</b> AWS - GitHub Actions - DVC</span></div>
      </div>
    </section>
  );
}
function Contact(){ const [msg,setMsg]=useState({name:"",email:"",body:""}); const [sent,setSent]=useState(false); return <section id="contact" className="sec"><div className="wrap"><SectionHead num="07 // contact" title="Get in touch" meta="// inbox: open"/><div className="contact-grid"><div className="cta"><h2>Let's build something that<br/><span>survives production.</span></h2><p>For technical conversations, collaborations, or a coffee in DXB, LinkedIn is the cleanest path. The form also routes a prefilled message straight to my inbox.</p><div>{[["email","mailto:aadubey1106@gmail.com","aadubey1106@gmail.com"],["linkedin","https://www.linkedin.com/in/ayush-dubey-69860522a/","ayush-dubey"],["github","https://github.com/MLayush-dubey","MLayush-dubey"],["resume","/resume.pdf","resume.pdf"]].map(([l,h,v])=><a className="cta-card" key={l} href={h}><small>/* {l} */</small><b>{v}</b></a>)}</div></div><form className="form" onSubmit={(e)=>{e.preventDefault();setSent(true);setTimeout(()=>{location.href=`mailto:aadubey1106@gmail.com?subject=${encodeURIComponent("Portfolio hello - from "+(msg.name||"the internet"))}&body=${encodeURIComponent(msg.body+"\n\n- "+(msg.name||"-")+" ("+msg.email+")")}`},900)}}><header>// new_message.txt <b>open</b></header><label>name<input value={msg.name} onChange={e=>setMsg({...msg,name:e.target.value})} placeholder="optional"/></label><label>email *<input type="email" required value={msg.email} onChange={e=>setMsg({...msg,email:e.target.value})} placeholder="you@company.com"/></label><label>message *<textarea required rows={6} value={msg.body} onChange={e=>setMsg({...msg,body:e.target.value})} placeholder="role, project, idea, or just hi"/></label>{sent?<p className="accent">compiling message - routing to inbox...</p>:<button><Icon name="send" size={12}/> send message</button>}</form></div></div></section>; }
function Footer(){ return <footer><div className="wrap"><p>Copyright 2026 - Ayush Dubey - built with Next.js, TypeScript, and Tailwind</p><pre>{`        AD // hint: up up down down left right left right BA`}</pre></div></footer>; }
function CommandPalette(){ const [open,setOpen]=useState(false); const [q,setQ]=useState(""); const [sel,setSel]=useState(0); const input=useRef<HTMLInputElement|null>(null); const cmds=useMemo(()=>[["Go to - About","section 01",()=>location.hash="#about"],["Run - Live RAG demo","section 02",()=>location.hash="#playground"],["Go to - Projects","section 03",()=>location.hash="#projects"],["Go to - Experience","section 04",()=>location.hash="#experience"],["Go to - Certifications","section 05",()=>location.hash="#certs"],["Go to - Skills","section 06",()=>location.hash="#skills"],["Go to - Contact","section 07",()=>location.hash="#contact"],["Open - GitHub","MLayush-dubey",()=>openWindow("https://github.com/MLayush-dubey")],["Open - LinkedIn","ayush-dubey",()=>openWindow("https://www.linkedin.com/in/ayush-dubey-69860522a/")],["Toggle - Scanlines","crt",()=>document.body.classList.toggle("scanlines")],["Activate - Neural mode","secret",()=>document.body.classList.toggle("neural-mode")]],[]); const f=cmds.filter(c=>String(c[0]).toLowerCase().includes(q.toLowerCase())||String(c[1]).toLowerCase().includes(q.toLowerCase())); useEffect(()=>{ const keys=["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"]; let k=0; const h=(e:KeyboardEvent)=>{ if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();setOpen(o=>!o)} else if(e.key==="/"&&!/INPUT|TEXTAREA/.test((document.activeElement?.tagName)||"")){e.preventDefault();setOpen(true)} else if(e.key==="Escape")setOpen(false); const key=e.key.length===1?e.key.toLowerCase():e.key; if(key===keys[k]){ if(++k===keys.length){document.body.classList.toggle("neural-mode"); toast(); k=0;} } else k=key===keys[0]?1:0; }; addEventListener("keydown",h); return()=>removeEventListener("keydown",h);},[]); useEffect(()=>{if(open)setTimeout(()=>input.current?.focus(),20)},[open]); if(!open)return null; return <div className="palette-bg" onClick={()=>setOpen(false)}><div className="palette" role="dialog" aria-modal="true" onClick={e=>e.stopPropagation()}><div><span>&gt;</span><input ref={input} value={q} onChange={e=>{setQ(e.target.value);setSel(0)}} onKeyDown={e=>{if(e.key==="ArrowDown"){e.preventDefault();setSel(Math.min(sel+1,f.length-1))} if(e.key==="ArrowUp"){e.preventDefault();setSel(Math.max(sel-1,0))} if(e.key==="Enter"){(f[sel]?.[2] as Function)?.();setOpen(false)}}} placeholder="Type a command, file, or section..."/><kbd>ESC</kbd></div>{f.map((c,i)=><button className={i===sel?"sel":""} key={String(c[0])} onMouseEnter={()=>setSel(i)} onClick={()=>{(c[2] as Function)();setOpen(false)}}><span>{String(c[0])}</span><small>{String(c[1])}</small></button>)}</div></div>; }
function openWindow(url:string){ window.open(url,"_blank"); }
function toast(){ const t=document.createElement("div"); t.className="toast"; t.textContent="NEURAL MODE - overclocked"; document.body.appendChild(t); setTimeout(()=>t.remove(),1800); }

const styles = `
.statusbar{position:sticky;top:0;z-index:50;height:30px;display:flex;align-items:center;background:oklch(0.105 0.012 250/.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--line-soft);font:10.5px var(--f-mono);color:var(--fg-mute);overflow-x:auto}.sb-cell{height:100%;display:flex;align-items:center;gap:8px;padding:0 14px;border-right:1px solid var(--line-soft);white-space:nowrap}.sb-cell b{color:var(--accent);font-weight:500}.sb-spacer{flex:1}.live-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);box-shadow:0 0 8px var(--accent-glow);animation:pulse 1.6s infinite}
.navbar{position:sticky;top:30px;z-index:49;background:oklch(0.135 0.012 250/.6);backdrop-filter:blur(10px);border-bottom:1px solid var(--line-soft)}.nav-inner{max-width:1320px;margin:auto;padding:12px 40px;display:flex;gap:24px;align-items:center}.brand{display:flex;gap:10px;align-items:center;font:600 16px var(--f-display)}.brand span{width:28px;height:28px;display:grid;place-items:center;border:1px solid var(--accent);border-radius:5px;color:var(--accent);background:var(--accent-soft);font:600 11px var(--f-mono)}.brand i{color:var(--fg-dim);font-style:normal;font-weight:400}.nav-links{margin-left:auto;display:flex;align-items:center}.nav-links a{display:flex;gap:8px;padding:6px 12px;border-radius:4px;font:11.5px var(--f-mono);color:var(--fg-mute)}.nav-links a:hover,.nav-links button:hover{background:var(--bg-1);color:var(--fg)}.nav-links b{color:var(--accent);font-size:10px}.nav-links button{border:1px solid var(--line);background:transparent;color:var(--fg-dim);padding:4px 8px;border-radius:4px;font:10.5px var(--f-mono)}
.hero{position:relative;min-height:calc(100vh - 80px);padding:80px 0 64px;display:flex;align-items:center;border-bottom:1px solid var(--line-soft);overflow:hidden}.latent-wrap{position:absolute;inset:-60px;opacity:.95;pointer-events:auto;mask-image:radial-gradient(ellipse 90% 80% at 60% 50%,#000 30%,transparent 95%)}.latent{display:block;width:100%;height:100%}.hero-grid{position:relative;display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:56px;align-items:center;z-index:2}.hero-copy{display:flex;flex-direction:column;gap:18px;max-width:640px}.row,.hero-cta,.hero-socials{display:flex;gap:10px;flex-wrap:wrap;align-items:center}.hero h1 span{display:block}.hero h1 small{display:block;margin-top:10px;color:var(--fg-dim);font:10.5px var(--f-mono);opacity:0}.hero h1:hover small{opacity:1}.hero-copy p{max-width:540px;color:var(--fg-mute);font-size:17px;line-height:1.6}.hero-copy b{color:var(--fg);font-weight:500}.hero-socials{gap:14px;margin-top:8px;padding-top:16px;border-top:1px solid var(--line-soft);font:12px var(--f-mono);color:var(--fg-mute)}
.chatframe,.pg-card{background:oklch(0.105 0.012 250/.88);border:1px solid var(--line);border-radius:var(--r-md);backdrop-filter:blur(8px);box-shadow:0 30px 80px -20px oklch(0.05 0.01 250/.6);overflow:hidden}.chat-shell{position:relative}.chatframe{height:480px;max-height:62vh;display:flex;flex-direction:column;font-family:var(--f-mono)}.ai-fab,.chat-backdrop,.chat-close{display:none}.chat-hd,.pg-card>header{display:flex;gap:10px;align-items:center;padding:10px 14px;border-bottom:1px solid var(--line-soft);font-size:11px;color:var(--fg-mute)}.chat-hd b,.pg-card>header b{margin-left:auto;color:var(--accent);font-size:10px}.traffic{display:flex;gap:6px}.traffic i{width:9px;height:9px;border-radius:50%;background:var(--accent)}.traffic i:nth-child(1){background:oklch(0.65 0.16 25/.8)}.traffic i:nth-child(2){background:oklch(0.78 0.15 75/.8)}.chat-body{flex:1;overflow:auto;padding:16px;font-size:12.5px}.quick{display:flex;flex-wrap:wrap;gap:6px}.quick button{border:1px solid var(--line-soft);background:transparent;color:var(--fg-mute);border-radius:999px;padding:4px 9px;font:10.5px var(--f-mono)}.quick button:hover{color:var(--accent);border-color:var(--accent);background:var(--accent-soft)}.msg{display:flex;gap:10px;margin:14px 0;align-items:flex-start}.role{flex:0 0 22px;height:22px;display:grid;place-items:center;border-radius:4px;background:var(--accent-soft);border:1px solid var(--accent);color:var(--accent);font-size:10px}.msg.user .role{background:oklch(0.25 0.01 250);color:var(--fg);border:0}.msg small{color:var(--fg-dim)}.msg p{white-space:pre-wrap;color:var(--fg)}.action{margin-top:10px;border:1px solid var(--accent);background:var(--accent-soft);color:var(--accent);border-radius:999px;padding:5px 10px;font:10.5px var(--f-mono)}.chat-input,.pg-q{display:flex;gap:10px;align-items:center;padding:10px 14px;border-top:1px solid var(--line-soft);background:oklch(0.13 0.012 250/.6)}.chat-input span,.pg-q span{color:var(--accent)}.chat-input input,.pg-q input{flex:1;background:transparent;border:0;outline:0;color:var(--fg);font:13px var(--f-mono);min-width:0}.chat-input button,.pg-q button{display:inline-flex;gap:8px;align-items:center;border:1px solid var(--line);background:transparent;color:var(--fg-mute);border-radius:4px;padding:6px 10px;font:10.5px var(--f-mono);text-transform:uppercase}.pg-q button{background:var(--accent);color:#0a0a0a;border-color:var(--accent);font-weight:600}
.np{border-block:1px solid var(--line-soft);background:oklch(0.105 0.012 250/.6);padding:14px 0;font:12px var(--f-mono)}.np .wrap{display:flex;gap:18px;align-items:center;flex-wrap:wrap}.np b{color:var(--accent)}.np span{color:var(--fg-dim);text-transform:uppercase;font-size:10.5px}.np strong{font-weight:400}.np em{margin-left:auto;color:var(--accent-2);border:1px solid var(--line);border-radius:999px;padding:2px 8px;font-style:normal;font-size:10px}
.about-grid,.contact-grid{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:64px}.bio p{font-size:17px;line-height:1.7;margin-bottom:18px;max-width:60ch}.bio b,.bio blockquote{color:var(--accent)}.bio blockquote{border-left:2px solid var(--accent);padding-left:16px;color:var(--fg-mute);font-style:italic}.weights,.form{background:var(--bg-1);border:1px solid var(--line-soft);border-radius:var(--r-md);padding:22px;font-family:var(--f-mono)}.weights header,.form header{display:flex;justify-content:space-between;border-bottom:1px solid var(--line-soft);padding-bottom:12px;margin-bottom:18px;color:var(--fg-dim);font-size:10.5px;text-transform:uppercase}.weights header b,.form header b{color:var(--accent)}.wt{display:grid;grid-template-columns:1fr auto;gap:6px 12px;margin-bottom:12px;font-size:12px}.wt b{color:var(--accent)}.wt i{grid-column:1/-1;height:4px;background:var(--bg-2);border-radius:2px;overflow:hidden}.wt em{display:block;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent-2));animation:weightFill 1.4s both}
.pg-body{padding:24px;display:grid;gap:18px}.pipe{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}.stage{min-height:220px;background:var(--bg);border:1px solid var(--line-soft);border-radius:var(--r-sm);padding:14px}.stage.active{border-color:var(--accent);box-shadow:0 0 24px var(--accent-glow)}.stage.done{border-color:var(--accent)}.stage h4{display:flex;gap:8px;border-bottom:1px solid var(--line-soft);padding-bottom:8px;margin-bottom:10px;color:var(--fg-dim);font:10.5px var(--f-mono);text-transform:uppercase}.stage h4 b,.stage p b{color:var(--accent)}.stage p{font:11px/1.45 var(--f-mono);padding:8px 10px;margin-bottom:8px;background:oklch(0.105 0.012 250/.6);color:var(--fg-mute);border-left:2px solid var(--line)}.stage .answer{font:14.5px/1.65 var(--f-body);color:var(--fg);background:transparent;border:0}.stage .answer em{background:var(--accent-soft);color:var(--accent);font:10px var(--f-mono);padding:1px 5px;border-radius:3px}.empty{display:grid;place-items:center;color:var(--fg-dim);font:11px var(--f-mono);min-height:110px}
.proj-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:20px}.project-wrap{display:contents}.pc{position:relative;min-height:360px;padding:26px;display:flex;flex-direction:column;gap:16px;overflow:hidden;background:linear-gradient(180deg,var(--bg-1),oklch(0.13 0.012 250))}.pc:hover{border-color:var(--accent);transform:translateY(-2px)}.pc:hover .pc-art{opacity:1;filter:drop-shadow(0 0 18px var(--accent-glow))}.pc-art{position:absolute;right:-10px;top:-10px;width:130px;height:130px;opacity:.6;transition:opacity .2s,filter .2s}.pc-hd{display:flex;justify-content:space-between;font:11px var(--f-mono);color:var(--fg-dim);text-transform:uppercase}.pc-hd span,.pc h3 b{color:var(--accent)}.pc small{color:var(--fg-mute);font:11px var(--f-mono)}.pc>p{color:var(--fg-mute);font-size:13.5px;line-height:1.6;flex:1}.metrics{display:flex;gap:18px;border-block:1px solid var(--line-soft);padding:12px 0;font:11px var(--f-mono)}.metrics span{display:flex;flex-direction:column;color:var(--fg-dim);text-transform:uppercase}.metrics b{color:var(--accent);font-size:14px;text-transform:none}.pc footer{display:flex;gap:12px;align-items:center;margin-top:auto;font:11px var(--f-mono)}.pc footer a,.pc footer button{border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--fg-mute);padding:4px 10px;display:inline-flex;gap:6px;align-items:center}.pc footer button{margin-left:auto}.arch{grid-column:1/-1;background:var(--bg-1);border:1px solid var(--accent);border-radius:var(--r-md);padding:24px;box-shadow:0 0 0 1px var(--accent-soft);animation:fadeIn .25s ease-out}.arch header{display:flex;border-bottom:1px solid var(--line-soft);padding-bottom:14px;margin-bottom:14px;color:var(--accent);font:11px var(--f-mono)}.arch header button{margin-left:auto}.arch-svg{width:100%;height:auto;display:block}.arch-svg rect{fill:var(--bg-2);stroke:var(--accent);stroke-opacity:.42;stroke-width:.8}.arch-svg .arch-label{fill:var(--fg);font:500 10px var(--f-mono);text-anchor:middle}.arch-svg .arch-sub{fill:var(--fg-dim);font:8.5px var(--f-mono);text-anchor:middle}.arch-svg .arch-edge{fill:none;stroke:var(--accent);stroke-opacity:.25;stroke-width:1}
.timeline{position:relative;padding-left:28px}.timeline:before{content:"";position:absolute;left:7px;top:6px;bottom:6px;width:1px;background:linear-gradient(var(--accent),var(--line),transparent)}.timeline article{position:relative;padding:0 0 36px 18px}.timeline article:before{content:"";position:absolute;left:-25px;top:8px;width:12px;height:12px;border-radius:50%;background:var(--bg);border:2px solid var(--accent);box-shadow:0 0 0 4px var(--bg),0 0 14px var(--accent-glow)}.timeline time{font:11px var(--f-mono);color:var(--fg-dim);text-transform:uppercase}.timeline h3{color:var(--accent);font-size:22px}.timeline small{color:var(--fg-mute);font:12px var(--f-mono)}.timeline ul{list-style:none;padding:0}.timeline li{color:var(--fg-mute);font-size:14.5px;line-height:1.55;margin:8px 0}.timeline li:before{content:">";color:var(--accent);margin-right:10px}.edu{margin-top:56px;padding-top:28px;border-top:1px solid var(--line-soft);display:flex;justify-content:space-between;gap:18px}.edu b{color:var(--accent)}
.cert-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.cert{position:relative;padding:22px;background:linear-gradient(180deg,var(--bg-1),var(--bg));border:1px solid var(--line-soft);border-radius:var(--r-md)}.cert:hover{border-color:var(--accent);transform:translateY(-2px)}.cert>span{position:absolute;right:22px;top:22px;font:10.5px var(--f-mono);text-transform:uppercase}.cert .earned{color:var(--accent)}.cert .pending{color:var(--accent-2)}.cert small{color:var(--fg-dim);font:10.5px var(--f-mono)}.cert h3{font-size:17px;padding-right:110px}.cert p{color:var(--fg-mute);font:12px var(--f-mono);margin:10px 0}.cert footer{display:flex;justify-content:space-between;border-top:1px solid var(--line-soft);padding-top:10px;color:var(--fg-dim);font:11px var(--f-mono)}.cert footer b{color:var(--fg-mute)}
.skill-box{position:relative;min-height:540px;background:var(--bg-1);border:1px solid var(--line-soft);border-radius:var(--r-md);padding:24px;overflow:hidden;background-image:radial-gradient(circle,oklch(0.96 0.005 250/.05) 1px,transparent 1px);background-size:24px 24px}.skill-svg{width:100%;height:auto;display:block}.skill-node{outline:none}.skill-node text{fill:var(--fg);font:10px var(--f-mono);pointer-events:none}.skill-node circle,.skill-edge{transition:opacity .2s,r .2s,stroke-opacity .2s,stroke-width .2s}.skill-node.dim circle,.skill-node.dim text{opacity:.15}.skill-node:focus-visible .skill-halo{opacity:.2}.skill-outer{opacity:.86}.skill-node:hover .skill-outer{filter:drop-shadow(0 0 10px var(--accent-glow))}.skill-legend{position:absolute;top:18px;right:18px;background:oklch(0.13 0.012 250/.82);padding:12px 14px;border:1px solid var(--line-soft);border-radius:var(--r-sm);font:10.5px var(--f-mono);display:flex;flex-direction:column;gap:6px;backdrop-filter:blur(8px)}.skill-legend span{display:flex;align-items:center;gap:8px}.skill-legend span:before{content:"";width:8px;height:8px;border-radius:50%;background:currentColor}.skill-meta{font:11px var(--f-mono);color:var(--fg-mute);display:flex;gap:18px;flex-wrap:wrap;margin-top:16px;padding-top:16px;border-top:1px solid var(--line-soft)}.skill-meta b{color:var(--fg)}.skill-hint{position:absolute;left:18px;bottom:14px;color:var(--fg-dim);font:10.5px var(--f-mono)}
.cta h2{font-size:clamp(40px,5vw,64px);line-height:1;margin-bottom:22px}.cta h2 span{color:var(--accent);text-shadow:0 0 32px var(--accent-glow)}.cta p{font-size:16px;color:var(--fg-mute);line-height:1.7;max-width:52ch}.cta>div{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:26px}.cta-card{background:var(--bg-1);border:1px solid var(--line-soft);border-radius:var(--r-sm);padding:16px;display:flex;flex-direction:column}.cta-card:hover{border-color:var(--accent);background:var(--accent-soft)}.cta-card small{color:var(--fg-dim);font:10.5px var(--f-mono)}.cta-card b{font:14px var(--f-mono)}.form{display:grid;gap:14px}.form label{display:flex;flex-direction:column;gap:6px;color:var(--fg-mute);font-size:11px;text-transform:uppercase}.form input,.form textarea{background:var(--bg);border:1px solid var(--line-soft);border-radius:var(--r-sm);color:var(--fg);padding:10px 12px;outline:0}.form input:focus,.form textarea:focus{border-color:var(--accent)}.form button{justify-self:start;background:var(--accent);color:#0a0a0a;border:0;border-radius:var(--r-sm);padding:12px 18px;text-transform:uppercase;font-weight:600;display:flex;gap:8px;align-items:center}
footer{border-top:1px solid var(--line-soft);padding:36px 0 80px;color:var(--fg-dim);font:11px var(--f-mono)}footer pre{color:var(--accent);opacity:.55}
.palette-bg{position:fixed;inset:0;z-index:1000;background:oklch(0.06 0.01 250/.65);backdrop-filter:blur(6px);display:flex;justify-content:center;align-items:flex-start;padding-top:14vh}.palette{width:92%;max-width:560px;background:var(--bg-1);border:1px solid var(--line);border-radius:var(--r-md);box-shadow:0 30px 80px #000;overflow:hidden;font-family:var(--f-mono)}.palette>div{display:flex;gap:10px;align-items:center;padding:14px 18px;border-bottom:1px solid var(--line-soft)}.palette input{flex:1;background:transparent;border:0;outline:0;color:var(--fg)}.palette button{width:100%;display:flex;justify-content:space-between;background:transparent;border:0;border-left:2px solid transparent;color:var(--fg);padding:10px 18px;text-align:left}.palette button.sel{background:var(--accent-soft);border-left-color:var(--accent);color:var(--accent)}.toast{position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:99999;padding:30px 40px;background:var(--bg-1);color:var(--accent);border:1px solid var(--accent);border-radius:8px;font:18px var(--f-mono);box-shadow:0 0 60px var(--accent-glow)}
@media(max-width:980px){.hero-grid,.about-grid,.contact-grid{grid-template-columns:1fr}.pipe,.proj-grid,.cert-grid{grid-template-columns:1fr}.project-wrap{display:block}.arch{margin-top:20px}.nav-links a span{display:none}}
@media(max-width:720px){
.nav-inner{padding:12px 20px}.brand{font-size:14px}.nav-links{gap:4px}.nav-links a{padding:6px 8px}.nav-links button{display:none}
.hero{min-height:auto;padding:52px 0 72px;text-align:center}.hero-grid{gap:28px;justify-items:center}.hero-copy{align-items:center;max-width:560px}.hero .row,.hero-cta,.hero-socials{justify-content:center}.hero-copy p{font-size:15.5px;line-height:1.65;max-width:34rem}.hero h1{font-size:clamp(43px,13vw,60px)}.hero h1 small{white-space:normal;max-width:100%;font-size:10px}.hero-socials{border-top:0;padding-top:4px;gap:10px 14px}
.chat-shell{width:0;height:0}.chat-shell>.chatframe{display:none}.ai-fab{display:grid;place-items:center;position:fixed;right:18px;bottom:18px;z-index:1200;width:58px;height:58px;border-radius:50%;border:1px solid var(--accent);background:oklch(0.105 0.012 250/.94);color:var(--accent);font:700 13px var(--f-mono);box-shadow:0 0 0 6px var(--accent-soft),0 18px 44px -12px #000}.ai-fab:after{content:"";position:absolute;inset:8px;border-radius:50%;border:1px solid var(--accent-soft);animation:pulse 1.8s infinite}.chat-shell.open .chat-backdrop{display:block;position:fixed;inset:0;z-index:1190;border:0;background:oklch(0.06 0.01 250/.68);backdrop-filter:blur(8px)}.chat-shell.open>.chatframe{display:flex;position:fixed;left:14px;right:14px;bottom:88px;z-index:1201;height:min(72vh,560px);max-height:none;text-align:left;border-color:var(--accent);box-shadow:0 0 0 1px var(--accent-soft),0 28px 80px -18px #000}.chat-close{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;border:1px solid var(--line);background:transparent;color:var(--fg-mute);font:12px var(--f-mono);margin-left:6px}.chat-hd b{margin-left:auto}.quick{overflow-x:auto;flex-wrap:nowrap;padding-bottom:2px}.quick button{flex:0 0 auto}.chat-input{gap:8px}.chat-input button{padding:6px 8px}.chat-input button svg{display:none}
.np .wrap{justify-content:center;text-align:center;gap:8px 14px}.np em{margin-left:0}.pg-body{padding:16px}.pg-q{align-items:stretch;flex-wrap:wrap}.pg-q input{flex-basis:100%;order:2}.pg-q button{order:3;width:100%;justify-content:center}.pipe{gap:10px}.stage{min-height:170px}.proj-grid{gap:14px}.pc{padding:20px;min-height:auto}.metrics{gap:14px}.arch{padding:16px;overflow-x:auto}.arch-svg{min-width:720px}.skill-box{min-height:460px;padding:14px 10px 34px}.skill-legend{position:static;margin-bottom:8px;display:grid;grid-template-columns:1fr 1fr;font-size:9.5px}.skill-hint{left:12px;right:12px;text-align:center}.skill-meta{justify-content:center;text-align:center}.cta{text-align:center}.cta>div{grid-template-columns:1fr}.form{text-align:left}.edu{display:block}.cert h3{padding-right:92px}
}
`;
