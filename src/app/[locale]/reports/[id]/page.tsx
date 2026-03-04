import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { ReportDetailClient } from './report-detail-client';

export function generateStaticParams() {
  return [{ id: '_' }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const title = locale === 'ko' ? '연구보고서' : 'Research Report';
  const description =
    locale === 'ko'
      ? '드림아이티비즈 출판 연구보고서 상세 페이지'
      : 'DreamIT Biz Books Research Report Detail';
  return { title, description };
}

export default async function ReportDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  return <ReportDetailClient reportId={id} locale={locale} />;
}
