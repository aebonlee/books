export interface NavItem {
  titleKo: string;
  titleEn: string;
  href: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  { titleKo: '전체 카탈로그', titleEn: 'Catalog', href: '/catalog' },
  { titleKo: '전자출판 안내', titleEn: 'E-Publishing Guide', href: '/e-publishing' },
  { titleKo: '도서 & 교육교재', titleEn: 'Books & Textbooks', href: '/category/textbooks' },
  { titleKo: '강의안 및 실습자료', titleEn: 'Lectures & Labs', href: '/category/lectures' },
  { titleKo: '연구보고서', titleEn: 'Research Reports', href: '/reports' },
  { titleKo: '맞춤 제작의뢰', titleEn: 'Custom Request', href: '/custom-order' },
];

export const footerNav = {
  about: [
    { titleKo: '회사 소개', titleEn: 'About Us', href: 'https://www.dreamitbiz.com/about' },
    { titleKo: '이용약관', titleEn: 'Terms', href: 'https://www.dreamitbiz.com/terms' },
    { titleKo: '개인정보처리방침', titleEn: 'Privacy', href: 'https://www.dreamitbiz.com/privacy' },
  ],
  support: [
    { titleKo: '고객센터', titleEn: 'Support', href: 'https://www.dreamitbiz.com/support' },
    { titleKo: 'FAQ', titleEn: 'FAQ', href: 'https://www.dreamitbiz.com/faq' },
    { titleKo: '문의하기', titleEn: 'Contact', href: 'https://www.dreamitbiz.com/contact' },
  ],
};
