import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Providers } from '@/components/providers';
import { siteConfig } from '@/config/site';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.nameKo,
    template: `%s | ${siteConfig.nameKo}`,
  },
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

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className="min-h-screen bg-white font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
