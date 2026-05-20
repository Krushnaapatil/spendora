/**
 * AUDIT ENGINE
 *
 * Pure functions only.
 * No React, no fetch, no Supabase, no side effects.
 *
 * Input: AuditInput
 * Output: AuditResult
 *
 * Core philosophy:
 * - deterministic
 * - testable
 * - finance-literate recommendations
 * - no fake savings
 */

import type {
  AuditInput,
  AuditResult,
  Recommendation,
  ToolAuditResult,
  ToolInput,
  UseCase,
} from "./types";

import {
  OPTIMAL_THRESHOLD,
  PLAN_THRESHOLDS,
  SPENDORA_CTA_THRESHOLD,
  listPrice,
} from "./pricing";

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Run a full audit across all tools.
 */
export function runAudit(input: AuditInput): AuditResult {
  const toolResults = input.tools.map((tool) =>
    auditTool(tool, input)
  );

  // Largest savings first
  toolResults.sort(
    (a, b) =>
      b.recommendation.monthlySavings -
      a.recommendation.monthlySavings
  );

  const totalMonthlySavings = totalSavings(toolResults);

  return {
    tools: toolResults,

    totalMonthlySavings: round2(totalMonthlySavings),

    totalAnnualSavings: round2(
      totalMonthlySavings * 12
    ),
  };
}

/**
 * Audit a single tool.
 *
 * Rule priority:
 * 1. Downgrade within same vendor
 * 2. Cross-tool replacement
 * 3. Spendora credits opportunity
 * 4. Already optimal
 */
export function auditTool(
  tool: ToolInput,
  ctx: AuditInput
): ToolAuditResult {
  const recommendation =
    checkPlanFit(tool, ctx.teamSize) ??
    checkCrossToolAlternative(
      tool,
      ctx.useCase
    ) ??
    checkCreditsOpportunity(tool) ??
    optimalRecommendation();

  return {
    toolId: tool.toolId,

    currentSpend: tool.monthlySpend,

    recommendation,
  };
}

/**
 * Sum monthly savings across results.
 */
export function totalSavings(
  results: ToolAuditResult[]
): number {
  return round2(
    results.reduce(
      (sum, r) =>
        sum + r.recommendation.monthlySavings,
      0
    )
  );
}

/**
 * Determine which CTA to show.
 */
export function ctaTier(
  monthlySavings: number
): "spendora" | "notify" | "optimal" {
  if (
    monthlySavings >=
    SPENDORA_CTA_THRESHOLD
  ) {
    return "spendora";
  }

  if (
    monthlySavings < OPTIMAL_THRESHOLD
  ) {
    return "optimal";
  }

  return "notify";
}

// ─── Rule: Plan Fit ─────────────────────────────────────────────────────────

/**
 * Detects when a user is paying
 * for a plan tier that doesn't match
 * actual team size or operational need.
 */
function checkPlanFit(
  tool: ToolInput,
  teamSize: number
): Recommendation | null {
  const {
    toolId,
    plan,
    seats,
    monthlySpend,
  } = tool;

  switch (toolId) {
    case "cursor": {
      if (
        plan === "business" &&
        seats <
          PLAN_THRESHOLDS.cursorBusiness
      ) {
        const proPrice = listPrice(
          "cursor",
          "pro"
        );

        if (proPrice === null) {
          return null;
        }

        const saving =
          monthlySpend - proPrice * seats;

        if (saving <= 0) {
          return null;
        }

        return {
          action: "downgrade",

          targetPlan: "pro",

          monthlySavings: round2(saving),

          confidence: "high",

          reason: `Cursor Business adds admin and SSO features unnecessary for teams under ${PLAN_THRESHOLDS.cursorBusiness} seats. Cursor Pro delivers equivalent coding capability at lower cost.`,
        };
      }

      return null;
    }

    case "github-copilot": {
      if (
        plan === "enterprise" &&
        seats < 10
      ) {
        const businessPrice = listPrice(
          "github-copilot",
          "business"
        );

        if (businessPrice === null) {
          return null;
        }

        const saving =
          monthlySpend -
          businessPrice * seats;

        if (saving <= 0) {
          return null;
        }

        return {
          action: "downgrade",

          targetPlan: "business",

          monthlySavings: round2(saving),

          confidence: "high",

          reason: `Copilot Enterprise features like audit logs and advanced governance are rarely necessary below 10 seats. Copilot Business supports standard collaborative coding workflows at lower cost.`,
        };
      }

      if (
        plan === "business" &&
        seats <
          PLAN_THRESHOLDS.copilotBusiness
      ) {
        const individualPrice =
          listPrice(
            "github-copilot",
            "individual"
          );

        if (individualPrice === null) {
          return null;
        }

        const saving =
          monthlySpend -
          individualPrice * seats;

        if (saving <= 0) {
          return null;
        }

        return {
          action: "downgrade",

          targetPlan: "individual",

          monthlySavings: round2(saving),

          confidence: "high",

          reason: `Centralized billing and policy controls become useful at ${PLAN_THRESHOLDS.copilotBusiness}+ developers. Individual plans are more economical for smaller teams.`,
        };
      }

      return null;
    }

    case "claude": {
      if (
        plan === "team" &&
        seats <
          PLAN_THRESHOLDS.claudeTeam
      ) {
        const proPrice = listPrice(
          "claude",
          "pro"
        );

        if (proPrice === null) {
          return null;
        }

        const saving =
          monthlySpend - proPrice * seats;

        if (saving <= 0) {
          return null;
        }

        return {
          action: "downgrade",

          targetPlan: "pro",

          monthlySavings: round2(saving),

          confidence: "high",

          reason: `Claude Team enforces a minimum seat structure that becomes inefficient for smaller teams. Individual Pro plans provide equivalent capability at lower cost.`,
        };
      }

      if (
        plan === "max" &&
        teamSize <= 5 &&
        seats >= 2
      ) {
        const proPrice = listPrice(
          "claude",
          "pro"
        );

        if (proPrice === null) {
          return null;
        }

        const saving =
          monthlySpend - proPrice * seats;

        if (saving <= 0) {
          return null;
        }

        return {
          action: "downgrade",

          targetPlan: "pro",

          monthlySavings: round2(saving),

          confidence: "medium",

          reason: `Claude Max is designed for users consistently exceeding Pro limits. Most small teams receive similar workflow value from Claude Pro at substantially lower cost.`,
        };
      }

      return null;
    }

    case "chatgpt": {
      if (
        plan === "team" &&
        seats <
          PLAN_THRESHOLDS.chatgptTeam
      ) {
        const plusPrice = listPrice(
          "chatgpt",
          "plus"
        );

        if (plusPrice === null) {
          return null;
        }

        const saving =
          monthlySpend - plusPrice * seats;

        if (saving <= 0) {
          return null;
        }

        return {
          action: "downgrade",

          targetPlan: "plus",

          monthlySavings: round2(saving),

          confidence: "high",

          reason: `ChatGPT Team workspace features provide little operational value below the minimum collaborative threshold. Plus plans maintain equivalent model access for smaller teams.`,
        };
      }

      return null;
    }

    default:
      return null;
  }
}

