/**
 * AUDIT ENGINE TESTS
 *
 * These run in CI on every push.
 * Evaluators will run: npm test
 *
 * Coverage targets:
 * - downgrade rules
 * - cross-tool alternatives
 * - credits opportunities
 * - optimal recommendations
 * - aggregation logic
 * - CTA tiering
 * - result sorting
 * - null-pricing safety
 */

import {
  auditTool,
  ctaTier,
  runAudit,
  totalSavings,
} from "../lib/auditEngine";

import type {
  AuditInput,
  ToolInput,
} from "../lib/types";

// ─── Shared Fixtures ────────────────────────────────────────────────────────

const codingCtx: AuditInput = {
  tools: [],
  teamSize: 4,
  useCase: "coding",
};

const writingCtx: AuditInput = {
  tools: [],
  teamSize: 3,
  useCase: "writing",
};

// ─── 1. Cursor downgrade ───────────────────────────────────────────────────

test(
  "Cursor Business with 2 seats → downgrade to Pro",
  () => {
    const tool: ToolInput = {
      toolId: "cursor",
      plan: "business",
      monthlySpend: 80,
      seats: 2,
    };

    const result = auditTool(
      tool,
      codingCtx
    );

    expect(
      result.recommendation.action
    ).toBe("downgrade");

    expect(
      result.recommendation.targetPlan
    ).toBe("pro");

    expect(
      result.recommendation.monthlySavings
    ).toBe(40);

    expect(
      result.recommendation.confidence
    ).toBe("high");

    expect(
      result.recommendation.reason.length
    ).toBeGreaterThan(20);
  }
);

// ─── 2. Cursor threshold respected ─────────────────────────────────────────

test(
  "Cursor Business with 5 seats → no downgrade",
  () => {
    const tool: ToolInput = {
      toolId: "cursor",
      plan: "business",
      monthlySpend: 200,
      seats: 5,
    };

    const result = auditTool(
      tool,
      codingCtx
    );

    expect(
      result.recommendation.action
    ).not.toBe("downgrade");
  }
);

// ─── 3. Copilot downgrade ──────────────────────────────────────────────────

test(
  "Copilot Business with 1 seat → downgrade",
  () => {
    const tool: ToolInput = {
      toolId: "github-copilot",
      plan: "business",
      monthlySpend: 19,
      seats: 1,
    };

    const result = auditTool(
      tool,
      codingCtx
    );

    expect(
      result.recommendation.action
    ).toBe("downgrade");

    expect(
      result.recommendation.targetPlan
    ).toBe("individual");

    expect(
      result.recommendation.monthlySavings
    ).toBe(9);

    expect(
      result.recommendation.confidence
    ).toBe("high");
  }
);

// ─── 4. Claude Team downgrade ──────────────────────────────────────────────

test(
  "Claude Team with 2 seats → downgrade to Pro",
  () => {
    const tool: ToolInput = {
      toolId: "claude",
      plan: "team",
      monthlySpend: 60,
      seats: 2,
    };

    const result = auditTool(
      tool,
      writingCtx
    );

    expect(
      result.recommendation.action
    ).toBe("downgrade");

    expect(
      result.recommendation.targetPlan
    ).toBe("pro");

    expect(
      result.recommendation.monthlySavings
    ).toBe(20);

    expect(
      result.recommendation.confidence
    ).toBe("high");
  }
);

// ─── 5. Credits opportunity ────────────────────────────────────────────────

test(
  "High-spend tool → Spendora credits recommendation",
  () => {
    const tool: ToolInput = {
      toolId: "cursor",
      plan: "pro",
      monthlySpend: 200,
      seats: 10,
    };

    const result = auditTool(tool, {
      ...codingCtx,
      teamSize: 10,
    });

    expect(
      result.recommendation.action
    ).toBe("credits");

    expect(
      result.recommendation.monthlySavings
    ).toBe(30);

    expect(
      result.recommendation.confidence
    ).toBe("low");
  }
);

// ─── 6. Optimal recommendation ─────────────────────────────────────────────

