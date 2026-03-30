import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { categories, getCategoryBySlug } from '@/config/categories';
import { siteConfig } from '@/config/site';
import { GalleryGridClient } from './gallery-grid-client';
import type { GalleryCategory } from '@/lib/api/gallery';

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

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/category/${categorySlug}`,
      languages: {
        'ko': `${siteConfig.url}/ko/category/${categorySlug}`,
        'en': `${siteConfig.url}/en/category/${categorySlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}/category/${categorySlug}`,
      siteName: siteConfig.nameKo,
    },
  };
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
      </div>

      <GalleryGridClient
        category={categorySlug as GalleryCategory}
        locale={locale}
        layout={categorySlug === 'lectures' ? 'landscape' : 'portrait'}
      />
    </div>
  );
}
