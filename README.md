# Ayush Dubey — AI/ML Portfolio ("Latent Space")

A full-page personal portfolio for an AI/ML engineer, themed around AI/ML visual
metaphors: an animated neural-embedding hero canvas, a terminal-style status bar with live
"training" metrics, an interactive node-graph tech stack, an in-page AI chat agent, and a
working **RAG (retrieve → rerank → generate)** pipeline demo.

**Live:** https://ayush-ai-portfolio.vercel.app

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 + CSS custom-property design tokens |
| Animation | Framer Motion + native Canvas API |
| AI / Chat + RAG | Cloudflare Workers AI (`@cf/meta/llama-3.1-8b-instruct`) via server route |
| Rate limiting | Upstash Redis (`@upstash/ratelimit`), in-memory fallback in dev |
| Validation | Zod |
| Hosting | Vercel |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

### Environment variables

See `.env.example`. Required for the chat/RAG features:

- `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_AI_MODEL`

Optional:

- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` — production rate limiting
- `NEXT_PUBLIC_SITE_URL` — metadata base URL

`.env.local` is git-ignored — never commit real tokens.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server (Webpack) |
| `npm run dev:turbo` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Project layout

```
app/
  page.tsx              # entry → PortfolioApp
  _components/          # UI
  _lib/                 # AI persona / prompt
  api/chat, api/rag-generate   # server routes (Cloudflare AI)
lib/                    # cloudflare-ai client, ratelimit
public/                 # static assets (og image, resume, icons)
docs/                   # plan, audit, and the original design reference (not built)
```

## Deployment

Hosted on Vercel. To ship the current local state to production:

```bash
vercel --prod
```

Set the same environment variables in the Vercel project settings as in `.env.local`.

---

Design reference and build notes live in [`docs/`](./docs/README.md).
