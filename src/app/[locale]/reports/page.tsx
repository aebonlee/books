'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, FileText, Presentation, Loader2 } from 'lucide-react';
import { getPublishedReports } from '@/lib/api/reports';
import type { ReportItem } from '@/lib/api/reports';

function getPlatformLabel(platform: string, locale: string) {
  const labels: Record<string, Record<string, string>> = {
    miricanvas: { ko: '미리캔버스', en: 'MiriCanvas' },
    genspark: { ko: '젠스파크', en: 'Genspark' },
  };
  return labels[platform]?.[locale] || platform;
}

function getPlatformColor(platform: string) {
  switch (platform) {
    case 'miricanvas':
      return 'bg-purple-100 text-purple-800';
    case 'genspark':
      return 'bg-teal-100 text-teal-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default function ReportsPage() {
  const locale = useLocale();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadReports = useCallback(async () => {
    setLoading(true);
    const data = await getPublishedReports();
    setReports(data);
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
            <a
              key={report.id}
              href={report.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-gray-300"
            >
              {/* Card Header with Icon */}
              <div className="flex items-start gap-3 p-5 pb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {locale === 'ko' ? report.title : (report.title_en || report.title)}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {locale === 'ko' ? report.description : (report.description_en || report.description)}
                  </p>
                </div>
              </div>

              {/* Tags & Platform */}
              <div className="flex flex-wrap items-center gap-2 px-5 pb-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPlatformColor(report.platform)}`}
                >
                  {getPlatformLabel(report.platform, locale)}
                </span>
                {(report.tags || []).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
                <span className="text-xs text-gray-400">
                  {new Date(report.created_at).toLocaleDateString(
                    locale === 'ko' ? 'ko-KR' : 'en-US',
                  )}
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:text-blue-700">
                  {locale === 'ko' ? '슬라이드 보기' : 'View Slides'}
                  <ExternalLink className="h-3 w-3" />
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
