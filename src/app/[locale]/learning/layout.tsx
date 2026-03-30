import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'ko' ? '온라인 학습 콘텐츠' : 'Online Learning';
  const description = locale === 'ko'
    ? '드림아이티비즈 온라인 학습 콘텐츠'
    : 'DreamIT Biz Online Learning Content';
  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/learning`,
      languages: {
        'ko': `${siteConfig.url}/ko/learning`,
        'en': `${siteConfig.url}/en/learning`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}/learning`,
      siteName: siteConfig.nameKo,
    },
  };
}

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
