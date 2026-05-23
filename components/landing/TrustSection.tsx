import {
  PRICING_LAST_VERIFIED,
} from "@/lib/pricing";

export default function TrustSection() {
  return (
    <section
      id="pricing-data"
      className="relative overflow-hidden border-b border-zinc-200 bg-white scroll-mt-24"
    >
      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03),transparent_45%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-28">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          {/* Left */}

          <div>
            <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-600">
              Honest by design
            </div>

            <h2 className="mt-8 text-5xl font-bold tracking-tight text-zinc-950 lg:text-6xl">
              We don&apos;t manufacture savings.
            </h2>

            <p className="mt-8 text-xl leading-9 text-zinc-600">
              If your current setup is already optimal, Spendora says so
              clearly. Every recommendation must pass what we call the
              finance-person test — the reasoning should immediately make
              sense to someone reviewing operational spend.
            </p>

            <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
              Pricing sources are documented in <span className="font-semibold text-zinc-900">PRICING_DATA.md</span> and were last verified on <span className="font-semibold text-zinc-900">{PRICING_LAST_VERIFIED}</span>.
            </div>

            <div className="mt-12 space-y-5">
              <div className="flex items-start gap-4">
                <div className="mt-2 h-2.5 w-2.5 rounded-full bg-green-500" />

                <p className="text-lg text-zinc-700">
                  Savings are shown only when mathematically real.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-2 h-2.5 w-2.5 rounded-full bg-green-500" />

                <p className="text-lg text-zinc-700">
                  Every recommendation includes a concise explanation.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-2 h-2.5 w-2.5 rounded-full bg-green-500" />

                <p className="text-lg text-zinc-700">
                  Pricing references are verified against official vendor
                  pricing pages and tied to source URLs in the docs.
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-2 h-2.5 w-2.5 rounded-full bg-green-500" />

                <p className="text-lg text-zinc-700">
                  AI is used for summaries — not for financial calculations.
                </p>
              </div>
            </div>
          </div>

          {/* Right */}

          <div className="relative">
            <div className="rounded-[36px] border border-zinc-200 bg-[#FAFAF8] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
              {/* Top */}

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                    Audit Integrity
                  </p>

                  <h3 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950">
                    Deterministic recommendations
                  </h3>
                </div>

                <div className="rounded-full border border-green-200 bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  Verified
                </div>
              </div>

              {/* Divider */}

              <div className="my-8 h-px bg-zinc-200" />

              {/* Recommendation */}

              <div className="rounded-3xl border border-zinc-200 bg-white p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <p className="text-xl font-semibold text-zinc-950">
                      Cursor Business
                    </p>

                    <p className="mt-3 leading-8 text-zinc-600">
                      Current team size does not justify the business-tier
                      pricing structure.
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      -$80/mo
                    </p>

                    <p className="mt-2 text-sm text-zinc-500">
                      downgrade
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer */}

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600">
                  Official pricing verified
                </span>

                <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600">
                  Rule-based audit engine
                </span>

                <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600">
                  No hallucinated savings
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
