// Featured projects — 5 cards w/ mini visualizations

const PROJECTS = [
  {
    id: "01",
    name: "Hybrid RecSys",
    title: "Hybrid game-recommendation engine",
    company: "Quantum Horizon · Production",
    tag: "Recommender systems",
    blurb: "Solo-built an end-to-end hybrid recommender (collab + content) over LightFM to recommend casino games to ~M users. Owned the full pipeline: data prep, training, eval, batch scoring, and serving — plus the metrics dashboard product asks for at 9am every Monday.",
    stack: ["LightFM", "Python", "FastAPI", "AWS S3", "Airflow"],
    metrics: [["NDCG@10", "+34%"], ["CTR uplift", "+18%"], ["cold-start", "solved"]],
    href: "https://github.com/AyushDubeyaquagaming/Hybrid-RecSys",
    art: "matrix",
  },
  {
    id: "02",
    name: "Fraud-Detection",
    title: "Rules + ML system for live game-cheat detection",
    company: "Quantum Horizon · In progress",
    tag: "Applied ML · Anomaly detection",
    blurb: "Hybrid rules-engine + supervised ML to catch players exploiting roulette and similar games. Designed feature pipelines for streaming session data and trained tree-based classifiers; rules layer keeps interpretability for the ops team.",
    stack: ["XGBoost", "Python", "Pandas", "Redis", "Kafka"],
    metrics: [["recall", "0.91"], ["precision", "0.88"], ["alerts/day", "↓62%"]],
    href: "https://github.com/AyushDubeyaquagaming/Fraud-Detection",
    art: "anomaly",
  },
  {
    id: "03",
    name: "MLOps · IMDB",
    title: "End-to-end MLOps for IMDB sentiment analysis",
    company: "Personal · OSS",
    tag: "MLOps · Infra",
    blurb: "A reference implementation of doing it 'right': notebook → MLflow tracking & registry → DVC data versioning → GitHub Actions CI/CD → Docker → Kubernetes (EKS) deploy → Prometheus + Grafana monitoring on EC2. The kind of repo I wish I'd had when I started.",
    stack: ["MLflow", "DVC", "K8s/EKS", "Docker", "Prometheus", "Grafana", "AWS"],
    metrics: [["pipeline", "fully ci/cd"], ["deploy", "1-click"], ["monitoring", "live"]],
    href: "https://github.com/MLayush-dubey/MLOps-IMDB-Sentiment-Analysis",
    art: "pipeline",
  },
  {
    id: "04",
    name: "Stock Multi-Agent",
    title: "CrewAI agents for stock analysis & strategy",
    company: "Personal · OSS",
    tag: "LLM Agents · Multi-agent",
    blurb: "A multi-agent system (CrewAI + Gemini) where specialised agents — fundamental analyst, technical analyst, strategist — collaborate to produce a synthesised investment view. Tooling for market data, technical indicators, and structured output.",
    stack: ["CrewAI", "Google Gemini", "yfinance", "LangChain", "Python"],
    metrics: [["agents", "4 roles"], ["tools", "12+"], ["latency", "~9s e2e"]],
    href: "https://github.com/MLayush-dubey/StockMarket-multi-agents",
    art: "agents",
  },
  {
    id: "05",
    name: "RAG Research-bot",
    title: "Agentic RAG over ML research papers",
    company: "Personal · OSS",
    tag: "RAG · LLM Apps",
    blurb: "Production-grade research assistant: agent orchestration on top of a vector store of curated ML papers. Multi-hop retrieval, citation grounding, and reasoning traces — designed so the answers are checkable, not vibes.",
    stack: ["LangChain", "Chroma", "OpenAI", "FastAPI", "Python"],
    metrics: [["papers", "indexed"], ["hops", "2-3 avg"], ["grounded", "yes"]],
    href: "https://github.com/MLayush-dubey/RAG-Agentic-Research-Chatbot",
    art: "rag",
  },
];

