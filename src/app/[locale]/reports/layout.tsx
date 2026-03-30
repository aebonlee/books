import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'ko' ? '연구보고서' : 'Research Reports';
  const description = locale === 'ko'
    ? '드림아이티비즈 출판 연구보고서 목록'
    : 'DreamIT Biz Books Research Reports';
  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/reports`,
      languages: {
        'ko': `${siteConfig.url}/ko/reports`,
        'en': `${siteConfig.url}/en/reports`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}/reports`,
      siteName: siteConfig.nameKo,
    },
  };
}

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
