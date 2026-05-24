"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import {
  DEFAULT_AUDIT_FORM_STATE,
  LOADING_MESSAGES,
  STORAGE_KEY,
  getStoredFormState,
  normalizeFormState,
  normalizeToolRow,
  type AuditFormState,
  type AuditFormToolRow,
} from "@/lib/auditFormState";
import {
  TOOL_PLANS,
  type ToolName,
} from "@/lib/toolPlans";
import { createClient } from "@/lib/supabase-browser";

export interface AuditFormProps {
  initialValues?: AuditFormState;
  persistToLocalStorage?: boolean;
  submitLabel?: string;
  progressHint?: string;
}

export function useAuditFormState({
  initialValues,
  persistToLocalStorage = true,
}: AuditFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [mounted, setMounted] = useState(false);
  const [formState, setFormState] = useState<AuditFormState>(
    initialValues ?? DEFAULT_AUDIT_FORM_STATE
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    if (!isSubmitting) {
      return;
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex(
        (prev) => (prev + 1) % LOADING_MESSAGES.length
      );
    }, 1200);

    return () => clearInterval(interval);
  }, [isSubmitting]);

  useEffect(() => {
    const raf = window.requestAnimationFrame(() => {
      setMounted(true);

      if (initialValues) {
        setFormState(normalizeFormState(initialValues));
        return;
      }

      if (!persistToLocalStorage) {
        setFormState(normalizeFormState(DEFAULT_AUDIT_FORM_STATE));
        return;
      }

      setFormState(normalizeFormState(getStoredFormState()));
    });

    return () => window.cancelAnimationFrame(raf);
  }, [initialValues, persistToLocalStorage]);

  useEffect(() => {
    if (!mounted || !persistToLocalStorage || initialValues) {
      return;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(formState));
  }, [formState, mounted, persistToLocalStorage, initialValues]);

  function addToolRow() {
    setFormState((prev) => ({
      ...prev,
      tools: [
        ...prev.tools,
        {
          tool: "chatgpt",
          plan: "plus",
          spend: 20,
          seats: 1,
        },
      ],
    }));
  }

  function removeToolRow(index: number) {
    setFormState((prev) => ({
      ...prev,
      tools: prev.tools.filter((_, i) => i !== index),
    }));
  }

  function updateToolRow(
    index: number,
    field: keyof AuditFormToolRow,
    value: string | number
  ) {
    setFormState((prev) => {
      const updated = [...prev.tools];

      if (field === "tool") {
        const tool = value as ToolName;
        updated[index] = {
          ...updated[index],
          tool,
          plan: TOOL_PLANS[tool][0],
        };
      } else {
        updated[index] = {
          ...updated[index],
          [field]: value,
        };
      }

      return {
        ...prev,
        tools: updated.map(normalizeToolRow),
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const normalizedState = normalizeFormState(formState);

    if (normalizedState.tools.length === 0) {
      setError("Add at least one AI subscription.");
      return;
    }

    try {
      setError("");
      setIsSubmitting(true);

      const sessionResult = await supabase.auth.getSession();
      const accessToken =
        sessionResult.data.session?.access_token ?? null;

      const payload = {
        teamSize: normalizedState.teamSize,
        useCase: normalizedState.useCase,
        tools: normalizedState.tools.map((tool) => ({
          toolId: tool.tool,
          plan: tool.plan.toLowerCase(),
          monthlySpend: tool.spend,
          seats: tool.seats,
        })),
      };

      const response = await fetch("/api/audit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(accessToken
            ? { Authorization: `Bearer ${accessToken}` }
            : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorData: { error?: string } | null = null;

        try {
          errorData = errorText ? JSON.parse(errorText) : null;
        } catch {
          errorData = null;
        }

        throw new Error(
          errorData?.error ?? errorText ?? "Failed to generate audit."
        );
      }

      const data = await response.json();

      if (persistToLocalStorage) {
        localStorage.removeItem(STORAGE_KEY);
      }

      router.push(`/audit/${data.auditId}`);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while generating the audit."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    mounted,
    formState,
    setFormState,
    isSubmitting,
    error,
    loadingMessageIndex,
    addToolRow,
    removeToolRow,
    updateToolRow,
    handleSubmit,
  };
}
