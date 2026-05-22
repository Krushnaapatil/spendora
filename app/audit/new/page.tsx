import AuditForm from "@/components/form/AuditForm";

export default function NewAuditPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF8]">
      <div className="mx-auto max-w-5xl px-6 py-20">
        {/* Header */}

        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm">
            Free AI spend audit
          </div>

          <h1 className="mt-8 text-5xl font-bold tracking-tight text-zinc-950 lg:text-6xl">
            Run a deterministic audit of your AI subscriptions.
          </h1>

          <p className="mt-8 text-xl leading-9 text-zinc-600">
            Add your current AI tools, plans, monthly spend, and seats.
            Spendora will analyze pricing efficiency, overlapping tooling,
            and optimization opportunities in under 60 seconds.
          </p>
        </div>

        {/* Form */}

        <div className="mt-16">
          <AuditForm />
        </div>
      </div>
    </main>
  );
}