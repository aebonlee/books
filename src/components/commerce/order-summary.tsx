'use client';

import { useLocale } from 'next-intl';
import { useCart } from '@/contexts/cart-context';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/utils';

export function OrderSummary() {
  const locale = useLocale();
  const { items, totalPrice } = useCart();

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
      <h2 className="text-lg font-semibold text-gray-900">
        {locale === 'ko' ? '주문 요약' : 'Order Summary'}
      </h2>
      <Separator className="my-4" />
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.slug} className="flex justify-between text-sm">
            <span className="truncate text-gray-600 pr-4">
              {locale === 'ko' ? item.title : (item.titleEn || item.title)}
            </span>
            <span className="shrink-0 font-medium">{formatPrice(item.price, locale)}</span>
          </div>
        ))}
      </div>
      <Separator className="my-4" />
      <div className="flex justify-between">
        <span className="font-semibold text-gray-900">
          {locale === 'ko' ? '합계' : 'Total'}
        </span>
        <span className="text-lg font-bold text-blue-600">
          {formatPrice(totalPrice, locale)}
        </span>
      </div>
    </div>
  );
}
