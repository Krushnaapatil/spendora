import Link from "next/link";

import {
  AUDIT_RECOMMENDATIONS,
  SUPPORTED_TOOLS,
} from "@/data/landing";

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-[linear-gradient(180deg,#ffffff_0%,#fafaf8_100%)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.04),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.03),transparent_30%)]" />

      <div className="relative mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:items-center lg:py-36">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-4 py-2 text-sm font-medium text-zinc-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Free audit · No account needed
          </div>

          <h1 className="mt-8 max-w-3xl text-5xl font-bold tracking-tight text-zinc-950 lg:text-7xl">
            Your team is probably overspending on{" "}
            <span className="bg-gradient-to-r from-zinc-950 via-zinc-700 to-zinc-500 bg-clip-text text-transparent">
              AI tools.
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-zinc-600">
            Paste your AI subscriptions. Get a sharp, executive-ready audit with
            per-tool savings, a shareable report, and an AI summary - in under 60 seconds.
          </p>

          <div className="mt-10 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
            <Link
              href="/audit/new"
              className="inline-flex justify-center rounded-2xl bg-zinc-950 px-8 py-4 text-lg font-semibold text-white shadow-[0_16px_40px_rgba(0,0,0,0.18)] transition hover:-translate-y-0.5 hover:bg-zinc-800"
            >
              Run Free Audit
            </Link>

            <a
              href="#example-audit"
              className="inline-flex justify-center rounded-2xl border border-zinc-200 bg-white px-8 py-4 text-lg font-semibold text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-100"
            >
              See Example Report
            </a>
          </div>

          <div className="mt-10 flex flex-wrap gap-3 text-sm text-zinc-500">
            {SUPPORTED_TOOLS.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-zinc-200 bg-white/90 px-4 py-2 shadow-sm backdrop-blur"
              >
                {tool}
              </span>
            ))}

            <span className="rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2">
              +2 more
            </span>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-zinc-500">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              No credit card
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              Email captured after results
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
              Shareable URL
            </span>
          </div>
        </div>

        <div>
          <div className="rounded-[32px] border border-zinc-200 bg-white/90 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.10)] backdrop-blur">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                  Potential Annual Savings
                </p>

                <h2 className="mt-3 text-6xl font-bold tracking-tight text-emerald-600">
                  $4,800
                </h2>

                <p className="mt-3 text-zinc-500">
                  across 3 tools · 6-person team
                </p>
              </div>

              <div className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                Audit ready
              </div>
            </div>

            <div className="mt-10 space-y-4">
              {AUDIT_RECOMMENDATIONS.map((recommendation) => (
                <div
                  key={recommendation.tool}
                  className="rounded-2xl border border-zinc-200 bg-zinc-50/70 p-5 transition hover:border-zinc-300 hover:bg-white"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <p className="font-semibold text-zinc-950">
                        {recommendation.tool}
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        {recommendation.reason}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-emerald-600">
                        {recommendation.savings}
                      </p>

                      <p className="mt-1 text-sm text-zinc-500">
                        {recommendation.action}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-zinc-200 bg-[linear-gradient(180deg,#fafaf8_0%,#ffffff_100%)] p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                AI-generated summary
              </p>

              <p className="mt-4 leading-8 text-zinc-700">
                Your team is paying retail on Claude when startup credits would
                reduce spend significantly. Cursor Business is over-provisioned
                for the current engineering team size, creating unnecessary
                monthly overhead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
