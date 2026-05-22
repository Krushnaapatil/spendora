/**
 * lib/ai.ts
 *
 * AI orchestration layer.
 *
 * Responsibilities:
 * - build prompts
 * - call OpenRouter
 * - handle model fallbacks
 * - sanitize AI responses
 * - generate deterministic fallback summaries
 *
 * IMPORTANT:
 * AI NEVER calculates savings.
 * The audit engine remains the source of truth.
 */

import { env } from "@/lib/env";

import type {
  AuditResult,
  SummarySource,
} from "@/lib/types";

// ─── Constants ─────────────────────────────────────────────────────────────

const OPENROUTER_URL =
  "https://openrouter.ai/api/v1/chat/completions";

const MAX_SUMMARY_LENGTH =
  700;

// ─── Prompt Builder ───────────────────────────────────────────────────────

/**
 * Converts structured audit results
 * into an executive-friendly AI prompt.
 */
export function buildAuditPrompt(
  result: AuditResult
): string {
  const recommendations =
    result.tools
      .map(
        (tool) =>
          `- ${tool.toolId}: ${tool.recommendation.reason}`
      )
      .join("\n");

  return `
You are an AI finance operations assistant.

Your task:
Write a concise executive summary for an AI tooling audit.

Requirements:
- Maximum 100 words
- Executive-friendly tone
- Mention estimated savings
- Mention inefficiencies briefly
- Mention optimization opportunities
- Be actionable and concise
- NEVER invent numbers
- NEVER change calculations
- NEVER hallucinate pricing

Audit Metrics:
- Monthly Savings: $${result.totalMonthlySavings}
- Annual Savings: $${result.totalAnnualSavings}
- Audited Tools: ${result.tools.length}

Recommendations:
${recommendations}

Return ONLY the summary paragraph.
`.trim();
}

// ─── OpenRouter Call ──────────────────────────────────────────────────────

async function callModel(
  model: string,
  prompt: string
): Promise<string> {
  const response =
    await fetch(
      OPENROUTER_URL,
      {
        method: "POST",

        headers: {
          Authorization:
            `Bearer ${env.OPENROUTER_API_KEY}`,

          "Content-Type":
            "application/json",

          "HTTP-Referer":
            env.NEXT_PUBLIC_APP_URL,

          "X-Title":
            "Spendora",
        },

        body: JSON.stringify({
          model,

          messages: [
            {
              role: "system",

              content:
                "You are a concise SaaS finance optimization assistant.",
            },

            {
              role: "user",

              content: prompt,
            },
          ],

          temperature: 0.4,

          max_tokens: 180,
        }),
      }
    );

  if (!response.ok) {
    const errorBody =
      await response
        .text()
        .catch(() => "");

    throw new Error(
      `[ai] OpenRouter request failed (${model}) status=${response.status} body=${errorBody.slice(0, 500)}`
    );
  }

  const data =
    await response.json();

  const content =
    data?.choices?.[0]
      ?.message?.content;

  if (
    !content ||
    typeof content !==
      "string"
  ) {
    throw new Error(
      `[ai] Invalid response from model (${model})`
    );
  }

  return sanitizeSummary(
    content
  );
}

// ─── Sanitizer ────────────────────────────────────────────────────────────

/**
 * Cleans AI output before returning to client.
 */
export function sanitizeSummary(
  summary: string
): string {
  return summary
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_SUMMARY_LENGTH);
}

// ─── Deterministic Fallback ───────────────────────────────────────────────

/**
 * Guaranteed fallback summary.
 *
 * Used when ALL AI providers fail.
 */
export function fallbackSummary(
  result: AuditResult
): string {
  const optimizations =
    result.tools.filter(
      (tool) =>
        tool.recommendation
          .action !==
        "optimal"
    ).length;

  return (
    `This audit identified approximately ` +
    `$${result.totalMonthlySavings}/month ` +
    `($${result.totalAnnualSavings}/year) ` +
    `in potential AI tooling savings across ` +
    `${result.tools.length} audited tools. ` +
    `${optimizations} optimization opportunities were detected, ` +
    `primarily involving overlapping subscriptions, ` +
    `plan inefficiencies, and seat allocation improvements.`
  );
}

// ─── Main AI Orchestrator ─────────────────────────────────────────────────

/**
 * AI generation pipeline:
 *
 * Primary Model
 * → Fallback Model
 * → Deterministic Template
 */
export async function generateAuditSummary(
  result: AuditResult
): Promise<{
  summary: string;

  source: SummarySource;
}> {
  const prompt =
    buildAuditPrompt(result);

  // ── Primary Model ───────────────────────────────────────

  try {
    const summary =
      await callModel(
        env.OPENROUTER_MODEL_PRIMARY,
        prompt
      );

    return {
      summary,

      source:
        "primary",
    };
  } catch (error) {
    console.error(
      "[ai] primary model failed",
      error
    );
  }

  // ── Fallback Model ──────────────────────────────────────

  try {
    const summary =
      await callModel(
        env.OPENROUTER_MODEL_FALLBACK,
        prompt
      );

    return {
      summary,

      source:
        "fallback-model",
    };
  } catch (error) {
    console.error(
      "[ai] fallback model failed",
      error
    );
  }

  // ── Deterministic Fallback ──────────────────────────────

  return {
    summary:
      fallbackSummary(
        result
      ),

    source:
      "deterministic",
  };
}
