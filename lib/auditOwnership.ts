import { db } from "@/lib/supabase";

/**
 * Backfill saved audits for a logged-in user.
 *
 * This links historical anonymous audits to the authenticated account
 * when we can match them through lead captures by email.
 */
export async function syncAuditsForUser(
  userId: string,
  email?: string | null
): Promise<void> {
  if (!email) {
    return;
  }

  const { data: leads, error } = await db
    .admin()
    .from("leads")
    .select("audit_id")
    .eq("email", email.toLowerCase().trim())
    .not("audit_id", "is", null);

  if (error || !leads?.length) {
    return;
  }

  const auditIds = leads
    .map((lead) => lead.audit_id)
    .filter(
      (auditId): auditId is string => Boolean(auditId)
    );

  if (auditIds.length === 0) {
    return;
  }

  await db
    .admin()
    .from("audits")
    .update({ user_id: userId })
    .in("id", auditIds)
    .is("user_id", null);
}
