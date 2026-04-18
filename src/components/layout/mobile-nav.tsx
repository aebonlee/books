import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import site from '@/config/site';
import { useAuth } from '@/contexts/AuthContext';
import type { ColorTheme } from '@/types';

const COLOR_OPTIONS: { name: ColorTheme; color: string }[] = [
  { name: 'blue', color: '#0046C8' },
  { name: 'red', color: '#C8102E' },
  { name: 'green', color: '#00855A' },
  { name: 'purple', color: '#8B1AC8' },
  { name: 'orange', color: '#C87200' },
];

interface MobileNavProps {
  onClose: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  const { t, language } = useLanguage();
  const { isLoggedIn } = useAuth();
  const { mode, toggleTheme, colorTheme, setColorTheme } = useTheme();
  const ko = language === 'ko';

  return (
    <div className="dit-mobile-nav">
      {site.menuItems.filter(m => m.path !== '/').map((item) => (
        <Link key={item.path} to={item.path} onClick={onClose}>
          {t(item.labelKey)}
        </Link>
      ))}

      <div className="dit-mobile-sep" />

      <Link to="/cart" onClick={onClose}>
        {ko ? '🛒 장바구니' : '🛒 Cart'}
      </Link>
      <Link to="/library" onClick={onClose}>
        {ko ? '📚 내 서재' : '📚 My Library'}
      </Link>

      <div className="dit-mobile-sep" />

      {/* Theme & Color row */}
      <div className="dit-mobile-theme-row">
        <div className="dit-mobile-colors">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.name}
              className={`dit-mobile-color-dot${colorTheme === c.name ? ' active' : ''}`}
              style={{ background: c.color }}
              onClick={() => setColorTheme(c.name)}
              aria-label={`${c.name} theme`}
            />
          ))}
        </div>
        <button className="dit-mobile-theme-btn" onClick={toggleTheme}>
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
            {mode === 'light' && <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />}
            {mode === 'dark' && (
              <>
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
              </>
            )}
            {mode === 'auto' && (
              <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 3a9 9 0 0 1 0 18" fill="currentColor" opacity="0.3" />
              </>
            )}
          </svg>
          {mode === 'light' ? (ko ? '다크' : 'Dark') : mode === 'dark' ? (ko ? '자동' : 'Auto') : (ko ? '라이트' : 'Light')}
        </button>
      </div>

      {!isLoggedIn && (
        <>
          <div className="dit-mobile-sep" />
          <div style={{ padding: '4px 24px 8px' }}>
            <Link
              to="/login"
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
