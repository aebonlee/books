'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { GraduationCap, Loader2, ArrowRight, Sparkles } from 'lucide-react';
import { getPublishedLearningContents } from '@/lib/api/learning-content';
import type { LearningContentItem, LearningContentType } from '@/lib/api/learning-content';
import { getViewCounts } from '@/lib/api/views';
import { LearningCard, getContentTypeLabel } from '@/components/learning/learning-card';

type FilterType = 'all' | LearningContentType;

const FILTER_TABS: { value: FilterType; labelKo: string; labelEn: string }[] = [
  { value: 'all', labelKo: '전체', labelEn: 'All' },
  { value: 'website', labelKo: '웹사이트', labelEn: 'Website' },
  { value: 'exam', labelKo: '시험', labelEn: 'Exam' },
  { value: 'interactive', labelKo: '인터랙티브', labelEn: 'Interactive' },
  { value: 'tool', labelKo: '도구', labelEn: 'Tool' },
];

export default function LearningPage() {
  const locale = useLocale();
  const ko = locale === 'ko';
  const [items, setItems] = useState<LearningContentItem[]>([]);
  const [viewCountMap, setViewCountMap] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  const loadItems = useCallback(async () => {
    setLoading(true);
    const data = await getPublishedLearningContents();
    setItems(data);

    if (data.length > 0) {
      const slugs = data.map((item) => `learning-${item.id}`);
      const counts = await getViewCounts('learning' as 'report', slugs);
      setViewCountMap(counts);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const filteredItems = filter === 'all'
    ? items
    : items.filter((item) => item.content_type === filter);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {ko ? '온라인 학습 콘텐츠' : 'Online Learning Content'}
        </h1>
        <p className="mt-2 text-gray-600">
          {ko
            ? 'HTML, 프로그래밍, 대학 시험 준비 등 다양한 온라인 학습 자료를 만나보세요'
            : 'Explore online learning resources for HTML, programming, exam prep, and more'}
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              filter === tab.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {ko ? tab.labelKo : tab.labelEn}
          </button>
        ))}
      </div>

      {/* Content Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <GraduationCap className="h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-600">
            {ko ? '등록된 학습 콘텐츠가 없습니다' : 'No learning content yet'}
          </h2>
          <p className="mt-2 text-gray-400">
            {ko
              ? '학습 콘텐츠가 곧 추가될 예정입니다'
              : 'Learning content will be added soon'}
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <LearningCard
              key={item.id}
              item={item}
              locale={locale}
              viewCount={viewCountMap[`learning-${item.id}`]}
            />
          ))}
        </div>
      )}

      {/* Custom Development CTA */}
      <section className="mt-16 overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-700 p-8 text-white sm:p-12">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5" />
              {ko ? '맞춤 개발' : 'Custom Development'}
            </div>
            <h2 className="text-2xl font-bold sm:text-3xl">
              {ko ? '나만의 학습 사이트가 필요하신가요?' : 'Need a custom learning site?'}
            </h2>
            <p className="mt-2 max-w-xl text-blue-100">
              {ko
                ? '온라인 학습 사이트, 시험 플랫폼, 인터랙티브 교재 등 맞춤 개발을 의뢰하세요.'
                : 'Request custom development for online learning sites, exam platforms, interactive textbooks, and more.'}
            </p>
          </div>
          <Link href="/custom-order" className="shrink-0">
            <Button size="lg" className="bg-white text-indigo-700 shadow-lg hover:bg-blue-50">
              {ko ? '맞춤 제작 의뢰' : 'Custom Request'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
