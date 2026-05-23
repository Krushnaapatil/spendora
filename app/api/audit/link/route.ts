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
    return errorResponse(
      authError.message ||
        "Failed to verify authentication.",
      500
    );
  }

  if (!user) {
    return errorResponse(
      "Authentication required",
      401
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
    return errorResponse(
      error.message ||
        "Failed to link audit",
      400
    );
  }

  if (!data) {
    return errorResponse(
      "Audit not found or already linked",
      404
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
