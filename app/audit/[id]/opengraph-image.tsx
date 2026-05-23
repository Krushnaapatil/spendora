import { ImageResponse } from "next/og";

import { getAuditById } from "@/lib/auditData";

import { formatUSD } from "@/lib/utils";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType =
  "image/png";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Image({
  params,
}: Props) {
  const { id } = await params;
  const audit = await getAuditById(id);

  const monthlySavings =
    audit?.total_monthly_savings ?? 0;
  const annualSavings =
    audit?.total_annual_savings ?? 0;
  const toolCount = Array.isArray(
    audit?.results
  )
    ? audit!.results.length
    : 0;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "stretch",
          justifyContent: "space-between",
          background:
            "linear-gradient(135deg, #09090b 0%, #18181b 55%, #27272a 100%)",
          color: "#ffffff",
          padding: 64,
          fontFamily:
            "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#a1a1aa",
              }}
            >
              Spendora
            </div>

            <div
              style={{
                marginTop: 24,
                fontSize: 68,
                lineHeight: 1.02,
                fontWeight: 800,
                maxWidth: 880,
              }}
            >
              {formatUSD(monthlySavings)}
              /mo identified in AI savings
            </div>

            <div
              style={{
                marginTop: 18,
                fontSize: 28,
                lineHeight: 1.4,
                color: "#d4d4d8",
                maxWidth: 900,
              }}
            >
              {formatUSD(annualSavings)}
              /year across {toolCount} tools
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 20,
              marginTop: 32,
            }}
          >
            <div
              style={{
                padding: "18px 22px",
                borderRadius: 22,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                fontSize: 22,
                color: "#f4f4f5",
              }}
            >
              Deterministic audit
            </div>

            <div
              style={{
                padding: "18px 22px",
                borderRadius: 22,
                background: "rgba(34,197,94,0.15)",
                border: "1px solid rgba(34,197,94,0.3)",
                fontSize: 22,
                color: "#bbf7d0",
              }}
            >
              Public share link
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
