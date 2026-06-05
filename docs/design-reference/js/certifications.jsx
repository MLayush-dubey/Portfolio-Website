// Certifications section

const CERTS = [
  {
    title: "AWS Certified Machine Learning Engineer",
    org: "Amazon Web Services",
    when: "In progress · Target: May 2026",
    status: "pending",
    code: "MLA-C01",
  },
  {
    title: "NVIDIA Certified Associate · Generative AI LLMs",
    org: "NVIDIA",
    when: "In progress · Target: May 2026",
    status: "pending",
    code: "NCA-GENL",
  },
  {
    title: "NVIDIA Certified Associate · Agentic AI",
    org: "NVIDIA",
    when: "Planned · 2026",
    status: "pending",
    code: "NCA-AIAA",
  },
  {
    title: "Complete Generative AI: RAG, AI Agents & Deployment",
    org: "Udemy",
    when: "10/2025 — 11/2025",
    status: "earned",
    code: "UC-GENAI",
  },
  {
    title: "Python Training",
    org: "IIT Bombay",
    when: "06/2022 — 07/2022",
    status: "earned",
    code: "IITB-PY",
  },
];

function Certifications() {
  return (
    <section id="certs" className="sec certs" data-screen-label="Certifications">
      <style>{`
        .cert-grid{ display:grid; grid-template-columns: repeat(2, 1fr); gap: 14px }
        @media (max-width: 800px){ .cert-grid{grid-template-columns:1fr} }
        .cert{ position: relative; padding: 22px;
          background: linear-gradient(180deg, var(--bg-1) 0%, oklch(0.135 0.012 250) 100%);
          border: 1px solid var(--line-soft); border-radius: var(--r-md);
          display: flex; flex-direction: column; gap: 10px; transition: border-color .2s, transform .2s}
        .cert:hover{ border-color: var(--accent); transform: translateY(-2px)}
        .cert .badge{ position: absolute; top: 22px; right: 22px;
          display: inline-flex; align-items: center; gap: 6px;
          font-family: var(--f-mono); font-size: 10.5px; letter-spacing: 0.06em;
          text-transform: uppercase}
        .cert .badge.earned{ color: var(--accent) }
        .cert .badge.earned::before{ content:""; width:6px; height:6px; border-radius:50%;
          background: var(--accent); box-shadow: 0 0 8px var(--accent-glow)}
        .cert .badge.pending{ color: var(--accent-2) }
        .cert .badge.pending::before{ content:""; width:6px; height:6px; border-radius:50%;
          background: var(--accent-2); animation: pulse 1.6s ease-in-out infinite}
        .cert .code{ font-family: var(--f-mono); font-size: 10.5px; color: var(--fg-dim);
          letter-spacing: 0.08em }
        .cert h4{ font-family: var(--f-display); font-size: 17px; font-weight: 500;
          letter-spacing: -0.015em; line-height: 1.3; padding-right: 110px }
        .cert .org{ font-family: var(--f-mono); font-size: 12px; color: var(--fg-mute) }
        .cert .when{ font-family: var(--f-mono); font-size: 11px; color: var(--fg-dim);
          margin-top: auto; padding-top: 10px; border-top: 1px solid var(--line-soft);
          display:flex; justify-content: space-between; align-items: baseline}
        .cert .when b{ color: var(--fg-mute); font-weight: 500 }
      `}</style>
      <div className="wrap">
        <SectionHead
          num="05 // certifications"
          title="Credentials"
          meta={`// ${CERTS.filter(c=>c.status==='earned').length} earned · ${CERTS.filter(c=>c.status==='pending').length} in flight`}
        />
        <div className="cert-grid">
          {CERTS.map((c, i) => (
            <div className="cert" key={i}>
              <span className={"badge " + c.status}>{c.status === "earned" ? "earned" : "in progress"}</span>
              <span className="code">{c.code}</span>
              <h4>{c.title}</h4>
              <span className="org">{c.org}</span>
              <div className="when">
                <span>{c.when}</span>
                <b>{c.status === "earned" ? "✓ verified" : "// learning"}</b>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Certifications, CERTS });
