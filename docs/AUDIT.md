# Portfolio Website — End-to-End Audit

## Context

This is an audit of the Next.js portfolio at `portfolio/` against `PLAN.md` (the design-handoff port spec) and `design_handoff/`.

The brief was: (1) find any bugs, dead code, wrong logic, or incomplete code, (2) identify gaps that make the site incomplete as a portfolio, and (3) brainstorm additions only if zero bugs/gaps are found.

Every finding below was verified by reading the actual file with the line number cited. **No application code was changed during the audit** — this is a planning document only.

Point (3) is moot because there are far more than zero bugs/gaps.

---

## A — Architectural / Critical (blockers for a "real" portfolio)

### A1. Entire site is one 587-line `"use client"` file
- `portfolio/app/_components/PortfolioApp.tsx` is a single monolith holding **all** UI, data arrays, hooks, utilities, AND a 23-line CSS-in-JS template literal at the bottom (`const styles = …`, lines 565–586) that is injected via `<style>{styles}</style>` at line 196.
- Effect: zero RSC for the entire homepage, no code-splitting, the full ~30 KB component (plus inline CSS) ships on first paint, and editing any section means touching one giant file.
- `PLAN.md` explicitly required a modular tree under `app/_components/{chrome,hero,nowplaying,about,playground,projects,experience,certs,skills,contact,palette,konami,shared}` plus `app/_hooks/`, `app/_lib/`, `app/_data/`. **None of those directories exist.** The only file under `app/_lib/` is `persona.ts`.

### A2. Inline `<style>{styles}</style>` instead of CSS / Tailwind
- All component CSS is one 23-line minified string at the bottom of `PortfolioApp.tsx`. This:
  - Renders the stylesheet through the client component instead of as a static CSS asset,
  - Defeats Tailwind v4 (the project imports `tailwindcss` in `globals.css:1` but the components never use a Tailwind utility class — every visual rule lives in the inline string),
  - Is impossible to lint, can't use CSS variables ergonomically (you have to escape `{`/`}`), and breaks SSR caching.
- The PLAN explicitly said Tailwind + CSS variables. Either commit to one approach or the other, but not both.

### A3. AI provider was silently swapped from Anthropic → Cloudflare Workers AI
- `PLAN.md` §2 + §8 mandates `@anthropic-ai/sdk` with `claude-haiku-4-5`. Neither the SDK nor the env var (`ANTHROPIC_API_KEY`) is anywhere in the repo. Instead:
  - `lib/cloudflare-ai.ts` posts to `api.cloudflare.com/.../ai/run/@cf/google/gemma-4-26b-a4b-it`.
  - `.env.example` documents only `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_AI_MODEL`.
  - `package.json` has no `@anthropic-ai/sdk`.
- This is a legitimate design pivot, **but**:
  - The default model `@cf/google/gemma-4-26b-a4b-it` (`cloudflare-ai.ts:25`) is currently documented by Cloudflare Workers AI, so the earlier "invalid model ID" concern is stale. Still verify it with the actual account/region during implementation because model availability can vary by provider rollout.
  - The chat header in the UI announces `"ayush-agent - workers-ai + scroll-actions"` (`PortfolioApp.tsx:395`) — fine if intentional, but it removes the "Ayush.AI" branding from the chat chrome.
- The user should explicitly decide: keep Anthropic (per PLAN), keep Cloudflare (and lock the choice down in docs/env/branding), or offer both with a fallback.

### A4. API routes run on `nodejs` runtime, not `edge`
- `app/api/chat/route.ts:6` and `app/api/rag-generate/route.ts:5` both set `runtime = "nodejs"`. PLAN required `edge` for latency + the Upstash sliding window. Not a bug per se, but a silent deviation.

