'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { AddToCartButton } from '@/components/commerce/add-to-cart-button';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import { Download, Eye } from 'lucide-react';
import type { Book } from '@/types/book';

interface BookCTAProps {
  book: Book;
}

export function BookCTA({ book }: BookCTAProps) {
  const locale = useLocale();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      {/* Price */}
      <div className="text-2xl font-bold text-gray-900">
        {book.isFree ? (
          <span className="text-green-600">
            {locale === 'ko' ? '무료' : 'Free'}
          </span>
        ) : book.price ? (
          formatPrice(book.price, locale)
        ) : null}
      </div>

      {/* CTA Buttons */}
      <div className="flex gap-3">
        {book.isFree ? (
          <>
            {book.assets.some((a) => a.type === 'pdf' || a.type === 'epub') && (
              <Button>
                <Download className="mr-2 h-4 w-4" />
                {locale === 'ko' ? '다운로드' : 'Download'}
              </Button>
            )}
            <Link href={`/reader/${book.slug}`}>
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                {locale === 'ko' ? '온라인 읽기' : 'Read Online'}
              </Button>
            </Link>
          </>
        ) : (
          <>
            <AddToCartButton
              item={{
                slug: book.slug,
                title: book.title,
                titleEn: book.titleEn,
                coverImage: book.coverImage,
                price: book.price || 0,
              }}
            />
            {book.sampleUrl && (
              <Button variant="outline">
                <Eye className="mr-2 h-4 w-4" />
                {locale === 'ko' ? '미리보기' : 'Preview'}
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
