# Jatri — Bus Ticket Booking PWA

A mobile-first, installable (Android/iOS) bus ticket booking app: route
search → interactive seat map → passenger details → e-ticket confirmation.
Built with Next.js 14 (App Router), Tailwind CSS, and Supabase.

Runs out of the box with **mock data** — no Supabase project needed to try
it. Connect Supabase whenever you're ready to go live.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. Try the demo route **Rajshahi → Comilla
(Cumilla)**, today's date — it's pre-seeded in `lib/mock-data.ts`.

## Connect Supabase (optional, for real data)

1. Create a project at https://supabase.com.
2. In the SQL editor, run `supabase/schema.sql` — it creates `trips`,
   `seats`, `bookings`, plus Row Level Security policies and a trigger that
   prevents a seat from being double-booked.
3. Copy `.env.local.example` to `.env.local` and fill in your project's
   URL and anon key (Project Settings → API).
4. Restart `npm run dev`. The app automatically switches from mock data to
   live Supabase queries — see `lib/supabase.ts` (`isSupabaseConfigured`).

## Deploy to Vercel with credentials kept separate

This is the part you asked about specifically — **Supabase keys are never
committed to the repo.** They're read from environment variables:

1. Push this project to a GitHub repo and import it in Vercel.
2. In Vercel: **Project → Settings → Environment Variables**, add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. You can set different values per environment (Production / Preview /
   Development) — e.g. a staging Supabase project for Preview deploys and
   a production one for Production. Vercel injects them at build time;
   `.env.local` (your local copy) is git-ignored and never leaves your
   machine.
4. Deploy. The anon key is safe to expose client-side **only** because
   Row Level Security policies in `schema.sql` restrict what it can do —
   don't disable RLS.

## Install as an app (PWA)

The app ships a `manifest.json` and a service worker (via `next-pwa`,
enabled in production builds). On Android Chrome, visiting the deployed
site shows an "Install app" prompt; on iOS Safari, use Share → "Add to
Home Screen". Icons live in `public/icons/` — swap them for your own
brand mark any time.

## Project structure

```
app/
  page.tsx                      Landing page + search
  search/page.tsx                Route results
  trip/[id]/page.tsx             Seat map + passenger form + fare summary
  booking/[id]/confirmation/     E-ticket
components/
  SearchForm, TripCard, SeatMap, PassengerForm, BookingFlow
lib/
  supabase.ts                    Client, reads env vars
  database.types.ts              Trip / Seat / Booking types
  mock-data.ts                   Demo data used when Supabase isn't configured
supabase/
  schema.sql                     Tables, indexes, RLS, anti-double-booking trigger
```

## What's intentionally out of scope for this MVP

Built for one bus operator. If you want this as a **multi-operator SaaS**
(each operator manages their own routes/fares/counters under one
platform), the schema needs a tenant column + RLS per tenant, plus an
operator admin panel — ask and we can scope that as a next phase.

Also not wired up yet, by design (needs real accounts/credentials you'll
provide):
- Payment gateway (bKash / Nagad / SSLCommerz) — `payment_method` is a
  plain text field on `bookings`, ready for a gateway integration
- SMS/email delivery of the ticket
- Admin panel for operators to manage trips, seats, and fares
