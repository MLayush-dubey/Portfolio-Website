// Cmd+K Command Palette + Konami code easter egg

function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inputRef = useRef(null);

  const commands = useMemo(() => [
    { id: "nav-about",   label: "Go to · About",       hint: "section 01", run: () => location.hash = "#about" },
    { id: "nav-play",    label: "Run · Live RAG demo", hint: "section 02", run: () => location.hash = "#playground" },
    { id: "nav-proj",    label: "Go to · Projects",    hint: "section 03", run: () => location.hash = "#projects" },
    { id: "nav-exp",     label: "Go to · Experience",  hint: "section 04", run: () => location.hash = "#experience" },
    { id: "nav-crt",     label: "Go to · Certifications", hint: "section 05", run: () => location.hash = "#certs" },
    { id: "nav-skl",     label: "Go to · Skills",      hint: "section 06", run: () => location.hash = "#skills" },
    { id: "nav-cnt",     label: "Go to · Contact",     hint: "section 07", run: () => location.hash = "#contact" },
    { id: "github",      label: "Open · GitHub",       hint: "MLayush-dubey", run: () => window.open("https://github.com/MLayush-dubey", "_blank") },
    { id: "linkedin",    label: "Open · LinkedIn",     hint: "ayush-dubey", run: () => window.open("https://www.linkedin.com/in/ayush-dubey-69860522a/", "_blank") },
    { id: "email",       label: "Send · Email",        hint: "aadubey1106@gmail.com", run: () => window.location.href = "mailto:aadubey1106@gmail.com" },
    { id: "resume",      label: "Download · resume.pdf", hint: "pdf", run: () => window.open("resume.pdf", "_blank") },
    { id: "scan",        label: "Toggle · Scanlines",  hint: "crt vibes", run: () => document.body.classList.toggle("scanlines") },
    { id: "konami",      label: "🎮 Activate · Neural mode", hint: "secret", run: () => document.body.classList.toggle("neural-mode") },
    { id: "console",     label: "Tip · Open the browser console", hint: "press F12", run: () => alert("Open DevTools (F12) and look around — there's a message waiting.") },
  ], []);

  const filtered = commands.filter(c =>
    c.label.toLowerCase().includes(q.toLowerCase()) ||
    c.hint.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape") {
        setOpen(false);
      } else if (e.key === "/" && !open &&
        !(document.activeElement && /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName))) {
        e.preventDefault(); setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) { setQ(""); setSel(0); setTimeout(() => inputRef.current?.focus(), 30); }
  }, [open]);

  const onKey = (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSel((s) => Math.min(s+1, filtered.length-1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setSel((s) => Math.max(s-1, 0)); }
    else if (e.key === "Enter") {
      const c = filtered[sel];
      if (c) { c.run(); setOpen(false); }
    }
  };

  // Konami code
  useEffect(() => {
    const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let i = 0;
    const onKey = (e) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === seq[i]) {
        i++;
        if (i === seq.length) {
          document.body.classList.toggle("neural-mode");
          i = 0;
          // little toast
          const t = document.createElement("div");
          t.textContent = "🧠 NEURAL MODE — overclocked";
          t.style.cssText = `position:fixed; top:50%; left:50%; transform: translate(-50%,-50%);
            z-index:99999; padding: 30px 40px; background: oklch(0.13 0.012 250); color: var(--accent);
            border: 1px solid var(--accent); border-radius: 8px; font-family: 'JetBrains Mono';
            font-size: 18px; letter-spacing: 0.05em; box-shadow: 0 0 60px var(--accent-glow);
            animation: konamiPop .8s ease-out`;
          document.body.appendChild(t);
          setTimeout(() => t.remove(), 1800);
        }
      } else { i = (k === seq[0]) ? 1 : 0; }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;
  return (
    <div className="palette-bg" onClick={() => setOpen(false)}>
      <style>{`
        .palette-bg{ position: fixed; inset: 0; z-index: 1000;
          background: oklch(0.06 0.01 250 / 0.65); backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          display: flex; justify-content: center; align-items: flex-start; padding-top: 14vh;
          animation: fade .15s ease-out}
        @keyframes fade{from{opacity:0}}
        .palette{ background: var(--bg-1); border: 1px solid var(--line);
          border-radius: var(--r-md); width: 92%; max-width: 560px;
          box-shadow: 0 30px 80px rgba(0,0,0,.6), 0 0 0 1px var(--accent-soft);
          overflow: hidden; font-family: var(--f-mono)}
        .pal-in{ display:flex; align-items:center; gap: 10px;
          padding: 14px 18px; border-bottom: 1px solid var(--line-soft) }
        .pal-in .ic{ color: var(--accent); font-size: 13px }
        .pal-in input{ flex:1; background: transparent; border:0; outline:none;
          color: var(--fg); font-family: var(--f-mono); font-size: 14px }
        .pal-in kbd{ font-size: 10px; padding: 2px 6px; border:1px solid var(--line);
          border-radius: 3px; color: var(--fg-dim)}
        .pal-list{ max-height: 360px; overflow-y: auto;
          scrollbar-width: thin; scrollbar-color: var(--line) transparent }
        .pal-list::-webkit-scrollbar{ width: 6px }
        .pal-list::-webkit-scrollbar-thumb{ background: var(--line); border-radius: 3px }
        .pal-it{ display:flex; align-items:center; gap: 12px; padding: 10px 18px;
          font-size: 12.5px; color: var(--fg); cursor: default; border-left: 2px solid transparent }
        .pal-it.sel{ background: var(--accent-soft); border-left-color: var(--accent); color: var(--accent)}
        .pal-it .hint{ margin-left:auto; color: var(--fg-dim); font-size: 10.5px}
        .pal-empty{ padding: 24px 18px; color: var(--fg-dim); font-size: 12px; text-align: center}
        .pal-foot{ display:flex; gap: 12px; padding: 8px 16px; border-top: 1px solid var(--line-soft);
          font-size: 10px; color: var(--fg-dim) }
        .pal-foot kbd{ color: var(--fg-mute); border:1px solid var(--line); padding: 1px 5px;
          border-radius: 3px; margin-right: 4px }

        body.neural-mode{ animation: neural 8s linear infinite }
        @keyframes neural{
          0%   { filter: hue-rotate(0deg) }
          50%  { filter: hue-rotate(40deg) saturate(1.3) }
          100% { filter: hue-rotate(0deg) }
        }
        @keyframes konamiPop{ from { opacity: 0; transform: translate(-50%,-50%) scale(.8) } }
      `}</style>
      <div className="palette" onClick={(e) => e.stopPropagation()}>
        <div className="pal-in">
          <span className="ic">{">"}</span>
          <input ref={inputRef} value={q}
            onChange={(e) => { setQ(e.target.value); setSel(0); }}
            onKeyDown={onKey}
            placeholder="Type a command, file, or section..." />
          <kbd>ESC</kbd>
        </div>
        <div className="pal-list">
          {filtered.length === 0 && <div className="pal-empty">no commands match "{q}"</div>}
          {filtered.map((c, i) => (
            <div key={c.id}
              className={"pal-it " + (i === sel ? "sel" : "")}
              onMouseEnter={() => setSel(i)}
              onClick={() => { c.run(); setOpen(false); }}>
              <span>{c.label}</span>
              <span className="hint">{c.hint}</span>
            </div>
          ))}
        </div>
        <div className="pal-foot">
          <span><kbd>↑↓</kbd>navigate</span>
          <span><kbd>↵</kbd>select</span>
          <span style={{marginLeft:"auto"}}>{filtered.length} of {commands.length}</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { CommandPalette });
