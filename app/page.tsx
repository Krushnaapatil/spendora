"use client";

import React, { useState } from "react";

// ============================================================================
// STRUCTURAL TYPES & INTERFACES
// ============================================================================

interface NavLink {
  label: string;
  href: string;
}

interface ToolBadge {
  name: string;
  isActive?: boolean;
}

interface AuditRecommendation {
  tool: string;
  action: string;
  savingsLabel: string;
  context: string;
  badgeType: "critical" | "warning" | "info";
}

interface StatItem {
  value: string;
  label: string;
  description: string;
}

interface ProblemCard {
  title: string;
  tagline: string;
  description: string;
  metricBaseline: string;
}

interface ProcessStep {
  number: string;
  title: string;
  description: string;
  technicalContext: string;
}

interface FeatureItem {
  title: string;
  description: string;
  badge: string;
}

interface TestimonialItem {
  quote: string;
  author: string;
  role: string;
  company: string;
  realizedSavings: string;
}

// ============================================================================
// GLOBAL DATA DECLARATIONS
// ============================================================================

const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing Data", href: "#pricing-data" },
  { label: "Example Audit", href: "#example-audit" },
];

const SUPPORTED_TOOLS: ToolBadge[] = [
  { name: "ChatGPT Plus/Teams", isActive: true },
  { name: "Claude Pro/Scale", isActive: true },
  { name: "Cursor Business", isActive: true },
  { name: "GitHub Copilot", isActive: true },
  { name: "Gemini Advanced", isActive: true },
  { name: "Windsurf Ideation", isActive: true },
  { name: "OpenRouter APIs", isActive: false },
  { name: "DeepSeek Platforms", isActive: false },
];

const AUDIT_RECOMMENDATIONS: AuditRecommendation[] = [
  {
    tool: "Cursor Business vs Copilot",
    action: "Consolidate Overlapping IDE Seats",
    savingsLabel: "Save $420 / mo",
    context: "14 engineers are provisioned on both Cursor Business and GitHub Copilot licenses simultaneously.",
    badgeType: "critical",
  },
  {
    tool: "Claude Pro / Team Tier",
    action: "Prune Dormant Seat Allocations",
    savingsLabel: "Save $160 / mo",
    context: "8 seats show zero system message utilization logs over the past rolling 30-day billing cycle.",
    badgeType: "warning",
  },
  {
    tool: "OpenAI API Endpoints",
    action: "Switch to Tiered Context Window",
    savingsLabel: "Save $280 / mo",
    context: "System detected hardcoded gpt-4-turbo calls matching conditions optimized for gpt-4o-mini limits.",
    badgeType: "info",
  },
];

const STATS_ITEMS: StatItem[] = [
  { value: "$340/mo", label: "Avg. Savings Found", description: "Per identified active team asset cluster." },
  { value: "4,120+", label: "Audits Completed", description: "By bootstrap teams, agencies, and YC founders." },
  { value: "14", label: "Supported Toolsets", description: "Cross-verified with official vendor price matrices." },
  { value: "< 60s", label: "Completion Time", description: "Completely deterministic parsing script runtime." },
];

const PROBLEM_CARDS: ProblemCard[] = [
  {
    title: "Fragmented Spend",
    tagline: "The Credit Card Leak",
    description: "Individual engineers and product leads spin up individual pro accounts on corporate cards. Finance sees generic SaaS vendor lines without seat context.",
    metricBaseline: "Avg. 4 hidden accounts per team",
  },
  {
    title: "Overlapping Tooling",
    description: "Paying for overlapping LLM interfaces within the exact same department. Teams run Cursor, Windsurf, and Copilot across identical workflow cohorts.",
    tagline: "Redundant Core Capabilities",
    metricBaseline: "22% workflow cross-provisioning",
  },
  {
    title: "Wrong Plan Sizes",
    description: "Defaulting to top-tier enterprise commitments when standard dynamic API routing or team seats would easily satisfy actual volume metrics.",
    tagline: "Unoptimized Commitment Tiers",
    metricBaseline: "$1,800/yr average seat overhead",
  },
];

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Enter your active AI tool counts",
    description: "Input your seat distributions, active API monthly runs, and selected tier variables through our clean, secure interface matrix.",
    technicalContext: "No production code tokens or data prompt layers are ever captured or requested.",
  },
  {
    number: "02",
    title: "Instant deterministic verification",
    description: "Our system cross-references your numbers against active official vendor pricing tables to isolate plan logic gaps.",
    technicalContext: "Calculations use static rules. We do not use LLMs to guess financial savings metrics.",
  },
  {
    number: "03",
    title: "Share or save your report",
    description: "Instantly generate an immutable cryptographic share URL or an executive-ready Markdown text overview for internal alignment.",
    technicalContext: "Fully anonymous generation option requires zero account setup or credit card fields.",
  },
];

