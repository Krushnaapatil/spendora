import {
  TESTIMONIALS,
} from "@/data/landing";

export default function Testimonials() {
  return (
    <section className="relative overflow-hidden border-b border-white/50 bg-white/25 backdrop-blur-xl">
      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.05),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.05),transparent_40%)]" />

      <div className="relative mx-auto max-w-7xl px-6 py-28">
        {/* Header */}

        <div className="max-w-3xl">
          <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-600 shadow-sm">
            Founder feedback
          </div>

          <h2 className="mt-8 text-5xl font-bold tracking-tight text-zinc-950 lg:text-6xl">
            What teams discovered after running their audit.
          </h2>

          <p className="mt-8 text-xl leading-9 text-zinc-600">
            Early users used Spendora to identify duplicate subscriptions,
            over-provisioned plans, and hidden AI tooling costs across
            engineering and operations teams.
          </p>
        </div>

        {/* Grid */}

        <div className="mt-20 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map(
            (
              testimonial,
              index
            ) => (
              <div
                key={index}
                className="group relative overflow-hidden rounded-[32px] border border-white/70 bg-white/60 p-8 shadow-[0_16px_50px_rgba(15,23,42,0.06)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-zinc-200 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
              >
                {/* Glow */}

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,0,0,0.04),transparent_45%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Quote */}

                <div className="relative">
                  <div className="text-6xl leading-none text-zinc-300">
                    “
                  </div>

                  <p className="-mt-4 text-lg leading-9 text-zinc-700">
                    {
                      testimonial.quote
                    }
                  </p>
                </div>

                {/* Footer */}

                <div className="relative mt-10 border-t border-zinc-200 pt-6">
                  <p className="font-semibold text-zinc-950">
                    {
                      testimonial.name
                    }
                  </p>

                  <p className="mt-1 text-sm text-zinc-500">
                    {
                      testimonial.role
                    }
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
