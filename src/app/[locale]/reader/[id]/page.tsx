import { setRequestLocale } from 'next-intl/server';
import { ReaderClient } from './reader-client';

import { getAllBooks } from '@/lib/content';

export function generateStaticParams() {
  const books = getAllBooks();
  if (books.length === 0) return [{ id: '_' }];
  return books.map((book) => ({ id: book.slug }));
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
