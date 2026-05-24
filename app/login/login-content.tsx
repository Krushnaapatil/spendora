"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { linkAuditWithRetry } from "@/lib/utils";

type AuthMode = "login" | "signup";

interface LoginContentProps {
  initialMode?: AuthMode;
  auditId?: string;
  redirectTo?: string;
}

export default function LoginContent({
  initialMode = "login",
  auditId = "",
  redirectTo = "/audits",
}: LoginContentProps) {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<AuthMode>(
    initialMode
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [linkFailed, setLinkFailed] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [linking, setLinking] = useState(false);

  async function waitForSession(
    maxAttempts = 10,
    delayMs = 150
  ) {
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const sessionResult = await supabase.auth.getSession();
      const session = sessionResult.data.session;

      if (session) {
        return session;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    return null;
  }

  async function handleAuth(
    event?: FormEvent<HTMLFormElement>
  ) {
    event?.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      if (!email || !password) throw new Error("Please complete all fields.");
      if (password.length < 6) throw new Error("Password must contain at least 6 characters.");

      if (mode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const session = data.session ?? (await waitForSession());
        if (!session) throw new Error("Login succeeded but auth session could not be established. Please refresh and try again.");

        if (auditId) {
          // store token so user can retry manually if needed
          setAccessToken(session.access_token);
          const ok = await linkAuditWithRetry(auditId, session.access_token, { retries: 6, initialDelayMs: 200 });
          if (!ok) {
            setLinkFailed(true);
            setLinkError("Failed to link audit after login. You can retry manually.");
            setSuccess("Signed in. Audit not linked.");
              // report telemetry about client-side persistent failure
              try {
                fetch("/api/telemetry", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ event: "audit_link_client_failure", details: { auditId } }),
                });
              } catch {}
            setLoading(false);
            return;
          }
        }

        setSuccess("Successfully signed in. Redirecting...");
        setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, 1200);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        const session = data.session ?? (await waitForSession(8, 200));

        if (!session) {
          setSuccess("Account created. Please confirm your email before signing in.");
          setLoading(false);
          return;
        }

        if (auditId) {
          setAccessToken(session.access_token);
          const ok = await linkAuditWithRetry(auditId, session.access_token, { retries: 6, initialDelayMs: 200 });
          if (!ok) {
            setLinkFailed(true);
            setLinkError("Failed to link audit after signup. You can retry manually.");
            setSuccess("Account created. Audit not linked.");
            try {
              fetch("/api/telemetry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ event: "audit_link_client_failure", details: { auditId } }),
              });
            } catch {}
            setLoading(false);
            return;
          }
        }

        setSuccess("Account created successfully. Redirecting...");
        setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, 1200);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  async function retryLink() {
    if (!auditId || !accessToken) return;

    try {
      setLinking(true);
      setLinkError(null);
      const ok = await linkAuditWithRetry(auditId, accessToken, { retries: 6, initialDelayMs: 200 });
      if (!ok) {
        setLinkError("Retry failed. Please try again later.");
        setLinkFailed(true);
        try {
          fetch("/api/telemetry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "audit_link_retry_failed", details: { auditId } }),
          });
        } catch {}
        return;
      }

      // success — redirect to audits dashboard
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      setLinkError(err instanceof Error ? err.message : "Retry failed");
      setLinkFailed(true);
    } finally {
      setLinking(false);
    }
  }

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="text-xl font-semibold tracking-tight text-zinc-900">Spendora</span>
        </div>

        {/* Card */}
        <div className="border border-zinc-200 rounded-2xl p-8 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.06)]">

          {/* Heading */}
          <h1 className="text-[22px] font-semibold text-zinc-900 tracking-tight mb-1">
            {mode === "login" ? "Sign in" : "Create account"}
          </h1>
          <p className="text-sm text-zinc-500 mb-6">
            {mode === "login"
              ? "Access your audits and reports."
              : "Start auditing your AI costs."}
          </p>

          {/* Tab toggle */}
          <div className="flex bg-zinc-100 rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => { setMode("login"); setError(""); setSuccess(""); }}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
                mode === "login" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setError(""); setSuccess(""); }}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
                mode === "signup" ? "bg-white text-zinc-900 shadow-sm" : "text-zinc-500"
              }`}
            >
              Sign up
            </button>
          </div>

          {/* Fields */}
          <form className="space-y-3" onSubmit={handleAuth}>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-900/5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition focus:border-zinc-400 focus:bg-white focus:ring-2 focus:ring-zinc-900/5"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Success */}
            {success && (
              <p className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </p>
            )}

            {/* Link failure UI */}
            {linkFailed && (
              <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                <div className="mb-2">{linkError ?? "Failed to link audit."}</div>
                <div className="flex gap-2">
                  <button onClick={retryLink} disabled={linking} className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                    {linking ? "Retrying..." : "Retry linking audit"}
                  </button>

                  <button onClick={() => { router.push(redirectTo); router.refresh(); }} className="rounded-xl border border-zinc-200 px-4 py-2 text-sm font-medium">
                    Continue without linking
                  </button>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-zinc-900 text-white text-sm font-semibold py-3 mt-1 flex items-center justify-center gap-2 transition hover:bg-zinc-700 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Processing...
                </>
              ) : mode === "login" ? "Sign in" : "Create account"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-zinc-400 mt-5">
          Secured by Supabase Auth
        </p>
      </div>
    </main>
  );
}
