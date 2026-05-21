/**
 * POST /api/audit
 *
 * Thin orchestration route.
 * No business logic belongs here.
 *
 * Flow:
 * parse
 * → validate
 * → rate limit
 * → run audit
 * → persist
 * → respond
 */

export const runtime = "nodejs";

import { runAudit } from "@/lib/auditEngine";

import {
  auditRateLimit,
  getClientIp,
  rateLimitHeaders,
  rateLimitResponse,
} from "@/lib/rateLimit";

import {
  auditRequestSchema,
  safeParseBody,
} from "@/lib/schemas";

import { db } from "@/lib/supabase";

import {
  errorResponse,
  jsonResponse,
} from "@/lib/http";

import type {
  AuditApiResponse,
  AuditRow,
} from "@/lib/types";

// ─── POST /api/audit ─────────────────────────────────────────────────────

export async function POST(
  req: Request
): Promise<Response> {
  const startedAt = Date.now();

  // ── Step 1: Parse ──────────────────────────────────────────────────

  let body: unknown;

  try {
    body = await req.json();
  } catch {
    return errorResponse(
      "Invalid JSON in request body",
      400
    );
  }

  // ── Step 2: Validate ───────────────────────────────────────────────

  const parsed = safeParseBody(
    auditRequestSchema,
    body
  );

  if (!parsed.success) {
    return errorResponse(
      "Invalid request",
      400,
      parsed.error.issues
    );
  }

  const input = parsed.data;

  // ── Step 3: Rate Limit ──────────────────────────────────────────────

  const ip = getClientIp(req);

  const rateLimit =
    auditRateLimit(ip);

  if (!rateLimit.allowed) {
    return rateLimitResponse(
      rateLimit
    );
  }

  // ── Step 4: Run Audit ───────────────────────────────────────────────
  // Pure synchronous business logic

  const result =
    runAudit(input);

  // ── Step 5: Build DB Payload ────────────────────────────────────────

  const auditInsert: Omit<
    AuditRow,
    "id" | "created_at"
  > = {
    tools_data:
      input.tools,

    results:
      result.tools,

    total_monthly_savings:
      result.totalMonthlySavings,

    total_annual_savings:
      result.totalAnnualSavings,

    use_case:
      input.useCase,

    team_size:
      input.teamSize,
  };

  // ── Step 6: Persist ─────────────────────────────────────────────────

  const {
    data: row,
    error: dbError,
  }: {
    data: { id: string } | null;
    error: Error | null;
  } = await db
    .admin()
    .from("audits")
    .insert([auditInsert])
    .select("id")
    .single();

  if (dbError || !row) {
    console.error(
      "[audit] failed to persist audit",
      {
        error: dbError,

        teamSize:
          input.teamSize,

        toolCount:
          input.tools.length,

        durationMs:
          Date.now() - startedAt,
      }
    );

    return errorResponse(
      "Failed to save audit. Please try again.",
      500
    );
  }

  // ── Step 7: Respond ────────────────────────────────────────────────

  console.info(
    "[audit] audit created",
    {
      auditId: row.id,

      teamSize:
        input.teamSize,

      toolCount:
        input.tools.length,

      totalSavings:
        result.totalMonthlySavings,

      durationMs:
        Date.now() - startedAt,
    }
  );

  const response = {
    auditId: row.id,

    result: {
      ...result,
      id: row.id,
    },
  } satisfies AuditApiResponse;

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