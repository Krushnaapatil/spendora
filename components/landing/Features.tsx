import { FEATURE_GRID } from "@/data/landing";

export default function Features() {
  return (
    <section
      id="features"
      className="relative overflow-hidden border-b border-zinc-200 bg-white"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.03),transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-600">
            Product capabilities
          </div>

          <h2 className="mt-8 text-5xl font-bold tracking-tight text-zinc-950 lg:text-6xl">
            Built for teams that care about operational clarity.
          </h2>

          <p className="mt-8 text-xl leading-9 text-zinc-600">
            Spendora combines deterministic audit infrastructure, public audit
            reports, and AI-generated summaries to help teams understand where
            AI spend is actually going.
          </p>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {FEATURE_GRID.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative overflow-hidden rounded-[32px] border border-zinc-200 bg-[#FAFAF8] p-8 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-[0_24px_60px_rgba(0,0,0,0.08)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.04),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="relative flex items-center justify-between">
                <span className="text-sm font-medium text-zinc-400">
                  0{index + 1}
                </span>

                <div className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium text-zinc-500">
                  Spendora
                </div>
              </div>

              <div className="relative mt-10">
                <h3 className="text-2xl font-semibold tracking-tight text-zinc-950">
                  {feature.title}
                </h3>

                <p className="mt-5 leading-8 text-zinc-600">
                  {feature.description}
                </p>
              </div>

              <div className="relative mt-10 flex items-center gap-2 text-sm font-medium text-zinc-500">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Production-ready workflow
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
