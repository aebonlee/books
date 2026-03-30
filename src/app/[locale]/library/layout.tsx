import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'ko' ? '내 서재' : 'My Library';
  const description = locale === 'ko'
    ? '드림아이티비즈 내 서재 — 구매한 도서 목록'
    : 'DreamIT Biz My Library — Purchased Books';
  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/library`,
      languages: {
        'ko': `${siteConfig.url}/ko/library`,
        'en': `${siteConfig.url}/en/library`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}/library`,
      siteName: siteConfig.nameKo,
    },
  };
}

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
