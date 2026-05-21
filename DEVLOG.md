# DEVLOG

## Day 1 — 2026-05-20

**Hours worked:** 5

**What I did:**
- Initialized Spendora using Next.js App Router, TypeScript, TailwindCSS, and ESLint
- Connected Supabase project and configured environment variables
- Created the core project folder structure
- Planned architecture separation between app/, components/, and lib/
- Defined backend/API route structure
- Designed the initial audit engine architecture
- Defined pricing system direction and recommendation flow

**What I learned:**
- Good backend architecture depends heavily on separation of concerns early
- Defining domain contracts before implementation reduces future refactoring
- Thin API routes make backend systems easier to scale and test

**Blockers / what I'm stuck on:**
- Needed time to refine pricing relationships and recommendation structure before implementation
- Spent additional time clarifying boundaries between infrastructure and business logic

**Plan for tomorrow:**
- Implement types.ts
- Implement pricing.ts
- Configure Jest testing setup
- Start building the audit engine

---

## Day 2 — 2026-05-21

**Hours worked:** 8

**What I did:**
- Implemented strongly typed domain models in types.ts
- Built runtime-safe Zod schemas using Zod v4
- Implemented pricing engine and savings threshold logic
- Built deterministic audit engine rules
- Added runtime environment validation with lazy env loading
- Implemented Supabase browser/server/admin client separation
- Built in-memory IP rate limiting system
- Added shared HTTP response utilities
- Built audit API orchestration route
- Added deterministic audit pipeline tests
- Added pricing tests and rate-limit tests
- Configured Jest TypeScript testing infrastructure
- Added GitHub Actions CI workflow
- Stabilized Supabase persistence typing
- Achieved 40+ passing backend tests
- Achieved zero TypeScript type-check errors

**What I learned:**
- Supabase generic inference can become unstable with handwritten database contracts
- Runtime validation and compile-time typing should remain separated
- Deterministic synchronous business logic makes testing significantly easier
- CI pipelines become valuable very early in backend-heavy projects

**Blockers / what I'm stuck on:**
- Supabase insert inference repeatedly collapsed payloads to never[]
- Zod plan inference widened union types unexpectedly
- Jest cleanup intervals initially prevented clean process exits

**Plan for tomorrow:**
- Build Anthropic AI summary layer
- Add graceful fallback summary generation
- Implement app/api/summary/route.ts
- Start lead capture pipeline