import { useState, useEffect } from 'react';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { ReportCard } from '@/components/report/report-card';
import { getPublishedReports } from '@/lib/api/reports';
import { getViewCounts } from '@/lib/api/views';
import type { ReportItem } from '@/lib/api/reports';
import { Presentation } from 'lucide-react';

export default function Reports() {
  const { t, language } = useLanguage();
  const ko = language === 'ko';

  const [reports, setReports] = useState<ReportItem[]>([]);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');

  useEffect(() => {
    async function fetchReports() {
      setLoading(true);
      try {
        const data = await getPublishedReports();
        setReports(data);

        if (data.length > 0) {
          const slugs = data.map((r) => `report-${r.id}`);
          const counts = await getViewCounts('report', slugs);
          setViewCounts(counts);
        }
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  const filteredReports = filterPlatform === 'all'
    ? reports
    : reports.filter((r) => r.platform === filterPlatform);

  const platforms = [...new Set(reports.map((r) => r.platform))];

  return (
    <>
      <SEOHead
        title={ko ? '연구보고서' : 'Research Reports'}
        description={ko ? '최신 IT 교육 연구보고서 및 프레젠테이션 자료' : 'Latest IT education research reports and presentations'}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {ko ? '연구보고서' : 'Research Reports'}
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {ko
                ? '최신 IT 교육 연구보고서 및 프레젠테이션 자료를 확인하세요'
                : 'Browse the latest IT education research reports and presentations'}
            </p>
          </div>
        </div>

        {/* Filter */}
        {platforms.length > 1 && (
          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setFilterPlatform('all')}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filterPlatform === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {ko ? '전체' : 'All'}
            </button>
            {platforms.map((platform) => (
              <button
                key={platform}
                onClick={() => setFilterPlatform(platform)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filterPlatform === platform
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                }`}
              >
                {platform === 'miricanvas' ? (ko ? '미리캔버스' : 'MiriCanvas') : platform === 'genspark' ? (ko ? '젠스파크' : 'Genspark') : platform}
              </button>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
          ) : filteredReports.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  locale={language}
                  viewCount={viewCounts[`report-${report.id}`]}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Presentation className="h-16 w-16 text-gray-300" />
              <p className="mt-4 text-gray-500">
                {ko ? '등록된 연구보고서가 없습니다' : 'No reports available'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
