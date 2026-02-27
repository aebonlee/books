'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/types/commerce';
import { Trash2 } from 'lucide-react';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const locale = useLocale();
  const { removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-4">
      <Link href={`/books/${item.slug}`} className="shrink-0">
        <div className="relative h-20 w-14 overflow-hidden rounded bg-gray-100">
          <Image
            src={item.coverImage}
            alt={locale === 'ko' ? item.title : (item.titleEn || item.title)}
            fill
            className="object-cover"
          />
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link href={`/books/${item.slug}`}>
          <h3 className="truncate font-medium text-gray-900 hover:text-blue-600">
            {locale === 'ko' ? item.title : (item.titleEn || item.title)}
          </h3>
        </Link>
        <p className="mt-1 text-sm font-semibold text-gray-700">
          {formatPrice(item.price, locale)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => removeItem(item.slug)}
        aria-label="Remove"
      >
        <Trash2 className="h-4 w-4 text-gray-400" />
      </Button>
    </div>
  );
}