test(
  "Low spend tool → optimal recommendation",
  () => {
    const tool: ToolInput = {
      toolId: "windsurf",
      plan: "free",
      monthlySpend: 0,
      seats: 1,
    };

    const result = auditTool(
      tool,
      codingCtx
    );

    expect(
      result.recommendation.action
    ).toBe("optimal");

    expect(
      result.recommendation.monthlySavings
    ).toBe(0);
  }
);

// ─── 7. Full aggregation ───────────────────────────────────────────────────

test(
  "runAudit totals monthly and annual savings",
  () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          plan: "business",
          monthlySpend: 80,
          seats: 2,
        },
        {
          toolId: "github-copilot",
          plan: "business",
          monthlySpend: 19,
          seats: 1,
        },
      ],
      teamSize: 3,
      useCase: "coding",
    };

    const result = runAudit(input);

    expect(
      result.totalMonthlySavings
    ).toBe(49);

    expect(
      result.totalAnnualSavings
    ).toBe(588);

    expect(
      result.tools
    ).toHaveLength(2);
  }
);

// ─── 8. totalSavings helper ────────────────────────────────────────────────

test(
  "totalSavings sums correctly",
  () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          plan: "business",
          monthlySpend: 80,
          seats: 2,
        },
        {
          toolId: "claude",
          plan: "team",
          monthlySpend: 60,
          seats: 2,
        },
      ],
      teamSize: 4,
      useCase: "writing",
    };

    const result = runAudit(input);

    const computed = totalSavings(
      result.tools
    );

    expect(computed).toBe(
      result.totalMonthlySavings
    );
  }
);

// ─── 9. CTA tiering ────────────────────────────────────────────────────────

test(
  "ctaTier returns spendora for savings >= 500",
  () => {
    expect(
      ctaTier(500)
    ).toBe("spendora");

    expect(
      ctaTier(1000)
    ).toBe("spendora");
  }
);

test(
  "ctaTier returns optimal below 100",
  () => {
    expect(
      ctaTier(0)
    ).toBe("optimal");

    expect(
      ctaTier(99)
    ).toBe("optimal");
  }
);

test(
  "ctaTier returns notify between 100 and 499",
  () => {
    expect(
      ctaTier(100)
    ).toBe("notify");

    expect(
      ctaTier(499)
    ).toBe("notify");
  }
);

// ─── 10. No negative savings ───────────────────────────────────────────────

test(
  "No recommendation returns negative savings",
  () => {
    const input: AuditInput = {
      tools: [
        {
          toolId: "cursor",
          plan: "hobby",
          monthlySpend: 0,
          seats: 1,
        },
        {
          toolId: "claude",
          plan: "free",
          monthlySpend: 0,
          seats: 1,
        },
        {
          toolId: "windsurf",
          plan: "free",
          monthlySpend: 0,
          seats: 1,
        },
      ],
      teamSize: 1,
      useCase: "coding",
    };

    const result = runAudit(input);

    result.tools.forEach((tool) => {
      expect(
        tool.recommendation
          .monthlySavings
      ).toBeGreaterThanOrEqual(0);
    });
  }
);

// ─── 11. Results sorted by highest savings ─────────────────────────────────

test(
  "runAudit sorts results by highest savings first",
  () => {
    const result = runAudit({
      tools: [
        {
          toolId: "github-copilot",
          plan: "business",
          monthlySpend: 19,
          seats: 1,
        },
        {
          toolId: "cursor",
          plan: "business",
          monthlySpend: 80,
          seats: 2,
        },
      ],
      teamSize: 3,
      useCase: "coding",
    });

    expect(
      result.tools[0].toolId
    ).toBe("cursor");
  }
);

// ─── 12. Null-pricing safety ───────────────────────────────────────────────

test(
  "Custom pricing plans never create invalid savings",
  () => {
    const tool: ToolInput = {
      toolId: "chatgpt",
      plan: "enterprise",
      monthlySpend: 500,
      seats: 10,
    };

    const result = auditTool(tool, {
      tools: [],
      teamSize: 10,
      useCase: "writing",
    });

    expect(
      result.recommendation
        .monthlySavings
    ).toBeGreaterThanOrEqual(0);
  }
);