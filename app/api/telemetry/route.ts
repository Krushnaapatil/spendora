export const runtime = "nodejs";

import { jsonResponse, errorResponse } from "@/lib/http";
import telemetry from "@/lib/telemetry";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { event, details } = body ?? {};

    if (!event) {
      return errorResponse("Missing event", 400);
    }

    telemetry.captureEvent(event, details ?? {});

    return jsonResponse({ success: true });
  } catch (err) {
    telemetry.captureException(err, { route: "/api/telemetry" });
    return errorResponse("Failed to record telemetry", 500);
  }
}

export function GET() {
  return errorResponse("Method not allowed", 405);
}
