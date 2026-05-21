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

---

# Prompt Iteration Notes

## Prompt V1

### Approach
Initial prompt focused only on generating a professional summary.

### Problems Encountered
- Responses were too verbose
- Some summaries exceeded 200 words
- Tone occasionally became generic marketing language
- Models sometimes repeated savings numbers multiple times

### Result
Usable, but inconsistent for executive-style reporting.

---

## Prompt V2

### Changes Made
- Added strict 100-word limit
- Explicitly instructed the model to avoid hallucinating pricing
- Added structured audit metrics directly into the prompt
- Required concise operational tone

### Improvements
- Summaries became significantly more consistent
- Reduced hallucinated claims
- Improved readability for non-technical users
- Better alignment with finance/reporting use cases

---

## Prompt V3

### Changes Made
- Added deterministic recommendations separately from AI generation
- Restricted AI responsibility to summarization only
- Added explicit instruction:
  "Return ONLY the summary paragraph"

### Improvements
- Reduced formatting inconsistencies
- Prevented markdown/bullet output
- Improved API response predictability
- Simplified frontend rendering

---

# Reliability & Fallback Philosophy

Spendora treats AI as:
- optional enrichment
- not core infrastructure

The platform must still function correctly even if:
- OpenRouter is unavailable
- models timeout
- providers rate-limit requests
- responses are malformed

Therefore:
- financial calculations remain deterministic
- AI summaries are replaceable
- graceful degradation is mandatory