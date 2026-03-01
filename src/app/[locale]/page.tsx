import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { BookGrid } from '@/components/book/book-grid';
import { CategoryCard } from '@/components/book/category-card';
import { categories } from '@/config/categories';
import { getFeaturedBooks, getRecentBooks, getBooksByCategory } from '@/lib/content';
import { ArrowRight, BookOpen, Layers, Sparkles, Library } from 'lucide-react';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const ko = locale === 'ko';
  const featuredBooks = getFeaturedBooks();
  const recentBooks = getRecentBooks(6);
  const newsBooks = getBooksByCategory('news').slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-20 text-white sm:py-24 lg:py-28">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />
          <div className="absolute right-1/4 top-1/3 h-48 w-48 rounded-full bg-sky-400/10 blur-2xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {ko ? '전자출판 · 교재 · 연구보고서' : 'E-Publishing · Textbooks · Reports'}
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {ko ? (
                <>IT 교육의 미래를<br className="hidden sm:block" /> 만듭니다</>
              ) : (
                <>Shaping the Future<br className="hidden sm:block" /> of IT Education</>
              )}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-blue-100 sm:text-xl">
              {ko
                ? '최신 기술 교재, 디지털 콘텐츠, 실습 자료를 만나보세요'
                : 'Discover cutting-edge textbooks, digital content, and hands-on resources'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalog">
                <Button size="lg" className="bg-white text-blue-700 shadow-lg shadow-blue-900/20 hover:bg-blue-50">
                  {ko ? '카탈로그 둘러보기' : 'Browse Catalog'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/e-publishing">
                <Button size="lg" className="border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
                  {ko ? '전자출판 안내' : 'E-Publishing Guide'}
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-8 border-t border-white/15 pt-8">
              <Stat value={ko ? '전자출판' : 'E-Pub'} label={ko ? 'PDF · EPUB · 인터랙티브' : 'PDF · EPUB · Interactive'} />
              <Stat value={ko ? '맞춤 제작' : 'Custom'} label={ko ? '교재 · 강의안 · 보고서' : 'Books · Lectures · Reports'} />
              <Stat value={ko ? '온라인 뷰어' : 'Viewer'} label={ko ? '어디서든 열람 가능' : 'Access Anywhere'} />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      {featuredBooks.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader
            title={ko ? '추천 도서' : 'Featured Books'}
            description={ko ? '엄선된 인기 도서를 확인해 보세요' : 'Check out our hand-picked popular books'}
            href="/catalog"
            linkText={ko ? '전체 보기' : 'View All'}
          />
          <div className="mt-8">
            <BookGrid books={featuredBooks} locale={locale} />
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title={ko ? '카테고리' : 'Categories'}
            description={ko ? '분야별 콘텐츠를 탐색하세요' : 'Explore content by category'}
          />
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
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

      {/* Catalog Banner */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/catalog">
          <div className="group flex items-center justify-between rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 transition-all hover:border-blue-300 hover:shadow-md sm:p-8">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-blue-200">
                <Library className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
                  {ko ? '전체 카탈로그' : 'Full Catalog'}
                </h3>
                <p className="mt-0.5 text-sm text-gray-500">
                  {ko ? '모든 도서와 콘텐츠를 한눈에 둘러보세요' : 'Browse all books and content in one place'}
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-blue-400 transition-transform group-hover:translate-x-1 group-hover:text-blue-600" />
          </div>
        </Link>
      </section>

      {/* New Releases */}
      {recentBooks.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader
            title={ko ? '신간 도서' : 'New Releases'}
            description={ko ? '최근 출간된 도서를 만나보세요' : 'Discover our latest publications'}
            href="/catalog"
            linkText={ko ? '전체 보기' : 'View All'}
          />
          <div className="mt-8">
            <BookGrid books={recentBooks} locale={locale} />
          </div>
        </section>
      )}

      {/* Latest News */}
      {newsBooks.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionHeader
              title={ko ? '최신 뉴스' : 'Latest News'}
              description={ko ? '최근 소식을 확인하세요' : 'Stay up to date with our latest news'}
              href="/category/news"
              linkText={ko ? '전체 보기' : 'View All'}
            />
            <div className="mt-8">
              <BookGrid books={newsBooks} locale={locale} />
            </div>
          </div>
        </section>
      )}

      {/* Bottom CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <BookOpen className="mx-auto h-10 w-10 text-blue-200" />
          <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
            {ko ? '원하는 콘텐츠를 찾지 못하셨나요?' : "Can't find what you're looking for?"}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-blue-100">
            {ko
              ? '맞춤 제작 의뢰를 통해 필요한 교재, 전자출판물을 직접 의뢰해 보세요.'
              : 'Submit a custom request for the textbooks or e-publications you need.'}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href="/custom-order">
              <Button size="lg" className="bg-white text-blue-700 shadow-lg shadow-blue-900/20 hover:bg-blue-50">
                {ko ? '맞춤 제작 의뢰' : 'Custom Request'}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/e-publishing">
              <Button size="lg" className="border border-white/30 bg-white/10 text-white hover:bg-white/20">
                {ko ? '전자출판 안내' : 'E-Publishing Guide'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  title,
  description,
  href,
  linkText,
}: {
  title: string;
  description?: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      {href && linkText && (
        <Link href={href} className="shrink-0 text-sm font-medium text-blue-600 hover:text-blue-700">
          {linkText} <ArrowRight className="ml-1 inline h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-white">{value}</p>
      <p className="text-xs text-blue-200">{label}</p>
    </div>
  );
}
