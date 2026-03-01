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

  const ko = locale === 'ko';
  const featuredBooks = getFeaturedBooks();
  const recentBooks = getRecentBooks(6);
  const newsBooks = getBooksByCategory('news').slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 py-20 text-white sm:py-24 lg:py-28">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyem0wLTRWMjhIMjR2Mmgxem0tMjItNGgydjJoLTJ2LTJ6bTAtNGgydjJoLTJ2LTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {ko ? 'IT 교육의 미래를 만듭니다' : 'Shaping the Future of IT Education'}
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100 sm:text-xl">
              {ko
                ? '최신 기술 교재, 디지털 콘텐츠, 실습 자료를 만나보세요'
                : 'Discover cutting-edge textbooks, digital content, and hands-on resources'}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalog">
                <Button size="lg" className="bg-white text-blue-700 hover:bg-blue-50">
                  {ko ? '카탈로그 둘러보기' : 'Browse Catalog'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/e-publishing">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  {ko ? '전자출판 안내' : 'E-Publishing Guide'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      {featuredBooks.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader
            title={ko ? '추천 도서' : 'Featured Books'}
            href="/catalog"
            linkText={ko ? '전체 보기' : 'View All'}
          />
          <div className="mt-6">
            <BookGrid books={featuredBooks} locale={locale} />
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {ko ? '카테고리' : 'Categories'}
          </h2>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
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
          <SectionHeader
            title={ko ? '신간 도서' : 'New Releases'}
            href="/catalog"
            linkText={ko ? '전체 보기' : 'View All'}
          />
          <div className="mt-6">
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
              href="/category/news"
              linkText={ko ? '전체 보기' : 'View All'}
            />
            <div className="mt-6">
              <BookGrid books={newsBooks} locale={locale} />
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeader({ title, href, linkText }: { title: string; href: string; linkText: string }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      <Link href={href} className="text-sm font-medium text-blue-600 hover:text-blue-700">
        {linkText} <ArrowRight className="ml-1 inline h-4 w-4" />
      </Link>
    </div>
  );
}
