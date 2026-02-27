import { useTranslations, useLocale } from 'next-intl';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
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
              {locale === 'ko'
                ? 'IT 교육과 출판의 미래를 만듭니다. 최신 기술 교재, 디지털 콘텐츠, 맞춤형 교육 자료를 제공합니다.'
                : 'Shaping the future of IT education and publishing. Providing cutting-edge textbooks, digital content, and customized educational materials.'}
            </p>
            <div className="dit-company-info">
              <p><strong>드림아이티비즈(DreamIT Biz)</strong></p>
              <p>{locale === 'ko' ? '대표이사' : 'CEO'}: 이애본</p>
              <p>{locale === 'ko' ? '사업자등록번호' : 'Business No'}: 601-45-20154</p>
              <p>{locale === 'ko' ? '통신판매신고' : 'E-Commerce'}: 제2024-수원팔달-0584호</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="dit-footer-section">
            <h4>{locale === 'ko' ? '바로가기' : 'Quick Links'}</h4>
            <ul className="dit-footer-links">
              <li><a href="https://www.dreamitbiz.com/">{locale === 'ko' ? '홈' : 'Home'}</a></li>
              <li><a href="https://www.dreamitbiz.com/services">{locale === 'ko' ? 'IT 서비스' : 'IT Services'}</a></li>
              <li><a href="https://www.dreamitbiz.com/consulting">{locale === 'ko' ? '컨설팅' : 'Consulting'}</a></li>
              <li><a href="https://www.dreamitbiz.com/education">{locale === 'ko' ? '교육' : 'Education'}</a></li>
              <li><a href="https://www.dreamitbiz.com/publishing">{locale === 'ko' ? '출판' : 'Publishing'}</a></li>
              <li><a href="https://www.dreamitbiz.com/shop">{locale === 'ko' ? '쇼핑' : 'Shop'}</a></li>
              <li><a href="https://www.dreamitbiz.com/about">{locale === 'ko' ? '회사 소개' : 'About'}</a></li>
              <li><a href="https://www.dreamitbiz.com/about/ceo">{locale === 'ko' ? 'CEO 소개' : 'CEO Profile'}</a></li>
              <li><a href="https://www.dreamitbiz.com/contact">{locale === 'ko' ? '문의하기' : 'Contact'}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="dit-footer-section dit-footer-contact">
            <h4>Contact</h4>
            <p>{locale === 'ko' ? '경기도 수원시 팔달구 매산로 45, 419호' : '45 Maesan-ro, Paldal-gu, Suwon-si, Gyeonggi-do'}</p>
            <p>aebon@dreamitbiz.com</p>
            <p>010-3700-0629</p>
            <p>{locale === 'ko' ? '카카오톡' : 'KakaoTalk'}: aebon</p>
            <p className="hours">
              {locale === 'ko' ? '평일: 09:00 ~ 18:00' : 'Weekdays: 09:00 ~ 18:00'}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="dit-footer-bottom">
          <p>{t('copyright', { year: year.toString() })}</p>
        </div>
      </div>
    </footer>
  );
}
