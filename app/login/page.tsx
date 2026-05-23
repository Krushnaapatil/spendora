"use client";

import { useState } from "react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { createClient } from "@/lib/supabase-browser";

type AuthMode =
  | "login"
  | "signup";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const supabase =
    createClient();

  const [mode, setMode] =
    useState<AuthMode>(
      searchParams.get("mode") === "signup"
        ? "signup"
        : "login"
    );

  const [email, setEmail] =
    useState("");

  const [auditId] = useState(
    searchParams.get("auditId") ?? ""
  );

  const [redirectTo] = useState(
    searchParams.get("next") ?? "/audits"
  );

  const [
    password,
    setPassword,
  ] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  async function handleAuth() {
    try {
      setLoading(true);

      setError("");

      setSuccess("");

      if (
        !email ||
        !password
      ) {
        throw new Error(
          "Please complete all fields."
        );
      }

      if (
        password.length <
        6
      ) {
        throw new Error(
          "Password must contain at least 6 characters."
        );
      }

      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        const sessionResult = await supabase.auth.getSession();
        const session = sessionResult.data.session;

        if (!session) {
          throw new Error(
            "Login succeeded but auth session could not be established. Please refresh and try again."
          );
        }

        if (auditId) {
          const accessToken = session.access_token;

          const response = await fetch("/api/audit/link", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              auditId,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to link audit after login.");
          }
        }

        setSuccess("Successfully signed in. Redirecting...");

        setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, 1200);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          throw error;
        }

        const sessionResult = await supabase.auth.getSession();
        const session = sessionResult.data.session;

        if (!session) {
          setSuccess(
            "Account created. Please confirm your email before signing in."
          );
          setLoading(false);
          return;
        }

        if (auditId) {
          const accessToken = session.access_token;

          const response = await fetch("/api/audit/link", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
              auditId,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText || "Failed to link audit after signup.");
          }
        }

        setSuccess("Account created successfully. Redirecting...");

        setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, 1200);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Authentication failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF8] px-6 py-20">
      <div className="mx-auto max-w-md">
        {/* Top Badge */}

        <div className="mb-6 inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm">
          Spendora Account
        </div>

        {/* Card */}

        <div className="rounded-[32px] border border-zinc-200 bg-white p-10 shadow-sm">
          {/* Header */}

          <div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-950">
              {mode ===
              "login"
                ? "Welcome back"
                : "Create your account"}
            </h1>

            <p className="mt-3 text-zinc-600">
              {mode ===
              "login"
                ? "Access your saved audits, reports, and optimization history."
                : "Save audits permanently and track historical AI spend over time."}
            </p>
          </div>

          {/* Mode Toggle */}

          <div className="mt-8 grid grid-cols-2 rounded-2xl bg-zinc-100 p-1">
            <button
              onClick={() => {
                setMode(
                  "login"
                );

                setError(
                  ""
                );

                setSuccess(
                  ""
                );
              }}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                mode ===
                "login"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-500"
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => {
                setMode(
                  "signup"
                );

                setError(
                  ""
                );

                setSuccess(
                  ""
                );
              }}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                mode ===
                "signup"
                  ? "bg-white text-zinc-950 shadow-sm"
                  : "text-zinc-500"
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}

          <div className="mt-10 space-y-5">
            {/* Email */}

            <div>
              <label className="text-sm font-medium text-zinc-700">
                Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(
                  e
                ) =>
                  setEmail(
                    e.target
                      .value
                  )
                }
                placeholder="founder@company.com"
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-[#FAFAF8] px-5 py-4 outline-none transition focus:border-zinc-400"
              />
            </div>

            {/* Password */}

            <div>
              <label className="text-sm font-medium text-zinc-700">
                Password
              </label>

              <input
                type="password"
                value={
                  password
                }
                onChange={(
                  e
                ) =>
                  setPassword(
                    e.target
                      .value
                  )
                }
                placeholder="Minimum 6 characters"
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-[#FAFAF8] px-5 py-4 outline-none transition focus:border-zinc-400"
              />
            </div>

            {/* Error */}

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {/* Success */}

            {success ? (
              <div className="rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {success}
              </div>
            ) : null}

            {/* CTA */}

            <button
              onClick={
                handleAuth
              }
              disabled={
                loading
              }
              className="flex w-full items-center justify-center gap-3 rounded-2xl bg-zinc-950 px-5 py-4 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                  Processing...
                </>
              ) : mode ===
                "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </div>

          {/* Footer */}

          <div className="mt-8 border-t border-zinc-100 pt-6 text-sm text-zinc-500">
            Secure authentication powered by Supabase Auth.
          </div>
        </div>
      </div>
    </main>
  );
}