### A5. No focus trap / focus restoration in the command palette
- `CommandPalette` (`PortfolioApp.tsx:561`) opens with `role="dialog" aria-modal="true"` and auto-focuses the input, but:
  - **No focus trap** — Tab walks straight out of the dialog into the page behind it.
  - **No focus restoration** — when the palette closes, focus is lost (lands on `<body>`).
  - **No `aria-label` / `aria-labelledby`** on the dialog itself.
  - **No empty state** ("no commands match") and **no footer** ("X of Y · ↑↓ navigate"), both present in the handoff.
  - Konami buffer is wired inside the same `useEffect` as the open/close handler, so pressing ArrowUp/ArrowDown to navigate the palette list also advances the Konami counter — flaky and surprising.

### A6. `prefers-reduced-motion` is broken for the canvas
- `globals.css:121` adds a blanket `@media (prefers-reduced-motion: reduce)` rule, but it only sets `animation-duration:.001ms` on CSS animations. **It cannot stop `requestAnimationFrame`** in `LatentCanvas`. The canvas keeps drawing 60 fps regardless.
- Same problem for `ArchDiagram` (`<animateMotion>` is technically a SMIL animation so the CSS rule may dampen it, but the JS-driven 700 ms cycle in `setInterval` at `PortfolioApp.tsx:425` will still tick) and for `NowPlaying`'s `setInterval` (`:401`).
- PLAN §6 §13 explicitly required reduced-motion bypass for all three.

---

## B — Functional bugs

### B1. NavBar "Cmd+K" button dispatches a synthetic `KeyboardEvent` that triggers the listener but is brittle
- `PortfolioApp.tsx:229` calls `window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", ctrlKey: true }))`. Modern browsers do honor `key`/`ctrlKey` from the constructor, so this works — but the button label is `Cmd+K` and the dispatch uses `ctrlKey`, so a Mac user clicking it will see "Ctrl+K" semantics. It also bypasses every other keydown handler on the page (intentional or not). Cleaner: call `setOpen(true)` directly via a shared ref/context.

### B2. CommandPalette is missing 3–4 commands
- Handoff (`design_handoff/js/commandpalette.jsx:9–24`) has **14 commands**: nav 01–07, GitHub, LinkedIn, **Email (mailto)**, **Download resume.pdf**, Toggle Scanlines, Activate Neural mode, **Tip · Open the browser console**.
- Port (`PortfolioApp.tsx:561`) has **11**: missing Email, Download resume.pdf, and the Console tip.
- The separator in labels is also wrong: handoff uses `·` (middle dot), port uses `-`.

### B3. NowPlaying has 6 items, handoff has 8
- Port (`PortfolioApp.tsx:399`) is missing `{ lbl: "listening", val: "Lo-fi · Tycho radio", tag: "audio" }` and `{ lbl: "open to", val: "Senior IC / Staff AI roles · Q3 2026", tag: "hire" }`, and "weekend hack" was renamed to "building toward" (tag `lab` instead of `fun`).
- Also missing the **little dot pager** the handoff has (the `.np-dots` row of 8 indicator pills under each item showing rotation position).

### B4. Certifications status logic is inconsistent
- Data has three states: `"earned"`, `"pending"`, and one cert literally labelled `"Planned - 2026"` in its `when` string but still tagged `"pending"` (`PortfolioApp.tsx:39–43`).
- Render at `:471` collapses to a binary: `status==="earned" ? "earned" : "in progress"`. The "planned" cert (NCA-AIAA) renders as "in progress", which is misleading.
- The section-head meta `"// 2 earned - 3 in flight"` is hard-coded (`:471`); the handoff computed it dynamically. If you add or finish a cert, the count rots.

### B5. Experience entry #2 has an implausible date
- `PortfolioApp.tsx:32`: `"09/2025 - 10/2025"` for Samarth Life Sciences (Freelance). Quantum Horizon is `"2025 - present"`. Today is 2026-05-16, so these two roles overlap (Samarth Sep–Oct 2025 vs Quantum 2025–present). Either the Samarth dates should be earlier (e.g. `09/2024 - 10/2024`), or Quantum's start date is wrong. Worth flagging to the user — only they know the truth.

