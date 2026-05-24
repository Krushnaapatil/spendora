/**
 * GET /api/audit/[id]/summary
 *
 * Lightweight poll endpoint for async AI summary enrichment.
 */

export const runtime = "nodejs";

import { getAuditById } from "@/lib/auditData";
import { errorResponse, jsonResponse } from "@/lib/http";
import {
  getClientIp,
  rateLimitHeaders,
  rateLimitResponse,
  summaryRateLimit,
} from "@/lib/rateLimit";

import type { SummarySource } from "@/lib/types";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: Request,
  props: RouteParams
): Promise<Response> {
  const params = await props.params;
  const ip = getClientIp(req);
  const rateLimit = summaryRateLimit(ip);

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit);
  }

  const audit = await getAuditById(params.id);

  if (!audit) {
    return errorResponse("Audit not found", 404);
  }

  return jsonResponse(
    {
      summary: audit.summary ?? audit.ai_summary ?? null,
      source: (audit.summary_source ?? "deterministic") as SummarySource,
    },
    {
      headers: {
        ...rateLimitHeaders(rateLimit),
      },
    }
  );
}