function Projects() {
  const [expanded, setExpanded] = useState(null);
  useEffect(() => {
    const onShow = (e) => {
      const id = e.detail?.id;
      if (id) setExpanded(id);
    };
    window.addEventListener("portfolio:expand-project", onShow);
    return () => window.removeEventListener("portfolio:expand-project", onShow);
  }, []);
  return (
    <section id="projects" className="sec projects" data-screen-label="Projects">
      <style>{`
        .proj-grid{ display:grid; grid-template-columns: repeat(2, 1fr); gap: 20px }
        @media (max-width: 900px){ .proj-grid{grid-template-columns:1fr} }
        .pc{ position:relative; padding: 26px; display:flex; flex-direction:column; gap: 16px;
          min-height: 360px; overflow:hidden; cursor: default;
          background: linear-gradient(180deg, var(--bg-1) 0%, oklch(0.13 0.012 250) 100%)}
        .pc:hover{ border-color: var(--accent); transform: translateY(-2px) }
        .pc:hover .pc-art{ opacity: 1 }
        .pc::before{
          content:""; position:absolute; inset:0;
          background: radial-gradient(circle at 100% 0%, var(--accent-soft), transparent 50%);
          opacity: 0; transition: opacity .25s; pointer-events:none}
        .pc:hover::before{ opacity: 1 }
        .pc-hd{ display:flex; align-items:center; gap: 10px }
        .pc-num{ font-family: var(--f-mono); font-size: 11px; color: var(--accent); letter-spacing:0.08em}
        .pc-tag{ font-family: var(--f-mono); font-size: 10.5px; color: var(--fg-dim);
          text-transform: uppercase; letter-spacing: 0.08em; margin-left:auto }
        .pc h3{ font-family: var(--f-display); font-size: 22px; font-weight: 500;
          letter-spacing: -0.02em; line-height: 1.2}
        .pc h3 .name{ color: var(--accent) }
        .pc .co{ font-family: var(--f-mono); font-size: 11px; color: var(--fg-mute);
          display:flex; gap:8px; align-items:center}
        .pc .co::before{ content:""; width:4px; height:4px; border-radius:50%;
          background: var(--accent-2); display:inline-block }
        .pc .blurb{ font-size: 13.5px; line-height: 1.6; color: var(--fg-mute);
          flex: 1 0 auto }
        .pc-art{ position:absolute; right: -10px; top: -10px; width: 130px; height: 130px;
          opacity: .6; transition: opacity .25s; pointer-events:none }
        .pc-metrics{ display:flex; flex-wrap:wrap; gap: 18px; font-family: var(--f-mono);
          font-size: 11px; padding: 12px 0; border-top: 1px solid var(--line-soft);
          border-bottom: 1px solid var(--line-soft)}
        .pc-metrics .m{ display:flex; flex-direction:column; gap: 2px }
        .pc-metrics .m b{ color: var(--accent); font-weight: 500; font-size: 14px }
        .pc-metrics .m span{ color: var(--fg-dim); font-size: 10px; text-transform: uppercase;
          letter-spacing: 0.08em }
        .pc-stack{ display:flex; flex-wrap:wrap; gap: 6px }
        .pc-foot{ display:flex; gap: 12px; align-items: center; margin-top: auto;
          font-family: var(--f-mono); font-size: 11px; color: var(--fg-mute) }
        .pc-foot a{ display:inline-flex; align-items:center; gap:6px;
          padding: 4px 10px; border:1px solid var(--line); border-radius: 999px;
          transition: all .15s}
        .pc-foot a:hover{ color: var(--accent); border-color: var(--accent); background: var(--accent-soft)}
        .pc-expand{ appearance:none; margin-left:auto; background: transparent; border:1px solid var(--line);
          color: var(--fg-mute); font-family: var(--f-mono); font-size: 10.5px;
          padding: 4px 10px; border-radius: 999px; cursor: default;
          text-transform: uppercase; letter-spacing: 0.05em; transition: all .15s;
          display:inline-flex; align-items:center; gap: 6px}
        .pc-expand:hover{ color: var(--accent); border-color: var(--accent); background: var(--accent-soft) }
        .pc-arch{ grid-column: 1 / -1; padding: 24px;
          background: var(--bg-1); border:1px solid var(--accent);
          border-radius: var(--r-md);
          box-shadow: 0 0 0 1px var(--accent-soft), 0 30px 60px -20px oklch(0.05 0.01 250 / .6);
          animation: archIn .25s ease-out;
          position: relative; overflow: hidden}
        @keyframes archIn{ from{ opacity:0; transform: translateY(-6px) } }
        .pc-arch-h{ display:flex; align-items:baseline; gap: 12px;
          padding-bottom: 14px; border-bottom: 1px solid var(--line-soft); margin-bottom: 14px}
        .pc-arch-h h4{ font-family: var(--f-display); font-size: 18px; font-weight: 500;
          letter-spacing: -0.02em; color: var(--fg) }
        .pc-arch-h .tag{ font-family: var(--f-mono); font-size: 10.5px; color: var(--accent);
          text-transform: uppercase; letter-spacing: 0.08em }
        .pc-arch-h button{ margin-left:auto; appearance:none; background: transparent;
          border:1px solid var(--line); color: var(--fg-mute);
          width: 26px; height: 26px; border-radius: 50%; cursor:default;
          font-family: var(--f-mono); font-size: 12px }
        .pc-arch-h button:hover{ color: var(--accent); border-color: var(--accent) }
        .pc-arch-cap{ font-family: var(--f-mono); font-size: 11px; color: var(--fg-dim);
          margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--line-soft); display:flex; gap: 12px; flex-wrap: wrap}
      `}</style>

      <div className="wrap">
        <SectionHead num="03 // projects" title="Featured work" meta="// 5 shipped · 1 in flight" />

        <div className="proj-grid">
          {PROJECTS.map((p) => (<React.Fragment key={p.id}>
            <div className="card pc" data-screen-label={`Project ${p.id}`} id={`project-${p.id}`}>
              <ProjectArt kind={p.art} />
              <div className="pc-hd">
                <span className="pc-num">{p.id}</span>
                <span className="pc-tag">{p.tag}</span>
              </div>
              <h3><span className="name">{p.name}</span><br/>{p.title}</h3>
              <div className="co">{p.company}</div>
              <p className="blurb">{p.blurb}</p>
              <div className="pc-metrics">
                {p.metrics.map(([k,v],i) => (
                  <div className="m" key={i}>
                    <b>{v}</b>
                    <span>{k}</span>
                  </div>
                ))}
              </div>
              <div className="pc-stack">
                {p.stack.map((s,i) => <Chip key={i}>{s}</Chip>)}
              </div>
              <div className="pc-foot">
                <a href={p.href} target="_blank" rel="noreferrer">
                  <Icon name="github" size={12}/> Source
                </a>
                <button className="pc-expand" onClick={() => setExpanded(expanded === p.id ? null : p.id)}>
                  {expanded === p.id ? "hide arch ↑" : "view architecture ↓"}
                </button>
                <a style={{display:"none"}} href="#">
                </a>
                <span style={{color:'var(--fg-dim)'}}>·</span>
                <span style={{color:'var(--fg-dim)'}}>git log --oneline</span>
              </div>
            </div>
            {expanded === p.id && (
              <div className="pc-arch">
                <div className="pc-arch-h">
                  <span className="tag">// {p.id} · architecture</span>
                  <h4>{p.name} — system diagram</h4>
                  <button onClick={() => setExpanded(null)} title="Close">×</button>
                </div>
                <ArchDiagram projId={p.id} />
                <div className="pc-arch-cap">
                  <span>// nodes: {(ARCH[p.id]?.nodes||[]).length}</span>
                  <span>// edges: {(ARCH[p.id]?.edges||[]).length}</span>
                  <span>// data flows left → right</span>
                  <span style={{marginLeft:"auto", color:"var(--accent)"}}>▸ live trace animation</span>
                </div>
              </div>
            )}
          </React.Fragment>))}
        </div>
      </div>
    </section>
  );
}

