"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase-browser";

type Audit = {
  id: string;
  created_at: string | null;
  summary: string | null;
  summary_source: string | null;
  total_monthly_savings: number | null;
  total_annual_savings: number | null;
  tools: unknown[] | null;
};

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value?: string | null) {
  if (!value) {
    return "Unknown date";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function AuditList() {
  const supabase = useMemo(() => createClient(), []);
  const [audits, setAudits] = useState<Audit[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userMissing, setUserMissing] = useState(false);

  useEffect(() => {
    let mounted = true;

    async function loadAudits(userId: string) {
      try {
        const { data, error } = await supabase
          .from("audits")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

        if (!mounted) return;

        if (error) {
          throw error;
        }

        setAudits((data as Audit[]) ?? []);
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : "Failed to load audits.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    async function init() {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (!sessionData?.session) {
          setUserMissing(true);
          setAudits([]);
          setLoading(false);
          return;
        }

        setUserMissing(false);
        await loadAudits(sessionData.session.user.id);
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Failed to load audits.");
          setLoading(false);
        }
      }
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      if (!mounted) return;

      if (!session) {
        setUserMissing(true);
        setAudits([]);
        return;
      }

      setUserMissing(false);
      loadAudits(session.user.id);
    });

    init();

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  if (loading) {
    return (
      <div className="mt-16 rounded-[32px] border border-zinc-200 bg-white p-16 text-center">
        <div className="text-lg font-semibold text-zinc-900">Loading your audits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-16 rounded-[32px] border border-red-200 bg-red-50 p-16 text-center">
        <div className="text-lg font-semibold text-red-800">{error}</div>
      </div>
    );
  }

  if (userMissing) {
    return (
      <div className="mt-16 rounded-[32px] border border-dashed border-zinc-300 bg-white p-16 text-center">
        <h2 className="text-3xl font-bold text-zinc-950">Sign in to see your audits</h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-600">
          Your audits are stored on your account. Log in to view your audit history and saved results.
        </p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login?mode=login&next=/audits"
            className="rounded-2xl bg-zinc-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Sign In
          </Link>

          <Link
            href="/login?mode=signup&next=/audits"
            className="rounded-2xl border border-zinc-200 bg-white px-6 py-4 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
          >
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  if (!audits || audits.length === 0) {
    return (
      <div className="mt-16 rounded-[32px] border border-dashed border-zinc-300 bg-white p-16 text-center">
        <h2 className="text-3xl font-bold text-zinc-950">No audits yet</h2>
        <p className="mx-auto mt-4 max-w-xl text-zinc-600">
          Run your first AI tooling audit to start tracking optimization opportunities and historical savings.
        </p>

        <Link
          href="/audit/new"
          className="mt-8 inline-flex rounded-2xl bg-zinc-950 px-6 py-4 font-semibold text-white transition hover:bg-zinc-800"
        >
          Create First Audit
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-16 grid gap-6">
      {audits.map((audit) => (
        <Link
          key={audit.id}
          href={`/audit/${audit.id}`}
          className="group rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
        >
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                  {formatCurrency(audit.total_annual_savings ?? 0)} annual savings
                </span>

                <span className="rounded-full bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-700">
                  {Array.isArray(audit.tools) ? audit.tools.length : 0} tools
                </span>

                <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                  {audit.summary_source ?? "deterministic"}
                </span>
              </div>

              <h2 className="mt-6 text-3xl font-bold tracking-tight text-zinc-950">
                {formatCurrency(audit.total_monthly_savings ?? 0)}/mo potential savings
              </h2>

              <p className="mt-3 max-w-3xl leading-7 text-zinc-600">
                {audit.summary ?? "No summary available."}
              </p>
            </div>

            <div className="flex flex-col items-start gap-3 lg:items-end">
              <div className="text-sm text-zinc-500">Created {formatDate(audit.created_at)}</div>
              <div className="rounded-2xl border border-zinc-200 px-5 py-3 font-semibold text-zinc-700 transition group-hover:bg-zinc-950 group-hover:text-white">
                Open Audit
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
