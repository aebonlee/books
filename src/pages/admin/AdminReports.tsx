import { useEffect, useState, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { SEOHead } from '@/components/SEOHead';
import { getReportsAdmin, createReport, updateReport, deleteReport } from '@/lib/api/reports';
import type { ReportItem, ReportPlatform, CreateReportData } from '@/lib/api/reports';
import { resolveImageUrl } from '@/lib/utils';

const PLATFORM_OPTIONS: { value: ReportPlatform; labelKo: string; labelEn: string }[] = [
  { value: 'miricanvas', labelKo: '미리캔버스', labelEn: 'MiriCanvas' },
  { value: 'genspark', labelKo: '젠스파크', labelEn: 'Genspark' },
];

interface FormState {
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  body: string;
  body_en: string;
  platform: ReportPlatform;
  url: string;
  cover_image: string;
  published_date: string;
  price: string;
  tags: string;
  sort_order: string;
  is_free: boolean;
  featured: boolean;
  is_published: boolean;
}

const EMPTY_FORM: FormState = {
  title: '',
  title_en: '',
  description: '',
  description_en: '',
  body: '',
  body_en: '',
  platform: 'miricanvas',
  url: '',
  cover_image: '',
  published_date: new Date().toISOString().split('T')[0],
  price: '0',
  tags: '',
  sort_order: '0',
  is_free: false,
  featured: false,
  is_published: true,
};

export default function AdminReportsPage() {
  const { language } = useLanguage();
  const ko = language === 'ko';
  const { isLoggedIn, isAdmin, isLoading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [items, setItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ReportItem | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    const data = await getReportsAdmin();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) loadItems();
  }, [isAdmin, loadItems]);

  if (authLoading) {
    return <div className="flex min-h-[50vh] items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>;
  }

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{ko ? '접근 권한 없음' : 'Access Denied'}</h1>
        <p className="text-gray-500">{ko ? '관리자만 접근할 수 있습니다.' : 'Only administrators can access this page.'}</p>
      </div>
    );
  }

  const openCreateDialog = () => { setEditingItem(null); setForm(EMPTY_FORM); setDialogOpen(true); };

  const openEditDialog = (item: ReportItem) => {
    setEditingItem(item);
    setForm({
      title: item.title, title_en: item.title_en || '', description: item.description, description_en: item.description_en || '',
      body: item.body || '', body_en: item.body_en || '', platform: item.platform, url: item.url,
      cover_image: item.cover_image || '', published_date: item.published_date || '',
      price: String(item.price), tags: (item.tags || []).join(', '), sort_order: String(item.sort_order),
      is_free: item.is_free, featured: item.featured, is_published: item.is_published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.url || !form.published_date) {
      showToast(ko ? '제목, URL, 발표일을 입력해주세요' : 'Title, URL, and date are required', 'error');
      return;
    }
    setSaving(true);
    try {
      const payload: CreateReportData = {
        title: form.title, title_en: form.title_en || undefined, description: form.description, description_en: form.description_en || undefined,
        body: form.body || undefined, body_en: form.body_en || undefined, platform: form.platform, url: form.url,
        cover_image: form.cover_image || undefined, published_date: form.published_date,
        price: parseInt(form.price) || 0, tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        sort_order: parseInt(form.sort_order) || 0, is_free: form.is_free, featured: form.featured, is_published: form.is_published,
      };
      if (editingItem) { await updateReport(editingItem.id, payload); showToast(ko ? '보고서가 수정되었습니다' : 'Report updated', 'success'); }
      else { await createReport(payload); showToast(ko ? '보고서가 등록되었습니다' : 'Report created', 'success'); }
      setDialogOpen(false);
      loadItems();
    } catch (err) { console.error('Save failed:', err); showToast(ko ? '저장에 실패했습니다' : 'Save failed', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (item: ReportItem) => {
    if (!window.confirm(ko ? `"${item.title}" 보고서를 삭제하시겠습니까?` : `Delete "${item.title}"?`)) return;
    try { await deleteReport(item.id); showToast(ko ? '삭제되었습니다' : 'Deleted', 'success'); loadItems(); }
    catch (err) { console.error('Delete failed:', err); showToast(ko ? '삭제에 실패했습니다' : 'Delete failed', 'error'); }
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => { setForm((prev) => ({ ...prev, [key]: value })); };

  const getPlatformLabel = (platform: ReportPlatform) => {
    const opt = PLATFORM_OPTIONS.find((p) => p.value === platform);
    return ko ? opt?.labelKo : opt?.labelEn;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SEOHead title={ko ? '연구보고서 관리' : 'Reports Management'} />

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{ko ? '연구보고서 관리' : 'Reports Management'}</h1>
        <Button onClick={openCreateDialog}><Plus className="mr-2 h-4 w-4" />{ko ? '보고서 추가' : 'Add Report'}</Button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16"><Loader2 className="h-8 w-8 animate-spin text-gray-400" /></div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center text-gray-500">{ko ? '등록된 보고서가 없습니다' : 'No reports found'}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">{ko ? '미리보기' : 'Preview'}</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">{ko ? '제목' : 'Title'}</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">{ko ? '플랫폼' : 'Platform'}</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">{ko ? '상태' : 'Status'}</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500 dark:text-gray-300">{ko ? '발표일' : 'Date'}</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500 dark:text-gray-300">{ko ? '작업' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-3">
                    {item.cover_image ? (
                      <div className="h-12 w-20 overflow-hidden rounded bg-gray-100 dark:bg-gray-700">
                        <img src={resolveImageUrl(item.cover_image)} alt={item.title} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-12 w-20 items-center justify-center rounded bg-gray-100 dark:bg-gray-700 text-xs text-gray-400">No image</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</div>
                    {item.description && <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{item.description}</div>}
                  </td>
                  <td className="px-4 py-3"><Badge variant="outline" className="text-xs">{getPlatformLabel(item.platform)}</Badge></td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <Badge variant={item.is_published ? 'default' : 'secondary'} className="text-xs">
                        {item.is_published ? (ko ? '공개' : 'Published') : (ko ? '비공개' : 'Draft')}
                      </Badge>
                      {item.featured && <Badge variant="default" className="text-xs">{ko ? '추천' : 'Featured'}</Badge>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">{item.published_date || '-'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <a href={item.url} target="_blank" rel="noopener noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(item)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(item)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} className="max-w-2xl">
        <DialogHeader><DialogTitle>{editingItem ? (ko ? '보고서 수정' : 'Edit Report') : (ko ? '보고서 추가' : 'Add Report')}</DialogTitle></DialogHeader>
        <div className="max-h-[60vh] space-y-4 overflow-y-auto">
          <div><Label>{ko ? '제목 (한국어) *' : 'Title (Korean) *'}</Label><Input value={form.title} onChange={(e) => updateField('title', e.target.value)} /></div>
          <div><Label>{ko ? '제목 (영어)' : 'Title (English)'}</Label><Input value={form.title_en} onChange={(e) => updateField('title_en', e.target.value)} /></div>
          <div><Label>{ko ? '플랫폼 *' : 'Platform *'}</Label>
            <Select value={form.platform} onChange={(e) => updateField('platform', e.target.value as ReportPlatform)}>
              {PLATFORM_OPTIONS.map((opt) => (<option key={opt.value} value={opt.value}>{ko ? opt.labelKo : opt.labelEn}</option>))}
            </Select>
          </div>
          <div><Label>{ko ? '슬라이드 공유 URL *' : 'Slide Share URL *'}</Label><Input value={form.url} onChange={(e) => updateField('url', e.target.value)} /></div>
          <div><Label>{ko ? '미리보기 이미지 URL' : 'Preview Image URL'}</Label><Input value={form.cover_image} onChange={(e) => updateField('cover_image', e.target.value)} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>{ko ? '발표일 *' : 'Published Date *'}</Label><Input type="date" value={form.published_date} onChange={(e) => updateField('published_date', e.target.value)} /></div>
            <div><Label>{ko ? '가격 (원)' : 'Price (KRW)'}</Label><Input type="number" value={form.price} onChange={(e) => updateField('price', e.target.value)} min="0" /></div>
          </div>
          <div><Label>{ko ? '설명 (한국어)' : 'Description (Korean)'}</Label><textarea className="flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 px-3 py-2 text-sm" value={form.description} onChange={(e) => updateField('description', e.target.value)} /></div>
          <div><Label>{ko ? '설명 (영어)' : 'Description (English)'}</Label><textarea className="flex min-h-[80px] w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 px-3 py-2 text-sm" value={form.description_en} onChange={(e) => updateField('description_en', e.target.value)} /></div>
          <div><Label>{ko ? '상세 해설 (한국어)' : 'Detailed Analysis (Korean)'}</Label><textarea className="flex min-h-[120px] w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 px-3 py-2 text-sm" value={form.body} onChange={(e) => updateField('body', e.target.value)} /></div>
          <div><Label>{ko ? '상세 해설 (영어)' : 'Detailed Analysis (English)'}</Label><textarea className="flex min-h-[120px] w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 px-3 py-2 text-sm" value={form.body_en} onChange={(e) => updateField('body_en', e.target.value)} /></div>
          <div><Label>{ko ? '태그 (쉼표 구분)' : 'Tags (comma-separated)'}</Label><Input value={form.tags} onChange={(e) => updateField('tags', e.target.value)} /></div>
          <div><Label>{ko ? '정렬 순서' : 'Sort Order'}</Label><Input type="number" value={form.sort_order} onChange={(e) => updateField('sort_order', e.target.value)} min="0" /></div>
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_free} onChange={(e) => updateField('is_free', e.target.checked)} className="rounded border-gray-300" />{ko ? '무료' : 'Free'}</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.featured} onChange={(e) => updateField('featured', e.target.checked)} className="rounded border-gray-300" />{ko ? '추천' : 'Featured'}</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.is_published} onChange={(e) => updateField('is_published', e.target.checked)} className="rounded border-gray-300" />{ko ? '공개' : 'Published'}</label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>{ko ? '취소' : 'Cancel'}</Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingItem ? (ko ? '수정' : 'Update') : (ko ? '등록' : 'Create')}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
