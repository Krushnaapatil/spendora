# PRICING_DATA — Spendora Pricing Sources

## Purpose

Spendora recommendations rely on deterministic pricing logic.

All pricing data is sourced from official vendor pricing pages whenever possible.

Prices are periodically reviewed manually because:
- AI pricing changes frequently
- vendors introduce new plans regularly
- enterprise pricing is often custom

Spendora currently assumes:
- monthly billing
- USD pricing
- publicly listed plans only
- no negotiated enterprise discounts

---

# Cursor

| Plan | Monthly Price | Billing Model | Official Source |
|---|---|---|---|
| Hobby | $0 | Monthly | https://cursor.com/pricing |
| Pro | $20 | Monthly | https://cursor.com/pricing |
| Business | $40 | Monthly | https://cursor.com/pricing |

### Notes
- Enterprise pricing is custom and not publicly standardized
- Spendora currently excludes custom enterprise negotiation logic

---

# GitHub Copilot

| Plan | Monthly Price | Billing Model | Official Source |
|---|---|---|---|
| Individual | $10 | Monthly | https://github.com/features/copilot/plans |
| Business | $19 | Monthly | https://github.com/features/copilot/plans |

### Notes
- Enterprise pricing varies depending on GitHub contracts
- Spendora focuses on public seat pricing

---

# ChatGPT

| Plan | Monthly Price | Billing Model | Official Source |
|---|---|---|---|
| Plus | $20 | Monthly | https://openai.com/chatgpt/pricing |
| Team | $30 | Per user/month | https://openai.com/chatgpt/pricing |

### Notes
- API pricing is usage-based and highly variable
- Spendora currently treats API plans separately from subscription plans

---

# Claude

| Plan | Monthly Price | Billing Model | Official Source |
|---|---|---|---|
| Pro | $20 | Monthly | https://www.anthropic.com/pricing |
| Team | Custom | Team pricing | https://www.anthropic.com/pricing |

### Notes
- Claude API pricing depends on token usage
- Spendora does not currently estimate token-level usage patterns

---

# Gemini

| Plan | Monthly Price | Billing Model | Official Source |
|---|---|---|---|
| Pro | $20 | Monthly | https://one.google.com/about/ai-premium/ |
| Ultra | Variable | Monthly | https://deepmind.google/technologies/gemini/ |

### Notes
- Gemini branding and pricing evolve frequently
- Public pricing structure may change rapidly

---

# Windsurf

| Plan | Monthly Price | Billing Model | Official Source |
|---|---|---|---|
| Free | $0 | Monthly | https://codeium.com/windsurf |
| Pro | $15 | Monthly | https://codeium.com/windsurf |

### Notes
- Windsurf pricing is evolving quickly during product expansion

---

# API Pricing Considerations

## OpenAI API
- Usage-based pricing
- Token costs vary by model
- Spendora currently avoids estimating token usage automatically

Official source:
https://openai.com/api/pricing/

---

## Anthropic API
- Usage-based pricing
- Model pricing differs significantly across Claude variants
- Spendora currently treats Anthropic API as a custom/variable spend category

Official source:
https://www.anthropic.com/pricing#api