export const runtime = "nodejs";

import { jsonResponse, errorResponse } from "@/lib/http";
import {
  getClientIp,
  rateLimitHeaders,
  rateLimitResponse,
  telemetryRateLimit,
} from "@/lib/rateLimit";
import { telemetry } from "@/lib/telemetry";

const MAX_EVENT_LENGTH = 128;

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const rateLimit = telemetryRateLimit(ip);

  if (!rateLimit.allowed) {
    return rateLimitResponse(rateLimit);
  }

  try {
    const body = await req.json();
    const { event, details } = body ?? {};

    if (!event || typeof event !== "string") {
      return errorResponse("Missing event", 400);
    }

    if (event.length > MAX_EVENT_LENGTH) {
      return errorResponse("Event name too long", 400);
    }

    const safeDetails =
      details &&
      typeof details === "object" &&
      !Array.isArray(details)
        ? (details as Record<string, unknown>)
        : {};

    telemetry.captureEvent(event, safeDetails);

    return jsonResponse(
      { success: true },
      {
        headers: {
          ...rateLimitHeaders(rateLimit),
        },
      }
    );
  } catch (err) {
    telemetry.captureException(err, { route: "/api/telemetry" });
    return errorResponse("Failed to record telemetry", 500);
  }
}

export function GET() {
  return errorResponse("Method not allowed", 405);
}
