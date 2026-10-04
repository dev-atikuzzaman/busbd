import Link from "next/link";
import { notFound } from "next/navigation";
import BookingFlow from "@/components/BookingFlow";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import {
  mockTrips,
  mockSeatsByTrip,
  boardingPoints,
  droppingPoints,
} from "@/lib/mock-data";
import type { Trip, Seat } from "@/lib/database.types";

async function getTripAndSeats(
  id: string
): Promise<{ trip: Trip; seats: Seat[] } | null> {
  if (!isSupabaseConfigured) {
    const trip = mockTrips.find((t) => t.id === id);
    if (!trip) return null;
    return { trip, seats: mockSeatsByTrip[id] ?? [] };
  }

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("*")
    .eq("id", id)
    .single();
  if (tripError || !trip) return null;

  const { data: seats, error: seatError } = await supabase
    .from("seats")
    .select("*")
    .eq("trip_id", id)
    .order("seat_no", { ascending: true });
  if (seatError) throw seatError;

  return { trip, seats: seats ?? [] };
}

export default async function TripPage({ params }: { params: { id: string } }) {
  const result = await getTripAndSeats(params.id);
  if (!result) notFound();
  const { trip, seats } = result;

  return (
    <main className="min-h-screen">
      <header className="bg-teal-600 px-5 py-5 text-white sm:px-8">
        <Link href="/search" className="text-xs font-semibold text-teal-100">
          ← Back to results
        </Link>
        <h1 className="mt-1 font-display text-lg font-bold">
          {trip.from_city} → {trip.to_city}
        </h1>
        <p className="text-sm text-teal-100">
          {trip.operator_name} · {trip.coach_type} · {trip.coach_no}
        </p>
      </header>

      <BookingFlow
        trip={trip}
        seats={seats}
        boardingPoints={boardingPoints}
        droppingPoints={droppingPoints}
      />
    </main>
  );
}
