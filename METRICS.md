# METRICS

## North Star Metric

### Weekly Audits That Generate Actionable Savings

The primary goal of Spendora is not maximizing page views or daily active users.

The product creates value when teams:
- complete audits
- discover meaningful savings opportunities
- trust the recommendations enough to act on them

Because AI tooling audits are not high-frequency consumer behavior, traditional engagement metrics like:
- DAU
- session time
- feed engagement

are poor indicators of success.

Instead, the most important metric is:

```text
Completed audits with actionable savings recommendations per week
```

This metric combines:
- acquisition
- completion
- recommendation quality
- operational usefulness

If audits are completed but produce low-confidence or low-value recommendations, the product is not delivering meaningful utility.

---

# Input Metrics

## 1. Audit Completion Rate

```text
Landing Page Visits
→ Completed Audits
```

This measures:
- onboarding friction
- clarity of value proposition
- form usability
- trust in the product

A low completion rate would suggest:
- too much friction
- unclear positioning
- weak onboarding
- poor UX

Because Spendora is intentionally anonymous-first, improving audit completion is critical.

---

## 2. Audit → Signup Conversion

```text
Completed Audit
→ Authenticated User
```

This measures whether users find enough value in the audit results to:
- create accounts
- save reports
- revisit dashboards

This is more meaningful than raw signup count because it measures conversion after value delivery.

A strong conversion rate would indicate:
- recommendation trust
- dashboard usefulness
- retention potential

---

## 3. Report Share Rate

```text
Completed Audit
→ Shared Report
```

Spendora is designed around:
- shareable URLs
- public reports
- social previews
- internal team collaboration

If users actively share reports:
- the product likely feels useful
- recommendations appear credible
- the audit output feels worth discussing internally

This is one of the strongest indicators of perceived value.

---

# Metrics I Would Instrument First

The first instrumentation layer would track:

## Funnel Events

- landing page visit
- audit started
- audit completed
- report shared
- signup completed
- dashboard revisit
- lead form submitted

---

## Recommendation Analytics

I would also track:
- which tools appear most often
- which recommendations generate the highest savings
- average estimated savings
- recommendation confidence distribution

This would help identify:
- weak recommendation logic
- stale pricing assumptions
- operational blind spots

---

## Retention Signals

Because Spendora is an operational workflow tool, retention matters more than raw traffic.

Important retention metrics include:
- repeat audits per user
- dashboard revisits
- recurring audit usage
- return rate after first audit

These metrics would help determine whether Spendora is becoming:
```text
ongoing operational software
```

instead of:
```text
one-time curiosity tool
```

---

# Pivot Trigger

One of the clearest pivot indicators would be:

```text
High audit completion but low signup and low sharing
```

That would likely mean:
- the onboarding works
- users are curious
- but recommendations lack trust or usefulness

Another important warning signal would be:
- strong traffic
- weak repeat usage

That would suggest the product behaves more like:
```text
novelty calculator
```

than:
```text
operational infrastructure tool
```

If those patterns appeared consistently, the product direction would likely need to shift toward:
- recurring monitoring
- better recommendation quality
- stronger operational workflows
- more actionable reporting

instead of adding more AI-generated features.

---

# Biggest Metrics Insight

The biggest realization during development was that Spendora should optimize for:
- trust
- operational usefulness
- retention
- report quality

rather than maximizing raw engagement.

For this type of product, one highly trusted audit is more valuable than hundreds of low-confidence interactions.

That insight heavily influenced:
- deterministic recommendation logic
- anonymous-first onboarding
- shareable reports
- dashboard persistence
- operational clarity throughout the product.