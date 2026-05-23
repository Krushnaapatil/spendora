import type {
  Metadata,
} from "next";

import type {
  ToolAuditResult,
} from "@/lib/types";

import {
  notFound,
} from "next/navigation";

import { db } from "@/lib/supabase";

import type {
  Database,
} from "@/lib/database.types";

import {
  formatUSD,
  toolLabel,
} from "@/lib/utils";

import ShareAuditCard from "@/components/audit/ShareAuditCard";
import SiteNavbar from "@/components/layout/SiteNavbar";

// ─── Route Params ─────────────────────────────────────────────────────────

interface AuditPageProps {
  params: Promise<{
    id: string;
  }>;
}

type AuditDbRow =
  Database["public"]["Tables"]["audits"]["Row"];

// ─── Fetch Audit ──────────────────────────────────────────────────────────

async function getAudit(
  id: string
): Promise<AuditDbRow | null> {
  const response =
    await db
      .admin()
      .from("audits")
      .select("*")
      .eq("id", id)
      .single();

  const typedResponse =
    response as unknown as {
      data: AuditDbRow | null;
      error: Error | null;
    };

  if (
    typedResponse.error ||
    !typedResponse.data
  ) {
    return null;
  }

  return typedResponse.data;
}

// ─── Metadata ─────────────────────────────────────────────────────────────

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
      audit.total_monthly_savings ?? 0
    );

  const annualSavings =
    formatUSD(
      audit.total_annual_savings ?? 0
    );

  const title =
    `This team could save ${monthlySavings}/mo on AI tools`;

  const description =
    `Spendora identified ${annualSavings}/year in potential AI tooling savings.`;

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

// ─── Confidence Badge ─────────────────────────────────────────────────────

function confidenceClasses(
  confidence?: string
): string {
  switch (confidence) {
    case "high":
      return "bg-green-100 text-green-700 border-green-200";

    case "medium":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";

    case "exploratory":
      return "bg-blue-100 text-blue-700 border-blue-200";

    default:
      return "bg-zinc-100 text-zinc-700 border-zinc-200";
  }
}

// ─── Action Label ─────────────────────────────────────────────────────────

