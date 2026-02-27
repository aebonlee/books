'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { LoginModal } from './login-modal';
import { User, BookOpen, LogOut, LogIn } from 'lucide-react';

export function UserMenu() {
  const locale = useLocale();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { toast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

  useEffect(() => {
    setMounted(true);
  }, []);

  // 드롭다운 위치 계산
  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, []);

  // 메뉴 열릴 때 위치 계산 + 외부 클릭 닫기
  useEffect(() => {
    if (menuOpen) {
      updatePosition();
    }

    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        buttonRef.current && !buttonRef.current.contains(target) &&
        dropdownRef.current && !dropdownRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen, updatePosition]);

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

  const dropdown = menuOpen && mounted ? createPortal(
    <div
      ref={dropdownRef}
      className="fixed z-[9998] w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
      style={{ top: dropdownPos.top, right: dropdownPos.right }}
    >
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
          toast(
            locale === 'ko' ? '로그아웃되었습니다' : 'Logged out successfully',
            'info',
          );
        }}
        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
      >
        <LogOut className="h-4 w-4" />
        {locale === 'ko' ? '로그아웃' : 'Logout'}
      </button>
    </div>,
    document.body,
  ) : null;

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="icon"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="User menu"
      >
        <User className="h-4 w-4" />
      </Button>
      {dropdown}
    </>
  );
}
