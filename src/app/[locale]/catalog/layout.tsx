import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'ko' ? '전체 카탈로그' : 'Catalog';
  const description = locale === 'ko'
    ? '드림아이티비즈 출판 전체 도서 카탈로그'
    : 'DreamIT Biz Books Full Catalog';
  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/catalog`,
      languages: {
        'ko': `${siteConfig.url}/ko/catalog`,
        'en': `${siteConfig.url}/en/catalog`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}/catalog`,
      siteName: siteConfig.nameKo,
    },
  };
}

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
