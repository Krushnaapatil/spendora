import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-[#FAFAF8]">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-zinc-950"
            >
              Spendora
            </Link>

            <p className="mt-6 max-w-xl text-lg leading-8 text-zinc-600">
              AI spend visibility and optimization for modern teams. Deterministic
              audit infrastructure with executive-ready reporting.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600">
                Deterministic recommendations
              </span>
              <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600">
                AI-generated summaries
              </span>
              <span className="rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-600">
                Public audit reports
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Product
              </h3>

              <div className="mt-6 space-y-4">
                <a href="#features" className="block text-zinc-600 transition hover:text-zinc-950">
                  Features
                </a>
                <a href="#how-it-works" className="block text-zinc-600 transition hover:text-zinc-950">
                  How It Works
                </a>
                <a href="#example-audit" className="block text-zinc-600 transition hover:text-zinc-950">
                  Example Audit
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Resources
              </h3>

              <div className="mt-6 space-y-4">
                <a href="#pricing-data" className="block text-zinc-600 transition hover:text-zinc-950">
                  Pricing Data
                </a>
                <a href="#" className="block text-zinc-600 transition hover:text-zinc-950">
                  Architecture
                </a>
                <a href="#" className="block text-zinc-600 transition hover:text-zinc-950">
                  Documentation
                </a>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Company
              </h3>

              <div className="mt-6 space-y-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noreferrer"
                  className="block text-zinc-600 transition hover:text-zinc-950"
                >
                  GitHub
                </a>
                <a href="#" className="block text-zinc-600 transition hover:text-zinc-950">
                  Privacy
                </a>
                <a href="#" className="block text-zinc-600 transition hover:text-zinc-950">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-zinc-200 pt-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Spendora. Built for operational clarity.
          </p>

          <div className="flex items-center gap-6">
            <span>Next.js</span>
            <span>Supabase</span>
            <span>OpenRouter</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
