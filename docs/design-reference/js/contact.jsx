// Contact + footer (resume download + form)

function Contact() {
  const [msg, setMsg] = useState({ name: "", email: "", body: "" });
  const [sent, setSent] = useState(false);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!msg.email || !msg.body) return;
    setSent(true);
    // open the user's email client as a fallback
    setTimeout(() => {
      const sub = encodeURIComponent("Portfolio hello — from " + (msg.name || "the internet"));
      const body = encodeURIComponent(msg.body + "\n\n— " + (msg.name || "—") + " (" + msg.email + ")");
      window.location.href = `mailto:aadubey1106@gmail.com?subject=${sub}&body=${body}`;
    }, 900);
  };

  return (
    <section id="contact" className="sec contact" data-screen-label="Contact">
      <style>{`
        .contact-grid{ display:grid; grid-template-columns: minmax(0,1.1fr) minmax(0,0.9fr);
          gap: 56px; align-items:start}
        @media (max-width: 900px){ .contact-grid{grid-template-columns:1fr; gap: 36px} }
        .cta-blurb h2{ font-size: clamp(40px, 5vw, 64px); letter-spacing: -0.03em;
          line-height: 1.0; margin-bottom: 22px }
        .cta-blurb h2 .accent{ color: var(--accent); text-shadow: 0 0 32px var(--accent-glow) }
        .cta-blurb p{ font-size: 16px; color: var(--fg-mute); line-height: 1.7;
          max-width: 52ch; margin-bottom: 18px }
        .cta-cards{ display:grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 26px}
        .cta-card{ padding: 16px; border:1px solid var(--line-soft); border-radius: var(--r-sm);
          display:flex; flex-direction:column; gap:6px; transition: all .15s; background: var(--bg-1)}
        .cta-card:hover{ border-color: var(--accent); background: var(--accent-soft) }
        .cta-card .lbl{ font-family: var(--f-mono); font-size: 10.5px; color: var(--fg-dim);
          text-transform: uppercase; letter-spacing: 0.08em }
        .cta-card .val{ font-family: var(--f-mono); font-size: 14px; color: var(--fg) }
        .cta-card:hover .val{ color: var(--accent) }

        .form{ background: var(--bg-1); border: 1px solid var(--line-soft);
          border-radius: var(--r-md); padding: 24px; display:flex; flex-direction:column; gap: 14px;
          font-family: var(--f-mono)}
        .form .hd{ display:flex; justify-content:space-between; align-items:center;
          font-size: 11px; color: var(--fg-dim); text-transform: uppercase;
          letter-spacing: 0.08em; padding-bottom: 12px;
          border-bottom: 1px solid var(--line-soft); margin-bottom: 4px}
        .form .hd b{ color: var(--accent) }
        .form label{ display:flex; flex-direction:column; gap: 6px;
          font-size: 11px; color: var(--fg-mute); text-transform: uppercase;
          letter-spacing: 0.06em }
        .form input, .form textarea{ background: var(--bg); color: var(--fg);
          border: 1px solid var(--line-soft); border-radius: var(--r-sm);
          padding: 10px 12px; font-family: var(--f-mono); font-size: 13px;
          outline: none; transition: border-color .15s; resize: vertical}
        .form input:focus, .form textarea:focus{ border-color: var(--accent) }
        .form .row{ display:grid; grid-template-columns: 1fr 1fr; gap: 12px }
        @media (max-width: 600px){ .form .row{grid-template-columns:1fr} }
        .form button{ background: var(--accent); color: #0a0a0a;
          border: 0; padding: 12px 18px; font-family: var(--f-mono); font-weight: 600;
          font-size: 12px; letter-spacing: 0.04em; text-transform: uppercase;
          border-radius: var(--r-sm); cursor: default; transition: all .15s;
          display:inline-flex; align-items:center; justify-content:center; gap: 8px;
          align-self: flex-start}
        .form button:hover{ box-shadow: 0 0 0 4px var(--accent-soft)}
        .form .sent{ color: var(--accent); padding: 10px 0;
          font-size: 12px; display:flex; gap:8px; align-items:center}
      `}</style>

      <div className="wrap">
        <SectionHead num="07 // contact" title="Get in touch" meta="// inbox: open" />

        <div className="contact-grid">
          <div className="cta-blurb">
            <h2>Let's build something that<br/><span className="accent">survives production.</span></h2>
            <p>
              Open to senior IC AI/ML roles, contract work, or a coffee in DXB.
              Best reach is LinkedIn, but the form ships straight to my inbox.
            </p>
            <p className="dim" style={{fontSize:13.5}}>
              p.s. — if you've made it this far and you're a recruiter: try typing <span className="mono accent">whoami</span> in the chat above. or hit ⌘K.
            </p>

            <div className="cta-cards">
              <a className="cta-card" href="mailto:aadubey1106@gmail.com">
                <span className="lbl">/* email */</span>
                <span className="val">aadubey1106@gmail.com</span>
              </a>
              <a className="cta-card" href="https://www.linkedin.com/in/ayush-dubey-69860522a/" target="_blank" rel="noreferrer">
                <span className="lbl">/* linkedin */</span>
                <span className="val">ayush-dubey</span>
              </a>
              <a className="cta-card" href="https://github.com/MLayush-dubey" target="_blank" rel="noreferrer">
                <span className="lbl">/* github */</span>
                <span className="val">MLayush-dubey</span>
              </a>
              <a className="cta-card" href="resume.pdf" download>
                <span className="lbl">/* résumé */</span>
                <span className="val">resume.pdf ↓</span>
              </a>
            </div>
          </div>

          <form className="form" onSubmit={onSubmit}>
            <div className="hd"><span>// new_message.txt</span><b>● open</b></div>
            <div className="row">
              <label>name
                <input type="text" placeholder="optional"
                  value={msg.name} onChange={(e) => setMsg({...msg, name: e.target.value})}/>
              </label>
              <label>email *
                <input type="email" placeholder="you@company.com" required
                  value={msg.email} onChange={(e) => setMsg({...msg, email: e.target.value})}/>
              </label>
            </div>
            <label>message *
              <textarea rows={6} placeholder="role, project, idea, or just hi"
                required value={msg.body}
                onChange={(e) => setMsg({...msg, body: e.target.value})}/>
            </label>
            {sent ? (
              <div className="sent"><Icon name="sparkle"/> compiling message → routing to inbox...</div>
            ) : (
              <button type="submit"><Icon name="send" size={12}/> send message</button>
            )}
            <div style={{fontSize:10.5, color:"var(--fg-dim)", marginTop:4}}>
              // submits open your default mail client with the prefilled message
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer" data-screen-label="Footer">
      <style>{`
        .footer{ border-top: 1px solid var(--line-soft); margin-top: 60px;
          padding: 36px 0 80px; font-family: var(--f-mono); font-size: 11px;
          color: var(--fg-dim)}
        .footer .row{ display:flex; gap: 18px; flex-wrap: wrap; justify-content: space-between;
          align-items: baseline}
        .footer .row a{ color: var(--fg-mute) }
        .footer .row a:hover{ color: var(--accent) }
        .footer .ascii{ font-size: 9px; line-height: 1.1; white-space: pre;
          color: var(--accent); opacity: .5; margin-top: 18px; user-select: text }
      `}</style>
      <div className="wrap">
        <div className="row">
          <span>© 2026 — Ayush Dubey · built with HTML, CSS, and an embarrassing amount of caffeine</span>
          <span>// last rebuild: 2 commits ago</span>
        </div>
        <pre className="ascii">{
`        ▄▀█ ▀█▀ █░█ █▀ █░█
        █▀█ ░█░ ░█░ ▀▄ █▀█    // hint: ↑↑↓↓←→←→BA`
        }</pre>
      </div>
    </footer>
  );
}

Object.assign(window, { Contact, Footer });
