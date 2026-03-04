import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ko' ? '내 서재' : 'My Library',
    description:
      locale === 'ko'
        ? '드림아이티비즈 내 서재 — 구매한 도서 목록'
        : 'DreamIT Biz My Library — Purchased Books',
  };
}

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
