import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookGrid } from '@/components/book/book-grid';
import { CategoryCard } from '@/components/book/category-card';
import { categories } from '@/config/categories';
import { getSupabase } from '@/lib/supabase';
import { getViewCounts } from '@/lib/api/views';
import type { Book } from '@/types/book';

export default function Home() {
  const { t, language } = useLanguage();
  const ko = language === 'ko';

  const [featuredBooks, setFeaturedBooks] = useState<Book[]>([]);
  const [newBooks, setNewBooks] = useState<Book[]>([]);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      const client = getSupabase();
      if (!client) {
        setLoading(false);
        return;
      }

      try {
        // Fetch featured books
        const { data: featured } = await client
          .from('pub_books')
          .select('*')
          .eq('is_published', true)
          .eq('featured', true)
          .order('sort_order', { ascending: true })
          .limit(8);

        // Fetch newest books
        const { data: newest } = await client
          .from('pub_books')
          .select('*')
          .eq('is_published', true)
          .order('created_at', { ascending: false })
          .limit(8);

        const mapBook = (row: Record<string, unknown>): Book => ({
          slug: row.slug as string,
          title: row.title as string,
          titleEn: (row.title_en as string) || undefined,
          description: (row.description as string) || '',
          descriptionEn: (row.description_en as string) || undefined,
          authors: Array.isArray(row.authors) ? row.authors as Book['authors'] : [],
          category: (row.category as Book['category']) || 'textbooks',
          coverImage: (row.cover_image as string) || '',
          publishedAt: (row.published_date as string) || '',
          price: (row.price as number) || 0,
          isFree: (row.is_free as boolean) || false,
          tags: Array.isArray(row.tags) ? row.tags as string[] : [],
          assets: [],
          featured: (row.featured as boolean) || false,
        });

        const featuredList = (featured || []).map(mapBook);
        const newList = (newest || []).map(mapBook);

        setFeaturedBooks(featuredList);
        setNewBooks(newList);

        // Fetch view counts
        const allSlugs = [...new Set([...featuredList, ...newList].map((b) => b.slug))];
        if (allSlugs.length > 0) {
          const counts = await getViewCounts('book', allSlugs);
          setViewCounts(counts);
        }
      } catch (err) {
        console.error('Failed to fetch books:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchBooks();
  }, []);

  return (
    <>
      <SEOHead title={ko ? '홈' : 'Home'} />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 py-20 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2260%22%20height%3D%2260%22%3E%3Cpath%20d%3D%22M0%200h60v60H0z%22%20fill%3D%22none%22/%3E%3Cpath%20d%3D%22M30%205v50M5%2030h50%22%20stroke%3D%22rgba(255%2C255%2C255%2C0.05)%22%20stroke-width%3D%221%22/%3E%3C/svg%3E')]" />
        <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {t('home.heroTitle')}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-blue-100">
            {t('home.heroSubtitle')}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/catalog"
              className="inline-flex items-center rounded-lg bg-white px-8 py-3 text-sm font-semibold text-blue-700 shadow-lg transition-all hover:bg-blue-50 hover:shadow-xl"
            >
              {t('home.heroButton')}
            </Link>
            <Link
              to="/e-publishing"
              className="inline-flex items-center rounded-lg border-2 border-white/30 px-8 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:border-white/60 hover:bg-white/10"
            >
              {t('site.nav.ePublishing')}
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('home.categories')}</h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} locale={language} />
          ))}
        </div>
      </section>

      {/* Featured Books */}
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('home.featuredBooks')}</h2>
            <Link to="/catalog" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700">
              {t('common.viewAll')}
            </Link>
          </div>
          <div className="mt-8">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
              </div>
            ) : featuredBooks.length > 0 ? (
              <BookGrid books={featuredBooks} locale={language} viewCounts={viewCounts} />
            ) : (
              <p className="py-12 text-center text-gray-500 dark:text-gray-400">
                {ko ? '추천 도서가 곧 추가됩니다' : 'Featured books coming soon'}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* New Releases */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('home.newReleases')}</h2>
          <Link to="/catalog" className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700">
            {t('common.viewAll')}
          </Link>
        </div>
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
          ) : newBooks.length > 0 ? (
            <BookGrid books={newBooks} locale={language} viewCounts={viewCounts} />
          ) : (
            <p className="py-12 text-center text-gray-500 dark:text-gray-400">
              {ko ? '신간 도서가 곧 추가됩니다' : 'New releases coming soon'}
            </p>
          )}
        </div>
      </section>
    </>
  );
}
