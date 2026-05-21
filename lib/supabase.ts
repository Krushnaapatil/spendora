import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

import { env } from "./env";

import type {
  AuditRow,
  LeadRow,
} from "./types";

// ─── Database Types ────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      audits: {
        Row: AuditRow;

        Insert: Omit<
          AuditRow,
          "id" | "created_at"
        >;
      };

      leads: {
        Row: LeadRow;
        created_from_ip?: string;
        Insert: Omit<
          LeadRow,
          "id" | "created_at"
        >;
      };
    };
  };
}

export type TypedSupabaseClient =
  SupabaseClient;

// ─── Runtime Guards ────────────────────────────────────────────────────────

function assertServerOnly(): void {
  if (
    typeof window !==
    "undefined"
  ) {
    throw new Error(
      "[supabase] Admin client cannot run in browser"
    );
  }
}

// ─── Browser Client ────────────────────────────────────────────────────────

let _browserClient:
  | TypedSupabaseClient
  | null = null;

/**
 * Safe browser client.
 * Uses anon key + RLS.
 */
export function getBrowserClient():
  TypedSupabaseClient {
  if (!_browserClient) {
    _browserClient =
      createClient<Database>(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
          },
        }
      );
  }

  return _browserClient;
}

// ─── Server Client ─────────────────────────────────────────────────────────

/**
 * Server-side anon client.
 * Respects RLS.
 */
export function getServerClient():
  TypedSupabaseClient {
  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}

// ─── Admin Client ──────────────────────────────────────────────────────────

let _adminClient:
  | TypedSupabaseClient
  | null = null;

/**
 * Privileged server-only client.
 * Bypasses RLS.
 */
export function getAdminClient():
  TypedSupabaseClient {
  assertServerOnly();

  if (!_adminClient) {
    _adminClient =
      createClient<Database>(
        env.NEXT_PUBLIC_SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY,
        {
          auth: {
            persistSession: false,
            autoRefreshToken: false,
          },
        }
      );
  }

  return _adminClient;
}

// ─── Convenience Exports ───────────────────────────────────────────────────

export const db = Object.freeze({
  browser: () =>
    getBrowserClient(),

  server: () =>
    getServerClient(),

  admin: () =>
    getAdminClient(),
});

// ─── Aliases ───────────────────────────────────────────────────────────────

export const createServerDb =
  getServerClient;

export const createAdminDb =
  getAdminClient;