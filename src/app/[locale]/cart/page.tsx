'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CartItemRow } from '@/components/commerce/cart-item-row';
import { OrderSummary } from '@/components/commerce/order-summary';
import { ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';

export default function CartPage() {
  const locale = useLocale();
  const { items, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            {locale === 'ko' ? '장바구니가 비어있습니다' : 'Your cart is empty'}
          </h1>
          <p className="mt-2 text-gray-600">
            {locale === 'ko'
              ? '관심 있는 도서를 장바구니에 담아보세요'
              : 'Add some books to your cart to get started'}
          </p>
          <Link href="/catalog" className="mt-6">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {locale === 'ko' ? '카탈로그 둘러보기' : 'Browse Catalog'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900">
        {locale === 'ko' ? '장바구니' : 'Shopping Cart'}
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart items */}
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {locale === 'ko'
                  ? `${items.length}개 상품`
                  : `${items.length} item${items.length !== 1 ? 's' : ''}`}
              </span>
              <Button variant="ghost" size="sm" onClick={clearCart}>
                {locale === 'ko' ? '전체 삭제' : 'Clear All'}
              </Button>
            </div>
            <Separator className="my-3" />
            <div className="divide-y divide-gray-100">
              {items.map((item) => (
                <CartItemRow key={item.slug} item={item} />
              ))}
            </div>
          </div>

          <div className="mt-4">
            <Link href="/catalog">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {locale === 'ko' ? '쇼핑 계속하기' : 'Continue Shopping'}
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <OrderSummary />
          <Link href="/checkout" className="mt-4 block">
            <Button className="w-full" size="lg">
              {locale === 'ko' ? '결제 진행' : 'Proceed to Checkout'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
