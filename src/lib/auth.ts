/**
 * Supabase Auth 헬퍼 — www.dreamitbiz.com과 동일 방식
 */
import { getSupabase } from './supabase';

/** 현재 페이지 URL (hash 제외) — OAuth 리다이렉트용 */
function currentPageUrl() {
  return window.location.origin + window.location.pathname + window.location.search;
}

/** Google OAuth 로그인 */
export async function signInWithGoogle(redirectTo?: string) {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: redirectTo || currentPageUrl() },
  });
  if (error) throw error;
  return data;
}

/** Kakao OAuth 로그인 */
export async function signInWithKakao(redirectTo?: string) {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');
  const { data, error } = await client.auth.signInWithOAuth({
    provider: 'kakao',
    options: {
      redirectTo: redirectTo || currentPageUrl(),
      scopes: 'profile_nickname profile_image account_email',
    },
  });
  if (error) throw error;
  return data;
}

/** 이메일/비밀번호 로그인 */
export async function signInWithEmail(email: string, password: string) {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');
  const { data, error } = await client.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

/** 로그아웃 — local scope로 OAuth 세션 만료 시 에러 방지 */
export async function signOut() {
  const client = getSupabase();
  if (!client) return;
  const { error } = await client.auth.signOut({ scope: 'local' });
  if (error) throw error;
}

/** 프로필 조회 */
export async function getProfile(userId: string) {
  const client = getSupabase();
  if (!client) return null;
  const { data, error } = await client
    .from('user_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) return null;
  return data;
}

export interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  provider?: string;
  role?: string;
  signup_domain?: string;
}
