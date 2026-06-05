// LivePlayground — interactive RAG demo. 3 visible stages: Retrieve → Rerank → Generate.
// Uses an in-page mini corpus (Ayush's project descriptions) + window.claude.complete.

const CORPUS = [
  { id: "doc01", title: "Hybrid RecSys", chunk: "End-to-end hybrid recommender at Quantum Horizon using LightFM. Combines collaborative filtering with content features. Solo-built data pipeline, training, batch scoring, and serving infra. NDCG@10 improved 34%; CTR +18%; solved cold-start with item-feature embeddings." },
  { id: "doc02", title: "Fraud Detection", chunk: "Rules + ML hybrid for in-game cheat detection (roulette and similar). Streaming session features into XGBoost classifier; rules layer kept for interpretability for the ops team. Recall 0.91, precision 0.88, alerts/day cut by 62%." },
  { id: "doc03", title: "MLOps IMDB", chunk: "Reference end-to-end MLOps repo: notebook to MLflow tracking + model registry, DVC for data versioning, GitHub Actions CI/CD, Docker, Kubernetes deployment on AWS EKS, Prometheus and Grafana monitoring on EC2. Containerized, one-click deploy." },
  { id: "doc04", title: "Stock Multi-Agent", chunk: "Multi-agent stock-analysis using CrewAI and Google Gemini. Analyst Agent and Trader Agent collaborate over 15+ financial metrics from Yahoo Finance API to produce trading strategies. Custom tools wrap PEG, Beta, ROE indicators for LLM consumption." },
  { id: "doc05", title: "RAG Research Bot", chunk: "Production RAG over curated ML research papers. LlamaIndex + ChromaDB + Groq Llama 3.1 inference. Containerized microservices: FastAPI backend, Streamlit frontend. Multi-agent CrewAI with semantic chunking and Pydantic validation for multi-turn context." },
  { id: "doc06", title: "Food Vision", chunk: "CNN image classifier on Food101 dataset. 85% accuracy beating DeepFood benchmark of 77.4%. EfficientNetB1 with Mixed Precision cut training from 3 days to 90 minutes. 40% memory reduction. Streamlit deployment with top-5 confidence scoring." },
  { id: "doc07", title: "GAN Image-to-Video", chunk: "At Arkham Archives built and deployed GAN models that generate high-quality animated videos from static input images. Designed preprocessing pipelines to enhance image quality and lift output video fidelity." },
  { id: "doc08", title: "Samarth RAG Chatbot", chunk: "At Samarth Life Sciences (freelance) engineered a custom RAG chatbot trained on proprietary pharmaceutical catalogs (critical-care drugs and injections). Enabled instant accurate retrieval of technical product specifications. Also built sales-forecasting dashboard." },
  { id: "doc09", title: "Skills · Stack", chunk: "Python, PyTorch, TensorFlow, scikit-learn, LightFM, XGBoost. NLP: BERT, HuggingFace, spaCy, LSTM. Computer vision: CNNs, GANs, YOLO, OpenCV. GenAI: LangChain, CrewAI, LlamaIndex, RAG, Pinecone, ChromaDB, Milvus. MLOps: MLflow, DVC, Docker, Kubernetes, AWS, FastAPI, GitHub Actions, Streamlit." },
  { id: "doc10", title: "About · Bio", chunk: "Ayush Dubey, AI/ML Engineer at Quantum Horizon in Dubai. 1-3 years experience. B.Tech AI/ML from Thakur College Mumbai (GPA 8.20). UAE Resident. Available for select roles Q3 2026. Specialties: LLMs, Agents, RAG, RecSys, MLOps, applied ML in production." },
];

// crude TF-style scoring -- just enough to feel like a retriever
function score(query, chunk) {
  const q = query.toLowerCase().match(/\w+/g) || [];
  const c = chunk.toLowerCase();
  const stop = new Set(["the","a","an","of","for","to","and","or","is","in","on","at","with","by","my","you","your","ayush","what","how","tell","me","about","do","does","this","that","it","i"]);
  let s = 0;
  for (const w of q) {
    if (stop.has(w) || w.length < 3) continue;
    if (c.includes(w)) s += 1;
    // partial bonus
    if (w.length > 5 && c.includes(w.slice(0, 5))) s += 0.3;
  }
  return s;
}

