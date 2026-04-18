import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { Button } from '@/components/ui/button';
import type { CartItem } from '@/types/commerce';
import { ShoppingCart, Check } from 'lucide-react';

interface AddToCartButtonProps {
  item: Omit<CartItem, 'quantity'>;
  showBuyNow?: boolean;
}

export function AddToCartButton({ item, showBuyNow = true }: AddToCartButtonProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const { addItem, isInCart } = useCart();
  const { toast } = useToast();

  const inCart = isInCart(item.slug);

  const handleAddToCart = () => {
    if (inCart) {
      navigate('/cart');
      return;
    }
    addItem(item);
    toast(
      language === 'ko' ? '장바구니에 담았습니다' : 'Added to cart',
      'success',
    );
  };

  const handleBuyNow = () => {
    if (!inCart) addItem(item);
    navigate('/checkout');
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
          ? language === 'ko' ? '장바구니 보기' : 'View Cart'
          : language === 'ko' ? '장바구니 담기' : 'Add to Cart'}
      </Button>
      {showBuyNow && (
        <Button variant="secondary" onClick={handleBuyNow}>
          {language === 'ko' ? '바로 구매' : 'Buy Now'}
        </Button>
      )}
    </div>
  );
}
