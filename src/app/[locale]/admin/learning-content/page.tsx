'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Loader2, ExternalLink } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  getLearningContentsAdmin,
  createLearningContent,
  updateLearningContent,
  deleteLearningContent,
} from '@/lib/api/learning-content';
import type {
  LearningContentItem,
  LearningContentType,
  CreateLearningContentData,
} from '@/lib/api/learning-content';
import { useLocale } from 'next-intl';
import { resolveImageUrl } from '@/lib/utils';
import { getContentTypeLabel, getContentTypeColor } from '@/components/learning/learning-card';

const CONTENT_TYPE_OPTIONS: { value: LearningContentType; labelKo: string; labelEn: string }[] = [
  { value: 'website', labelKo: '웹사이트', labelEn: 'Website' },
  { value: 'exam', labelKo: '시험', labelEn: 'Exam' },
  { value: 'interactive', labelKo: '인터랙티브', labelEn: 'Interactive' },
  { value: 'tool', labelKo: '도구', labelEn: 'Tool' },
];

interface FormState {
  title: string;
  title_en: string;
  description: string;
  description_en: string;
  content_type: LearningContentType;
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
  content_type: 'website',
  url: '',
  cover_image: '',
  published_date: new Date().toISOString().split('T')[0],
  price: '0',
  tags: '',
  sort_order: '0',
  is_free: true,
  featured: false,
  is_published: true,
};

