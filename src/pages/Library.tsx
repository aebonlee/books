import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getPurchases } from '@/lib/api/purchases';
import { formatPrice, formatDate, resolveImageUrl } from '@/lib/utils';
import type { PurchaseRecord } from '@/types/commerce';
import { BookOpen, ShoppingBag } from 'lucide-react';

export default function Library() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const ko = language === 'ko';

  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    async function fetchPurchases() {
      setLoading(true);
      try {
        const data = await getPurchases(user!.id);
        setPurchases(data);
      } catch (err) {
        console.error('Failed to fetch purchases:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchPurchases();
  }, [user?.id]);

  return (
    <>
      <SEOHead title={t('library.title')} description={t('library.description')} />

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('library.title')}</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">{t('library.description')}</p>

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
            </div>
          ) : purchases.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300" />
              <h2 className="mt-4 text-lg font-semibold text-gray-900 dark:text-white">
                {t('library.empty')}
              </h2>
              <Link
                to="/catalog"
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                {ko ? '도서 둘러보기' : 'Browse Books'}
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <div
                  key={purchase.id}
                  className="flex items-center gap-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 shadow-sm"
                >
                  {purchase.coverImage ? (
                    <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded bg-gray-100">
                      <img
                        src={resolveImageUrl(purchase.coverImage)}
                        alt={purchase.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-14 shrink-0 items-center justify-center rounded bg-gray-100">
                      <BookOpen className="h-6 w-6 text-gray-400" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="truncate font-medium text-gray-900 dark:text-white">{purchase.title}</h3>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                      <span>{formatPrice(purchase.price, language)}</span>
                      <span>{formatDate(purchase.purchasedAt, language)}</span>
                      <span className="text-xs text-gray-400 dark:text-gray-500">#{purchase.orderNumber}</span>
                    </div>
                  </div>

                  {purchase.slug && (
                    <Link
                      to={`/reader/${purchase.slug}`}
                      className="shrink-0 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                      {ko ? '읽기' : 'Read'}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
