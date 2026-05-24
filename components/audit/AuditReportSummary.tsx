"use client";

import type { SummarySource } from "@/lib/types";

import AuditSummaryPoller from "./AuditSummaryPoller";

interface AuditReportSummaryProps {
  auditId: string;
  initialSummary: string | null;
  initialSource: SummarySource | null;
}

export default function AuditReportSummary({
  auditId,
  initialSummary,
  initialSource,
}: AuditReportSummaryProps) {
  return (
    <AuditSummaryPoller
      auditId={auditId}
      initialSummary={initialSummary}
      initialSource={initialSource}
    />
  );
}
