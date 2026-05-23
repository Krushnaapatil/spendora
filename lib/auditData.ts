import { db } from "@/lib/supabase";

import type { Database } from "@/lib/database.types";

export type AuditRow =
  Database["public"]["Tables"]["audits"]["Row"];

export async function getAuditById(
  id: string
): Promise<AuditRow | null> {
  const { data, error } = await db
    .admin()
    .from("audits")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}
