# ECONOMICS — Spendora

## Unit economics (MVP)

Spendora targets **low marginal cost per audit** so free audits work as lead gen.

### Variable cost per audit (estimate)

| Component | Approx. |
|-----------|---------|
| Supabase (insert + update + reads) | < $0.001 |
| OpenRouter summary (~180 tokens) | $0–0.02 |
| Resend (lead/share email) | ~$0.001 |
| Vercel serverless | negligible at low volume |

**Target:** < **$0.05 / audit** with free-tier models.

Async summaries (deterministic first, AI in background) improve UX without blocking the request.

## Revenue

| Stream | Notes |
|--------|--------|
| Consultation | High-savings audits (`SPENDORA_CTA_THRESHOLD`) |
| Future subscription | Re-audits, monitoring (not built) |

## Customer ROI

Savings = annualized recommendations on the report minus any paid service. Examples: plan downgrades, consolidation, negotiated credits (low confidence).

## Why Deterministic Audits Matter

Spendora intentionally keeps audit calculations deterministic instead of relying fully on AI-generated recommendations.

This reduces:
- inference cost
- inconsistent outputs
- hallucinated recommendations
- operational unpredictability

AI is used primarily for:
- summaries
- presentation
- readability

while pricing and optimization logic remain centrally controlled inside the audit engine.

This architecture keeps infrastructure costs predictable while improving audit trust.

## Market (rough)

- **TAM:** Paid AI dev/writing seats globally
- **SAM:** SMB teams with 2+ paid AI tools
- **SOM:** PLG + GitHub reach in year one

## Scale (10k audits/day)

See `ARCHITECTURE.md`: Redis rate limits, queued AI, DB indexes, cached pricing.

## Risks

- Pricing drift vs `lib/pricing.ts`
- Generic recommendations reduce trust
- API abuse (mitigated: rate limits, RLS, service-role writes)

## Distribution Strategy

Spendora is designed around shareable audit reports.

Each audit generates:
- public URLs
- social previews
- shareable summaries

This creates natural distribution through:
- founders
- engineering teams
- internal reporting
- social sharing

The product intentionally uses low-friction onboarding and anonymous-first audits to maximize audit completion rates.