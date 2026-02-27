'use client';

import { Link } from '@/i18n/navigation';
import { useCart } from '@/contexts/cart-context';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

export function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link href="/cart">
      <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
        <ShoppingCart className="h-4 w-4" />
        {totalItems > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
            {totalItems > 9 ? '9+' : totalItems}
          </span>
        )}
      </Button>
    </Link>
  );
}
