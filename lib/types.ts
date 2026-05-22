import type { Json } from "./database.types";

// Tool & Plan IDs
export type ToolId =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type UseCase =
  | "coding"
  | "writing"
  | "data"
  | "research"
  | "mixed";

export type CursorPlan =
  | "hobby"
  | "pro"
  | "business"
  | "enterprise";

export type CopilotPlan =
  | "individual"
  | "business"
  | "enterprise";

export type ClaudePlan =
  | "free"
  | "pro"
  | "max"
  | "team"
  | "enterprise"
  | "api";

export type ChatGPTPlan =
  | "plus"
  | "team"
  | "enterprise"
  | "api";

export type AnthropicApiPlan = "api";

export type OpenAiApiPlan = "api";

export type GeminiPlan =
  | "pro"
  | "ultra"
  | "api";

export type WindsurfPlan =
  | "free"
  | "pro"
  | "team";

export type AnyPlan =
  | CursorPlan
  | CopilotPlan
  | ClaudePlan
  | ChatGPTPlan
  | AnthropicApiPlan
  | OpenAiApiPlan
  | GeminiPlan
  | WindsurfPlan;

export interface ToolInput {
  toolId: ToolId;
  plan: AnyPlan;
  monthlySpend: number;
  seats: number;
}

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCase;
}

export type RecommendationAction =
  | "downgrade"
  | "switch"
  | "credits"
  | "optimal";

export type RecommendationConfidence =
  | "high"
  | "medium"
  | "low";

export type SummarySource =
  | "primary"
  | "fallback-model"
  | "deterministic";

export interface Recommendation {
  action: RecommendationAction;
  targetToolId?: ToolId;
  targetPlan?: AnyPlan;
  monthlySavings: number;
  confidence?: RecommendationConfidence;
  reason: string;
}

export interface ToolAuditResult {
  toolId: ToolId;
  currentSpend: number;
  recommendation: Recommendation;
}

export interface AuditResult {
  id?: string;
  tools: ToolAuditResult[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  aiSummary?: string;
  summarySource?: SummarySource;
  createdAt?: string;
}

export interface AuditRow {
  id: string;
  tools: Json;
  total_savings: number | null;
  summary: string | null;
  created_at: string | null;
  ai_summary: string | null;
  total_monthly_savings: number | null;
  total_annual_savings: number | null;
  results: Json | null;
  use_case: UseCase | null;
  team_size: number | null;
}

export interface LeadRow {
  id: string;
  email: string | null;
  company: string | null;
  role: string | null;
  team_size: number | null;
  created_at: string;
  source: string | null;
}

export interface AuditApiResponse {
  auditId: string;
  result: AuditResult;
}

export interface SummaryApiResponse {
  summary: string;
  source: SummarySource;
}

export interface LeadApiRequest {
  auditId: string;
  email: string;
  company?: string;
  role?: string;
  teamSize?: number;
  source?: string;
  honeypot?: string;
}

export interface LeadApiResponse {
  success: boolean;
  emailSent: boolean;
}
