import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import site from '@/config/site';
import { Input } from '@/components/ui/input';
import { CartIcon } from '@/components/commerce/cart-icon';
import { UserMenu } from '@/components/commerce/user-menu';
import { useAuth } from '@/contexts/AuthContext';
import { MobileNav } from './mobile-nav';
import { Search, X } from 'lucide-react';

export function Header() {
  const { t, language } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const pathname = location.pathname;
  const { isLoggedIn } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const switchLocale = () => {
    const nextLanguage = language === 'ko' ? 'en' : 'ko';
    // Language switching is handled by LanguageContext
    // Navigate to the same path (language is managed via context, not URL)
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
