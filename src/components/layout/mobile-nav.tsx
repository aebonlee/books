import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import site from '@/config/site';
import { useAuth } from '@/contexts/AuthContext';

interface MobileNavProps {
  onClose: () => void;
}

export function MobileNav({ onClose }: MobileNavProps) {
  const { t, language } = useLanguage();
  const { isLoggedIn } = useAuth();

  return (
    <div className="dit-mobile-nav">
      {site.menuItems.filter(m => m.path !== '/').map((item) => (
        <Link key={item.path} to={item.path} onClick={onClose}>
          {t(item.labelKey)}
        </Link>
      ))}

      <div className="dit-mobile-sep" />

      <Link to="/cart" onClick={onClose}>
        {language === 'ko' ? '🛒 장바구니' : '🛒 Cart'}
      </Link>
      <Link to="/library" onClick={onClose}>
        {language === 'ko' ? '📚 내 서재' : '📚 My Library'}
      </Link>

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
