import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getAllBooks, getBookBySlug, getRelatedBooks } from '@/lib/content';
import { BookGrid } from '@/components/book/book-grid';
import { Badge } from '@/components/ui/badge';
import { getCategoryName } from '@/config/categories';
import { formatDate } from '@/lib/utils';
import { BookCTA } from './book-cta';
import {
  BookOpen,
  Calendar,
  Tag,
  User,
  FileText,
} from 'lucide-react';

export function generateStaticParams() {
  const books = getAllBooks();
  if (books.length === 0) return [{ slug: '_' }];
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const book = getBookBySlug(slug);
  if (!book) return {};

  return {
    title: locale === 'ko' ? book.title : (book.titleEn || book.title),
    description: locale === 'ko' ? book.description : (book.descriptionEn || book.description),
    openGraph: {
      title: book.title,
      description: book.description,
      images: [book.coverImage],
    },
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const book = getBookBySlug(slug);
  if (!book) notFound();

  const relatedBooks = getRelatedBooks(slug, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Book Header */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {/* Cover Image */}
        <div className="md:col-span-1">
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 shadow-lg">
            <Image
              src={book.coverImage}
              alt={book.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Book Info */}
        <div className="md:col-span-2 lg:col-span-3">
          {/* Category Badge */}
          <Badge variant="outline" className="mb-3">
            {getCategoryName(book.category, locale)}
          </Badge>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900">
            {locale === 'ko' ? book.title : (book.titleEn || book.title)}
          </h1>

          {/* Authors */}
          <div className="mt-3 flex items-center gap-2 text-gray-600">
            <User className="h-4 w-4" />
            <span>{book.authors.map((a) => a.name).join(', ')}</span>
          </div>

          {/* Description */}
          <p className="mt-4 text-gray-700 leading-relaxed">
            {locale === 'ko' ? book.description : (book.descriptionEn || book.description)}
          </p>

          {/* Meta Info */}
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {book.publishedAt && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(book.publishedAt, locale)}</span>
              </div>
            )}
            {book.pages && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <FileText className="h-4 w-4" />
                <span>{book.pages} {locale === 'ko' ? '페이지' : 'pages'}</span>
              </div>
            )}
            {book.isbn && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <BookOpen className="h-4 w-4" />
                <span>{book.isbn}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {book.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <Tag className="h-4 w-4 text-gray-400" />
              {book.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Price & Actions */}
          <div className="mt-8">
            <BookCTA book={book} />
          </div>

          {/* Available Formats */}
          {book.assets.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-gray-700">
                {locale === 'ko' ? '제공 형식' : 'Available Formats'}
              </h3>
              <div className="mt-2 flex gap-2">
                {book.assets.map((asset, i) => (
                  <Badge key={i} variant="outline">
                    {asset.type.toUpperCase()} {asset.label && `- ${asset.label}`}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Book Content (MDX Body) */}
      {book.body && (
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            {locale === 'ko' ? '도서 소개' : 'Description'}
          </h2>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: book.body }} />
        </div>
      )}

      {/* Related Books */}
      {relatedBooks.length > 0 && (
        <div className="mt-16 border-t border-gray-200 pt-8">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">
            {locale === 'ko' ? '관련 도서' : 'Related Books'}
          </h2>
          <BookGrid books={relatedBooks} locale={locale} />
        </div>
      )}
    </div>
  );
}
