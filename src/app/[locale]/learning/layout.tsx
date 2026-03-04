import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'ko' ? '온라인 학습 콘텐츠' : 'Online Learning',
    description:
      locale === 'ko'
        ? '드림아이티비즈 온라인 학습 콘텐츠'
        : 'DreamIT Biz Online Learning Content',
  };
}

export default function LearningLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
