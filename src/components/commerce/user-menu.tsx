'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Button } from '@/components/ui/button';
import { LoginModal } from './login-modal';
import { User, BookOpen, LogOut, LogIn } from 'lucide-react';

export function UserMenu() {
  const locale = useLocale();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <User className="h-4 w-4 animate-pulse" />
      </Button>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLoginOpen(true)}
          aria-label={locale === 'ko' ? '로그인' : 'Login'}
        >
          <LogIn className="h-4 w-4" />
        </Button>
        <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      </>
    );
  }

  return (
    <div ref={menuRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="User menu"
      >
        <User className="h-4 w-4" />
      </Button>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
          <div className="border-b border-gray-100 px-4 py-2">
            <p className="truncate text-sm font-medium text-gray-900">
              {user?.name}
            </p>
            <p className="truncate text-xs text-gray-500">{user?.email}</p>
          </div>
          <Link
            href="/library"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setMenuOpen(false)}
          >
            <BookOpen className="h-4 w-4" />
            {locale === 'ko' ? '내 서재' : 'My Library'}
          </Link>
          <button
            onClick={() => {
              logout();
              setMenuOpen(false);
            }}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4" />
            {locale === 'ko' ? '로그아웃' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  );
}
