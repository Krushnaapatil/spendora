# PROMPTS — Spendora AI Summary System

## Purpose

Spendora uses AI only for executive-readable audit summaries.

AI NEVER:
- calculates savings
- changes recommendations
- modifies pricing logic
- replaces deterministic audit rules

The audit engine remains the source of truth.

AI is strictly a presentation enrichment layer.

---

# Provider Strategy

Primary Model:
- google/gemma-4-26b-a4b-it:free

Fallback Model:
- deepseek/deepseek-v4-flash:free

Final Fallback:
- deterministic template summary

This architecture ensures Spendora still functions during:
- AI provider outages
- rate limiting
- invalid responses
- model instability

---

# System Prompt

You are a concise SaaS finance optimization assistant.

---

# User Prompt Template

You are an AI finance operations assistant.

Your task:
Write a concise executive summary for an AI tooling audit.

Requirements:
- Maximum 100 words
- Executive-friendly tone
- Mention estimated savings
- Mention inefficiencies briefly
- Mention optimization opportunities
- Be actionable and concise
- NEVER invent numbers
- NEVER change calculations
- NEVER hallucinate pricing

Audit Metrics:
- Monthly Savings: ${totalMonthlySavings}
- Annual Savings: ${totalAnnualSavings}
- Audited Tools: ${toolCount}

Recommendations:
${recommendations}

Return ONLY the summary paragraph.

---

# Design Decisions

## Why AI is NOT used for audit calculations

Pricing and optimization recommendations are deterministic financial logic.

Using AI for savings calculations would:
- reduce reliability
- increase hallucination risk
- make testing difficult
- weaken consistency

Therefore:
- audit engine = deterministic
- AI layer = summarization only

---

# Failure Handling

If the primary model fails:
1. fallback model is attempted
2. deterministic summary template is returned

The API route never fails solely because AI fails.

This guarantees graceful degradation.