const FEATURE_GRID: FeatureItem[] = [
  {
    title: "Deterministic Optimization Engine",
    description: "No structural hallucinations. Every single cost recommendation traces back directly to clean, verified vendor tier rule sheets.",
    badge: "Core Engine",
  },
  {
    title: "AI-Generated Executive Summaries",
    description: "We use lightweight OpenRouter calls solely to format messy numbers into high-fidelity, concise summaries designed for immediate leadership review.",
    badge: "Reporting",
  },
  {
    title: "Persistent Form Context",
    description: "Local-first session state persistence saves your configurations natively. Tweak your team variables over time without losing audit history.",
    badge: "UX Design",
  },
  {
    title: "Public-Safe Report Sharing",
    description: "Toggle off strict internal identity metrics to create fully clean, public-shareable links perfect for forwarding to your finance division.",
    badge: "Sharing",
  },
];

const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "We ran Spendora and immediately discovered we were paying for Copilot seats for engineers who had completely transitioned to Cursor. It cut our monthly AI line item by $600 with zero workflow friction.",
    author: "Alex Rivers",
    role: "CTO",
    company: "Contextual Systems",
    realizedSavings: "$7,200 saved annualized",
  },
  {
    quote: "Most optimization platforms feel like bloated enterprise vaporware. Spendora took exactly 45 seconds, gave us a clear markdown list of redundant plans, and didn't force me to book a pushy enterprise demo.",
    author: "Elena Rostova",
    role: "Founder",
    company: "Linear Labs (YC W25)",
    realizedSavings: "24% overall SaaS contraction",
  },
  {
    quote: "Our team had multiple fragmented OpenAI API keys floating around accounting. Spendora helped us build a clear executive report that convinced our leads to consolidate under a single managed organization architecture.",
    author: "Marcus Vance",
    role: "Engineering Manager",
    company: "HyperScale Corp",
    realizedSavings: "$410/mo billing drop",
  },
];