// Mini SVG visualizations per project
function ProjectArt({ kind }) {
  const W = 130, H = 130;
  const stroke = "var(--accent)";
  const stroke2 = "var(--accent-2)";
  const common = { width: W, height: H, viewBox: `0 0 ${W} ${H}` };

  if (kind === "matrix") {
    // sparse interaction matrix
    const cells = [];
    const rng = mulberry32(7);
    const N = 9;
    for (let r = 0; r < N; r++) for (let c = 0; c < N; c++) {
      const v = rng();
      if (v > 0.55) cells.push({ r, c, v });
    }
    const sz = 11;
    return (
      <svg {...common} className="pc-art">
        <g transform="translate(20,20)">
          {cells.map((cell,i) => (
            <rect key={i} x={cell.c*sz} y={cell.r*sz} width={sz-2} height={sz-2}
              fill={stroke} opacity={0.2 + cell.v * 0.6}/>
          ))}
        </g>
      </svg>
    );
  }
  if (kind === "anomaly") {
    // scatter w/ outliers
    const rng = mulberry32(13);
    const pts = [];
    for (let i = 0; i < 28; i++) {
      pts.push({ x: 30 + rng()*70, y: 30 + rng()*70, r: 1.6, outlier: false });
    }
    for (let i = 0; i < 4; i++) {
      pts.push({ x: 5 + rng()*120, y: 5 + rng()*120, r: 2.4, outlier: true });
    }
    return (
      <svg {...common} className="pc-art">
        {pts.map((p,i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r}
            fill={p.outlier ? stroke2 : stroke} opacity={p.outlier ? 1 : 0.5}/>
        ))}
        {pts.filter(p=>p.outlier).map((p,i) => (
          <circle key={"r"+i} cx={p.x} cy={p.y} r={6} fill="none"
            stroke={stroke2} strokeWidth="0.6" opacity="0.7"/>
        ))}
      </svg>
    );
  }
  if (kind === "pipeline") {
    // pipeline boxes
    return (
      <svg {...common} className="pc-art">
        <g fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.75">
          <rect x="10" y="18" width="22" height="14" rx="2"/>
          <rect x="44" y="18" width="22" height="14" rx="2"/>
          <rect x="78" y="18" width="22" height="14" rx="2"/>
          <rect x="27" y="56" width="22" height="14" rx="2"/>
          <rect x="61" y="56" width="22" height="14" rx="2"/>
          <rect x="44" y="94" width="22" height="14" rx="2"/>
          <path d="M32 25 H44 M66 25 H78 M55 32 V56 M89 32 V63 H83 M38 63 V56 M55 70 V94"/>
        </g>
      </svg>
    );
  }
  if (kind === "agents") {
    // ring of agent nodes
    const cx = 65, cy = 65, R = 38;
    const nodes = Array.from({length:5}, (_,i) => {
      const a = (i / 5) * Math.PI * 2 - Math.PI/2;
      return { x: cx + Math.cos(a)*R, y: cy + Math.sin(a)*R };
    });
    return (
      <svg {...common} className="pc-art">
        <g stroke={stroke} strokeWidth="0.6" opacity="0.5" fill="none">
          {nodes.map((n,i) => nodes.slice(i+1).map((m,j) => (
            <line key={`${i}-${j}`} x1={n.x} y1={n.y} x2={m.x} y2={m.y}/>
          )))}
        </g>
        <circle cx={cx} cy={cy} r="4" fill={stroke2}/>
        {nodes.map((n,i) => <circle key={i} cx={n.x} cy={n.y} r="3.5" fill={stroke}/>)}
      </svg>
    );
  }
  if (kind === "rag") {
    // doc -> arrows -> brain
    return (
      <svg {...common} className="pc-art">
        <g fill="none" stroke={stroke} strokeWidth="0.8" opacity="0.8">
          <rect x="10" y="20" width="16" height="20" rx="1"/>
          <rect x="10" y="55" width="16" height="20" rx="1"/>
          <rect x="10" y="90" width="16" height="20" rx="1"/>
          <line x1="11" y1="26" x2="22" y2="26"/>
          <line x1="11" y1="30" x2="20" y2="30"/>
          <line x1="11" y1="61" x2="22" y2="61"/>
          <line x1="11" y1="65" x2="20" y2="65"/>
          <line x1="11" y1="96" x2="22" y2="96"/>
          <line x1="11" y1="100" x2="20" y2="100"/>
          <path d="M30 30 Q55 30 65 60 M30 65 H65 M30 100 Q55 100 65 70"/>
          <circle cx="85" cy="65" r="18" stroke={stroke2}/>
          <path d="M80 55 q5 -5 10 0 q5 5 0 10 q-5 5 -10 0 q-5 -5 0 -10 M78 65 H92 M85 53 V77" stroke={stroke2}/>
        </g>
      </svg>
    );
  }
  return null;
}

Object.assign(window, { Projects, ProjectArt, PROJECTS });
