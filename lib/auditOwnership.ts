import { db } from "@/lib/supabase";
import type { Database } from "@/lib/database.types";

export type AuditRow = Database["public"]["Tables"]["audits"]["Row"];

export async function loadAuditsForUser(
  userId: string,
  email?: string | null
): Promise<AuditRow[]> {
  const directAuditsPromise = db
    .admin()
    .from("audits")
    .select(
      "id,created_at,summary,summary_source,total_monthly_savings,total_annual_savings,tools,user_id"
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const linkedAuditIdsResult = email
    ? await db
        .admin()
        .from("leads")
        .select("audit_id")
        .eq("email", email.toLowerCase().trim())
        .not("audit_id", "is", null)
    : {
        data: [] as Array<{ audit_id: string | null }>,
        error: null as null,
      };

  if (linkedAuditIdsResult.error) {
    throw linkedAuditIdsResult.error;
  }

  const linkedAuditIds = linkedAuditIdsResult.data
    ?.map((lead) => lead.audit_id)
    .filter((auditId): auditId is string => Boolean(auditId)) ?? [];

  if (linkedAuditIds.length > 0) {
    const { error } = await db
      .admin()
      .from("audits")
      .update({ user_id: userId })
      .in("id", linkedAuditIds)
      .is("user_id", null);

    if (error) {
      throw error;
    }
  }

  const directAuditsResult = await directAuditsPromise;

  if (directAuditsResult.error) {
    throw directAuditsResult.error;
  }

  let linkedAudits: AuditRow[] = [];

  if (linkedAuditIds.length > 0) {
    const { data, error } = await db
      .admin()
      .from("audits")
      .select(
        "id,created_at,summary,summary_source,total_monthly_savings,total_annual_savings,tools,user_id"
      )
      .in("id", linkedAuditIds)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    linkedAudits = (data as AuditRow[]) ?? [];
  }

  const merged = Array.from(
    new Map(
      [
        ...((directAuditsResult.data as AuditRow[]) ?? []),
        ...linkedAudits,
      ].map((audit) => [audit.id, audit])
    ).values()
  );

  return merged;
}
