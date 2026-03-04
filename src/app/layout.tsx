import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: siteConfig.nameKo,
  description: siteConfig.descriptionKo,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: siteConfig.url,
    title: siteConfig.nameKo,
    description: siteConfig.descriptionKo,
    siteName: siteConfig.nameKo,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.nameKo,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.nameKo,
    description: siteConfig.descriptionKo,
    images: [siteConfig.ogImage],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
