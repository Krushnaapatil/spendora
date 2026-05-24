// Provide minimal env required by lib/env during tests
const env = process.env as Record<string, string | undefined>;
env.NODE_ENV = env.NODE_ENV || "test";
env.NEXT_PUBLIC_SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL || "http://localhost:54321";
env.NEXT_PUBLIC_SUPABASE_ANON_KEY = env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon";
env.SUPABASE_SERVICE_ROLE_KEY = env.SUPABASE_SERVICE_ROLE_KEY || "service-role";
env.OPENROUTER_API_KEY = env.OPENROUTER_API_KEY || "openrouter-key";
env.RESEND_API_KEY = env.RESEND_API_KEY || "resend-key";

jest.mock("resend", () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn().mockResolvedValue({ id: "msg_1" }),
      },
    })),
  };
});

import { sendLeadConfirmationEmail, sendAuditShareEmail } from "../lib/email";

describe("email module", () => {
  test("sendLeadConfirmationEmail resolves true when Resend succeeds", async () => {
    const ok = await sendLeadConfirmationEmail("test@example.com", {
      auditUrl: "https://example.com/audit/1",
      monthlySavings: 100,
      annualSavings: 1200,
      highSavings: false,
      summary: "Test summary",
    });

    expect(ok).toBe(true);
  });

  test("sendAuditShareEmail resolves true when Resend succeeds", async () => {
    const ok = await sendAuditShareEmail({
      email: "share@example.com",
      auditUrl: "https://example.com/audit/1",
      monthlySavings: 50,
      annualSavings: 600,
      toolCount: 3,
      summary: "Share summary",
    });

    expect(ok).toBe(true);
  });
});
