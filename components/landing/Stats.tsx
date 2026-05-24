import {
  STATS_ITEMS,
} from "@/data/landing";

export default function Stats() {
  return (
    <section className="border-y border-white/50 bg-white/30 backdrop-blur-xl">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {STATS_ITEMS.map(
          (item) => (
            <div
              key={item.label}
              className="rounded-3xl border border-white/60 bg-white/40 p-6 shadow-[0_10px_40px_rgba(15,23,42,0.05)] backdrop-blur-md"
            >
              <h3 className="text-4xl font-bold tracking-tight text-zinc-950">
                {item.value}
              </h3>

              <p className="mt-3 text-zinc-600">
                {item.label}
              </p>
            </div>
          )
        )}
      </div>
    </section>
  );
}
