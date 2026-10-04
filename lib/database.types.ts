export type SeatStatus = "available" | "booked" | "blocked" | "ladies";

export interface Trip {
  id: string;
  operator_name: string;
  from_city: string;
  to_city: string;
  departure_time: string; // ISO timestamp
  arrival_time: string; // ISO timestamp
  coach_type: "AC" | "Non-AC" | "Sleeper";
  coach_no: string;
  fare: number;
  starting_point: string;
  ending_point: string;
  total_seats: number;
}

export interface Seat {
  id: string;
  trip_id: string;
  seat_no: string; // e.g. "A1"
  row: string;
  status: SeatStatus;
}

export interface Passenger {
  name: string;
  mobile: string;
  email?: string;
  gender: "Male" | "Female";
  age?: number;
  address?: string;
  nid_or_passport?: string;
  boarding_point: string;
  dropping_point: string;
}

export interface Booking {
  id: string;
  trip_id: string;
  seat_ids: string[];
  passenger: Passenger;
  fare_total: number;
  convenience_charge: number;
  net_total: number;
  payment_method: string;
  status: "pending" | "confirmed" | "cancelled";
  created_at: string;
}

// Minimal Supabase Database generic — expand with `supabase gen types`
// once the real project is linked. Kept loose on purpose for the MVP.
export interface Database {
  public: {
    Tables: {
      trips: { Row: Trip; Insert: Partial<Trip>; Update: Partial<Trip> };
      seats: { Row: Seat; Insert: Partial<Seat>; Update: Partial<Seat> };
      bookings: {
        Row: Booking;
        Insert: Partial<Booking>;
        Update: Partial<Booking>;
      };
    };
  };
}
