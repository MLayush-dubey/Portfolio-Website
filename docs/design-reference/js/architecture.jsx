// Project architecture diagrams — expandable on click, animated SVG flow.

const ARCH = {
  "01": { // Hybrid RecSys
    nodes: [
      { id:"users",  x: 60,  y: 60,  w: 90, h: 36, label: "User events", sub: "click / wager / play" },
      { id:"items",  x: 60,  y: 130, w: 90, h: 36, label: "Item catalog", sub: "game features" },
      { id:"feat",   x: 220, y: 95,  w: 100, h: 50, label: "Feature pipeline", sub: "Python + Pandas" },
      { id:"train",  x: 380, y: 55,  w: 100, h: 50, label: "LightFM train", sub: "hybrid: collab+content" },
      { id:"reg",    x: 380, y: 135, w: 100, h: 50, label: "Model registry", sub: "MLflow" },
      { id:"api",    x: 540, y: 95,  w: 100, h: 50, label: "Serving API", sub: "FastAPI · ranking" },
      { id:"app",    x: 700, y: 95,  w: 80,  h: 50, label: "Game client", sub: "top-N recs" },
    ],
    edges: [
      ["users","feat"], ["items","feat"], ["feat","train"], ["train","reg"],
      ["reg","api"], ["api","app"], ["feat","reg"]
    ]
  },
  "02": { // Fraud detection
    nodes: [
      { id:"sess",   x: 60,  y: 95,  w: 100, h: 50, label: "Session stream", sub: "Kafka events" },
      { id:"feat",   x: 220, y: 55,  w: 100, h: 50, label: "Feature store", sub: "Redis · windowed" },
      { id:"rules",  x: 380, y: 55,  w: 100, h: 50, label: "Rules engine", sub: "interpretable" },
      { id:"model",  x: 380, y: 135, w: 100, h: 50, label: "XGBoost", sub: "trained on labels" },
      { id:"vote",   x: 540, y: 95,  w: 100, h: 50, label: "Score fusion", sub: "weighted ensemble" },
      { id:"alert",  x: 700, y: 65,  w: 80,  h: 36, label: "Alert", sub: "ops dashboard" },
      { id:"block",  x: 700, y: 125, w: 80,  h: 36, label: "Auto-block", sub: "high-conf only" },
    ],
    edges: [
      ["sess","feat"], ["feat","rules"], ["feat","model"], ["rules","vote"],
      ["model","vote"], ["vote","alert"], ["vote","block"]
    ]
  },
  "03": { // MLOps IMDB
    nodes: [
      { id:"nb",     x: 50,  y: 50,  w: 90, h: 36, label: "Notebook", sub: "experiment" },
      { id:"dvc",    x: 50,  y: 130, w: 90, h: 36, label: "DVC", sub: "data versioning" },
      { id:"mlf",    x: 200, y: 50,  w: 90, h: 36, label: "MLflow", sub: "tracking · registry" },
      { id:"ci",     x: 200, y: 130, w: 90, h: 36, label: "GH Actions", sub: "CI / CD" },
      { id:"docker", x: 350, y: 90,  w: 90, h: 50, label: "Docker", sub: "image build" },
      { id:"ecr",    x: 500, y: 50,  w: 90, h: 36, label: "AWS ECR", sub: "image registry" },
      { id:"eks",    x: 500, y: 130, w: 90, h: 36, label: "AWS EKS", sub: "k8s deploy" },
      { id:"prom",   x: 650, y: 50,  w: 90, h: 36, label: "Prometheus", sub: "metrics" },
      { id:"graf",   x: 650, y: 130, w: 90, h: 36, label: "Grafana", sub: "dashboards on EC2" },
    ],
    edges: [
      ["nb","mlf"], ["dvc","ci"], ["mlf","ci"], ["ci","docker"],
      ["docker","ecr"], ["ecr","eks"], ["eks","prom"], ["prom","graf"]
    ]
  },
  "04": { // Stock multi-agent
    nodes: [
      { id:"q",      x: 60,  y: 95,  w: 90,  h: 50, label: "User query", sub: "ticker / theme" },
      { id:"orch",   x: 200, y: 95,  w: 100, h: 50, label: "CrewAI", sub: "orchestrator" },
      { id:"an",     x: 360, y: 40,  w: 110, h: 46, label: "Analyst Agent", sub: "fundamentals" },
      { id:"tech",   x: 360, y: 105, w: 110, h: 46, label: "Technical Agent", sub: "indicators" },
      { id:"trade",  x: 360, y: 170, w: 110, h: 46, label: "Trader Agent", sub: "strategy" },
      { id:"yf",     x: 530, y: 105, w: 90,  h: 50, label: "yFinance", sub: "tool · API" },
      { id:"out",    x: 680, y: 95,  w: 100, h: 50, label: "Strategy", sub: "structured output" },
    ],
    edges: [
      ["q","orch"], ["orch","an"], ["orch","tech"], ["orch","trade"],
      ["an","yf"], ["tech","yf"], ["trade","out"], ["an","out"], ["tech","out"]
    ]
  },
  "05": { // RAG research bot
    nodes: [
      { id:"papers", x: 50,  y: 60,  w: 100, h: 36, label: "ML papers", sub: "curated corpus" },
      { id:"chunk",  x: 50,  y: 130, w: 100, h: 36, label: "Semantic chunker", sub: "LlamaIndex" },
      { id:"chroma", x: 200, y: 95,  w: 100, h: 50, label: "ChromaDB", sub: "vector store" },
      { id:"q",      x: 360, y: 60,  w: 90,  h: 36, label: "User query", sub: "FastAPI" },
      { id:"agent",  x: 360, y: 130, w: 90,  h: 36, label: "CrewAI", sub: "agent loop" },
      { id:"groq",   x: 510, y: 95,  w: 100, h: 50, label: "Groq Llama 3.1", sub: "inference" },
      { id:"pyd",    x: 650, y: 60,  w: 100, h: 36, label: "Pydantic", sub: "validation" },
      { id:"ui",     x: 650, y: 130, w: 100, h: 36, label: "Streamlit", sub: "UI" },
    ],
    edges: [
      ["papers","chunk"], ["chunk","chroma"], ["q","agent"], ["agent","chroma"],
      ["chroma","groq"], ["agent","groq"], ["groq","pyd"], ["pyd","ui"]
    ]
  },
};

