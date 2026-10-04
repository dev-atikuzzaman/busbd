import Link from "next/link";
import type { Trip } from "@/lib/database.types";

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const coachBadge: Record<Trip["coach_type"], string> = {
  AC: "bg-teal-50 text-teal-700",
  "Non-AC": "bg-ink-100 text-ink-600",
  Sleeper: "bg-sun-100 text-ink-900",
};

export default function TripCard({
  trip,
  seatsLeft,
}: {
  trip: Trip;
  seatsLeft: number;
}) {
  return (
    <Link
      href={`/trip/${trip.id}`}
      className="ticket-notch relative block overflow-hidden rounded-xl2 bg-white shadow-card transition hover:shadow-lift"
      style={{ ["--notch-bg" as string]: "#F6F8F7" }}
    >
      <div className="flex items-start justify-between p-4">
        <div>
          <p className="font-display text-sm font-bold text-ink-900">
            {trip.operator_name}
          </p>
          <span
            className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${coachBadge[trip.coach_type]}`}
          >
            {trip.coach_type} · {trip.coach_no}
          </span>
        </div>
        <div className="text-right">
          <p className="font-display text-lg font-extrabold text-coral-500">
            ৳{trip.fare.toLocaleString()}
          </p>
          <p className="text-xs text-ink-400">per seat</p>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4">
        <div className="text-center">
          <p className="font-display text-base font-bold text-ink-900">
            {formatTime(trip.departure_time)}
          </p>
          <p className="text-xs text-ink-400">{trip.starting_point}</p>
        </div>
        <div className="route-dash flex-1" />
        <div className="text-center">
          <p className="font-display text-base font-bold text-ink-900">
            {formatTime(trip.arrival_time)}
          </p>
          <p className="text-xs text-ink-400">{trip.ending_point}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-dashed border-ink-100 px-4 py-3">
        <span
          className={`text-xs font-semibold ${seatsLeft > 5 ? "text-teal-600" : "text-coral-600"}`}
        >
          {seatsLeft} seats available
        </span>
        <span className="text-xs font-semibold text-teal-600">
          Select seats →
        </span>
      </div>
    </Link>
  );
}
