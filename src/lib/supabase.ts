import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hcmgdztsgjvzcyxyayaj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_vYCKlU2lbPkXpUDj1sILow_DskJCRVS';

let supabase: SupabaseClient | null = null;
let initFailed = false;

export function getSupabase(): SupabaseClient | null {
  if (typeof window === 'undefined') return null;
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

export type { SupabaseClient };
