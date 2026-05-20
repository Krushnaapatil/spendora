/**
 * SCHEMAS — Runtime validation using Zod v4.
 *
 * These schemas validate incoming API request bodies
 * before they reach:
 * - audit engine
 * - database
 * - AI providers
 *
 * Architecture:
 * - types.ts   → compile-time safety
 * - schemas.ts → runtime safety
 */

import { z } from "zod";

// ─── Shared Primitive Schemas ───────────────────────────────────────────────

// Tool IDs
export const toolIdSchema = z.enum([
  "cursor",
  "github-copilot",
  "claude",
  "chatgpt",
  "anthropic-api",
  "openai-api",
  "gemini",
  "windsurf",
]);

// Workflow categories
export const useCaseSchema = z.enum([
  "coding",
  "writing",
  "data",
  "research",
  "mixed",
]);

// Shared money validation
const moneySchema = z
  .number()
  .min(0, "Value cannot be negative");

// Shared positive integer validation
const positiveIntSchema = z
  .number()
  .int("Must be a whole number")
  .positive("Must be greater than 0");

// ─── Tool Input Schema ──────────────────────────────────────────────────────

/**
 * Single tool row submitted from frontend form.
 */
export const toolInputSchema = z
  .object({
    toolId: toolIdSchema,

    plan: z
      .string()
      .trim()
      .min(1, "Plan is required"),

    monthlySpend: moneySchema.max(
      100_000,
      "Monthly spend seems unreasonably high"
    ),

    seats: positiveIntSchema.max(
      10_000,
      "Seat count seems unreasonably high"
    ),
  })
  .strict();

// ─── Audit Request Schema ───────────────────────────────────────────────────

/**
 * POST /api/audit request body
 */
export const auditRequestSchema = z
  .object({
    tools: z
      .array(toolInputSchema)
      .min(1, "Select at least one AI tool")
      .max(20, "Too many tools submitted"),

    teamSize: positiveIntSchema.max(
      100_000,
      "Team size seems unreasonably high"
    ),

    useCase: useCaseSchema,
  })
  .strict();

export type AuditRequestBody = z.infer<
  typeof auditRequestSchema
>;

// ─── Summary Request Schema ────────────────────────────────────────────────

/**
 * POST /api/summary request body
 */
export const summaryRequestSchema = z
  .object({
    auditId: z.uuid({
      message: "Invalid audit ID",
    }),

    totalMonthlySavings:
      moneySchema,

    totalAnnualSavings:
      moneySchema,

    useCase: useCaseSchema,

    teamSize: positiveIntSchema,

    toolCount: positiveIntSchema,
  })
  .strict();

export type SummaryRequestBody = z.infer<
  typeof summaryRequestSchema
>;

// ─── Lead Capture Schema ───────────────────────────────────────────────────

/**
 * POST /api/leads request body
 */
export const leadRequestSchema = z
  .object({
    auditId: z.uuid({
      message: "Invalid audit ID",
    }),

    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Invalid email address"),

    company: z
      .string()
      .trim()
      .max(200)
      .optional(),

    role: z
      .string()
      .trim()
      .max(200)
      .optional(),

    teamSize: positiveIntSchema
      .max(100_000)
      .optional(),

    /**
     * Attribution source:
     * twitter, linkedin, reddit, etc.
     */
    source: z
      .string()
      .trim()
      .max(100)
      .optional(),

    /**
     * Hidden bot-trap field.
     * Humans never fill this.
     * Bots often do.
     */
    honeypot: z
      .literal("")
      .optional(),
  })
  .strict();

export type LeadRequestBody = z.infer<
  typeof leadRequestSchema
>;

// ─── Shared API Error Shape ────────────────────────────────────────────────

export interface ApiError {
  error: string;

  details?: z.ZodIssue[];
}

// ─── Safe Parsing Helper ───────────────────────────────────────────────────

/**
 * Safely parse and validate request bodies.
 *
 * Example:
 *
 * const parsed = safeParseBody(
 *   auditRequestSchema,
 *   await req.json()
 * );
 *
 * if (!parsed.success) {
 *   return errorResponse(parsed.error);
 * }
 */
export function safeParseBody<T>(
  schema: z.ZodSchema<T>,
  body: unknown
) {
  return schema.safeParse(body);
}