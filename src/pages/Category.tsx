import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { BookGrid } from '@/components/book/book-grid';
import { GalleryCard } from '@/components/gallery/gallery-card';
import { getCategoryBySlug } from '@/config/categories';
import { getGalleryItemsByCategory } from '@/lib/api/gallery';
import { getViewCounts } from '@/lib/api/views';
import { getSupabase } from '@/lib/supabase';
import type { Book, ContentCategory } from '@/types/book';
import type { GalleryCategory, GalleryItem } from '@/lib/api/gallery';
import { ArrowLeft } from 'lucide-react';

type TabKey = 'books' | 'gallery';

export default function Category() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const { language } = useLanguage();
  const ko = language === 'ko';

  const categoryInfo = categorySlug ? getCategoryBySlug(categorySlug) : undefined;

  const [tab, setTab] = useState<TabKey>('books');
  const [books, setBooks] = useState<Book[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [bookViewCounts, setBookViewCounts] = useState<Record<string, number>>({});
  const [galleryViewCounts, setGalleryViewCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categorySlug) return;

    async function fetchData() {
      setLoading(true);
      try {
        const client = getSupabase();

        // Fetch books by category
        if (client) {
          const { data } = await client
            .from('pub_books')
            .select('*')
            .eq('is_published', true)
            .eq('category', categorySlug)
            .order('sort_order', { ascending: true })
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

        // Fetch gallery items by category
        const gItems = await getGalleryItemsByCategory(categorySlug as GalleryCategory);
        setGalleryItems(gItems);
        if (gItems.length > 0) {
          const gCounts = await getViewCounts('gallery', gItems.map((g) => g.slug));
          setGalleryViewCounts(gCounts);
        }
      } catch (err) {
        console.error('Category fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categorySlug]);

  const title = categoryInfo
    ? (ko ? categoryInfo.nameKo : categoryInfo.nameEn)
    : categorySlug || '';
  const description = categoryInfo
    ? (ko ? categoryInfo.descriptionKo : categoryInfo.descriptionEn)
    : '';

  return (
    <>
      <SEOHead title={title} description={description} />

      <div className="container mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          to="/catalog"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {ko ? '카탈로그' : 'Catalog'}
        </Link>

        <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {description && <p className="mt-2 text-gray-600 dark:text-gray-400">{description}</p>}

        {/* Tabs */}
        <div className="mt-8 flex gap-1 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setTab('books')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === 'books'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {ko ? '도서' : 'Books'} ({books.length})
          </button>
          <button
            onClick={() => setTab('gallery')}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === 'gallery'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {ko ? '갤러리' : 'Gallery'} ({galleryItems.length})
          </button>
        </div>

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
          ) : (
            <>
              {tab === 'books' && (
                books.length > 0 ? (
                  <BookGrid books={books} locale={language} viewCounts={bookViewCounts} />
                ) : (
                  <p className="py-16 text-center text-gray-500">
                    {ko ? '이 카테고리에 도서가 없습니다' : 'No books in this category'}
                  </p>
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
                  <p className="py-16 text-center text-gray-500">
                    {ko ? '이 카테고리에 갤러리 항목이 없습니다' : 'No gallery items in this category'}
                  </p>
                )
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
