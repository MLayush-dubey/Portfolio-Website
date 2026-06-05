# Handoff: Ayush Dubey — AI/ML Portfolio Website

## Overview
A full-page personal portfolio for **Ayush Dubey**, an AI/ML Engineer based in Dubai. The design concept is called **"Latent Space"** — the entire site is themed around AI/ML visual metaphors: animated neural embedding scatter plots, terminal-style status bars with live training metrics, a node-graph tech-stack visualizer, and a fully working RAG (Retrieval-Augmented Generation) pipeline demo embedded inline.

The goal is to impress three audiences simultaneously: **recruiters** (clean narrative, strong copywriting), **senior engineers** (live RAG demo, architecture diagrams, MLOps credibility), and **founders** (clear impact metrics, production experience, bias for shipping).

---

## About the Design Files

The files in this bundle are **HTML/JSX design prototypes** built as visual references — they demonstrate intended look, layout, behavior, and interactions. They are **not** production code to copy directly.

The task for Claude Code is to **recreate these designs in a real production stack** — ideally **Next.js 14+ (App Router) with TypeScript and Tailwind CSS** (or an equivalent React framework). Use the HTML prototypes as the pixel-level source of truth for every visual decision: colors, spacing, typography, interactions, animations.

The prototypes are viewable by opening `Portfolio.html` in a browser. All component logic lives in `js/` as Babel-transpiled JSX files.

**Fidelity: HIGH-FIDELITY.** Every color, font size, spacing value, animation timing, and interaction state is intentional and should be reproduced exactly.

---

## Tech Stack Recommendation (for Claude Code)

| Layer | Recommendation |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties for tokens |
| Animation | Framer Motion (for scroll reveals, transitions) |
| Canvas | React + native Canvas API (latent-space hero) |
| AI / Chat | Anthropic SDK (`@anthropic-ai/sdk`) — server-side route handler |
| RAG demo | Same logic as prototype, server-side via API route |
| Icons | Inline SVGs (already defined in `js/shared.jsx`) |
| Fonts | Google Fonts: Space Grotesk + IBM Plex Sans + JetBrains Mono |
| Deployment | Vercel |

---

## Design Tokens

These are the exact CSS custom property values the entire design is built on. Implement as CSS variables (`:root`) or Tailwind theme extensions.

### Colors
```css
--bg:            oklch(0.135 0.012 250)   /* #0c1014 near-black */
--bg-1:          oklch(0.165 0.014 250)   /* card surface */
--bg-2:          oklch(0.195 0.014 250)   /* elevated surface */
--line:          oklch(0.27 0.012 250)    /* border */
--line-soft:     oklch(0.22 0.012 250)    /* subtle border */
--fg:            oklch(0.96 0.005 250)    /* #fafafa near-white */
--fg-mute:       oklch(0.68 0.012 250)    /* secondary text */
--fg-dim:        oklch(0.5 0.012 250)     /* placeholder / meta text */

/* Accent (phosphor green — default) */
--accent:        oklch(0.86 0.18 145)     /* #7dd87a */
--accent-glow:   oklch(0.86 0.18 145 / 0.35)
--accent-soft:   oklch(0.86 0.18 145 / 0.12)
--accent-2:      oklch(0.82 0.16 75)      /* amber #e8b54b */

/* Alternate palette options (user-swappable via Tweaks) */
/* cyan:    oklch(0.82 0.16 220) */
/* amber:   oklch(0.82 0.16 78)  */
/* magenta: oklch(0.78 0.20 340) */
```

### Typography
```css
--f-display: "Space Grotesk", ui-sans-serif, system-ui, sans-serif
--f-body:    "IBM Plex Sans", ui-sans-serif, system-ui, sans-serif
--f-mono:    "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace
```

### Type Scale
| Use | Size | Weight | Letter-spacing |
|---|---|---|---|
| Hero name | clamp(48px, 7vw, 96px) | 500 | -0.04em |
| H2 | clamp(28px, 3.4vw, 44px) | 500 | -0.025em |
| H3 (card title) | 22px | 500 | -0.02em |
| Body | 15px | 400 | normal |
| Large body | 17px | 400 | normal |
| Mono UI | 11–13px | 400–500 | 0.02–0.1em |
| Chip / badge | 10.5px | 400 | 0.04em |

### Spacing & Radii
```
--r-sm: 4px
--r-md: 8px
--r-lg: 14px

Max content width: 1320px, padding: 0 40px (mobile: 0 20px)
Section vertical padding: 96px top/bottom (mobile: 64px)
```

