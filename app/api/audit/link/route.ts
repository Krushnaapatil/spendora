/**
 * POST /api/audit/link
 *
 * Link an anonymous audit to the currently authenticated user.
 */

export const runtime = "nodejs";

import { createClient } from "@/lib/supabase-server";
import {
  errorResponse,
  jsonResponse,
} from "@/lib/http";
import {
  auditLinkRequestSchema,
  safeParseBody,
} from "@/lib/schemas";
import type { Database } from "@/lib/database.types";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "@/lib/env";
import telemetry from "@/lib/telemetry";

export async function POST(
  req: Request
): Promise<Response> {
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
    auditLinkRequestSchema,
    body
  );

  if (!parsed.success) {
    return errorResponse(
      "Invalid request",
      400,
      parsed.error.issues
    );
  }

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
    : await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    telemetry.captureException(authError, { route: "/api/audit/link", stage: "auth" });

    return errorResponse(
      authError.message || "Failed to verify authentication.",
      401,
      { code: "auth_failed" }
    );
  }

  if (!user) {
    telemetry.captureEvent("audit_link_auth_required", { route: "/api/audit/link" });

    return errorResponse(
      "Authentication required",
      401,
      { code: "auth_required" }
    );
  }

  const { data, error } = await supabase
    .from("audits")
    .update({ user_id: user.id })
    .eq("id", parsed.data.auditId)
    .is("user_id", null)
    .select("id")
    .maybeSingle();

  if (error) {
    telemetry.captureException(error, { route: "/api/audit/link", stage: "update" });

    return errorResponse(
      error.message || "Failed to link audit",
      500,
      { code: "db_error" }
    );
  }

  if (!data) {
    // Distinguish between not found vs already linked
    const {
      data: existing,
      error: existingError,
    } = await supabase
      .from("audits")
      .select("id,user_id")
      .eq("id", parsed.data.auditId)
      .maybeSingle();

    if (existingError) {
      telemetry.captureException(existingError, { route: "/api/audit/link", stage: "verify" });

      return errorResponse(
        existingError.message || "Failed to verify audit state",
        500,
        { code: "db_error" }
      );
    }

    if (!existing) {
      telemetry.captureEvent("audit_link_not_found", { auditId: parsed.data.auditId });

      return errorResponse(
        "Audit not found",
        404,
        { code: "not_found" }
      );
    }

    if (existing.user_id) {
      telemetry.captureEvent("audit_already_linked", { auditId: parsed.data.auditId, existingUserId: existing.user_id });

      return errorResponse(
        "Audit already linked",
        409,
        { code: "already_linked" }
      );
    }

    telemetry.captureEvent("audit_link_unknown_failure", { auditId: parsed.data.auditId });

    return errorResponse(
      "Failed to link audit",
      500,
      { code: "unknown" }
    );
  }

  return jsonResponse(
    {
      success: true,
      auditId: data.id,
    },
    {
      status: 200,
    }
  );
}

export function GET(): Response {
  return errorResponse(
    "Method not allowed",
    405
  );
}
