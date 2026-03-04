import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ko' ? '연구보고서' : 'Research Reports',
    description:
      locale === 'ko'
        ? '드림아이티비즈 출판 연구보고서 목록'
        : 'DreamIT Biz Books Research Reports',
  };
}

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
