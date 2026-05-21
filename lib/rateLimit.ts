/**
 * lib/rateLimit.ts — In-memory IP-based rate limiting
 *
 * v1 strategy:
 * - In-memory Map
 * - Zero external dependencies
 * - Single-instance only
 *
 * Good enough for:
 * - MVP
 * - evaluation environment
 * - low traffic deployments
 *
 * NOT suitable for:
 * - multi-instance scaling
 * - distributed systems
 *
 * Future upgrade path:
 * - Upstash Redis
 * - Redis sliding windows
 * - edge-compatible global rate limiting
 */

declare global {
  // Prevent duplicate cleanup intervals during Next.js HMR
  // eslint-disable-next-line no-var
  var __spendoraRateLimitCleanup:
    | NodeJS.Timeout
    | undefined;
}

// ─── Types ──────────────────────────────────────────────────────────────────

interface RateLimitRecord {
  count: number;

  /**
   * Epoch ms when current window began
   */
  windowStart: number;
}

export interface RateLimitResult {
  allowed: boolean;

  /**
   * Remaining requests in current window
   */
  remaining: number;

  /**
   * Epoch ms when current window resets
   */
  resetAt: number;

  /**
   * Seconds until retry allowed
   */
  retryAfter: number;
}

// ─── Store ──────────────────────────────────────────────────────────────────

/**
 * Process-local in-memory store.
 *
 * Key format:
 *   "${route}:${ip}"
 *
 * Examples:
 *   audit:1.2.3.4
 *   leads:5.6.7.8
 */
const store = new Map<
  string,
  RateLimitRecord
>();

// ─── Constants ──────────────────────────────────────────────────────────────

const HOUR_MS =
  60 * 60 * 1000;

const CLEANUP_INTERVAL_MS =
  30 * 60 * 1000;

const STALE_WINDOW_MS =
  2 * HOUR_MS;

// ─── Cleanup Interval ──────────────────────────────────────────────────────

/**
 * Prevent unbounded memory growth.
 *
 * Important:
 * Next.js HMR can re-import modules repeatedly in dev mode.
 * We guard against duplicate intervals globally.
 */
if (
  typeof globalThis !==
    "undefined" &&
  !globalThis.__spendoraRateLimitCleanup
) {
  globalThis.__spendoraRateLimitCleanup =
    setInterval(() => {
      const now = Date.now();

      for (const [
        key,
        record,
      ] of store.entries()) {
        if (
          now -
            record.windowStart >
          STALE_WINDOW_MS
        ) {
          store.delete(key);
        }
      }
    }, CLEANUP_INTERVAL_MS);
}

/**
 * @internal
 * Stops cleanup timer for Jest shutdown.
 */
export function _stopRateLimitCleanup(): void {
  if (
    globalThis.__spendoraRateLimitCleanup
  ) {
    clearInterval(
      globalThis.__spendoraRateLimitCleanup
    );

    globalThis.__spendoraRateLimitCleanup =
      undefined;
  }
}

// ─── Core Rate Limiter ─────────────────────────────────────────────────────

/**
 * Check and increment rate limit.
 *
 * @example
 * checkRateLimit(
 *   "audit:1.2.3.4",
 *   10,
 *   HOUR_MS
 * )
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number = HOUR_MS
): RateLimitResult {
  if (limit <= 0) {
    throw new Error(
      "[rateLimit] limit must be greater than 0"
    );
  }

  if (windowMs <= 0) {
    throw new Error(
      "[rateLimit] windowMs must be greater than 0"
    );
  }

  const key = identifier
    .trim()
    .toLowerCase();

  const now = Date.now();

  const existing =
    store.get(key);

  // ── New window ────────────────────────────────────────────────────────

  if (
    !existing ||
    now - existing.windowStart >=
      windowMs
  ) {
    store.set(key, {
      count: 1,
      windowStart: now,
    });

    return {
      allowed: true,

      remaining: limit - 1,

      resetAt:
        now + windowMs,

      retryAfter: 0,
    };
  }

  // ── Existing window ──────────────────────────────────────────────────

  const nextCount =
    existing.count + 1;

  const resetAt =
    existing.windowStart +
    windowMs;

  // ── Block request ────────────────────────────────────────────────────

  if (nextCount > limit) {
    return {
      allowed: false,

      remaining: 0,

      resetAt,

      retryAfter:
        Math.ceil(
          (resetAt - now) /
            1000
        ),
    };
  }

  // ── Allow request ────────────────────────────────────────────────────

  store.set(key, {
    ...existing,
    count: nextCount,
  });

  return {
    allowed: true,

    remaining:
      limit - nextCount,

    resetAt,

    retryAfter: 0,
  };
}

// ─── Route Helpers ─────────────────────────────────────────────────────────

/**
 * /api/audit
 * 10 requests/IP/hour
 */
export function auditRateLimit(
  ip: string
): RateLimitResult {
  return checkRateLimit(
    `audit:${ip}`,
    10,
    HOUR_MS
  );
}

/**
 * /api/leads
 * 3 requests/IP/hour
 */
export function leadsRateLimit(
  ip: string
): RateLimitResult {
  return checkRateLimit(
    `leads:${ip}`,
    3,
    HOUR_MS
  );
}

// ─── IP Extraction ─────────────────────────────────────────────────────────

/**
 * Extract client IP from common hosting providers.
 *
 * Checks:
 * - Vercel
 * - Cloudflare
 * - proxies
 *
 * Falls back to anonymous user-agent fingerprint.
 */
export function getClientIp(
  request: Request
): string {
  const realIp =
    request.headers.get(
      "x-real-ip"
    );

  if (realIp) {
    return realIp.trim();
  }

  const forwardedFor =
    request.headers.get(
      "x-forwarded-for"
    );

  if (forwardedFor) {
    return forwardedFor
      .split(",")[0]
      ?.trim();
  }

  const cloudflareIp =
    request.headers.get(
      "cf-connecting-ip"
    );

  if (cloudflareIp) {
    return cloudflareIp.trim();
  }

  const userAgent =
    request.headers.get(
      "user-agent"
    ) ?? "unknown";

  return `anonymous:${userAgent}`;
}

// ─── Headers Helper ────────────────────────────────────────────────────────

/**
 * Standard rate limit headers.
 *
 * Useful for successful requests too.
 */
export function rateLimitHeaders(
  result: RateLimitResult
): HeadersInit {
  return {
    "X-RateLimit-Remaining":
      String(
        result.remaining
      ),

    "X-RateLimit-Reset":
      String(
        Math.ceil(
          result.resetAt / 1000
        )
      ),
  };
}

// ─── 429 Response Helper ───────────────────────────────────────────────────

/**
 * Standardized 429 response.
 */
export function rateLimitResponse(
  result: RateLimitResult
): Response {
  return new Response(
    JSON.stringify({
      error:
        "Too many requests",

      retryAfter:
        result.retryAfter,
    }),
    {
      status: 429,

      headers: {
        "Content-Type":
          "application/json",

        "Retry-After":
          String(
            result.retryAfter
          ),

        ...rateLimitHeaders(
          result
        ),
      },
    }
  );
}

// ─── Test Helpers ──────────────────────────────────────────────────────────

/**
 * @internal
 * Clears store between Jest tests.
 */
export function _clearRateLimitStore(): void {
  store.clear();
}