import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import type { Book } from '@/types/book';
import type { BookGridLayout } from './book-grid';

interface BookCardProps {
  book: Book;
  locale?: string;
  layout?: BookGridLayout;
  viewCount?: number;
}

export function BookCard({ book, locale = 'ko', layout = 'portrait', viewCount }: BookCardProps) {
  if (layout === 'landscape') {
    return <LandscapeBookCard book={book} locale={locale} viewCount={viewCount} />;
  }

  return (
    <Link to={`/books/${book.slug}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <img
            src={book.coverImage}
            alt={book.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {book.featured && (
              <Badge variant="default" className="text-xs">
                {locale === 'ko' ? '추천' : 'Featured'}
              </Badge>
            )}
            {book.isFree && (
              <Badge variant="success" className="text-xs">
                {locale === 'ko' ? '무료' : 'Free'}
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-4">
          {/* Category */}
          <Badge variant="outline" className="mb-2 text-xs">
            {book.category}
          </Badge>

          {/* Title */}
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
            {locale === 'ko' ? book.title : (book.titleEn || book.title)}
          </h3>

          {/* Authors */}
          <p className="mt-1 text-xs text-gray-500">
            {book.authors.map((a) => a.name).join(', ')}
          </p>

          {/* Price & Views */}
          <div className="mt-2 flex items-center justify-between">
            <div>
              {book.isFree ? (
                <span className="text-sm font-bold text-green-600">
                  {locale === 'ko' ? '무료' : 'Free'}
                </span>
              ) : book.price ? (
                <span className="text-sm font-bold text-gray-900">
                  {formatPrice(book.price, locale)}
                </span>
              ) : null}
            </div>
            {viewCount !== undefined && (
              <span className="inline-flex items-center gap-0.5 text-gray-400">
                <Eye className="h-3 w-3" />
                <span className="text-xs">{viewCount}</span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

/** PT/슬라이드 스타일 가로형 카드 (4:3 비율) */
function LandscapeBookCard({ book, locale = 'ko', viewCount }: { book: Book; locale?: string; viewCount?: number }) {
  return (
    <Link to={`/books/${book.slug}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        {/* 가로형 커버 (4:3 슬라이드 비율) */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <img
            src={book.coverImage}
            alt={book.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
          />
          {/* Badges */}
          <div className="absolute left-2 top-2 flex flex-col gap-1">
            {book.featured && (
              <Badge variant="default" className="text-xs">
                {locale === 'ko' ? '추천' : 'Featured'}
              </Badge>
            )}
            {book.isFree && (
              <Badge variant="success" className="text-xs">
                {locale === 'ko' ? '무료' : 'Free'}
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-3">
          {/* Title */}
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 group-hover:text-blue-600">
            {locale === 'ko' ? book.title : (book.titleEn || book.title)}
          </h3>

          {/* Authors + Price + Views */}
          <div className="mt-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2 truncate">
              <p className="truncate text-xs text-gray-500">
                {book.authors.map((a) => a.name).join(', ')}
              </p>
              {book.isFree ? (
                <span className="shrink-0 text-xs font-bold text-green-600">
                  {locale === 'ko' ? '무료' : 'Free'}
                </span>
              ) : book.price ? (
                <span className="shrink-0 text-xs font-bold text-gray-900">
                  {formatPrice(book.price, locale)}
                </span>
              ) : null}
            </div>
            {viewCount !== undefined && (
              <span className="inline-flex shrink-0 items-center gap-0.5 text-gray-400">
                <Eye className="h-3 w-3" />
                <span className="text-xs">{viewCount}</span>
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
