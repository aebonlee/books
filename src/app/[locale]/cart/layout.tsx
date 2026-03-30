import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ko' ? '장바구니' : 'Shopping Cart',
    description:
      locale === 'ko'
        ? '드림아이티비즈 장바구니'
        : 'DreamIT Biz Shopping Cart',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
