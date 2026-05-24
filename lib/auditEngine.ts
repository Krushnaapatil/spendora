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

  // Overlap detection: consolidate multiple switch targets into a single
  // consolidated recommendation to avoid template-like repeated advice
  // and double-counting savings.
  const switchMap = new Map<string, number[]>();

  toolResults.forEach((tr, idx) => {
    const tgt = tr.recommendation.targetToolId;
    if (tr.recommendation.action === "switch" && tgt) {
      const list = switchMap.get(tgt) ?? [];
      list.push(idx);
      switchMap.set(tgt, list);
    }
  });

  for (const [tgt, idxs] of switchMap.entries()) {
    if (idxs.length > 1) {
      // Sum savings and convert the first into a consolidate recommendation
      const total = idxs.reduce((s, i) => s + toolResults[i].recommendation.monthlySavings, 0);
      const primary = toolResults[idxs[0]].recommendation;
      primary.action = "consolidate";
      primary.monthlySavings = round2(total);
      primary.confidence = "high";
      primary.reason = `Consolidate multiple overlapping tools into ${tgt} to avoid duplicated capability and reduce overall cost. Combined savings: $${round2(total)} / mo.`;

      // Zero out others to avoid double-counting and mark them as overlapping
      for (let k = 1; k < idxs.length; k++) {
        const r = toolResults[idxs[k]].recommendation;
        r.monthlySavings = 0;
        r.confidence = "low";
        r.reason = `Overlaps with consolidation recommendation for ${tgt}; follow consolidated guidance instead.`;
      }
    }
  }

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

        const saving = monthlySpend - proPrice * seats;

        if (saving <= 0) return null;

        const perSeatCurrent = round2(monthlySpend / Math.max(1, seats));
        const perSeatTarget = round2(proPrice);
        const confidence = computeConfidence(saving, monthlySpend, seats);

        return {
          action: "downgrade",
          targetPlan: "pro",
          monthlySavings: round2(saving),
          confidence,
          reason: `Cursor Business provides admin/SSO that teams under ${PLAN_THRESHOLDS.cursorBusiness} rarely use. Current ≈ $${perSeatCurrent}/seat vs target ≈ $${perSeatTarget}/seat — saves $${round2(saving)}/mo.`,
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

        const saving = monthlySpend - businessPrice * seats;
        if (saving <= 0) return null;
        const perSeatCurrent = round2(monthlySpend / Math.max(1, seats));
        const perSeatTarget = round2(businessPrice);
        const confidence = computeConfidence(saving, monthlySpend, seats);

        return {
          action: "downgrade",
          targetPlan: "business",
          monthlySavings: round2(saving),
          confidence,
          reason: `Enterprise features (audit logs, governance) are high value for larger orgs; below 10 seats business plan is typically sufficient. Current ≈ $${perSeatCurrent}/seat vs target ≈ $${perSeatTarget}/seat — saves $${round2(saving)}/mo.`,
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

        const saving = monthlySpend - individualPrice * seats;
        if (saving <= 0) return null;
        const perSeatCurrent = round2(monthlySpend / Math.max(1, seats));
        const perSeatTarget = round2(individualPrice);
        const confidence = computeConfidence(saving, monthlySpend, seats);

        return {
          action: "downgrade",
          targetPlan: "individual",
          monthlySavings: round2(saving),
          confidence,
          reason: `Centralized billing and policy controls pay off at larger teams. Current ≈ $${perSeatCurrent}/seat vs individual ≈ $${perSeatTarget}/seat — saves $${round2(saving)}/mo.`,
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

        const saving = monthlySpend - proPrice * seats;
        if (saving <= 0) return null;
        const perSeatCurrent = round2(monthlySpend / Math.max(1, seats));
        const perSeatTarget = round2(proPrice);
        const confidence = computeConfidence(saving, monthlySpend, seats);

        return {
          action: "downgrade",
          targetPlan: "pro",
          monthlySavings: round2(saving),
          confidence,
          reason: `Claude Team seat minimum makes small-team pricing inefficient. Current ≈ $${perSeatCurrent}/seat vs Pro ≈ $${perSeatTarget}/seat — saves $${round2(saving)}/mo.`,
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

        const saving = monthlySpend - proPrice * seats;
        if (saving <= 0) return null;
        const perSeatCurrent = round2(monthlySpend / Math.max(1, seats));
        const perSeatTarget = round2(proPrice);
        const confidence = computeConfidence(saving, monthlySpend, seats);

        return {
          action: "downgrade",
          targetPlan: "pro",
          monthlySavings: round2(saving),
          confidence,
          reason: `Claude Max suits heavy users; for small teams Claude Pro delivers similar value. Current ≈ $${perSeatCurrent}/seat vs Pro ≈ $${perSeatTarget}/seat — saves $${round2(saving)}/mo.`,
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

        const saving = monthlySpend - plusPrice * seats;
        if (saving <= 0) return null;
        const perSeatCurrent = round2(monthlySpend / Math.max(1, seats));
        const perSeatTarget = round2(plusPrice);
        const confidence = computeConfidence(saving, monthlySpend, seats);

        return {
          action: "downgrade",
          targetPlan: "plus",
          monthlySavings: round2(saving),
          confidence,
          reason: `ChatGPT Team features are most valuable for active collaborative teams. Current ≈ $${perSeatCurrent}/seat vs Plus ≈ $${perSeatTarget}/seat — saves $${round2(saving)}/mo.`,
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

    const perSeatCurrent = round2(monthlySpend / Math.max(1, seats));
    const perSeatTarget = round2(windsurfPrice);
    const confidence = computeConfidence(saving, monthlySpend, seats);

    return {
      action: "switch",
      targetToolId: "windsurf",
      targetPlan: "team",
      monthlySavings: round2(saving),
      confidence,
      reason: `For non-coding workflows, Windsurf Team can replace Cursor Business. Current ≈ $${perSeatCurrent}/seat vs Windsurf ≈ $${perSeatTarget}/seat — saves $${round2(saving)}/mo.`,
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

    const perSeatCurrent = round2(monthlySpend / Math.max(1, seats));
    const perSeatTarget = round2(claudePrice);
    const confidence = computeConfidence(saving, monthlySpend, seats);

    return {
      action: "switch",
      targetToolId: "claude",
      targetPlan: "pro",
      monthlySavings: round2(saving),
      confidence,
      reason: `For writing/research, Claude Pro often provides better long‑form value. Current ≈ $${perSeatCurrent}/seat vs Claude ≈ $${perSeatTarget}/seat — saves $${round2(saving)}/mo.`,
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

    const perSeatCurrent = round2(monthlySpend / Math.max(1, seats));
    const perSeatTarget = round2(windsurfPrice);
    const confidence = computeConfidence(saving, monthlySpend, seats);

    return {
      action: "switch",
      targetToolId: "windsurf",
      targetPlan: "pro",
      monthlySavings: round2(saving),
      confidence,
      reason: `Windsurf Pro offers a comparable solo developer workflow at lower cost. Current ≈ $${perSeatCurrent}/seat vs Windsurf ≈ $${perSeatTarget} — saves $${round2(saving)}/mo.`,
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
  // Negotiated credits are inherently uncertain — surface as low confidence
  return {
    action: "credits",
    monthlySavings: saving,
    confidence: "low",
    reason: `Estimated negotiated credits (~${Math.round(discountRate * 100)}% discount) could reduce spend by $${saving}/mo. Actual savings depend on vendor negotiation and usage patterns.`,
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

/**
 * Compute a simple confidence signal based on absolute and relative savings.
 */
function computeConfidence(
  saving: number,
  baselineMonthly: number,
  seats: number
): "high" | "medium" | "low" {
  if (saving <= 0) return "low";

  const pct = baselineMonthly > 0 ? saving / baselineMonthly : 0;
  const perSeat = saving / Math.max(1, seats);

  if (pct >= 0.2 || perSeat >= 50 || saving >= 200) return "high";
  if (pct >= 0.1 || perSeat >= 15 || saving >= 50) return "medium";

  return "low";
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}