import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookGrid } from '@/components/book/book-grid';
import { GalleryCard } from '@/components/gallery/gallery-card';
import { ReportCard } from '@/components/report/report-card';
import { getSupabase } from '@/lib/supabase';
import { getAllPublishedGalleryItems } from '@/lib/api/gallery';
import { getPublishedReports } from '@/lib/api/reports';
import { getViewCounts } from '@/lib/api/views';
import { categories } from '@/config/categories';
import type { Book, ContentCategory } from '@/types/book';
import type { GalleryItem } from '@/lib/api/gallery';
import type { ReportItem } from '@/lib/api/reports';
import { Search, SlidersHorizontal } from 'lucide-react';

type TabKey = 'books' | 'gallery' | 'reports';
type SortKey = 'newest' | 'oldest' | 'priceAsc' | 'priceDesc' | 'title';

export default function Catalog() {
  const { t, language } = useLanguage();
  const ko = language === 'ko';

  const [tab, setTab] = useState<TabKey>('books');
  const [books, setBooks] = useState<Book[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [bookViewCounts, setBookViewCounts] = useState<Record<string, number>>({});
  const [reportViewCounts, setReportViewCounts] = useState<Record<string, number>>({});
  const [galleryViewCounts, setGalleryViewCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortKey>('newest');
  const [freeOnly, setFreeOnly] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      try {
        const client = getSupabase();

        // Fetch books from Supabase
        if (client) {
          const { data } = await client
            .from('pub_books')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });

          const bookList: Book[] = (data || []).map((row: Record<string, unknown>) => ({
            slug: row.slug as string,
            title: row.title as string,
            titleEn: (row.title_en as string) || undefined,
            description: (row.description as string) || '',
            descriptionEn: (row.description_en as string) || undefined,
            authors: Array.isArray(row.authors) ? row.authors as Book['authors'] : [],
            category: (row.category as ContentCategory) || 'textbooks',
            coverImage: (row.cover_image as string) || '',
            publishedAt: (row.published_date as string) || '',
            price: (row.price as number) || 0,
            isFree: (row.is_free as boolean) || false,
            tags: Array.isArray(row.tags) ? row.tags as string[] : [],
            assets: [],
            featured: (row.featured as boolean) || false,
          }));
          setBooks(bookList);

          if (bookList.length > 0) {
            const counts = await getViewCounts('book', bookList.map((b) => b.slug));
            setBookViewCounts(counts);
          }
        }

        // Fetch gallery items
        const gItems = await getAllPublishedGalleryItems();
        setGalleryItems(gItems);
        if (gItems.length > 0) {
          const gCounts = await getViewCounts('gallery', gItems.map((g) => g.slug));
          setGalleryViewCounts(gCounts);
        }

        // Fetch reports
        const rItems = await getPublishedReports();
        setReports(rItems);
        if (rItems.length > 0) {
          const rCounts = await getViewCounts('report', rItems.map((r) => `report-${r.id}`));
          setReportViewCounts(rCounts);
        }
      } catch (err) {
        console.error('Catalog fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchAll();
  }, []);

  // Filter and sort books
  const filteredBooks = books
    .filter((b) => {
      if (freeOnly && !b.isFree) return false;
      if (selectedCategory !== 'all' && b.category !== selectedCategory) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          b.title.toLowerCase().includes(q) ||
          (b.titleEn || '').toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.tags.some((tag) => tag.toLowerCase().includes(q))
        );
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        case 'oldest': return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime();
        case 'priceAsc': return (a.price || 0) - (b.price || 0);
        case 'priceDesc': return (b.price || 0) - (a.price || 0);
        case 'title': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

  const tabs: { key: TabKey; label: string }[] = [
    { key: 'books', label: t('catalog.tabBooks') },
    { key: 'gallery', label: t('catalog.tabGallery') },
    { key: 'reports', label: t('catalog.tabReports') },
  ];

  return (
    <>
      <SEOHead title={t('catalog.title')} description={t('catalog.description')} />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('catalog.title')}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('catalog.description')}</p>

        {/* Tabs */}
        <div className="mt-8 flex gap-1 border-b border-gray-200 dark:border-gray-700">
          {tabs.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors ${
                tab === item.key
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Filters (only for books tab) */}
        {tab === 'books' && (
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.searchPlaceholder')}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="all">{t('catalog.allCategories')}</option>
                {categories.map((cat) => (
                  <option key={cat.slug} value={cat.slug}>
                    {ko ? cat.nameKo : cat.nameEn}
                  </option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortKey)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="newest">{t('catalog.sortNewest')}</option>
                <option value="oldest">{t('catalog.sortOldest')}</option>
                <option value="priceAsc">{t('catalog.sortPriceAsc')}</option>
                <option value="priceDesc">{t('catalog.sortPriceDesc')}</option>
                <option value="title">{t('catalog.sortTitle')}</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <input
                  type="checkbox"
                  checked={freeOnly}
                  onChange={(e) => setFreeOnly(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600"
                />
                {t('catalog.freeOnly')}
              </label>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
          ) : (
            <>
              {tab === 'books' && (
                filteredBooks.length > 0 ? (
                  <BookGrid books={filteredBooks} locale={language} viewCounts={bookViewCounts} />
                ) : (
                  <p className="py-16 text-center text-gray-500">{t('catalog.noResults')}</p>
                )
              )}

              {tab === 'gallery' && (
                galleryItems.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {galleryItems.map((item) => (
                      <GalleryCard
                        key={item.slug}
                        item={item}
                        locale={language}
                        viewCount={galleryViewCounts[item.slug]}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="py-16 text-center text-gray-500">{t('catalog.noGalleryItems')}</p>
                )
              )}

              {tab === 'reports' && (
                reports.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {reports.map((report) => (
                      <ReportCard
                        key={report.id}
                        report={report}
                        locale={language}
                        viewCount={reportViewCounts[`report-${report.id}`]}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="py-16 text-center text-gray-500">{t('catalog.noReports')}</p>
                )
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