### B6. SkillWeights animation does not use `useInView`
- PLAN §4 (Phase 4) says: "6 bars with `weightFill` keyframe triggered by `useInView`, staggered delay; reduced-motion → instant."
- Port (`PortfolioApp.tsx:406`) just sets `animationDelay: ${i*.08}s` on the `<em>` and lets CSS run `weightFill 1.4s` (`globals.css:74`, applied via `.wt em` in the inline `styles` blob `:571`). It fires **on initial render**, not on scroll into view. If the section is below the fold on load, the animation has already played by the time the user gets there.

### B7. StatusBar ships fake metric values on the server render
- PLAN §7: "Initial server render emits `--` placeholders; effects start timers post-mount."
- Port (`PortfolioApp.tsx:217`) initializes `useState({ loss: 0.0247, epoch: 1247, gpu: 73, acc: 94.3, … })`. Those numbers are baked into the SSR HTML. `suppressHydrationWarning` is on the b elements so React doesn't complain, but the page flashes those exact stale numbers before JS hydrates.
- Only `time` uses the proper `--:--:--` placeholder.

### B8. ChatAgent does not handle API error statuses correctly
- `PortfolioApp.tsx:390–393`: `fetch()` does not throw for HTTP 400/429/500. The current code calls `await r.json()` and then parses `j.text || ""`, so a route error such as `{ error: "rate_limited" }` can render as a blank assistant message instead of a useful error.
- True network failures still fall into the catch block and render `"Model connection is not configured yet. Local commands still work."`, which is misleading for transient outages.
- The route returns `{ error: "rate_limited" }` with status 429, `{ error: "bad_request" }` with 400, and `{ error: message }` with 500 — the UI should check `r.ok`, branch on status/error, and show meaningful copy ("rate-limited, try again in 15 min" etc.).

### B9. ChatAgent sends bot messages with `role: "assistant"` but local stub messages never reach the API
- Fine in steady state, but the **initial greeting** `"Hey - I'm Ayush.AI…"` is included in the conversation sent to the model on the first turn (`:390` `msgs.map(...)`). On Anthropic that's harmless; on a "system + user/assistant strict alternation" provider it could 400. With Cloudflare's chat schema it's allowed — but worth knowing if you migrate.

### B10. `parseAction` regex is order-sensitive and dies on quotes in labels
- `PortfolioApp.tsx:181–183`: pattern `<action\s+type="…"\s+target="…"\s+label="…"\s*\/?>` requires the three attributes in that exact order and uses `[^"]+`, so any `&quot;` / `\"` / un-escaped quote inside `label` breaks the parse silently. The persona's example tags happen to match, so the parser usually works — but it's fragile.

### B11. CommandPalette `/` shortcut is acceptable but open-state handling is loose
- `:561` correctly guards on `!/INPUT|TEXTAREA/.test((document.activeElement?.tagName)||"")`, so `/` typed inside the palette input behaves normally and does not reopen the palette.
- Minor cleanup: the global listener can still call `setOpen(true)` without checking current `open` state when focus is outside inputs. This is not a blocker, but the handoff's `!open` guard is cleaner.

### B12. CommandPalette never resets `q` / `sel` when opened
- Handoff (`commandpalette.jsx:46–48`) does `setQ(""); setSel(0)` inside the open-effect. Port omits this — the previous search query and selection persist between opens.

### B13. Konami listener allows overlapping toasts on rapid re-trigger
- `toast()` (`:563`) appends a new `div.toast` and removes that captured node after 1800 ms. If you fire Konami twice within 1800 ms, two centered toasts overlap. Minor, but easy to avoid by reusing/removing an existing toast before appending another.

### B14. Konami sequence collides with palette arrow navigation
- The handler is registered on `window` and is **not** suppressed when the palette is open. Pressing ↑↑↓↓ to scroll the palette list also advances the Konami buffer (see A5). Easy to accidentally enable neural-mode.

