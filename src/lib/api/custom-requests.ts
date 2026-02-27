import { getSupabase } from '@/lib/supabase';

export interface CustomRequest {
  id: number;
  title: string;
  request_type: 'ebook' | 'textbook' | 'material' | 'lecture' | 'other';
  content: string;
  quantity: number;
  deadline: string | null;
  author_name: string;
  author_email: string;
  author_phone: string | null;
  user_id: string | null;
  status: 'pending' | 'reviewing' | 'completed' | 'cancelled';
  admin_reply: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomRequestData {
  title: string;
  request_type: CustomRequest['request_type'];
  content: string;
  quantity?: number;
  deadline?: string;
  author_name: string;
  author_email: string;
  author_phone?: string;
}

/** 목록 조회 (최신순, 페이지네이션) */
export async function getCustomRequests(
  page = 1,
  pageSize = 20,
): Promise<{ data: CustomRequest[]; count: number }> {
  const client = getSupabase();
  if (!client) return { data: [], count: 0 };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await client
    .from('custom_requests')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Failed to fetch custom requests:', error.message);
    return { data: [], count: 0 };
  }

  return { data: (data as CustomRequest[]) || [], count: count || 0 };
}

/** 단건 조회 */
export async function getCustomRequest(id: number): Promise<CustomRequest | null> {
  const client = getSupabase();
  if (!client) return null;

  const { data, error } = await client
    .from('custom_requests')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Failed to fetch custom request:', error.message);
    return null;
  }

  return data as CustomRequest;
}

/** 등록 */
export async function createCustomRequest(
  formData: CreateCustomRequestData,
): Promise<CustomRequest | null> {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const session = await client.auth.getSession();
  const userId = session.data.session?.user?.id;

  if (!userId) throw new Error('Authentication required');

  const { data, error } = await client
    .from('custom_requests')
    .insert({
      ...formData,
      user_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return data as CustomRequest;
}

/** 삭제 */
export async function deleteCustomRequest(id: number): Promise<void> {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { error } = await client
    .from('custom_requests')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
