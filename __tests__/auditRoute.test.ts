/**
 * Audit route integration tests
 *
 * We intentionally test the orchestration pipeline
 * without spinning up an HTTP server.
 *
 * The route layer itself remains intentionally thin.
 */

import { runAudit } from "../lib/auditEngine";

import {
  auditRequestSchema,
  safeParseBody,
} from "../lib/schemas";

import type {
  AuditInput,
} from "../lib/types";

// ─── Shared Valid Fixture ────────────────────────────────────────────────

const validInput:
  Readonly<AuditInput> = {
    tools: [
      {
        toolId: "cursor",
        plan: "business",
        monthlySpend: 80,
        seats: 2,
      },

      {
        toolId:
          "github-copilot",

        plan: "business",

        monthlySpend: 19,

        seats: 1,
      },
    ],

    teamSize: 3,

    useCase: "coding",
  };

// ─── Schema Validation ───────────────────────────────────────────────────

test(
  "valid audit input passes schema validation",
  () => {
    const result =
      safeParseBody(
        auditRequestSchema,
        validInput
      );

    expect(
      result.success
    ).toBe(true);
  }
);

test(
  "empty tools array fails validation",
  () => {
    const result =
      safeParseBody(
        auditRequestSchema,
        {
          ...validInput,
          tools: [],
        }
      );

    expect(
      result.success
    ).toBe(false);
  }
);

test(
  "negative monthlySpend fails validation",
  () => {
    const result =
      safeParseBody(
        auditRequestSchema,
        {
          ...validInput,

          tools: [
            {
              toolId:
                "cursor",

              plan: "pro",

              monthlySpend:
                -10,

              seats: 1,
            },
          ],
        }
      );

    expect(
      result.success
    ).toBe(false);
  }
);

test(
  "zero seats fails validation",
  () => {
    const result =
      safeParseBody(
        auditRequestSchema,
        {
          ...validInput,

          tools: [
            {
              toolId:
                "cursor",

              plan: "pro",

              monthlySpend:
                20,

              seats: 0,
            },
          ],
        }
      );

    expect(
      result.success
    ).toBe(false);
  }
);

test(
  "invalid toolId fails validation",
  () => {
    const result =
      safeParseBody(
        auditRequestSchema,
        {
          ...validInput,

          tools: [
            {
              toolId:
                "photoshop" as never,

              plan: "pro",

              monthlySpend:
                20,

              seats: 1,
            },
          ],
        }
      );

    expect(
      result.success
    ).toBe(false);
  }
);

test(
  "invalid plan fails validation",
  () => {
    const result =
      safeParseBody(
        auditRequestSchema,
        {
          ...validInput,

          tools: [
            {
              toolId:
                "cursor",

              plan:
                "god-tier" as never,

              monthlySpend:
                20,

              seats: 1,
            },
          ],
        }
      );

    expect(
      result.success
    ).toBe(false);
  }
);

test(
  "invalid useCase fails validation",
  () => {
    const result =
      safeParseBody(
        auditRequestSchema,
        {
          ...validInput,

          useCase:
            "gaming" as never,
        }
      );

    expect(
      result.success
    ).toBe(false);
  }
);

test(
  "unknown fields fail validation",
  () => {
    const result =
      safeParseBody(
        auditRequestSchema,
        {
          ...validInput,

          hackerField:
            "evil",
        }
      );

    expect(
      result.success
    ).toBe(false);
  }
);

// ─── Pipeline Tests ──────────────────────────────────────────────────────

test(
  "valid input produces a well-shaped AuditResult",
  () => {
    const parsed =
      safeParseBody(
        auditRequestSchema,
        validInput
      );

    expect(
      parsed.success
    ).toBe(true);

    if (!parsed.success)
      return;

    const result =
      runAudit(
        parsed.data
      );

    expect(
      result.tools
    ).toHaveLength(2);

    expect(
      typeof result.totalMonthlySavings
    ).toBe("number");

    expect(
      typeof result.totalAnnualSavings
    ).toBe("number");

    expect(
      result.totalAnnualSavings
    ).toBe(
      result.totalMonthlySavings *
        12
    );
  }
);

test(
  "result has no id before Supabase save",
  () => {
    const result =
      runAudit(validInput);

    expect(
      result.id
    ).toBeUndefined();
  }
);

test(
  "all tool results have required fields",
  () => {
    const result =
      runAudit(validInput);

    for (const tool of result.tools) {
      expect(
        tool.toolId
      ).toBeDefined();

      expect(
        typeof tool.currentSpend
      ).toBe("number");

      expect(
        tool.recommendation.action
      ).toMatch(
        /^(downgrade|switch|credits|optimal)$/
      );

      expect(
        typeof tool.recommendation
          .monthlySavings
      ).toBe("number");

      expect(
        tool.recommendation.reason
          .length
      ).toBeGreaterThan(10);
    }
  }
);

test(
  "runAudit is deterministic",
  () => {
    const result1 =
      runAudit(validInput);

    const result2 =
      runAudit(validInput);

    expect(result1)
      .toEqual(result2);
  }
);