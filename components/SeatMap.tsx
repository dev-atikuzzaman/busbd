"use client";

import type { Seat } from "@/lib/database.types";

const seatStyles: Record<Seat["status"] | "selected", string> = {
  available: "bg-white border-ink-100 text-ink-600 hover:border-teal-500",
  booked: "bg-ink-100 border-ink-100 text-ink-400 cursor-not-allowed",
  blocked: "bg-ink-100 border-ink-100 text-ink-400 cursor-not-allowed",
  ladies: "bg-coral-50 border-coral-100 text-coral-600 hover:border-coral-500",
  selected: "bg-teal-500 border-teal-500 text-white",
};

export default function SeatMap({
  seats,
  selected,
  onToggle,
  maxSelectable = 4,
}: {
  seats: Seat[];
  selected: string[];
  onToggle: (seat: Seat) => void;
  maxSelectable?: number;
}) {
  const rows = Array.from(new Set(seats.map((s) => s.row)));

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-400">
        <LegendDot className="border-ink-100 bg-white" label="Available" />
        <LegendDot className="border-teal-500 bg-teal-500" label="Selected" />
        <LegendDot className="border-ink-100 bg-ink-100" label="Booked" />
        <LegendDot className="border-coral-100 bg-coral-50" label="Ladies seat" />
      </div>

      <div className="rounded-xl2 border border-ink-100 bg-white p-4">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-ink-400">
          <span className="rounded-md border border-ink-100 px-2 py-1">
            🚗 Driver
          </span>
        </div>

        <div className="space-y-2">
          {rows.map((row) => {
            const rowSeats = seats.filter((s) => s.row === row);
            const left = rowSeats.slice(0, 2);
            const right = rowSeats.slice(2, 4);
            return (
              <div key={row} className="flex items-center gap-4">
                <div className="flex gap-2">
                  {left.map((seat) => (
                    <SeatButton
                      key={seat.id}
                      seat={seat}
                      isSelected={selected.includes(seat.id)}
                      disabled={
                        seat.status === "booked" || seat.status === "blocked"
                      }
                      onClick={() => onToggle(seat)}
                    />
                  ))}
                </div>
                <div className="w-4" />
                <div className="flex gap-2">
                  {right.map((seat) => (
                    <SeatButton
                      key={seat.id}
                      seat={seat}
                      isSelected={selected.includes(seat.id)}
                      disabled={
                        seat.status === "booked" || seat.status === "blocked"
                      }
                      onClick={() => onToggle(seat)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selected.length >= maxSelectable && (
        <p className="mt-2 text-xs text-coral-600">
          Up to {maxSelectable} seats per booking.
        </p>
      )}
    </div>
  );
}

function SeatButton({
  seat,
  isSelected,
  disabled,
  onClick,
}: {
  seat: Seat;
  isSelected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const style = isSelected ? seatStyles.selected : seatStyles[seat.status];
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={isSelected}
      aria-label={`Seat ${seat.seat_no}${disabled ? ", unavailable" : ""}`}
      className={`flex h-10 w-11 items-center justify-center rounded-lg border text-xs font-semibold transition ${style}`}
    >
      {seat.seat_no}
    </button>
  );
}

function LegendDot({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded border ${className}`} />
      {label}
    </span>
  );
}
