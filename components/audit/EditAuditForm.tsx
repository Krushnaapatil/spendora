"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function EditAuditForm({ initialTools, initialTeamSize }: { initialTools: any[]; initialTeamSize: number; }) {
  const router = useRouter();
  const supabase = createClient();

  const [toolsJson, setToolsJson] = useState(JSON.stringify(initialTools, null, 2));
  const [teamSize, setTeamSize] = useState(initialTeamSize ?? 1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const tools = JSON.parse(toolsJson);

      const body = {
        teamSize,
        tools,
      };

      // Ensure session is attached via cookie; createClient handles storage.
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to run audit');
      }

      const data = await res.json();
      const newId = data.auditId;

      router.push(`/audit/${newId}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run audit');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">Team size</label>
        <input type="number" min={1} value={teamSize} onChange={(e) => setTeamSize(Number(e.target.value))} className="mt-1 w-40 rounded-xl border px-3 py-2" />
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">Tools (JSON)</label>
        <textarea value={toolsJson} onChange={(e) => setToolsJson(e.target.value)} rows={12} className="mt-1 w-full rounded-xl border p-3 font-mono text-sm" />
        <p className="mt-2 text-xs text-zinc-500">Edit the tools JSON (toolId, seats, monthlySpend, planId). Invalid JSON will cause an error.</p>
      </div>

      {error ? <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div> : null}

      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="rounded-xl bg-zinc-950 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {loading ? 'Running...' : 'Rerun Audit'}
        </button>

        <button type="button" onClick={() => router.push('/audits')} className="rounded-xl border border-zinc-200 px-6 py-3 text-sm font-medium">
          Cancel
        </button>
      </div>
    </form>
  );
}
