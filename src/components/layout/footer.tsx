import { useLanguage } from '@/contexts/LanguageContext';
import site from '@/config/site';

function FooterLinks({ language, t }: { language: string; t: (key: string) => string }) {
  const siteLinks = [
    ...site.footerLinks.map((item: { path: string; labelKey: string }) => ({
      label: t(item.labelKey),
      href: item.path,
      internal: true,
    })),
    { label: language === 'ko' ? '장바구니' : 'Cart', href: '/cart', internal: true },
    { label: language === 'ko' ? '내 서재' : 'My Library', href: '/library', internal: true },
  ];

  const base = 'https://books.dreamitbiz.com';

  return (
    <ul className="dit-footer-links">
      {siteLinks.map((link) => (
        <li key={link.href}>
          <a href={link.internal ? `${base}${link.href}` : link.href}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Footer() {
  const { t, language } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="dit-footer">
      <div className="dit-footer-inner">
        <div className="dit-footer-grid">
          {/* Brand & Company Info */}
          <div className="dit-footer-brand">
            <h3>
              <span className="brand-dream">Dream</span>
              <span className="brand-it">IT</span>{' '}
              <span className="brand-biz">Biz</span>
            </h3>
            <p>
              {language === 'ko'
                ? 'IT 교육과 출판의 미래를 만듭니다. 최신 기술 교재, 디지털 콘텐츠, 맞춤형 교육 자료를 제공합니다.'
                : 'Shaping the future of IT education and publishing. Providing cutting-edge textbooks, digital content, and customized educational materials.'}
            </p>
            <div className="dit-company-info">
              <p><strong>드림아이티비즈(DreamIT Biz)</strong></p>
              <p>{language === 'ko' ? '대표이사' : 'CEO'}: 이애본</p>
              <p>{language === 'ko' ? '사업자등록번호' : 'Business No'}: 601-45-20154</p>
              <p>{language === 'ko' ? '통신판매신고' : 'E-Commerce'}: 제2024-수원팔달-0584호</p>
              <p>{language === 'ko' ? '출판사 신고번호' : 'Publisher No'}: 제2026-000026호</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="dit-footer-section">
            <h4>{language === 'ko' ? '바로가기' : 'Quick Links'}</h4>
            <FooterLinks language={language} t={t} />
          </div>

          {/* Contact */}
          <div className="dit-footer-section dit-footer-contact">
            <h4>Contact</h4>
            <p>{language === 'ko' ? '경기도 수원시 팔달구 매산로 45, 419호' : '45 Maesan-ro, Paldal-gu, Suwon-si, Gyeonggi-do'}</p>
            <p>aebon@dreamitbiz.com</p>
            <p>010-3700-0629</p>
            <p>{language === 'ko' ? '카카오톡' : 'KakaoTalk'}: aebon</p>
            <p className="hours">
              {language === 'ko' ? '평일: 09:00 ~ 18:00' : 'Weekdays: 09:00 ~ 18:00'}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="dit-footer-bottom">
          <p>{t('footer.copyright').replace('{year}', year.toString())}</p>
        </div>
      </div>
    </footer>
  );
}
