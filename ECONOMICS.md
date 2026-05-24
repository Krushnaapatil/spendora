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
