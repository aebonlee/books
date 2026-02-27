'use client';

import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { mainNav } from '@/config/navigation';
import { useAuth } from '@/contexts/auth-context';

interface MobileNavProps {
  onClose: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  const locale = useLocale();
  const { isLoggedIn } = useAuth();

  return (
    <div className="dit-mobile-nav">
      {mainNav.map((item) => (
        <Link key={item.href} href={item.href} onClick={onClose}>
          {locale === 'ko' ? item.titleKo : item.titleEn}
        </Link>
      ))}

      <div className="dit-mobile-sep" />

      <Link href="/cart" onClick={onClose}>
        {locale === 'ko' ? '🛒 장바구니' : '🛒 Cart'}
      </Link>
      <Link href="/library" onClick={onClose}>
        {locale === 'ko' ? '📚 내 서재' : '📚 My Library'}
      </Link>

      {!isLoggedIn && (
        <>
          <div className="dit-mobile-sep" />
          <div style={{ padding: '4px 24px 8px' }}>
            <Link
              href="/login"
              className="dit-login-btn"
              style={{ display: 'inline-flex' }}
              onClick={onClose}
            >
              Login
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
