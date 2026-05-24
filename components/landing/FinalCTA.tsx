import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_45%)]" />

      <div className="relative mx-auto max-w-5xl px-6 py-28 text-center">
        <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-zinc-300 backdrop-blur-sm">
          Free forever · No credit card · Shareable reports
        </div>

        <h2 className="mt-10 text-5xl font-bold tracking-tight text-white lg:text-7xl">
          Stop guessing where the AI budget disappears.
        </h2>

        <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-zinc-400">
          Run a deterministic audit of your AI subscriptions, uncover overlapping
          tooling, and generate an executive-ready report in under 60 seconds.
        </p>

        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/audit/new"
            className="rounded-2xl bg-white px-8 py-4 text-lg font-semibold text-zinc-950 transition hover:-translate-y-0.5 hover:bg-zinc-200"
          >
            Run Free Audit
          </Link>

          <a
            href="#example-audit"
            className="rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-white/10"
          >
            See Example Report
          </a>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-zinc-500">
          <span>No account required</span>
          <span>Deterministic pricing logic</span>
          <span>AI-generated summaries</span>
          <span>Public shareable URLs</span>
        </div>
      </div>
    </section>
  );
}
