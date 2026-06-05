// Top status bar (terminal-style) — fake live training metrics, clock, location.

function StatusBar() {
  const [loss, setLoss] = useState(0.0247);
  const [epoch, setEpoch] = useState(1247);
  const [gpu, setGpu] = useState(73);
  const [time, setTime] = useState("");
  const [acc, setAcc] = useState(94.3);

  useEffect(() => {
    const id = setInterval(() => {
      setLoss((l) => Math.max(0.0002, l + (Math.random() - 0.55) * 0.0008));
      setEpoch((e) => e + 1);
      setGpu((g) => Math.max(45, Math.min(89, g + (Math.random() - 0.5) * 3)));
      setAcc((a) => Math.max(82, Math.min(99.2, a + (Math.random() - 0.5) * 0.4)));
    }, 1100);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const upd = () => {
      const d = new Date();
      // UAE = UTC+4
      const utc = d.getTime() + d.getTimezoneOffset() * 60000;
      const uae = new Date(utc + 4 * 3600 * 1000);
      const hh = String(uae.getHours()).padStart(2, "0");
      const mm = String(uae.getMinutes()).padStart(2, "0");
      const ss = String(uae.getSeconds()).padStart(2, "0");
      setTime(`${hh}:${mm}:${ss}`);
    };
    upd();
    const id = setInterval(upd, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="statusbar">
      <style>{`
        .statusbar{
          position:sticky; top:0; z-index:50;
          display:flex; align-items:center; gap:0;
          height:30px; background: oklch(0.105 0.012 250 / 0.92);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--line-soft);
          font-family: var(--f-mono);
          font-size: 10.5px; letter-spacing: 0.02em;
          color: var(--fg-mute);
          overflow-x: auto; overflow-y: hidden;
          scrollbar-width: none;
        }
        .statusbar::-webkit-scrollbar{display:none}
        .sb-cell{padding: 0 14px; height:100%; display:flex; align-items:center; gap:8px;
          border-right: 1px solid var(--line-soft); white-space:nowrap}
        .sb-cell:last-child{border-right:0}
        .sb-label{color:var(--fg-dim); text-transform:uppercase; font-size:10px}
        .sb-val{color:var(--fg); font-variant-numeric: tabular-nums}
        .sb-val.green{color:var(--accent)}
        .sb-val.amber{color:var(--accent-2)}
        .sb-spacer{flex:1; min-width:0}
        .sb-dot{width:6px; height:6px; border-radius:50%; background:var(--accent);
          box-shadow:0 0 8px var(--accent-glow); animation: pulse 1.6s ease-in-out infinite}
        @keyframes blink{50%{opacity:.3}}
        .sb-blink{animation: blink 1s steps(1) infinite}
      `}</style>
      <div className="sb-cell">
        <span className="sb-dot" />
        <span className="sb-val green">ayush@quantum-horizon</span>
        <span style={{color:'var(--fg-dim)'}}>:~$</span>
      </div>
      <div className="sb-cell"><span className="sb-label">loc</span><span className="sb-val">DXB</span></div>
      <div className="sb-cell"><span className="sb-label">epoch</span><span className="sb-val">{epoch}</span></div>
      <div className="sb-cell"><span className="sb-label">loss</span><span className="sb-val green">{loss.toFixed(4)}</span></div>
      <div className="sb-cell"><span className="sb-label">val_acc</span><span className="sb-val">{acc.toFixed(2)}%</span></div>
      <div className="sb-cell"><span className="sb-label">gpu</span><span className="sb-val amber">{gpu.toFixed(0)}°C</span></div>
      <div className="sb-spacer" />
      <div className="sb-cell"><span className="sb-label">uptime</span><span className="sb-val">365d</span></div>
      <div className="sb-cell"><span className="sb-label">uae</span><span className="sb-val">{time}<span className="sb-blink">_</span></span></div>
      <div className="sb-cell"><span className="sb-val green">⌘K</span></div>
    </div>
  );
}

// Top nav (below status bar)
function NavBar() {
  const links = [
    ["01", "About",      "#about"],
    ["02", "Demo",       "#playground"],
    ["03", "Projects",   "#projects"],
    ["04", "Experience", "#experience"],
    ["05", "Certs",      "#certs"],
    ["06", "Skills",     "#skills"],
    ["07", "Contact",    "#contact"],
  ];
  return (
    <nav className="navbar">
      <style>{`
        .navbar{position:sticky; top:30px; z-index:49;
          backdrop-filter:blur(10px); -webkit-backdrop-filter:blur(10px);
          background: oklch(0.135 0.012 250 / 0.6);
          border-bottom: 1px solid var(--line-soft);
        }
        .nav-inner{ max-width:1320px; margin:0 auto; padding: 12px 40px;
          display:flex; align-items:center; gap:24px}
        @media (max-width:720px){ .nav-inner{padding:12px 20px} }
        .brand{ font-family: var(--f-display); font-weight:600; letter-spacing:-0.02em;
          font-size:16px; display:flex; align-items:center; gap:10px}
        .brand-mono{
          width:28px; height:28px; border:1px solid var(--accent);
          display:grid; place-items:center; border-radius:5px;
          font-family: var(--f-mono); font-size:11px; color: var(--accent);
          font-weight:600; background:var(--accent-soft)
        }
        .nav-links{ display:flex; gap:0; margin-left:auto; align-items:center }
        .nav-link{ display:inline-flex; gap:8px; padding: 6px 12px; align-items:baseline;
          font-family: var(--f-mono); font-size: 11.5px; color: var(--fg-mute);
          border-radius:4px; transition: color .15s, background .15s }
        .nav-link:hover{ color: var(--fg); background: var(--bg-1) }
        .nav-link b{ color: var(--accent); font-weight:500; font-size:10px; opacity:.8 }
        @media (max-width:780px){ .nav-link span.lbl{display:none} }
        .nav-cmd{ font-family: var(--f-mono); font-size: 10.5px;
          color: var(--fg-dim); border:1px solid var(--line);
          padding: 4px 8px; border-radius:4px; margin-left:8px }
      `}</style>
      <div className="nav-inner">
        <a href="#top" className="brand">
          <span className="brand-mono">AD</span>
          <span>Ayush Dubey<span style={{color:'var(--fg-dim)', fontWeight:400}}>.ai</span></span>
        </a>
        <div className="nav-links">
          {links.map(([n,l,h]) => (
            <a key={n} href={h} className="nav-link"><b>{n}</b><span className="lbl">{l}</span></a>
          ))}
          <span className="nav-cmd">⌘K</span>
        </div>
      </div>
    </nav>
  );
}

Object.assign(window, { StatusBar, NavBar });
