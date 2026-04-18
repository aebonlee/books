import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

let supabase: SupabaseClient | null = null;
let initFailed = false;

export function getSupabase(): SupabaseClient | null {
  if (supabase) return supabase;
  if (initFailed) return null;
  if (!supabaseUrl || !supabaseAnonKey) return null;

  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        flowType: 'pkce',
        detectSessionInUrl: true,
        autoRefreshToken: true,
        persistSession: true,
      },
    });
    return supabase;
  } catch (err) {
    console.error('Supabase client init failed:', err);
    initFailed = true;
    return null;
  }
}

export default getSupabase;
export type { SupabaseClient };
