import type { Metadata } from 'next';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: siteConfig.nameKo,
  description: siteConfig.descriptionKo,
  metadataBase: new URL(siteConfig.url),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteConfig.url,
    languages: {
      'ko': `${siteConfig.url}/ko`,
      'en': `${siteConfig.url}/en`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    alternateLocale: 'en_US',
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
