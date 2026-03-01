import { getSupabase } from '@/lib/supabase';

export type GalleryCategory = 'digital' | 'textbooks' | 'lectures';

export interface GalleryItem {
  id: number;
  slug: string;
  title: string;
  title_en: string | null;
  description: string;
  description_en: string | null;
  category: GalleryCategory;
  cover_image: string;
  price: number;
  is_free: boolean;
  featured: boolean;
  sort_order: number;
  is_published: boolean;
  author_name: string | null;
  sub_images: string[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateGalleryItemData {
  slug: string;
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  category: GalleryCategory;
  cover_image?: string;
  price?: number;
  is_free?: boolean;
  featured?: boolean;
  sort_order?: number;
  is_published?: boolean;
  author_name?: string;
  sub_images?: string[];
  tags?: string[];
}

export type UpdateGalleryItemData = Partial<CreateGalleryItemData>;

/** 공개 항목 조회 (카테고리 페이지용) */
export async function getGalleryItemsByCategory(
  category: GalleryCategory,
): Promise<GalleryItem[]> {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('pub_gallery_items')
    .select('*')
    .eq('category', category)
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch gallery items:', error.message);
    return [];
  }

  return (data as GalleryItem[]) || [];
}

/** 공개 항목 전체 조회 (카탈로그용, 카테고리 무관) */
export async function getAllPublishedGalleryItems(): Promise<GalleryItem[]> {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('pub_gallery_items')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch all gallery items:', error.message);
    return [];
  }

  return (data as GalleryItem[]) || [];
}

/** 전체 항목 조회 (관리자용, 비공개 포함) */
export async function getGalleryItemsAdmin(
  category?: GalleryCategory,
): Promise<GalleryItem[]> {
  const client = getSupabase();
  if (!client) return [];

  let query = client
    .from('pub_gallery_items')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Failed to fetch gallery items (admin):', error.message);
    return [];
  }

  return (data as GalleryItem[]) || [];
}

/** 항목 생성 */
export async function createGalleryItem(
  itemData: CreateGalleryItemData,
): Promise<GalleryItem> {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client
    .from('pub_gallery_items')
    .insert(itemData)
    .select()
    .single();

  if (error) throw error;
  return data as GalleryItem;
}

/** 항목 수정 */
export async function updateGalleryItem(
  id: number,
  itemData: UpdateGalleryItemData,
): Promise<GalleryItem> {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client
    .from('pub_gallery_items')
    .update(itemData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as GalleryItem;
}

/** 항목 삭제 */
export async function deleteGalleryItem(id: number): Promise<void> {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { error } = await client
    .from('pub_gallery_items')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

/** Supabase Storage 이미지 업로드 */
export async function uploadCoverImage(
  file: File,
  slug: string,
): Promise<string> {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const ext = file.name.split('.').pop() || 'png';
  const path = `gallery-covers/${slug}-${Date.now()}.${ext}`;

  const { error } = await client.storage
    .from('public-assets')
    .upload(path, file, { upsert: true });

  if (error) throw error;

  const { data: urlData } = client.storage
    .from('public-assets')
    .getPublicUrl(path);

  return urlData.publicUrl;
}
