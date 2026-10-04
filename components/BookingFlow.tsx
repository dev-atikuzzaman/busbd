"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import SeatMap from "@/components/SeatMap";
import PassengerForm from "@/components/PassengerForm";
import type { Trip, Seat, Passenger } from "@/lib/database.types";

const CONVENIENCE_CHARGE_RATE = 0.015; // 1.5% — shown as a line item, adjust per gateway

const emptyPassenger: Passenger = {
  name: "",
  mobile: "",
  email: "",
  gender: "Male",
  age: undefined,
  address: "",
  boarding_point: "",
  dropping_point: "",
};

export default function BookingFlow({
  trip,
  seats,
  boardingPoints,
  droppingPoints,
}: {
  trip: Trip;
  seats: Seat[];
  boardingPoints: string[];
  droppingPoints: string[];
}) {
  const router = useRouter();
  const [selectedSeatIds, setSelectedSeatIds] = useState<string[]>([]);
  const [passenger, setPassenger] = useState<Passenger>(emptyPassenger);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const selectedSeats = seats.filter((s) => selectedSeatIds.includes(s.id));
  const fareTotal = selectedSeats.length * trip.fare;
  const convenienceCharge = Math.round(fareTotal * CONVENIENCE_CHARGE_RATE);
  const netTotal = fareTotal + convenienceCharge;

  const canConfirm = useMemo(() => {
    return (
      selectedSeats.length > 0 &&
      passenger.name.trim().length > 0 &&
      passenger.mobile.trim().length >= 10 &&
      passenger.boarding_point &&
      passenger.dropping_point &&
      agreed
    );
  }, [selectedSeats.length, passenger, agreed]);

  function toggleSeat(seat: Seat) {
    setSelectedSeatIds((prev) => {
      if (prev.includes(seat.id)) return prev.filter((id) => id !== seat.id);
      if (prev.length >= 4) return prev;
      return [...prev, seat.id];
    });
  }

  async function handleConfirm() {
    if (!canConfirm) return;
    setSubmitting(true);

    // Wire this up to a real insert once Supabase is connected, e.g.:
    //   const { data, error } = await supabase.from("bookings").insert({...}).select().single();
    // For now this creates a demo booking id and moves to the confirmation screen.
    const bookingId = `JT-${Date.now().toString(36).toUpperCase()}`;

    const payload = {
      trip,
      seats: selectedSeats,
      passenger,
      fareTotal,
      convenienceCharge,
      netTotal,
    };
    sessionStorage.setItem(`booking-${bookingId}`, JSON.stringify(payload));

    router.push(`/booking/${bookingId}/confirmation`);
  }

  return (
    <div className="pb-28">
      <section className="px-5 pt-5 sm:px-8">
        <h2 className="font-display text-base font-bold text-ink-900">
          1. Choose your seats
        </h2>
        <div className="mt-3">
          <SeatMap seats={seats} selected={selectedSeatIds} onToggle={toggleSeat} />
        </div>
      </section>

      <section className="mt-8 px-5 sm:px-8">
        <h2 className="font-display text-base font-bold text-ink-900">
          2. Passenger details
        </h2>
        <div className="mt-3 rounded-xl2 border border-ink-100 bg-white p-4">
          <PassengerForm
            value={passenger}
            onChange={setPassenger}
            boardingPoints={boardingPoints}
            droppingPoints={droppingPoints}
          />
        </div>
      </section>

      <section className="mt-8 px-5 sm:px-8">
        <h2 className="font-display text-base font-bold text-ink-900">
          3. Fare summary
        </h2>
        <div className="mt-3 space-y-2 rounded-xl2 border border-ink-100 bg-white p-4 text-sm">
          <Row label={`Seats (${selectedSeats.length})`}>
            {selectedSeats.map((s) => s.seat_no).join(", ") || "—"}
          </Row>
          <Row label="Fare">৳{fareTotal.toLocaleString()}</Row>
          <Row label="Convenience charge">৳{convenienceCharge.toLocaleString()}</Row>
          <div className="route-dash" />
          <Row label="Total" bold>
            ৳{netTotal.toLocaleString()}
          </Row>
        </div>

        <label className="mt-4 flex items-start gap-2 text-sm text-ink-600">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5"
          />
          I agree to the{" "}
          <span className="text-teal-600 underline">terms and conditions</span>
        </label>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink-100 bg-white/95 px-5 py-3 backdrop-blur sm:px-8">
        <div className="mx-auto flex max-w-xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-ink-400">Total</p>
            <p className="font-display text-lg font-extrabold text-ink-900">
              ৳{netTotal.toLocaleString()}
            </p>
          </div>
          <button
            type="button"
            disabled={!canConfirm || submitting}
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-coral-500 py-3 font-display font-semibold text-white shadow-lift transition active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-ink-100 disabled:text-ink-400 disabled:shadow-none sm:flex-none sm:px-10"
          >
            {submitting ? "Confirming…" : "Confirm booking"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  children,
  bold,
}: {
  label: string;
  children: React.ReactNode;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-ink-400">{label}</span>
      <span className={bold ? "font-display font-bold text-ink-900" : "text-ink-900"}>
        {children}
      </span>
    </div>
  );
}
