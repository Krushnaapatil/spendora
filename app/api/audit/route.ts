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
 * → persist (deterministic summary first)
 * → respond
 * → enrich AI summary in background
 */

export const runtime = "nodejs";

import { after } from "next/server";

import { runAudit } from "@/lib/auditEngine";
import { fallbackSummary } from "@/lib/ai";
import { enrichAuditWithAiSummary } from "@/lib/auditEnrichment";
import { createClient as createServerClient } from "@/lib/supabase-server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";

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

export async function POST(
  req: Request
): Promise<Response> {
  const startedAt = Date.now();

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

  const ip = getClientIp(req);

  const rateLimit =
    auditRateLimit(ip);

  if (!rateLimit.allowed) {
    return rateLimitResponse(
      rateLimit
    );
  }

  const result =
    runAudit(input);

  const immediateSummary =
    fallbackSummary(result);

  const authHeader = req.headers.get(
    "authorization"
  );

  const supabase = authHeader
    ? createSupabaseClient<Database>(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
          global: {
            headers: {
              Authorization: authHeader,
            },
          },
        }
      )
    : await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
      immediateSummary,

    ai_summary:
      immediateSummary,

    summary_source:
      "deterministic",

    team_size:
      input.teamSize,

    use_case:
      input.useCase,

    user_id:
      user?.id ?? null,
  };

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

  after(async () => {
    try {
      await enrichAuditWithAiSummary(
        row.id,
        result
      );
    } catch (error) {
      console.error(
        "[audit] background summary enrichment failed",
        {
          auditId: row.id,
          error,
        }
      );
    }
  });

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
        immediateSummary,

      summarySource:
        "deterministic" as const,

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