### B15. ChatAgent `runAction` for `expand` waits 100 ms then scrolls
- `:375`: `setTimeout(() => document.querySelector(`#project-${a.target}`)?.scrollIntoView(...), 100)`. If the project card hasn't expanded by then (Projects component listens for the event and updates state), the scroll target's measured position may be wrong because the expanded `<div class="arch">` hasn't been laid out. Should be a `requestAnimationFrame` chain or a layout-stable wait.

### B16. ChatAgent expand action assumes target is just the project id
- `:381–384`: local commands wire `target: "#projects"`, but the persona's example uses `target="01"` for `expand` (`persona.ts:21`). The UI handles `expand` by dispatching `portfolio:expand-project` with `{ id: "01" }` and then scrolling to `#project-01`. The IDs in `ARCH` use `"01"…"05"`. This is consistent — but the dual convention (`#anchor` for scroll, bare id for expand) is undocumented and brittle.

### B17. RAG playground busy-state was checked; no blocker found
- `:410`: the catch falls through to the same `setStage(4)` line after the catch block, so the busy state clears in both success and fallback paths.
- If the user clicks Run twice rapidly, the guard `if(!Q||stage) return;` blocks the second run while the first is active. Nothing to fix here; this is retained only as an audited code path.

### B18. Footer doesn't render an ASCII "AYUSH" block
- PLAN §6 (Phase 4): "Footer — ASCII 'AYUSH' block + Konami hint."
- Port (`:560`): `<pre>{`        AD // hint: up up down down left right left right BA`}</pre>` — just "AD" with the hint, no ASCII art.

### B19. Contact form: after `setSent(true)` the form never resets
- `:559`: 900 ms after submit, the page navigates via `location.href = mailto:…`. The mailto opens the user's mail client but doesn't navigate the page (on most platforms), so the form is left in its `sent=true` state forever. Refresh required to send another. Acceptable for a portfolio form, but worth a 5-second "reset" after the mail client fires.

### B20. Persona action examples are listed as "at most one … at the very end"
- `persona.ts:13`: "You may include at most one action tag at the very end". The eight examples that follow on lines 14–21 are presented one per line, which a small model may interpret as a menu to pick from rather than format examples. Recommend wrapping them with `For example:` and showing them in inline form.

---

## C — Content drift vs. the design handoff

These are direct content divergences from `design_handoff/js/*.jsx`. The user designed the original copy intentionally; the port softened several voice-y bits.

### C1. Hero status pill
- Handoff (`hero.jsx:109`): `"Available for select roles · Q3 2026"`.
- Port (`PortfolioApp.tsx:232`): `"Building production AI systems"`.

### C2. Hero bio truncation
- Handoff has a punchy closing: "turning game-data into predictions, and predictions into product."
- Port drops it.

### C3. About bio — three rewrites
- Handoff Para 1 mentions "owning a hybrid recsys pipeline end-to-end (data → model → deploy → monitor)". Port replaces with generic "currently building recommender systems and fraud-detection".
- Handoff Para 2 ends with "and the 3am alert that the pipeline silently NaN'd." Port drops the 3am line.
- Handoff closing line: "or losing money to my own stock-market agent ;)" → Port: "or testing eval harnesses." (Loses the joke, which is a Senior IC personality signal.)

### C4. About skill labels lost parentheticals
- "Recommender systems (LightFM)" → "Recommender systems"; "MLOps (MLflow, DVC, K8s)" → "MLOps".

### C5. Project blurbs softened
- Project 01: "~M users" → "millions of users"; the "9am every Monday metrics dashboard" punchline is gone.
- Project 03: removed the closing "The kind of repo I wish I'd had when I started."
- Project 04: dropped framework names "(CrewAI + Gemini)" and the agent role list ("fundamental analyst, technical analyst, strategist").
- Project 05: "not vibes" removed.

