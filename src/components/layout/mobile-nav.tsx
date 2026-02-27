'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { mainNav } from '@/config/navigation';

interface MobileNavProps {
  onClose: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  const locale = useLocale();

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
      </nav>
    </div>
  );
}
