'use client';

import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/types/commerce';
import { ShoppingCart, Check } from 'lucide-react';

interface AddToCartButtonProps {
  item: Omit<CartItem, 'quantity'>;
  showBuyNow?: boolean;
}

export function AddToCartButton({ item, showBuyNow = true }: AddToCartButtonProps) {
  const locale = useLocale();
  const router = useRouter();
  const { addItem, isInCart } = useCart();
  const { toast } = useToast();

  const inCart = isInCart(item.slug);

  const handleAddToCart = () => {
    if (inCart) {
      router.push('/cart');
      return;
    }
    addItem(item);
    toast(
      locale === 'ko' ? '장바구니에 담았습니다' : 'Added to cart',
      'success',
    );
  };

  const handleBuyNow = () => {
    if (!inCart) addItem(item);
    router.push('/checkout');
  };

  return (
    <div className="flex gap-3">
      <Button
        variant={inCart ? 'outline' : 'default'}
        onClick={handleAddToCart}
      >
        {inCart ? (
          <Check className="mr-2 h-4 w-4" />
        ) : (
          <ShoppingCart className="mr-2 h-4 w-4" />
        )}
        {inCart
          ? locale === 'ko' ? '장바구니 보기' : 'View Cart'
          : locale === 'ko' ? '장바구니 담기' : 'Add to Cart'}
      </Button>
      {showBuyNow && (
        <Button variant="secondary" onClick={handleBuyNow}>
          {locale === 'ko' ? '바로 구매' : 'Buy Now'}
        </Button>
      )}
    </div>
  );
}
