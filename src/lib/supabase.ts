import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

const supabaseStorageKey = supabaseUrl
  ? `sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`
  : null;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        ...(supabaseStorageKey ? { storageKey: supabaseStorageKey } : {}),
      },
    })
  : null;

export function clearStoredSupabaseSession() {
  if (typeof window === "undefined" || !supabaseStorageKey) return;
  window.localStorage.removeItem(supabaseStorageKey);
  window.localStorage.removeItem(`${supabaseStorageKey}-code-verifier`);
}

export class SupabaseConfigurationError extends Error {
  constructor() {
    super(
      "Scholaport is not connected to Supabase. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    );
    this.name = "SupabaseConfigurationError";
  }
}

export function requireSupabase(): SupabaseClient {
  if (!supabase) throw new SupabaseConfigurationError();
  return supabase;
}
