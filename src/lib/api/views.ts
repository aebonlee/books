import { getSupabase } from '@/lib/supabase';

export async function incrementView(
  type: 'gallery' | 'book' | 'report',
  slug: string
): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) return 0;

  const { data, error } = await supabase.rpc('increment_view', {
    p_type: type,
    p_slug: slug,
  });

  if (error) {
    console.error('incrementView error:', error);
    return 0;
  }

  return data as number;
}

export async function getViewCounts(
  type: 'gallery' | 'book' | 'report',
  slugs: string[]
): Promise<Record<string, number>> {
  const supabase = getSupabase();
  if (!supabase || slugs.length === 0) return {};

  const { data, error } = await supabase
    .from('content_views')
    .select('content_slug, view_count')
    .eq('content_type', type)
    .in('content_slug', slugs);

  if (error) {
    console.error('getViewCounts error:', error);
    return {};
  }

  const map: Record<string, number> = {};
  for (const row of data || []) {
    map[row.content_slug] = row.view_count;
  }
  return map;
}

export async function getViewCount(
  type: 'gallery' | 'book' | 'report',
  slug: string
): Promise<number> {
  const supabase = getSupabase();
  if (!supabase) return 0;

  const { data, error } = await supabase
    .from('content_views')
    .select('view_count')
    .eq('content_type', type)
    .eq('content_slug', slug)
    .single();

  if (error) return 0;
  return data?.view_count ?? 0;
}
