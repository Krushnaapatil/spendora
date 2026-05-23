export const NAV_LINKS = [
  {
    label: "Features",
    href: "/#features",
  },
  {
    label: "How It Works",
    href: "/#how-it-works",
  },
  {
    label: "Pricing Data",
    href: "/#pricing-data",
  },
  {
    label: "Example Audit",
    href: "/#example-audit",
  },
];

export const SUPPORTED_TOOLS = [
  "ChatGPT",
  "Claude",
  "Cursor",
  "GitHub Copilot",
  "Gemini",
  "Windsurf",
];

export const STATS_ITEMS = [
  {
    value: "$2,400",
    label:
      "avg monthly savings found",
  },
  {
    value: "47",
    label: "audits run",
  },
  {
    value: "8",
    label:
      "supported AI tools",
  },
  {
    value: "<60s",
    label:
      "average audit time",
  },
];

export const PROBLEM_CARDS = [
  {
    title:
      "Fragmented spend",
    description:
      "Subscriptions purchased across teams with no central visibility into total AI cost.",
  },
  {
    title:
      "Overlapping tooling",
    description:
      "Teams often pay for ChatGPT, Claude, and Gemini simultaneously for the same workflow.",
  },
  {
    title:
      "Wrong plan size",
    description:
      "Enterprise or team plans remain active long after team size changes.",
  },
];

export const PROCESS_STEPS = [
  {
    step: "1",
    title:
      "Enter your AI stack",
    description:
      "Add tools, plans, seats, and monthly spend in under a minute.",
  },
  {
    step: "2",
    title:
      "Run deterministic audit",
    description:
      "Spendora checks pricing efficiency, plan fit, and overlapping tooling.",
  },
  {
    step: "3",
    title:
      "Share the report",
    description:
      "Each audit gets a public shareable URL with executive-ready summaries.",
  },
];

export const FEATURE_GRID = [
  {
    title:
      "AI-generated summaries",
    description:
      "Executive-readable summaries generated using OpenRouter models.",
  },
  {
    title:
      "Deterministic recommendations",
    description:
      "Savings calculations are rule-based and fully traceable.",
  },
  {
    title:
      "Shareable audit pages",
    description:
      "Every audit receives a public URL optimized for sharing.",
  },
  {
    title:
      "Pricing verification",
    description:
      "Every recommendation references official pricing sources.",
  },
  {
    title:
      "Persistent form state",
    description:
      "Audit input state survives reloads using local storage.",
  },
  {
    title:
      "Lead capture workflow",
    description:
      "High-savings audits can trigger consultation workflows.",
  },
];

export const TESTIMONIALS = [
  {
    quote:
      "We discovered duplicate Cursor and Copilot seats during our first audit.",
    name: "A.K.",
    role:
      "CTO · Seed-stage SaaS",
  },
  {
    quote:
      "The biggest surprise was how honest the audit felt. It told us some plans were already optimal.",
    name: "S.R.",
    role:
      "Engineering Manager",
  },
  {
    quote:
      "We forwarded the report internally and used it during budgeting discussions the same day.",
    name: "M.T.",
    role:
      "Founder · DevTools Startup",
  },
];

export const AUDIT_RECOMMENDATIONS = [
  {
    tool: "ChatGPT Team",
    reason:
      "2 seats · team plan overkill",
    savings: "-$120/mo",
    action: "downgrade",
  },
  {
    tool:
      "Cursor Business",
    reason:
      "4 seats · below threshold",
    savings: "-$80/mo",
    action: "downgrade",
  },
  {
    tool: "Claude Pro",
    reason:
      "Paying retail · credits available",
    savings: "-$200/mo",
    action: "credits",
  },
];
