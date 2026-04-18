import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import site from '@/config/site';
import { Input } from '@/components/ui/input';
import { CartIcon } from '@/components/commerce/cart-icon';
import { UserMenu } from '@/components/commerce/user-menu';
import { useAuth } from '@/contexts/AuthContext';
import { MobileNav } from './mobile-nav';
import { Search, X } from 'lucide-react';
import type { ColorTheme } from '@/types';

const COLOR_OPTIONS: { name: ColorTheme; color: string }[] = [
  { name: 'blue', color: '#0046C8' },
  { name: 'red', color: '#C8102E' },
  { name: 'green', color: '#00855A' },
  { name: 'purple', color: '#8B1AC8' },
  { name: 'orange', color: '#C87200' },
];

export function Header() {
  const { t, language } = useLanguage();
  const { mode, toggleTheme, colorTheme, setColorTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { isLoggedIn } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [colorOpen, setColorOpen] = useState(false);
  const colorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (colorRef.current && !colorRef.current.contains(e.target as Node)) {
        setColorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const switchLocale = () => {
    navigate(pathname);
  };

  const isActive = (href: string) => {
    if (href === '/catalog') return pathname === '/catalog';
    return pathname.startsWith(href);
  };

  return (
    <header className={`dit-navbar${scrolled ? ' scrolled' : ''}`}>
      <div className="dit-navbar-inner">
        {/* Logo — DreamIT Biz branding */}
        <Link to="/" className="dit-logo" style={{ textDecoration: 'none' }}>
          <h1>
            <span className="brand-dream">Dream</span>
            <span className="brand-it">IT</span>{' '}
            <span className="brand-biz">Biz</span>
          </h1>
          <span className="brand-sub">Publishing</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="dit-nav">
          {site.menuItems.filter(m => m.path !== '/').map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`dit-nav-link${isActive(item.path) ? ' active' : ''}`}
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="dit-actions">
          {/* Search */}
          {searchOpen ? (
            <div className="flex items-center gap-1">
              <Input
                placeholder={t('common.searchPlaceholder')}
                className="w-40 sm:w-56 h-9 text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
              />
              <button
                className="dit-icon-btn"
                onClick={() => setSearchOpen(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              className="dit-icon-btn"
              onClick={() => setSearchOpen(true)}
              aria-label={t('common.search')}
            >
              <Search className="h-[18px] w-[18px]" />
            </button>
          )}

          {/* Color Picker */}
          <div ref={colorRef} style={{ position: 'relative' }}>
            <button
              className="dit-color-btn"
              onClick={() => setColorOpen(!colorOpen)}
              aria-label="Color theme"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="13.5" cy="6.5" r="2.5" style={{ fill: '#C8102E', stroke: 'none' }} />
                <circle cx="17.5" cy="10.5" r="2.5" style={{ fill: '#C87200', stroke: 'none' }} />
                <circle cx="8.5" cy="7.5" r="2.5" style={{ fill: '#00855A', stroke: 'none' }} />
                <circle cx="6.5" cy="12" r="2.5" style={{ fill: '#0046C8', stroke: 'none' }} />
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.04-.24-.3-.39-.65-.39-1.04 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.17-4.5-9-10-9z" />
              </svg>
            </button>
            {colorOpen && (
              <div className="dit-color-dropdown">
                {COLOR_OPTIONS.map((c) => (
                  <button
                    key={c.name}
                    className={`dit-color-dot${colorTheme === c.name ? ' active' : ''}`}
                    style={{ background: c.color }}
                    onClick={() => { setColorTheme(c.name); setColorOpen(false); }}
                    aria-label={`${c.name} theme`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            className="dit-theme-btn"
            onClick={toggleTheme}
            aria-label={mode === 'light' ? 'Dark mode' : mode === 'dark' ? 'Auto mode' : 'Light mode'}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
              {mode === 'light' && <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />}
              {mode === 'dark' && (
                <>
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </>
              )}
              {mode === 'auto' && (
                <>
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" opacity="0.3" />
                  <circle cx="12" cy="12" r="4" />
                </>
              )}
            </svg>
          </button>

          {/* Language Switcher */}
          <button
            className="dit-lang-btn"
            onClick={switchLocale}
            aria-label={t('common.language')}
          >
            {language === 'ko' ? 'EN' : 'KR'}
          </button>

          {/* Cart */}
          <CartIcon />

          {/* User / Login */}
          {isLoggedIn ? (
            <UserMenu />
          ) : (
            <Link to="/login" className="dit-login-btn hidden sm:flex">
              Login
            </Link>
          )}

          {/* Mobile Toggle */}
          <button
            className={`dit-mobile-toggle${mobileOpen ? ' active' : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && <MobileNav onClose={() => setMobileOpen(false)} />}
    </header>
  );
}
