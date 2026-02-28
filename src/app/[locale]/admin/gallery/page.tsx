'use client';

import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { Plus, Pencil, Trash2, Loader2, X as XIcon } from 'lucide-react';
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
  getGalleryItemsAdmin,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
} from '@/lib/api/gallery';
import type { GalleryItem, GalleryCategory, CreateGalleryItemData } from '@/lib/api/gallery';
import { useLocale } from 'next-intl';
import { slugify, formatPrice, resolveImageUrl } from '@/lib/utils';

const CATEGORY_OPTIONS: { value: GalleryCategory; labelKo: string; labelEn: string }[] = [
  { value: 'digital', labelKo: '전자출판', labelEn: 'E-Publishing' },
  { value: 'textbooks', labelKo: '도서 & 교육교재', labelEn: 'Books & Textbooks' },
  { value: 'lectures', labelKo: '강의안 및 실습자료', labelEn: 'Lectures & Labs' },
];

interface FormState {
  title: string;
  title_en: string;
  slug: string;
  category: GalleryCategory;
  description: string;
  description_en: string;
  cover_image: string;
  sub_images: string[];
  price: string;
  is_free: boolean;
  featured: boolean;
  is_published: boolean;
  sort_order: string;
  author_name: string;
  tags: string;
}

const EMPTY_FORM: FormState = {
  title: '',
  title_en: '',
  slug: '',
  category: 'digital',
  description: '',
  description_en: '',
  cover_image: '',
  sub_images: [],
  price: '0',
  is_free: false,
  featured: false,
  is_published: true,
  sort_order: '0',
  author_name: '',
  tags: '',
};

