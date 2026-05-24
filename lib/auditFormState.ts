import {
  TOOL_OPTIONS,
  TOOL_PLANS,
  type ToolName,
} from "@/lib/toolPlans";
import type { ToolInput, UseCase } from "@/lib/types";

export interface AuditFormToolRow {
  tool: ToolName;
  plan: string;
  spend: number;
  seats: number;
}

export interface AuditFormState {
  teamSize: number;
  useCase: string;
  tools: AuditFormToolRow[];
}

export const VALID_USE_CASES = [
  "coding",
  "writing",
  "data",
  "research",
  "mixed",
] as const;

export const STORAGE_KEY = "spendora-audit-form";

export const DEFAULT_AUDIT_FORM_STATE: AuditFormState = {
  teamSize: 5,
  useCase: "coding",
  tools: [
    {
      tool: "chatgpt",
      plan: "plus",
      spend: 20,
      seats: 1,
    },
  ],
};

export const LOADING_MESSAGES = [
  "Analyzing subscriptions...",
  "Checking pricing tiers...",
  "Detecting overlapping tooling...",
  "Calculating optimization opportunities...",
  "Generating executive summary...",
];

export function normalizeToolRow(row: AuditFormToolRow): AuditFormToolRow {
  const allowedPlans = TOOL_PLANS[row.tool] as readonly string[];

  return {
    ...row,
    plan: allowedPlans.includes(row.plan) ? row.plan : allowedPlans[0],
  };
}

export function normalizeUseCase(value: string): string {
  return VALID_USE_CASES.includes(value as (typeof VALID_USE_CASES)[number])
    ? value
    : DEFAULT_AUDIT_FORM_STATE.useCase;
}

export function normalizeTeamSize(value: number | string): number {
  const numeric = typeof value === "number" ? value : Number(value);

  return Number.isFinite(numeric) && numeric > 0
    ? Math.round(numeric)
    : DEFAULT_AUDIT_FORM_STATE.teamSize;
}

export function normalizeFormState(state: AuditFormState): AuditFormState {
  return {
    ...state,
    teamSize: normalizeTeamSize(state.teamSize),
    useCase: normalizeUseCase(state.useCase),
    tools: state.tools.map(normalizeToolRow),
  };
}

export function getStoredFormState(): AuditFormState {
  if (typeof window === "undefined") {
    return DEFAULT_AUDIT_FORM_STATE;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return DEFAULT_AUDIT_FORM_STATE;
    }

    return normalizeFormState(JSON.parse(saved) as AuditFormState);
  } catch {
    return DEFAULT_AUDIT_FORM_STATE;
  }
}

export function toolInputToFormRow(input: ToolInput): AuditFormToolRow {
  const tool = (TOOL_OPTIONS as readonly string[]).includes(input.toolId)
    ? (input.toolId as ToolName)
    : "chatgpt";

  const allowedPlans = TOOL_PLANS[tool] as readonly string[];

  const plan = allowedPlans.includes(input.plan) ? input.plan : allowedPlans[0];

  return {
    tool,
    plan,
    spend: input.monthlySpend,
    seats: input.seats,
  };
}

export function auditInputsToFormState(
  tools: ToolInput[],
  teamSize: number,
  useCase: UseCase
): AuditFormState {
  return {
    teamSize: teamSize > 0 ? teamSize : 1,
    useCase: VALID_USE_CASES.includes(
      useCase as (typeof VALID_USE_CASES)[number]
    )
      ? useCase
      : "mixed",
    tools:
      tools.length > 0
        ? tools.map(toolInputToFormRow)
        : DEFAULT_AUDIT_FORM_STATE.tools,
  };
}
