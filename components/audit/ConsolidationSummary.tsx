"use client";

import React from "react";

import type { ToolAuditResult } from "@/lib/types";

export default function ConsolidationSummary({
  tools,
}: {
  tools: ToolAuditResult[];
}) {
  // Identify consolidated recommendations
  const consolidations = tools.filter((t) => t.recommendation.action === "consolidate");

  if (consolidations.length === 0) return null;

  return (
    <div className="mt-6 rounded-2xl border border-zinc-200 bg-amber-50 p-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-800">Consolidation Summary</p>
      <p className="mt-3 text-sm text-amber-900">
        We detected consolidation opportunities that combine multiple overlapping subscriptions into single vendor alternatives. Follow the consolidated guidance to avoid duplicated recommendations.
      </p>

      <div className="mt-4 grid gap-3">
        {consolidations.map((c) => (
          <div key={c.toolId} className="rounded-xl border border-amber-200 bg-amber-25 p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-amber-800">{c.recommendation.targetToolId}</div>
                <div className="text-xs text-amber-700">Estimated combined savings: {""}{new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(c.recommendation.monthlySavings)}/mo</div>
              </div>
              <div className="text-sm font-semibold text-amber-800">{c.recommendation.confidence === 'high' ? 'High confidence' : c.recommendation.confidence === 'medium' ? 'Medium confidence' : 'Exploratory'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
