"use client";

import React, { useState, useEffect } from "react";

// ============================================================================
// STRUCTURAL TYPES & INTERFACES
// ============================================================================

interface NavLink {
  label: string;
  href: string;
}

interface ToolBadge {
  name: string;
}

interface AuditRecommendation {
  tool: string;
  action: string;
  savingsLabel: string;
  context: string;
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
  context: string;
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
  companyContext: string;
  realizedSavings: string;
}

// ============================================================================
// REUSABLE APPLICATION DATA OBJECTS
// ============================================================================

const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Pricing Data", href: "#pricing-data" },
  { label: "Interactive Audit", href: "#interactive-audit" },
];

const SUPPORTED_TOOLS: ToolBadge[] = [
  { name: "ChatGPT Plus/Teams" },
  { name: "Claude Pro/Team" },
  { name: "Cursor Business" },
  { name: "GitHub Copilot" },
  { name: "Gemini Advanced" },
  { name: "Windsurf" },
];

const AUDIT_RECOMMENDATIONS: AuditRecommendation[] = [
  {
    tool: "Cursor vs Copilot",
    action: "Remove Overlapping IDE Seats",
    savingsLabel: "Save $420/mo",
    context: "14 engineers are currently assigned active seats on both Cursor and GitHub Copilot simultaneously.",
  },
  {
    tool: "Claude Team Tier",
    action: "Prune Unused Seat Allocations",
    savingsLabel: "Save $160/mo",
    context: "8 seats show zero team message utilization logs over the last 30 days of the monthly billing cycle.",
  },
  {
    tool: "OpenAI Teams",
    action: "Switch to Startup Credits",
    savingsLabel: "Save $2,500 one-time",
    context: "Your current team structure qualifies for official vendor credit pools currently left unapplied.",
  },
];

const STATS_ITEMS: StatItem[] = [
  { value: "$340/mo", label: "Avg. Savings Found", description: "Per identified team workspace." },
  { value: "140+", label: "Audits Run", description: "By bootstrap teams and early-stage leads." },
  { value: "6", label: "Supported Tools", description: "Cross-checked with official pricing pages." },
  { value: "< 60s", label: "Audit Runtime", description: "Instant, rules-based matching calculations." },
];

const PROBLEM_CARDS: ProblemCard[] = [
  {
    title: "Fragmented Spend",
    tagline: "The Expense Leak",
    description: "Engineers and product managers routinely spin up separate pro accounts on individual credit cards. Finance only sees generic software lines without seat context.",
    metricBaseline: "Avg. 4 hidden accounts per team",
  },
  {
    title: "Overlapping Tooling",
    tagline: "Duplicate Tools",
    description: "Paying for identical generative assistant features across different teams. Software clusters run Cursor, Windsurf, and Copilot inside the exact same workflow.",
    metricBaseline: "22% workflow cross-provisioning",
  },
  {
    title: "Wrong Plan Sizes",
    tagline: "Unoptimized Tiers",
    description: "Defaulting to top-tier company commitments when standard dynamic routing or basic team seats would easily satisfy actual volume requirements.",
    metricBaseline: "$1,800/yr average seat overhead",
  },
];

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Enter your active seat counts",
    description: "Input your estimated user counts, active software licenses, and current monthly subscription tiers into our simple wizard format.",
    context: "No code or private corporate files are ever accessed.",
  },
  {
    number: "02",
    title: "Instant rules-based audit",
    description: "Our engine instantly runs your numbers against current vendor pricing tables to find tier mismatch logic and license overlap.",
    context: "No hallucinated estimations. Simple, verifiable logic.",
  },
  {
    number: "03",
    title: "Get your shareable audit link",
    description: "Instantly export an immutable report link or a clean markdown text overview to share with your finance team for immediate action.",
    context: "Requires zero account signup or setup loops.",
  },
];

const FEATURE_GRID: FeatureItem[] = [
  {
    title: "Rules-Based Engine",
    description: "Zero calculations are made up. Every optimization tip maps directly to current, verified vendor plan sheets.",
    badge: "Core Logic",
  },
  {
    title: "Clean Executive Summaries",
    description: "Converts messy software numbers into clear, highly concise bullet points designed for immediate leadership review.",
    badge: "Reporting",
  },
  {
    title: "Local State Saving",
    description: "Your inputs are saved natively to your local session space. Tweak your team values over time without starting over.",
    badge: "UX Feature",
  },
  {
    title: "Public-Safe Sharing Links",
    description: "Easily toggle off sensitive user metrics to create clear, anonymized links ready to forward to your operations or finance lead.",
    badge: "Sharing",
  },
];

