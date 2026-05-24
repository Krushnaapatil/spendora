import Link from "next/link";

import {
  AUDIT_RECOMMENDATIONS,
  SUPPORTED_TOOLS,
} from "@/data/landing";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#f7f7f3_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.09),transparent_30%),radial-gradient(circle_at_top_right,rgba(0,0,0,0.04),transparent_26%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.03),transparent_28%)]" />
      <div className="absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-200/20 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-36">
        <div className="max-w-3xl">
          <p className="mt-8 text-sm font-semibold uppercase tracking-[0.24em] text-zinc-400">
            Free audit · No account needed
          </p>

          <h1 className="mt-5 text-5xl font-semibold tracking-tight text-zinc-950 sm:text-6xl lg:text-7xl">
            Find the waste hiding in your AI stack.
          </h1>

          <p className="mt-7 max-w-2xl text-xl leading-9 text-zinc-600">
            Spendora reviews your tools, plans, seats, and monthly spend, then
            shows exactly where to downgrade, consolidate, or switch. You get a
            polished report, savings totals, and a shareable link in under a
            minute.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              href="/audit/new"
              className="inline-flex justify-center rounded-full bg-zinc-950 px-8 py-4 text-base font-semibold text-white shadow-[0_18px_40px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              Run Free Audit
            </Link>

            <a
              href="#example-audit"
              className="inline-flex justify-center rounded-full border border-zinc-200 bg-white px-8 py-4 text-base font-semibold text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-100"
            >
              See Example Report
            </a>
          </div>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            <div className="rounded-3xl border border-zinc-200 bg-white/90 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Deterministic
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Clear math, no fake savings.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/90 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Shareable
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Public report URL for your team.
              </p>
            </div>

            <div className="rounded-3xl border border-zinc-200 bg-white/90 p-4 shadow-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                AI summary
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-700">
                Executive-ready takeaways in seconds.
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-zinc-500">
            {SUPPORTED_TOOLS.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-zinc-200 bg-white/90 px-4 py-2 shadow-sm backdrop-blur"
              >
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div>
          <div className="rounded-[36px] border border-zinc-200 bg-white/90 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.1)] backdrop-blur">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-100 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                  Live preview
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-950">
                  Potential savings
                </h2>
              </div>

              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                Audit ready
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Monthly
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-600">
                  $400
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Annual
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-emerald-600">
                  $4.8k
                </p>
              </div>

              <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-zinc-400">
                  Tools
                </p>
                <p className="mt-2 text-3xl font-bold tracking-tight text-zinc-950">
                  3
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              {AUDIT_RECOMMENDATIONS.slice(0, 2).map((recommendation) => (
                <div
                  key={recommendation.tool}
                  className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="text-sm font-semibold text-zinc-950">
                        {recommendation.tool}
                      </p>
                      <p className="mt-1 text-sm text-zinc-500">
                        {recommendation.reason}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-semibold text-emerald-600">
                        {recommendation.savings}
                      </p>
                      <p className="mt-1 text-xs uppercase tracking-wide text-zinc-400">
                        {recommendation.action}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-[28px] border border-zinc-200 bg-[linear-gradient(180deg,#fafaf8_0%,#ffffff_100%)] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-400">
                Summary
              </p>
              <p className="mt-3 text-sm leading-7 text-zinc-700">
                Your team is paying retail on Claude and over-provisioning
                Cursor Business for the current headcount. The audit points to
                immediate savings without affecting workflow.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
