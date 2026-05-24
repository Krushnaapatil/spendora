"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { createClient } from "@/lib/supabase-browser";
import { useSession } from "@/components/session/SessionProvider";

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

async function getLeadLinkedAuditIds(
  supabase: ReturnType<typeof createClient>,
  email: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from("leads")
    .select("audit_id")
    .eq("email", email.toLowerCase().trim())
    .not("audit_id", "is", null);

  if (error || !data) {
    return [];
  }

  return data
    .map((lead) => lead.audit_id)
    .filter((auditId): auditId is string => Boolean(auditId));
}

async function getAuditsByIds(
  supabase: ReturnType<typeof createClient>,
  auditIds: string[]
) {
  if (auditIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("audits")
    .select(
      "id,created_at,summary,summary_source,total_monthly_savings,total_annual_savings,tools"
    )
    .in("id", auditIds)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data as Audit[]) ?? [];
}

export default function AuditList() {
  const supabase = useMemo(() => createClient(), []);
  const { session } = useSession();

  const [audits, setAudits] = useState<Audit[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userMissing, setUserMissing] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"newest" | "oldest">("newest");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setHydrated(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadAudits() {
      if (!session?.user) {
        if (!mounted) return;
        setUserMissing(true);
        setAudits([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setUserMissing(false);

        const directAuditsPromise = supabase
          .from("audits")
          .select(
            "id,created_at,summary,summary_source,total_monthly_savings,total_annual_savings,tools"
          )
          .eq("user_id", session.user.id)
          .order("created_at", { ascending: false });

        const linkedAuditIdsPromise = session.user.email
          ? getLeadLinkedAuditIds(supabase, session.user.email)
          : Promise.resolve([]);

        const [directAuditsResult, linkedAuditIds] = await Promise.all([
          directAuditsPromise,
          linkedAuditIdsPromise,
        ]);

        if (!mounted) return;

        if (directAuditsResult.error) {
          throw directAuditsResult.error;
        }

        const linkedAudits = await getAuditsByIds(
          supabase,
          linkedAuditIds
        );

        if (!mounted) return;

        const merged = Array.from(
          new Map(
            [
              ...((directAuditsResult.data as Audit[]) ?? []),
              ...linkedAudits,
            ].map((audit) => [audit.id, audit])
          ).values()
        );

        setAudits(merged);
      } catch (err) {
        if (!mounted) return;
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load audits."
        );
      } finally {
        if (mounted) setLoading(false);
      }
    }

    if (hydrated) {
      void loadAudits();
    }

    return () => {
      mounted = false;
    };
  }, [hydrated, session, supabase]);

  const displayedAudits = useMemo(() => {
    if (!audits) return [];

    let list = audits.slice();

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((a) => {
        return (
          (a.summary || "").toLowerCase().includes(q) ||
          (a.summary_source || "").toLowerCase().includes(q)
        );
      });
    }

    list.sort((a, b) => {
      const ta = new Date(a.created_at || 0).getTime();
      const tb = new Date(b.created_at || 0).getTime();
      return sort === "newest" ? tb - ta : ta - tb;
    });

    return list;
  }, [audits, query, sort]);

  if (!hydrated || loading) {
    return (
      <div className="mt-16 rounded-[32px] border border-zinc-200 bg-white p-16 text-center">
        <div className="text-lg font-semibold text-zinc-900">
          Loading your audits...
        </div>
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
        <h2 className="text-3xl font-bold text-zinc-950">
          Sign in to see your audits
        </h2>
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
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <input
            placeholder="Search audits or summary..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <label className="text-sm text-zinc-600">Sort</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "newest" | "oldest")}
            className="rounded-xl border px-3 py-2 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {displayedAudits.map((audit) => (
        <div
          key={audit.id}
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
              <div className="flex gap-2">
                <Link
                  href={`/audit/${audit.id}/edit`}
                  className="rounded-2xl border border-zinc-200 px-5 py-3 font-semibold text-zinc-700 hover:bg-zinc-100"
                >
                  Edit &amp; Rerun
                </Link>

                <Link
                  href={`/audit/${audit.id}`}
                  className="rounded-2xl border border-zinc-200 px-5 py-3 font-semibold text-zinc-700 transition group-hover:bg-zinc-950 group-hover:text-white"
                >
                  Open Audit
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