### Shadows
Cards: `box-shadow: 0 30px 80px -20px oklch(0.05 0.01 250 / 0.6)`
Accent glow on focused elements: `0 0 0 4px var(--accent-soft)`

---

## Global Layout & Chrome

### Status Bar (`js/statusbar.jsx`)
- **Sticky, top: 0, z-index: 50, height: 30px**
- Background: `oklch(0.105 0.012 250 / 0.92)` with `backdrop-filter: blur(12px)`
- Font: JetBrains Mono, 10.5px
- Left: animated green dot + `ayush@quantum-horizon :~$`
- Middle cells (each separated by 1px border): `loc: DXB`, `epoch: <counter>`, `loss: <float>`, `val_acc: <float>%`, `gpu: <int>°C`
- Right: `uptime: 365d`, `uae: HH:MM:SS` (live clock, UTC+4), `⌘K`
- epoch, loss, val_acc, gpu all animate with realistic fake "training" values every ~1.1s
- Clock updates every 1s; loss trends downward slightly

### Nav Bar (`js/statusbar.jsx` — `NavBar` component)
- **Sticky, top: 30px** (below status bar), z-index: 49
- Background: `oklch(0.135 0.012 250 / 0.6)` + `backdrop-filter: blur(10px)`
- Left: `AD` monogram box (28×28px, 1px accent border, 5px radius) + "Ayush Dubey.ai"
- Right: numbered links `01 About`, `02 Demo`, `03 Projects`, `04 Experience`, `05 Certs`, `06 Skills`, `07 Contact`
- Each link: number in accent color (10px), label in fg-mute; hover → bg-1 background
- Far right: `⌘K` keyboard hint pill

### Background Effects
- `body` has two fixed radial gradient overlays (accent glow from top-center, amber from bottom-left)
- `body::before` — fixed dotted grid using `radial-gradient` 1px dots, 28px grid, masked radially
- Optional `body.scanlines::after` — CRT scanline texture via `repeating-linear-gradient`
- `body.neural-mode` — hue-rotate animation (Konami code easter egg)

---

## Section-by-Section Spec

### Hero (`js/hero.jsx`)

**Layout:** 2-column grid (`1.05fr / 0.95fr`), centered vertically, `min-height: calc(100vh - 80px)`, padding `80px 0 64px`

**Left column — meta:**
- Row of status pills: `Available for select roles · Q3 2026` (green dot chip) + `v2.5.1` + `DXB · UTC+4`
- `<h1>` — two lines: `Ayush Dubey.` (full brightness) + `/* the AI/ML engineer */` (fg-mute, hover → accent glow)
- Hidden on hover: monospace annotation `embedding[2,768] = [0.247, -0.812, ...]` fades in below name
- Body paragraph (17px, fg-mute): intro text with bold key phrases
- CTA row: `View work →` (accent-filled button) + `Try the RAG demo ✦` (outline) + `resume.pdf ↓` (outline)
- Social links row with GitHub, LinkedIn, email — each with matching inline SVG icon, hover underline animation

**Right column — chat agent terminal:**
- Dark frosted card (height: 480px), traffic-light dots header, `ayush-agent · llm + scroll-actions` title
- Quick-prompt chips: 4 preset questions
- Message list: each message has role badge (`U` / `AI`), meta line with name + `// model=claude-haiku-4.5`, content
- Bot replies can include action buttons below the text (e.g. "Show projects →", "Open GitHub ↗") that trigger page scroll or open URLs
- Input bar at bottom with `>` prompt, text input, `send` button
- **AI integration:** Call Anthropic API (server-side route) with a system persona for Ayush.AI. See `SYSTEM_PERSONA` constant in `js/hero.jsx` for the full prompt. The agent responds with optional `<action type="scroll|open|expand" target="..." label="...">` tags that the UI parses and renders as buttons.

**Background canvas (`js/latent.jsx`):**
- Full `position: absolute` canvas behind the hero, masked with radial gradient
- Renders ~200–400 animated particles in 4 clusters (LLM, RecSys, MLOps, CV)
- Particles drift with sinusoidal motion + spring return to origin
- Mouse repulsion: particles push away from cursor within ~120px radius
- Thin connecting lines within each cluster when particles are close
- Cluster labels in monospace at cluster center: `// LLM`, `// RecSys`, etc.
- Uses `mulberry32(42)` seeded random for deterministic placement

