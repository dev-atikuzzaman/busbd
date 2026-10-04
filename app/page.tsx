import SearchForm from "@/components/SearchForm";

export default function HomePage() {
  return (
    <main className="min-h-screen pb-16">
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-teal-600 to-teal-500 px-5 pb-24 pt-10 text-white sm:px-8">
        <svg
          className="pointer-events-none absolute inset-x-0 top-0 h-full w-full opacity-30"
          viewBox="0 0 400 300"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M -20 60 C 80 10, 160 140, 260 90 S 420 10, 440 60"
            className="journey-path"
            stroke="white"
            strokeWidth="2"
            fill="none"
          />
          <circle cx="0" cy="58" r="5" fill="#FFC93C" />
          <circle cx="400" cy="58" r="5" fill="#FB7A3C" />
        </svg>

        <div className="relative mx-auto max-w-xl">
          <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-sun-100">
            সারাদেশে বাস টিকেট
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight sm:text-4xl">
            Book your seat before the journey books itself.
          </h1>
          <p className="mt-3 max-w-md text-teal-50">
            Compare coaches, pick an exact seat, and get your ticket on your
            phone — no counter queue.
          </p>
        </div>
      </section>

      <div className="mx-auto -mt-16 max-w-xl px-5 sm:px-8">
        <SearchForm />
      </div>

      <section className="mx-auto mt-10 max-w-xl px-5 sm:px-8">
        <h2 className="font-display text-lg font-bold text-ink-900">
          Popular routes
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {[
            ["Dhaka", "Cox's Bazar"],
            ["Rajshahi", "Comilla (Cumilla)"],
            ["Dhaka", "Sylhet"],
            ["Chattogram", "Khulna"],
          ].map(([a, b]) => (
            <a
              key={`${a}-${b}`}
              href={`/search?from=${encodeURIComponent(a)}&to=${encodeURIComponent(
                b
              )}&date=${new Date().toISOString().slice(0, 10)}`}
              className="rounded-lg border border-ink-100 bg-white px-3 py-3 text-sm font-medium text-ink-600 transition hover:border-teal-500 hover:text-teal-600"
            >
              {a} → {b}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
