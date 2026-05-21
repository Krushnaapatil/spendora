/**
 * AI summary layer tests
 *
 * Covers:
 * - prompt generation
 * - deterministic fallback
 * - sanitization
 * - AI orchestration safety
 */

import {
  buildAuditPrompt,
  fallbackSummary,
  sanitizeSummary,
} from "../lib/ai";

import type {
  AuditResult,
} from "../lib/types";

// ─── Shared Fixture ───────────────────────────────────────────────────────

const mockAuditResult:
  Readonly<AuditResult> = {
    tools: [
      {
        toolId: "cursor",

        currentSpend: 80,

        recommendation: {
          action:
            "downgrade",

          targetPlan:
            "pro",

          monthlySavings:
            40,

          reason:
            "Business plan is unnecessary for this small team.",
        },
      },

      {
        toolId:
          "github-copilot",

        currentSpend: 19,

        recommendation: {
          action:
            "optimal",

          monthlySavings:
            0,

          reason:
            "Current configuration is already efficient.",
        },
      },
    ],

    totalMonthlySavings:
      40,

    totalAnnualSavings:
      480,
  };

// ─── Prompt Tests ─────────────────────────────────────────────────────────

test(
  "buildAuditPrompt includes savings values",
  () => {
    const prompt =
      buildAuditPrompt(
        mockAuditResult
      );

    expect(prompt)
      .toContain("$40");

    expect(prompt)
      .toContain("$480");
  }
);

test(
  "buildAuditPrompt includes recommendation reasons",
  () => {
    const prompt =
      buildAuditPrompt(
        mockAuditResult
      );

    expect(prompt)
      .toContain(
        "Business plan is unnecessary"
      );

    expect(prompt)
      .toContain(
        "already efficient"
      );
  }
);

// ─── Fallback Tests ───────────────────────────────────────────────────────

test(
  "fallbackSummary includes savings",
  () => {
    const summary =
      fallbackSummary(
        mockAuditResult
      );

    expect(summary)
      .toContain("$40");

    expect(summary)
      .toContain("$480");
  }
);

test(
  "fallbackSummary includes optimization count",
  () => {
    const summary =
      fallbackSummary(
        mockAuditResult
      );

    expect(summary)
      .toContain(
        "1 optimization opportunities"
      );
  }
);

test(
  "fallbackSummary is deterministic",
  () => {
    const s1 =
      fallbackSummary(
        mockAuditResult
      );

    const s2 =
      fallbackSummary(
        mockAuditResult
      );

    expect(s1)
      .toEqual(s2);
  }
);

// ─── Sanitizer Tests ──────────────────────────────────────────────────────

test(
  "sanitizeSummary trims whitespace",
  () => {
    const summary =
      sanitizeSummary(
        "   hello    world   "
      );

    expect(summary)
      .toBe(
        "hello world"
      );
  }
);

test(
  "sanitizeSummary collapses newlines",
  () => {
    const summary =
      sanitizeSummary(
        "hello\n\nworld"
      );

    expect(summary)
      .toBe(
        "hello world"
      );
  }
);

test(
  "sanitizeSummary limits output length",
  () => {
    const long =
      "a".repeat(1000);

    const summary =
      sanitizeSummary(
        long
      );

    expect(
      summary.length
    ).toBeLessThanOrEqual(
      700
    );
  }
);