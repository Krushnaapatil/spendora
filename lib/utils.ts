/**
 * UTILITIES — Pure helper functions.
 *
 * Rules:
 * - No business logic
 * - No React imports
 * - No imports from other lib files except types
 * - No side effects outside explicitly named helpers
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import type {
  AnyPlan,
  ToolId,
} from "./types";

// ─── Tailwind Class Merge ───────────────────────────────────────────────────

/**
 * Merge Tailwind classes safely.
 * Prevents conflicting utility duplication.
 */
export function cn(
  ...inputs: ClassValue[]
): string {
  return twMerge(clsx(inputs));
}

// ─── Currency Formatting ────────────────────────────────────────────────────

/**
 * Format a USD amount.
 *
 * Examples:
 * - $1,250
 * - $1,250.50
 * - $1.2k
 * - $2.5m
 */
export function formatUSD(
  amount: number,
  opts: {
    decimals?: boolean;
    compact?: boolean;
  } = {}
): string {
  const {
    decimals = false,
    compact = false,
  } = opts;

  if (compact) {
    if (amount >= 1_000_000) {
      return `$${(
        amount / 1_000_000
      ).toFixed(1)}m`;
    }

    if (amount >= 1_000) {
      return `$${(
        amount / 1_000
      ).toFixed(1)}k`;
    }
  }

  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",

      minimumFractionDigits:
        decimals ? 2 : 0,

      maximumFractionDigits:
        decimals ? 2 : 0,
    }
  ).format(amount);
}

/**
 * Convert monthly savings into:
 * "$500/mo · $6,000/yr"
 */
export function savingsCopy(
  monthly: number
): string {
  const annual = monthly * 12;

  return `${formatUSD(
    monthly
  )}/mo · ${formatUSD(
    annual
  )}/yr`;
}

// ─── Tool Labels ────────────────────────────────────────────────────────────

const TOOL_LABELS: Readonly<
  Record<ToolId, string>
> = {
  cursor: "Cursor",

  "github-copilot":
    "GitHub Copilot",

  claude: "Claude",

  chatgpt: "ChatGPT",

  "anthropic-api":
    "Anthropic API",

  "openai-api":
    "OpenAI API",

  gemini: "Gemini",

  windsurf: "Windsurf",
};

export function toolLabel(
  toolId: ToolId
): string {
  return (
    TOOL_LABELS[toolId] ?? toolId
  );
}

// ─── Plan Labels ────────────────────────────────────────────────────────────

const PLAN_LABELS: Readonly<
  Record<AnyPlan, string>
> = {
  hobby: "Hobby",

  pro: "Pro",

  business: "Business",

  enterprise: "Enterprise",

  individual: "Individual",

  free: "Free",

  plus: "Plus",

  team: "Team",

  max: "Max",

  api: "API (usage-based)",

  ultra: "Ultra",
};

export function planLabel(
  plan: AnyPlan
): string {
  return (
    PLAN_LABELS[plan] ?? plan
  );
}

// ─── Validation Helpers ─────────────────────────────────────────────────────

export function isValidEmail(
  email: string
): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
    email
  );
}

/**
 * Checks for:
 * - number
 * - not NaN
 * - >= 0
 */
export function isNonNegativeNumber(
  value: unknown
): value is number {
  return (
    typeof value === "number" &&
    !isNaN(value) &&
    value >= 0
  );
}

// ─── LocalStorage Helpers ───────────────────────────────────────────────────

const FORM_STORAGE_KEY =
  "spendora_form_state";

/**
 * Persist form state locally.
 */
export function saveFormState(
  data: unknown
): void {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  try {
    localStorage.setItem(
      FORM_STORAGE_KEY,
      JSON.stringify(data)
    );
  } catch {
    // ignore storage failures
  }
}

/**
 * Restore persisted form state.
 */
export function loadFormState<T>():
  | T
  | null {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  try {
    const raw =
      localStorage.getItem(
        FORM_STORAGE_KEY
      );

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Remove persisted form state.
 */
export function clearFormState(): void {
  if (
    typeof window === "undefined"
  ) {
    return;
  }

  try {
    localStorage.removeItem(
      FORM_STORAGE_KEY
    );
  } catch {
    // ignore storage failures
  }
}

// ─── Misc Helpers ───────────────────────────────────────────────────────────

/**
 * Async delay helper.
 * Useful in tests and mocked loading states.
 */
export function sleep(
  ms: number
): Promise<void> {
  return new Promise((resolve) =>
    setTimeout(resolve, ms)
  );
}

/**
 * Attempt to POST /api/audit/link with retries and exponential backoff.
 * Returns true if the link succeeded (response.ok), false otherwise.
 */
export async function linkAuditWithRetry(
  auditId: string,
  accessToken: string,
  options: {
    retries?: number;
    initialDelayMs?: number;
  } = {}
): Promise<boolean> {
  const { retries = 5, initialDelayMs = 250 } = options;

  let attempt = 0;

  while (attempt < retries) {
    try {
      const res = await fetch("/api/audit/link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ auditId }),
      });

      if (res.ok) return true;

      // Non-retriable errors: 400, 401, 403, 404 (client issues)
      if ([400, 401, 403, 404].includes(res.status)) {
        return false;
      }

      // For 429 or 5xx, fallthrough to retry
    } catch (err) {
      // network error — will retry
    }

    attempt += 1;

    const delay = Math.round(
      initialDelayMs * Math.pow(2, attempt - 1)
    );

    await sleep(delay);
  }

  return false;
}

/**
 * Generate readable short IDs
 * for UI display only.
 *
 * Never use for database IDs.
 */
export function shortId(
  uuid: string
): string {
  return uuid
    .slice(0, 8)
    .toUpperCase();
}