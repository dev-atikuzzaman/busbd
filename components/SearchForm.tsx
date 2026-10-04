"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const cities = [
  "Dhaka",
  "Rajshahi",
  "Chattogram",
  "Comilla (Cumilla)",
  "Sylhet",
  "Khulna",
  "Natore",
  "Cox's Bazar",
];

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export default function SearchForm() {
  const router = useRouter();
  const [from, setFrom] = useState("Rajshahi");
  const [to, setTo] = useState("Comilla (Cumilla)");
  const [date, setDate] = useState(todayIso());
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (from === to) {
      setError("Pick two different cities.");
      return;
    }
    setError("");
    const params = new URLSearchParams({ from, to, date });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative z-10 rounded-xl2 bg-white p-5 shadow-card sm:p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            From
          </span>
          <select
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-100 bg-ink-50 px-3 py-2.5 text-ink-900 focus:border-teal-500 focus:outline-none"
          >
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Going to
          </span>
          <select
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-100 bg-ink-50 px-3 py-2.5 text-ink-900 focus:border-teal-500 focus:outline-none"
          >
            {cities.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
            Departing on
          </span>
          <input
            type="date"
            value={date}
            min={todayIso()}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-lg border border-ink-100 bg-ink-50 px-3 py-2.5 text-ink-900 focus:border-teal-500 focus:outline-none"
          />
        </label>
      </div>

      {error && <p className="mt-3 text-sm text-coral-600">{error}</p>}

      <button
        type="submit"
        className="mt-5 w-full rounded-lg bg-coral-500 py-3 font-display text-base font-semibold text-white shadow-lift transition active:scale-[0.99] sm:w-auto sm:px-10"
      >
        Search buses
      </button>
    </form>
  );
}
