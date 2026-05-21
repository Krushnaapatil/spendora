/**
 * SCHEMAS — Runtime validation using Zod v4.
 *
 * Architecture:
 * - types.ts   → compile-time contracts
 * - schemas.ts → runtime validation
 *
 * API routes validate all external input here
 * BEFORE:
 * - audit engine
 * - database
 * - AI providers
 */

import { z } from "zod";

import type {
  AnyPlan,
  AuditInput,
  ToolInput,
} from "./types";

// ─── Shared Primitive Schemas ─────────────────────────────────────────────

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

// All supported plans
export const anyPlanSchema =
  z.enum([
    "hobby",
    "pro",
    "business",
    "enterprise",
    "individual",
    "free",
    "plus",
    "team",
    "max",
    "api",
    "ultra",
  ]) satisfies z.ZodType<AnyPlan>;

// Shared currency validation
const moneySchema = z
  .number()
  .min(
    0,
    "Value cannot be negative"
  );

// Shared positive integer validation
const positiveIntSchema = z
  .number()
  .int(
    "Must be a whole number"
  )
  .positive(
    "Must be greater than 0"
  );

// ─── Tool Input Schema ────────────────────────────────────────────────────

/**
 * Single tool row submitted from frontend form.
 */
export const toolInputSchema:
  z.ZodType<ToolInput> =
  z
    .object({
      toolId:
        toolIdSchema,

      plan:
        anyPlanSchema,

      monthlySpend:
        moneySchema.max(
          100_000,
          "Monthly spend seems unreasonably high"
        ),

      seats:
        positiveIntSchema.max(
          10_000,
          "Seat count seems unreasonably high"
        ),
    })
    .strict();

// ─── Audit Request Schema ─────────────────────────────────────────────────

/**
 * POST /api/audit request body
 */
export const auditRequestSchema:
  z.ZodType<AuditInput> =
  z
    .object({
      tools: z
        .array(
          toolInputSchema
        )
        .min(
          1,
          "Select at least one AI tool"
        )
        .max(
          20,
          "Too many tools submitted"
        ),

      teamSize:
        positiveIntSchema.max(
          100_000,
          "Team size seems unreasonably high"
        ),

      useCase:
        useCaseSchema,
    })
    .strict();

export type AuditRequestBody =
  z.infer<
    typeof auditRequestSchema
  >;

// ─── Summary Request Schema ──────────────────────────────────────────────

/**
 * POST /api/summary request body
 */
export const summaryRequestSchema =
  z
    .object({
      auditId: z.uuid({
        message:
          "Invalid audit ID",
      }),

      totalMonthlySavings:
        moneySchema,

      totalAnnualSavings:
        moneySchema,

      useCase:
        useCaseSchema,

      teamSize:
        positiveIntSchema,

      toolCount:
        positiveIntSchema,
    })
    .strict();

export type SummaryRequestBody =
  z.infer<
    typeof summaryRequestSchema
  >;

// ─── Lead Capture Schema ─────────────────────────────────────────────────

/**
 * POST /api/leads request body
 */
export const leadRequestSchema =
  z
    .object({
      auditId: z.uuid({
        message:
          "Invalid audit ID",
      }),

      email: z
        .string()
        .trim()
        .toLowerCase()
        .email(
          "Invalid email address"
        ),

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

      teamSize:
        positiveIntSchema
          .max(100_000)
          .optional(),

      /**
       * Attribution source
       * e.g. twitter, linkedin, reddit
       */
      source: z
        .string()
        .trim()
        .max(100)
        .optional(),

      /**
       * Hidden bot-trap field.
       * Humans never fill this.
       */
      honeypot: z
        .literal("")
        .optional(),
    })
    .strict();

export type LeadRequestBody =
  z.infer<
    typeof leadRequestSchema
  >;

// ─── Shared API Error Shape ──────────────────────────────────────────────

export interface ApiError {
  error: string;

  details?: z.ZodIssue[];
}

// ─── Safe Parse Helper ───────────────────────────────────────────────────

/**
 * Safely validate request bodies.
 *
 * Example:
 *
 * const parsed = safeParseBody(
 *   auditRequestSchema,
 *   body
 * );
 */
export function safeParseBody<T>(
  schema: z.ZodType<T>,
  body: unknown
) {
  return schema.safeParse(body);
}