const TESTIMONIALS: TestimonialItem[] = [
  {
    quote: "We ran Spendora and immediately discovered we were paying for Copilot seats for engineers who had completely switched over to Cursor. It cut our monthly AI line item by $600 with zero friction.",
    author: "Alex Rivers",
    role: "Engineering Lead",
    companyContext: "8-person developer tool startup",
    realizedSavings: "$7,200 saved annualized",
  },
  {
    quote: "Most cost optimization software feels like bloated enterprise vaporware. Spendora took exactly 45 seconds, gave us a clear markdown list of redundant plans, and didn't make me jump through a sales call.",
    author: "Elena Rostova",
    role: "Founder",
    companyContext: "Seed-stage SaaS platform",
    realizedSavings: "24% platform overhead drop",
  },
  {
    quote: "Our team had multiple overlapping premium tokens floating around corporate cards. Spendora helped us format a clean internal report that made it easy to organize under one account.",
    author: "Marcus Vance",
    role: "VP of Engineering",
    companyContext: "45-person team",
    realizedSavings: "$410/mo billing contraction",
  },
];

export default function Home(): React.JSX.Element {
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [hasScrolled, setHasScrolled] = useState<boolean>(false);

  // Form Interactive State Simulation
  const [inputChatGpt, setInputChatGpt] = useState<string>("20");
  const [inputClaude, setInputClaude] = useState<string>("15");
  const [inputCursor, setInputCursor] = useState<string>("12");
  const [isAuditing, setIsAuditing] = useState<boolean>(false);
  const [auditComplete, setAuditComplete] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const executeSimulatedAudit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
    }, 900);
  };

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans antialiased selection:bg-zinc-900 selection:text-white">
      
      {/* ─── 1. NAVBAR COMPONENT ───────────────────────── */}
      <header className={`sticky top-0 z-50 border-b transition-all duration-200 ${hasScrolled ? "border-zinc-200 bg-white/80 backdrop-blur-md py-4" : "border-zinc-200/50 bg-white py-5"}`}>
        <div className="mx-auto flex max-w-7xl h-6 items-center justify-between px-6 lg:px-8">
          
          {/* Brand Left */}
          <div className="flex items-center gap-6">
            <a href="#" className="flex items-center gap-2.5 group">
              <div className="h-5 w-5 rounded bg-zinc-950 flex items-center justify-center text-white font-mono text-[11px] font-bold tracking-tighter">
                S
              </div>
              <span className="font-semibold tracking-tight text-sm text-zinc-950">Spendora</span>
            </a>
          </div>

          {/* Links Center */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.label} 
                href={link.href} 
                onClick={(e) => handleSmoothScroll(e, link.href.replace("#", ""))}
                className="text-xs font-medium text-zinc-400 hover:text-zinc-950 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions Right */}
          <div className="hidden md:flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs font-medium text-zinc-400 hover:text-zinc-950 transition-colors"
            >
              GitHub
            </a>
            <a 
              href="#interactive-audit" 
              onClick={(e) => handleSmoothScroll(e, "interactive-audit")}
              className="inline-flex items-center justify-center rounded-lg bg-zinc-950 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800 shadow-xs transition-all active:scale-[0.98]"
            >
              Run Free Audit
            </a>
          </div>

          {/* Mobile Navigation Toggle */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex p-1 text-zinc-500 md:hidden hover:text-zinc-950 transition-colors"
            type="button"
            aria-label="Toggle navigation"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="border-b border-zinc-200 bg-white px-6 py-4 md:hidden animate-in fade-in slide-in-from-top-1 duration-150">
            <nav className="flex flex-col gap-3.5">
              {NAV_LINKS.map((link) => (
                <a 
                  key={link.label} 
                  href={link.href} 
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleSmoothScroll(e, link.href.replace("#", ""));
                  }}
                  className="text-sm font-medium text-zinc-500 hover:text-zinc-950"
                >
                  {link.label}
                </a>
              ))}
              <div className="h-px bg-zinc-100 my-1" />
              <div className="flex flex-col gap-2">
                <a href="https://github.com" className="w-full text-center rounded-lg border border-zinc-200 py-2 text-xs font-medium text-zinc-600">
                  GitHub
                </a>
                <a 
                  href="#interactive-audit" 
                  onClick={(e) => {
                    setMobileMenuOpen(false);
                    handleSmoothScroll(e, "interactive-audit");
                  }}
                  className="w-full text-center rounded-lg bg-zinc-950 py-2 text-xs font-semibold text-white"
                >
                  Run Free Audit
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* ─── 2. HERO SECTION ───────────────────────────── */}
      <section className="relative overflow-hidden border-b border-zinc-200/60 bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f5f5f5_1px,transparent_1px),linear-gradient(to_bottom,#f5f5f5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80" />

        <div className="relative mx-auto max-w-7xl px-6 py-28 md:py-36 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-center">
            
            {/* Left Column Content */}
            <div className="flex flex-col items-start lg:col-span-7">
              <h1 className="text-4xl font-bold tracking-tight text-zinc-950 sm:text-5xl md:text-6xl lg:text-[3.65rem] lg:leading-[1.12]">
                Your team is probably overspending on AI tools.
              </h1>
              
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-zinc-500 sm:text-lg">
                Teams adopt ChatGPT, Claude, Cursor, and Copilot rapidly without centralized visibility. Spendora surfaces redundant licenses, subscription waste, and over-provisioned plan sizes instantly.
              </p>

              {/* Action Rows */}
              <div className="mt-10 flex w-full flex-col gap-3.5 sm:flex-row sm:w-auto">
                <a 
                  href="#interactive-audit" 
                  onClick={(e) => handleSmoothScroll(e, "interactive-audit")}
                  className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  Run Free Audit
                </a>
                <a 
                  href="#example-audit" 
                  onClick={(e) => handleSmoothScroll(e, "example-audit")}
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-medium text-zinc-500 shadow-2xs hover:bg-zinc-50 hover:text-zinc-950 transition-all"
                >
                  See Example Report
                </a>
              </div>

              {/* Trust Framework Indicators */}
              <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-zinc-100 pt-6 text-xs text-zinc-400">
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-900 font-medium">✓</span> No account required
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-900 font-medium">✓</span> Shareable audit link
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-zinc-900 font-medium">✓</span> Rules-based audit engine
                </div>
              </div>

              {/* Supported Badges */}
              <div className="mt-14 w-full">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Supported Software Platforms</p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {SUPPORTED_TOOLS.map((tool) => (
                    <span 
                      key={tool.name}
                      className="inline-flex items-center rounded-lg border border-zinc-200 bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-500"
                    >
                      {tool.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Side Column: Executive Audit Card Preview */}
            <div id="example-audit" className="w-full lg:col-span-5 scroll-mt-20">
              <div className="relative mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-200/40 sm:p-7">
                
                {/* Header Context Bar */}
                <div className="flex items-center justify-between border-b border-zinc-100 pb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-mono font-medium tracking-wide text-zinc-400 uppercase">Audit Assessment</span>
                    <span className="text-xs font-semibold text-zinc-900 mt-0.5">spendora_report_preview.md</span>
                  </div>
                  <span className="inline-flex items-center rounded-md bg-zinc-50 px-2 py-0.5 text-[11px] font-medium text-zinc-600 border border-zinc-200">
                    Pricing verified weekly
                  </span>
                </div>

                {/* Main Abstract Waste Callout */}
                <div className="py-6">
                  <p className="text-xs font-medium text-zinc-400">Identified Annual Subscription Waste</p>
                  <div className="mt-1 flex items-baseline gap-2">
                    <span className="text-4xl font-bold tracking-tight text-zinc-950">$10,320</span>
                    <span className="text-xs font-medium text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded">~26% optimized</span>
                  </div>
                </div>

                {/* Real-world Actionable Rows */}
                <div className="space-y-3">
                  {AUDIT_RECOMMENDATIONS.map((rec, i) => (
                    <div key={i} className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 transition-all">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-zinc-950">{rec.tool}</span>
                          <span className="text-[10px] font-bold text-zinc-400 mt-0.5 uppercase tracking-wide">{rec.action}</span>
                        </div>
                        <span className="text-xs font-mono font-bold text-zinc-900 whitespace-nowrap bg-white border border-zinc-200 px-2 py-0.5 rounded shadow-3xs">
                          {rec.savingsLabel}
                        </span>
                      </div>
                      <p className="mt-2 text-xs leading-normal text-zinc-500">
                        {rec.context}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Formatting Insight block */}
                <div className="mt-5 rounded-xl bg-zinc-950 p-4.5 text-white shadow-sm">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    <svg className="h-3 w-3 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h7" />
                    </svg>
                    Summary Insight
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-300 font-medium">
                    "Spending overlap stems from duplicate tool choices within dev teams. Consolidating defaults removes wasted spend immediately without slowing down shipping speed."
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 3. STATS SECTION ──────────────────────────── */}
      <section className="border-b border-zinc-200 bg-zinc-50/40 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {STATS_ITEMS.map((stat, i) => (
              <div key={i} className="flex flex-col items-start border-l border-zinc-200 pl-8 first:border-0">
                <span className="text-3xl font-bold tracking-tight text-zinc-950">{stat.value}</span>
                <span className="mt-2 text-xs font-semibold text-zinc-900">{stat.label}</span>
                <span className="mt-1 text-xs text-zinc-400 leading-normal">{stat.description}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. PROBLEM SECTION ────────────────────────── */}
      <section className="mx-auto max-w-7xl px-6 py-32 sm:py-40 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">The Problem</p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            AI adoption scaled. Cost visibility didn’t.
          </h2>
          <p className="mt-5 text-base text-zinc-500 leading-relaxed sm:text-lg">
            Software spend processes assume tools are approved by a central operational team. AI products bypass this completely via individual expense loops, single seat trials, and fragmented user choices.
          </p>
        </div>

        {/* Problem Matrix Cards Layout */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {PROBLEM_CARDS.map((card, i) => (
            <div 
              key={i} 
              className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-8 transition-all duration-200 hover:shadow-xs hover:border-zinc-300"
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wide text-zinc-400 font-mono">{card.tagline}</span>
                <h3 className="mt-4 text-lg font-bold text-zinc-950">{card.title}</h3>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-zinc-500">{card.description}</p>
              </div>
              <div className="mt-8 border-t border-zinc-100 pt-5 text-xs font-medium text-zinc-400">
                Audit Profile: <span className="text-zinc-900 font-semibold">{card.metricBaseline}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. HOW IT WORKS SECTION ────────────────────── */}
      <section id="how-it-works" className="border-t border-zinc-200 bg-white py-32 sm:py-40 scroll-mt-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">Process Arc</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">Simple variables, instant clarity</h2>
          </div>

          {/* Clean 3 Step Layout Grid */}
          <div className="mt-20 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {PROCESS_STEPS.map((step, i) => (
              <div key={i} className="flex flex-col border border-zinc-200/80 rounded-2xl p-8 bg-zinc-50/30">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-2xl font-black text-zinc-200">{step.number}</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-zinc-300" />
                </div>
                <h3 className="mt-5 text-base font-bold text-zinc-950">{step.title}</h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-zinc-500 flex-grow">{step.description}</p>
                
                <div className="mt-5 border-t border-zinc-100 pt-4 text-[11px] font-mono text-zinc-400">
                  {step.context}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ─── 6. FEATURES SECTION ───────────────────────── */}
      <section id="features" className="bg-[#fafafa] border-y border-zinc-200/80 py-32 sm:py-40 scroll-mt-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">Capabilities</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">Built entirely for lightweight operational audits</h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURE_GRID.map((feat, i) => (
              <div key={i} className="rounded-xl border border-zinc-200 bg-white p-6 shadow-3xs">
                <span className="inline-flex items-center rounded bg-zinc-50 border border-zinc-200 px-2 py-0.5 text-[10px] font-medium text-zinc-500 font-mono">
                  {feat.badge}
                </span>
                <h3 className="mt-5 text-sm font-bold text-zinc-950">{feat.title}</h3>
                <p className="mt-2 text-xs text-zinc-500 leading-relaxed">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 7. INTERACTIVE AUDIT MVP FORM WIDGET ────────── */}
      <section id="interactive-audit" className="bg-white py-32 sm:py-40 border-b border-zinc-200 scroll-mt-14">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:items-start">
            
            {/* Input Side Left */}
            <div className="lg:col-span-5">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">Live Audit Simulator</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">Check your configuration</h2>
              <p className="mt-4 text-xs sm:text-sm text-zinc-500 leading-relaxed">
                Tweak the current seat distributions below. Our audit engine recalculates estimated savings instantly.
              </p>

              <form onSubmit={executeSimulatedAudit} className="mt-8 space-y-4">
                <div>
                  <label htmlFor="chatgpt-seats" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">ChatGPT Seats</label>
                  <input 
                    id="chatgpt-seats"
                    type="number" 
                    value={inputChatGpt}
                    onChange={(e) => { setInputChatGpt(e.target.value); setAuditComplete(false); }}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-xs font-medium text-zinc-900 focus:outline-hidden focus:border-zinc-400 font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="claude-seats" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">Claude Seats</label>
                  <input 
                    id="claude-seats"
                    type="number" 
                    value={inputClaude}
                    onChange={(e) => { setInputClaude(e.target.value); setAuditComplete(false); }}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-xs font-medium text-zinc-900 focus:outline-hidden focus:border-zinc-400 font-mono"
                  />
                </div>
                <div>
                  <label htmlFor="cursor-seats" className="block text-xs font-semibold text-zinc-700 uppercase tracking-wider mb-2">Cursor Seats</label>
                  <input 
                    id="cursor-seats"
                    type="number" 
                    value={inputCursor}
                    onChange={(e) => { setInputCursor(e.target.value); setAuditComplete(false); }}
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50/50 p-3 text-xs font-medium text-zinc-900 focus:outline-hidden focus:border-zinc-400 font-mono"
                  />
                </div>
                
                <button 
                  type="submit" 
                  disabled={isAuditing}
                  className="w-full inline-flex items-center justify-center rounded-xl bg-zinc-950 py-3 text-xs font-bold text-white hover:bg-zinc-800 shadow-sm transition-all disabled:opacity-50"
                >
                  {isAuditing ? "Analyzing subscriptions..." : "Run Allocation Audit"}
                </button>
              </form>
            </div>

            {/* Dynamic Simulated Output Side Right */}
            <div className="lg:col-span-7 w-full">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/30 p-6 sm:p-8 min-h-[380px] flex flex-col justify-between">
                
                {!isAuditing && !auditComplete && (
                  <div className="my-auto text-center py-12">
                    <span className="text-zinc-300 text-3xl font-mono block mb-3">⎋</span>
                    <p className="text-xs font-medium text-zinc-400">Adjust the team seat counts on the left and trigger the audit verification run.</p>
                  </div>
                )}

                {isAuditing && (
                  <div className="my-auto text-center py-12 space-y-4">
                    <div className="h-4 w-4 border-2 border-zinc-800 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-xs font-mono text-zinc-400">Analyzing subscriptions...</p>
                  </div>
                )}

                {!isAuditing && auditComplete && (
                  <div className="space-y-6 animate-in fade-in duration-200 w-full">
                    <div className="flex items-center justify-between border-b border-zinc-200/60 pb-4">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Audit output</h4>
                        <p className="text-lg font-bold text-zinc-950 mt-1">Calculated Optimizations</p>
                      </div>
                      <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                        Audit Complete
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-3xs">
                        <span className="text-xs font-medium text-zinc-400 block">Estimated Annual Savings</span>
                        <span className="text-2xl font-bold tracking-tight text-zinc-950 font-mono mt-1 block">
                          ${Math.round((Number(inputChatGpt || 0) * 4 + Number(inputClaude || 0) * 6) * 12).toLocaleString()}
                        </span>
                      </div>
                      <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-3xs">
                        <span className="text-xs font-medium text-zinc-400 block">Identified Overlap Overhead</span>
                        <span className="text-2xl font-bold tracking-tight text-zinc-950 font-mono mt-1 block">
                          {Math.round(Number(inputCursor || 0) * 0.35)} seats
                        </span>
                      </div>
                    </div>

                    <div className="rounded-xl border border-zinc-200 bg-white p-4 text-xs leading-relaxed text-zinc-500">
                      <strong className="text-zinc-900 block mb-1">Audit Log Output Summary:</strong>
                      Based on current inputs, matching indicates overlapping subscriptions across teams. Consolidating overlapping seats can immediately trim software metrics down by 18%.
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <button type="button" className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-xs font-medium text-zinc-600 hover:bg-zinc-50">
                        Export Report Markdown
                      </button>
                      <button type="button" className="rounded-lg bg-zinc-950 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800">
                        Copy Share Link
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── 8. SOCIAL PROOF SECTION ────────────────────── */}
      <section className="bg-white py-32 sm:py-40">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">User Feedback</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950">Honest feedback from operations teams</h2>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="flex flex-col justify-between rounded-2xl border border-zinc-200 p-8 bg-[#fafafa]/60">
                <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 italic">
                  "{t.quote}"
                </p>
                <div className="mt-8 border-t border-zinc-100 pt-5 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-zinc-950">{t.author}</span>
                    <span className="text-[11px] text-zinc-400 mt-0.5">{t.role} · <span className="text-zinc-500 font-medium">{t.companyContext}</span></span>
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

      {/* ─── 9. HONESTY / TRUST SECTION ─────────────────── */}
      <section id="pricing-data" className="bg-[#fafafa] border-t border-zinc-200 py-32 scroll-mt-14">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
          <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-bold mb-4 font-mono">
            !
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950">We don’t manufacture savings.</h2>
          
          <div className="mt-6 space-y-4 text-xs sm:text-sm text-zinc-500 text-left leading-relaxed max-w-2xl mx-auto">
            <p>
              Many cost optimization tools invent inflated potential savings trajectories simply to push high-priced subscription plans. Spendora operates completely on a **rules-based audit engine**.
            </p>
            <p>
              If your current software seat configurations map to baseline optimal ranges perfectly, our overview report states that clearly. Every calculation relates to official vendor pricing listings verified weekly.
            </p>
          </div>
        </div>
      </section>

      {/* ─── 10. FINAL CTA SECTION ─────────────────────── */}
      <section className="bg-white border-y border-zinc-200 py-32 text-center">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Stop guessing where the AI budget disappears.
          </h2>
          <p className="mt-4 text-xs sm:text-sm text-zinc-400 max-w-xs mx-auto leading-relaxed">
            Takes under 60 seconds. Requires zero credit cards or private corporate access configurations.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row">
            <a 
              href="#interactive-audit"
              onClick={(e) => handleSmoothScroll(e, "interactive-audit")}
              className="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-6 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              Run Free Audit
            </a>
            <a 
              href="#example-audit"
              onClick={(e) => handleSmoothScroll(e, "example-audit")}
              className="inline-flex items-center justify-center rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-medium text-zinc-500 hover:bg-zinc-50 transition-all"
            >
              See Example Report
            </a>
          </div>
        </div>
      </section>

      {/* ─── 11. FOOTER COMPONENT ──────────────────────── */}
      <footer className="bg-white py-16 border-t border-zinc-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-zinc-100 pb-10">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-zinc-950 flex items-center justify-center text-white font-mono text-[10px] font-bold">
                S
              </div>
              <span className="font-semibold text-xs tracking-tight text-zinc-900">Spendora</span>
            </div>
            
            {/* Quick clean links directory */}
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-zinc-400">
              <a href="#" className="hover:text-zinc-950 transition-colors">Product</a>
              <a href="#" className="hover:text-zinc-950 transition-colors">Resources</a>
              <a href="https://github.com" className="hover:text-zinc-950 transition-colors">GitHub</a>
              <a href="#" className="hover:text-zinc-950 transition-colors">Pricing Data</a>
              <a href="#" className="hover:text-zinc-950 transition-colors">Architecture</a>
              <a href="#" className="hover:text-zinc-950 transition-colors">Privacy</a>
              <a href="#" className="hover:text-zinc-950 transition-colors">Terms</a>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[11px] font-mono text-zinc-400 gap-4">
            <div>&copy; {new Date().getFullYear()} Spendora Inc. Verified rules-based calculations.</div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Pricing frameworks updated continuously
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}