"use client";

import { useEffect, useState } from "react";

const LOADING_MESSAGES = [
  "Analyzing subscriptions...",
  "Checking pricing tiers...",
  "Detecting overlapping tooling...",
  "Calculating optimization opportunities...",
  "Generating executive summary...",
];

export default function InteractiveAudit() {
  const [
    isAuditing,
    setIsAuditing,
  ] = useState(false);

  const [
    auditComplete,
    setAuditComplete,
  ] = useState(false);

  const [
    currentMessage,
    setCurrentMessage,
  ] = useState(0);

  useEffect(() => {
    if (!isAuditing) {
      return;
    }

    const interval =
      setInterval(() => {
        setCurrentMessage(
          (prev) =>
            (prev + 1) %
            LOADING_MESSAGES.length
        );
      }, 1400);

    return () =>
      clearInterval(interval);
  }, [isAuditing]);

  async function executeAudit() {
    setAuditComplete(false);
    setIsAuditing(true);
    setCurrentMessage(0);

    await new Promise(
      (resolve) =>
        setTimeout(resolve, 6500)
    );

    setIsAuditing(false);
    setAuditComplete(true);
  }

  return (
    <section
      id="example-audit"
      className="relative overflow-hidden border-b border-zinc-200 bg-[#FAFAF8]"
    >
      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.03),transparent_50%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-28">
        {/* Header */}

        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm">
            Interactive audit preview
          </div>

          <h2 className="mt-8 text-5xl font-bold tracking-tight text-zinc-950 lg:text-6xl">
            Experience how the audit workflow actually feels.
          </h2>

          <p className="mt-8 text-xl leading-9 text-zinc-600">
            Spendora analyzes plan fit, overlapping subscriptions, and
            pricing inefficiencies using deterministic rules — then
            generates an executive-readable summary for sharing.
          </p>
        </div>

        {/* Main Grid */}

        <div className="mt-20 grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          {/* Left Panel */}

          <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                  Team Input
                </p>

                <h3 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950">
                  Current AI Stack
                </h3>
              </div>

              <div className="rounded-full border border-zinc-200 bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-600">
                6-person team
              </div>
            </div>

            {/* Tool Rows */}

            <div className="mt-10 space-y-4">
              {[
                {
                  tool:
                    "ChatGPT Team",
                  spend:
                    "$240/mo",
                },
                {
                  tool:
                    "Claude Pro",
                  spend:
                    "$120/mo",
                },
                {
                  tool:
                    "Cursor Business",
                  spend:
                    "$160/mo",
                },
              ].map((tool) => (
                <div
                  key={tool.tool}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 bg-[#FAFAF8] px-5 py-4"
                >
                  <div>
                    <p className="font-semibold text-zinc-950">
                      {tool.tool}
                    </p>

                    <p className="mt-1 text-sm text-zinc-500">
                      Active subscription
                    </p>
                  </div>

                  <p className="font-medium text-zinc-700">
                    {tool.spend}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA */}

            <button
              onClick={
                executeAudit
              }
              disabled={
                isAuditing
              }
              className="mt-10 w-full rounded-2xl bg-zinc-950 px-6 py-4 text-lg font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isAuditing
                ? "Running audit..."
                : "Generate Audit"}
            </button>
          </div>

          {/* Right Panel */}

          <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-[0_20px_80px_rgba(0,0,0,0.08)]">
            {!isAuditing &&
            !auditComplete ? (
              <div className="flex h-full min-h-[500px] flex-col items-center justify-center text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100">
                  <div className="h-4 w-4 rounded-full bg-zinc-950" />
                </div>

                <h3 className="mt-8 text-3xl font-bold tracking-tight text-zinc-950">
                  Ready to analyze
                </h3>

                <p className="mt-5 max-w-md leading-8 text-zinc-600">
                  Start the audit to simulate how Spendora evaluates AI
                  subscription efficiency and optimization opportunities.
                </p>
              </div>
            ) : null}

            {/* Loading */}

            {isAuditing ? (
              <div className="flex h-full min-h-[500px] flex-col justify-center">
                <div className="flex items-center gap-4">
                  <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />

                  <p className="text-lg font-medium text-zinc-700">
                    {
                      LOADING_MESSAGES[
                        currentMessage
                      ]
                    }
                  </p>
                </div>

                {/* Progress */}

                <div className="mt-8 h-3 overflow-hidden rounded-full bg-zinc-200">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-zinc-950" />
                </div>

                {/* Logs */}

                <div className="mt-12 space-y-4 rounded-3xl border border-zinc-200 bg-[#FAFAF8] p-6">
                  {LOADING_MESSAGES.slice(
                    0,
                    currentMessage +
                      1
                  ).map(
                    (message) => (
                      <div
                        key={
                          message
                        }
                        className="flex items-center gap-3 text-zinc-600"
                      >
                        <div className="h-2 w-2 rounded-full bg-green-500" />

                        <p>
                          {message}
                        </p>
                      </div>
                    )
                  )}
                </div>
              </div>
            ) : null}

            {/* Complete */}

            {auditComplete ? (
              <div>
                {/* Header */}

                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                      Audit Complete
                    </p>

                    <h3 className="mt-4 text-5xl font-bold tracking-tight text-green-600">
                      $4,800
                    </h3>

                    <p className="mt-3 text-zinc-500">
                      projected annual savings
                    </p>
                  </div>

                  <div className="rounded-full border border-green-200 bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
                    Savings identified
                  </div>
                </div>

                {/* Recommendations */}

                <div className="mt-10 space-y-4">
                  {[
                    {
                      tool:
                        "Cursor Business",
                      savings:
                        "-$80/mo",
                      reason:
                        "Current team size does not justify business-tier pricing.",
                    },
                    {
                      tool:
                        "Claude Pro",
                      savings:
                        "-$200/mo",
                      reason:
                        "Startup credits available through partner programs.",
                    },
                  ].map((item) => (
                    <div
                      key={item.tool}
                      className="rounded-2xl border border-zinc-200 bg-[#FAFAF8] p-5"
                    >
                      <div className="flex items-start justify-between gap-6">
                        <div>
                          <p className="font-semibold text-zinc-950">
                            {item.tool}
                          </p>

                          <p className="mt-2 leading-7 text-zinc-600">
                            {
                              item.reason
                            }
                          </p>
                        </div>

                        <p className="text-lg font-semibold text-green-600">
                          {
                            item.savings
                          }
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* AI Summary */}

                <div className="mt-8 rounded-3xl bg-zinc-950 p-6 text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
                    AI-generated summary
                  </p>

                  <p className="mt-5 leading-8 text-zinc-300">
                    Your team is currently paying above the optimal
                    pricing threshold for Cursor Business while also
                    missing available startup credits for Claude usage.
                    Adjusting both subscriptions would reduce annual AI
                    spend without affecting operational workflows.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}