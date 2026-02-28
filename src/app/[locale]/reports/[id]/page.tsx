import { setRequestLocale } from 'next-intl/server';
import { ReportDetailClient } from './report-detail-client';

export function generateStaticParams() {
  return [{ id: '_' }];
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
