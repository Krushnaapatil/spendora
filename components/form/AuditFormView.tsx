"use client";

import {
  formatToolName,
  TOOL_OPTIONS,
  TOOL_PLANS,
} from "@/lib/toolPlans";
import { LOADING_MESSAGES } from "@/lib/auditFormState";
import {
  useAuditFormState,
  type AuditFormProps,
} from "./useAuditFormState";

export default function AuditFormView(props: AuditFormProps = {}) {
  const submitLabel = props.submitLabel ?? "Generate Audit Report";
  const progressHint = props.progressHint ?? "Your progress is automatically saved locally.";

  const {
    mounted,
    formState,
    setFormState,
    isSubmitting,
    error,
    loadingMessageIndex,
    addToolRow,
    removeToolRow,
    updateToolRow,
    handleSubmit,
  } = useAuditFormState(props);

  const { tools, teamSize, useCase } = formState;

  if (!mounted) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-950">Team Information</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-zinc-700">Team Size</label>
            <input type="number" min={1} value={teamSize} onChange={(e) => setFormState((p) => ({ ...p, teamSize: Number(e.target.value) }))} className="mt-3 w-full rounded-2xl border border-zinc-200 bg-[#FAFAF8] px-5 py-4 outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-700">Primary Use Case</label>
            <select value={useCase} onChange={(e) => setFormState((p) => ({ ...p, useCase: e.target.value }))} className="mt-3 w-full rounded-2xl border border-zinc-200 bg-[#FAFAF8] px-5 py-4 outline-none">
              <option value="coding">Coding</option>
              <option value="writing">Writing</option>
              <option value="research">Research</option>
              <option value="data">Data</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950">AI Subscriptions</h2>
          <button type="button" onClick={addToolRow} className="rounded-2xl border border-zinc-200 bg-[#FAFAF8] px-5 py-3 text-sm font-medium">+ Add Tool</button>
        </div>
        <div className="mt-10 space-y-6">
          {tools.map((tool, index) => (
            <div key={index} className="rounded-3xl border border-zinc-200 bg-[#FAFAF8] p-6">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tool #{index + 1}</h3>
                <button type="button" onClick={() => removeToolRow(index)} className="text-sm font-medium text-red-500">Remove</button>
              </div>
              <div className="grid gap-4 lg:grid-cols-4">
                <select value={tool.tool} onChange={(e) => updateToolRow(index, "tool", e.target.value)} className="rounded-2xl border px-4 py-3">
                  {TOOL_OPTIONS.map((o) => <option key={o} value={o}>{formatToolName(o)}</option>)}
                </select>
                <select value={tool.plan} onChange={(e) => updateToolRow(index, "plan", e.target.value)} className="rounded-2xl border px-4 py-3">
                  {TOOL_PLANS[tool.tool].map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <input type="number" min={0} value={tool.spend} onChange={(e) => updateToolRow(index, "spend", Number(e.target.value))} className="rounded-2xl border px-4 py-3" />
                <input type="number" min={1} value={tool.seats} onChange={(e) => updateToolRow(index, "seats", Number(e.target.value))} className="rounded-2xl border px-4 py-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {isSubmitting ? (
          <p className="text-lg text-zinc-700">{LOADING_MESSAGES[loadingMessageIndex]}</p>
        ) : (
          <button type="submit" className="w-full rounded-3xl bg-zinc-950 px-8 py-5 text-lg font-semibold text-white">{submitLabel}</button>
        )}
        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}
        {progressHint ? <p className="text-center text-sm text-zinc-500">{progressHint}</p> : null}
      </div>
    </form>
  );
}
