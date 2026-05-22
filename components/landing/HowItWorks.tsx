import {
  PROCESS_STEPS,
} from "@/data/landing";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative overflow-hidden border-b border-zinc-200 bg-[#FAFAF8]"
    >
      {/* Background Glow */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,0,0,0.03),transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-28">
        {/* Header */}

        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm">
            Deterministic audit workflow
          </div>

          <h2 className="mt-8 text-5xl font-bold tracking-tight text-zinc-950 lg:text-6xl">
            From AI subscriptions to executive-ready reports in under a minute.
          </h2>

          <p className="mt-8 text-xl leading-9 text-zinc-600">
            Spendora combines deterministic pricing logic with AI-generated
            summaries to help teams uncover wasted AI spend without relying
            on hallucinated recommendations.
          </p>
        </div>

        {/* Timeline */}

        <div className="relative mt-24">
          {/* Vertical Line */}

          <div className="absolute left-6 top-0 hidden h-full w-px bg-zinc-200 lg:block" />

          <div className="space-y-8">
            {PROCESS_STEPS.map(
              (step, index) => (
                <div
                  key={step.step}
                  className="group relative grid gap-8 rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:grid-cols-[120px_1fr]"
                >
                  {/* Step Number */}

                  <div className="relative flex items-start lg:justify-center">
                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-zinc-950 text-lg font-bold text-white shadow-lg shadow-zinc-300">
                      {step.step}
                    </div>

                    {/* Connector */}

                    {index !==
                    PROCESS_STEPS.length -
                      1 ? (
                      <div className="absolute left-7 top-14 hidden h-[calc(100%+2rem)] w-px bg-zinc-200 lg:block" />
                    ) : null}
                  </div>

                  {/* Content */}

                  <div>
                    <h3 className="text-3xl font-semibold tracking-tight text-zinc-950">
                      {step.title}
                    </h3>

                    <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600">
                      {step.description}
                    </p>

                    {/* Extra Detail */}

                    <div className="mt-8 flex flex-wrap gap-3">
                      {step.step ===
                      "1" ? (
                        <>
                          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
                            Dynamic tool selection
                          </span>

                          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
                            Plan-aware forms
                          </span>

                          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
                            Persistent input state
                          </span>
                        </>
                      ) : null}

                      {step.step ===
                      "2" ? (
                        <>
                          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
                            Deterministic pricing rules
                          </span>

                          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
                            Official pricing references
                          </span>

                          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
                            No hallucinated savings
                          </span>
                        </>
                      ) : null}

                      {step.step ===
                      "3" ? (
                        <>
                          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
                            Public audit URL
                          </span>

                          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
                            Open Graph previews
                          </span>

                          <span className="rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm text-zinc-600">
                            Executive AI summary
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}