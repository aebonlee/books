import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/utils';
import type { CartItem } from '@/types/commerce';
import { Trash2 } from 'lucide-react';

interface CartItemRowProps {
  item: CartItem;
}

export function CartItemRow({ item }: CartItemRowProps) {
  const { language } = useLanguage();
  const { removeItem } = useCart();

  return (
    <div className="flex items-center gap-4 py-4">
      <Link to={`/books/${item.slug}`} className="shrink-0">
        <div className="relative h-20 w-14 overflow-hidden rounded bg-gray-100">
          <img
            src={item.coverImage}
            alt={language === 'ko' ? item.title : (item.titleEn || item.title)}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <Link to={`/books/${item.slug}`}>
          <h3 className="truncate font-medium text-gray-900 hover:text-blue-600">
            {language === 'ko' ? item.title : (item.titleEn || item.title)}
          </h3>
        </Link>
        <p className="mt-1 text-sm font-semibold text-gray-700">
          {formatPrice(item.price, language)}
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
