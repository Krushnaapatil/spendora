export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">

      <section className="flex flex-col items-center justify-center px-6 py-32 text-center">
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight">
          Cut Waste From Your AI Stack
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400">
          Discover where your startup is overspending on AI tools and uncover better pricing opportunities instantly.
        </p>

        <button className="mt-8 rounded-xl bg-white px-6 py-3 text-black font-semibold transition hover:bg-zinc-200">
          Run Free Audit
        </button>
      </section>
    </main>
  );
}