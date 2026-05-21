import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

import { env } from "./env";

import type { Database } from "./database.types";

export type TypedSupabaseClient =
  SupabaseClient<Database>;

function assertServerOnly(): void {
  if (typeof window !== "undefined") {
    throw new Error(
      "[supabase] Admin client cannot run in browser"
    );
  }
}

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

/**
 * Server-side anon client.
 * Respects RLS.
 */
export function getServerClient():
  TypedSupabaseClient {
  return createClient<Database>(
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

export const db = Object.freeze({
  browser:
    (): TypedSupabaseClient =>
      getBrowserClient(),

  server:
    (): TypedSupabaseClient =>
      getServerClient(),

  admin:
    (): TypedSupabaseClient =>
      getAdminClient(),
});

export const createServerDb =
  getServerClient;

export const createAdminDb =
  getAdminClient;