export default function AdminGalleryPage() {
  const locale = useLocale();
  const { isLoggedIn, isAdmin, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<GalleryCategory | ''>('');

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [newSubImageUrl, setNewSubImageUrl] = useState('');

  const loadItems = useCallback(async () => {
    setLoading(true);
    const data = await getGalleryItemsAdmin(filterCategory || undefined);
    setItems(data);
    setLoading(false);
  }, [filterCategory]);

  useEffect(() => {
    if (isAdmin) loadItems();
  }, [isAdmin, loadItems]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!editingItem && form.title) {
      setForm((prev) => ({ ...prev, slug: slugify(prev.title) }));
    }
  }, [form.title, editingItem]);

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
          {locale === 'ko' ? '접근 권한 없음' : 'Access Denied'}
        </h1>
        <p className="text-gray-500">
          {locale === 'ko'
            ? '관리자만 접근할 수 있습니다.'
            : 'Only administrators can access this page.'}
        </p>
      </div>
    );
  }

  const openCreateDialog = () => {
    setEditingItem(null);
    setForm(EMPTY_FORM);
    setNewSubImageUrl('');
    setDialogOpen(true);
  };

  const openEditDialog = (item: GalleryItem) => {
    setEditingItem(item);
    setForm({
      title: item.title,
      title_en: item.title_en || '',
      slug: item.slug,
      category: item.category,
      description: item.description,
      description_en: item.description_en || '',
      cover_image: item.cover_image,
      sub_images: item.sub_images || [],
      price: String(item.price),
      is_free: item.is_free,
      featured: item.featured,
      is_published: item.is_published,
      sort_order: String(item.sort_order),
      author_name: item.author_name || '',
      tags: (item.tags || []).join(', '),
    });
    setNewSubImageUrl('');
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.slug || !form.category) {
      toast(locale === 'ko' ? '필수 항목을 입력해주세요' : 'Please fill in required fields', 'error');
      return;
    }

    setSaving(true);
    try {
      const payload: CreateGalleryItemData = {
        slug: form.slug,
        title: form.title,
        title_en: form.title_en || undefined,
        description: form.description,
        description_en: form.description_en || undefined,
        category: form.category,
        cover_image: form.cover_image || '/images/covers/default.png',
        sub_images: form.sub_images,
        price: parseInt(form.price) || 0,
        is_free: form.is_free,
        featured: form.featured,
        is_published: form.is_published,
        sort_order: parseInt(form.sort_order) || 0,
        author_name: form.author_name || undefined,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()).filter(Boolean) : [],
      };

      if (editingItem) {
        await updateGalleryItem(editingItem.id, payload);
        toast(locale === 'ko' ? '항목이 수정되었습니다' : 'Item updated', 'success');
      } else {
        await createGalleryItem(payload);
        toast(locale === 'ko' ? '항목이 등록되었습니다' : 'Item created', 'success');
      }

      setDialogOpen(false);
      loadItems();
    } catch (err) {
      console.error('Save failed:', err);
      toast(locale === 'ko' ? '저장에 실패했습니다' : 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: GalleryItem) => {
    const msg = locale === 'ko'
      ? `"${item.title}" 항목을 삭제하시겠습니까?`
      : `Delete "${item.title}"?`;
    if (!window.confirm(msg)) return;

    try {
      await deleteGalleryItem(item.id);
      toast(locale === 'ko' ? '삭제되었습니다' : 'Deleted', 'success');
      loadItems();
    } catch (err) {
      console.error('Delete failed:', err);
      toast(locale === 'ko' ? '삭제에 실패했습니다' : 'Delete failed', 'error');
    }
  };

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const getCategoryLabel = (cat: GalleryCategory) => {
    const opt = CATEGORY_OPTIONS.find((c) => c.value === cat);
    return locale === 'ko' ? opt?.labelKo : opt?.labelEn;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          {locale === 'ko' ? '갤러리 관리' : 'Gallery Management'}
        </h1>
        <Button onClick={openCreateDialog}>
          <Plus className="mr-2 h-4 w-4" />
          {locale === 'ko' ? '항목 추가' : 'Add Item'}
        </Button>
      </div>

      {/* Category Filter */}
      <div className="mb-6 flex gap-2">
        <Button
          variant={filterCategory === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterCategory('')}
        >
          {locale === 'ko' ? '전체' : 'All'}
        </Button>
        {CATEGORY_OPTIONS.map((cat) => (
          <Button
            key={cat.value}
            variant={filterCategory === cat.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory(cat.value)}
          >
            {locale === 'ko' ? cat.labelKo : cat.labelEn}
          </Button>
        ))}
      </div>

      {/* Items Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-16 text-center text-gray-500">
          {locale === 'ko' ? '등록된 항목이 없습니다' : 'No items found'}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  {locale === 'ko' ? '이미지' : 'Image'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  {locale === 'ko' ? '제목' : 'Title'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  {locale === 'ko' ? '카테고리' : 'Category'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  {locale === 'ko' ? '가격' : 'Price'}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase text-gray-500">
                  {locale === 'ko' ? '상태' : 'Status'}
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase text-gray-500">
                  {locale === 'ko' ? '작업' : 'Actions'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="relative h-12 w-10 overflow-hidden rounded bg-gray-100">
                      <Image
                        src={resolveImageUrl(item.cover_image)}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                    {item.author_name && (
                      <div className="text-xs text-gray-500">{item.author_name}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="text-xs">
                      {getCategoryLabel(item.category)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {item.is_free
                      ? (locale === 'ko' ? '무료' : 'Free')
                      : formatPrice(item.price, locale)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {item.is_published ? (
                        <Badge variant="success" className="text-xs">
                          {locale === 'ko' ? '공개' : 'Published'}
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs">
                          {locale === 'ko' ? '비공개' : 'Draft'}
                        </Badge>
                      )}
                      {item.featured && (
                        <Badge variant="default" className="text-xs">
                          {locale === 'ko' ? '추천' : 'Featured'}
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(item)}
                        title={locale === 'ko' ? '수정' : 'Edit'}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(item)}
                        title={locale === 'ko' ? '삭제' : 'Delete'}
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
              ? (locale === 'ko' ? '항목 수정' : 'Edit Item')
              : (locale === 'ko' ? '항목 추가' : 'Add Item')}
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-[60vh] space-y-4 overflow-y-auto">
          {/* Title KO */}
          <div>
            <Label>{locale === 'ko' ? '제목 (한국어) *' : 'Title (Korean) *'}</Label>
            <Input
              value={form.title}
              onChange={(e) => updateField('title', e.target.value)}
              placeholder={locale === 'ko' ? '제목을 입력하세요' : 'Enter title'}
            />
          </div>

          {/* Title EN */}
          <div>
            <Label>{locale === 'ko' ? '제목 (영어)' : 'Title (English)'}</Label>
            <Input
              value={form.title_en}
              onChange={(e) => updateField('title_en', e.target.value)}
              placeholder="English title"
            />
          </div>

          {/* Slug */}
          <div>
            <Label>{locale === 'ko' ? '슬러그 *' : 'Slug *'}</Label>
            <Input
              value={form.slug}
              onChange={(e) => updateField('slug', e.target.value)}
              placeholder="auto-generated-slug"
              disabled={!!editingItem}
            />
          </div>

          {/* Category */}
          <div>
            <Label>{locale === 'ko' ? '카테고리 *' : 'Category *'}</Label>
            <Select
              value={form.category}
              onChange={(e) => updateField('category', e.target.value as GalleryCategory)}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {locale === 'ko' ? cat.labelKo : cat.labelEn}
                </option>
              ))}
            </Select>
          </div>

          {/* Description KO */}
          <div>
            <Label>{locale === 'ko' ? '설명 (한국어) *' : 'Description (Korean) *'}</Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              placeholder={locale === 'ko' ? '설명을 입력하세요' : 'Enter description'}
            />
          </div>

          {/* Description EN */}
          <div>
            <Label>{locale === 'ko' ? '설명 (영어)' : 'Description (English)'}</Label>
            <textarea
              className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
              value={form.description_en}
              onChange={(e) => updateField('description_en', e.target.value)}
              placeholder="English description"
            />
          </div>

          {/* Cover Image */}
          <div>
            <Label>{locale === 'ko' ? '커버 이미지 URL *' : 'Cover Image URL *'}</Label>
            <Input
              value={form.cover_image}
              onChange={(e) => updateField('cover_image', e.target.value)}
              placeholder="images/202603/파일명.png 또는 https://..."
            />
          </div>

          {/* Sub Images (max 5) */}
          <div>
            <Label>{locale === 'ko' ? '서브 이미지 URL (최대 5장)' : 'Sub Image URLs (max 5)'}</Label>
            {form.sub_images.length > 0 && (
              <div className="mt-2 space-y-1">
                {form.sub_images.map((url, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Input
                      value={url}
                      readOnly
                      className="flex-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setForm((prev) => ({
                          ...prev,
                          sub_images: prev.sub_images.filter((_, idx) => idx !== i),
                        }));
                      }}
                      className="shrink-0 rounded p-1 text-red-500 hover:bg-red-50"
                    >
                      <XIcon className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {form.sub_images.length < 5 && (
              <div className="mt-2 flex gap-2">
                <Input
                  value={newSubImageUrl}
                  onChange={(e) => setNewSubImageUrl(e.target.value)}
                  placeholder="images/202603/파일명.png 또는 https://..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!newSubImageUrl.trim()}
                  onClick={() => {
                    if (newSubImageUrl.trim()) {
                      setForm((prev) => ({
                        ...prev,
                        sub_images: [...prev.sub_images, newSubImageUrl.trim()],
                      }));
                      setNewSubImageUrl('');
                    }
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            )}
            <p className="mt-1 text-xs text-gray-400">
              {form.sub_images.length}/5
            </p>
          </div>

          {/* Price */}
          <div>
            <Label>{locale === 'ko' ? '가격 (원) *' : 'Price (KRW) *'}</Label>
            <Input
              type="number"
              value={form.price}
              onChange={(e) => updateField('price', e.target.value)}
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
              {locale === 'ko' ? '무료' : 'Free'}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField('featured', e.target.checked)}
                className="rounded border-gray-300"
              />
              {locale === 'ko' ? '추천' : 'Featured'}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_published}
                onChange={(e) => updateField('is_published', e.target.checked)}
                className="rounded border-gray-300"
              />
              {locale === 'ko' ? '공개' : 'Published'}
            </label>
          </div>

          {/* Sort Order */}
          <div>
            <Label>{locale === 'ko' ? '정렬 순서' : 'Sort Order'}</Label>
            <Input
              type="number"
              value={form.sort_order}
              onChange={(e) => updateField('sort_order', e.target.value)}
              min="0"
            />
          </div>

          {/* Author */}
          <div>
            <Label>{locale === 'ko' ? '저자명' : 'Author Name'}</Label>
            <Input
              value={form.author_name}
              onChange={(e) => updateField('author_name', e.target.value)}
              placeholder={locale === 'ko' ? '저자명' : 'Author name'}
            />
          </div>

          {/* Tags */}
          <div>
            <Label>{locale === 'ko' ? '태그 (쉼표 구분)' : 'Tags (comma-separated)'}</Label>
            <Input
              value={form.tags}
              onChange={(e) => updateField('tags', e.target.value)}
              placeholder={locale === 'ko' ? 'Python, 프로그래밍, 입문' : 'Python, Programming, Beginner'}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
            {locale === 'ko' ? '취소' : 'Cancel'}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {editingItem
              ? (locale === 'ko' ? '수정' : 'Update')
              : (locale === 'ko' ? '등록' : 'Create')}
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
