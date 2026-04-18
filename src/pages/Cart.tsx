import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CartItemRow } from '@/components/commerce/cart-item-row';
import { OrderSummary } from '@/components/commerce/order-summary';
import { ShoppingCart, ArrowLeft, ArrowRight } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';

export default function CartPage() {
  const { language } = useLanguage();
  const ko = language === 'ko';
  const { items, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SEOHead title={ko ? '장바구니' : 'Cart'} />
        <div className="flex flex-col items-center justify-center text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {ko ? '장바구니가 비어있습니다' : 'Your cart is empty'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {ko
              ? '관심 있는 도서를 장바구니에 담아보세요'
              : 'Add some books to your cart to get started'}
          </p>
          <Link to="/catalog" className="mt-6">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              {ko ? '카탈로그 둘러보기' : 'Browse Catalog'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SEOHead title={ko ? '장바구니' : 'Cart'} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {ko ? '장바구니' : 'Shopping Cart'}
      </h1>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="rounded-lg border border-gray-200 bg-white dark:bg-gray-800 p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {ko
                  ? `${items.length}개 상품`
                  : `${items.length} item${items.length !== 1 ? 's' : ''}`}
              </span>
              <Button variant="ghost" size="sm" onClick={clearCart}>
                {ko ? '전체 삭제' : 'Clear All'}
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
            <Link to="/catalog">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {ko ? '쇼핑 계속하기' : 'Continue Shopping'}
              </Button>
            </Link>
          </div>
        </div>

        <div>
          <OrderSummary />
          <Link to="/checkout" className="mt-4 block">
            <Button className="w-full" size="lg">
              {ko ? '결제 진행' : 'Proceed to Checkout'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
