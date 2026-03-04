import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ko' ? '맞춤 제작의뢰' : 'Custom Request',
    description:
      locale === 'ko'
        ? '드림아이티비즈 맞춤 제작의뢰 페이지'
        : 'DreamIT Biz Custom Order Request',
  };
}

export default function CustomOrderLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
