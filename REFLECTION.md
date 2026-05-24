# REFLECTION — Spendora

## What we built

A Next.js app that:

1. Collects AI stack data via a structured form
2. Runs a **deterministic audit engine** (`lib/auditEngine.ts`, `lib/pricing.ts`)
3. Persists to Supabase with auth, sharing, and leads
4. Adds an **AI executive summary** (OpenRouter) that never invents dollar amounts

Architecture: thin API routes, pure business logic, infrastructure at the edges—58+ tests on engine/schemas.

## What went well

- Explainable savings (testable rules, not LLM math)
- Zod + generated Supabase types after early `never[]` pain
- PLG loop: share URL, email gate, account linking
- Incremental hardening: lint, RLS, rate limits, middleware, async AI

## What was hard

1. Supabase type drift → generated `database.types.ts`
2. Auth + SSR + hydration → mount gates, server-first edit
3. Public reads without table scans → `get_audit_public` RPC
4. Recommendation quality → consolidation helped; still room to improve

## Decisions I'd keep

| Decision | Why |
|----------|-----|
| OpenRouter | Fallback models, cost control |
| Service-role writes | Stops anon DB spam |
| `after()` for AI | Fast audit POST |
| In-memory rate limits (v1) | Simple MVP; Redis later |

## Next improvements

- Integration tests for API routes
- Pricing freshness checks in CI
- Richer per-tool recommendation playbooks
- Usage-aware rules when customers provide data

## Takeaway

Trust in a savings product comes from **specificity**—per-seat deltas, plan names, confidence—not landing page polish. The moat is the engine that refuses to hallucinate numbers.
