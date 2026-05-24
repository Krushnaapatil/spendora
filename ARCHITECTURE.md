# ARCHITECTURE

## System Overview

Spendora is a full-stack AI tooling optimization platform designed to help modern teams analyze AI subscription costs, identify operational inefficiencies, and generate shareable audit reports.

The system combines:
- deterministic audit logic
- AI-generated executive summaries
- authenticated audit ownership
- public shareable reports
- lead capture workflows
- persistent audit dashboards

The architecture intentionally prioritizes:
- deterministic business logic over fully AI-generated reasoning
- anonymous-first onboarding to reduce friction
- thin API orchestration
- centralized pricing systems
- runtime-safe validation
- production-safe SSR behavior

---

# High-Level Architecture

```mermaid
flowchart TD

A[Landing Page]
--> B[/audit/new]

B --> C[AuditForm.tsx]

C --> D[/api/audit]

D --> E[Zod Validation]
D --> F[Rate Limiting]
D --> G[runAudit]

G --> H[pricing.ts]

D --> I[AI Summary Layer]

I --> J[OpenRouter]

D --> K[Supabase Persistence]

K --> L[(audits table)]

L --> M[/audit/id]

M --> N[Public Shareable Report]

M --> O[Authenticated Ownership]

O --> P[/audits Dashboard]

P --> Q[Edit Audit]

M --> R[Lead Capture]

R --> S[/api/leads]

S --> T[Resend Email]
```

---

# Core Architectural Philosophy

Spendora intentionally separates:

| Layer | Responsibility |
|---|---|
| UI | user interaction |
| API routes | orchestration only |
| audit engine | deterministic business logic |
| pricing engine | centralized financial rules |
| AI layer | executive summary enrichment |
| persistence | audit storage + ownership |
| auth | session + dashboard ownership |
| validation | runtime-safe contracts |

This separation prevents:
- business logic leakage into UI
- duplicated pricing rules
- inconsistent audit outputs
- unsafe request handling

---

# Request Lifecycle

## 1. User Starts Audit

Users visit:

```text
/audit/new
```

The onboarding flow is intentionally anonymous-first.

Users are NOT required to authenticate before generating an audit.

This reduces:
- onboarding friction
- signup abandonment
- conversion loss

The audit form collects:
- AI tools
- plan types
- seat counts
- spend estimates
- operational use case

Frontend implementation:

```text
components/form/AuditForm.tsx
```

---

## 2. Runtime Validation

The frontend submits requests to:

```text
POST /api/audit
```

Validation is handled using Zod schemas:

```text
lib/schemas.ts
```

Validation guarantees:
- numeric safety
- enum correctness
- safe payload structure
- runtime contract enforcement

Example validation checks:
- seat counts
- supported tools
- supported plans
- valid use cases
- maximum thresholds

This prevents malformed audit payloads from reaching business logic.

---

## 3. Rate Limiting

Spendora protects public APIs using lightweight in-memory rate limiting.

Implemented in:

```text
lib/rateLimit.ts
```

Current protections:
- audit endpoint throttling
- lead capture throttling

The current implementation is optimized for:
- MVP simplicity
- local development
- low operational complexity

Future production scaling would likely move rate limiting to:
- Redis
- Upstash
- edge-based distributed systems

---

## 4. Deterministic Audit Engine

The core audit logic lives inside:

```text
lib/auditEngine.ts
```

This is the heart of Spendora.

The audit engine is intentionally deterministic.

AI does NOT generate financial recommendations directly.

Instead:
- pricing rules
- thresholds
- optimization heuristics
- overlap logic

are fully controlled by deterministic business logic.

This improves:
- audit consistency
- operational trust
- explainability
- testing reliability
- cost predictability

The engine calculates:
- current spend
- estimated optimized spend
- monthly savings
- annual savings
- recommendation confidence
- optimization opportunities

---

## 5. Centralized Pricing Engine

Pricing logic is centralized in:

```text
lib/pricing.ts
```

This file acts as the single source of truth for:
- AI tool pricing
- plan thresholds
- optimization logic
- savings calculations

Supported tooling includes:
- ChatGPT
- Claude
- Gemini
- Cursor
- GitHub Copilot
- Windsurf

Centralizing pricing prevents:
- duplicated business rules
- inconsistent calculations
- pricing drift across components

This architecture also makes:
- future pricing updates
- testing
- expansion

significantly easier.

---

## 6. AI Summary Pipeline

After deterministic calculations complete, Spendora generates executive summaries using AI enrichment.

Implementation:

```text
lib/ai.ts
```

The AI layer is intentionally secondary.

Its role is:
- summarization
- presentation enhancement
- executive readability

NOT:
- core audit reasoning

The pipeline:
1. builds structured prompts
2. sends summaries to OpenRouter
3. receives AI-generated analysis
4. falls back gracefully on failure

Fallback handling is extremely important.

If AI generation fails:
- the audit still succeeds
- deterministic summaries still render
- the user experience remains stable

This architecture prioritizes:
- reliability
- graceful degradation
- operational resilience

---

## 7. Persistence Layer

Audit results are stored in Supabase.

Primary tables:
- audits
- leads

Audit persistence includes:
- tools
- results
- summary
- ai_summary
- summary_source
- team_size
- use_case
- user_id

Persistence is handled inside:

```text
app/api/audit/route.ts
```

Supabase was chosen because it provides:
- managed PostgreSQL
- authentication
- Row Level Security
- rapid iteration speed
- deployment simplicity

---

# Database Ownership Model

