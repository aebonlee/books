import { useState, useEffect } from 'react';
import { useParams, Link, useSearchParams, useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ViewCounter } from '@/components/view-counter';
import { getReportById } from '@/lib/api/reports';
import { getPlatformLabel, getPlatformColor } from '@/components/report/report-card';
import { formatPrice, formatDate, resolveImageUrl } from '@/lib/utils';
import type { ReportItem } from '@/lib/api/reports';
import {
  ArrowLeft,
  ExternalLink,
  ShoppingCart,
  Check,
  Presentation,
  Calendar,
} from 'lucide-react';

export default function ReportDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { addItem, isInCart } = useCart();
  const { showToast } = useToast();
  const ko = language === 'ko';

  // Support both /reports/:id and /reports/_?id=xxx
  const reportId = id === '_' ? searchParams.get('id') : id;
  const parsedId = reportId ? parseInt(reportId, 10) : NaN;

  const [report, setReport] = useState<ReportItem | null>(null);
  const [loading, setLoading] = useState(true);

  const cartSlug = report ? `report-${report.id}` : '';
  const inCart = cartSlug ? isInCart(cartSlug) : false;

  useEffect(() => {
    if (isNaN(parsedId)) {
      setLoading(false);
      return;
    }

    async function fetchReport() {
      setLoading(true);
      const data = await getReportById(parsedId);
      setReport(data);
      setLoading(false);
    }

    fetchReport();
  }, [parsedId]);

  const handleAddToCart = () => {
    if (!report) return;
    if (inCart) {
      navigate('/cart');
      return;
    }
    addItem({
      slug: cartSlug,
      title: report.title,
      titleEn: report.title_en || undefined,
      coverImage: resolveImageUrl(report.cover_image || ''),
      price: report.price,
    });
    showToast(ko ? '장바구니에 담았습니다' : 'Added to cart', 'success');
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {ko ? '보고서를 찾을 수 없습니다' : 'Report not found'}
        </h1>
        <Link to="/reports" className="mt-4 inline-flex items-center gap-1 text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          {ko ? '목록으로 돌아가기' : 'Back to Reports'}
        </Link>
      </div>
    );
  }

  const title = ko ? report.title : (report.title_en || report.title);
  const description = ko ? report.description : (report.description_en || report.description);
  const body = ko ? report.body : (report.body_en || report.body);

  return (
    <>
      <SEOHead title={title} description={description} />

      <div className="container mx-auto px-4 py-8">
        {/* Back */}
        <Link
          to="/reports"
          className="inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {ko ? '연구보고서' : 'Reports'}
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cover */}
          <div className="lg:col-span-1">
            {report.cover_image ? (
              <div className="sticky top-24 overflow-hidden rounded-xl bg-gray-100 shadow-lg">
                <div className="relative aspect-[16/9]">
                  <img
                    src={resolveImageUrl(report.cover_image)}
                    alt={title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              </div>
            ) : (
              <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100">
                <Presentation className="h-20 w-20 text-blue-300" />
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${getPlatformColor(report.platform)}`}>
                {getPlatformLabel(report.platform, language)}
              </span>
              {report.featured && (
                <Badge variant="default">{ko ? '추천' : 'Featured'}</Badge>
              )}
              {report.is_free && (
                <Badge variant="success">{ko ? '무료' : 'Free'}</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>

            {/* View Counter */}
            <div className="mt-3">
              <ViewCounter type="report" slug={`report-${report.id}`} increment />
            </div>

            {/* Date */}
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(report.published_date, language)}</span>
            </div>

            {/* Price & Cart */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="text-2xl font-bold">
                {report.is_free ? (
                  <span className="text-green-600">{ko ? '무료' : 'Free'}</span>
                ) : report.price > 0 ? (
                  <span className="text-gray-900 dark:text-white">{formatPrice(report.price, language)}</span>
                ) : null}
              </div>
              {!report.is_free && report.price > 0 && (
                <Button onClick={handleAddToCart} variant={inCart ? 'outline' : 'default'}>
                  {inCart ? <Check className="mr-2 h-4 w-4" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
                  {inCart ? (ko ? '장바구니 보기' : 'View Cart') : (ko ? '장바구니 담기' : 'Add to Cart')}
                </Button>
              )}
            </div>

            {/* External Link */}
            {report.url && (
              <div className="mt-4">
                <a
                  href={report.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  {ko ? '원본 보기' : 'View Original'}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            <Separator className="my-8" />

            {/* Description */}
            {description && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{ko ? '설명' : 'Description'}</h2>
                <p className="mt-4 whitespace-pre-wrap text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
              </div>
            )}

            {/* Body */}
            {body && (
              <div className="mt-8">
                <div
                  className="prose prose-sm max-w-none text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              </div>
            )}

            {/* Tags */}
            {report.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2">
                {report.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
