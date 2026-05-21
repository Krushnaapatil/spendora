import type {
  Metadata,
} from "next";

import type {
  AuditRow,
} from "@/lib/types";

import {
  notFound,
} from "next/navigation";

import { db } from "@/lib/supabase";

import {
  formatUSD,
  toolLabel,
} from "@/lib/utils";

// ─── Route Params ─────────────────────────────────────────────────────────

interface AuditPageProps {
  params: Promise<{
    id: string;
  }>;
}

// ─── Shared Fetch Helper ──────────────────────────────────────────────────

async function getAudit(
  id: string
): Promise<AuditRow | null> {
  const {
    data,
    error,
  }: {
    data: AuditRow | null;

    error: Error | null;
  } = await db
    .server()
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (
    error ||
    !data
  ) {
    return null;
  }

  return data;
}

// ─── SEO Metadata ─────────────────────────────────────────────────────────

export async function generateMetadata(
  props: AuditPageProps
): Promise<Metadata> {
  const params =
    await props.params;

  const audit =
    await getAudit(
      params.id
    );

  if (!audit) {
    return {
      title:
        "Audit Not Found | Spendora",
    };
  }

  const monthlySavings =
    formatUSD(
      audit.total_monthly_savings
    );

  const annualSavings =
    formatUSD(
      audit.total_annual_savings
    );

  const title =
    `This team could save ${monthlySavings}/mo on AI tools`;

  const description =
    `Spendora identified potential savings of ${monthlySavings}/month (${annualSavings}/year) across AI tooling subscriptions.`;

  return {
    title,

    description,

    openGraph: {
      title,

      description,

      type: "website",
    },

    twitter: {
      card:
        "summary_large_image",

      title,

      description,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────

export default async function AuditPage(
  props: AuditPageProps
) {
  const params =
    await props.params;

  const audit =
    await getAudit(
      params.id
    );

  if (!audit) {
    notFound();
  }

  // ── Public-safe sanitized object ───────────────────────────────────

  const publicAudit = {
    id:
      audit.id,

    createdAt:
      audit.created_at,

    totalMonthlySavings:
      audit.total_monthly_savings,

    totalAnnualSavings:
      audit.total_annual_savings,

    aiSummary:
      audit.ai_summary,

    tools:
      audit.results,
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      {/* ─── Header ───────────────────────────────────────────── */}

      <div className="mb-10">
        <p className="mb-2 text-sm text-zinc-500">
          Spendora AI Audit
        </p>

        <h1 className="text-4xl font-bold tracking-tight">
          Potential Savings:
          {" "}
          {formatUSD(
            publicAudit.totalMonthlySavings
          )}
          /mo
        </h1>

        <p className="mt-3 text-lg text-zinc-600">
          Estimated annual savings:
          {" "}
          {formatUSD(
            publicAudit.totalAnnualSavings
          )}
        </p>
      </div>

      {/* ─── AI Summary ───────────────────────────────────────── */}

      {publicAudit.aiSummary ? (
        <section className="mb-10 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
          <h2 className="mb-3 text-lg font-semibold">
            Executive Summary
          </h2>

          <p className="leading-7 text-zinc-700">
            {publicAudit.aiSummary}
          </p>
        </section>
      ) : null}

      {/* ─── Tool Recommendations ─────────────────────────────── */}

      <section>
        <h2 className="mb-6 text-2xl font-semibold">
          Tool Recommendations
        </h2>

        <div className="space-y-4">
          {publicAudit.tools.map(
            (tool: AuditRow["results"][number]) => (
              <div
                key={
                  tool.toolId
                }
                className="rounded-2xl border border-zinc-200 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {toolLabel(
                        tool.toolId
                      )}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500">
                      Current Spend:
                      {" "}
                      {formatUSD(
                        tool.currentSpend
                      )}
                      /mo
                    </p>
                  </div>

                  <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                    Save{" "}
                    {formatUSD(
                      tool.recommendation
                        .monthlySavings
                    )}
                    /mo
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
                    Recommendation
                  </p>

                  <p className="mt-1 text-zinc-700">
                    {
                      tool
                        .recommendation
                        .reason
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {/* ─── Footer ───────────────────────────────────────────── */}

      <footer className="mt-12 border-t border-zinc-200 pt-6 text-sm text-zinc-500">
        Generated by Spendora
      </footer>
    </main>
  );
}