export default function Home(): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans antialiased selection:bg-zinc-900 selection:text-white">
      
      {/* ─── 1. NAVBAR COMPONENT ───────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/75 backdrop-blur-md transition-all">
        <div className="mx-auto flex max-w-7xl h-14 items-center justify-between px-6 lg:px-8">
          
          {/* Brand Left */}
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="h-5.5 w-5.5 rounded bg-zinc-950 flex items-center justify-center text-white font-mono text-xs font-bold tracking-tighter transition-transform group-hover:scale-95">
                S
              </div>
              <span className="font-semibold tracking-tight text-sm text-zinc-950">Spendora</span>
            </a>
          </div>

          {/* Navigation Links Center */}
          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                className="text-xs font-medium text-zinc-500 hover:text-zinc-950 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Callouts Right */}
          <div className="hidden md:flex items-center gap-3">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950 transition-all"
            >
              GitHub
            </a>
            <a 
              href="#audit-engine" 
              className="inline-flex items-center justify-center rounded-lg bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 shadow-sm transition-all"
            >
              Run Free Audit
            </a>
          </div>

          {/* Responsive Mobile Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex p-1.5 text-zinc-500 md:hidden hover:text-zinc-950 transition-colors"
            type="button"
            aria-label="Toggle navigation drawer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Flyout Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-zinc-200 bg-white px-6 py-4 md:hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-medium text-zinc-500 hover:text-zinc-950"
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-zinc-100 my-1" />
              <div className="flex flex-col gap-2">
                <a href="https://github.com" className="w-full text-center rounded-lg border border-zinc-200 py-2 text-xs font-medium text-zinc-600">
                  GitHub Reference
                </a>
                <a href="#audit-engine" className="w-full text-center rounded-lg bg-zinc-950 py-2 text-xs font-semibold text-white shadow-sm">
                  Run Free Audit
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ─── 2. HERO SECTION ───────────────────────────── */}
      <section className="relative overflow-hidden border-b border-zinc-200/60 bg-white">
        {/* Subtle grid accent reminiscent of modern SaaS canvas sheets */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f3f3f3_1px,transparent_1px),linear-gradient(to_bottom,#f3f3f3_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            {/* Left Value Framework Info */}
            <div className="flex flex-col items-start lg:col-span-7">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl lg:text-[3.5rem] lg:leading-[1.1]">
                Your team is probably overspending on AI tools.
              </h1>
              
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-500 sm:text-lg">
                Engineering groups adopt ChatGPT, Claude, Cursor, and API endpoints rapidly without centralized controls. Spendora uncovers fragmented deployment pipelines, redundant licensing tiers, and idle seats automatically.
              </p>

              {/* Action Rows */}
              <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:w-auto">
                <a href="#audit-engine" className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all hover:scale-[1.01] active:scale-[0.99]">
                  Run Free Audit
                </a>
                <a href="#example-audit" className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium text-zinc-600 shadow-xs hover:bg-zinc-50 hover:text-zinc-950 transition-all">
                  See Example Report
                </a>
              </div>

              {/* Trust Indicators Meta Row */}
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-zinc-100 pt-6 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-900 font-medium">✓</span> No credit card required
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-900 font-medium">✓</span> Shareable audit URLs
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-900 font-medium">✓</span> Deterministic matching logic
                </div>
              </div>

              {/* Supported Tools Badges Cluster */}
              <div className="mt-12 w-full">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Supported Vendor Tiers</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {SUPPORTED_TOOLS.map((tool) => (
                    <span 
                      key={tool.name}
                      className="inline-flex items-center rounded-md border border-zinc-200/80 bg-zinc-50/50 px-2.5 py-1 text-xs font-medium text-zinc-600 transition-colors"
                    >
                      {tool.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Frame: Realistic Executive Audit Preview Card */}
            <div id="example-audit" className="w-full lg:col-span-5">
              <div className="relative mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-5 shadow-xl shadow-zinc-200/40 sm:p-6">
                
                {/* Header Meta Status */}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-medium tracking-wide text-zinc-400 uppercase">Audit Assessment</span>
                    <span className="text-xs font-semibold text-zinc-900 mt-0.5">spendora_report_01a.md</span>
                  </div>
                  <span className="inline-flex items-center rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-800 ring-1 ring-inset ring-zinc-200">
                    Calculations Verified
                  </span>
                </div>

                {/* Savings Abstract Indicator */}
                <div className="py-5">
                  <p className="text-xs font-medium text-zinc-400">Identified Cumulative Annual Waste</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight text-zinc-950">$10,320</span>
                    <span className="text-xs font-medium text-emerald-600 font-mono bg-emerald-50 px-1.5 py-0.5 rounded">~26% optimized</span>
                  </div>
                </div>

                {/* Real Operational Recommendation Rows */}
                <div className="space-y-2.5">
                  {AUDIT_RECOMMENDATIONS.map((rec, i) => (
                    <div key={i} className="rounded-xl border border-zinc-100 bg-zinc-50/40 p-3.5 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-zinc-900">{rec.tool}</span>
                          <span className="text-[11px] font-medium text-zinc-400 mt-0.5 uppercase tracking-wide">{rec.action}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-zinc-950 whitespace-nowrap bg-white border border-zinc-200/80 px-2 py-0.5 rounded shadow-2xs">
                          {rec.savingsLabel}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-normal text-zinc-500">
                        {rec.context}
                      </p>
                    </div>
                  ))}
                </div>

                {/* AI Executive Summary Block Component */}
                <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-950 p-4 text-white">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <svg className="h-3 w-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Contextual Executive Insight
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-300 font-medium">
                    "Structural redundancy stems directly from overlapping IDE licensing sets between individual engineering team preferences. Consolidating defaults resolves cost variables immediately without impacting deployment speed."
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. STATS SECTION ──────────────────────────── */}
      <section className="border-b border-zinc-200 bg-zinc-50/50 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 border-zinc-200 sm:grid-cols-2 lg:grid-cols-4">
            {STATS_ITEMS.map((stat, i) => (
              <div key={i} className="flex flex-col items-start border-l border-zinc-200 pl-6 first:border-0">
                <span className="text-3xl font-bold tracking-tight text-zinc-950">{stat.value}</span>
                <span className="mt-1.5 text-xs font-semibold text-zinc-900">{stat.label}</span>
                <span className="mt-0.5 text-xs text-zinc-400 leading-normal">{stat.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. PROBLEM SECTION ────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">Operational Realities</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            AI adoption scaled. Cost visibility didn’t.
          </h2>
          <p className="mt-4 text-base text-zinc-500 leading-relaxed">
            SaaS visibility paradigms assume licenses are managed by a centralized IT procurement division. AI platforms operate on direct individual access pipelines, fragmented corporate card expenses, and varying API consumption behaviors.
          </p>
        </div>

        {/* 3 Polished Structural Grid Cards */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEM_CARDS.map((card, i) => (
            <div 
              key={i} 
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 transition-all duration-200 hover:shadow-md hover:border-zinc-300"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 font-mono">{card.tagline}</span>
                <h3 className="mt-3 text-lg font-bold text-zinc-950">{card.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-500">{card.description}</p>
              </div>
              <div className="mt-6 border-t border-zinc-100 pt-4 text-xs font-medium text-zinc-400">
                Estimated Profile: <span className="text-zinc-900">{card.metricBaseline}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. HOW IT WORKS SECTION ────────────────────── */}
      <section id="how-it-works" className="border-t border-zinc-200 bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">Clean Infrastructure Mapping</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">Deterministic logic from inputs to actions</h2>
          </div>

          {/* Clean Horizontal/Vertical Timeline Sequence */}
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="flex flex-col border border-zinc-200/80 rounded-2xl p-6 bg-zinc-50/30">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-zinc-200">{step.number}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                </div>
                <h3 className="mt-4 text-base font-bold text-zinc-950">{step.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-500 flex-grow">{step.description}</p>
                
                <div className="mt-4 border-t border-zinc-100 pt-3 text-[11px] font-mono text-zinc-400">
                  {step.technicalContext}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 6. FEATURES SECTION ───────────────────────── */}
      <section id="features" className="bg-[#fafafa] border-y border-zinc-200/80 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">Available Scope</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">What our verification platform delivers</h2>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURE_GRID.map((feat, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5">
                <span className="inline-flex items-center rounded bg-zinc-50 border border-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-600 font-mono">
                  {feat.badge}
                </span>
                <h3 className="mt-4 text-sm font-bold text-zinc-950">{feat.title}</h3>
                <p className="mt-1.5 text-xs text-zinc-500 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. SOCIAL PROOF SECTION ────────────────────── */}
      <section className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">Empirical Verification</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">Used by engineering managers and founders</h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="flex flex-col justify-between rounded-2xl border border-zinc-200 p-6 bg-[#fafafa]/50">
                <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 italic">
                  "{t.quote}"
                </p>
                <div className="mt-6 border-t border-zinc-100 pt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-950">{t.author}</span>
                    <span className="text-[11px] text-zinc-400 mt-0.5">{t.role}, {t.company}</span>
                  </div>
                  <span className="text-[10px] font-mono font-semibold bg-zinc-100 border border-zinc-200 text-zinc-900 px-2 py-0.5 rounded">
                    {t.realizedSavings}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. HONESTY / TRUST SECTION ─────────────────── */}
      <section id="pricing-data" className="bg-[#fafafa] border-t border-zinc-200 py-24">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-sm font-semibold mb-4">
            !
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950">We don’t manufacture savings.</h2>
          
          <div className="mt-6 max-w-2xl mx-auto text-left space-y-4 text-xs sm:text-sm text-zinc-500 leading-relaxed">
            <p>
              Many SaaS optimization systems use variable LLM estimations to invent imaginary optimization trajectories simply to force enterprise license retention cycles. Spendora operates entirely on <strong>rule-based, deterministic parsing algorithms</strong>.
            </p>
            <p>
              If your current software seat allocation configuration matches peak structural optimization guidelines perfectly, our dashboard tells you exactly that. Every calculation parameter traces directly to public pricing lines without custom weights or black-box estimation math.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 9. FINAL CTA SECTION ──────────────────────── */}
      <section id="audit-engine" className="bg-white border-y border-zinc-200 py-24 text-center relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Stop guessing where the AI budget disappears.
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
            Takes under 60 seconds. Requires zero credit card variables or workspace credentials to output a validated plan breakdown.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <button type="button" className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all">
              Run Free Audit
            </button>
            <a href="#example-audit" className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition-all">
              See Example Report
            </a>
          </div>
        </div>
      </section>

      {/* ─── 10. FOOTER COMPONENT ──────────────────────── */}
      <footer className="bg-white py-12 border-t border-zinc-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-100 pb-8">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-zinc-950 flex items-center justify-center text-white font-mono text-[10px] font-bold">
                S
              </div>
              <span className="font-semibold text-xs tracking-tight text-zinc-900">Spendora Engine Framework</span>
            </div>
            
            {/* Nav Grid Link Framework */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-400">
              <a href="#" className="hover:text-zinc-950 transition-colors">Product Strategy</a>
              <a href="#" className="hover:text-zinc-950 transition-colors">Resources Matrix</a>
              <a href="https://github.com" className="hover:text-zinc-950 transition-colors">GitHub Reference</a>
              <a href="#" className="hover:text-zinc-950 transition-colors">Architecture Configuration</a>
              <a href="#" className="hover:text-zinc-950 transition-colors">Privacy Ledger</a>
              <a href="#" className="hover:text-zinc-950 transition-colors">Terms System</a>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] font-mono text-zinc-400 gap-4">
            <div>&copy; {new Date().getFullYear()} Spendora Inc. Verified Accounting Endpoints.</div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              All downstream configurations run deterministically
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}