function actionLabel(
  action: string
): string {
  switch (action) {
    case "downgrade":
      return "Downgrade Team Plan";

    case "switch":
      return "Consolidate Tooling";

    case "credits":
      return "Reduce Retail Spend";

    case "seat_mismatch":
      return "Optimize Seat Allocation";

    case "overlap":
      return "Remove Workflow Overlap";

    case "unused":
      return "Remove Underused Tool";

    case "optimal":
      return "Configuration Already Efficient";

    default:
      return "Optimization Opportunity";
  }
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

  const publicAudit = {
    id:
      audit.id,

    createdAt:
      audit.created_at,

    totalMonthlySavings:
      audit.total_monthly_savings ?? 0,

    totalAnnualSavings:
      audit.total_annual_savings ?? 0,

    aiSummary:
      audit.ai_summary ??
      audit.summary,

    summary:
      audit.summary ??
      audit.ai_summary,

    tools:
      Array.isArray(audit.results)
        ? (audit.results as unknown as ToolAuditResult[])
        : [],
  };

  return (
    <main className="min-h-screen bg-zinc-50">
      <SiteNavbar />

      <div className="mx-auto max-w-6xl px-6 py-12 pt-24">
        {/* ─── Hero ───────────────────────────────────── */}

        <section className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm lg:p-12">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
                Spendora AI Audit
              </p>

              <h1 className="text-4xl font-bold tracking-tight text-zinc-950 lg:text-6xl">
                This team could save{" "}
                <span className="text-green-600">
                  {formatUSD(
                    publicAudit.totalAnnualSavings
                  )}
                </span>
                /year
              </h1>

              <p className="mt-6 text-lg leading-8 text-zinc-600">
                Spendora analyzed this AI tooling stack and identified
                potential subscription inefficiencies, redundant spend,
                and optimization opportunities.
              </p>

              {publicAudit.aiSummary ? (
                <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                    Executive Summary
                  </p>

                  <p className="mt-3 leading-8 text-zinc-700">
                    {publicAudit.aiSummary}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <div className="rounded-xl bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                      {formatUSD(
                        publicAudit.totalMonthlySavings
                      )}/mo identified
                    </div>

                    <div className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700">
                      {publicAudit.tools.length} tools analyzed
                    </div>

                    <div className="rounded-xl bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                      Deterministic pricing audit
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="grid grid-cols-2 gap-4 lg:w-[320px]">
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-sm text-zinc-500">
                  Monthly Savings
                </p>

                <p className="mt-3 text-3xl font-bold text-zinc-950">
                  {formatUSD(
                    publicAudit.totalMonthlySavings
                  )}
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-sm text-zinc-500">
                  Tools Audited
                </p>

                <p className="mt-3 text-3xl font-bold text-zinc-950">
                  {publicAudit.tools.length}
                </p>
              </div>

              <div className="col-span-2 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
                <p className="text-sm text-zinc-500">
                  Generated
                </p>

                <p className="mt-3 text-sm font-medium text-zinc-800">
                  {new Date(
                    publicAudit.createdAt ??
                    new Date().toISOString()
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Recommendations ───────────────────────── */}

        <section className="mt-12">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
                Tool Recommendations
              </h2>

              <p className="mt-2 text-zinc-600">
                Optimization opportunities identified across the audited AI stack.
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {publicAudit.tools.map(
              (
                tool: ToolAuditResult
              ) => (
                <div
                  key={
                    tool.toolId
                  }
                  className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-semibold text-zinc-950">
                          {toolLabel(
                            tool.toolId
                          )}
                        </h3>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${confidenceClasses(
                            tool
                              .recommendation
                              .confidence
                          )}`}
                        >
                          {tool
                            .recommendation
                            .confidence ===
                            "high"
                            ? "High confidence"
                            : tool
                              .recommendation
                              .confidence ===
                              "medium"
                              ? "Medium confidence"
                              : "Exploratory recommendation"}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <div className="rounded-xl bg-zinc-100 px-4 py-2 text-sm text-zinc-700">
                          Current Spend:{" "}
                          <span className="font-semibold">
                            {formatUSD(
                              tool.currentSpend
                            )}
                            /mo
                          </span>
                        </div>

                        <div className="rounded-xl bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                          {actionLabel(
                            tool
                              .recommendation
                              .action
                          )}
                        </div>
                      </div>

                      <div className="mt-6">
                        <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
                          Recommendation
                        </p>

                        <p className="mt-3 leading-7 text-zinc-700">
                          {
                            tool
                              .recommendation
                              .reason
                          }
                        </p>
                      </div>
                    </div>

                    <div className="lg:min-w-45">
                      <div className="rounded-2xl bg-green-50 p-5 text-center">
                        <p className="text-sm font-medium text-green-700">
                          Estimated Savings
                        </p>

                        <p className="mt-3 text-4xl font-bold text-green-600">
                          {formatUSD(
                            tool
                              .recommendation
                              .monthlySavings
                          )}
                        </p>

                        <p className="mt-1 text-sm text-green-700">
                          per month
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        {/* ─── Share CTA ─────────────────────────────── */}

        <section className="mt-14 rounded-3xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
            Share this audit with your team
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-zinc-600">
            AI tooling costs scale faster than visibility.
            Share this audit internally to identify operational waste
            and optimization opportunities.
          </p>

          <div className="mx-auto max-w-2xl">
            <ShareAuditCard
              sharePath={`/audit/${publicAudit.id}`}
            />
          </div>
        </section>

        {/* ─── Footer ───────────────────────────────── */}

        <footer className="mt-14 border-t border-zinc-200 pt-6 text-sm text-zinc-500">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <p>
              Generated by Spendora
            </p>

            <p>
              AI tooling optimization for modern teams
            </p>
          </div>
        </footer>
      </div>
    </main>
  );
}
