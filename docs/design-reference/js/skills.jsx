// Skills — interactive node-graph (force-ish layout, predetermined positions)

const SKILL_NODES = [
  // [id, label, group, x, y, size]

  // Core language hub
  ["python",     "Python",        "lang",   50, 50, 22],
  ["sql",        "SQL",           "lang",   40, 58, 13],
  ["ts",         "TypeScript",    "lang",   60, 58, 12],

  // Classical ML
  ["sklearn",    "scikit-learn",  "ml",     30, 38, 14],
  ["lightfm",    "LightFM",       "ml",     20, 50, 13],
  ["xgboost",    "XGBoost",       "ml",     18, 32, 12],

  // Deep Learning + CV
  ["pytorch",    "PyTorch",       "dl",     70, 30, 17],
  ["tf",         "TensorFlow",    "dl",     82, 38, 15],
  ["cnn",        "CNNs",          "dl",     80, 22, 12],
  ["gan",        "GANs",          "dl",     90, 30, 12],
  ["yolo",       "YOLO",          "dl",     92, 44, 11],
  ["opencv",     "OpenCV",        "dl",     72, 18, 11],

  // NLP
  ["bert",       "BERT",          "nlp",    36, 18, 12],
  ["hf",         "HuggingFace",   "nlp",    48, 12, 13],
  ["spacy",      "spaCy",         "nlp",    24, 18, 11],
  ["lstm",       "LSTM / RNN",    "nlp",    14, 18, 11],

  // GenAI / Agents
  ["langchain",  "LangChain",     "llm",    70, 70, 16],
  ["crewai",     "CrewAI",        "llm",    84, 64, 14],
  ["agno",       "Agno",          "llm",    90, 76, 12],
  ["llamaidx",   "LlamaIndex",    "llm",    78, 82, 13],
  ["pydanticai", "PydanticAI",    "llm",    62, 78, 12],
  ["rag",        "RAG",           "llm",    56, 70, 14],
  ["pinecone",   "Pinecone",      "llm",    88, 88, 11],
  ["chroma",     "Chroma",        "llm",    74, 92, 11],
  ["milvus",     "Milvus",        "llm",    62, 92, 11],

  // MLOps
  ["mlflow",     "MLflow",        "mlops",  44, 28, 14],
  ["dvc",        "DVC",           "mlops",  58, 28, 12],

  // Infra / Cloud
  ["docker",     "Docker",        "infra",  30, 80, 14],
  ["fastapi",    "FastAPI",       "infra",  42, 80, 13],
  ["aws",        "AWS / EC2",     "infra",  18, 72, 14],
  ["cicd",       "GH Actions",    "infra",  12, 88, 12],
  ["streamlit",  "Streamlit",     "infra",  50, 88, 12],
  ["django",     "Django",        "infra",  6,  62, 12],
];

const SKILL_EDGES = [
  // Python is the hub
  ["python","sklearn"], ["python","pytorch"], ["python","tf"],
  ["python","langchain"], ["python","fastapi"], ["python","django"],
  ["python","hf"], ["python","sql"], ["python","crewai"], ["python","streamlit"],
  // Lang
  ["sql","django"], ["ts","fastapi"],
  // Classical ML
  ["sklearn","xgboost"], ["sklearn","lightfm"], ["sklearn","mlflow"],
  ["lightfm","mlflow"], ["xgboost","mlflow"],
  // DL+CV
  ["pytorch","cnn"], ["pytorch","gan"], ["tf","cnn"],
  ["cnn","yolo"], ["cnn","opencv"], ["gan","opencv"], ["yolo","opencv"],
  ["pytorch","mlflow"], ["tf","mlflow"],
  // NLP
  ["hf","bert"], ["hf","spacy"], ["bert","lstm"], ["lstm","pytorch"], ["spacy","sklearn"],
  // GenAI
  ["langchain","rag"], ["langchain","crewai"], ["langchain","llamaidx"],
  ["crewai","agno"], ["crewai","pydanticai"], ["llamaidx","rag"],
  ["rag","chroma"], ["rag","pinecone"], ["rag","milvus"],
  ["rag","fastapi"], ["langchain","hf"],
  // MLOps
  ["mlflow","dvc"], ["mlflow","docker"], ["dvc","cicd"], ["cicd","docker"],
  // Infra
  ["docker","fastapi"], ["docker","aws"], ["fastapi","streamlit"],
  ["aws","cicd"], ["django","docker"],
];

const GROUP_COLORS = {
  lang:  "var(--accent)",
  ml:    "oklch(0.78 0.14 145)",
  dl:    "oklch(0.78 0.14 175)",
  nlp:   "oklch(0.78 0.14 200)",
  llm:   "var(--accent-2)",
  mlops: "oklch(0.78 0.14 80)",
  infra: "oklch(0.72 0.12 250)",
};

