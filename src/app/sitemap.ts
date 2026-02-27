import type { MetadataRoute } from 'next';
import { getAllBooks } from '@/lib/content';
import { categories } from '@/config/categories';

const BASE_URL = 'https://books.dreamitbiz.com';
const locales = ['ko', 'en'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const books = getAllBooks();

  // Static pages: root and catalog for each locale
  const staticPages: MetadataRoute.Sitemap = locales.flatMap((locale) => [
    {
      url: `${BASE_URL}/${locale}`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/${locale}/catalog`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
  ]);

  // Category pages for each locale
  const categoryPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    categories.map((category) => ({
      url: `${BASE_URL}/${locale}/category/${category.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  );

  // Individual book pages for each locale
  const bookPages: MetadataRoute.Sitemap = locales.flatMap((locale) =>
    books.map((book) => ({
      url: `${BASE_URL}/${locale}/books/${book.slug}`,
      lastModified: new Date(book.updatedAt || book.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  );

  return [...staticPages, ...categoryPages, ...bookPages];
}
