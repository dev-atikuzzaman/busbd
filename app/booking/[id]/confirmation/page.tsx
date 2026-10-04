"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Trip, Seat, Passenger } from "@/lib/database.types";

interface StoredBooking {
  trip: Trip;
  seats: Seat[];
  passenger: Passenger;
  fareTotal: number;
  convenienceCharge: number;
  netTotal: number;
}

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const [booking, setBooking] = useState<StoredBooking | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem(`booking-${params.id}`);
    if (!raw) {
      setNotFound(true);
      return;
    }
    setBooking(JSON.parse(raw));
  }, [params.id]);

  if (notFound) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="font-display text-lg font-bold text-ink-900">
          Booking not found
        </p>
        <p className="text-sm text-ink-400">
          This ticket link has expired or belongs to another session.
        </p>
        <Link href="/" className="mt-2 text-sm font-semibold text-teal-600">
          Start a new search
        </Link>
      </main>
    );
  }

  if (!booking) return null;

  const { trip, seats, passenger, netTotal } = booking;

  return (
    <main className="min-h-screen bg-ink-50 px-5 py-8 sm:px-8">
      <div className="mx-auto max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-500 text-white">
            <CheckIcon />
          </div>
          <h1 className="mt-4 font-display text-xl font-extrabold text-ink-900">
            Ticket confirmed
          </h1>
          <p className="mt-1 text-sm text-ink-400">
            Booking ID <span className="font-semibold text-ink-900">{params.id}</span>
          </p>
        </div>

        <div className="ticket-notch relative mt-6 overflow-hidden rounded-xl2 bg-white shadow-card">
          <div
            className="bg-teal-600 px-5 py-4 text-white"
            style={{ ["--notch-bg" as string]: "#0F766E" }}
          >
            <p className="font-display text-base font-bold">
              {trip.from_city} → {trip.to_city}
            </p>
            <p className="text-sm text-teal-100">
              {trip.operator_name} · {trip.coach_type} · {trip.coach_no}
            </p>
          </div>

          <div className="space-y-3 p-5 text-sm">
            <DetailRow label="Passenger" value={passenger.name} />
            <DetailRow label="Mobile" value={passenger.mobile} />
            <DetailRow
              label="Seats"
              value={seats.map((s) => s.seat_no).join(", ")}
            />
            <DetailRow label="Boarding point" value={passenger.boarding_point} />
            <DetailRow label="Dropping point" value={passenger.dropping_point} />
            <DetailRow
              label="Departure"
              value={new Date(trip.departure_time).toLocaleString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
                hour: "numeric",
                minute: "2-digit",
              })}
            />
            <div className="route-dash" />
            <DetailRow label="Amount paid" value={`৳${netTotal.toLocaleString()}`} bold />
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-ink-400">
          A copy of this ticket has been sent to your mobile number. Show this
          screen, or a printout, when boarding.
        </p>

        <Link
          href="/"
          className="mt-6 block rounded-lg bg-teal-600 py-3 text-center font-display font-semibold text-white"
        >
          Book another trip
        </Link>
      </div>
    </main>
  );
}

function DetailRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-400">{label}</span>
      <span className={bold ? "font-display font-bold text-ink-900" : "text-ink-900"}>
        {value}
      </span>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
