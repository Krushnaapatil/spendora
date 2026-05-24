import { notFound, redirect } from "next/navigation";

import AuditFormView from "@/components/form/AuditFormView";
import { auditInputsToFormState } from "@/lib/auditFormState";
import { getAuditById } from "@/lib/auditData";
import { createClient } from "@/lib/supabase-server";
import type { ToolInput, UseCase } from "@/lib/types";

const VALID_USE_CASES: UseCase[] = [
  "coding",
  "writing",
  "data",
  "research",
  "mixed",
];

function parseUseCase(value: string | null): UseCase {
  if (value && VALID_USE_CASES.includes(value as UseCase)) {
    return value as UseCase;
  }

  return "mixed";
}

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditAuditPage(props: EditPageProps) {
  const params = await props.params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(
      `/login?mode=login&next=${encodeURIComponent(`/audit/${params.id}/edit`)}`
    );
  }

  const audit = await getAuditById(params.id);

  if (!audit) {
    notFound();
  }

  if (audit.user_id && audit.user_id !== user.id) {
    notFound();
  }

  const tools = Array.isArray(audit.tools)
    ? (audit.tools as unknown as ToolInput[])
    : [];
  const teamSize = audit.team_size ?? 1;
  const useCase = parseUseCase(audit.use_case);
  const initialValues = auditInputsToFormState(tools, teamSize, useCase);

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-5xl px-6 py-12 pt-24">
        <div className="mb-10 max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight text-zinc-950">
            Edit Audit
          </h1>
          <p className="mt-4 text-lg text-zinc-600">
            Update your team size, use case, or tool spend. Submitting creates a
            new audit saved to your account.
          </p>
        </div>

        <AuditFormView
          initialValues={initialValues}
          persistToLocalStorage={false}
          submitLabel="Rerun Audit"
          progressHint=""
        />
      </div>
    </main>
  );
}
