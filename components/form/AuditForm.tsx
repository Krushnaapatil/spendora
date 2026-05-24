"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  formatToolName,
  TOOL_OPTIONS,
  TOOL_PLANS,
  type ToolName,
} from "@/lib/toolPlans";
import { createClient } from "@/lib/supabase-browser";

interface ToolRow {
  tool: ToolName;
  plan: string;
  spend: number;
  seats: number;
}

interface FormState {
  teamSize: number;
  useCase: string;
  tools: ToolRow[];
}

const VALID_USE_CASES = [
  "coding",
  "writing",
  "data",
  "research",
  "mixed",
] as const;

const STORAGE_KEY =
  "spendora-audit-form";

const DEFAULT_FORM_STATE: FormState =
  {
    teamSize: 5,

    useCase: "coding",

    tools: [
      {
        tool:
          "chatgpt",

        plan:
          "plus",

        spend: 20,

        seats: 1,
      },
    ],
  };

function normalizeToolRow(
  row: ToolRow
): ToolRow {
  const allowedPlans =
    TOOL_PLANS[row.tool] as readonly string[];

  return {
    ...row,
    plan: allowedPlans.includes(
      row.plan
    )
      ? row.plan
      : allowedPlans[0],
  };
}

function normalizeUseCase(
  value: string
): string {
  return VALID_USE_CASES.includes(
    value as (typeof VALID_USE_CASES)[number]
  )
    ? value
    : DEFAULT_FORM_STATE.useCase;
}

function normalizeTeamSize(
  value: number | string
): number {
  const numeric =
    typeof value === "number"
      ? value
      : Number(value);

  return Number.isFinite(numeric) && numeric > 0
    ? Math.round(numeric)
    : DEFAULT_FORM_STATE.teamSize;
}

function normalizeFormState(
  state: FormState
): FormState {
  return {
    ...state,
    teamSize: normalizeTeamSize(
      state.teamSize
    ),
    useCase: normalizeUseCase(
      state.useCase
    ),
    tools: state.tools.map(
      normalizeToolRow
    ),
  };
}

const LOADING_MESSAGES = [
  "Analyzing subscriptions...",
  "Checking pricing tiers...",
  "Detecting overlapping tooling...",
  "Calculating optimization opportunities...",
  "Generating executive summary...",
];

function getStoredFormState(): FormState {
  if (
    typeof window ===
    "undefined"
  ) {
    return DEFAULT_FORM_STATE;
  }

  try {
    const saved =
      localStorage.getItem(
        STORAGE_KEY
      );

    if (!saved) {
      return DEFAULT_FORM_STATE;
    }

    return normalizeFormState(
      JSON.parse(saved) as FormState
    );
  } catch {
    return DEFAULT_FORM_STATE;
  }
}

