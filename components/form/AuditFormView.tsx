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
      <div className="rounded-[32px] border border-zinc-200 bg-white/80 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-md">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-950">Team Information</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
          Tell us how many people are on the team, what the main use case is, and which AI subscriptions you pay for.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <label htmlFor="team-size" className="text-sm font-medium text-zinc-700">Team Size</label>
            <p className="mt-1 text-xs text-zinc-500">Total people using AI tools across the team.</p>
            <input
              id="team-size"
              type="number"
              min={1}
              value={teamSize}
              onChange={(e) => setFormState((p) => ({ ...p, teamSize: Number(e.target.value) }))}
              className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 outline-none transition focus:border-zinc-400 focus:bg-white"
            />
          </div>
          <div>
            <label htmlFor="primary-use-case" className="text-sm font-medium text-zinc-700">Primary Use Case</label>
            <p className="mt-1 text-xs text-zinc-500">Choose the main way your team uses these tools.</p>
            <select
              id="primary-use-case"
              value={useCase}
              onChange={(e) => setFormState((p) => ({ ...p, useCase: e.target.value }))}
              className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-5 py-4 outline-none transition focus:border-zinc-400 focus:bg-white"
            >
              <option value="coding">Coding</option>
              <option value="writing">Writing</option>
              <option value="research">Research</option>
              <option value="data">Data</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-[32px] border border-zinc-200 bg-white/80 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950">AI Subscriptions</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              For each tool, choose the vendor, plan, monthly spend, and number of seats.
            </p>
          </div>
          <button type="button" onClick={addToolRow} className="rounded-2xl border border-zinc-200 bg-white px-5 py-3 text-sm font-medium transition hover:bg-zinc-50">+ Add Tool</button>
        </div>
        <div className="mt-10 space-y-6">
          {tools.map((tool, index) => (
            <div key={index} className="rounded-3xl border border-zinc-200 bg-white/75 p-6 backdrop-blur-md">
              <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-semibold">Tool #{index + 1}</h3>
                <button type="button" onClick={() => removeToolRow(index)} className="text-sm font-medium text-red-500">Remove</button>
              </div>
              <div className="grid gap-4 lg:grid-cols-4">
                <div>
                  <label htmlFor={`tool-${index}-name`} className="text-sm font-medium text-zinc-700">Tool</label>
                  <p className="mt-1 text-xs text-zinc-500">Which AI product are you paying for?</p>
                  <select id={`tool-${index}-name`} value={tool.tool} onChange={(e) => updateToolRow(index, "tool", e.target.value)} className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 outline-none transition focus:border-zinc-400">
                    {TOOL_OPTIONS.map((o) => <option key={o} value={o}>{formatToolName(o)}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor={`tool-${index}-plan`} className="text-sm font-medium text-zinc-700">Plan</label>
                  <p className="mt-1 text-xs text-zinc-500">Select the subscription tier or API plan.</p>
                  <select id={`tool-${index}-plan`} value={tool.plan} onChange={(e) => updateToolRow(index, "plan", e.target.value)} className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 outline-none transition focus:border-zinc-400">
                    {TOOL_PLANS[tool.tool].map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label htmlFor={`tool-${index}-spend`} className="text-sm font-medium text-zinc-700">Monthly Spend</label>
                  <p className="mt-1 text-xs text-zinc-500">Approximate monthly cost for this tool.</p>
                  <input id={`tool-${index}-spend`} type="number" min={0} value={tool.spend} onChange={(e) => updateToolRow(index, "spend", Number(e.target.value))} className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 outline-none transition focus:border-zinc-400" />
                </div>

                <div>
                  <label htmlFor={`tool-${index}-seats`} className="text-sm font-medium text-zinc-700">Seats</label>
                  <p className="mt-1 text-xs text-zinc-500">How many people are actively using it?</p>
                  <input id={`tool-${index}-seats`} type="number" min={1} value={tool.seats} onChange={(e) => updateToolRow(index, "seats", Number(e.target.value))} className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 outline-none transition focus:border-zinc-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        {isSubmitting ? (
          <div className="rounded-[32px] border border-zinc-200 bg-white/80 p-8 shadow-[0_18px_60px_rgba(15,23,42,0.06)] backdrop-blur-md">
            <p className="text-lg text-zinc-700">{LOADING_MESSAGES[loadingMessageIndex]}</p>
          </div>
        ) : (
          <button type="submit" className="w-full rounded-3xl bg-zinc-950 px-8 py-5 text-lg font-semibold text-white transition hover:bg-zinc-800">{submitLabel}</button>
        )}
        {error ? <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">{error}</div> : null}
        {progressHint ? <p className="text-center text-sm text-zinc-500">{progressHint}</p> : null}
      </div>
    </form>
  );
}
