// About + skill-weight bars

function About() {
  const skills = [
    { label: "LLMs / Agents / RAG",          w: 0.94 },
    { label: "Recommender systems (LightFM)",w: 0.92 },
    { label: "MLOps (MLflow, DVC, K8s)",     w: 0.90 },
    { label: "Applied ML / Production",      w: 0.88 },
    { label: "Computer Vision",              w: 0.74 },
    { label: "Classical NLP",                w: 0.71 },
  ];
  return (
    <section id="about" className="sec about" data-screen-label="About">
      <style>{`
        .about-grid{display:grid; grid-template-columns: minmax(0,1.1fr) minmax(0,0.9fr);
          gap: 64px; align-items:start}
        @media (max-width: 900px){ .about-grid{grid-template-columns:1fr; gap:32px} }
        .bio p{ font-size: 17px; line-height: 1.7; color: var(--fg);
          margin-bottom: 18px; max-width: 60ch }
        .bio p b{ color: var(--accent); font-weight: 500 }
        .bio .quote{ border-left: 2px solid var(--accent); padding-left: 16px;
          color: var(--fg-mute); font-style: italic; font-size: 15px;
          margin: 24px 0; max-width: 56ch }

        .weights{ background: var(--bg-1); border: 1px solid var(--line-soft);
          border-radius: var(--r-md); padding: 22px;
          font-family: var(--f-mono); font-size: 12px}
        .weights .hd{ display:flex; justify-content:space-between; align-items:center;
          font-size: 10.5px; color: var(--fg-dim); text-transform: uppercase;
          letter-spacing: 0.08em; margin-bottom: 18px;
          padding-bottom: 12px; border-bottom: 1px solid var(--line-soft)}
        .weights .hd b{ color: var(--accent) }
        .wt{ display:grid; grid-template-columns: 1fr auto; gap: 6px 12px;
          margin-bottom: 12px; align-items: baseline }
        .wt-bar{ grid-column: 1 / -1; height: 4px; background: var(--bg-2);
          border-radius: 2px; overflow:hidden; position: relative }
        .wt-bar > i{ position:absolute; left:0; top:0; bottom:0;
          background: linear-gradient(90deg, var(--accent), var(--accent-2));
          box-shadow: 0 0 12px var(--accent-glow);
          animation: weightFill 1.4s cubic-bezier(.2,.8,.2,1) both }
        @keyframes weightFill{ from{ width: 0 } }
        .wt-lbl{ color: var(--fg) }
        .wt-val{ color: var(--accent); font-variant-numeric: tabular-nums; font-size: 11px }
      `}</style>

      <div className="wrap">
        <SectionHead num="01 // about" title="A small intro" meta="// 6 weights · last trained: today" />

        <div className="about-grid">
          <div className="bio">
            <p>
              Hi — I'm Ayush. I'm an <b>AI/ML Engineer</b> based in Dubai, currently building
              recommender systems and fraud-detection at <b>Quantum Horizon</b>. I came in by
              owning a hybrid recsys pipeline end-to-end (data → model → deploy → monitor), and
              I've been falling deeper down the agentic / RAG / MLOps rabbit hole ever since.
            </p>
            <p>
              I like ML projects that <b>actually ship</b>. The fun part isn't the notebook — it's
              the slow grind of containers, model registries, drift dashboards, and the 3am alert
              that the pipeline silently NaN'd. So a lot of my time is spent at the seams between
              research and infra.
            </p>
            <p className="quote">
              "I'd rather ship a 0.83 F1 in production than print a 0.97 in a notebook nobody runs."
            </p>
            <p className="dim" style={{fontSize:14}}>
              When not training models I'm tinkering with multi-agent orchestration, reading
              papers, or losing money to my own stock-market agent ;)
            </p>
          </div>

          <div className="weights">
            <div className="hd">
              <span>// self_assessment.weights</span>
              <b>norm=L2</b>
            </div>
            {skills.map((s, i) => (
              <div className="wt" key={i} style={{ animationDelay: (i*0.05) + "s" }}>
                <span className="wt-lbl">{s.label}</span>
                <span className="wt-val">{s.w.toFixed(2)}</span>
                <span className="wt-bar"><i style={{ width: (s.w*100).toFixed(0) + "%", animationDelay: (i*0.08 + 0.2) + "s" }}/></span>
              </div>
            ))}
            <div style={{marginTop:18, paddingTop:14, borderTop:"1px solid var(--line-soft)", color:"var(--fg-dim)", fontSize:10.5, display:"flex", justifyContent:"space-between"}}>
              <span>// confidence intervals omitted</span>
              <span>n=18mo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { About });
