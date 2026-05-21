/**
 * lib/env.ts — Environment variable validation
 *
 * Single source of truth for all environment variables.
 *
 * Design goals:
 * - Lazy evaluation (safe for Next.js builds)
 * - Runtime validation
 * - Immutable env state
 * - Prevent accidental browser access to server secrets
 * - Typed access everywhere
 *
 * Usage:
 *   import { env } from "@/lib/env";
 *
 *   env.ANTHROPIC_API_KEY
 *   env.NEXT_PUBLIC_APP_URL
 *
 * Important:
 * - NEXT_PUBLIC_* vars are browser-safe
 * - all other vars are SERVER ONLY
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

function requireEnv(
  key: string
): string {
  const value = process.env[key];

  if (
    !value ||
    value.trim() === ""
  ) {
    throw new Error(
      `[env] Missing required environment variable: ${key}\n` +
        `Copy .env.example to .env.local and fill in the value.`
    );
  }

  return value.trim();
}

function optionalEnv(
  key: string,
  fallback = ""
): string {
  return (
    process.env[key]?.trim() ??
    fallback
  );
}

// ─── NODE_ENV Validation ───────────────────────────────────────────────────

const VALID_NODE_ENVS = [
  "development",
  "production",
  "test",
] as const;

type NodeEnv =
  (typeof VALID_NODE_ENVS)[number];

function getNodeEnv(): NodeEnv {
  const value = optionalEnv(
    "NODE_ENV",
    "development"
  );

  if (
    VALID_NODE_ENVS.includes(
      value as NodeEnv
    )
  ) {
    return value as NodeEnv;
  }

  throw new Error(
    `[env] Invalid NODE_ENV value: ${value}`
  );
}

// ─── Server-only Runtime Protection ────────────────────────────────────────

function assertServerOnly(
  key: string
): void {
  const isBrowser =
    typeof window !== "undefined";

  const isPublic =
    key.startsWith(
      "NEXT_PUBLIC_"
    );

  if (
    isBrowser &&
    !isPublic
  ) {
    throw new Error(
      `[env] Attempted to access server-only env var "${key}" in the browser.`
    );
  }
}

// ─── Environment Builder ───────────────────────────────────────────────────

/**
 * Builds validated env object.
 *
 * Called lazily on first access,
 * not during module parse time.
 */
function buildEnv() {
  return Object.freeze({
    // ── Supabase (browser-safe) ─────────────────────────────────────────

    NEXT_PUBLIC_SUPABASE_URL:
      requireEnv(
        "NEXT_PUBLIC_SUPABASE_URL"
      ),

    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      requireEnv(
        "NEXT_PUBLIC_SUPABASE_ANON_KEY"
      ),

    // ── Supabase (SERVER ONLY) ──────────────────────────────────────────

    /**
     * WARNING:
     * Bypasses Row Level Security.
     * NEVER expose to browser.
     */
    SUPABASE_SERVICE_ROLE_KEY:
      requireEnv(
        "SUPABASE_SERVICE_ROLE_KEY"
      ),

    // ── Anthropic (SERVER ONLY) ─────────────────────────────────────────

    ANTHROPIC_API_KEY:
      requireEnv(
        "ANTHROPIC_API_KEY"
      ),

    // ── Resend (SERVER ONLY) ────────────────────────────────────────────

    RESEND_API_KEY:
      requireEnv(
        "RESEND_API_KEY"
      ),

    FROM_EMAIL: optionalEnv(
      "FROM_EMAIL",
      "noreply@spendora.app"
    ),

    // ── App ─────────────────────────────────────────────────────────────

    NEXT_PUBLIC_APP_URL:
      optionalEnv(
        "NEXT_PUBLIC_APP_URL",
        "http://localhost:3000"
      ),

    // ── Runtime ─────────────────────────────────────────────────────────

    NODE_ENV: getNodeEnv(),
  });
}

// ─── Lazy Singleton Cache ──────────────────────────────────────────────────

/**
 * Cached validated env object.
 *
 * Lazy-loaded:
 * prevents Next.js build-time crashes
 * when runtime secrets are absent.
 */
let _env:
  | ReturnType<typeof buildEnv>
  | null = null;

export function getEnv():
  ReturnType<typeof buildEnv> {
  if (!_env) {
    _env = buildEnv();
  }

  return _env;
}

// ─── Proxy Export ──────────────────────────────────────────────────────────

/**
 * Main env export.
 *
 * Usage:
 *   import { env } from "@/lib/env";
 */
export const env = new Proxy(
  {} as ReturnType<
    typeof buildEnv
  >,
  {
    get(
      _target,
      key: PropertyKey
    ) {
      if (
        typeof key !== "string"
      ) {
        return undefined;
      }

      assertServerOnly(key);

      return getEnv()[
        key as keyof ReturnType<
          typeof buildEnv
        >
      ];
    },
  }
);

// ─── Types ─────────────────────────────────────────────────────────────────

export type Env =
  ReturnType<typeof buildEnv>;

// ─── Test Helpers ──────────────────────────────────────────────────────────

/**
 * @internal
 * Test-only helper for Jest isolation.
 */
export function _resetEnvCache(): void {
  _env = null;
}