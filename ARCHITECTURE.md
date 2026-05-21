# ARCHITECTURE

## System Overview

Spendora is a rule-based AI tooling audit platform that analyzes a team's AI stack and identifies cost-saving opportunities.

The architecture is intentionally split into:
- thin API orchestration routes
- deterministic business logic
- infrastructure services
- runtime validation
- persistence layer

---

# System Diagram

```mermaid
flowchart TD

A[Frontend Form]
--> B[/api/audit]

B --> C[Zod Validation]
B --> D[Rate Limiting]
B --> E[Audit Engine]

E --> F[Pricing Engine]

B --> G[Supabase]

G --> H[/audit/id]

H --> I[AI Summary Layer]

I --> J[Anthropic API]
```

---

# Data Flow

1. User submits AI tooling information from frontend form
2. `/api/audit` validates request body using Zod schemas
3. Rate limiting protects against abuse
4. `runAudit()` generates deterministic recommendations
5. Audit results are persisted to Supabase
6. Saved audits become shareable via `/audit/[id]`
7. AI summaries enrich results using Anthropic
8. Lead capture pipeline stores conversion data

---

# Stack Decisions

## Next.js App Router
Chosen for:
- server components
- route handlers
- metadata support
- deploy simplicity

## TypeScript
Chosen for:
- strict domain contracts
- safer refactors
- predictable API structures

## Supabase
Chosen for:
- fast iteration
- managed Postgres
- easy deployment
- Row Level Security support

## Zod
Chosen for:
- runtime validation
- API safety
- schema/type alignment

---

# Scaling Considerations

If Spendora needed to handle 10k audits/day:

- move rate limiting to Redis
- queue AI summary generation asynchronously
- cache pricing snapshots
- add structured logging
- move audit persistence behind background jobs
- add analytics instrumentation
- introduce DB indexing on audit lookups