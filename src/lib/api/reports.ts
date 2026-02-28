import { getSupabase } from '@/lib/supabase';

export type ReportPlatform = 'miricanvas' | 'genspark';

export interface ReportItem {
  id: number;
  title: string;
  title_en: string | null;
  description: string;
  description_en: string | null;
  platform: ReportPlatform;
  url: string;
  tags: string[];
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateReportData {
  title: string;
  title_en?: string;
  description: string;
  description_en?: string;
  platform: ReportPlatform;
  url: string;
  tags?: string[];
  sort_order?: number;
  is_published?: boolean;
}

export type UpdateReportData = Partial<CreateReportData>;

/** 공개 연구보고서 조회 */
export async function getPublishedReports(): Promise<ReportItem[]> {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('pub_reports')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch reports:', error.message);
    return [];
  }

  return (data as ReportItem[]) || [];
}

/** 전체 연구보고서 조회 (관리자용) */
export async function getReportsAdmin(): Promise<ReportItem[]> {
  const client = getSupabase();
  if (!client) return [];

  const { data, error } = await client
    .from('pub_reports')
    .select('*')
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch reports (admin):', error.message);
    return [];
  }

  return (data as ReportItem[]) || [];
}

/** 연구보고서 생성 */
export async function createReport(
  reportData: CreateReportData,
): Promise<ReportItem> {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client
    .from('pub_reports')
    .insert(reportData)
    .select()
    .single();

  if (error) throw error;
  return data as ReportItem;
}

/** 연구보고서 수정 */
export async function updateReport(
  id: number,
  reportData: UpdateReportData,
): Promise<ReportItem> {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client
    .from('pub_reports')
    .update(reportData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as ReportItem;
}

/** 연구보고서 삭제 */
export async function deleteReport(id: number): Promise<void> {
  const client = getSupabase();
  if (!client) throw new Error('Supabase not configured');

  const { error } = await client
    .from('pub_reports')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
