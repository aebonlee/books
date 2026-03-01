'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useLocale } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { User, BookOpen, LogOut, Settings, FileText, GraduationCap } from 'lucide-react';

export function UserMenu() {
  const locale = useLocale();
  const { user, profile, isLoggedIn, isAdmin, isLoading, signOut } = useAuth();
  const { toast } = useToast();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, right: 0 });

  useEffect(() => { setMounted(true); }, []);

  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPos({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
      });
    }
  }, []);

  useEffect(() => {
    if (menuOpen) updatePosition();
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

  // 표시 이름
  const displayName = profile?.display_name
    || user?.user_metadata?.full_name
    || user?.email?.split('@')[0]
    || '';
  const displayEmail = profile?.email || user?.email || '';
  const avatarInitial = (displayName || displayEmail).charAt(0).toUpperCase();

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <User className="h-4 w-4 animate-pulse" />
      </Button>
    );
  }

  if (!isLoggedIn) {
    const loginHref = `/login?from=${encodeURIComponent(pathname)}`;
    return (
      <Link
        href={loginHref}
        className="inline-flex items-center justify-center rounded-full bg-blue-600 px-[18px] py-[7px] text-[13px] font-semibold text-white tracking-wide transition-all hover:bg-blue-700 hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,70,200,0.3)]"
      >
        Login
      </Link>
    );
  }

  const dropdown = menuOpen && mounted ? createPortal(
    <div
      ref={dropdownRef}
      className="fixed z-[9998] w-52 rounded-lg border border-gray-200 bg-white py-1 shadow-lg"
      style={{ top: dropdownPos.top, right: dropdownPos.right }}
    >
      <div className="border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            {avatarInitial}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">{displayName}</p>
            <p className="truncate text-xs text-gray-500">{displayEmail}</p>
          </div>
        </div>
      </div>
      <Link
        href="/library"
        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        onClick={() => setMenuOpen(false)}
      >
        <BookOpen className="h-4 w-4" />
        {locale === 'ko' ? '내 서재' : 'My Library'}
      </Link>
      {isAdmin && (
        <>
          <Link
            href="/admin/gallery"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setMenuOpen(false)}
          >
            <Settings className="h-4 w-4" />
            {locale === 'ko' ? '갤러리 관리' : 'Gallery Admin'}
          </Link>
          <Link
            href="/admin/reports"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setMenuOpen(false)}
          >
            <FileText className="h-4 w-4" />
            {locale === 'ko' ? '보고서 관리' : 'Reports Admin'}
          </Link>
          <Link
            href="/admin/learning-content"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setMenuOpen(false)}
          >
            <GraduationCap className="h-4 w-4" />
            {locale === 'ko' ? '학습 콘텐츠 관리' : 'Learning Admin'}
          </Link>
        </>
      )}
      <button
        onClick={async () => {
          await signOut();
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
        className="relative"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {avatarInitial}
        </div>
      </Button>
      {dropdown}
    </>
  );
}