function retrieve(query, k = 5) {
  return CORPUS
    .map((d) => ({ ...d, score: score(query, d.title + " " + d.chunk) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

function highlightChunk(text, query) {
  const stop = new Set(["the","a","an","of","for","to","and","or","is","in","on","at","with","by","what","how","tell","about"]);
  const terms = (query.toLowerCase().match(/\w+/g) || []).filter(w => !stop.has(w) && w.length > 2);
  if (terms.length === 0) return text;
  const re = new RegExp("(" + terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "gi");
  const parts = text.split(re);
  return parts.map((p, i) => re.test(p) ? <mark key={i}>{p}</mark> : <React.Fragment key={i}>{p}</React.Fragment>);
}

const PRESETS = [
  "Tell me about Ayush's MLOps work",
  "How does the fraud-detection system work?",
  "What stack does he use for RAG?",
  "What's his recsys experience?",
];

function LivePlayground() {
  const [query, setQuery] = useState("");
  const [stage, setStage] = useState(0); // 0=idle, 1=retrieve, 2=rerank, 3=generate, 4=done
  const [retrieved, setRetrieved] = useState([]);
  const [reranked, setReranked] = useState([]);
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(null);

  const run = async (q) => {
    const Q = (q ?? query).trim();
    if (!Q || stage === 1 || stage === 2 || stage === 3) return;
    setError(null);
    setAnswer("");
    setRetrieved([]); setReranked([]);

    // Stage 1: Retrieve
    setStage(1);
    await new Promise(r => setTimeout(r, 550));
    const top = retrieve(Q, 5);
    setRetrieved(top);

    // Stage 2: Rerank (boost top by signal)
    setStage(2);
    await new Promise(r => setTimeout(r, 650));
    const rer = [...top].sort((a, b) => b.score - a.score).slice(0, 3);
    setReranked(rer);

    // Stage 3: Generate via Claude
    setStage(3);
    try {
      const context = rer.map((r, i) => `[${i+1}] ${r.title}: ${r.chunk}`).join("\n\n");
      const prompt = `You are demonstrating a Retrieval-Augmented Generation pipeline on Ayush Dubey's portfolio. Answer the user's question using ONLY the retrieved context below. Be concise (2-4 sentences, plain text, no markdown). Cite sources inline as [1], [2], [3] matching the bracketed numbers in the context.

RETRIEVED CONTEXT:
${context}

USER QUESTION: ${Q}

ANSWER (with [n] citations):`;
      const reply = await window.claude.complete(prompt);
      setAnswer(reply.trim());
      setStage(4);
    } catch (e) {
      setError(String(e?.message || e));
      setStage(0);
    }
  };

  const busy = stage > 0 && stage < 4;

  return (
    <section id="playground" className="sec playground" data-screen-label="LivePlayground">
      <style>{`
        .pg-card{ background: var(--bg-1); border:1px solid var(--line);
          border-radius: var(--r-md); overflow: hidden;
          box-shadow: 0 30px 80px -20px oklch(0.05 0.01 250 / .6)}
        .pg-hd{ display:flex; align-items:center; gap:10px; padding: 12px 18px;
          border-bottom: 1px solid var(--line-soft); font-family: var(--f-mono); font-size: 11px;
          color: var(--fg-mute) }
        .pg-hd .tl{ display:flex; gap:6px }
        .pg-hd .tl i{ width:9px; height:9px; border-radius:50%; background: oklch(0.3 0.014 250) }
        .pg-hd .rt{ margin-left:auto; color: var(--accent); font-size: 10px }
        .pg-body{ padding: 24px; display: grid; gap: 18px }
        .pg-q{ display:flex; gap: 10px; align-items: center; padding: 14px;
          background: var(--bg); border:1px solid var(--line-soft); border-radius: var(--r-sm);
          font-family: var(--f-mono)}
        .pg-q .pre{ color: var(--accent); flex-shrink:0 }
        .pg-q input{ flex:1; background:transparent; border:0; outline:none; color: var(--fg);
          font-family: var(--f-mono); font-size: 13.5px}
        .pg-q button{ appearance:none; background: var(--accent); color: #0a0a0a; border:0;
          padding: 8px 14px; font-family: var(--f-mono); font-size: 11px; font-weight: 600;
          text-transform: uppercase; letter-spacing: 0.06em; border-radius: var(--r-sm);
          cursor: default; transition: box-shadow .15s}
        .pg-q button:hover:not(:disabled){ box-shadow: 0 0 0 3px var(--accent-soft)}
        .pg-q button:disabled{ opacity: .4 }
        .pg-presets{ display:flex; gap:6px; flex-wrap:wrap }
        .pg-presets button{ appearance:none; border:1px solid var(--line-soft);
          background: transparent; color: var(--fg-mute);
          padding: 4px 10px; border-radius: 999px;
          font-family: var(--f-mono); font-size: 10.5px; cursor: default; transition: all .15s }
        .pg-presets button:hover{ color: var(--accent); border-color: var(--accent); background: var(--accent-soft) }

        .pg-pipe{ display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 0;
          position: relative; padding: 4px 0}
        @media (max-width: 900px){ .pg-pipe{grid-template-columns: 1fr; gap: 12px} }
        .pg-stage{ position: relative; padding: 14px 16px; min-height: 220px;
          background: var(--bg); border: 1px solid var(--line-soft);
          border-radius: var(--r-sm); transition: all .25s;
          display: flex; flex-direction: column; gap: 10px}
        .pg-stage + .pg-stage{ margin-left: 12px }
        @media (max-width: 900px){ .pg-stage + .pg-stage{ margin-left: 0 } }
        .pg-stage.active{ border-color: var(--accent);
          box-shadow: 0 0 0 1px var(--accent-soft), 0 0 24px var(--accent-glow) }
        .pg-stage.done{ border-color: var(--accent); opacity: .9 }
        .pg-stage-h{ display:flex; align-items:center; gap: 8px;
          font-family: var(--f-mono); font-size: 10.5px;
          color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.08em;
          padding-bottom: 8px; border-bottom: 1px solid var(--line-soft)}
        .pg-stage-h .n{ color: var(--accent); font-weight: 600 }
        .pg-stage-h .pulse{ width: 6px; height: 6px; border-radius: 50%; background: var(--accent);
          box-shadow: 0 0 8px var(--accent-glow); animation: pulse 1.4s ease-in-out infinite }
        .pg-stage-h .check{ color: var(--accent); margin-left: auto }
        .pg-stage-h .pending{ margin-left: auto; color: var(--fg-dim) }

        .pg-chunk{ font-family: var(--f-mono); font-size: 11px; padding: 8px 10px;
          background: oklch(0.105 0.012 250 / .6); border-left: 2px solid var(--line);
          border-radius: 2px; animation: fadeIn .25s ease-out;
          line-height: 1.45; color: var(--fg-mute) }
        .pg-chunk.boost{ border-left-color: var(--accent); color: var(--fg) }
        .pg-chunk .ttl{ color: var(--accent); font-weight: 500; display:block; margin-bottom: 3px }
        .pg-chunk .sc{ color: var(--fg-dim); font-size: 10px; float: right }
        .pg-chunk mark{ background: var(--accent-soft); color: var(--accent); padding: 0 1px;
          border-radius: 2px }
        .pg-chunk.drop{ animation: drop .35s ease-out both; opacity: .25 }
        @keyframes drop{ to{ transform: translateX(-8px); opacity: .15 } }
        @keyframes fadeIn{ from{ opacity: 0; transform: translateY(4px)} }

        .pg-ans{ font-family: var(--f-body); font-size: 14.5px; line-height: 1.65;
          color: var(--fg); padding: 8px 4px; white-space: pre-wrap }
        .pg-ans .cite{ display:inline-block; padding: 1px 5px; margin: 0 1px;
          background: var(--accent-soft); color: var(--accent);
          font-family: var(--f-mono); font-size: 10px; border-radius: 3px;
          vertical-align: 1px}

        .pg-empty{ color: var(--fg-dim); font-family: var(--f-mono); font-size: 11px;
          padding: 20px 0; text-align: center; flex: 1; display: flex;
          align-items: center; justify-content: center }

        .pg-foot{ font-family: var(--f-mono); font-size: 10.5px; color: var(--fg-dim);
          display:flex; gap: 16px; flex-wrap: wrap; padding-top: 10px;
          border-top: 1px solid var(--line-soft) }
        .pg-foot .meta{ color: var(--fg-mute) }
        .pg-foot .meta b{ color: var(--accent) }
      `}</style>

      <div className="wrap">
        <SectionHead num="02 // live demo"
          title="Try the RAG pipeline"
          meta="// retrieve · rerank · generate" />

        <div className="pg-card">
          <div className="pg-hd">
            <div className="tl"><i style={{background:"oklch(0.65 0.16 25 / .8)"}}/><i style={{background:"oklch(0.78 0.15 75 / .8)"}}/><i style={{background:"oklch(0.78 0.16 145 / .8)"}}/></div>
            <span>rag-playground · corpus=portfolio · top_k=5 → rerank=3 → llm</span>
            <span className="rt">▸ live</span>
          </div>

          <div className="pg-body">
            <div className="pg-q">
              <span className="pre">{">"}</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && run()}
                placeholder="ask anything about Ayush's work — e.g. how does the fraud detection system work?"
                disabled={busy} />
              <button onClick={() => run()} disabled={busy || !query.trim()}>
                {busy ? "running..." : "run pipeline"} <Icon name="arrow" size={12}/>
              </button>
            </div>

            <div className="pg-presets">
              <span style={{color:"var(--fg-dim)", fontSize:10.5, fontFamily:"var(--f-mono)", alignSelf:"center", marginRight:4}}>// try:</span>
              {PRESETS.map((p, i) => (
                <button key={i} onClick={() => { setQuery(p); run(p); }} disabled={busy}>{p}</button>
              ))}
            </div>

            <div className="pg-pipe">
              {/* Stage 1: Retrieve */}
              <div className={"pg-stage " + (stage === 1 ? "active" : stage > 1 ? "done" : "")}>
                <div className="pg-stage-h">
                  <span className="n">01</span> <span>Retrieve</span>
                  {stage === 1 ? <span className="pulse"/> :
                    stage > 1 ? <span className="check">✓</span> : <span className="pending">○</span>}
                </div>
                {retrieved.length === 0 && stage < 1 && <div className="pg-empty">// awaiting query</div>}
                {stage === 1 && <div className="pg-empty">// scanning corpus<span className="dots"><span>·</span><span>·</span><span>·</span></span></div>}
                {retrieved.map((r, i) => {
                  const dropped = stage >= 2 && !reranked.find(x => x.id === r.id);
                  return (
                    <div key={r.id} className={"pg-chunk " + (dropped ? "drop" : "")}>
                      <span className="sc">s={r.score.toFixed(1)}</span>
                      <span className="ttl">{r.title}</span>
                      {highlightChunk(r.chunk.slice(0, 130) + "…", query)}
                    </div>
                  );
                })}
              </div>

              {/* Stage 2: Rerank */}
              <div className={"pg-stage " + (stage === 2 ? "active" : stage > 2 ? "done" : "")}>
                <div className="pg-stage-h">
                  <span className="n">02</span> <span>Rerank</span>
                  {stage === 2 ? <span className="pulse"/> :
                    stage > 2 ? <span className="check">✓</span> : <span className="pending">○</span>}
                </div>
                {stage < 2 && <div className="pg-empty">// waits on retrieve</div>}
                {stage === 2 && <div className="pg-empty">// scoring relevance<span className="dots"><span>·</span><span>·</span><span>·</span></span></div>}
                {stage > 2 && reranked.map((r, i) => (
                  <div key={r.id} className="pg-chunk boost">
                    <span className="sc">#{i+1}</span>
                    <span className="ttl">[{i+1}] {r.title}</span>
                    {highlightChunk(r.chunk.slice(0, 130) + "…", query)}
                  </div>
                ))}
              </div>

              {/* Stage 3: Generate */}
              <div className={"pg-stage " + (stage === 3 ? "active" : stage > 3 ? "done" : "")}>
                <div className="pg-stage-h">
                  <span className="n">03</span> <span>Generate</span>
                  {stage === 3 ? <span className="pulse"/> :
                    stage > 3 ? <span className="check">✓</span> : <span className="pending">○</span>}
                </div>
                {stage < 3 && <div className="pg-empty">// waits on rerank</div>}
                {stage === 3 && <div className="pg-empty">model thinking<span className="dots"><span>·</span><span>·</span><span>·</span></span></div>}
                {stage === 4 && (
                  <div className="pg-ans">
                    {answer.split(/(\[\d+\])/g).map((part, i) => {
                      const m = part.match(/^\[(\d+)\]$/);
                      return m ? <span key={i} className="cite">{part}</span> : <React.Fragment key={i}>{part}</React.Fragment>;
                    })}
                  </div>
                )}
                {error && <div className="pg-empty" style={{color:"oklch(0.72 0.18 25)"}}>{"// error: " + error}</div>}
              </div>
            </div>

            <div className="pg-foot">
              <span className="meta">embedding: <b>tf-keyword</b> (in-page)</span>
              <span className="meta">reranker: <b>score-sort</b></span>
              <span className="meta">llm: <b>claude-haiku-4.5</b></span>
              <span className="meta">corpus: <b>{CORPUS.length} chunks</b></span>
              <span className="meta" style={{marginLeft:"auto", color:"var(--fg-dim)"}}>
                // real RAG, real retrieval, real LLM — running in your browser
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { LivePlayground });
