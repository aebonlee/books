import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { BookGrid } from '@/components/book/book-grid';
import { categories, getCategoryBySlug } from '@/config/categories';
import { getBooksByCategory } from '@/lib/content';

export function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category: categorySlug } = await params;
  const category = getCategoryBySlug(categorySlug);
  if (!category) return {};

  const title = locale === 'ko' ? category.nameKo : category.nameEn;
  const description = locale === 'ko' ? category.descriptionKo : category.descriptionEn;

  return { title, description };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ locale: string; category: string }>;
}) {
  const { locale, category: categorySlug } = await params;
  setRequestLocale(locale);

  const category = getCategoryBySlug(categorySlug);
  if (!category) notFound();

  const books = getBooksByCategory(categorySlug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full ${category.color} text-white`}>
          <span className="text-xl">
            {category.icon === 'Tablet' && '📱'}
            {category.icon === 'GraduationCap' && '🎓'}
            {category.icon === 'Presentation' && '📊'}
          </span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {locale === 'ko' ? category.nameKo : category.nameEn}
        </h1>
        <p className="mt-2 text-gray-600">
          {locale === 'ko' ? category.descriptionKo : category.descriptionEn}
        </p>
        <p className="mt-1 text-sm text-gray-400">
          {books.length} {locale === 'ko' ? '권' : 'books'}
        </p>
      </div>

      <BookGrid books={books} locale={locale} layout={categorySlug === 'lectures' ? 'landscape' : 'portrait'} />
    </div>
  );
}
