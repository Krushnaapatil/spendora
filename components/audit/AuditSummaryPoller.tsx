"use client";

import { useEffect, useState } from "react";

import type { SummarySource } from "@/lib/types";

interface AuditSummaryPollerProps {
  auditId: string;
  initialSummary: string | null;
  initialSource: SummarySource | null;
}

const POLL_INTERVAL_MS = 2500;
const MAX_POLLS = 24;

export default function AuditSummaryPoller({
  auditId,
  initialSummary,
  initialSource,
}: AuditSummaryPollerProps) {
  const [summary, setSummary] = useState(initialSummary);
  const [source, setSource] = useState<SummarySource | null>(
    initialSource
  );

  useEffect(() => {
    if (source && source !== "deterministic") {
      return;
    }

    let polls = 0;
    let cancelled = false;

    async function poll() {
      while (polls < MAX_POLLS && !cancelled) {
        await new Promise((resolve) => {
          setTimeout(resolve, POLL_INTERVAL_MS);
        });

        if (cancelled) {
          return;
        }

        polls += 1;

        try {
          const response = await fetch(
            `/api/audit/${auditId}/summary`
          );

          if (!response.ok) {
            continue;
          }

          const data = (await response.json()) as {
            summary?: string;
            source?: SummarySource;
          };

          if (
            data.summary &&
            data.source &&
            data.source !== "deterministic"
          ) {
            setSummary(data.summary);
            setSource(data.source);
            return;
          }
        } catch {
          // keep polling until max attempts
        }
      }
    }

    void poll();

    return () => {
      cancelled = true;
    };
  }, [auditId, source]);

  if (!summary) {
    return (
      <p className="mt-6 text-lg leading-8 text-zinc-600">
        Generating executive summary…
      </p>
    );
  }

  return (
    <div>
      <p className="mt-6 text-lg leading-8 text-zinc-700">
        {summary}
      </p>
      {source && source !== "deterministic" ? (
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-zinc-400">
          AI summary · {source}
        </p>
      ) : source === "deterministic" ? (
        <p className="mt-3 text-xs text-zinc-400">
          Showing baseline summary while AI finishes…
        </p>
      ) : null}
    </div>
  );
}
