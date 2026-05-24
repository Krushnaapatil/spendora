import { db } from "@/lib/supabase";

import type { Database } from "@/lib/database.types";

export type AuditRow =
  Database["public"]["Tables"]["audits"]["Row"];

/**
 * Fetch a single audit for public report pages.
 *
 * Uses the get_audit_public RPC so anonymous clients cannot list all audits.
 */
export async function getAuditById(
  id: string
): Promise<AuditRow | null> {
  const { data, error } = await db
    .admin()
    .from("audits")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as AuditRow;
}