// ─── Rule: Cross-tool Alternatives ──────────────────────────────────────────

/**
 * Detects cheaper equivalent tools
 * for specific workflow categories.
 */
function checkCrossToolAlternative(
  tool: ToolInput,
  useCase: UseCase
): Recommendation | null {
  const {
    toolId,
    plan,
    monthlySpend,
    seats,
  } = tool;

  // Cursor Business → Windsurf Team
  if (
    toolId === "cursor" &&
    plan === "business" &&
    useCase !== "coding" &&
    seats >= 3
  ) {
    const windsurfPrice =
      listPrice(
        "windsurf",
        "team"
      );

    if (windsurfPrice === null) {
      return null;
    }

    const saving =
      monthlySpend -
      windsurfPrice * seats;

    if (saving <= 0) {
      return null;
    }

    return {
      action: "switch",

      targetToolId: "windsurf",

      targetPlan: "team",

      monthlySavings: round2(saving),

      confidence: "medium",

      reason: `For non-coding workflows, Windsurf Team delivers comparable AI assistance at lower operational cost than Cursor Business.`,
    };
  }

  // ChatGPT Plus → Claude Pro
  if (
    toolId === "chatgpt" &&
    plan === "plus" &&
    (useCase === "writing" ||
      useCase === "research")
  ) {
    const claudePrice = listPrice(
      "claude",
      "pro"
    );

    if (claudePrice === null) {
      return null;
    }

    const saving =
      monthlySpend -
      claudePrice * seats;

    if (saving <= 5 * seats) {
      return null;
    }

    return {
      action: "switch",

      targetToolId: "claude",

      targetPlan: "pro",

      monthlySavings: round2(saving),

      confidence: "medium",

      reason: `Claude Pro is generally stronger for long-form writing and research workflows while maintaining similar pricing structure.`,
    };
  }

  // Copilot → Windsurf
  if (
    toolId === "github-copilot" &&
    plan === "individual" &&
    seats === 1 &&
    useCase === "coding"
  ) {
    const windsurfPrice =
      listPrice(
        "windsurf",
        "pro"
      );

    if (windsurfPrice === null) {
      return null;
    }

    const saving =
      monthlySpend - windsurfPrice;

    if (saving <= 0) {
      return null;
    }

    return {
      action: "switch",

      targetToolId: "windsurf",

      targetPlan: "pro",

      monthlySavings: round2(saving),

      confidence: "low",

      reason: `Windsurf Pro provides broader multi-file editing and contextual coding support suitable for solo development workflows.`,
    };
  }

  return null;
}

// ─── Rule: Spendora Credits Opportunity ─────────────────────────────────────

/**
 * Detects opportunities where
 * negotiated AI credits may reduce spend.
 */
function checkCreditsOpportunity(
  tool: ToolInput
): Recommendation | null {
  const { monthlySpend } = tool;

  if (monthlySpend < 50) {
    return null;
  }

  const discountRate = 0.15;

  const saving = round2(
    monthlySpend * discountRate
  );

  return {
    action: "credits",

    monthlySavings: saving,

    confidence: "low",

    reason: `Spendora may reduce effective AI infrastructure costs through negotiated credit sourcing and optimization opportunities.`,
  };
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function optimalRecommendation(): Recommendation {
  return {
    action: "optimal",

    monthlySavings: 0,

    confidence: "high",

    reason:
      "Current plan structure and seat allocation are already well aligned with team size and workflow requirements.",
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}