### NowPlaying Strip (`js/nowplaying.jsx`)
- Full-width strip between Hero and About
- Background: `oklch(0.105 0.012 250 / 0.6)`, 1px borders top/bottom
- Content: `> live` prefix (accent) + `// <label>` (fg-dim monospace) + value text + tag pill (amber) + dot progress indicator
- Rotates through 8 status items every 3.4s with a `translateY(4px) → 0` fade-in animation
- Pauses on hover
- Items cover: currently reading, shipping, last commit, model in prod, listening, studying, open to, weekend hack

### About (`js/about.jsx`)

**Layout:** 2-column grid (`1.1fr / 0.9fr`)

**Left — bio text:**
- 3 paragraphs at 17px, 1.7 line-height
- Bold accent-colored key phrases in-line
- Block quote with 2px left accent border, italic text, fg-mute color

**Right — skill weights panel:**
- Card (bg-1, border, 22px padding, JetBrains Mono)
- Header: `// self_assessment.weights` + `norm=L2`
- 6 skill rows, each: label, numeric score (e.g. `0.94`), 4px progress bar
- Bar fills with `linear-gradient(90deg, --accent, --accent-2)` + glow shadow
- Bar fill animates on `@keyframes weightFill` (1.4s cubic-bezier ease) with staggered delay
- Footer: `// confidence intervals omitted` + `n=18mo`

### Live RAG Playground (`js/playground.jsx`)

**Section:** `id="playground"`, `SectionHead` = `02 // live demo · Try the RAG pipeline · // retrieve · rerank · generate`

**Layout:** Single full-width frosted card

**Components:**
1. **Header bar**: traffic lights + `rag-playground · corpus=portfolio · top_k=5 → rerank=3 → llm` + `▸ live`
2. **Query input**: dark row with `>` prefix, full-width text input, `run pipeline →` accent button; `Enter` key triggers run
3. **Preset chips**: 4 quick questions the user can click to auto-run
4. **3-column pipeline** (`1fr 1fr 1fr`):
   - **Stage 01 Retrieve**: shows top-5 retrieved chunks with relevance scores, keywords highlighted in accent; dropped chunks fade-slide-left as stage 2 activates
   - **Stage 02 Rerank**: shows top-3 chunks re-ordered with `#1 #2 #3` labels and boosted border color; pulse animation while active
   - **Stage 03 Generate**: shows the final LLM answer with `[1][2][3]` citation tags rendered as small accent chips
5. **Footer bar**: shows `embedding: tf-keyword`, `reranker: score-sort`, `llm: claude-haiku-4.5`, `corpus: 10 chunks`

**Data:** 10 corpus chunks in `CORPUS` array covering all 5 projects + bio + skills. Retrieval is a keyword TF scorer (`score()` function). Claude is called with a grounded prompt including the top-3 chunks.

**States:** idle → stage 1 (scanning) → stage 2 (reranking) → stage 3 (generating) → done (4). Each active stage gets accent border + glow.

### Projects (`js/projects.jsx`)

**Layout:** 2-column CSS grid, 20px gap

**Each project card:**
- `min-height: 360px`, linear gradient background (bg-1 → bg), `overflow: hidden`
- Hover: `translateY(-2px)`, border → accent, radial gradient overlay fades in from top-right
- Top-right corner: `position: absolute` SVG art (130×130px), opacity 0.6 → 1 on hover
- Row 1: project number (accent mono) + tag (fg-dim mono, right-aligned)
- `<h3>`: name in accent color + subtitle
- Company/status line with amber dot prefix
- Blurb text (13.5px, fg-mute, flex-1 to push metrics to bottom)
- Metrics row (3 metrics, font-mono 11px, separated by top/bottom 1px borders): `<b>value</b>` + `<span>label</span>`
- Stack chips (Chip component: 999px radius, border, mono 10.5px)
- Footer: GitHub link pill + "view architecture ↓" toggle button

**Architecture expand:**
- When "view architecture ↓" clicked, a full-width card (`grid-column: 1 / -1`) animates in below (`translateY(-6px) → 0`, 0.25s)
- Contains: `ArchDiagram` SVG component + caption bar
- Close button `×` in header

**Architecture diagrams (`js/architecture.jsx`):**
- Pure SVG, `viewBox="0 0 800 220"`, responsive width
- Nodes: `<rect rx="4">` with label + sub-label in JetBrains Mono
- Edges: cubic bezier `<path>` curves; 0.25 opacity normally
- **Animated trace**: every 700ms, a `<circle r="3">` with `<animateMotion>` travels along one edge in sequence; `<animate>` fades it in/out
- 5 diagrams defined: RecSys pipeline, Fraud detection, MLOps stack, Stock multi-agent, RAG chatbot

