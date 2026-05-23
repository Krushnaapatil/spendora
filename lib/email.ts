/**
 * lib/email.ts
 *
 * Transactional email infrastructure.
 *
 * Responsibilities:
 * - send lead confirmation emails
 * - send audit share emails
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

function escapeHtml(
  value: string
): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function formatUSD(
  value: number
): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function buildButton(
  href: string,
  label: string
): string {
  return `
    <a href="${escapeHtml(href)}"
      style="
        display:inline-block;
        margin-top:24px;
        padding:14px 22px;
        background:#09090b;
        color:#ffffff;
        text-decoration:none;
        border-radius:14px;
        font-weight:600;
        font-size:14px;
      "
    >
      ${escapeHtml(label)}
    </a>
  `;
}

function buildEmailShell({
  eyebrow,
  title,
  body,
  footer,
}: {
  eyebrow: string;
  title: string;
  body: string;
  footer: string;
}): string {
  return `
    <div style="margin:0;padding:0;background:#f4f4f5;">
      <div style="max-width:640px;margin:0 auto;padding:32px 16px;font-family:Arial,Helvetica,sans-serif;color:#18181b;">
        <div style="background:#ffffff;border:1px solid #e4e4e7;border-radius:24px;padding:32px;">
          <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#71717a;font-weight:700;">
            ${escapeHtml(eyebrow)}
          </p>

          <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;color:#09090b;">
            ${escapeHtml(title)}
          </h1>

          ${body}

          <div style="margin-top:28px;border-top:1px solid #e4e4e7;padding-top:18px;font-size:12px;line-height:1.6;color:#71717a;">
            ${escapeHtml(footer)}
          </div>
        </div>
      </div>
    </div>
  `;
}

function buildLeadConfirmationEmailHtml(): string {
  return buildEmailShell({
    eyebrow: "Spendora",
    title: "Thanks for trying Spendora",
    body: `
      <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#27272a;">
        Your AI tooling audit has been successfully generated.
      </p>

      <p style="margin:0;font-size:16px;line-height:1.7;color:#27272a;">
        Spendora helps teams identify AI subscription waste, optimize tooling spend, and improve operational efficiency.
      </p>
    `,
    footer:
      "We'll notify you about future optimization insights and platform updates.",
  });
}

function buildLeadConfirmationEmailWithAuditHtml({
  auditUrl,
  monthlySavings,
  annualSavings,
  highSavings,
  summary,
}: {
  auditUrl: string;
  monthlySavings: number;
  annualSavings: number;
  highSavings: boolean;
  summary?: string | null;
}): string {
  const followUpNote = highSavings
    ? `
      <div style="margin-top:20px;padding:18px;border:1px solid #fcd34d;border-radius:18px;background:#fffbeb;">
        <p style="margin:0 0 8px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#92400e;">
          Credex consultation
        </p>
        <p style="margin:0;font-size:15px;line-height:1.7;color:#92400e;">
          This audit crosses our savings threshold, so a Spendora specialist can follow up about a Credex consultation and the remaining optimization opportunities.
        </p>
      </div>
    `
    : "";

  const summaryBlock = summary
    ? `
      <div style="margin-top:20px;padding:18px;border:1px solid #e4e4e7;border-radius:18px;background:#fafafa;">
        <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#71717a;">
          Executive summary
        </p>
        <p style="margin:0;font-size:15px;line-height:1.7;color:#3f3f46;">
          ${escapeHtml(summary)}
        </p>
      </div>
    `
    : "";

  return buildEmailShell({
    eyebrow: "Spendora",
    title: "Your audit report is ready",
    body: `
      <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#27272a;">
        We reviewed your AI tooling stack and found ${escapeHtml(
          formatUSD(monthlySavings)
        )}/mo in savings across the current setup.
      </p>

      <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin:0 0 4px;">
        <div style="padding:14px;border:1px solid #e4e4e7;border-radius:16px;background:#fafafa;">
          <div style="font-size:12px;color:#71717a;margin-bottom:6px;">Monthly savings</div>
          <div style="font-size:20px;font-weight:700;color:#09090b;">${escapeHtml(
            formatUSD(monthlySavings)
          )}</div>
        </div>

        <div style="padding:14px;border:1px solid #e4e4e7;border-radius:16px;background:#fafafa;">
          <div style="font-size:12px;color:#71717a;margin-bottom:6px;">Annual savings</div>
          <div style="font-size:20px;font-weight:700;color:#09090b;">${escapeHtml(
            formatUSD(annualSavings)
          )}</div>
        </div>
      </div>

      ${summaryBlock}
      ${followUpNote}

      ${buildButton(
        auditUrl,
        "Open the full report"
      )}
    `,
    footer:
      "We saved a copy of your report link so your team can review it anytime.",
  });
}

function buildAuditShareEmailHtml({
  auditUrl,
  monthlySavings,
  annualSavings,
  toolCount,
  summary,
}: {
  auditUrl: string;
  monthlySavings: number;
  annualSavings: number;
  toolCount: number;
  summary?: string | null;
}): string {
  const summaryBlock = summary
    ? `
      <div style="margin-top:20px;padding:18px;border:1px solid #e4e4e7;border-radius:18px;background:#fafafa;">
        <p style="margin:0 0 10px;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#71717a;">
          Executive summary
        </p>
        <p style="margin:0;font-size:15px;line-height:1.7;color:#3f3f46;">
          ${escapeHtml(summary)}
        </p>
      </div>
    `
    : "";

  return buildEmailShell({
    eyebrow: "Spendora Audit Report",
    title: "Your audit is ready to share",
    body: `
      <p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#27272a;">
        We reviewed the AI tooling stack and identified ${escapeHtml(
          formatUSD(monthlySavings)
        )}/mo in savings across ${toolCount} tools.
      </p>

      <div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:0 0 4px;">
        <div style="padding:14px;border:1px solid #e4e4e7;border-radius:16px;background:#fafafa;">
          <div style="font-size:12px;color:#71717a;margin-bottom:6px;">Monthly savings</div>
          <div style="font-size:20px;font-weight:700;color:#09090b;">${escapeHtml(
            formatUSD(monthlySavings)
          )}</div>
        </div>

        <div style="padding:14px;border:1px solid #e4e4e7;border-radius:16px;background:#fafafa;">
          <div style="font-size:12px;color:#71717a;margin-bottom:6px;">Annual savings</div>
          <div style="font-size:20px;font-weight:700;color:#09090b;">${escapeHtml(
            formatUSD(annualSavings)
          )}</div>
        </div>

        <div style="padding:14px;border:1px solid #e4e4e7;border-radius:16px;background:#fafafa;">
          <div style="font-size:12px;color:#71717a;margin-bottom:6px;">Tools reviewed</div>
          <div style="font-size:20px;font-weight:700;color:#09090b;">${toolCount}</div>
        </div>
      </div>

      ${summaryBlock}

      ${buildButton(
        auditUrl,
        "View the full audit"
      )}
    `,
    footer:
      "Use this link to review the full report with your team.",
  });
}

// ─── Lead Confirmation Email ──────────────────────────────────────────────

export async function sendLeadConfirmationEmail(
  email: string,
  options?: {
    auditUrl?: string;
    monthlySavings?: number;
    annualSavings?: number;
    highSavings?: boolean;
    summary?: string | null;
  }
): Promise<boolean> {
  try {
    const hasAuditDetails =
      Boolean(
        options?.auditUrl
      ) &&
      typeof options?.monthlySavings ===
        "number" &&
      typeof options?.annualSavings ===
        "number" &&
      typeof options?.highSavings ===
        "boolean";

    await resend.emails.send({
      from:
        env.FROM_EMAIL,

      to: email,

      subject:
        "Your Spendora AI Audit Is Ready",

      html: hasAuditDetails
        ? buildLeadConfirmationEmailWithAuditHtml(
            {
              auditUrl:
                options?.auditUrl ??
                "",
              monthlySavings:
                options?.monthlySavings ??
                0,
              annualSavings:
                options?.annualSavings ??
                0,
              highSavings:
                options?.highSavings ??
                false,
              summary:
                options?.summary ??
                null,
            }
          )
        : buildLeadConfirmationEmailHtml(),
    });

    return true;
  } catch (error) {
    console.error(
      "[email] failed to send lead confirmation",
      error
    );

    return false;
  }
}

export async function sendAuditShareEmail({
  email,
  auditUrl,
  monthlySavings,
  annualSavings,
  toolCount,
  summary,
}: {
  email: string;
  auditUrl: string;
  monthlySavings: number;
  annualSavings: number;
  toolCount: number;
  summary?: string | null;
}): Promise<boolean> {
  try {
    await resend.emails.send({
      from:
        env.FROM_EMAIL,

      to: email,

      subject:
        "Your Spendora audit report",

      html: buildAuditShareEmailHtml({
        auditUrl,
        monthlySavings,
        annualSavings,
        toolCount,
        summary,
      }),
    });

    return true;
  } catch (error) {
    console.error(
      "[email] failed to send audit share",
      error
    );

    return false;
  }
}
