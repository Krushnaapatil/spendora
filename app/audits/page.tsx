import Link from "next/link";

import AuditList from "@/components/audit/AuditList";

export default function AuditsPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              Spendora Dashboard
            </p>

            <h1 className="mt-3 text-5xl font-bold tracking-tight text-zinc-950">
              Your Audits
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-zinc-600">
              View historical AI spend audits, revisit optimization opportunities, and track savings across your tooling stack.
            </p>
          </div>

          <Link
            href="/audit/new"
            className="inline-flex items-center justify-center rounded-2xl bg-zinc-950 px-6 py-4 font-semibold text-white transition hover:bg-zinc-800"
          >
            Run New Audit
          </Link>
        </div>

        <AuditList />
      </div>
    </main>
  );
}