### Experience (`js/experience.jsx`)

**Layout:** Vertical timeline

**Timeline rail:**
- `position: relative`, `padding-left: 28px`
- `::before` — 1px vertical line from top, gradient accent → line-soft → transparent

**Each entry:**
- `::before` — 12px circle dot, `background: --bg`, 2px accent border, double box-shadow (bg ring + accent glow)
- Date range: JetBrains Mono 11px, fg-dim, uppercase
- Role: Space Grotesk 22px, accent colored, font-weight 500
- Org + location: mono 12px, fg-mute + fg-dim
- Bullet list: each item `padding-left: 18px`, `::before` = `›` in accent
- Stack chips row

**5 entries (newest first):**
1. Quantum Horizon (2025–present) — AI/ML Engineer
2. Samarth Life Sciences (09/2025–10/2025) — Fullstack AI Engineer
3. Bhairav Builders (10/2024–01/2025) — AI Consultant
4. Arkham Archives (12/2023–06/2024) — AI Developer
5. IntellAI (06/2023–02/2024) — Data Scientist

**Education block** below timeline:
- 2-column (`1fr auto`) layout, separated by top border
- B.Tech AI/ML, TCET Mumbai, GPA 8.20, 2021–2025

### Certifications (`js/certifications.jsx`)

**Layout:** 2-column grid, 14px gap

**Each cert card:**
- Linear gradient bg, border, 22px padding, `hover: translateY(-2px)` + accent border
- Top-right badge: `earned` (green dot + text) or `in progress` (pulsing amber dot)
- Code label: `MLA-C01`, `NCA-GENL` etc. (mono, fg-dim)
- Title (Space Grotesk 17px) with `padding-right: 110px` to clear the badge
- Org name (mono 12px)
- Footer: date range + verified/learning status

**5 certs:**
- AWS Certified ML Engineer (pending)
- NVIDIA Certified GenAI LLMs (pending)
- NVIDIA Certified Agentic AI (planned)
- Udemy Complete GenAI (earned)
- IIT Bombay Python (earned)

### Skills Graph (`js/skills.jsx`)

**Container:** Full-width card with dotted-grid background, `min-height: 540px`

**SVG graph:**
- `viewBox="0 0 {W} {H}"`, responsive via ResizeObserver
- 33 nodes across 7 groups (Languages, Classical ML, Deep Learning/CV, NLP, GenAI/Agents, MLOps, Infra)
- Node positions: x/y as % of container size (defined in `SKILL_NODES` array)
- Node rendering: outer halo circle (opacity 0 → 0.18 on focus), outer filled circle (accent-colored), inner dark circle (bg), text label
- 55 edges: `<line>` at 0.16 opacity normally
- **Hover interaction:** hovering a node highlights it + all direct neighbors; all others dim to 0.15 opacity; hovered edges thicken to 1.2px; focused node gets `drop-shadow` filter
- Legend: fixed-position card (top-right of container) with color-coded group labels
- Hint text bottom-left: `// hover a node to highlight its connections`

**Group color palette:**
```
lang:  var(--accent)                      /* green */
ml:    oklch(0.78 0.14 145)               /* lighter green */
dl:    oklch(0.78 0.14 175)               /* teal-green */
nlp:   oklch(0.78 0.14 200)               /* teal */
llm:   var(--accent-2)                    /* amber */
mlops: oklch(0.78 0.14 80)               /* warm yellow */
infra: oklch(0.72 0.12 250)              /* blue-gray */
```

### Contact (`js/contact.jsx`)

**Layout:** 2-column grid (`1.1fr / 0.9fr`)

**Left — CTA:**
- `<h2>` with accent-colored highlighted phrase: "Let's build something that **survives production.**"
- 2 body paragraphs
- 2×2 grid of contact cards (email, LinkedIn, GitHub, resume download) — hover → accent border + bg-soft

**Right — message form:**
- Dark card, mono font
- Header: `// new_message.txt` + `● open` indicator
- 2-col grid: name (optional) + email (required) inputs
- Textarea (6 rows)
- Submit button → opens `mailto:` link with pre-filled subject/body
- On submit: replaces button with "compiling message → routing to inbox..." state

### Footer (`js/contact.jsx` — `Footer` component)
- Top border, `padding: 36px 0 80px`, mono 11px
- Left: copyright line
- Right: `// last rebuild: 2 commits ago`
- ASCII art "AYUSH" logo with Konami hint

---

## Interactive Features

