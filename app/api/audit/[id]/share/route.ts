/**
 * POST /api/audit/[id]/share
 *
 * Sends a shareable audit email to a teammate.
 */

export const runtime = "nodejs";

import { sendAuditShareEmail } from "@/lib/email";

import {
  errorResponse,
  jsonResponse,
} from "@/lib/http";

import { auditShareEmailRequestSchema, safeParseBody } from "@/lib/schemas";

import { env } from "@/lib/env";

import { db } from "@/lib/supabase";

import type { Database } from "@/lib/database.types";

import type {
  AuditShareEmailResponse,
  ToolAuditResult,
} from "@/lib/types";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

type AuditRow =
  Database["public"]["Tables"]["audits"]["Row"];

async function getAudit(
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

export async function POST(
  req: Request,
  props: RouteParams
): Promise<Response> {
  const params = await props.params;

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return errorResponse(
      "Invalid JSON in request body",
      400
    );
  }

  const parsed = safeParseBody(
    auditShareEmailRequestSchema,
    body
  );

  if (!parsed.success) {
    return errorResponse(
      "Invalid request",
      400,
      parsed.error.issues
    );
  }

  const audit = await getAudit(
    params.id
  );

  if (!audit) {
    return errorResponse(
      "Audit not found",
      404
    );
  }

  const results = Array.isArray(
    audit.results
  )
    ? (audit.results as unknown as ToolAuditResult[])
    : [];

  const shareUrl = new URL(
    `/audit/${audit.id}`,
    env.NEXT_PUBLIC_APP_URL
  ).toString();

  const emailSent =
    await sendAuditShareEmail({
      email: parsed.data.email,
      auditUrl: shareUrl,
      monthlySavings:
        audit.total_monthly_savings ?? 0,
      annualSavings:
        audit.total_annual_savings ?? 0,
      toolCount: results.length,
      summary:
        audit.summary ??
        audit.ai_summary ??
        null,
    });

  if (!emailSent) {
    return errorResponse(
      "Failed to send share email",
      502
    );
  }

  const response = {
    success: true,
    emailSent,
    shareUrl,
  } satisfies AuditShareEmailResponse;

  return jsonResponse(response, {
    status: 200,
  });
}

export function GET(): Response {
  return errorResponse(
    "Method not allowed",
    405
  );
}
