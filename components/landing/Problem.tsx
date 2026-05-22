import {
  PROBLEM_CARDS,
} from "@/data/landing";

export default function Problem() {
  return (
    <section className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-24">
        {/* Header */}

        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">
            The problem
          </p>

          <h2 className="mt-5 text-5xl font-bold tracking-tight text-zinc-950">
            AI adoption scaled. Cost visibility didn&apos;t.
          </h2>

          <p className="mt-8 text-xl leading-9 text-zinc-600">
            Teams now run 4–8 AI tools simultaneously. Most founders
            look at the bill, sigh, and pay it. There&apos;s still no
            centralized visibility into AI subscription waste.
          </p>
        </div>

        {/* Cards */}

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {PROBLEM_CARDS.map(
            (card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-zinc-200 bg-[#FAFAF8] p-8 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-2xl font-semibold text-zinc-950">
                  {card.title}
                </h3>

                <p className="mt-5 leading-8 text-zinc-600">
                  {card.description}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}