# Spendora

Rule-based AI tooling audit platform. Teams submit their AI stack, get deterministic savings recommendations, an AI executive summary, and a shareable report.

## Stack

- **Next.js 16** (App Router)
- **TypeScript** + **Zod** validation
- **Supabase** (Postgres + Auth)
- **OpenRouter** (AI summaries)
- **Resend** (transactional email)

See [ARCHITECTURE.md](./ARCHITECTURE.md) for system design.

## Prerequisites

- Node.js 20+
- Supabase project
- OpenRouter API key
- Resend API key

## Setup

1. Clone and install:

```bash
npm ci
```

2. Copy environment variables:

```bash
cp .env.example .env.local
```

3. Fill in `.env.local` (see `.env.example` for required keys).

4. Apply database migrations in order under `supabase/migrations/` (Supabase SQL editor or CLI):

```bash
# If using Supabase CLI linked to your project:
supabase db push
```

The latest migration enables **Row Level Security** and adds `get_audit_public(uuid)` for shareable audit pages.

5. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run type-check` | TypeScript |
| `npm test` | Jest unit tests |

## Security model

- **Public audit reports** — fetched by UUID via `get_audit_public` RPC (no full-table read for anon clients).
- **Dashboard** — authenticated users read audits they own or that match their email on a prior lead capture (RLS).
- **Audit linking** — authenticated users can set `user_id` on audits that are still unclaimed.
- **Writes from API routes** — validated audit/lead payloads are inserted with the service role after rate limiting.

## Project docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) — data flow and scaling notes
- [PRICING_DATA.md](./PRICING_DATA.md) — pricing sources for the audit engine
- [TESTS.md](./TESTS.md) — how to run tests
- [DEVLOG.md](./DEVLOG.md) — build log
- [GTM.md](./GTM.md) — go-to-market plan
- [ECONOMICS.md](./ECONOMICS.md) — unit economics
- [REFLECTION.md](./REFLECTION.md) — project reflection

## Deploy

Deploy to Vercel (or any Node host). Set the same environment variables as `.env.example`. Ensure all Supabase migrations have been applied to production.
