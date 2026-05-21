/**
 * lib/http.ts — Shared HTTP response helpers
 *
 * Keeps API routes thin and consistent.
 * No business logic here.
 */

/**
 * Standard JSON response helper.
 */
export function jsonResponse(
  data: unknown,
  init: ResponseInit = {}
): Response {
  return Response.json(data, {
    ...init,

    headers: {
      "Content-Type":
        "application/json",

      "Cache-Control":
        "no-store",

      ...(init.headers ?? {}),
    },
  });
}

/**
 * Standard error response shape.
 */
export function errorResponse(
  error: string,
  status = 400,
  details?: unknown
): Response {
  return jsonResponse(
    {
      error,

      ...(details
        ? { details }
        : {}),
    },
    {
      status,
    }
  );
}
