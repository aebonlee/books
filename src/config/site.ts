/**
 * 사이트 설정 파일
 * 하위 사이트의 브랜드, 메뉴, 푸터 등을 정의합니다.
 */

import type { SiteConfig } from '../types';

const site: SiteConfig = {
  id: 'books',

  name: 'DreamIT Books',
  nameKo: '드림아이티비즈 출판',
  description: '드림아이티비즈 출판 - 교재, 디지털 콘텐츠, 교육 자료',
  url: 'https://books.dreamitbiz.com',

  dbPrefix: 'books_',

  parentSite: {
    name: 'DreamIT Biz',
    url: 'https://www.dreamitbiz.com',
  },

  brand: {
    parts: [
      { text: 'Dream', className: 'brand-dream' },
      { text: 'IT', className: 'brand-it' },
      { text: 'Books', className: 'brand-biz' },
    ],
  },

  themeColor: '#0046C8',

  company: {
    name: '드림아이티비즈(DreamIT Biz)',
    ceo: '이애본',
    bizNumber: '601-45-20154',
    salesNumber: '제2024-수원팔달-0584호',
    publisherNumber: '제2026-000026호',
    address: '경기도 수원시 팔달구 매산로 45, 419호',
    email: 'aebon@dreamitbiz.com',
    phone: '010-3700-0629',
    kakao: 'aebon',
    businessHours: '평일: 09:00 ~ 18:00',
  },

  features: {
    shop: true,
    community: false,
    search: true,
    auth: true,
    license: false,
  },

  colors: [
    { name: 'blue', color: '#0046C8' },
    { name: 'red', color: '#C8102E' },
    { name: 'green', color: '#00855A' },
    { name: 'purple', color: '#8B1AC8' },
    { name: 'orange', color: '#C87200' },
  ],

  menuItems: [
    { path: '/', labelKey: 'nav.home' },
    { path: '/e-publishing', labelKey: 'site.nav.ePublishing' },
    { path: '/category/textbooks', labelKey: 'site.nav.textbooks' },
    { path: '/category/lectures', labelKey: 'site.nav.lectures' },
    { path: '/reports', labelKey: 'site.nav.reports' },
    { path: '/learning', labelKey: 'site.nav.learning' },
    { path: '/custom-order', labelKey: 'site.nav.customOrder' },
  ],

  footerLinks: [
    { path: '/', labelKey: 'nav.home' },
    { path: '/catalog', labelKey: 'common.catalog' },
    { path: '/e-publishing', labelKey: 'site.nav.ePublishing' },
    { path: '/reports', labelKey: 'site.nav.reports' },
    { path: '/learning', labelKey: 'site.nav.learning' },
  ],

  familySites: [
    { name: 'DreamIT Biz (본사이트)', url: 'https://www.dreamitbiz.com' },
    { name: 'AHP 연구 플랫폼', url: 'https://ahp-basic.dreamitbiz.com' },
    { name: '핵심역량 자가측정', url: 'https://competency.dreamitbiz.com' },
  ],
};

export default site;
