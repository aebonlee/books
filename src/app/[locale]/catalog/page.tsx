'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { BookGrid } from '@/components/book/book-grid';
import { GalleryCard } from '@/components/gallery/gallery-card';
import { ReportCard } from '@/components/report/report-card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { categories } from '@/config/categories';
import { getAllBooks } from '@/lib/content';
import { getViewCounts } from '@/lib/api/views';
import { getAllPublishedGalleryItems, type GalleryItem } from '@/lib/api/gallery';
import { getPublishedReports, type ReportItem } from '@/lib/api/reports';
import { Search, X, BookOpen, Image as ImageIcon, Presentation, Loader2 } from 'lucide-react';

type ContentType = 'books' | 'gallery' | 'reports';

const galleryCategoryOptions = [
  { value: 'all', labelKo: '전체', labelEn: 'All' },
  { value: 'digital', labelKo: '전자출판', labelEn: 'E-Publishing' },
  { value: 'textbooks', labelKo: '도서 & 교육교재', labelEn: 'Books & Textbooks' },
  { value: 'lectures', labelKo: '강의안 및 실습자료', labelEn: 'Lectures & Labs' },
];

export default function CatalogPage() {
  const t = useTranslations('catalog');
  const locale = useLocale();
  const allBooks = getAllBooks();

  const [contentType, setContentType] = useState<ContentType>('books');

  // Book state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [freeOnly, setFreeOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const perPage = 12;

  // Gallery state
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryViewCounts, setGalleryViewCounts] = useState<Record<string, number>>({});
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [galleryLoaded, setGalleryLoaded] = useState(false);
  const [gallerySearch, setGallerySearch] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('all');
  const [galleryPage, setGalleryPage] = useState(1);

  // Report state
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [reportViewCounts, setReportViewCounts] = useState<Record<string, number>>({});
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsLoaded, setReportsLoaded] = useState(false);
  const [reportSearch, setReportSearch] = useState('');
  const [reportPage, setReportPage] = useState(1);

  // Load book view counts
  useEffect(() => {
    const slugs = allBooks.map((b) => b.slug);
    getViewCounts('book', slugs).then(setViewCounts);
  }, [allBooks]);

  // Load gallery items on first tab switch
  const loadGallery = useCallback(async () => {
    if (galleryLoaded) return;
    setGalleryLoading(true);
    const items = await getAllPublishedGalleryItems();
    setGalleryItems(items);
    if (items.length > 0) {
      const slugs = items.map((i) => i.slug);
      const counts = await getViewCounts('gallery', slugs);
      setGalleryViewCounts(counts);
    }
    setGalleryLoaded(true);
    setGalleryLoading(false);
  }, [galleryLoaded]);

  // Load reports on first tab switch
  const loadReports = useCallback(async () => {
    if (reportsLoaded) return;
    setReportsLoading(true);
    const data = await getPublishedReports();
    setReports(data);
    if (data.length > 0) {
      const slugs = data.map((r) => `report-${r.id}`);
      const counts = await getViewCounts('report', slugs);
      setReportViewCounts(counts);
    }
    setReportsLoaded(true);
    setReportsLoading(false);
  }, [reportsLoaded]);

  useEffect(() => {
    if (contentType === 'gallery') loadGallery();
    if (contentType === 'reports') loadReports();
  }, [contentType, loadGallery, loadReports]);

  // Book filtering
  const filteredBooks = useMemo(() => {
    let books = [...allBooks];

    if (search) {
      const q = search.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          (b.titleEn?.toLowerCase().includes(q)) ||
          b.description.toLowerCase().includes(q) ||
          b.authors.some((a) => a.name.toLowerCase().includes(q)) ||
          b.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== 'all') {
      const categoryMap: Record<string, string[]> = {
        digital: ['digital'],
        textbooks: ['textbooks', 'publications'],
        lectures: ['lectures', 'workbooks'],
      };
      const mapped = categoryMap[selectedCategory] || [selectedCategory];
      books = books.filter((b) => mapped.includes(b.category));
    }

    if (freeOnly) {
      books = books.filter((b) => b.isFree);
    }

    switch (sortBy) {
      case 'oldest':
        books.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
      case 'priceAsc':
        books.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'priceDesc':
        books.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'title':
        books.sort((a, b) => a.title.localeCompare(b.title, locale));
        break;
      default:
        books.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    return books;
  }, [allBooks, search, selectedCategory, sortBy, freeOnly, locale]);

  // Gallery filtering
  const filteredGallery = useMemo(() => {
    let items = [...galleryItems];

    if (gallerySearch) {
      const q = gallerySearch.toLowerCase();
      items = items.filter(
        (i) =>
          i.title.toLowerCase().includes(q) ||
          (i.title_en?.toLowerCase().includes(q)) ||
          i.description.toLowerCase().includes(q) ||
          (i.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    }

    if (galleryCategory !== 'all') {
      items = items.filter((i) => i.category === galleryCategory);
    }

    return items;
  }, [galleryItems, gallerySearch, galleryCategory]);

  // Report filtering
  const filteredReports = useMemo(() => {
    let items = [...reports];

    if (reportSearch) {
      const q = reportSearch.toLowerCase();
      items = items.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.title_en?.toLowerCase().includes(q)) ||
          r.description.toLowerCase().includes(q) ||
          (r.tags || []).some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return items;
  }, [reports, reportSearch]);

  // Pagination
  const bookTotalPages = Math.ceil(filteredBooks.length / perPage);
  const paginatedBooks = filteredBooks.slice((page - 1) * perPage, page * perPage);

  const galleryTotalPages = Math.ceil(filteredGallery.length / perPage);
  const paginatedGallery = filteredGallery.slice((galleryPage - 1) * perPage, galleryPage * perPage);

  const reportTotalPages = Math.ceil(filteredReports.length / perPage);
  const paginatedReports = filteredReports.slice((reportPage - 1) * perPage, reportPage * perPage);

  const tabs: { key: ContentType; label: string; icon: React.ReactNode; count: number }[] = [
    { key: 'books', label: t('tabBooks'), icon: <BookOpen className="h-4 w-4" />, count: filteredBooks.length },
    { key: 'gallery', label: t('tabGallery'), icon: <ImageIcon className="h-4 w-4" />, count: galleryLoaded ? filteredGallery.length : -1 },
    { key: 'reports', label: t('tabReports'), icon: <Presentation className="h-4 w-4" />, count: reportsLoaded ? filteredReports.length : -1 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-gray-600">{t('description')}</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex gap-6" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setContentType(tab.key)}
              className={`inline-flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition-colors ${
                contentType === tab.key
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.count >= 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    contentType === tab.key
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Books Tab */}
      {contentType === 'books' && (
        <>
          {/* Filters */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={locale === 'ko' ? '검색...' : 'Search...'}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                className="pl-10"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            <Select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
              className="w-full sm:w-48"
            >
              <option value="all">{t('allCategories')}</option>
              {categories.map((cat) => (
                <option key={cat.slug} value={cat.slug}>
                  {locale === 'ko' ? cat.nameKo : cat.nameEn}
                </option>
              ))}
            </Select>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full sm:w-40"
            >
              <option value="newest">{t('sortNewest')}</option>
              <option value="oldest">{t('sortOldest')}</option>
              <option value="priceAsc">{t('sortPriceAsc')}</option>
              <option value="priceDesc">{t('sortPriceDesc')}</option>
              <option value="title">{t('sortTitle')}</option>
            </Select>
            <Button
              variant={freeOnly ? 'default' : 'outline'}
              size="sm"
              onClick={() => { setFreeOnly(!freeOnly); setPage(1); }}
            >
              {t('freeOnly')}
            </Button>
          </div>

          {/* Active Filters */}
          {(selectedCategory !== 'all' || freeOnly || search) && (
            <div className="mb-4 flex flex-wrap gap-2">
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('all')}>
                  {categories.find(c => c.slug === selectedCategory)?.[locale === 'ko' ? 'nameKo' : 'nameEn']}
                  <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              {freeOnly && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setFreeOnly(false)}>
                  {t('freeOnly')} <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
              {search && (
                <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearch('')}>
                  &quot;{search}&quot; <X className="ml-1 h-3 w-3" />
                </Badge>
              )}
            </div>
          )}

          <p className="mb-4 text-sm text-gray-500">
            {t('results', { count: filteredBooks.length.toString() })}
          </p>

          <BookGrid books={paginatedBooks} locale={locale} viewCounts={viewCounts} />

          {bookTotalPages > 1 && (
            <Pagination page={page} totalPages={bookTotalPages} locale={locale} onPageChange={setPage} />
          )}
        </>
      )}

      {/* Gallery Tab */}
      {contentType === 'gallery' && (
        <>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={locale === 'ko' ? '검색...' : 'Search...'}
                value={gallerySearch}
                onChange={(e) => { setGallerySearch(e.target.value); setGalleryPage(1); }}
                className="pl-10"
              />
              {gallerySearch && (
                <button onClick={() => setGallerySearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
            <Select
              value={galleryCategory}
              onChange={(e) => { setGalleryCategory(e.target.value); setGalleryPage(1); }}
              className="w-full sm:w-48"
            >
              {galleryCategoryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {locale === 'ko' ? opt.labelKo : opt.labelEn}
                </option>
              ))}
            </Select>
          </div>

          {galleryLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredGallery.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ImageIcon className="h-16 w-16 text-gray-300" />
              <p className="mt-4 text-lg text-gray-500">{t('noGalleryItems')}</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-500">
                {t('results', { count: filteredGallery.length.toString() })}
              </p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {paginatedGallery.map((item) => (
                  <GalleryCard
                    key={item.id}
                    item={item}
                    locale={locale}
                    layout={item.category === 'lectures' ? 'landscape' : 'portrait'}
                    viewCount={galleryViewCounts[item.slug] ?? 0}
                  />
                ))}
              </div>
              {galleryTotalPages > 1 && (
                <Pagination page={galleryPage} totalPages={galleryTotalPages} locale={locale} onPageChange={setGalleryPage} />
              )}
            </>
          )}
        </>
      )}

      {/* Reports Tab */}
      {contentType === 'reports' && (
        <>
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder={locale === 'ko' ? '검색...' : 'Search...'}
                value={reportSearch}
                onChange={(e) => { setReportSearch(e.target.value); setReportPage(1); }}
                className="pl-10"
              />
              {reportSearch && (
                <button onClick={() => setReportSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {reportsLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Presentation className="h-16 w-16 text-gray-300" />
              <p className="mt-4 text-lg text-gray-500">{t('noReports')}</p>
            </div>
          ) : (
            <>
              <p className="mb-4 text-sm text-gray-500">
                {t('results', { count: filteredReports.length.toString() })}
              </p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginatedReports.map((report) => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    locale={locale}
                    viewCount={reportViewCounts[`report-${report.id}`]}
                  />
                ))}
              </div>
              {reportTotalPages > 1 && (
                <Pagination page={reportPage} totalPages={reportTotalPages} locale={locale} onPageChange={setReportPage} />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function Pagination({
  page,
  totalPages,
  locale,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  locale: string;
  onPageChange: (p: number) => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-center gap-2">
      <Button variant="outline" size="sm" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        {locale === 'ko' ? '이전' : 'Previous'}
      </Button>
      <span className="text-sm text-gray-600">
        {page} / {totalPages}
      </span>
      <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        {locale === 'ko' ? '다음' : 'Next'}
      </Button>
    </div>
  );
}