### ⌘K Command Palette (`js/commandpalette.jsx`)
- Triggered by `Cmd+K` / `Ctrl+K` or `/` (when not focused in an input)
- Modal overlay: `blur(6px)` backdrop, centered card, max-width 560px
- Input with `>` prefix, live-filtered list of commands
- Keyboard: `↑↓` navigate, `Enter` execute, `Esc` close
- Commands: navigate to sections, open GitHub/LinkedIn, download resume, toggle scanlines, Konami trigger
- Footer shows `↑↓ navigate`, `↵ select`, result count

### Konami Code
- Sequence: `↑↑↓↓←→←→ba`
- Toggles `body.neural-mode` which applies `hue-rotate` animation on body
- Toast overlay appears center-screen: "🧠 NEURAL MODE — overclocked", fades out after 1.8s

### Console Easter Egg
- On page load, a styled `console.log` message is printed:
  `ayush@quantum-horizon:~$ whoami` + response + hint about `⌘K` and Konami

### Chat Agent Commands (in-page)
Local commands processed without AI: `whoami`, `ls`, `ls projects`, `help`, `clear`, `contact`

---

## AI Integration (Production Implementation Notes)

The design uses `window.claude.complete()` — a sandboxed helper. In production, replace with a **Next.js API route** (`/api/chat`):

```ts
// app/api/chat/route.ts
import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic();

export async function POST(req: Request) {
  const { messages } = await req.json();
  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 1024,
    messages,
  });
  return Response.json({ text: response.content[0].text });
}
```

Apply rate limiting (e.g. Upstash Redis) to prevent abuse. The system persona string is in `js/hero.jsx` as `SYSTEM_PERSONA` — move it server-side.

For the RAG playground, the corpus (`CORPUS` in `js/playground.jsx`) and scoring logic can stay client-side, but the final Claude call should go through the same API route.

---

## Assets & Files

| File | Purpose |
|---|---|
| `Portfolio.html` | Main prototype — open in browser to see the full design |
| `js/shared.jsx` | Icon SVGs, shared hooks (useInView, useElementSize, mulberry32), Chip, SectionHead |
| `js/statusbar.jsx` | StatusBar + NavBar |
| `js/latent.jsx` | Canvas particle animation + Sparkline |
| `js/nowplaying.jsx` | Rotating live status strip |
| `js/hero.jsx` | Hero section + ChatAgent (Ayush.AI) with action parsing |
| `js/about.jsx` | Bio + skill-weight bars |
| `js/playground.jsx` | Live RAG demo (corpus, scorer, 3-stage pipeline UI) |
| `js/architecture.jsx` | SVG architecture diagrams for all 5 projects |
| `js/projects.jsx` | Project cards + mini SVG art + arch expand |
| `js/experience.jsx` | Timeline + education block |
| `js/certifications.jsx` | Cert cards with status badges |
| `js/skills.jsx` | Interactive node-graph |
| `js/contact.jsx` | Contact form + footer |
| `js/commandpalette.jsx` | ⌘K palette + Konami code |
| `js/tweaks.jsx` | Palette/font tweaks (dev only — not needed in prod) |
| `og.png` | 1200×630 Open Graph preview image |

---

## Responsive Breakpoints

| Breakpoint | Changes |
|---|---|
| `≤ 980px` | Hero switches to 1-column (chat agent below copy) |
| `≤ 900px` | About, Contact, Projects → 1-column |
| `≤ 720px` | Wrap padding: 40px → 20px; section padding: 96px → 64px; nav labels hidden |
| `≤ 600px` | Contact form: 2-col → 1-col |

---

## Content To Update Before Going Live

- [ ] `resume.pdf` — place at root `/public/resume.pdf`
- [ ] Email — update all `aadubey1106@gmail.com` references
- [ ] Photo — to be added (placeholder currently omitted by design)
- [ ] `og:url` meta tag — update to real domain
- [ ] `NowPlaying` items in `js/nowplaying.jsx` — refresh monthly
- [ ] Certs — flip `status: "pending"` → `"earned"` when AWS/NVIDIA exams pass
- [ ] Rate limiting on AI chat route — before going public

---

## Handoff Summary for Claude Code

> Open `Portfolio.html` in a browser first. Scroll through every section. Click the project architecture buttons. Run the RAG playground. Use the chat. Type ⌘K. That is what you are building — pixel-for-pixel, interaction-for-interaction — in a Next.js + TypeScript + Tailwind production app.
>
> Every design decision is documented above. When in doubt, look at the source JSX in the `js/` folder — it is the ground truth.
