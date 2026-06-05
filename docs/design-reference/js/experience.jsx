// Experience timeline (vertical, dark)

const EXPERIENCE = [
  {
    when: "2025 — present",
    role: "AI/ML Engineer",
    org: "Quantum Horizon",
    loc: "Dubai, UAE",
    bullets: [
      "Built and shipped a production hybrid recommender (LightFM) end-to-end as the sole ML owner — data pipelines, training, serving, monitoring.",
      "Currently architecting a rules + ML fraud-detection system to catch in-game exploits in real time across roulette and similar games.",
      "Working across the seams: ML modelling, infra (AWS), and product analytics.",
    ],
    tags: ["LightFM", "FastAPI", "AWS", "Production"],
  },
  {
    when: "09/2025 — 10/2025",
    role: "Fullstack AI Engineer",
    org: "Samarth Life Sciences · Freelance",
    loc: "Andheri, Mumbai",
    bullets: [
      "Built a full-stack predictive analytics dashboard visualizing 6 months of sales data — actionable revenue trends and product-performance insights for stakeholders.",
      "Engineered a custom RAG chatbot trained on proprietary pharmaceutical catalogs (critical-care drugs / injections) for instant, accurate retrieval of technical product specs.",
      "Implemented time-series forecasting models to predict sales volumes, improving decision-making for inventory and resource planning.",
    ],
    tags: ["RAG", "Forecasting", "Full-stack", "Pharma"],
  },
  {
    when: "10/2024 — 01/2025",
    role: "AI Consultant",
    org: "Bhairav Builders and Developers · Internship",
    loc: "Mumbai",
    bullets: [
      "Shipped a modular React (TypeScript) website with reusable components — cut development time by 20% with a fully responsive UI.",
      "Consulted sales teams on GenAI integration; implemented prompt-engineering workflows (ChatGPT / Claude) that streamlined campaign content and pitches.",
      "Trained 10+ sales professionals on AI-powered proposal generation, hitting 100% team adoption.",
    ],
    tags: ["GenAI", "React/TS", "Prompt eng", "Enablement"],
  },
  {
    when: "12/2023 — 06/2024",
    role: "AI Developer",
    org: "Arkham Archives · Internship",
    loc: "Kolkata, India",
    bullets: [
      "Developed and deployed a GAN-based model that generates high-quality animated videos from static images.",
      "Designed image-to-video workflows with a multidisciplinary team, balancing creative output with technical constraints.",
      "Engineered preprocessing pipelines that enhanced input image quality and lifted final video fidelity.",
    ],
    tags: ["GANs", "Computer Vision", "PyTorch"],
  },
  {
    when: "06/2023 — 02/2024",
    role: "Data Scientist",
    org: "IntellAI · Internship",
    loc: "Mumbai",
    bullets: [
      "Built scalable Django web applications with optimized ORM queries and MVC architecture in a production-grade codebase.",
      "Shipped 15+ RESTful API endpoints (Django REST Framework) with auth + validation — cut manual testing time by 40%.",
      "Executed 100+ automated test cases (Postman) covering CRUD + edge cases, improving API reliability.",
    ],
    tags: ["Django", "DRF", "APIs", "Testing"],
  },
];

const EDUCATION = {
  degree: "B.Tech, Artificial Intelligence and Machine Learning",
  school: "Thakur College of Engineering and Technology",
  loc: "Kandivali (East), Mumbai",
  when: "2021 — 2025",
  gpa: "8.20 / 10",
};

function Experience() {
  return (
    <section id="experience" className="sec experience" data-screen-label="Experience">
      <style>{`
        .tl{ position: relative; padding-left: 28px }
        .tl::before{ content:""; position: absolute; left: 7px; top: 6px; bottom: 6px;
          width: 1px; background: linear-gradient(180deg, var(--accent) 0%, var(--line) 80%, transparent 100%)}
        .ev{ position: relative; padding-bottom: 36px; padding-left: 18px }
        .ev:last-child{ padding-bottom: 0 }
        .ev::before{ content:""; position: absolute; left: -25px; top: 8px;
          width: 12px; height: 12px; border-radius: 50%; background: var(--bg);
          border: 2px solid var(--accent); box-shadow: 0 0 0 4px var(--bg), 0 0 14px var(--accent-glow)}
        .ev .when{ font-family: var(--f-mono); font-size: 11px; color: var(--fg-dim);
          letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 6px }
        .ev .role{ font-family: var(--f-display); font-size: 22px; line-height: 1.25;
          font-weight: 500; letter-spacing: -0.02em; margin-bottom: 4px}
        .ev .role b{ color: var(--accent); font-weight: 500 }
        .ev .org{ font-family: var(--f-mono); font-size: 12px; color: var(--fg-mute);
          margin-bottom: 14px; display:flex; gap:10px; align-items:center}
        .ev .org::after{ content: "·"; color: var(--fg-dim) }
        .ev .org .loc{ color: var(--fg-dim) }
        .ev ul{ list-style: none; padding: 0; margin: 0; display:flex; flex-direction:column; gap:8px}
        .ev ul li{ position:relative; padding-left: 18px; color: var(--fg-mute);
          font-size: 14.5px; line-height: 1.55; max-width: 68ch }
        .ev ul li::before{ content:"›"; position: absolute; left: 0; color: var(--accent);
          font-family: var(--f-mono) }
        .ev .tags{ display:flex; flex-wrap:wrap; gap: 6px; margin-top: 14px }

        .edu{ margin-top: 56px; padding-top: 28px; border-top: 1px solid var(--line-soft);
          display:grid; grid-template-columns: minmax(0,1fr) auto; gap: 18px;
          align-items: center}
        @media (max-width:720px){ .edu{grid-template-columns:1fr} }
        .edu .lbl{ font-family: var(--f-mono); font-size: 10.5px; color: var(--accent);
          text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px}
        .edu h4{ font-family: var(--f-display); font-size: 20px; font-weight: 500;
          letter-spacing: -0.02em; margin-bottom: 4px}
        .edu .meta{ font-family: var(--f-mono); font-size: 12px; color: var(--fg-mute)}
        .edu .gpa{ font-family: var(--f-mono); font-size: 12px; color: var(--fg-mute);
          display:flex; gap: 18px; flex-wrap: wrap }
        .edu .gpa b{ color: var(--accent); font-weight: 500 }
      `}</style>
      <div className="wrap">
        <SectionHead num="04 // experience" title="Where I've been" meta={`// ${EXPERIENCE.length} entries`}/>
        <div className="tl">
          {EXPERIENCE.map((e, i) => (
            <div className="ev" key={i}>
              <div className="when">{e.when}</div>
              <div className="role"><b>{e.role}</b></div>
              <div className="org">
                <span>{e.org}</span>
                <span className="loc">{e.loc}</span>
              </div>
              <ul>{e.bullets.map((b,j) => <li key={j}>{b}</li>)}</ul>
              <div className="tags">{e.tags.map((t,j) => <Chip key={j}>{t}</Chip>)}</div>
            </div>
          ))}
        </div>

        <div className="edu">
          <div>
            <div className="lbl">// education</div>
            <h4>{EDUCATION.degree}</h4>
            <div className="meta">{EDUCATION.school} · {EDUCATION.loc}</div>
          </div>
          <div className="gpa">
            <span>{EDUCATION.when}</span>
            <span><b>GPA</b> {EDUCATION.gpa}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Experience });
