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

---

## Day 3 — 2026-05-22

**Hours worked:** 7

**What I did:**
- Replaced handwritten Supabase schema contracts with generated database types
- Fixed Supabase insert/select type inference collapsing to never
- Stabilized typed persistence across audit and lead routes
- Implemented OpenRouter-based AI summary infrastructure with fallback models
- Added Resend transactional email infrastructure
- Built lead capture pipeline with honeypot protection and rate limiting
- Built public server-rendered audit result pages
- Added dynamic SEO metadata generation and OG/Twitter card support
- Added typed SSR audit fetching and public-safe audit sanitization
- Fixed shared API response header merge behavior

**What I learned:**
- Supabase generic inference can break silently when handwritten schema contracts drift from the actual database structure
- Typed repository boundaries simplify SSR data fetching significantly
- AI should enrich deterministic systems rather than replace core financial logic
- Public-facing pages should never expose raw persistence objects directly

**Blockers / what I'm stuck on:**
- Supabase query builder generics still require occasional explicit typing in server-rendered pages
- Need to improve overall UI polish and frontend product presentation

**Plan for tomorrow:**
- Improve audit result UI and visual hierarchy
- Add sharing functionality for public audit pages
- Start building landing page sections
- Improve mobile responsiveness and loading states

---

## Day 4 — 2026-05-22

**Hours worked:** 10

**What I did:**  
Refactored the entire landing page from a single large Home component into a modular production-grade frontend architecture. Created reusable section-based components including Navbar, Hero, Stats, Problem, HowItWorks, Features, Testimonials, TrustSection, FinalCTA, Footer, and InteractiveAudit. Moved all static marketing data into a centralized data/landing.ts file to separate content from rendering logic. Reorganized the frontend into domain-based component folders (landing, layout, form, results, ui, lead) to improve maintainability and scalability.

Built the real audit onboarding workflow using dynamic forms and backend integration. Implemented AuditForm.tsx and connected the frontend directly to POST /api/audit. Added operational loading states, progress feedback, redirect-based navigation, and localStorage persistence so partially completed audits survive refreshes. Connected deterministic audit execution to OpenRouter AI summary generation and Supabase persistence. Implemented authenticated audit ownership architecture using Supabase Auth with browser/server auth client separation. Built login and signup flows, authenticated session handling, and a protected `/audits` dashboard route for viewing user-linked historical audits.

Stabilized several production-level frontend/backend issues including React hydration mismatches, generated database type drift, Supabase schema synchronization, invalid numeric form parsing, and SSR-safe rendering. Added AI summary provenance persistence using `summary_source`, improved audit recommendation trust signaling, and enhanced audit report presentation quality with clearer operational messaging and confidence states.

**What I learned:**  
Learned how rapidly complexity increases once authentication, persistence, SSR rendering, generated database contracts, and client-side hydration all interact together in a real SaaS-style architecture. Improved understanding of Supabase Auth session handling, protected route rendering in Next.js App Router, SSR-safe state hydration patterns, and runtime-safe form validation. Also learned that product trust depends heavily on recommendation specificity and operational clarity rather than only visual polish.

**Blockers / what I'm stuck on:**  
The biggest blockers were React hydration mismatches caused by client-only state restoration, generated Supabase type drift after schema evolution, and invalid numeric parsing causing audit validation failures. Authentication testing also temporarily hit Supabase email rate limits during rapid signup iterations. Audit recommendation quality still needs improvement because several optimization suggestions remain too generic and repetitive.

**Plan for tomorrow:**  
Finish the authenticated audit history workflow, improve recommendation intelligence inside the audit engine, add copy/share UX improvements, strengthen audit report readability, and continue completing required submission documents including README, ARCHITECTURE, GTM, ECONOMICS, and REFLECTION.

---

## Day 5 — 2026-05-23

**Hours worked:** 9

