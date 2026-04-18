import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { LearningCard } from '@/components/learning/learning-card';
import { getPublishedLearningContents } from '@/lib/api/learning-content';
import { getViewCounts } from '@/lib/api/views';
import type { LearningContentItem, LearningContentType } from '@/lib/api/learning-content';
import { ArrowRight, GraduationCap } from 'lucide-react';

type FilterType = 'all' | LearningContentType;

export default function Learning() {
  const { t, language } = useLanguage();
  const ko = language === 'ko';

  const [items, setItems] = useState<LearningContentItem[]>([]);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await getPublishedLearningContents();
        setItems(data);

        if (data.length > 0) {
          const slugs = data.map((item) => `learning-${item.id}`);
          const counts = await getViewCounts('report', slugs);
          setViewCounts(counts);
        }
      } catch (err) {
        console.error('Failed to fetch learning contents:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const filteredItems = filter === 'all'
    ? items
    : items.filter((item) => item.content_type === filter);

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('learning.filterAll') },
    { key: 'website', label: t('learning.filterWebsite') },
    { key: 'exam', label: t('learning.filterExam') },
    { key: 'interactive', label: t('learning.filterInteractive') },
    { key: 'tool', label: t('learning.filterTool') },
  ];

  return (
    <>
      <SEOHead
        title={t('learning.title')}
        description={t('learning.description')}
      />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('learning.title')}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('learning.description')}</p>

        {/* Filter */}
        <div className="mt-6 flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setFilter(btn.key)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === btn.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
          ) : filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <LearningCard
                  key={item.id}
                  item={item}
                  locale={language}
                  viewCount={viewCounts[`learning-${item.id}`]}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <GraduationCap className="h-16 w-16 text-gray-300" />
              <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                {t('learning.noItems')}
              </p>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {t('learning.noItemsDescription')}
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {t('learning.customCta')}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-gray-600 dark:text-gray-400">
            {t('learning.customCtaDescription')}
          </p>
          <Link
            to="/custom-order"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            {ko ? '맞춤 제작 의뢰' : 'Custom Request'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </>
  );
}
