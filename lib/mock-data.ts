import type { Trip, Seat } from "./database.types";

const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
const bookedSeats = new Set(["A3", "A4", "C3", "C4", "F1", "F2"]);
const ladiesSeats = new Set(["I1", "I2"]);

function buildSeats(tripId: string): Seat[] {
  const seats: Seat[] = [];
  rows.forEach((row) => {
    ["1", "2", "3", "4"].forEach((col) => {
      const seat_no = `${row}${col}`;
      let status: Seat["status"] = "available";
      if (bookedSeats.has(seat_no)) status = "booked";
      else if (ladiesSeats.has(seat_no)) status = "ladies";
      seats.push({
        id: `${tripId}-${seat_no}`,
        trip_id: tripId,
        seat_no,
        row,
        status,
      });
    });
  });
  return seats;
}

export const mockTrips: Trip[] = [
  {
    id: "trip-1",
    operator_name: "Jatri Express",
    from_city: "Rajshahi",
    to_city: "Comilla (Cumilla)",
    departure_time: "2026-10-02T16:00:00+06:00",
    arrival_time: "2026-10-03T08:00:00+06:00",
    coach_type: "Non-AC",
    coach_no: "505 · CHP-COX",
    fare: 1250,
    starting_point: "Chapai Counter",
    ending_point: "Jhawtala Counter",
    total_seats: 36,
  },
  {
    id: "trip-2",
    operator_name: "Jatri Express",
    from_city: "Rajshahi",
    to_city: "Comilla (Cumilla)",
    departure_time: "2026-10-02T16:30:00+06:00",
    arrival_time: "2026-10-03T08:30:00+06:00",
    coach_type: "Non-AC",
    coach_no: "509 · CHP-COX",
    fare: 1250,
    starting_point: "Chapai Counter",
    ending_point: "Jhawtala Counter",
    total_seats: 36,
  },
  {
    id: "trip-3",
    operator_name: "Jatri Gold",
    from_city: "Rajshahi",
    to_city: "Comilla (Cumilla)",
    departure_time: "2026-10-02T17:00:00+06:00",
    arrival_time: "2026-10-03T07:30:00+06:00",
    coach_type: "AC",
    coach_no: "010 · CHP-CTG",
    fare: 1850,
    starting_point: "Chapai Counter",
    ending_point: "Navigate Counter - 1",
    total_seats: 32,
  },
];

export const mockSeatsByTrip: Record<string, Seat[]> = Object.fromEntries(
  mockTrips.map((t) => [t.id, buildSeats(t.id)])
);

export const boardingPoints = ["Chapai Counter", "Rajshahi Bus Stand", "Natore Bypass"];
export const droppingPoints = ["Jhawtala Counter", "Comilla Town Hall", "Cumilla Cantonment"];
