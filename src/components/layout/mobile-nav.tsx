'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { mainNav } from '@/config/navigation';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface MobileNavProps {
  onClose: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  const locale = useLocale();
  const { isLoggedIn } = useAuth();

  return (
    <div className="border-t border-gray-200 bg-white md:hidden">
      <nav className="flex flex-col space-y-1 px-4 py-3">
        {mainNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
            onClick={onClose}
          >
            {locale === 'ko' ? item.titleKo : item.titleEn}
          </Link>
        ))}

        <Separator className="my-2" />

        <Link
          href="/cart"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
          onClick={onClose}
        >
          <ShoppingCart className="h-4 w-4" />
          {locale === 'ko' ? '장바구니' : 'Cart'}
        </Link>
        <Link
          href="/library"
          className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-blue-600"
          onClick={onClose}
        >
          <BookOpen className="h-4 w-4" />
          {locale === 'ko' ? '내 서재' : 'My Library'}
        </Link>
        {!isLoggedIn && (
          <Link
            href="/login"
            className="mt-1 mx-3 inline-flex items-center justify-center rounded-full bg-blue-600 px-[14px] py-[5px] text-[12px] font-semibold text-white tracking-wide transition-all hover:bg-blue-700"
            onClick={onClose}
          >
            Login
          </Link>
        )}
      </nav>
    </div>
  );
}
