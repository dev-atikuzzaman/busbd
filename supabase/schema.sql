-- Jatri bus booking — core schema
-- Run this in the Supabase SQL editor (or via `supabase db push`).
-- Kept single-tenant for the MVP; add an `operator_id` / tenant column
-- later if this grows into a multi-operator SaaS product.

create extension if not exists "pgcrypto";

create table if not exists trips (
  id uuid primary key default gen_random_uuid(),
  operator_name text not null,
  from_city text not null,
  to_city text not null,
  departure_time timestamptz not null,
  arrival_time timestamptz not null,
  coach_type text not null check (coach_type in ('AC', 'Non-AC', 'Sleeper')),
  coach_no text not null,
  fare numeric(10, 2) not null check (fare >= 0),
  starting_point text not null,
  ending_point text not null,
  total_seats int not null default 36,
  created_at timestamptz not null default now()
);
create index if not exists trips_route_date_idx
  on trips (from_city, to_city, departure_time);

create table if not exists seats (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips (id) on delete cascade,
  seat_no text not null,
  row_label text not null,
  status text not null default 'available'
    check (status in ('available', 'booked', 'blocked', 'ladies')),
  unique (trip_id, seat_no)
);
create index if not exists seats_trip_idx on seats (trip_id);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid not null references trips (id),
  seat_ids uuid[] not null,
  passenger_name text not null,
  passenger_mobile text not null,
  passenger_email text,
  passenger_gender text not null check (passenger_gender in ('Male', 'Female')),
  passenger_age int,
  passenger_address text,
  boarding_point text not null,
  dropping_point text not null,
  fare_total numeric(10, 2) not null,
  convenience_charge numeric(10, 2) not null,
  net_total numeric(10, 2) not null,
  payment_method text,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'cancelled')),
  created_at timestamptz not null default now()
);
create index if not exists bookings_trip_idx on bookings (trip_id);

-- Keep a seat from being double-booked: flip it to 'booked' the moment a
-- booking is confirmed, inside the same transaction as the insert.
create or replace function mark_seats_booked()
returns trigger as $$
begin
  if new.status = 'confirmed' then
    update seats set status = 'booked'
    where id = any(new.seat_ids) and status = 'available';

    if not found then
      raise exception 'One or more selected seats are no longer available';
    end if;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_mark_seats_booked
  before insert on bookings
  for each row execute function mark_seats_booked();

-- Row Level Security -----------------------------------------------------
-- Public (anon) can read trip/seat availability and create a booking, but
-- cannot read other people's bookings or edit trips/seats directly. Swap
-- these for proper operator-auth policies once staff accounts exist.

alter table trips enable row level security;
alter table seats enable row level security;
alter table bookings enable row level security;

create policy "Public can read trips" on trips
  for select using (true);

create policy "Public can read seats" on seats
  for select using (true);

create policy "Public can create a booking" on bookings
  for insert with check (true);

-- Bookings are not publicly readable by default — fetch by id through a
-- server-side route (using the service role key) once you wire up
-- "view my ticket" by booking id + mobile number.
