import Link from "next/link";

import { createClient } from "@/lib/supabase-server";
import AuditList from "@/components/audit/AuditList";
import { syncAuditsForUser } from "@/lib/auditOwnership";

type Audit = {
  id: string;
  created_at: string | null;
  summary: string | null;
  summary_source: string | null;
  total_monthly_savings: number | null;
  total_annual_savings: number | null;
  tools: unknown[] | null;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

async function getAudits(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("audits")
    .select(
      "id,created_at,summary,summary_source,total_monthly_savings,total_annual_savings,tools"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as Audit[]) ?? [];
}

export default async function AuditsPage() {
  const supabase = await createClient();
  const sessionResult = await supabase.auth.getSession();
  const session = sessionResult.data.session;

  if (session?.user.email) {
    await syncAuditsForUser(
      session.user.id,
      session.user.email
    );
  }

  const audits = session
    ? await getAudits(session.user.id)
    : [];

  return (
    <main className="min-h-screen bg-[#FAFAF8] px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}

        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
              Spendora Dashboard
            </p>

            <h1 className="mt-3 text-5xl font-bold tracking-tight text-zinc-950">
              Your Audits
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-zinc-600">
              View historical AI spend audits,
              revisit optimization
              opportunities, and track
              savings across your tooling
              stack.
            </p>
          </div>

          <Link
            href="/audit/new"
            className="inline-flex items-center justify-center rounded-2xl bg-zinc-950 px-6 py-4 font-semibold text-white transition hover:bg-zinc-800"
          >
            Run New Audit
          </Link>
        </div>

        {!session ? (
          <AuditList />
        ) : audits.length === 0 ? (
          <div className="mt-16 rounded-[32px] border border-dashed border-zinc-300 bg-white p-16 text-center">
            <h2 className="text-3xl font-bold text-zinc-950">No audits yet</h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-600">
              Run your first AI tooling audit to start tracking optimization opportunities and historical savings.
            </p>

            <Link
              href="/audit/new"
              className="mt-8 inline-flex rounded-2xl bg-zinc-950 px-6 py-4 font-semibold text-white transition hover:bg-zinc-800"
            >
              Create First Audit
            </Link>
          </div>
        ) : (
          <div className="mt-16 grid gap-6">
            {audits.map((audit) => (
              <Link
                key={audit.id}
                href={`/audit/${audit.id}`}
                className="group rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                        {formatCurrency(audit.total_annual_savings ?? 0)} annual savings
                      </span>

                      <span className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700">
                        {Array.isArray(audit.tools) ? audit.tools.length : 0} tools
                      </span>

                      <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                        {audit.summary_source ?? "deterministic"}
                      </span>
                    </div>

                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-950">
                      {formatCurrency(audit.total_monthly_savings ?? 0)}/mo potential savings
                    </h2>

                    <p className="mt-3 max-w-3xl leading-7 text-zinc-600">
                      {audit.summary ?? "No summary available."}
                    </p>
                  </div>

                  <div className="flex flex-col items-start gap-3 lg:items-end">
                    <div className="text-sm text-zinc-500">Created {formatDate(audit.created_at)}</div>
                    <div className="rounded-2xl border border-zinc-200 px-5 py-3 font-semibold text-zinc-700 transition group-hover:bg-zinc-950 group-hover:text-white">
                      Open Audit
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
