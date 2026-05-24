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

import {
  getClientIp,
  rateLimitHeaders,
  rateLimitResponse,
  shareRateLimit,
} from "@/lib/rateLimit";

import { getAuditById } from "@/lib/auditData";

import type {
  AuditShareEmailResponse,
  ToolAuditResult,
} from "@/lib/types";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
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

  const ip = getClientIp(req);
  const rateLimit = shareRateLimit(ip);

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit);
  }

  const audit = await getAuditById(params.id);

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
    headers: {
      ...rateLimitHeaders(rateLimit),
    },
  });
}

export function GET(): Response {
  return errorResponse(
    "Method not allowed",
    405
  );
}
