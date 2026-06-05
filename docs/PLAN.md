# Build Plan — Ayush Dubey's "Latent Space" Portfolio

> Production port of the `design_handoff/` prototype to a real Next.js site.
> Review this end-to-end, then say "go" (or send revisions) and I'll implement.

---

## 1. Context

You designed your portfolio in Claude Design and dropped the bundle into `C:\Users\dev\Downloads\Portfolio Website\design_handoff\` — a high-fidelity HTML/JSX prototype (`Portfolio.html` + `js/*.jsx`) backed by a detailed README spec.

The site is themed **"Latent Space"**: a dark, terminal-styled AI/ML portfolio with:
- live training-metrics status bar
- particle-cluster hero canvas
- in-page chat agent (Ayush.AI)
- working RAG playground over a 10-chunk corpus
- 5 project cards with animated SVG architecture diagrams
- interactive 33-node skills graph
- ⌘K command palette
- Konami easter egg

The handoff JSX is **reference material, not production code**. The task is to recreate it pixel-for-pixel in **Next.js 14+ (App Router) + TypeScript + Tailwind**, with chat + RAG wired to **Anthropic's API server-side** and rate-limited.

**Source-of-truth files** (read-only during the port):
- `design_handoff/Portfolio.html` — top-level structure, meta, font/CSS-var declarations
- `design_handoff/README.md` — full design spec (tokens, sections, breakpoints, AI notes)
- `design_handoff/js/*.jsx` — exact JSX for every section
- `design_handoff/og.png` — copy to `/public/og.png`

**Decisions you already approved:**
- Project location: `./portfolio/` sibling of `design_handoff/`
- AI integration: wire to real Anthropic API now (we'll need an `ANTHROPIC_API_KEY`)
- Build scope: full end-to-end pass
- Resume: placeholder `resume.pdf` until you provide the real one

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14+ App Router |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties (oklch tokens) |
| Fonts | `next/font/google` — Space Grotesk + IBM Plex Sans + JetBrains Mono |
| Animation | Framer Motion (sparingly) + native CSS keyframes |
| Canvas | React + native Canvas API |
| AI | `@anthropic-ai/sdk` (server-only) — model `claude-haiku-4-5` |
| Rate limit | `@upstash/ratelimit` + `@upstash/redis` |
| Validation | `zod` for API route bodies |
| Deploy | Vercel |

---

## 3. Project Layout

Scaffolded with:
```
cd "C:\Users\dev\Downloads\Portfolio Website"
npx create-next-app@latest portfolio --typescript --tailwind --app --eslint --src-dir=false --import-alias "@/*"
```

Final structure under `C:\Users\dev\Downloads\Portfolio Website\portfolio\`:

```
app/
  layout.tsx                      # fonts, metadata, global chrome, palette + konami mounts
  page.tsx                        # composes sections in order
  globals.css                     # :root oklch tokens, body bg, scanlines, keyframes
  _components/
    chrome/{StatusBar.tsx, NavBar.tsx, Background.tsx}
    hero/{Hero.tsx, ChatAgent.tsx, LatentCanvas.tsx}
    nowplaying/NowPlaying.tsx
    about/{About.tsx, SkillWeights.tsx}
    playground/{LiveRAGPlayground.tsx, PipelineStage.tsx}
    projects/{Projects.tsx, ProjectCard.tsx, ArchDiagram.tsx}
    experience/{Experience.tsx, Education.tsx}
    certs/Certifications.tsx
    skills/SkillsGraph.tsx
    contact/{Contact.tsx, ContactForm.tsx, Footer.tsx}
    palette/CommandPalette.tsx
    konami/KonamiListener.tsx
    shared/{Chip.tsx, Icon.tsx, SectionHead.tsx, StatusPill.tsx}
  _data/{projects.ts, experience.ts, certs.ts, nowplaying.ts, skills.ts, corpus.ts, types.ts}
  _hooks/{useInView.ts, useElementSize.ts, useReducedMotion.ts, useRotatingIndex.ts, useMounted.ts}
  _lib/{persona.ts, parseAction.ts, ragScore.ts, mulberry32.ts}
  api/
    chat/route.ts
    rag-generate/route.ts
lib/{anthropic.ts, ratelimit.ts}
public/{resume.pdf (placeholder), og.png, favicon.svg}
.env.local                        # ANTHROPIC_API_KEY, UPSTASH_REDIS_REST_URL/TOKEN
.env.example                      # documented blank version
next.config.mjs
tailwind.config.ts
```

---

## 4. Design-Token Layer

- Port `:root` oklch palette + radii + font-stack vars from `Portfolio.html` lines ~23–48 into `app/globals.css` **verbatim**. Keep `oklch()` — do not convert.
- Load fonts via `next/font/google` in `layout.tsx` and bind to `--f-display / --f-body / --f-mono`.
- `tailwind.config.ts` extends `theme.colors` with proxy tokens pointing at the CSS vars (`bg: 'var(--bg)'`, `accent: 'var(--accent)'`, etc.) so utilities like `bg-bg-1` / `text-fg-mute` work without losing the oklch source.
- Body `::before` (dotted grid), `body.scanlines::after` (CRT lines), and `@keyframes pulse|dot|blink|weightFill` all live in `globals.css`.

---

## 5. Data Layer (`app/_data/`)

Typed exports in `types.ts`, populated from the JSX prototypes' const arrays:

- `Project` — id `01..05`, name, subtitle, company, status, blurb, `metrics[3]`, `stack[]`, `github`, `tag`
- `ExperienceEntry` — 5 entries newest first (Quantum Horizon → Samarth → Bhairav → Arkham → IntellAI) + Education (B.Tech AI/ML, Thakur College, 2021–2025, GPA 8.20)
- `Cert` — 5 entries with `status: 'earned' | 'in-progress' | 'planned'`
- `NowPlayingItem` — 8 items, rotation cadence 3400 ms
- `SkillNode` — 33 nodes across 7 groups (lang/ml/dl/nlp/llm/mlops/infra) + `SkillEdge` (~30 edges)
- `CorpusChunk` — 10 chunks (doc01–doc10) covering all 5 projects + bio + skills

**Content is canonical** — bio, project blurbs, metrics, experience bullets copied verbatim from the JSX.

---

## 6. Build Phases (full end-to-end pass)

### Phase 0 — Foundations
Scaffold project. Install deps. Wire tokens, fonts, `Background`, empty `page.tsx`. Verify typography + body chrome match `Portfolio.html`.

### Phase 1 — Chrome + Hero copy
- **StatusBar** — sticky 30 px, live `epoch / loss / val_acc / gpu` updating every 1.1 s + UAE clock. Timers start in `useEffect`; all numeric cells `suppressHydrationWarning`.
- **NavBar** — sticky `top: 30px`, numbered links 01–07, `⌘K` pill.
- **Hero left column** — meta pills, h1 two lines, body copy, CTA buttons, social links (no canvas, no chat yet).

### Phase 2 — The wow factor
- **LatentCanvas** (`'use client'`, mount-only): particles seeded via `mulberry32(42)`; 4 clusters (LLM/RecSys/MLOps/CV); sinusoidal drift + spring return; mouse repulsion; intra-cluster line connections. Particle count `(w*h)/9000 * density`, halved on `pointer:coarse`; RAF paused by IntersectionObserver and `prefers-reduced-motion`; DPR capped at 2.
- **ChatAgent UI** with **local commands only** (`whoami`, `ls`, `ls projects`, `help`, `clear`, `contact`) — short-circuit before any fetch. Quick-prompt chips wired but disabled until Phase 3.

### Phase 3 — API routes
- **`app/api/chat/route.ts`** (edge runtime): Zod-validated body (`messages[]`, max 20), Upstash sliding window 20 req / 15 min / IP, system prompt from `app/_lib/persona.ts` (moved out of `js/hero.jsx`), `claude-haiku-4-5`, `max_tokens: 700`. Response: `{ text }`.
- **`app/api/rag-generate/route.ts`** (edge): input `{ query, contexts: { n, title, text }[] }`, system "Answer using ONLY the retrieved context below. Cite [n]. 2–4 sentences. No markdown.", Upstash 10 req / 15 min / IP.
- **`lib/anthropic.ts`** (server-only singleton), **`lib/ratelimit.ts`** (two named limiters).
- **`app/_lib/parseAction.ts`**: unit-testable parser for `<action type="scroll|open|expand" target="…" label="…"/>`.
- Flip **ChatAgent** to fetch `/api/chat`; render action button below message; `scroll` → `scrollIntoView`, `open` → `window.open`, `expand` → `window.dispatchEvent(new CustomEvent('portfolio:expand-project', { detail: id }))` + scroll.

### Phase 4 — Long sections
- **NowPlaying** — `useRotatingIndex(8, 3400)`, pause on hover, SSR renders index 0.
- **About** + **SkillWeights** — 6 bars with `weightFill` keyframe triggered by `useInView`, staggered delay; reduced-motion → instant.
- **LiveRAGPlayground** — client-side TF `score()` retrieval, rerank top-3, three-stage state machine (idle → retrieve → rerank → generate → done) choreographed with `setTimeout` (550/650 ms then API call), citation chips via regex split on `\[\d+\]`. 4 preset chips.
- **Projects** + **ArchDiagram** — each card holds `expanded` state and listens for the `portfolio:expand-project` custom event so the ChatAgent's `expand` action works. 5 SVG diagrams (viewBox 800×220), each with an `<animateMotion>` trace circle cycling edges every 700 ms (paused off-screen).
- **Experience** — server component; vertical timeline, 5 entries + education block.
- **Certifications** — server; 5 cards; earned/in-progress/planned badges.
- **SkillsGraph** (`'use client'`) — `useElementSize` for responsive viewBox; node positions stored as % then multiplied; hover state highlights node + direct neighbors, dims everything else to opacity 0.15; legend top-right; hint bottom-left.
- **Contact** + **ContactForm** — mailto submission with 1.2 s "compiling message → routing to inbox…" state.
- **Footer** — ASCII "AYUSH" block + Konami hint.

### Phase 5 — Interactivity
- **CommandPalette** (`'use client'`): mounted in `layout.tsx`. Opens on `Cmd/Ctrl+K` or `/` (only when `document.activeElement` is not an input/textarea). `↑↓` navigate, `Enter` execute, `Esc` close. 14 commands (nav 01–07 + GitHub + LinkedIn + email + resume + scanlines toggle + Konami trigger + console hint). `role="dialog" aria-modal="true"`, focus trap, restores focus on close.
- **KonamiListener** (`'use client'`): window keydown buffer for `↑↑↓↓←→←→ba` → `document.body.classList.toggle('neural-mode')` + portal toast "🧠 NEURAL MODE — overclocked" for 1800 ms.
- **Console easter egg**: small `'use client'` component logs styled `whoami` message on mount.

### Phase 6 — A11y, perf, deploy
- `prefers-reduced-motion` honored in LatentCanvas, SkillWeights, NowPlaying, Konami toast, ArchDiagram traces.
- aria-labels on nav + chat (`role="log" aria-live="polite"`); focus rings via `:focus-visible { box-shadow: 0 0 0 4px var(--accent-soft) }`.
- IntersectionObserver pauses LatentCanvas + ArchDiagram traces when off-screen.
- `dynamic(() => import('./LatentCanvas'), { ssr: false })` and same for `SkillsGraph` to keep client bundle slim.
- Lighthouse target ≥ 90 Perf / 95 a11y / 100 SEO / 90 BP.

---

## 7. SSR / Hydration Discipline

- **No `Date.now()` / `Math.random()` / `Intl.DateTimeFormat(..., { timeZone: 'Asia/Dubai' })` during render.** Initial server render emits `--` placeholders; effects start timers post-mount.
- All four StatusBar metric cells: `<span suppressHydrationWarning>{value}</span>`.
- LatentCanvas seeds and starts RAF inside `useEffect`. SSR ships an empty `<canvas/>`.
- ChatAgent's initial greeting message: no `Date.now()` in `useState` initial — assign timestamps inside `useEffect`.
- Mark interactive trees `'use client'` at the smallest possible boundary so most of the page stays an RSC.

---

## 8. AI Routes — Reference Pseudocode

```ts
// app/api/chat/route.ts
export const runtime = 'edge';
import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { rateLimit } from '@/lib/ratelimit';
import { SYSTEM_PERSONA } from '@/app/_lib/persona';

const Body = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string().max(2000),
  })).min(1).max(20),
});

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for') ?? 'anon';
  const { success } = await rateLimit.chat.limit(ip);
  if (!success) return Response.json({ error: 'rate_limited' }, { status: 429 });

  const parsed = Body.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: 'bad_request' }, { status: 400 });

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });
  const r = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 700,
    system: SYSTEM_PERSONA,
    messages: parsed.data.messages,
  });
  const text = r.content.map(c => c.type === 'text' ? c.text : '').join('');
  return Response.json({ text });
}
```

`rag-generate/route.ts` mirrors this shape with a smaller cap (10 req / 15 min) and the grounded system prompt.

---

## 9. Existing Utilities to Reuse / Port

**From `design_handoff/js/shared.jsx`** — port to TypeScript, do not re-derive:
- `useInView()` (IntersectionObserver, threshold 0.12) → `app/_hooks/useInView.ts`
- `useElementSize()` (ResizeObserver) → `app/_hooks/useElementSize.ts`
- `mulberry32(seed)` → `app/_lib/mulberry32.ts`
- `Chip`, `StatusPill`, `SectionHead`, `Icon` (inline SVGs: arrow, github, linkedin, external, download, mail, send, cmd, sparkle) → `app/_components/shared/`

**From `design_handoff/js/hero.jsx`** — port to server-only module:
- `SYSTEM_PERSONA` → `app/_lib/persona.ts` (never imported by client code; ESLint rule to enforce).

**From `design_handoff/js/playground.jsx`:**
- `CORPUS` array + `score()` keyword retrieval → `app/_data/corpus.ts` + `app/_lib/ragScore.ts` (stays client-side; ~4 KB payload).

---

## 10. Environment Variables (`.env.local`)

```
ANTHROPIC_API_KEY=sk-ant-...                  # required, server-only
UPSTASH_REDIS_REST_URL=https://...            # required for rate limiting
UPSTASH_REDIS_REST_TOKEN=...
NEXT_PUBLIC_SITE_URL=https://ayushdubey.ai    # optional, for metadataBase
```

`.env.example` shipped in the repo with blank values + a comment pointing to console.anthropic.com and console.upstash.com.

**You'll need to provide:** `ANTHROPIC_API_KEY` (sign up at console.anthropic.com), and create a free Upstash Redis db at console.upstash.com for the rate-limit credentials.

---

## 11. Content to Supply Later

- `public/resume.pdf` (placeholder for now — link will work but file is a stub)
- Real production domain (for `NEXT_PUBLIC_SITE_URL` + `og:url`)
- Optional: refresh `nowplaying.ts` items monthly; flip cert `status` when exams pass

---

## 12. Verification Plan

End-to-end checks before declaring done:

1. **Visual diff** — open `design_handoff/Portfolio.html` and `localhost:3000` side-by-side at 1440 / 980 / 720 / 600 px. Every section must match: spacing, colors, font weights, hover states.
2. **StatusBar** — metrics drift on a 1.1 s cadence; UAE clock matches a UTC+4 reference; no hydration warnings in DevTools.
3. **Hero canvas** — 4 labeled clusters render; mouse repulsion within ~120 px; intra-cluster lines appear. With "Reduce motion" forced, canvas renders static frame.
4. **ChatAgent**
   - Local: `whoami` / `ls` / `ls projects` / `help` / `clear` / `contact` short-circuit (no network).
   - Network: free-form question hits `/api/chat`, returns text; if `<action>` tag present, rendered button scrolls / opens / expands as appropriate.
   - Rate limit: 21st request in a 15-min window returns 429 with friendly UI message.
5. **NowPlaying** — cycles every 3.4 s; hover pauses.
6. **About** — weight bars animate on first scroll into view; reduced-motion → instant fill.
7. **RAG playground** — preset chip → retrieve (5 chunks shown) → rerank (top-3 boosted) → generate (final answer with `[1][2][3]` citation chips). Custom query works too.
8. **Projects** — each card expands inline; ArchDiagram trace circle visibly cycles edges every 700 ms; collapse button works.
9. **Experience / Certifications** — content matches JSX; "in-progress" amber dot pulses.
10. **SkillsGraph** — hovering a node highlights neighbors only; others dim to 0.15; ResizeObserver re-lays out on window resize.
11. **Contact** — name+email+message → `mailto:` opens with prefilled subject + body.
12. **CommandPalette** — `⌘K` / `Ctrl+K` / `/` open; ↑↓ navigate; Enter executes; Esc closes; "Toggle scanlines" + "Activate neural mode" work.
13. **Konami code** — `↑↑↓↓←→←→ba` toggles neural-mode body class + shows 1.8 s toast.
14. **Console** — page-load styled log message visible in DevTools.
15. **Lighthouse (mobile + desktop)** — ≥ 90 Perf / 95 a11y / 100 SEO / 90 BP. Zero hydration warnings.
16. **Deploy** — Vercel preview build green; ENV vars set; `/api/chat` + `/api/rag-generate` reachable; `og.png` shows in social-preview debuggers.

---

## 13. Risks & Mitigations

| Risk | Mitigation |
|---|---|
| Mobile canvas perf | Cap particles at `Math.min(400, w*h/3000)`, halve on `pointer:coarse`, pause off-screen, bypass under reduced-motion. |
| API key leakage | Only `lib/anthropic.ts` (server) imports the SDK. ESLint `no-restricted-imports` blocks `@anthropic-ai/sdk` in any `'use client'` file. |
| Rate-limit shared-NAT lockout | Bucket by IP + a session cookie; UI shows `retry-after` countdown on 429. |
| Hydration mismatches on live clock / metrics | `suppressHydrationWarning` + effect-mount initialization. |
| Safari `animateMotion` quirks | Verified during step 8 of verification; JS-driven RAF trace fallback ready if needed. |
| Bundle bloat | `@anthropic-ai/sdk` server-only; heavy clients (`LatentCanvas`, `SkillsGraph`) `dynamic(..., { ssr: false })`. |

---

## 14. Critical Files to Create

- `portfolio/app/layout.tsx`
- `portfolio/app/page.tsx`
- `portfolio/app/globals.css`
- `portfolio/app/_components/hero/LatentCanvas.tsx`
- `portfolio/app/_components/hero/ChatAgent.tsx`
- `portfolio/app/_components/playground/LiveRAGPlayground.tsx`
- `portfolio/app/_components/skills/SkillsGraph.tsx`
- `portfolio/app/_components/projects/ArchDiagram.tsx`
- `portfolio/app/api/chat/route.ts`
- `portfolio/app/api/rag-generate/route.ts`
- `portfolio/app/_lib/persona.ts`
- `portfolio/lib/anthropic.ts`
- `portfolio/lib/ratelimit.ts`
- `portfolio/tailwind.config.ts`
- `portfolio/.env.example`

---

## 15. Estimated Effort

- Phase 0–1 (scaffold + chrome + hero copy): ~half a working session
- Phase 2 (canvas + chat UI): ~half a session
- Phase 3 (API routes + rate limiting): ~quarter session
- Phase 4 (the 8 long sections): ~full session (this is the bulk)
- Phase 5 (palette + Konami): ~quarter session
- Phase 6 (a11y / perf / deploy): ~quarter session

Roughly **2.5–3 focused sessions** end-to-end. Each phase produces a working, viewable site — so we can pause and inspect between phases if you want.

---

## When you're ready

Reply **"go"** to start Phase 0, or send revisions (scope cuts, stack swaps, content edits, ordering changes) and I'll fold them in before we start.
