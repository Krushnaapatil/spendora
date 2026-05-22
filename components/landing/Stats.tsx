import {
  STATS_ITEMS,
} from "@/data/landing";

export default function Stats() {
  return (
    <section className="border-b border-zinc-200 bg-[#FAFAF8]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {STATS_ITEMS.map(
          (item) => (
            <div
              key={item.label}
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