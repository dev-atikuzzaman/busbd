import Link from "next/link";
import TripCard from "@/components/TripCard";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { mockTrips, mockSeatsByTrip } from "@/lib/mock-data";
import type { Trip } from "@/lib/database.types";

async function getTrips(from: string, to: string, date: string): Promise<Trip[]> {
  if (!isSupabaseConfigured) {
    // Demo mode: filter the bundled mock trips.
    return mockTrips.filter(
      (t) =>
        t.from_city.toLowerCase() === from.toLowerCase() &&
        t.to_city.toLowerCase() === to.toLowerCase()
    );
  }

  const dayStart = `${date}T00:00:00`;
  const dayEnd = `${date}T23:59:59`;
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .eq("from_city", from)
    .eq("to_city", to)
    .gte("departure_time", dayStart)
    .lte("departure_time", dayEnd)
    .order("departure_time", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

function seatsLeftFor(tripId: string) {
  const seats = mockSeatsByTrip[tripId];
  if (!seats) return 32; // unknown trip (live Supabase data) — placeholder
  return seats.filter((s) => s.status === "available").length;
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { from?: string; to?: string; date?: string };
}) {
  const from = searchParams.from ?? "Rajshahi";
  const to = searchParams.to ?? "Comilla (Cumilla)";
  const date = searchParams.date ?? new Date().toISOString().slice(0, 10);

  const trips = await getTrips(from, to, date);

  return (
    <main className="min-h-screen pb-16">
      <header className="bg-teal-600 px-5 py-5 text-white sm:px-8">
        <Link href="/" className="text-xs font-semibold text-teal-100">
          ← Change search
        </Link>
        <h1 className="mt-1 font-display text-xl font-bold">
          {from} → {to}
        </h1>
        <p className="text-sm text-teal-100">
          {new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
      </header>

      <div className="mx-auto mt-5 max-w-xl space-y-4 px-5 sm:px-8">
        {trips.length === 0 && (
          <div className="rounded-xl2 bg-white p-6 text-center shadow-card">
            <p className="font-display font-semibold text-ink-900">
              No buses found for this route today.
            </p>
            <p className="mt-1 text-sm text-ink-400">
              Try a different date or route.
            </p>
          </div>
        )}
        {trips.map((trip) => (
          <TripCard key={trip.id} trip={trip} seatsLeft={seatsLeftFor(trip.id)} />
        ))}
      </div>
    </main>
  );
}
