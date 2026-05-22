import {
  AUDIT_RECOMMENDATIONS,
  SUPPORTED_TOOLS,
} from "@/data/landing";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto grid max-w-7xl gap-20 px-6 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
        {/* Left Side */}

        <div>
          <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700">
            Free audit · No account needed
          </div>

          <h1 className="mt-8 text-5xl font-bold tracking-tight text-zinc-950 lg:text-7xl">
            Your team is probably overspending on AI tools.
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-zinc-600">
            Paste your AI subscriptions. Get a plain-English audit with
            per-tool savings, a shareable report, and an AI summary —
            in under 60 seconds.
          </p>

          {/* CTA */}

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
  <Link
    href="/audit/new"
    className="rounded-2xl bg-zinc-950 px-8 py-4 text-lg font-semibold text-white transition hover:bg-zinc-800"
  >
    Run Free Audit
  </Link>

  <a
    href="#example-audit"
    className="rounded-2xl border border-zinc-200 bg-white px-8 py-4 text-lg font-semibold text-zinc-700 transition hover:bg-zinc-100"
  >
    See Example Report
  </a>
</div>

          {/* Supported Tools */}

          <div className="mt-10 flex flex-wrap gap-3 text-sm text-zinc-500">
            {SUPPORTED_TOOLS.map(
              (tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-zinc-200 bg-white px-4 py-2"
                >
                  {tool}
                </span>
              )
            )}

            <span className="rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2">
              +2 more
            </span>
          </div>

          {/* Trust */}

          <div className="mt-8 flex flex-wrap gap-6 text-sm text-zinc-500">
            <span>No credit card</span>

            <span>
              Email captured after results
            </span>

            <span>
              Shareable URL
            </span>
          </div>
        </div>

        {/* Right Side */}

        <div>
          <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
            {/* Header */}

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                  Potential Annual Savings
                </p>

                <h2 className="mt-3 text-6xl font-bold tracking-tight text-green-600">
                  $4,800
                </h2>

                <p className="mt-3 text-zinc-500">
                  across 3 tools · 6-person team
                </p>
              </div>

              <div className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                Audit ready
              </div>
            </div>

            {/* Recommendations */}

            <div className="mt-10 space-y-4">
              {AUDIT_RECOMMENDATIONS.map(
                (
                  recommendation
                ) => (
                  <div
                    key={
                      recommendation.tool
                    }
                    className="rounded-2xl border border-zinc-200 p-5"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-zinc-950">
                          {
                            recommendation.tool
                          }
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          {
                            recommendation.reason
                          }
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-green-600">
                          {
                            recommendation.savings
                          }
                        </p>

                        <p className="mt-1 text-sm text-zinc-500">
                          {
                            recommendation.action
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>

            {/* AI Summary */}

            <div className="mt-8 rounded-2xl bg-zinc-100 p-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                AI-generated summary
              </p>

              <p className="mt-4 leading-8 text-zinc-700">
                Your team is paying retail on Claude when startup
                credits would reduce spend significantly. Cursor
                Business is over-provisioned for the current engineering
                team size, creating unnecessary monthly overhead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}