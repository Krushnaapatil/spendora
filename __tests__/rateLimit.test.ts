/**
 * Infrastructure tests for in-memory rate limiting
 *
 * Run:
 *   npm test
 */

import {
    _clearRateLimitStore,
    _stopRateLimitCleanup,  auditRateLimit,
    checkRateLimit,
    getClientIp,
    leadsRateLimit,
} from "../lib/rateLimit";

// ─── Test Isolation ────────────────────────────────────────────────────────

beforeEach(() => {
  _clearRateLimitStore();
    _stopRateLimitCleanup();
});

// ─── Core Limiter Tests ────────────────────────────────────────────────────

test("first request is always allowed", () => {
  const result = checkRateLimit(
    "test-ip",
    10,
    60_000
  );

  expect(result.allowed).toBe(
    true
  );

  expect(
    result.remaining
  ).toBe(9);
});

test("blocks after limit is exceeded", () => {
  for (let i = 0; i < 10; i++) {
    checkRateLimit(
      "ip-a",
      10,
      60_000
    );
  }

  const result =
    checkRateLimit(
      "ip-a",
      10,
      60_000
    );

  expect(result.allowed).toBe(
    false
  );

  expect(
    result.remaining
  ).toBe(0);

  expect(
    result.retryAfter
  ).toBeGreaterThan(0);
});

test("different IPs have independent limits", () => {
  for (let i = 0; i < 10; i++) {
    checkRateLimit(
      "ip-x",
      10,
      60_000
    );
  }

  expect(
    checkRateLimit(
      "ip-x",
      10,
      60_000
    ).allowed
  ).toBe(false);

  expect(
    checkRateLimit(
      "ip-y",
      10,
      60_000
    ).allowed
  ).toBe(true);
});

test("remaining count decrements correctly", () => {
  const r1 = checkRateLimit(
    "ip-count",
    5,
    60_000
  );

  expect(r1.remaining).toBe(4);

  const r2 = checkRateLimit(
    "ip-count",
    5,
    60_000
  );

  expect(r2.remaining).toBe(3);
});

test("does not double-count over-limit requests", () => {
  for (let i = 0; i < 5; i++) {
    checkRateLimit(
      "ip-b",
      5,
      60_000
    );
  }

  // Over-limit spam
  checkRateLimit(
    "ip-b",
    5,
    60_000
  );

  checkRateLimit(
    "ip-b",
    5,
    60_000
  );

  checkRateLimit(
    "ip-b",
    5,
    60_000
  );

  const result =
    checkRateLimit(
      "ip-b",
      5,
      60_000
    );

  expect(result.allowed).toBe(
    false
  );

  expect(
    result.remaining
  ).toBe(0);
});

// ─── Normalization ─────────────────────────────────────────────────────────

test("normalizes identifiers", () => {
  const a = checkRateLimit(
    " IP-TEST ",
    5,
    60_000
  );

  const b = checkRateLimit(
    "ip-test",
    5,
    60_000
  );

  expect(a.remaining).toBe(4);

  expect(b.remaining).toBe(3);
});

// ─── Validation ────────────────────────────────────────────────────────────

test("throws on invalid limit", () => {
  expect(() =>
    checkRateLimit(
      "x",
      0,
      60_000
    )
  ).toThrow();
});

test("throws on invalid window", () => {
  expect(() =>
    checkRateLimit(
      "x",
      5,
      0
    )
  ).toThrow();
});

// ─── Window Expiration ─────────────────────────────────────────────────────

test("window resets after expiration", async () => {
  checkRateLimit(
    "reset-ip",
    1,
    50
  );

  const blocked =
    checkRateLimit(
      "reset-ip",
      1,
      50
    );

  expect(
    blocked.allowed
  ).toBe(false);

  await new Promise((r) =>
    setTimeout(r, 60)
  );

  const reset =
    checkRateLimit(
      "reset-ip",
      1,
      50
    );

  expect(
    reset.allowed
  ).toBe(true);
});

// ─── Route Helpers ─────────────────────────────────────────────────────────

test("audit route allows 10 and blocks on 11th", () => {
  for (let i = 0; i < 10; i++) {
    expect(
      auditRateLimit(
        "1.2.3.4"
      ).allowed
    ).toBe(true);
  }

  expect(
    auditRateLimit(
      "1.2.3.4"
    ).allowed
  ).toBe(false);
});

test("leads route allows 3 and blocks on 4th", () => {
  for (let i = 0; i < 3; i++) {
    expect(
      leadsRateLimit(
        "5.6.7.8"
      ).allowed
    ).toBe(true);
  }

  expect(
    leadsRateLimit(
      "5.6.7.8"
    ).allowed
  ).toBe(false);
});

// ─── Client IP Extraction ─────────────────────────────────────────────────

test("extracts x-real-ip first", () => {
  const request = new Request(
    "http://localhost",
    {
      headers: {
        "x-real-ip":
          "1.2.3.4",
      },
    }
  );

  expect(
    getClientIp(request)
  ).toBe("1.2.3.4");
});

test("extracts first forwarded IP", () => {
  const request = new Request(
    "http://localhost",
    {
      headers: {
        "x-forwarded-for":
          "1.2.3.4, 5.6.7.8",
      },
    }
  );

  expect(
    getClientIp(request)
  ).toBe("1.2.3.4");
});

test("extracts cloudflare IP", () => {
  const request = new Request(
    "http://localhost",
    {
      headers: {
        "cf-connecting-ip":
          "9.9.9.9",
      },
    }
  );

  expect(
    getClientIp(request)
  ).toBe("9.9.9.9");
});

test("falls back to anonymous fingerprint", () => {
  const request = new Request(
    "http://localhost",
    {
      headers: {
        "user-agent":
          "jest-test",
      },
    }
  );

  expect(
    getClientIp(request)
  ).toContain(
    "anonymous:"
  );
});