Spendora supports both:
- anonymous audits
- authenticated audits

This is a major architectural decision.

## Anonymous Flow

Users may generate audits without authentication.

In this case:

```text
user_id = null
```

The audit still exists:
- publicly shareable
- fully viewable
- operationally useful

---

## Authenticated Flow

After login/signup:
- audits may become linked to the authenticated user
- future audits automatically persist under ownership

This enables:
- historical dashboards
- repeat optimization workflows
- saved audit management

---

# Audit Claiming Architecture

One of the most important architectural flows in Spendora is:

```text
anonymous audit
→ authenticated ownership
```

This workflow allows:
- low-friction onboarding
- delayed authentication
- persistent retention

Flow:

```text
Anonymous audit created
→ user signs up
→ audit linked to user account
→ audit appears in dashboard
```

Linking occurs through:

```text
/api/audit/link
```

This design was heavily inspired by:
- Notion
- Loom
- Vercel
- Figma

where user value is delivered before authentication is required.

---

# Authentication Architecture

Authentication is powered by Supabase Auth.

Key flows:
- signup
- login
- session persistence
- dashboard ownership
- audit linking

Implementation files:
- lib/supabase-browser.ts
- lib/supabase-route.ts
- app/login/page.tsx

Special care was required for:
- SSR-safe auth handling
- App Router cookie behavior
- route handler session access

---

# Audit Dashboard

Authenticated users can access:

```text
/audits
```

The dashboard supports:
- historical audit viewing
- ownership-based filtering
- persistent optimization history

Frontend rendering:
- app/audits/page.tsx
- components/audit/AuditList.tsx

This transforms Spendora from:

```text
single-use calculator
```

into:

```text
persistent SaaS workflow
```

---

# Shareable Reports

Every audit generates a public shareable page:

```text
/audit/[id]
```

Features:
- public report rendering
- social sharing
- OG metadata
- share previews

OG image generation:

```text
app/audit/[id]/opengraph-image.tsx
```

This architecture enables:
- viral distribution
- team collaboration
- externally shareable optimization reports

---

# Lead Capture Pipeline

Lead capture exists directly inside audit reports.

Implementation:
- ShareAuditCard.tsx
- /api/leads
- lib/email.ts

Captured leads are:
- persisted to Supabase
- optionally emailed through Resend

This creates:
- conversion tracking
- follow-up opportunities
- operational sales workflows

---

# Frontend Architecture

The frontend uses:
- Next.js App Router
- modular component structure
- TailwindCSS
- client/server separation

Component groups:
- landing
- form
- audit
- layout
- ui

This separation improves:
- maintainability
- scalability
- isolated iteration

---

# SSR + Hydration Considerations

Several parts of Spendora required SSR-safe handling.

Key challenges:
- Supabase auth hydration
- localStorage persistence
- client-only rendering
- authenticated dashboard rendering

Hydration mismatches were resolved by:
- delaying client-only rendering
- stabilizing initial state
- separating browser/server clients

This was one of the hardest engineering problems in the project.

---

# Validation Strategy

Spendora uses:
- TypeScript for compile-time safety
- Zod for runtime safety

This combination ensures:
- typed contracts
- safe API boundaries
- predictable persistence
- safer refactors

All API routes validate input before business logic executes.

---

# Testing Strategy

The project includes:
- audit engine tests
- API route tests
- pricing tests
- rate limit tests
- AI summary tests
- email tests

Commands:

```bash
npm test
npm run lint
npm run type-check
npm run build
```

Current status:
- 58 passing tests
- successful production builds
- validated SSR behavior

---

# Security Considerations

The project includes:
- runtime validation
- rate limiting
- environment variable isolation
- protected service-role usage
- SSR-safe auth handling

Secrets are never exposed client-side.

Sensitive operations:
- persistence
- lead capture
- AI generation

are server-side only.

---

# Architectural Tradeoffs

## Why Deterministic Logic?

Deterministic audits were chosen over fully AI-generated recommendations because they provide:
- consistent outputs
- lower costs
- easier testing
- operational trust

---

## Why Anonymous-First?

Authentication was intentionally delayed to:
- reduce friction
- improve onboarding conversion
- let users see value immediately

---

## Why Thin Route Handlers?

Routes only orchestrate:
- validation
- rate limiting
- persistence

Business logic stays isolated in libraries.

This improves:
- maintainability
- testing
- scalability

---

# Scaling Considerations

If Spendora scaled significantly:

## Likely Improvements

### Infrastructure
- Redis rate limiting
- background queues
- async summary jobs
- structured observability

### Product
- recurring audits
- analytics dashboards
- team workspaces
- recommendation diffing
- cost trend analysis

### Database
- indexing optimization
- caching layers
- audit aggregation
- partitioning

---

# Biggest Engineering Challenges

The hardest technical problems during development were:
- Supabase SSR auth handling
- hydration mismatches
- anonymous-to-authenticated ownership
- generated schema synchronization
- runtime-safe validation
- audit persistence consistency

Interestingly, the most difficult part of Spendora was NOT generating AI summaries.

The hardest problems were:
- persistence
- ownership
- reliability
- operational consistency

---

# Final Architectural Philosophy

Spendora intentionally prioritizes:
- operational clarity
- deterministic reasoning
- scalable separation of concerns
- onboarding simplicity
- production-safe architecture

over:
- excessive AI complexity
- premature microservices
- overengineered infrastructure

The result is a focused SaaS architecture that balances:
- product realism
- engineering simplicity
- operational trust
- rapid iteration speed