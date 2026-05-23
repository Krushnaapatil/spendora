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
import { generateAuditSummary } from "@/lib/ai";
import { createClient } from "@/lib/supabase-server";

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
  Database,
  Json,
} from "@/lib/database.types";

import type {
  AuditApiResponse,
} from "@/lib/types";

function asPlainJson(value: unknown): Json {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as Json;
    } catch {
      return value as Json;
    }
  }

  return JSON.parse(
    JSON.stringify(value)
  ) as Json;
}

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

  const summaryResult =
    await generateAuditSummary(
      result
    );

    const supabase =
  await createClient();

const {
  data: { user },
} =
  await supabase.auth.getUser();

  // ── Step 5: Build DB Payload ────────────────────────────────────────

  const auditInsert: Omit<
    Database["public"]["Tables"]["audits"]["Insert"],
    "id" | "created_at"
  > = {
    tools:
      asPlainJson(
        input.tools
      ),

    results:
      asPlainJson(
        result.tools
      ),

    total_monthly_savings:
      result.totalMonthlySavings,

    total_annual_savings:
      result.totalAnnualSavings,

    total_savings:
      result.totalAnnualSavings,

    summary:
      summaryResult.summary,

    ai_summary:
      summaryResult.summary,

    summary_source:
      summaryResult.source,

    team_size:
      input.teamSize,

    use_case:
      input.useCase,

    user_id:
      user?.id ?? null,
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
    .insert([auditInsert] as never[])
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
      aiSummary:
        summaryResult.summary,

      summarySource:
        summaryResult.source,

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
