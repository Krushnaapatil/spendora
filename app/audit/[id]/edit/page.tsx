import { notFound } from "next/navigation";
import type { Database } from "@/lib/database.types";
import { db } from "@/lib/supabase";
import EditAuditForm from "@/components/audit/EditAuditForm";

type AuditDbRow = Database["public"]["Tables"]["audits"]["Row"];

interface EditPageProps {
  params: Promise<{ id: string }>; 
}

async function getAudit(id: string): Promise<AuditDbRow | null> {
  const response = await db.admin().from('audits').select('*').eq('id', id).single();
  const typed = response as unknown as { data: AuditDbRow | null; error: Error | null };
  if (typed.error || !typed.data) return null;
  return typed.data;
}

export default async function EditAuditPage(props: EditPageProps) {
  const params = await props.params;
  const audit = await getAudit(params.id);

  if (!audit) notFound();

  const tools = Array.isArray(audit.tools) ? audit.tools : [];
  const teamSize = audit.team_size ?? 1;

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-3xl px-6 py-12 pt-24">
        <div className="rounded-2xl border border-zinc-200 bg-white p-8">
          <h1 className="text-2xl font-semibold">Edit Audit</h1>

          <p className="mt-3 text-sm text-zinc-600">Modify team size or tool spend to rerun the audit. Submitting will create a new audit result saved to your account.</p>

          {/* @ts-ignore */}
          <EditAuditForm initialTools={tools} initialTeamSize={teamSize} />
        </div>
      </div>
    </main>
  );
}