### C6. Experience bullets shortened
- E.g. handoff: "Built and shipped a production hybrid recommender (LightFM) end-to-end as the sole ML owner — data pipelines, training, serving, monitoring." Port: "Built and shipped a production hybrid recommender as the sole ML owner." All the proof-of-depth is in the omitted clauses.

### C7. Footer rewritten
- Handoff: `"© 2026 — Ayush Dubey · built with HTML, CSS, and an embarrassing amount of caffeine"`.
- Port: `"Copyright 2026 - Ayush Dubey - built with Next.js, TypeScript, and Tailwind"`.

### C8. Resume label
- Handoff: `"résumé"` (accented) and `"resume.pdf ↓"` with arrow.
- Port: `"resume"` and `"resume.pdf"` (no arrow). The contact-card label is the literal string `"resume"` instead of `"résumé"`.

### C9. `<meta name="theme-color">` not set
- `Portfolio.html:16` had `<meta name="theme-color" content="#0c1014">`. `app/layout.tsx` doesn't export `themeColor`. Mobile browser chrome won't match the dark theme.

### C10. SEO metadata softer than handoff
- Description loses "Try the live RAG playground." in the main `description` (it's kept only in `openGraph.description`).

### C11. `og.png` is shipped but the path style differs (`og.png` → `/og.png`) — fine functionally; mentioning for completeness.

---

## D — Hygiene / dead code / type safety

### D1. `@typescript-eslint/no-unsafe-function-type` disabled at the top of `PortfolioApp.tsx:2`
- Two casts to `as Function` inside `CommandPalette` (`:561`) instead of typing the command tuple as `[string, string, () => void]`. Easy fix.

### D2. `framer-motion` is in `package.json` but is **never imported**
- Dead dependency. Either use it (PLAN §2 said "sparingly") or remove it.

### D3. `eslint-disable react/jsx-no-comment-textnodes, react/no-unescaped-entities` (`:2`)
- These are disabled because section meta strings like `"// 6 weights - last trained: today"` and apostrophes in copy look like JSX comments. Fine, but tells you the source has a lot of inline strings that should be JSX expression children or constants.

### D4. `useElementSize` is defined but only used by `SkillsGraph`
- And it lives inline at `:170` instead of `app/_hooks/useElementSize.ts`. Fine if kept, but if extracted it would be reusable.

### D5. No `useInView`, `useReducedMotion`, `useRotatingIndex`, `useMounted` hooks
- PLAN §9 listed five hooks to port. None exist. The two that are actually needed (`useInView` for SkillWeights, `useReducedMotion` for canvas/now-playing) are the ones whose absence shows up as actual bugs (B6, A6).

### D6. `app/_data/*` directory does not exist
- All data lives inline at the top of `PortfolioApp.tsx`. Per PLAN §5 these should be 7 typed files. Not a bug, but it means data edits require a code edit in the giant client component.

### D7. `app/_lib/parseAction.ts`, `app/_lib/ragScore.ts`, `app/_lib/mulberry32.ts` missing
- All three are inlined into `PortfolioApp.tsx` (`:169`, `:181`, `:185`).

### D8. `package.json` script `dev` uses `--webpack`, `dev:turbo` uses `--turbopack`
- Next 16 defaults to turbopack; the two-script split is harmless but the README (still the create-next-app default) doesn't document it.

### D9. `next.config.ts` only sets `turbopack.root`
- No image-domain whitelist, no security headers (CSP, X-Frame-Options, Referrer-Policy), no `experimental` flags.

### D10. `lib/ratelimit.ts` memory limiter doesn't garbage-collect IP buckets
- The `Map<string, number[]>` grows for every unique IP forever. Not exploitable in practice (edge runtime instances recycle) but a real leak under nodejs runtime + long uptime.

### D11. `lib/ratelimit.ts` falls back silently if only one of `UPSTASH_*` vars is set
- `:18`: `Boolean(URL && TOKEN)` — if you typo'd the env, you silently get the in-memory limiter in production with no warning.

### D12. Cloudflare model choice should be documented and smoke-tested
- `:25`: `@cf/google/gemma-4-26b-a4b-it` is currently a documented Cloudflare Workers AI model, so this is not an invalid-ID bug. Keep it if Cloudflare is the chosen provider.
- Still add a deployment smoke test for `/api/chat`, because missing credentials, account-level model access, or provider outages will only surface at request time with the current code.

### D13. 429 responses have no `Retry-After` header or remaining-quota info
- Standard practice; would also let the chat UI display a real countdown.

### D14. Git layout needs an explicit deploy/commit decision
- `portfolio/.gitignore` does exist and correctly ignores `.env.local` via `.env.*`, so the earlier "no `.gitignore`" concern is wrong.
- There are two git repositories: the root `Portfolio Website/.git` and the nested `portfolio/.git`. Root currently sees `portfolio/` as an untracked directory, while the nested repo tracks the app files. Decide which repository is the source of truth before committing/deploying.

### D15. `public/` still has the create-next-app boilerplate
- `file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg` are dead assets.

### D16. `dev-server.log` is local-only and already ignored
- A leftover log file exists at `portfolio/dev-server.log`, but `portfolio/.gitignore` already ignores `*.log`. No action needed unless you want to delete local clutter.

### D17. Persona is correctly server-only (good)
- `persona.ts` is only imported by `app/api/chat/route.ts`. PLAN §13 asked for an ESLint `no-restricted-imports` rule to enforce this. Not added.

---

## E — Gaps that make this incomplete as a portfolio site

These are absent features a recruiter would expect, beyond the PLAN's checklist.

### E1. Real resume PDF
- `public/resume.pdf` is a 737-byte stub. Without a real CV, every "Download resume" link is a dud — and that's likely the single most-clicked element on the whole site.
- Important deploy caveat: `portfolio/.gitignore` currently ignores `public/resume.pdf`, so a git-based deployment will not include the resume at all unless the ignore rule is removed or a real PDF is force-added/tracked.

### E2. No 404 / error pages
- No `app/not-found.tsx`, no `app/error.tsx`. Users hitting a typo'd hash anchor get Next's default page. Cheap polish.

### E3. No `sitemap.ts` / `robots.ts`
- Next 14+ generates these from `app/sitemap.ts` / `app/robots.ts`. Without them, search engines can still index but crawlability is weaker and `og:url` resolution depends on `metadataBase`.

### E4. No structured data (JSON-LD `Person`)
- A small `<script type="application/ld+json">{Person…}</script>` in `layout.tsx` gives you a Google knowledge-panel-ready footprint. Costs ~20 lines.

### E5. No analytics
- Vercel Analytics, Plausible, or `@vercel/speed-insights` is one component and gives you click-through telemetry. Otherwise launching is blind.

### E6. No "View source" / "Built with" link to the repo of the portfolio itself
- Footer mentions Next/TS/Tailwind but doesn't link to the site's source. Minor signal of confidence.

### E7. No theme toggle
- The site is dark-only. Fine — but `prefers-color-scheme` is hardcoded.

### E8. No copy-to-clipboard on the email card
- `mailto:` opens a mail client, which many users don't have configured. A "Copy email" affordance is standard.

### E9. Hero canvas has no fallback for users who block JS
- The `<canvas>` ships empty. A `<noscript>` static background would prevent the hero from looking broken without JS. Minor.

### E10. No `next/image` for the OG asset / no static hero image fallback
- The site is canvas-driven, so this is fine, but the OG image preview can be improved (it currently shows the static `og.png`, which is a generic phosphor render).

### E11. No environment-validation at boot
- If `CLOUDFLARE_ACCOUNT_ID` is missing in production, the chat fails at first request rather than at deploy time. A small `lib/env.ts` with Zod validation surfaces config errors immediately.

### E12. No tests
- `parseAction`, `score`, and the RAG state machine are pure functions begging for 5 lines of Vitest each. PLAN §6 (Phase 3) said "unit-testable parser". Not unit-tested.

### E13. No CSP / security headers
- Add `headers` in `next.config.ts` (CSP, frame-ancestors none, referrer-policy strict-origin-when-cross-origin, permissions-policy).
- The earlier "accepts JSON from any origin" framing is too strong for browser clients because the route does not emit permissive CORS headers, but same-origin abuse, clickjacking, and general hardening are still worth addressing.

### E14. No loading skeletons for hydrated client trees
- LatentCanvas, SkillsGraph, RagPlayground all show nothing meaningful until JS arrives. Either render a static SSR fallback or add a one-line `<Suspense>` skeleton.

### E15. The "Ayush.AI" chat empty-state has no example queries beyond the 4 quick chips
- Once chips are clicked the user has no guidance. Easy improvement: rotate placeholders inside the input.

### E16. No projects "case-study" depth
- Each project card has a blurb + metrics + arch diagram, but no long-form writeup. Recruiters who care will want at least one project page with the story (problem → constraints → choices → result). Could be `app/projects/[id]/page.tsx`.

---

## Recommended fix order (if you give the go-ahead)

A pragmatic sequence that maximises shipped value per hour:

1. **Truth & dates** — fix Experience date typo (B5), add/track a real `resume.pdf` for deploy (E1), restore handoff copy in Hero/About/Projects/Experience/Footer (C1–C7).
2. **Make the AI actually work** — decide Cloudflare vs Anthropic (A3), document/smoke-test the Cloudflare model if kept (D12), wire 4XX/5XX error branches in ChatAgent (B8), add env validation (E11), add Retry-After (D13).
3. **Polish the missing UX** — add Email + Resume + Console-tip commands to the palette and switch separator to `·` (B2); restore 8 NowPlaying items + the dots pager (B3); fix CertStatus tri-state + dynamic counter (B4); ASCII AYUSH footer (B18); fix `useInView` for SkillWeights (B6); fix `prefers-reduced-motion` for canvas/intervals (A6).
4. **A11y hardening** — focus trap + restoration + aria-label on CommandPalette (A5); decouple Konami buffer from palette nav (B14).
5. **Architectural cleanup** — split `PortfolioApp.tsx` into `app/_components/**/*`, `app/_hooks/*`, `app/_lib/*`, `app/_data/*` per PLAN §3. This unblocks tree-shaking and lets you swap CSS-in-JS string for real Tailwind + globals.css.
6. **SEO + crawlability** — `themeColor` in metadata (C9), `app/sitemap.ts` + `app/robots.ts` (E3), JSON-LD Person (E4), analytics (E5), security headers (E13).
7. **Bonus** — tests for `parseAction` / `score` (E12), a single case-study page (E16), copy-to-clipboard email (E8), reset Contact form after submit (B19).

This plan is a **read-only app audit**. Only this planning document has been updated; no application code was modified. Approval simply means "this matches reality; here's what to actually touch."

---

## Open questions to resolve before any code changes

1. **AI provider lock-in**: Stick with Cloudflare Workers AI (current code; model ID is documented) or migrate back to Anthropic per the original PLAN? (Affects A3, D12, env docs, branding, and roughly 80 lines of code.)
2. **Architecture**: Refactor `PortfolioApp.tsx` into the modular tree (A1), or leave it as one file and just fix the bugs? Refactoring is ~1 session of mostly-mechanical work but pays off forever.
3. **Date for the Samarth role** (B5): is it `09/2025–10/2025` (overlapping Quantum Horizon) or should one of those start dates change?
4. **Copy restoration** (C1–C8): restore the handoff voice verbatim, or keep the softened tone the port has now? My read is the handoff voice is stronger.
5. **Git/deploy source of truth**: Use the nested `portfolio/.git` repo for commits/deploys, or collapse everything into the root repo? This affects whether `resume.pdf`, env ignores, and Vercel settings land where expected.
