'use client';

import { useState, useEffect, useCallback } from 'react';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Eye, Presentation, Loader2, ShoppingCart, Check } from 'lucide-react';
import { getPublishedReports } from '@/lib/api/reports';
import type { ReportItem } from '@/lib/api/reports';
import { getViewCounts } from '@/lib/api/views';
import { useCart } from '@/contexts/cart-context';
import { formatPrice, resolveImageUrl } from '@/lib/utils';

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

function ReportCard({ report, locale, viewCount }: { report: ReportItem; locale: string; viewCount?: number }) {
  const { addItem, isInCart } = useCart();
  const cartSlug = `report-${report.id}`;
  const inCart = isInCart(cartSlug);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart || report.is_free) return;
    addItem({
      slug: cartSlug,
      title: report.title,
      titleEn: report.title_en || undefined,
      coverImage: resolveImageUrl(report.cover_image || ''),
      price: report.price,
    });
  };

  return (
    <Link
      href={`/reports/${report.id}`}
      className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-gray-300"
    >
      {/* Thumbnail Image */}
      <div className="relative">
        {report.cover_image ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
            <Image
              src={resolveImageUrl(report.cover_image)}
              alt={report.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
            <Presentation className="h-12 w-12 text-blue-300" />
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {report.featured && (
            <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-yellow-900 shadow-sm">
              {locale === 'ko' ? '추천' : 'Featured'}
            </span>
          )}
          {report.is_free && (
            <span className="rounded bg-green-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
              {locale === 'ko' ? '무료' : 'Free'}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {locale === 'ko' ? report.title : (report.title_en || report.title)}
        </h3>
        {report.description && (
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">
            {locale === 'ko' ? report.description : (report.description_en || report.description)}
          </p>
        )}

        {/* Price */}
        <div className="mt-3 flex items-center gap-2">
          {report.is_free ? (
            <>
              {(report.price || 0) > 0 && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(report.price || 0, locale)}
                </span>
              )}
              <span className="text-sm font-bold text-green-600">
                {locale === 'ko' ? '무료' : 'Free'}
              </span>
            </>
          ) : (report.price || 0) > 0 ? (
            <span className="text-sm font-bold text-gray-900">
              {formatPrice(report.price || 0, locale)}
            </span>
          ) : null}
        </div>

        {/* Tags & Platform */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
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
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">
            {new Date(report.published_date).toLocaleDateString(
              locale === 'ko' ? 'ko-KR' : 'en-US',
            )}
          </span>
          {(viewCount ?? 0) > 0 && (
            <span className="inline-flex items-center gap-1 text-gray-500">
              <Eye className="h-3.5 w-3.5" />
              <span className="text-xs">{(viewCount ?? 0).toLocaleString()}</span>
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Cart Button */}
          {!report.is_free && (
            <button
              onClick={handleAddToCart}
              className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors ${
                inCart
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-500 hover:bg-blue-100 hover:text-blue-600'
              }`}
              title={
                inCart
                  ? (locale === 'ko' ? '장바구니에 담김' : 'In cart')
                  : (locale === 'ko' ? '장바구니 담기' : 'Add to cart')
              }
            >
              {inCart ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
            </button>
          )}
          <span className="flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:text-blue-700">
            {locale === 'ko' ? '자세히 보기' : 'View Details'}
          </span>
        </div>
      </div>
    </Link>
  );
}

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
