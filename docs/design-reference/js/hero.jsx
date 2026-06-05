// Hero — name, role, status, social, + interactive Chat with Ayush.AI (with actions)

function Hero({ density, palette }) {
  return (
    <header id="top" className="hero">
      <style>{`
        .hero{position:relative; min-height: calc(100vh - 80px); padding: 80px 0 64px;
          display:flex; flex-direction:column; justify-content:center;
          border-bottom: 1px solid var(--line-soft); overflow:hidden}
        .hero-grid{ position:relative; display:grid;
          grid-template-columns: minmax(0,1.05fr) minmax(0,0.95fr); gap: 56px;
          align-items: center; z-index:2}
        @media (max-width:980px){ .hero-grid{grid-template-columns:1fr; gap:40px} }
        .hero-bg{ position:absolute; inset: -60px -60px -60px -60px; z-index:1; opacity:.95 }
        .hero-meta{ display:flex; flex-direction:column; gap:18px; max-width: 640px }
        .hero-meta .row1{ display:flex; gap:10px; align-items:center; flex-wrap:wrap }
        .hero-name{ position:relative; cursor: default }
        .hero-name .first{display:block}
        .hero-name .second{display:block; color: var(--fg-mute)}
        .hero-name .second:hover{ color: var(--accent); text-shadow: 0 0 30px var(--accent-glow) }
        .hero-name .embed{ position:absolute; left:0; top:100%; margin-top:10px;
          font-family: var(--f-mono); font-size: 10.5px;
          color: var(--fg-dim); opacity:0; transition: opacity .2s; pointer-events:none;
          white-space:nowrap }
        .hero-name:hover .embed{ opacity:1 }
        .hero-tag{ font-size: 16px; color: var(--fg-mute); max-width: 540px; line-height: 1.6}
        .hero-tag b{ color: var(--fg); font-weight:500 }
        .hero-cta{ display:flex; gap:10px; flex-wrap:wrap; margin-top: 8px }
        .hero-socials{ display:flex; gap:14px; margin-top: 16px;
          font-family: var(--f-mono); font-size: 12px; color: var(--fg-mute);
          padding-top: 16px; border-top: 1px solid var(--line-soft); max-width:540px;
          flex-wrap:wrap}
        .hero-socials a{ display:inline-flex; align-items:center; gap:6px }

        .hero-chat{ position:relative; z-index:3 }
        .chatframe{ background: oklch(0.105 0.012 250 / 0.88);
          border:1px solid var(--line); border-radius: var(--r-md);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          font-family: var(--f-mono); display:flex; flex-direction:column;
          height: 480px; max-height: 62vh; overflow: hidden;
          box-shadow: 0 30px 80px -20px oklch(0.05 0.01 250 / .6),
                      0 0 0 1px oklch(0.86 0.18 145 / 0.04),
                      inset 0 1px 0 oklch(1 0 0 / .03)}
        .chat-hd{ display:flex; align-items:center; gap:10px;
          padding: 10px 14px; border-bottom: 1px solid var(--line-soft);
          font-size: 11px; color: var(--fg-mute) }
        .chat-hd .tl{ display:flex; gap:6px }
        .chat-hd .tl span{ width:9px; height:9px; border-radius:50%;
          background: oklch(0.3 0.014 250) }
        .chat-hd .tl span:nth-child(1){ background: oklch(0.65 0.16 25 / .8)}
        .chat-hd .tl span:nth-child(2){ background: oklch(0.78 0.15 75 / .8)}
        .chat-hd .tl span:nth-child(3){ background: oklch(0.78 0.16 145 / .8)}
        .chat-hd .rt{ margin-left:auto; color: var(--accent); font-size:10px }

        .chat-body{ flex:1; overflow-y:auto; padding: 16px 16px 4px;
          font-size: 12.5px; line-height: 1.55;
          scrollbar-width: thin; scrollbar-color: var(--line) transparent }
        .chat-body::-webkit-scrollbar{ width: 6px }
        .chat-body::-webkit-scrollbar-thumb{ background: var(--line); border-radius: 3px }
        .msg{ margin-bottom: 14px; display:flex; gap:10px; align-items:flex-start }
        .msg .role{ flex-shrink:0; width: 22px; height: 22px; border-radius: 4px;
          display:grid; place-items:center; font-size:10px; font-weight:600;
          font-family: var(--f-mono); letter-spacing:0 }
        .msg.user .role{ background: oklch(0.25 0.01 250); color: var(--fg) }
        .msg.bot .role{ background: var(--accent-soft); color: var(--accent);
          border: 1px solid var(--accent) }
        .msg .content{ flex:1; color: var(--fg); white-space: pre-wrap; word-wrap: break-word; min-width: 0 }
        .msg .meta{ color: var(--fg-dim); font-size: 10.5px; margin-bottom: 4px;
          display:flex; gap:8px; align-items:baseline}
        .msg .meta b{ color: var(--accent); font-weight:500 }
        .msg .actions{ margin-top: 10px; display:flex; flex-wrap:wrap; gap: 6px }
        .msg .actions button{ appearance:none; background: var(--accent-soft);
          border: 1px solid var(--accent); color: var(--accent); cursor: default;
          font-family: var(--f-mono); font-size: 10.5px; padding: 5px 10px;
          border-radius: 999px; transition: all .15s; display:inline-flex; align-items:center; gap: 6px}
        .msg .actions button:hover{ background: var(--accent); color: #0a0a0a }
        .caret{ display:inline-block; width:8px; background: var(--accent);
          margin-left: 2px; animation: blink 1s steps(1) infinite; color: transparent }

        .chat-input{ display:flex; align-items:center; gap:10px;
          padding: 10px 14px; border-top: 1px solid var(--line-soft);
          background: oklch(0.13 0.012 250 / 0.6) }
        .chat-input .pre{ color: var(--accent); font-size: 12px }
        .chat-input input{ flex:1; background: transparent; border: 0;
          outline: none; color: var(--fg); font-family: var(--f-mono);
          font-size: 12.5px; padding: 4px 0 }
        .chat-input button{ appearance:none; border:1px solid var(--line);
          background: transparent; color: var(--fg-mute); font-family: var(--f-mono);
          font-size: 10.5px; padding: 4px 10px; border-radius: 4px; cursor:default;
          text-transform: uppercase; letter-spacing:0.05em}
        .chat-input button:hover:not(:disabled){ color: var(--accent); border-color: var(--accent)}
        .chat-input button:disabled{ opacity:.4 }

        .quick{ display:flex; flex-wrap:wrap; gap:6px; margin-bottom:10px}
        .quick button{ appearance:none; border:1px solid var(--line-soft);
          background:transparent; color: var(--fg-mute);
          font-family: var(--f-mono); font-size: 10.5px;
          padding: 4px 9px; border-radius: 999px; cursor: default;
          transition: all .15s }
        .quick button:hover{ color: var(--accent); border-color: var(--accent); background: var(--accent-soft)}
      `}</style>
      <div className="hero-bg">
        <LatentCanvas density={density} palette={palette} />
      </div>
      <div className="wrap">
        <div className="hero-grid">
          <div className="hero-meta">
            <div className="row1">
              <StatusPill label="Available for select roles · Q3 2026" />
              <Chip>v2.5.1</Chip>
              <Chip>DXB · UTC+4</Chip>
            </div>
            <h1 className="hero-name">
              <span className="first">Ayush Dubey.</span>
              <span className="second glow">/* the AI/ML engineer */</span>
              <span className="embed mono">
                embedding[2,768] = [0.247, -0.812, 0.954, 0.103, ..., 0.617]
              </span>
            </h1>
            <p className="hero-tag">
              I build <b>LLM agents, recommender systems, and end-to-end ML pipelines</b> that
              survive contact with production. Currently architecting recsys & fraud-detection
              at <b>Quantum Horizon</b> in Dubai — turning game-data into predictions, and
              predictions into product.
            </p>
            <div className="hero-cta">
              <a className="btn primary" href="#projects">View work <Icon name="arrow" /></a>
              <a className="btn" href="#playground">Try the RAG demo <Icon name="sparkle" /></a>
              <a className="btn" href="resume.pdf" download>resume.pdf <Icon name="download" /></a>
            </div>
            <div className="hero-socials">
              <a className="link" href="https://github.com/MLayush-dubey" target="_blank" rel="noreferrer">
                <Icon name="github" size={13}/> github/MLayush-dubey
              </a>
              <a className="link" href="https://www.linkedin.com/in/ayush-dubey-69860522a/" target="_blank" rel="noreferrer">
                <Icon name="linkedin" size={13}/> linkedin/ayush-dubey
              </a>
              <a className="link" href="mailto:aadubey1106@gmail.com">
                <Icon name="mail" size={13}/> aadubey1106@gmail.com
              </a>
            </div>
          </div>

          <div className="hero-chat">
            <ChatAgent />
          </div>
        </div>
      </div>
    </header>
  );
}

