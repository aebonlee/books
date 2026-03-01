'use client';

import { useState, useEffect, useCallback } from 'react';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ViewCounter } from '@/components/view-counter';
import { useCart } from '@/contexts/cart-context';
import { getReportById } from '@/lib/api/reports';
import type { ReportItem } from '@/lib/api/reports';
import { formatPrice, resolveImageUrl } from '@/lib/utils';
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  HelpCircle,
  Loader2,
  Presentation,
  ShoppingCart,
  Check,
  Tag,
  X,
} from 'lucide-react';

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

interface ReportDetailClientProps {
  reportId: string;
  locale: string;
}

export function ReportDetailClient({ reportId, locale }: ReportDetailClientProps) {
  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [iframeLoading, setIframeLoading] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const { addItem, isInCart } = useCart();

  const loadReport = useCallback(async () => {
    // Static export: 서버 params는 항상 '_'이므로 query param 또는 URL path에서 ID 추출
    const params = new URLSearchParams(window.location.search);
    const qid = params.get('id');
    let numId: number;

    if (qid) {
      // ?id=N 형태 (목록 페이지 Link 또는 404 redirect)
      numId = parseInt(qid);
      // URL을 깔끔하게 정리: /reports/_?id=5 → /reports/5
      const cleanPath = window.location.pathname.replace(/\/_$/, `/${qid}`);
      window.history.replaceState(null, '', cleanPath);
    } else {
      // 직접 URL 접근 시 path에서 추출 (fallback)
      const pathParts = window.location.pathname.split('/');
      const urlId = pathParts[pathParts.length - 1];
      numId = parseInt(urlId);
    }

    if (isNaN(numId)) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const data = await getReportById(numId);
    setReport(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Presentation className="h-16 w-16 text-gray-300" />
          <h2 className="mt-4 text-xl font-semibold text-gray-600">
            {locale === 'ko' ? '보고서를 찾을 수 없습니다' : 'Report not found'}
          </h2>
          <Link href="/reports" className="mt-4 text-blue-600 hover:text-blue-700">
            {locale === 'ko' ? '← 연구보고서 목록으로' : '← Back to reports'}
          </Link>
        </div>
      </div>
    );
  }

  const cartSlug = `report-${report.id}`;
  const inCart = isInCart(cartSlug);

  const handleAddToCart = () => {
    if (inCart || report.is_free) return;
    addItem({
      slug: cartSlug,
      title: report.title,
      titleEn: report.title_en || undefined,
      coverImage: resolveImageUrl(report.cover_image || ''),
      price: report.price,
    });
  };

  const title = locale === 'ko' ? report.title : (report.title_en || report.title);
  const description = locale === 'ko' ? report.description : (report.description_en || report.description);
  const body = locale === 'ko' ? report.body : (report.body_en || report.body);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back button */}
      <Link
        href="/reports"
        className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {locale === 'ko' ? '연구보고서 목록' : 'Back to Reports'}
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPlatformColor(report.platform)}`}
          >
            {getPlatformLabel(report.platform, locale)}
          </span>
          {report.featured && (
            <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-yellow-900">
              {locale === 'ko' ? '추천' : 'Featured'}
            </span>
          )}
          {report.is_free && (
            <span className="rounded bg-green-500 px-2 py-0.5 text-xs font-bold text-white">
              {locale === 'ko' ? '무료' : 'Free'}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>

        {/* Meta info */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(report.published_date).toLocaleDateString(
              locale === 'ko' ? 'ko-KR' : 'en-US',
              { year: 'numeric', month: 'long', day: 'numeric' },
            )}
          </span>
          <ViewCounter type="report" slug={`report-${report.id}`} increment className="text-sm" />
        </div>

        {/* Tags */}
        {report.tags && report.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Tag className="h-4 w-4 text-gray-400" />
            {report.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* iframe embed */}
      <div className="mx-auto mb-8 max-w-4xl">
        {/* Help tooltip trigger */}
        <div className="mb-2 flex items-center justify-end">
          <div className="relative">
            <button
              onClick={() => setShowHelp(!showHelp)}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              {locale === 'ko' ? '조작법' : 'How to use'}
            </button>
            {showHelp && (
              <div className="absolute right-0 top-full z-20 mt-1 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                <div className="flex items-start justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-800">
                    {locale === 'ko' ? '슬라이드 조작법' : 'Slide Controls'}
                  </span>
                  <button onClick={() => setShowHelp(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {locale === 'ko' ? (
                    <>
                      <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">{'<>'}</span><span>좌우 화살표 또는 클릭으로 슬라이드 이동</span></li>
                      <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">{'[ ]'}</span><span>우측 하단 전체화면 버튼으로 크게 보기</span></li>
                      <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">{'...'}</span><span>하단 메뉴에서 페이지 목록 확인</span></li>
                      <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">{'(i)'}</span><span>원본 보기 버튼으로 플랫폼에서 직접 확인</span></li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">{'<>'}</span><span>Click arrows or swipe to navigate slides</span></li>
                      <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">{'[ ]'}</span><span>Use fullscreen button at bottom right</span></li>
                      <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">{'...'}</span><span>Browse page list from bottom menu</span></li>
                      <li className="flex items-start gap-2"><span className="mt-0.5 shrink-0">{'(i)'}</span><span>Use &quot;View Original&quot; to open on platform</span></li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="relative w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50" style={{ aspectRatio: '16/9' }}>
          {iframeLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                <span className="text-sm text-gray-400">
                  {locale === 'ko' ? '슬라이드 로딩 중...' : 'Loading slides...'}
                </span>
              </div>
            </div>
          )}
          <iframe
            src={report.url}
            className="absolute inset-0 h-full w-full"
            allowFullScreen
            onLoad={() => setIframeLoading(false)}
            title={title}
          />
        </div>
      </div>

      {/* Description / Body section */}
      <div className="mb-8">
        {description && (
          <div className="mb-6">
            <h2 className="mb-3 text-xl font-bold text-gray-900">
              {locale === 'ko' ? '개요' : 'Overview'}
            </h2>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{description}</p>
          </div>
        )}

        {body && (
          <div className="border-t border-gray-200 pt-6">
            <h2 className="mb-3 text-xl font-bold text-gray-900">
              {locale === 'ko' ? '상세 해설' : 'Detailed Analysis'}
            </h2>
            <div className="prose max-w-none text-gray-700 whitespace-pre-line">{body}</div>
          </div>
        )}
      </div>

      {/* CTA section */}
      <div className="flex flex-col gap-4 rounded-lg border border-gray-200 bg-gray-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {report.is_free ? (
            <div className="flex items-center gap-2">
              {(report.price || 0) > 0 && (
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(report.price || 0, locale)}
                </span>
              )}
              <span className="text-xl font-bold text-green-600">
                {locale === 'ko' ? '무료' : 'Free'}
              </span>
            </div>
          ) : (report.price || 0) > 0 ? (
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(report.price || 0, locale)}
            </span>
          ) : null}
        </div>
        <div className="flex gap-3">
          {!report.is_free && (
            <Button onClick={handleAddToCart} disabled={inCart}>
              {inCart ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {locale === 'ko' ? '장바구니에 담김' : 'In Cart'}
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {locale === 'ko' ? '장바구니 담기' : 'Add to Cart'}
                </>
              )}
            </Button>
          )}
          <a href={report.url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              {locale === 'ko' ? '원본 보기' : 'View Original'}
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
