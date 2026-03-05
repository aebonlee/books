import { getSupabase } from '@/lib/supabase';

export interface MemberProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  provider: string | null;
  role: string | null;
  signup_domain: string | null;
  created_at: string;
}

export async function getBooksSiteMembers(): Promise<MemberProfile[]> {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('user_profiles')
    .select('id, email, display_name, avatar_url, provider, role, signup_domain, created_at')
    .eq('signup_domain', 'books.dreamitbiz.com')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch members:', error);
    return [];
  }

  return (data ?? []) as MemberProfile[];
}
