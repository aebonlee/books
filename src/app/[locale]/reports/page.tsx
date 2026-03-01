'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { Presentation, Loader2 } from 'lucide-react';
import { getPublishedReports } from '@/lib/api/reports';
import type { ReportItem } from '@/lib/api/reports';
import { getViewCounts } from '@/lib/api/views';
import { ReportCard } from '@/components/report/report-card';

export default function ReportsPage() {
  const locale = useLocale();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [viewCountMap, setViewCountMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const loadReports = useCallback(async () => {
    setLoading(true);
    const data = await getPublishedReports();
    setReports(data);

    if (data.length > 0) {
      const slugs = data.map((r) => `report-${r.id}`);
      const counts = await getViewCounts('report', slugs);
      setViewCountMap(counts);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {locale === 'ko' ? '연구보고서' : 'Research Reports'}
        </h1>
        <p className="mt-2 text-gray-600">
          {locale === 'ko'
            ? '슬라이드 미리보기를 통해 연구보고서를 확인하세요'
            : 'View research reports through slide previews'}
        </p>
      </div>

      {/* Reports Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : reports.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Presentation className="h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-600">
            {locale === 'ko' ? '등록된 연구보고서가 없습니다' : 'No reports yet'}
          </h2>
          <p className="mt-2 text-gray-400">
            {locale === 'ko'
              ? '연구보고서가 곧 추가될 예정입니다'
              : 'Research reports will be added soon'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} locale={locale} viewCount={viewCountMap[`report-${report.id}`]} />
          ))}
        </div>
      )}
    </div>
  );
}
