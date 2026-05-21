// ─── Tool & Plan IDs ────────────────────────────────────────────────────────

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

// Plans per tool — used as dropdown values in the form
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

// ─── Input Models ───────────────────────────────────────────────────────────

export interface ToolInput {
  toolId: ToolId;
  plan: AnyPlan;
  monthlySpend: number; // actual amount user currently pays
  seats: number;
}

export interface AuditInput {
  tools: ToolInput[];
  teamSize: number;
  useCase: UseCase;
}

// ─── Audit Engine Output ────────────────────────────────────────────────────

export type RecommendationAction =
  | "downgrade" // cheaper plan, same vendor
  | "switch" // different tool recommendation
  | "credits" // Spendora discounted credits opportunity
  | "optimal"; // already efficiently configured

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

  // used for cross-tool replacement suggestions
  targetToolId?: ToolId;

  // used for downgrade recommendations
  targetPlan?: AnyPlan;

  monthlySavings: number;

  // confidence level of recommendation quality
  confidence?: RecommendationConfidence;

  // short finance-friendly explanation
  reason: string;
}

export interface ToolAuditResult {
  toolId: ToolId;
  currentSpend: number;
  recommendation: Recommendation;
}

export interface AuditResult {
  id?: string; // UUID after Supabase persistence

  tools: ToolAuditResult[];

  totalMonthlySavings: number;

  totalAnnualSavings: number;

  // added asynchronously after AI summary generation
  aiSummary?: string;

  summarySource?: SummarySource;

  createdAt?: string;
}

// ─── Supabase Persistence Shapes ────────────────────────────────────────────

export interface AuditRow {
  id: string;

  created_at: string;

  tools_data: ToolInput[];

  results: ToolAuditResult[];

  total_monthly_savings: number;

  total_annual_savings: number;

  use_case: UseCase;

  team_size: number;
}

export interface LeadRow {
  id: string;

  created_at: string;

  audit_id: string;

  email: string;

  company?: string;

  role?: string;

  team_size?: number;

  // attribution tracking
  source?: string;
}

// ─── API Request / Response Contracts ───────────────────────────────────────

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

  // attribution source (twitter, linkedin, reddit, etc.)
  source?: string;

  // hidden bot-trap field — must remain empty
  honeypot?: string;
}

export interface LeadApiResponse {
  success: boolean;
}