function Skills() {
  const [hover, setHover] = useState(null);
  const [boxRef, size] = useElementSize();
  const W = size.w || 600;
  const H = Math.max(540, Math.min(680, W * 0.66));

  const nodes = SKILL_NODES.map(([id,label,group,x,y,r]) => ({
    id, label, group, color: GROUP_COLORS[group],
    x: (x / 100) * W, y: (y / 100) * H, r
  }));
  const byId = Object.fromEntries(nodes.map(n => [n.id, n]));
  const neighbors = new Map();
  SKILL_EDGES.forEach(([a,b]) => {
    if (!neighbors.has(a)) neighbors.set(a, new Set());
    if (!neighbors.has(b)) neighbors.set(b, new Set());
    neighbors.get(a).add(b);
    neighbors.get(b).add(a);
  });
  const isActive = (id) => !hover || hover === id || neighbors.get(hover)?.has(id);

  const groups = [
    { key: "lang",  label: "Languages",     color: GROUP_COLORS.lang },
    { key: "ml",    label: "Classical ML",  color: GROUP_COLORS.ml },
    { key: "dl",    label: "Deep Learning / CV", color: GROUP_COLORS.dl },
    { key: "nlp",   label: "NLP",           color: GROUP_COLORS.nlp },
    { key: "llm",   label: "GenAI / Agents",color: GROUP_COLORS.llm },
    { key: "mlops", label: "MLOps",         color: GROUP_COLORS.mlops },
    { key: "infra", label: "Infra / Cloud", color: GROUP_COLORS.infra },
  ];

  return (
    <section id="skills" className="sec skills" data-screen-label="Skills">
      <style>{`
        .skill-box{ position: relative; border: 1px solid var(--line-soft);
          border-radius: var(--r-md); background: var(--bg-1);
          background-image: radial-gradient(circle, oklch(0.96 0.005 250 / 0.05) 1px, transparent 1px);
          background-size: 24px 24px;
          padding: 24px; min-height: 540px; overflow:hidden}
        .skill-svg{ display:block; width:100%; height: auto }
        .skill-svg .node text{ font-family: var(--f-mono); font-size: 10px;
          fill: var(--fg); pointer-events: none }
        .skill-svg .node circle{ transition: r .2s, opacity .2s; cursor: default }
        .skill-svg .edge{ transition: stroke-opacity .2s }
        .skill-svg .node.dim circle, .skill-svg .node.dim text{ opacity: .15 }
        .skill-legend{ position: absolute; top: 18px; right: 18px;
          background: oklch(0.13 0.012 250 / .8); padding: 12px 14px;
          border:1px solid var(--line-soft); border-radius: var(--r-sm);
          font-family: var(--f-mono); font-size: 10.5px;
          display: flex; flex-direction: column; gap: 6px;
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px)}
        .skill-legend .leg{ display:flex; align-items:center; gap:8px; color: var(--fg-mute)}
        .skill-legend .leg::before{ content:""; width:8px; height:8px; border-radius: 50%;
          background: currentColor }
        .skill-meta{ font-family: var(--f-mono); font-size: 11px; color: var(--fg-mute);
          margin-top: 16px; display:flex; gap: 18px; flex-wrap: wrap;
          padding-top: 16px; border-top: 1px solid var(--line-soft)}
        .skill-meta b{ color: var(--fg) }
        .skill-hint{ position: absolute; bottom: 14px; left: 18px;
          font-family: var(--f-mono); font-size: 10.5px; color: var(--fg-dim)}
      `}</style>

      <div className="wrap">
        <SectionHead num="06 // skills" title="Stack graph"
          meta={`// ${SKILL_NODES.length} nodes · ${SKILL_EDGES.length} edges`} />

        <div className="skill-box" ref={boxRef}>
          <svg className="skill-svg" viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
            {SKILL_EDGES.map(([a,b], i) => {
              const A = byId[a], B = byId[b];
              if (!A || !B) return null;
              const active = !hover || hover === a || hover === b ||
                (neighbors.get(hover)?.has(a) && neighbors.get(hover)?.has(b));
              return (
                <line key={i} className="edge"
                  x1={A.x} y1={A.y} x2={B.x} y2={B.y}
                  stroke="var(--accent)"
                  strokeWidth={hover && (hover === a || hover === b) ? 1.2 : 0.5}
                  strokeOpacity={hover ? (active ? 0.55 : 0.04) : 0.16}/>
              );
            })}
            {nodes.map((n) => {
              const active = isActive(n.id);
              const focused = hover === n.id;
              return (
                <g key={n.id} className={"node " + (active ? "" : "dim")}
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover(null)}
                  transform={`translate(${n.x},${n.y})`}>
                  <circle r={n.r + 12} fill={n.color} opacity={focused ? 0.18 : 0}/>
                  <circle r={focused ? n.r + 3 : n.r} fill={n.color} opacity={0.85}
                    style={{filter: focused ? "drop-shadow(0 0 10px " + n.color + ")" : ""}}/>
                  <circle r={Math.max(2, n.r - 4)} fill="var(--bg)"/>
                  <text textAnchor="middle" dy="3.5">{n.label}</text>
                </g>
              );
            })}
          </svg>
          <div className="skill-legend">
            {groups.map(g => (
              <div className="leg" key={g.key} style={{color: g.color}}>{g.label}</div>
            ))}
          </div>
          <div className="skill-hint">// hover a node to highlight its connections</div>
        </div>

        <div className="skill-meta">
          <span><b>shipping daily:</b> Python · PyTorch · FastAPI · Docker</span>
          <span><b>building with:</b> LangChain · CrewAI · LlamaIndex · MLflow</span>
          <span><b>cloud:</b> AWS (EC2) · GitHub Actions · DVC</span>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Skills });
