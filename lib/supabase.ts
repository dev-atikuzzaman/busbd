import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

// These two values are read from environment variables so the real
// Supabase project URL and anon key never live in the codebase.
//
// Local dev:   set them in `.env.local` (see `.env.local.example`)
// Production:  set them in Vercel → Project → Settings → Environment Variables
//              NEXT_PUBLIC_SUPABASE_URL
//              NEXT_PUBLIC_SUPABASE_ANON_KEY
// Vercel lets you scope each variable to Production / Preview / Development
// separately, so a staging Supabase project and a production one can both
// be wired up without touching code.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function assertEnv(name: string, value: string | undefined): asserts value is string {
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env.local for local dev, or to your Vercel ` +
        `project's Environment Variables for deployed builds. See README.md.`
    );
  }
}

// In demo mode (no env vars set yet) we avoid throwing at import time so the
// UI can still render with mock data — see lib/mock-data.ts.
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl as string, supabaseAnonKey as string)
  : (null as unknown as ReturnType<typeof createClient<Database>>);

export function requireSupabase() {
  assertEnv("NEXT_PUBLIC_SUPABASE_URL", supabaseUrl);
  assertEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", supabaseAnonKey);
  return supabase;
}
