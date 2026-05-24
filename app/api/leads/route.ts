/**
 * POST /api/leads
 *
 * Lead capture orchestration route.
 *
 * Flow:
 * parse
 * → validate
 * → honeypot protection
 * → rate limit
 * → persist lead
 * → send transactional email
 * → respond
 *
 * IMPORTANT:
 * Email failures must NEVER fail lead capture.
 */

export const runtime =
  "nodejs";

import {
  sendLeadConfirmationEmail,
} from "@/lib/email";

import {
  errorResponse,
  jsonResponse,
} from "@/lib/http";

import { env } from "@/lib/env";

import {
  SPENDORA_CTA_THRESHOLD,
} from "@/lib/pricing";

import {
  leadsRateLimit,
  getClientIp,
  rateLimitHeaders,
  rateLimitResponse,
} from "@/lib/rateLimit";

import {
  leadRequestSchema,
  safeParseBody,
} from "@/lib/schemas";

import { db } from "@/lib/supabase";

import type { Database } from "@/lib/database.types";

import type {
  LeadApiResponse,
} from "@/lib/types";

// ─── POST /api/leads ──────────────────────────────────────────────────────

export async function POST(
  req: Request
): Promise<Response> {
  const startedAt =
    Date.now();

  // ── Step 1: Parse ───────────────────────────────────────────────

  let body: unknown;

  try {
    body =
      await req.json();
  } catch {
    return errorResponse(
      "Invalid JSON in request body",
      400
    );
  }

  // ── Step 2: Validate ────────────────────────────────────────────

  const parsed =
    safeParseBody(
      leadRequestSchema,
      body
    );

  if (!parsed.success) {
    return errorResponse(
      "Invalid request",
      400,
      parsed.error.issues
    );
  }

  const input =
    parsed.data;

  // ── Step 3: Honeypot Protection ─────────────────────────────────

  if (
    input.honeypot !==
    ""
  ) {
    console.warn(
      "[leads] honeypot triggered",
      {
        email:
          input.email,
      }
    );

    return errorResponse(
      "Bot detected",
      400
    );
  }

  // ── Step 4: Rate Limit ──────────────────────────────────────────

  const ip =
    getClientIp(req);

  const rateLimit =
    leadsRateLimit(ip);

  if (
    !rateLimit.allowed
  ) {
    console.warn(
      "[leads] rate limit exceeded",
      {
        ip,
      }
    );

    return rateLimitResponse(
      rateLimit
    );
  }

  // ── Step 5: Persist Lead ────────────────────────────────────────

  const leadInsert: Omit<
    Database["public"]["Tables"]["leads"]["Insert"],
    "id" | "created_at"
  > = {
    audit_id:
      input.auditId,

    email:
      input.email,

    company:
      input.company,

    role:
      input.role,

    team_size:
      input.teamSize,

    source:
      input.source,
  };

  const { error: dbError } = await db
    .admin()
    .from("leads")
    .insert([leadInsert] as never[]);

  if (dbError) {
    console.error(
      "[leads] failed to persist lead",
      {
        error:
          dbError.message,

        email:
          input.email,

        auditId:
          input.auditId,
      }
    );

    return errorResponse(
      "Failed to save lead",
      500
    );
  }

  // ── Step 6: Send Email ──────────────────────────────────────────

  const { data: audit } = await db
    .admin()
    .from("audits")
    .select(
      "id,total_monthly_savings,total_annual_savings,summary,ai_summary"
    )
    .eq("id", input.auditId)
    .maybeSingle();

  const emailSent =
    await sendLeadConfirmationEmail(
      input.email,
      audit
        ? {
            auditUrl: new URL(
              `/audit/${audit.id}`,
              env.NEXT_PUBLIC_APP_URL
            ).toString(),
            monthlySavings:
              audit.total_monthly_savings ??
              0,
            annualSavings:
              audit.total_annual_savings ??
              0,
            highSavings:
              (audit.total_monthly_savings ??
                0) >=
              SPENDORA_CTA_THRESHOLD,
            summary:
              audit.summary ??
              audit.ai_summary ??
              null,
          }
        : undefined
    );

  if (!emailSent) {
    console.error(
      "[leads] confirmation email failed",
      {
        email:
          input.email,
      }
    );
  }

  // ── Step 7: Observability ───────────────────────────────────────

  console.info(
    "[leads] lead captured",
    {
      email:
        input.email,

      auditId:
        input.auditId,

      source:
        input.source,

      emailSent,

      durationMs:
        Date.now() -
        startedAt,
    }
  );

  // ── Step 8: Respond ─────────────────────────────────────────────

  const response = {
    success: true,

    emailSent,
  } satisfies LeadApiResponse;

  return jsonResponse(
    response,
    {
      status: 201,

      headers: {
        ...rateLimitHeaders(
          rateLimit
        ),
      },
    }
  );
}

// ─── Unsupported Methods ──────────────────────────────────────────────────

export function GET(): Response {
  return errorResponse(
    "Method not allowed",
    405
  );
}
