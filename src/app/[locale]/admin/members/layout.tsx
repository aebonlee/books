import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ko' ? '회원 관리' : 'Members',
    description:
      locale === 'ko'
        ? '드림아이티비즈 회원 관리'
        : 'DreamIT Biz Member Management',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function MembersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
