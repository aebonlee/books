export interface NavItem {
  titleKo: string;
  titleEn: string;
  href: string;
  children?: NavItem[];
}

export const mainNav: NavItem[] = [
  {
    titleKo: '전체 카탈로그',
    titleEn: 'Catalog',
    href: '/catalog',
  },
  {
    titleKo: '간행물',
    titleEn: 'Publications',
    href: '/category/publications',
  },
  {
    titleKo: '교재',
    titleEn: 'Textbooks',
    href: '/category/textbooks',
  },
  {
    titleKo: '강의안',
    titleEn: 'Lectures',
    href: '/category/lectures',
  },
  {
    titleKo: '실습교재',
    titleEn: 'Workbooks',
    href: '/category/workbooks',
  },
  {
    titleKo: '디지털교과서',
    titleEn: 'Digital',
    href: '/category/digital',
  },
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
