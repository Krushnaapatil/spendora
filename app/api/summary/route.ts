/**
 * POST /api/summary
 *
 * AI summary orchestration route.
 *
 * Flow:
 * parse
 * → validate
 * → generate AI summary
 * → graceful fallback
 * → respond
 *
 * No AI provider logic belongs here.
 */

export const runtime =
  "nodejs";

import {
  generateAuditSummary,
} from "@/lib/ai";

import {
  errorResponse,
  jsonResponse,
} from "@/lib/http";

import {
  safeParseBody,
  summaryRequestSchema,
} from "@/lib/schemas";

import type {
  SummaryApiResponse,
} from "@/lib/types";

// ─── POST /api/summary ────────────────────────────────────────────────────

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
      summaryRequestSchema,
      body
    );

  if (!parsed.success) {
    return errorResponse(
      "Invalid request",
      400,
      parsed.error.issues
    );
  }

  const {
    auditId,
    result,
  } = parsed.data;

  // ── Step 3: Generate Summary ───────────────────────────────────

  const summaryResult =
    await generateAuditSummary(
      result
    );

  // ── Step 4: Observability Logging ──────────────────────────────

  console.info(
    "[summary] summary generated",
    {
      auditId,

      source:
        summaryResult.source,

      durationMs:
        Date.now() -
        startedAt,

      toolCount:
        result.tools.length,

      savings:
        result.totalMonthlySavings,
    }
  );

  // ── Step 5: Respond ────────────────────────────────────────────

  const response = {
    summary:
      summaryResult.summary,

    source:
      summaryResult.source,
  } satisfies SummaryApiResponse;

  return jsonResponse(
    response,
    {
      status: 200,
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