// ============ Chat Agent (uses window.claude.complete + structured actions) ============
const SYSTEM_PERSONA = `You are "Ayush.AI" — a friendly, slightly playful assistant that speaks on behalf of Ayush Dubey, an AI/ML Engineer at Quantum Horizon in Dubai (1-3 yrs experience).

About Ayush (use ONLY these facts; be honest if you don't know):
- Location: Dubai, UAE (UAE Resident). Available for select roles Q3 2026.
- Current: AI/ML Engineer @ Quantum Horizon (gaming product).
- Education: B.Tech AI/ML, Thakur College of Engineering, Mumbai (GPA 8.20).
- Past roles: Samarth Life Sciences (Fullstack AI), Bhairav Builders (AI Consultant), Arkham Archives (AI Developer, GANs), IntellAI (Data Scientist).
- Specialties: LLMs / GenAI / Agents, RecSys, MLOps, CV, NLP, Applied ML.
- Featured projects:
  01) Hybrid RecSys (LightFM, solo) — game recs in prod
  02) Fraud Detection (ongoing) — rules + ML for in-game cheats
  03) MLOps IMDB — full stack: MLflow, DVC, GH Actions, Docker, K8s/EKS, Prometheus, Grafana, AWS
  04) Stock Multi-Agent — CrewAI + Gemini financial agents
  05) RAG Research-bot — LlamaIndex + Chroma + Groq Llama 3.1
- Stack: Python, PyTorch, TensorFlow, sklearn, LightFM, XGBoost, LangChain, CrewAI, LlamaIndex, RAG, ChromaDB, Pinecone, FastAPI, MLflow, DVC, Docker, K8s, AWS.
- Contact: aadubey1106@gmail.com · github.com/MLayush-dubey · linkedin.com/in/ayush-dubey-69860522a/

ACTIONS — you can include AT MOST ONE action tag at the very end of your reply (after the text), in this exact format. The action is what the UI will render as a button below your message:
  <action type="scroll" target="#projects" label="Show projects">
  <action type="scroll" target="#experience" label="See experience">
  <action type="scroll" target="#skills" label="View stack graph">
  <action type="scroll" target="#playground" label="Try the RAG demo">
  <action type="scroll" target="#contact" label="Go to contact form">
  <action type="open" target="https://github.com/MLayush-dubey" label="Open GitHub">
  <action type="open" target="https://www.linkedin.com/in/ayush-dubey-69860522a/" label="Open LinkedIn">
  <action type="expand" target="01" label="Expand RecSys architecture">  (target is project id 01-05)

Voice: Concise, technical but human. 1-3 short paragraphs OR a short bullet list. Never invent facts. Reply in plain text (no markdown). Always pick the action that best matches the user's intent — use scroll/expand to be helpful.`;

