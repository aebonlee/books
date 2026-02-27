import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice } from '@/lib/utils';
import type { Book } from '@/types/book';

interface BookCardProps {
  book: Book;
  locale?: string;
}

export function BookCard({ book, locale = 'ko' }: BookCardProps) {
  return (
    <Link href={`/books/${book.slug}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
          <Image
            src={book.coverImage}
            alt={book.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
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

          {/* Price */}
          <div className="mt-2">
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
        </CardContent>
      </Card>
    </Link>
  );
}
