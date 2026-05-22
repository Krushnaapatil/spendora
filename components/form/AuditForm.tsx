"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  formatToolName,
  TOOL_OPTIONS,
  TOOL_PLANS,
  type ToolName,
} from "@/lib/toolPlans";

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

    return JSON.parse(
      saved
    ) as FormState;
  } catch {
    return DEFAULT_FORM_STATE;
  }
}

export default function AuditForm() {
  const router = useRouter();

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

        setFormState(stored);
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

          tools: updated,
        };
      }
    );
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (
      tools.length === 0
    ) {
      setError(
        "Add at least one AI subscription."
      );

      return;
    }

    try {
      setError("");

      setIsSubmitting(true);

      const payload = {
        teamSize,

        useCase,

        tools: tools.map(
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

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Team Size */}

          <div>
            <label className="text-sm font-medium text-zinc-700">
              Team Size
            </label>

            <input
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
            <label className="text-sm font-medium text-zinc-700">
              Primary Use Case
            </label>

            <select
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
          <h2 className="text-3xl font-bold tracking-tight text-zinc-950">
            AI Subscriptions
          </h2>

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
                    <label className="text-sm font-medium text-zinc-700">
                      Tool
                    </label>

                    <select
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
                    <label className="text-sm font-medium text-zinc-700">
                      Plan
                    </label>

                    <select
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
                    <label className="text-sm font-medium text-zinc-700">
                      Monthly Spend
                    </label>

                    <input
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
                    <label className="text-sm font-medium text-zinc-700">
                      Seats
                    </label>

                    <input
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
