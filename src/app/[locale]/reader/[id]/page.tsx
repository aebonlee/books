import { setRequestLocale } from 'next-intl/server';
import { ReaderClient } from './reader-client';

export function generateStaticParams() {
  const slugs = [
    'python-programming-basics',
    'ai-trends-2025',
    'cloud-computing-news',
    'web-development-lecture',
    'database-workshop',
    'interactive-javascript',
  ];
  const locales = ['ko', 'en'];
  return locales.flatMap((locale) =>
    slugs.map((id) => ({ locale, id }))
  );
}

export default async function ReaderPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <ReaderClient id={id} />;
}
