/**
 * lib/email.ts
 *
 * Transactional email infrastructure.
 *
 * Responsibilities:
 * - send lead confirmation emails
 * - isolate Resend SDK usage
 * - provide graceful failure handling
 *
 * IMPORTANT:
 * Email failures must NEVER break lead capture.
 */

import { Resend } from "resend";

import { env } from "@/lib/env";

// ─── Resend Client ─────────────────────────────────────────────────────────

const resend =
  new Resend(
    env.RESEND_API_KEY
  );

// ─── Lead Confirmation Email ──────────────────────────────────────────────

export async function sendLeadConfirmationEmail(
  email: string
): Promise<void> {
  try {
    await resend.emails.send({
      from:
        env.FROM_EMAIL,

      to: email,

      subject:
        "Your Spendora AI Audit Is Ready",

      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <h2>Thanks for trying Spendora</h2>

          <p>
            Your AI tooling audit has been successfully generated.
          </p>

          <p>
            Spendora helps teams identify AI subscription waste,
            optimize tooling spend, and improve operational efficiency.
          </p>

          <p>
            We'll notify you about future optimization insights and platform updates.
          </p>

          <hr />

          <p style="font-size: 12px; color: #666;">
            © Spendora
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error(
      "[email] failed to send lead confirmation",
      error
    );
  }
}