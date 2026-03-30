import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ko' ? '로그인' : 'Login',
    description:
      locale === 'ko'
        ? '드림아이티비즈 로그인 페이지'
        : 'DreamIT Biz Login',
    robots: {
      index: false,
      follow: false,
    },
  };
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
