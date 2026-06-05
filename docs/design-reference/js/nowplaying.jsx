// NowPlaying — live status strip below hero. Mimics a terminal status line that "ticks".

const STATUS_FEED = [
  { lbl: "currently reading", val: "Attention Is All You Need (re-read)", tag: "paper" },
  { lbl: "shipping",           val: "fraud-detect v0.4 — feature pipelines", tag: "wip" },
  { lbl: "last commit",        val: "feat: add session-window aggregations", tag: "git" },
  { lbl: "model in prod",      val: "hybrid-recsys-v2.3 · 4.1M users", tag: "prod" },
  { lbl: "listening",          val: "Lo-fi · Tycho radio", tag: "audio" },
  { lbl: "now learning",       val: "AWS MLA-C01 · NCA-GENL", tag: "study" },
  { lbl: "open to",            val: "Senior IC / Staff AI roles · Q3 2026", tag: "hire" },
  { lbl: "weekend hack",       val: "agentic eval harness w/ DSPy", tag: "fun" },
];

function NowPlaying() {
  const [i, setI] = useState(0);
  const [hover, setHover] = useState(false);
  useEffect(() => {
    if (hover) return;
    const id = setInterval(() => setI((x) => (x + 1) % STATUS_FEED.length), 3400);
    return () => clearInterval(id);
  }, [hover]);

  return (
    <div className="np-strip" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <style>{`
        .np-strip{ border-top: 1px solid var(--line-soft); border-bottom: 1px solid var(--line-soft);
          background: oklch(0.105 0.012 250 / 0.6); padding: 14px 0;
          font-family: var(--f-mono); font-size: 12px; overflow:hidden}
        .np-row{ max-width:1320px; margin:0 auto; padding: 0 40px;
          display:flex; gap: 18px; align-items: center; flex-wrap: wrap }
        @media (max-width:720px){ .np-row{padding:0 20px; font-size: 11px} }
        .np-lead{ color: var(--accent); letter-spacing: 0.08em; flex-shrink: 0 }
        .np-content{ flex:1; min-width: 0; display:flex; gap: 10px; align-items:baseline;
          overflow:hidden; white-space: nowrap}
        .np-lbl{ color: var(--fg-dim); text-transform: uppercase; letter-spacing: 0.05em;
          font-size: 10.5px; flex-shrink:0}
        .np-val{ color: var(--fg); text-overflow: ellipsis; overflow:hidden;
          animation: tickIn .35s ease-out }
        @keyframes tickIn{ from{ opacity:0; transform: translateY(4px) } }
        .np-tag{ margin-left:auto; padding: 2px 8px; border:1px solid var(--line);
          color: var(--accent-2); border-radius: 999px; font-size: 10px;
          letter-spacing: 0.06em; text-transform: uppercase; flex-shrink: 0}
        .np-dots{ display:flex; gap: 3px; flex-shrink: 0; margin-left: 8px }
        .np-dots i{ width: 4px; height: 4px; border-radius: 50%; background: var(--line);
          transition: background .2s }
        .np-dots i.on{ background: var(--accent); box-shadow: 0 0 4px var(--accent-glow)}
      `}</style>
      <div className="np-row">
        <span className="np-lead">{">"} live</span>
        <div className="np-content" key={i}>
          <span className="np-lbl">// {STATUS_FEED[i].lbl}</span>
          <span className="np-val">{STATUS_FEED[i].val}</span>
        </div>
        <span className="np-tag">{STATUS_FEED[i].tag}</span>
        <span className="np-dots">
          {STATUS_FEED.map((_, j) => <i key={j} className={j === i ? "on" : ""}/>)}
        </span>
      </div>
    </div>
  );
}

Object.assign(window, { NowPlaying });
