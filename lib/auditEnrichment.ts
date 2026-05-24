import { generateAuditSummary } from "@/lib/ai";
import { db } from "@/lib/supabase";
import type { AuditResult } from "@/lib/types";

/**
 * Background job: generate AI summary and persist to an existing audit row.
 */
export async function enrichAuditWithAiSummary(
  auditId: string,
  result: AuditResult
): Promise<void> {
  const summaryResult = await generateAuditSummary(result);

  const { error } = await db
    .admin()
    .from("audits")
    .update({
      summary: summaryResult.summary,
      ai_summary: summaryResult.summary,
      summary_source: summaryResult.source,
    })
    .eq("id", auditId);

  if (error) {
    throw error;
  }

  console.info("[audit] AI summary enriched", {
    auditId,
    source: summaryResult.source,
  });
}
