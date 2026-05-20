/**
 * PRICING DATA — Single source of truth.
 *
 * Every number here must match PRICING_DATA.md.
 * Update pricing here → audit engine updates automatically.
 *
 * Prices are USD per seat/month unless otherwise noted.
 */

// ─── Shared Types ────────────────────────────────────────────────────────────

export type PricingValue = number | null;

// ─── Per-seat monthly pricing ────────────────────────────────────────────────

export const PRICING = {
  cursor: {
    hobby: 0,
    pro: 20, // ~$19/mo annual
    business: 40,
    enterprise: null, // contact sales
  },

  "github-copilot": {
    individual: 10, // ~$8.33/mo annual
    business: 19,
    enterprise: 39,
  },

  claude: {
    free: 0,
    pro: 20,
    max: 100,
    team: 30, // minimum 5 seats
    enterprise: null,
    api: null, // usage-based pricing
  },

  chatgpt: {
    plus: 20,
    team: 30, // minimum 2 seats
    enterprise: null,
    api: null, // usage-based pricing
  },

  "anthropic-api": {
    api: null, // usage-based pricing
  },

  "openai-api": {
    api: null, // usage-based pricing
  },

  gemini: {
    pro: 20,
    ultra: null,
    api: null,
  },

  windsurf: {
    free: 0,
    pro: 15,
    team: 35,
  },
} as const;

// ─── Pricing Helpers ─────────────────────────────────────────────────────────

/**
 * Returns list price for a tool/plan combination.
 *
 * Returns:
 * - number → fixed monthly seat price
 * - null → custom or usage-based pricing
 */
export function listPrice(
  toolId: keyof typeof PRICING,
  plan: string
): PricingValue {
  const tool =
    PRICING[toolId] as Record<string, PricingValue>;

  return tool?.[plan] ?? null;
}

/**
 * Calculates expected spend from list pricing.
 *
 * Returns:
 * - number → expected seat-based spend
 * - 0 → unknown/custom pricing
 */
export function expectedSpend(
  toolId: keyof typeof PRICING,
  plan: string,
  seats: number
): number {
  const price = listPrice(toolId, plan);

  if (price === null) {
    return 0;
  }

  return price * seats;
}

// ─── Plan Recommendation Thresholds ─────────────────────────────────────────

/**
 * Seat thresholds where higher plans begin making sense operationally.
 */
export const PLAN_THRESHOLDS = {
  /**
   * Cursor Business becomes useful when
   * admin/security features matter.
   */
  cursorBusiness: 5,

  /**
   * Copilot Business becomes worthwhile
   * for centralized billing/admin control.
   */
  copilotBusiness: 3,

  /**
   * Claude Team minimum anyway.
   */
  claudeTeam: 5,

  /**
   * ChatGPT Team minimum seats.
   */
  chatgptTeam: 2,
} as const;

// ─── Product Thresholds ──────────────────────────────────────────────────────

/**
 * Show Spendora consultation CTA
 * above this monthly savings figure.
 */
export const SPENDORA_CTA_THRESHOLD = 500;

/**
 * Below this threshold,
 * user is considered already well optimized.
 */
export const OPTIMAL_THRESHOLD = 100;