function ArchDiagram({ projId, color = "var(--accent)" }) {
  const data = ARCH[projId];
  const ref = useRef(null);
  const [hot, setHot] = useState({}); // edge id -> bool
  useEffect(() => {
    if (!data) return;
    let i = 0;
    const id = setInterval(() => {
      setHot({ [i]: true });
      i = (i + 1) % data.edges.length;
    }, 700);
    return () => clearInterval(id);
  }, [data]);
  if (!data) return null;
  const W = 800, H = 220;
  const byId = Object.fromEntries(data.nodes.map(n => [n.id, n]));

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${H}`} className="arch" style={{width:"100%", height:"auto", display:"block"}}>
      <defs>
        <marker id={"ah"+projId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M0 0 L10 5 L0 10 z" fill={color} opacity="0.7"/>
        </marker>
      </defs>
      {/* edges */}
      {data.edges.map(([a,b], i) => {
        const A = byId[a], B = byId[b];
        if (!A || !B) return null;
        const x1 = A.x + A.w, y1 = A.y + A.h/2;
        const x2 = B.x,       y2 = B.y + B.h/2;
        const dx = x2 - x1;
        const cx1 = x1 + dx * 0.5, cy1 = y1;
        const cx2 = x2 - dx * 0.5, cy2 = y2;
        const d = `M${x1} ${y1} C${cx1} ${cy1} ${cx2} ${cy2} ${x2} ${y2}`;
        return (
          <g key={i}>
            <path d={d} fill="none" stroke={color} strokeOpacity="0.25" strokeWidth="1" markerEnd={`url(#ah${projId})`}/>
            {hot[i] && <circle r="3" fill={color}>
              <animateMotion dur="0.7s" path={d} repeatCount="1" />
              <animate attributeName="opacity" values="0;1;1;0" dur="0.7s" />
            </circle>}
          </g>
        );
      })}
      {/* nodes */}
      {data.nodes.map((n) => (
        <g key={n.id}>
          <rect x={n.x} y={n.y} width={n.w} height={n.h} rx="4"
            fill="var(--bg-2)" stroke={color} strokeOpacity="0.4" strokeWidth="0.8"/>
          <text x={n.x + n.w/2} y={n.y + (n.sub ? n.h/2 - 2 : n.h/2 + 3)}
            textAnchor="middle" fill="var(--fg)"
            style={{fontFamily:"var(--f-mono)", fontSize: "10px", fontWeight: 500}}>
            {n.label}
          </text>
          {n.sub && <text x={n.x + n.w/2} y={n.y + n.h/2 + 11}
            textAnchor="middle" fill="var(--fg-dim)"
            style={{fontFamily:"var(--f-mono)", fontSize: "8.5px"}}>
            {n.sub}
          </text>}
        </g>
      ))}
    </svg>
  );
}

Object.assign(window, { ArchDiagram, ARCH });
