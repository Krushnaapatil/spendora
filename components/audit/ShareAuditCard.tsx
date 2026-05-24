"use client";

import { useState, type FormEvent } from "react";

interface ShareAuditCardProps {
  auditId: string;
  shareUrl: string;
  monthlySavings: number;
  annualSavings: number;
  toolCount: number;
  summary?: string | null;
  highSavings?: boolean;
}

export default function ShareAuditCard({
  auditId,
  shareUrl,
  monthlySavings,
  annualSavings,
  toolCount,
  summary,
  highSavings = false,
}: ShareAuditCardProps) {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendMessage, setSendMessage] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  async function nativeShare() {
    if (!navigator.share) {
      return;
    }

    await navigator.share({
      title: "Spendora AI audit",
      text: "Here is the Spendora audit report.",
      url: shareUrl,
    });
  }

  async function sendLeadGate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSendMessage(null);

    if (!email.trim()) {
      setSendMessage("Add an email address first.");
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auditId,
          email: email.trim(),
          company: company.trim() || undefined,
          role: role.trim() || undefined,
          teamSize: teamSize ? Number(teamSize) : undefined,
          source: "audit-report",
          honeypot,
        }),
      });

      const data = (await response.json().catch(() => null)) as
        | {
            error?: string;
          }
        | null;

      if (!response.ok) {
        throw new Error(data?.error ?? "Failed to save lead.");
      }

      setSendMessage(
        highSavings
          ? "Thanks. We'll email your report and reach out about a Credex consultation if there is meaningful upside."
          : "Thanks. We'll email your report and notify you when new optimizations apply."
      );
      setEmail("");
      setCompany("");
      setRole("");
      setTeamSize("");
    } catch (error) {
      setSendMessage(
        error instanceof Error ? error.message : "Failed to save lead."
      );
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="mt-8 rounded-[28px] border border-zinc-200 bg-[linear-gradient(180deg,#fafaf8_0%,#ffffff_100%)] p-6 text-left shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-zinc-500">
        Share this audit with your team
      </p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <div className="text-[11px] uppercase tracking-wide text-zinc-400">
            Monthly savings
          </div>
          <div className="mt-1 text-sm font-semibold text-zinc-900">
            ${monthlySavings.toLocaleString()}/mo
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <div className="text-[11px] uppercase tracking-wide text-zinc-400">
            Annual savings
          </div>
          <div className="mt-1 text-sm font-semibold text-zinc-900">
            ${annualSavings.toLocaleString()}/yr
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
          <div className="text-[11px] uppercase tracking-wide text-zinc-400">
            Tools reviewed
          </div>
          <div className="mt-1 text-sm font-semibold text-zinc-900">
            {toolCount}
          </div>
        </div>
      </div>

      {summary ? (
        <div className="mt-4 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Executive summary
          </p>
          <p className="mt-2 text-sm leading-7 text-zinc-700">{summary}</p>
        </div>
      ) : null}

      <div className="mt-4 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700 shadow-sm">
        {shareUrl}
      </div>

      {highSavings ? (
        <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">
            Spendora CTA
          </p>
          <p className="mt-2 text-sm leading-7 text-amber-900">
            This audit crosses the savings threshold. Capture the report by email and we&apos;ll follow up about a Credex consultation.
          </p>
        </div>
      ) : null}

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyShareLink}
          className="rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-zinc-800"
        >
          {copied ? "Copied" : "Copy Link"}
        </button>

        <button
          type="button"
          onClick={nativeShare}
          className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-100"
        >
          Share via Device
        </button>
      </div>

      <form
        id="lead-gate"
        onSubmit={sendLeadGate}
        className="mt-5 rounded-[28px] border border-zinc-200 bg-white p-5 shadow-sm"
      >
        <label
          htmlFor="share-email"
          className="block text-sm font-semibold text-zinc-900"
        >
          Email the report
        </label>

        <div className="mt-3 grid gap-3">
          <input
            type="text"
            value={honeypot}
            onChange={(event) => {
              setHoneypot(event.target.value);
            }}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              id="share-email"
              type="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSendMessage(null);
              }}
              placeholder="teammate@company.com"
              className="min-w-0 rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
            />

            <input
              type="text"
              value={company}
              onChange={(event) => {
                setCompany(event.target.value);
                setSendMessage(null);
              }}
              placeholder="Company name (optional)"
              className="min-w-0 rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="text"
              value={role}
              onChange={(event) => {
                setRole(event.target.value);
                setSendMessage(null);
              }}
              placeholder="Role (optional)"
              className="min-w-0 rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
            />

            <input
              type="number"
              min={1}
              value={teamSize}
              onChange={(event) => {
                setTeamSize(event.target.value);
                setSendMessage(null);
              }}
              placeholder="Team size (optional)"
              className="min-w-0 rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-400"
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? "Saving..." : "Email Me This Report"}
          </button>
        </div>

        <p className="mt-3 text-sm text-zinc-500">
          We&apos;ll email a full report with the audit link and summary.
        </p>

        {sendMessage ? (
          <p className="mt-3 text-sm font-medium text-zinc-700">
            {sendMessage}
          </p>
        ) : null}
      </form>

      <p className="mt-3 text-sm text-zinc-500">
        Send this link to your team so they can review the full audit.
      </p>
    </div>
  );
}
