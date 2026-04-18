import { Link } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { PaymentForm } from '@/components/commerce/payment-form';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';

export default function CheckoutPage() {
  const { language } = useLanguage();
  const ko = language === 'ko';
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SEOHead title={ko ? '결제' : 'Checkout'} />
        <div className="flex flex-col items-center justify-center text-center">
          <ShoppingCart className="h-16 w-16 text-gray-300" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
            {ko ? '결제할 상품이 없습니다' : 'No items to checkout'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {ko
              ? '장바구니에 상품을 담아주세요'
              : 'Please add items to your cart first'}
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
      <SEOHead title={ko ? '결제' : 'Checkout'} />
      <div className="mb-8">
        <Link to="/cart">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {ko ? '장바구니로 돌아가기' : 'Back to Cart'}
          </Button>
        </Link>
        <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
          {ko ? '결제' : 'Checkout'}
        </h1>
      </div>

      <PaymentForm />
    </div>
  );
}