**What I did:**  
Completed the full documentation layer for Spendora and aligned the repository structure with the assignment evaluation rubric. Wrote production-level README documentation including product overview, setup instructions, architecture summary, environment configuration, deployment workflow, and feature breakdowns. Created detailed ARCHITECTURE.md covering system boundaries, deterministic audit flow, Supabase persistence architecture, authenticated ownership workflows, SSR hydration considerations, and scaling strategies.

Built GTM.md, ECONOMICS.md, METRICS.md, PROMPTS.md, TESTS.md, LANDING_COPY.md, and REFLECTION.md to document product strategy, pricing logic, business assumptions, testing philosophy, AI prompt architecture, onboarding positioning, operational metrics, and engineering lessons learned during development. Refined prompt engineering strategy to strictly separate deterministic pricing logic from AI-generated summaries and documented fallback handling behavior.

Improved repository quality by splitting large commits into smaller production-style commits with clearer scope separation. Cleaned stale files, verified production builds, validated environment isolation, and confirmed that linting, TypeScript checks, Jest tests, and production builds all passed successfully. Also improved public audit sharing flows, dashboard persistence behavior, and authenticated ownership continuity after login.

**What I learned:**  
Learned that high-quality software projects require significantly more than feature implementation. Product clarity, operational reasoning, architectural communication, and documentation quality all heavily influence how trustworthy and maintainable a system feels. Also learned that business metrics and onboarding strategy often matter more than adding additional AI complexity.

Improved understanding of:
- SaaS onboarding psychology
- product-led growth strategy
- operational metrics design
- deterministic AI architecture boundaries
- documentation structure for engineering evaluation

**Blockers / what I'm stuck on:**  
Still need to improve recommendation specificity because several audit outputs remain operationally generic. Need better overlap detection between AI tools and more nuanced optimization heuristics. Screenshot preparation and final README polish also still remain before final submission.

**Plan for tomorrow:**  
Finalize screenshots and deployment verification, improve audit recommendation quality, complete remaining submission polish, validate all public flows on production deployment, and prepare the repository for final submission review.

---

## Day 6 — 2026-05-24

**Hours worked:** 8

**What I did:**  
Entered final submission preparation and production hardening phase. Verified all major user flows including anonymous audit generation, authenticated dashboard persistence, audit ownership linking after login, public audit sharing, Open Graph metadata generation, and lead capture workflows. Ran complete validation pipeline using ESLint, TypeScript, Jest, and Next.js production builds to confirm repository stability.

Improved overall repository professionalism by organizing documentation, refining architectural explanations, tightening testing documentation, and aligning all markdown files with the assignment rubric. Completed METRICS.md with operational SaaS metrics focused on audit completion, report sharing, and retention instead of vanity metrics. Refined PROMPTS.md to document AI boundary decisions, fallback strategy, prompt iteration history, and deterministic audit philosophy.

Reviewed security posture and deployment hygiene:
- verified `.env.local` exclusion
- removed accidental secret exposure risks
- confirmed service-role isolation
- validated SSR-safe authentication handling
- checked production route behavior

Also finalized the repository narrative so the project now communicates:
- engineering maturity
- product reasoning
- operational thinking
- SaaS architecture discipline

instead of only frontend implementation.

**What I learned:**  
Learned that final production polish is mostly about clarity, consistency, and trust rather than adding more features. The project became substantially stronger once:
- architecture decisions were documented clearly
- onboarding friction was minimized
- deterministic systems were prioritized
- operational metrics replaced vanity metrics

Also realized that the hardest engineering problems in real SaaS systems are often:
- persistence
- ownership
- auth synchronization
- hydration consistency
- operational reliability

rather than the AI layer itself.

**Blockers / what I'm stuck on:**  
The main remaining weakness is recommendation depth. The audit engine still needs more sophisticated operational intelligence and confidence modeling to make recommendations feel less repetitive. Final screenshots and deployment walkthrough verification also still remain before submission lock.

**Plan moving forward:**  
Complete final screenshots, perform one last deployment QA pass, ensure all required rubric files are present, clean the repository completely, and prepare the final submission package.