function ChatAgent() {
  const [msgs, setMsgs] = useState([
    { role: "bot", text: "Hey — I'm Ayush.AI. Ask me anything about Ayush's work — I can also scroll you to relevant sections.", action: null, ts: Date.now() },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [msgs, busy]);

  const parseAction = (text) => {
    const m = text.match(/<action\s+type="(scroll|open|expand)"\s+target="([^"]+)"\s+label="([^"]+)"\s*\/?>/i);
    if (!m) return { text, action: null };
    return {
      text: text.replace(m[0], "").trim(),
      action: { type: m[1], target: m[2], label: m[3] },
    };
  };

  const runAction = (a) => {
    if (!a) return;
    if (a.type === "scroll") {
      const el = document.querySelector(a.target);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (a.type === "open") {
      window.open(a.target, "_blank");
    } else if (a.type === "expand") {
      const el = document.querySelector(`#project-${a.target}`);
      window.dispatchEvent(new CustomEvent("portfolio:expand-project", { detail: { id: a.target } }));
      setTimeout(() => el && el.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  };

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || busy) return;
    setInput("");

    // local easter-egg commands
    const cmd = q.toLowerCase();
    if (cmd === "whoami") {
      setMsgs((m) => [...m, { role: "user", text: q }, { role: "bot", text: "Ayush Dubey — AI/ML Engineer @ Quantum Horizon (Dubai). 1-3 yrs experience.\nSpecialties: LLMs · Agents · RecSys · MLOps. Try `ls` next.", action: { type:"scroll", target:"#about", label:"See full bio" }, ts: Date.now() }]);
      return;
    }
    if (cmd === "ls projects" || cmd === "ls") {
      setMsgs((m) => [...m, { role: "user", text: q }, { role: "bot", text: "01_hybrid-recsys/\n02_fraud-detection/\n03_mlops-imdb/\n04_stock-multi-agent/\n05_rag-agentic-chatbot/\n.hidden_easter_egg/", action: { type:"scroll", target:"#projects", label:"Open projects" }, ts: Date.now() }]);
      return;
    }
    if (cmd === "help") {
      setMsgs((m) => [...m, { role: "user", text: q }, { role: "bot", text: "commands:\n  whoami        — who runs this site\n  ls            — list projects\n  contact       — how to reach me\n  clear         — clear chat\n\nor ask anything in plain english.", action: null, ts: Date.now() }]);
      return;
    }
    if (cmd === "clear") { setMsgs([]); return; }
    if (cmd === "contact") {
      setMsgs((m) => [...m, { role: "user", text: q }, { role: "bot", text: "DM on LinkedIn or use the contact form below.", action: { type:"scroll", target:"#contact", label:"Open contact form" }, ts: Date.now() }]);
      return;
    }

    setMsgs((m) => [...m, { role: "user", text: q }]);
    setBusy(true);
    try {
      const history = msgs
        .filter(m => m.role === "user" || m.role === "bot")
        .map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));
      const messages = [
        ...history,
        { role: "user", content: q },
      ];
      const reply = await window.claude.complete({
        messages: [
          { role: "user", content: SYSTEM_PERSONA + "\n\n— Conversation begins —" },
          ...messages,
        ],
      });
      const { text: cleanText, action } = parseAction(reply);
      setMsgs((m) => [...m, { role: "bot", text: cleanText, action, ts: Date.now() }]);
    } catch (e) {
      setMsgs((m) => [...m, { role: "bot", text: "(connection to model dropped. retry?)", action: null, ts: Date.now() }]);
    } finally {
      setBusy(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const quick = [
    "What's Ayush working on?",
    "Walk me through the MLOps project",
    "Why hire him?",
    "ls projects",
  ];

  return (
    <div className="chatframe">
      <div className="chat-hd">
        <div className="tl"><span/><span/><span/></div>
        <span>ayush-agent · llm + scroll-actions</span>
        <span className="rt">▸ online</span>
      </div>
      <div className="chat-body" ref={bodyRef}>
        <div className="quick">
          {quick.map((q,i) => (
            <button key={i} onClick={() => send(q)} disabled={busy}>{q}</button>
          ))}
        </div>
        {msgs.map((m,i) => (
          <div key={i} className={"msg " + m.role}>
            <div className="role">{m.role === "user" ? "U" : "AI"}</div>
            <div style={{flex:1, minWidth:0}}>
              <div className="meta"><b>{m.role === "user" ? "you" : "ayush.ai"}</b>
                <span style={{color:'var(--fg-dim)'}}>{m.role === "bot" ? "// model=claude-haiku-4.5" : ""}</span>
              </div>
              <div className="content">{m.text}</div>
              {m.action && (
                <div className="actions">
                  <button onClick={() => runAction(m.action)}>
                    <Icon name={m.action.type === "open" ? "external" : "arrow"} size={11}/>
                    {m.action.label}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        {busy && (
          <div className="msg bot">
            <div className="role">AI</div>
            <div>
              <div className="meta"><b>ayush.ai</b><span style={{color:'var(--fg-dim)'}}>// thinking</span></div>
              <div className="content dots"><span>·</span><span>·</span><span>·</span></div>
            </div>
          </div>
        )}
      </div>
      <div className="chat-input">
        <span className="pre">{busy ? "○" : ">"}</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={busy ? "thinking..." : "ask me anything — i can scroll you to sections"}
          disabled={busy}
        />
        <button onClick={() => send()} disabled={busy || !input.trim()}>
          <Icon name="send" size={11}/> send
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { Hero, ChatAgent });
