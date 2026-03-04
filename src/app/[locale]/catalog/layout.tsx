import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ko' ? '전체 카탈로그' : 'Catalog',
    description:
      locale === 'ko'
        ? '드림아이티비즈 출판 전체 도서 카탈로그'
        : 'DreamIT Biz Books Full Catalog',
  };
}

export default function CatalogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
