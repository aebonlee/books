import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { BookGrid } from '@/components/book/book-grid';
import { CategoryCard } from '@/components/book/category-card';
import { categories } from '@/config/categories';
import { getFeaturedBooks, getRecentBooks, getBooksByCategory } from '@/lib/content';
import { ArrowRight } from 'lucide-react';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const featuredBooks = getFeaturedBooks();
  const recentBooks = getRecentBooks(6);
  const newsBooks = getBooksByCategory('news').slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <HeroTitle locale={locale} />
            </h1>
            <p className="mt-6 text-lg text-blue-100 sm:text-xl">
              <HeroSubtitle locale={locale} />
            </p>
            <div className="mt-8">
              <Link href="/catalog">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                  <HeroButton locale={locale} />
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      {featuredBooks.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {locale === 'ko' ? '추천 도서' : 'Featured Books'}
            </h2>
            <Link href="/catalog" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              {locale === 'ko' ? '전체 보기' : 'View All'} <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6">
            <BookGrid books={featuredBooks} locale={locale} />
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {locale === 'ko' ? '카테고리' : 'Categories'}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                category={category}
                locale={locale}
              />
            ))}
          </div>
        </div>
      </section>

      {/* New Releases */}
      {recentBooks.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {locale === 'ko' ? '신간 도서' : 'New Releases'}
            </h2>
            <Link href="/catalog" className="text-sm font-medium text-blue-600 hover:text-blue-700">
              {locale === 'ko' ? '전체 보기' : 'View All'} <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>
          <div className="mt-6">
            <BookGrid books={recentBooks} locale={locale} />
          </div>
        </section>
      )}

      {/* Latest News */}
      {newsBooks.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                {locale === 'ko' ? '최신 뉴스' : 'Latest News'}
              </h2>
              <Link href="/category/news" className="text-sm font-medium text-blue-600 hover:text-blue-700">
                {locale === 'ko' ? '전체 보기' : 'View All'} <ArrowRight className="ml-1 inline h-4 w-4" />
              </Link>
            </div>
            <div className="mt-6">
              <BookGrid books={newsBooks} locale={locale} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function HeroTitle({ locale }: { locale: string }) {
  return <>{locale === 'ko' ? 'IT 교육의 미래를 만듭니다' : 'Shaping the Future of IT Education'}</>;
}

function HeroSubtitle({ locale }: { locale: string }) {
  return <>{locale === 'ko' ? '최신 기술 교재, 디지털 콘텐츠, 실습 자료를 만나보세요' : 'Discover cutting-edge textbooks, digital content, and hands-on resources'}</>;
}

function HeroButton({ locale }: { locale: string }) {
  return <>{locale === 'ko' ? '카탈로그 둘러보기' : 'Browse Catalog'}</>;
}
