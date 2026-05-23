"use client";

import { useState } from "react";

interface ShareAuditCardProps {
  sharePath: string;
}

export default function ShareAuditCard({
  sharePath,
}: ShareAuditCardProps) {
  const [copied, setCopied] = useState(false);
  const shareUrl =
    typeof window === "undefined"
      ? sharePath
      : new URL(
          sharePath,
          window.location.origin
        ).toString();

  async function copyShareLink() {
    try {
      await navigator.clipboard.writeText(
        shareUrl
      );
      setCopied(true);
      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  async function nativeShare() {
    if (!navigator.share) {
      return;
    }

    await navigator.share({
      title: "Spendora AI audit",
      text: "Here is the Spendora audit report.",
      url: shareUrl,
    });
  }

  return (
    <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-6 text-left">
      <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
        Shareable URL
      </p>

      <div className="mt-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-700">
        {shareUrl}
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={copyShareLink}
          className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
        >
          {copied ? "Copied" : "Copy Link"}
        </button>

        <button
          type="button"
          onClick={nativeShare}
          className="rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
        >
          Share via Device
        </button>
      </div>

      <p className="mt-3 text-sm text-zinc-500">
        Send this link to your team so they can review the full audit.
      </p>
    </div>
  );
}