export default function AuditForm() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [
    mounted,
    setMounted,
  ] = useState(false);

  const [
    formState,
    setFormState,
  ] = useState<FormState>(
    DEFAULT_FORM_STATE
  );

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [error, setError] =
    useState("");

  const [
    loadingMessageIndex,
    setLoadingMessageIndex,
  ] = useState(0);

  useEffect(() => {
    if (!isSubmitting) {
      return;
    }

    const interval =
      setInterval(() => {
        setLoadingMessageIndex(
          (
            prev: number
          ) =>
            (prev + 1) %
            LOADING_MESSAGES.length
        );
      }, 1200);

    return () =>
      clearInterval(interval);
  }, [isSubmitting]);

  useEffect(() => {
    const raf =
      window.requestAnimationFrame(() => {
        setMounted(true);

        const stored =
          getStoredFormState();

        setFormState(
          normalizeFormState(stored)
        );
      });

    return () =>
      window.cancelAnimationFrame(
        raf
      );
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        formState
      )
    );
  }, [formState, mounted]);

  const {
    tools,
    teamSize,
    useCase,
  } = formState;

  function addToolRow() {
    setFormState(
      (
        prev: FormState
      ) => ({
        ...prev,

        tools: [
          ...prev.tools,

          {
            tool:
              "chatgpt",

            plan:
              "plus",

            spend: 20,

            seats: 1,
          },
        ],
      })
    );
  }

  function removeToolRow(
    index: number
  ) {
    setFormState(
      (
        prev: FormState
      ) => ({
        ...prev,

        tools:
          prev.tools.filter(
            (
              _: ToolRow,
              i: number
            ) =>
              i !== index
          ),
      })
    );
  }

  function updateToolRow(
    index: number,
    field: keyof ToolRow,
    value:
      | string
      | number
  ) {
    setFormState(
      (
        prev: FormState
      ) => {
        const updated: ToolRow[] =
          [
            ...prev.tools,
          ];

        if (
          field ===
          "tool"
        ) {
          const tool =
            value as ToolName;

          updated[index] =
            {
              ...updated[
                index
              ],

              tool,

              plan:
                TOOL_PLANS[
                  tool
                ][0],
            };
        } else {
          updated[index] =
            {
              ...updated[
                index
              ],

              [field]:
                value,
            };
        }

        return {
          ...prev,

          tools:
            updated.map(
              normalizeToolRow
            ),
        };
      }
    );
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const normalizedState =
      normalizeFormState(
        formState
      );

    if (
      normalizedState.tools.length === 0
    ) {
      setError(
        "Add at least one AI subscription."
      );

      return;
    }

      try {
        setError("");

        setIsSubmitting(true);

      const sessionResult =
        await supabase.auth.getSession();
      const accessToken =
        sessionResult.data.session?.access_token ?? null;

      const payload = {
        teamSize:
          normalizedState.teamSize,

        useCase:
          normalizedState.useCase,

        tools: normalizedState.tools.map(
          (
            tool: ToolRow
          ) => ({
            toolId:
              tool.tool,

            plan:
              tool.plan.toLowerCase(),

            monthlySpend:
              tool.spend,

            seats:
              tool.seats,
          })
        ),
      };

      const response =
        await fetch(
          "/api/audit",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
              ...(accessToken
                ? {
                    Authorization: `Bearer ${accessToken}`,
                  }
                : {}),
            },

            body: JSON.stringify(
              payload
            ),
          }
        );

      if (
        !response.ok
      ) {
        const errorText =
          await response.text();

        let errorData:
          | {
              error?: string;
            }
          | null = null;

        try {
          errorData =
            errorText
              ? JSON.parse(
                  errorText
                )
              : null;
        } catch {
          errorData = null;
        }

        console.error(
          "Audit API Error:",
          errorData ?? errorText
        );

        throw new Error(
          errorData?.error ??
            (errorText ||
              "Failed to generate audit.")
        );
      }

      const data =
        await response.json();

      localStorage.removeItem(
        STORAGE_KEY
      );

      router.push(
        `/audit/${data.auditId}`
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating the audit."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!mounted) {
    return null;
  }

  return (
    <form
      onSubmit={
        handleSubmit
      }
      className="space-y-10"
    >
      {/* Team Info */}

      <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
          Team Information
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
          Tell us how many people are on the team, what the primary work is, and which
          AI subscriptions you are paying for.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Team Size */}

          <div>
            <label htmlFor="team-size" className="text-sm font-medium text-zinc-700">
              Team Size
            </label>
            <p className="mt-1 text-xs text-zinc-500">
              Total people using AI tools across the team.
            </p>

            <input
              id="team-size"
              type="number"
              min={1}
              value={
                teamSize
              }
              onChange={(
                e
              ) =>
                setFormState(
                  (
                    prev: FormState
                  ) => ({
                    ...prev,

                    teamSize:
                      Number(
                        e.target
                          .value
                      ),
                  })
                )
              }
              className="mt-3 w-full rounded-2xl border border-zinc-200 bg-[#FAFAF8] px-5 py-4 outline-none transition focus:border-zinc-400"
            />
          </div>

          {/* Use Case */}

          <div>
            <label htmlFor="primary-use-case" className="text-sm font-medium text-zinc-700">
              Primary Use Case
            </label>
            <p className="mt-1 text-xs text-zinc-500">
              Choose the main way your team uses these tools.
            </p>

            <select
              id="primary-use-case"
              value={
                useCase
              }
              onChange={(
                e
              ) =>
                setFormState(
                  (
                    prev: FormState
                  ) => ({
                    ...prev,

                    useCase:
                      e.target
                        .value,
                  })
                )
              }
              className="mt-3 w-full rounded-2xl border border-zinc-200 bg-[#FAFAF8] px-5 py-4 outline-none transition focus:border-zinc-400"
            >
              <option value="coding">
                Coding
              </option>

              <option value="writing">
                Writing
              </option>

              <option value="research">
                Research
              </option>

              <option value="data">
                Data
              </option>

              <option value="mixed">
                Mixed
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Tool Rows */}

      <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
            AI Subscriptions
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
              For each tool, choose the vendor, subscription plan, monthly spend, and number of seats.
            </p>
          </div>

          <button
            type="button"
            onClick={
              addToolRow
            }
            className="rounded-2xl border border-zinc-200 bg-[#FAFAF8] px-5 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
          >
            + Add Tool
          </button>
        </div>

        <div className="mt-10 space-y-6">
          {tools.map(
            (
              tool: ToolRow,
              index: number
            ) => (
              <div
                key={index}
                className="rounded-3xl border border-zinc-200 bg-[#FAFAF8] p-6"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-zinc-950">
                    Tool #
                    {index + 1}
                  </h3>

                  <button
                    type="button"
                    onClick={() =>
                      removeToolRow(
                        index
                      )
                    }
                    className="text-sm font-medium text-red-500 transition hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid gap-4 lg:grid-cols-4">
                  {/* Tool */}

                  <div>
                    <label
                      htmlFor={`tool-${index}-name`}
                      className="text-sm font-medium text-zinc-700"
                    >
                      Tool
                    </label>
                    <p className="mt-1 text-xs text-zinc-500">
                      Which AI product are you paying for?
                    </p>

                    <select
                      id={`tool-${index}-name`}
                      value={
                        tool.tool
                      }
                      onChange={(
                        e
                      ) =>
                        updateToolRow(
                          index,

                          "tool",

                          e.target
                            .value
                        )
                      }
                      className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 outline-none"
                    >
                      {TOOL_OPTIONS.map(
                        (
                          option: ToolName
                        ) => (
                          <option
                            key={
                              option
                            }
                            value={
                              option
                            }
                          >
                            {formatToolName(
                              option
                            )}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Plan */}

                  <div>
                    <label
                      htmlFor={`tool-${index}-plan`}
                      className="text-sm font-medium text-zinc-700"
                    >
                      Plan
                    </label>
                    <p className="mt-1 text-xs text-zinc-500">
                      Select the subscription tier or API plan.
                    </p>

                    <select
                      id={`tool-${index}-plan`}
                      value={
                        tool.plan
                      }
                      onChange={(
                        e
                      ) =>
                        updateToolRow(
                          index,

                          "plan",

                          e.target
                            .value
                        )
                      }
                      className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 outline-none"
                    >
                      {TOOL_PLANS[
                        tool.tool
                      ].map(
                        (
                          plan: string
                        ) => (
                          <option
                            key={
                              plan
                            }
                            value={
                              plan
                            }
                          >
                            {plan
                              .charAt(
                                0
                              )
                              .toUpperCase() +
                              plan.slice(
                                1
                              )}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Spend */}

                  <div>
                    <label
                      htmlFor={`tool-${index}-spend`}
                      className="text-sm font-medium text-zinc-700"
                    >
                      Monthly Spend
                    </label>
                    <p className="mt-1 text-xs text-zinc-500">
                      Approximate monthly cost for this tool.
                    </p>

                    <input
                      id={`tool-${index}-spend`}
                      type="number"
                      min={0}
                      value={
                        tool.spend
                      }
                      onChange={(
                        e
                      ) =>
                        updateToolRow(
                          index,

                          "spend",

                          Number(
                            e.target
                              .value
                          )
                        )
                      }
                      className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 outline-none"
                    />
                  </div>

                  {/* Seats */}

                  <div>
                    <label
                      htmlFor={`tool-${index}-seats`}
                      className="text-sm font-medium text-zinc-700"
                    >
                      Seats
                    </label>
                    <p className="mt-1 text-xs text-zinc-500">
                      How many people are actively using it?
                    </p>

                    <input
                      id={`tool-${index}-seats`}
                      type="number"
                      min={1}
                      value={
                        tool.seats
                      }
                      onChange={(
                        e
                      ) =>
                        updateToolRow(
                          index,

                          "seats",

                          Number(
                            e.target
                              .value
                          )
                        )
                      }
                      className="mt-3 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 outline-none"
                    />
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>

      {/* Submit Section */}

      <div className="space-y-5">
        {isSubmitting ? (
          <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-3 w-3 animate-pulse rounded-full bg-green-500" />

              <p className="text-lg font-medium text-zinc-700">
                {
                  LOADING_MESSAGES[
                    loadingMessageIndex
                  ]
                }
              </p>
            </div>

            <div className="mt-8 h-3 overflow-hidden rounded-full bg-zinc-200">
              <div className="h-full w-2/3 animate-pulse rounded-full bg-zinc-950" />
            </div>

            <div className="mt-10 space-y-4 rounded-3xl border border-zinc-200 bg-[#FAFAF8] p-6">
              {LOADING_MESSAGES.slice(
                0,
                loadingMessageIndex +
                  1
              ).map(
                (
                  message: string
                ) => (
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
        ) : (
          <button
            type="submit"
            className="w-full rounded-3xl bg-zinc-950 px-8 py-5 text-lg font-semibold text-white transition hover:bg-zinc-800"
          >
            Generate Audit Report
          </button>
        )}

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <p className="text-center text-sm text-zinc-500">
          Your progress is automatically saved locally.
        </p>
      </div>
    </form>
  );
}
