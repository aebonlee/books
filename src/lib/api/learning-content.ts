import { getSupabase } from '@/lib/supabase';

export type LearningContentType = 'website' | 'exam' | 'interactive' | 'tool';

export interface LearningContentItem {
  id: number;
  title: string;
  title_en: string | null;
  description: string;
  description_en: string | null;
  content_type: LearningContentType;
  url: string;
  cover_image: string | null;
  published_date: string;
  price: number;
  tags: string[];
  sort_order: number;
  is_free: boolean;
  featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateLearningContentData {
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  content_type: LearningContentType;
  url: string;
  cover_image?: string;
  published_date: string;
  price?: number;
  tags?: string[];
  sort_order?: number;
  is_free?: boolean;
  featured?: boolean;
  is_published?: boolean;
}

export type UpdateLearningContentData = Partial<CreateLearningContentData>;

/** 공개 학습 콘텐츠 조회 */
export async function getPublishedLearningContents(): Promise<LearningContentItem[]> {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('pub_learning_contents')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch learning contents:', error.message);
    return [];
  }

  return (data as LearningContentItem[]) || [];
}

/** 전체 학습 콘텐츠 조회 (관리자용) */
export async function getLearningContentsAdmin(): Promise<LearningContentItem[]> {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('pub_learning_contents')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch learning contents (admin):', error.message);
    return [];
  }

  return (data as LearningContentItem[]) || [];
}

/** 학습 콘텐츠 생성 */
export async function createLearningContent(
  data: CreateLearningContentData,
): Promise<LearningContentItem> {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data: result, error } = await client
    .from('pub_learning_contents')
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return result as LearningContentItem;
}

/** 학습 콘텐츠 수정 */
export async function updateLearningContent(
  id: number,
  data: UpdateLearningContentData,
): Promise<LearningContentItem> {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data: result, error } = await client
    .from('pub_learning_contents')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return result as LearningContentItem;
}

/** 학습 콘텐츠 삭제 */
export async function deleteLearningContent(id: number): Promise<void> {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { error } = await client
    .from('pub_learning_contents')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
