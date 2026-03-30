import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'ko' ? '맞춤 제작의뢰' : 'Custom Request';
  const description = locale === 'ko'
    ? '드림아이티비즈 맞춤 제작의뢰 페이지'
    : 'DreamIT Biz Custom Order Request';
  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/${locale}/custom-order`,
      languages: {
        'ko': `${siteConfig.url}/ko/custom-order`,
        'en': `${siteConfig.url}/en/custom-order`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/${locale}/custom-order`,
      siteName: siteConfig.nameKo,
    },
  };
}

export default function CustomOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