export default function AdminLearningContentPage() {
  const locale = useLocale();
  const ko = locale === 'ko';
  const { isLoggedIn, isAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [items, setItems] = useState<LearningContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<LearningContentItem | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    const data = await getLearningContentsAdmin();
    setItems(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (isAdmin) loadItems();
  }, [isAdmin, loadItems]);

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isLoggedIn || !isAdmin) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {ko ? '접근 권한 없음' : 'Access Denied'}
        </h1>
        <p className="text-gray-500">
          {ko ? '관리자만 접근할 수 있습니다.' : 'Only administrators can access this page.'}
        </p>
      </div>
    );
  }

  const openCreateDialog = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEditDialog = (item: LearningContentItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      title_en: item.title_en || '',
      description: item.description,
      description_en: item.description_en || '',
      content_type: item.content_type,
      url: item.url,
      cover_image: item.cover_image || '',
      published_date: item.published_date || '',
      price: String(item.price),
      tags: (item.tags || []).join(', '),
      sort_order: String(item.sort_order),
      is_free: item.is_free,
      featured: item.featured,
      is_published: item.is_published,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.url || !form.published_date) {
      toast(
        ko ? '제목, URL, 등록일을 입력해주세요' : 'Title, URL, and date are required',
        'error',
      );
      return;
    }

    setSaving(true);
    try {
      const payload: CreateLearningContentData = {
        title: form.title,
        title_en: form.title_en || undefined,
        description: form.description,
        description_en: form.description_en || undefined,
        content_type: form.content_type,
        url: form.url,
        cover_image: form.cover_image || undefined,
        published_date: form.published_date,
        price: parseInt(form.price) || 0,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
        sort_order: parseInt(form.sort_order) || 0,
        is_free: form.is_free,
        featured: form.featured,
        is_published: form.is_published,
      };

      if (editingItem) {
        await updateLearningContent(editingItem.id, payload);
        toast(ko ? '학습 콘텐츠가 수정되었습니다' : 'Learning content updated', 'success');
      } else {
        await createLearningContent(payload);
        toast(ko ? '학습 콘텐츠가 등록되었습니다' : 'Learning content created', 'success');
      }

      setDialogOpen(false);
      loadItems();
    } catch (err) {
      console.error('Save failed:', err);
      toast(ko ? '저장에 실패했습니다' : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: LearningContentItem) => {
    const msg = ko
      ? `"${item.title}" 학습 콘텐츠를 삭제하시겠습니까?`
      : `Delete "${item.title}"?`;
    if (!window.confirm(msg)) return;

    try {
      await deleteLearningContent(item.id);
      toast(ko ? '삭제되었습니다' : 'Deleted', 'success');
      loadItems();
    } catch (err) {
      console.error('Delete failed:', err);
      toast(ko ? '삭제에 실패했습니다' : 'Delete failed', 'error');
    }
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {ko ? '온라인 학습 콘텐츠 관리' : 'Learning Content Management'}
        </h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          {ko ? '콘텐츠 추가' : 'Add Content'}
        </Button>
      </div>

      {/* Items Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          {ko ? '등록된 학습 콘텐츠가 없습니다' : 'No learning content found'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  {ko ? '미리보기' : 'Preview'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  {ko ? '제목' : 'Title'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  {ko ? '유형' : 'Type'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  {ko ? '가격' : 'Price'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  {ko ? '상태' : 'Status'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  {ko ? '등록일' : 'Date'}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                  {ko ? '작업' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {item.cover_image ? (
                      <div className="relative h-12 w-20 overflow-hidden rounded bg-gray-100">
                        <Image
                          src={resolveImageUrl(item.cover_image)}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-12 w-20 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    {item.description && (
                      <div className="mt-0.5 text-xs text-gray-500 line-clamp-1">{item.description}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getContentTypeColor(item.content_type)}`}>
                      {getContentTypeLabel(item.content_type, locale)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.is_free ? (
                      <span className="text-green-600 font-medium">
                        {ko ? '무료' : 'Free'}
                      </span>
                    ) : (item.price || 0) > 0 ? (
                      <span>{(item.price || 0).toLocaleString()}{ko ? '원' : ' KRW'}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {item.is_published ? (
                        <Badge variant="success" className="text-xs">
                          {ko ? '공개' : 'Published'}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {ko ? '비공개' : 'Draft'}
                        </Badge>
                      )}
                      {item.featured && (
                        <Badge variant="default" className="text-xs">
                          {ko ? '추천' : 'Featured'}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {item.published_date || '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100"
                        title={ko ? '링크 열기' : 'Open link'}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(item)}
                        title={ko ? '수정' : 'Edit'}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item)}
                        title={ko ? '삭제' : 'Delete'}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {editingItem
              ? (ko ? '학습 콘텐츠 수정' : 'Edit Learning Content')
              : (ko ? '학습 콘텐츠 추가' : 'Add Learning Content')}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto">
          {/* Title KO */}
          <div>
            <Label>{ko ? '제목 (한국어) *' : 'Title (Korean) *'}</Label>
            <Input
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder={ko ? '학습 콘텐츠 제목' : 'Learning content title'}
            />
          </div>

          {/* Title EN */}
          <div>
            <Label>{ko ? '제목 (영어)' : 'Title (English)'}</Label>
            <Input
              value={form.title_en}
              onChange={(e) => updateField('title_en', e.target.value)}
              placeholder="English title"
            />
          </div>

          {/* Content Type */}
          <div>
            <Label>{ko ? '콘텐츠 유형 *' : 'Content Type *'}</Label>
            <Select
              value={form.content_type}
              onChange={(e) => updateField('content_type', e.target.value as LearningContentType)}
            >
              {CONTENT_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {ko ? opt.labelKo : opt.labelEn}
                </option>
              ))}
            </Select>
          </div>

          {/* URL */}
          <div>
            <Label>{ko ? '콘텐츠 URL *' : 'Content URL *'}</Label>
            <Input
              value={form.url}
              onChange={(e) => updateField('url', e.target.value)}
              placeholder="https://html.dreamitbiz.com"
            />
          </div>

          {/* Cover Image URL */}
          <div>
            <Label>{ko ? '커버 이미지 URL' : 'Cover Image URL'}</Label>
            <Input
              value={form.cover_image}
              onChange={(e) => updateField('cover_image', e.target.value)}
              placeholder="images/202603/파일명.png 또는 https://..."
            />
            {form.cover_image && (
              <div className="mt-2 relative h-32 w-56 overflow-hidden rounded border border-gray-200 bg-gray-50">
                <Image
                  src={resolveImageUrl(form.cover_image)}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="224px"
                />
              </div>
            )}
          </div>

          {/* Published Date + Price */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>{ko ? '등록일 *' : 'Published Date *'}</Label>
              <Input
                type="date"
                value={form.published_date}
                onChange={(e) => updateField('published_date', e.target.value)}
              />
            </div>
            <div>
              <Label>{ko ? '가격 (원)' : 'Price (KRW)'}</Label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => updateField('price', e.target.value)}
                min="0"
              />
            </div>
          </div>

          {/* Description KO */}
          <div>
            <Label>{ko ? '설명 (한국어)' : 'Description (Korean)'}</Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder={ko ? '학습 콘텐츠 설명' : 'Learning content description'}
            />
          </div>

          {/* Description EN */}
          <div>
            <Label>{ko ? '설명 (영어)' : 'Description (English)'}</Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              value={form.description_en}
              onChange={(e) => updateField('description_en', e.target.value)}
              placeholder="English description"
            />
          </div>

          {/* Tags */}
          <div>
            <Label>{ko ? '태그 (쉼표 구분)' : 'Tags (comma-separated)'}</Label>
            <Input
              value={form.tags}
              onChange={(e) => updateField('tags', e.target.value)}
              placeholder={ko ? 'HTML, CSS, 프로그래밍' : 'HTML, CSS, Programming'}
            />
          </div>

          {/* Sort Order */}
          <div>
            <Label>{ko ? '정렬 순서' : 'Sort Order'}</Label>
            <Input
              type="number"
              value={form.sort_order}
              onChange={(e) => updateField('sort_order', e.target.value)}
              min="0"
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_free}
                onChange={(e) => updateField('is_free', e.target.checked)}
                className="rounded border-gray-300"
              />
              {ko ? '무료' : 'Free'}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
                className="rounded border-gray-300"
              />
              {ko ? '추천' : 'Featured'}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => updateField('is_published', e.target.checked)}
                className="rounded border-gray-300"
              />
              {ko ? '공개' : 'Published'}
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
            {ko ? '취소' : 'Cancel'}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingItem
              ? (ko ? '수정' : 'Update')
              : (ko ? '등록' : 'Create')}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
