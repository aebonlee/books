export const siteConfig = {
  name: 'DreamIT Biz Books',
  nameKo: '드림아이티비즈 출판',
  description: 'DreamIT Biz Publishing - Textbooks, Digital Content, and Educational Resources',
  descriptionKo: '드림아이티비즈 출판 - 교재, 디지털 콘텐츠, 교육 자료',
  url: 'https://books.dreamitbiz.com',
  mainSiteUrl: 'https://www.dreamitbiz.com',
  ogImage: '/images/og-default.png',
  locale: 'ko' as const,
  locales: ['ko', 'en'] as const,
  defaultLocale: 'ko' as const,
  authors: [
    {
      name: 'DreamIT Biz',
      url: 'https://www.dreamitbiz.com',
    },
  ],
  links: {
    mainSite: 'https://www.dreamitbiz.com',
    register: 'https://www.dreamitbiz.com/register',
    cart: '/cart',
    support: 'https://www.dreamitbiz.com/support',
  },
};

export type SiteConfig = typeof siteConfig;
