# TESTS

## Testing Philosophy

Spendora prioritizes deterministic business logic and runtime-safe validation.

The most important systems tested are:
- audit calculations
- pricing logic
- API validation
- rate limiting
- AI summary fallback behavior
- email workflows

The project intentionally focuses more on:
- logic reliability
- predictable outputs
- API safety

than visual snapshot testing.

---

# Test Stack

| Tool | Purpose |
|---|---|
| Jest | Unit + integration testing |
| TypeScript | Static type safety |
| ESLint | Code quality + consistency |
| Zod | Runtime validation |

---

# Commands

## Run Tests

```bash
npm test
```

---

## Run Linting

```bash
npm run lint
```

---

## Run Type Checking

```bash
npm run type-check
```

---

## Run Production Build Verification

```bash
npm run build
```

---

# Current Status

## Verified Results

```text
6 test suites passed
58 tests passed
0 failing tests
Successful production build
```

The application currently passes:
- Jest tests
- TypeScript validation
- ESLint validation
- Next.js production build checks

---

# Test Coverage Areas

## 1. Audit Engine Tests

File:

```text
__tests__/auditEngine.test.ts
```

This suite verifies:
- savings calculations
- recommendation generation
- annual/monthly aggregation
- optimization logic
- deterministic outputs

Example scenarios:
- multiple overlapping tools
- unsupported combinations
- large team calculations
- edge-case spend inputs

These are the most important tests in the project because the audit engine drives all recommendation behavior.

---

## 2. Pricing Logic Tests

File:

```text
__tests__/pricing.test.ts
```

This suite verifies:
- pricing lookups
- threshold handling
- expected spend calculations
- plan mappings
- savings estimation consistency

Because pricing logic is centralized inside:
```text
lib/pricing.ts
```

testing this layer prevents inconsistent recommendation behavior across the system.

---

## 3. API Route Tests

File:

```text
__tests__/auditRoute.test.ts
```

This suite verifies:
- request validation
- API response shape
- audit persistence behavior
- invalid payload handling
- error responses

The route tests ensure:
- malformed requests fail safely
- valid audits complete successfully
- deterministic orchestration works correctly

---

## 4. Rate Limit Tests

File:

```text
__tests__/rateLimit.test.ts
```

This suite verifies:
- request throttling
- limit enforcement
- retry timing behavior
- repeated request handling

This protects public endpoints from abuse and accidental overload.

---

## 5. AI Summary Tests

File:

```text
__tests__/summary.test.ts
```

This suite verifies:
- AI summary generation
- fallback behavior
- deterministic fallback summaries
- response normalization

One important architectural goal was ensuring the audit still succeeds even if AI generation fails.

These tests validate that graceful degradation behavior.

---

## 6. Email Workflow Tests

File:

```text
__tests__/email.test.ts
```

This suite verifies:
- lead email formatting
- Resend integration wrappers
- payload generation
- safe fallback handling

The email layer is intentionally isolated to reduce coupling between lead capture and infrastructure providers.

---

# Runtime Validation Strategy

Spendora combines:
- TypeScript compile-time safety
- Zod runtime validation

This combination prevents:
- malformed payloads
- invalid audit structures
- unsupported pricing states
- unsafe persistence operations

Runtime validation is especially important because:
- audits originate from public forms
- anonymous requests are supported
- pricing logic depends on structured input

---

# Why Deterministic Logic Improves Testing

One major architectural decision was keeping recommendation logic deterministic instead of AI-generated.

This dramatically improved:
- test reliability
- reproducibility
- debugging clarity
- confidence in outputs

Because audit recommendations come from deterministic rules:
- outputs remain stable
- snapshot drift is avoided
- edge cases are easier to reason about

This made the project significantly easier to validate.

---

# Manual Verification

In addition to automated tests, the following flows were manually verified:
- anonymous audit generation
- authenticated audit persistence
- audit linking after signup
- dashboard rendering
- shareable audit URLs
- Open Graph previews
- lead capture flows
- production deployment behavior

Several hydration and authentication issues only appeared during real browser testing, especially across:
- localhost
- production
- authenticated redirects
- SSR hydration boundaries

Manual verification became essential for validating these flows.

---

# Biggest Testing Lesson

The most valuable realization during development was that testing infrastructure logic and ownership flows mattered more than testing isolated UI components.

The hardest bugs in Spendora were related to:
- persistence
- SSR hydration
- authentication state
- anonymous-to-authenticated ownership transitions

rather than rendering behavior itself.

This heavily influenced the final testing strategy.