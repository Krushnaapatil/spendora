# DEVLOG

## Day 1 — 2026-05-20 — Project Foundation & Architecture Setup

### Completed
- Initialized Spendora using Next.js App Router, TypeScript, TailwindCSS, and ESLint
- Connected Supabase project and configured environment variables
- Created the core project folder structure
- Planned architecture separation between app/, components/, and lib/
- Defined backend/API route structure
- Designed initial audit engine architecture
- Defined pricing system direction and recommendation flow
- Configured initial GitHub repository and project workflow

### Key Technical Decisions
- Keeping lib/ fully pure with zero UI imports
- Separating AI summary generation from the core audit engine
- Using deterministic rule-based recommendations before AI enrichment
- Structuring audit pages as server components for SEO and OG metadata
- Keeping API routes thin and orchestration-focused
- Designing pricing.ts as the single source of truth for all pricing logic

### Problems Encountered
- Spent time refining the project structure before implementation
- Needed to clarify domain models and pricing relationships before coding
- Had to redesign folder ownership boundaries to avoid mixing infrastructure and business logic

### Infrastructure
- Configured TypeScript project setup
- Configured TailwindCSS and ESLint
- Initialized Supabase project structure
- Set up environment variable handling strategy

### Next Steps
- Implement types.ts
- Implement pricing.ts
- Build first audit engine rules
- Configure Jest testing setup

---

## Day 2 — 2026-05-21 — Backend Infrastructure & Audit Pipeline

### Completed
- Implemented runtime-safe Zod schemas using Zod v4
- Built strongly typed domain models in types.ts
- Implemented pricing engine and threshold system
- Built deterministic audit engine logic
- Added runtime environment validation with lazy env loading
- Implemented Supabase client architecture
- Added browser/server/admin database separation
- Built in-memory rate limiting with IP tracking
- Implemented shared HTTP response helpers
- Built audit API orchestration route
- Added deterministic audit pipeline tests
- Added pricing tests and rate limit tests
- Configured Jest TypeScript testing infrastructure
- Added GitHub Actions CI pipeline
- Added automated lint, type-check, and test execution before merges
- Stabilized Supabase persistence typing
- Achieved 40+ passing backend tests
- Achieved zero TypeScript type errors

### Problems Encountered
- Supabase generic inference collapsed insert payloads to never[]
- Zod inference widened plan types to string
- Jest process stayed open because cleanup intervals were not unref'd
- Needed to simplify Supabase typing architecture to avoid ORM-style inference instability
- Encountered friction between strict runtime validation and inferred generic typing

### Decisions Made
- Simplified Supabase typing to infrastructure-light contracts
- Bound schemas directly to domain models using z.ZodType<T>
- Kept API routes thin and moved all business logic to lib/
- Kept audit engine deterministic and synchronous for predictable testing and reproducible recommendations
- Used explicit insert payload contracts instead of relying on fragile ORM inference
- Separated runtime validation (schemas.ts) from compile-time contracts (types.ts)

### Infrastructure
- Added Jest TypeScript configuration
- Added GitHub Actions CI workflow
- Added automated type-check and test validation before merges
- Added reusable rate-limit helpers and shared HTTP response utilities
- Added environment validation and server-only runtime protection
- Structured Supabase access around trust boundaries (browser/server/admin)

### Validation
- Achieved 40+ passing backend tests
- TypeScript build passing with zero type errors
- Verified deterministic audit engine behavior
- Verified schema strict-mode validation
- Verified rate limiting behavior and cleanup handling

### Next Steps
- Build Anthropic AI summary layer
- Implement graceful AI fallback templates
- Build app/api/summary/route.ts
- Implement lead capture pipeline
- Build shareable audit results page