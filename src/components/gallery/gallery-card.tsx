import { useState } from 'react';
import { ShoppingCart, Check, ChevronLeft, ChevronRight, X, Images, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatPrice, resolveImageUrl } from '@/lib/utils';
import { useCart } from '@/contexts/CartContext';
import type { GalleryItem } from '@/lib/api/gallery';
import { incrementView } from '@/lib/api/views';
import { GalleryLightbox } from './gallery-lightbox';

export type GalleryLayout = 'portrait' | 'landscape';

interface GalleryCardProps {
  item: GalleryItem;
  locale?: string;
  layout?: GalleryLayout;
  viewCount?: number;
}

export function GalleryCard({ item, locale = 'ko', layout = 'portrait', viewCount }: GalleryCardProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [views, setViews] = useState(viewCount ?? 0);

  const allImages = [item.cover_image, ...(item.sub_images || [])].map(resolveImageUrl);
  const hasMultiple = allImages.length > 1;

  const handleOpenLightbox = () => {
    setLightboxOpen(true);
    incrementView('gallery', item.slug).then((n) => {
      if (n > 0) setViews(n);
    });
  };

  if (layout === 'landscape') {
    return (
      <>
        <LandscapeGalleryCard item={item} locale={locale} hasMultiple={hasMultiple} onOpenLightbox={handleOpenLightbox} views={views} />
        {lightboxOpen && (
          <GalleryLightbox
            images={allImages}
            title={locale === 'ko' ? item.title : (item.title_en || item.title)}
            description={locale === 'ko' ? item.description : (item.description_en || item.description)}
            onClose={() => setLightboxOpen(false)}
          />
        )}
      </>
    );
  }

  return (
    <>
      <PortraitGalleryCard item={item} locale={locale} hasMultiple={hasMultiple} onOpenLightbox={handleOpenLightbox} views={views} />
      {lightboxOpen && (
        <GalleryLightbox
          images={allImages}
          title={locale === 'ko' ? item.title : (item.title_en || item.title)}
          description={locale === 'ko' ? item.description : (item.description_en || item.description)}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}

function PortraitGalleryCard({ item, locale, hasMultiple, onOpenLightbox, views }: { item: GalleryItem; locale: string; hasMultiple: boolean; onOpenLightbox: () => void; views: number }) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(item.slug);
  const title = locale === 'ko' ? item.title : (item.title_en || item.title);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart || item.is_free) return;
    addItem({
      slug: item.slug,
      title: item.title,
      titleEn: item.title_en || undefined,
      coverImage: resolveImageUrl(item.cover_image),
      price: item.price,
    });
  };

  return (
    <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-[3/4] cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-700" onClick={onOpenLightbox}>
        <img
          src={resolveImageUrl(item.cover_image)}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {item.featured && (
            <Badge variant="default" className="text-xs">
              {locale === 'ko' ? '추천' : 'Featured'}
            </Badge>
          )}
          {item.is_free && (
            <Badge variant="success" className="text-xs">
              {locale === 'ko' ? '무료' : 'Free'}
            </Badge>
          )}
        </div>
        {hasMultiple && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
            <Images className="h-3 w-3" />
            {[item.cover_image, ...(item.sub_images || [])].length}
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        {item.author_name && (
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{item.author_name}</p>
        )}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {item.is_free ? (
              <span className="text-sm font-bold text-green-600">{locale === 'ko' ? '무료' : 'Free'}</span>
            ) : item.price > 0 ? (
              <span className="text-sm font-bold text-gray-900 dark:text-white">{formatPrice(item.price, locale)}</span>
            ) : null}
            <span className="inline-flex items-center gap-0.5 text-gray-400">
              <Eye className="h-3 w-3" />
              <span className="text-xs">{views}</span>
            </span>
          </div>
          {!item.is_free && item.price > 0 && (
            <button
              onClick={handleAddToCart}
              className={`rounded-full p-1.5 transition-colors ${
                inCart ? 'bg-green-100 text-green-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600'
              }`}
              title={inCart ? (locale === 'ko' ? '장바구니에 있음' : 'In cart') : (locale === 'ko' ? '장바구니 담기' : 'Add to cart')}
            >
              {inCart ? <Check className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function LandscapeGalleryCard({ item, locale, hasMultiple, onOpenLightbox, views }: { item: GalleryItem; locale: string; hasMultiple: boolean; onOpenLightbox: () => void; views: number }) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(item.slug);
  const title = locale === 'ko' ? item.title : (item.title_en || item.title);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCart || item.is_free) return;
    addItem({
      slug: item.slug,
      title: item.title,
      titleEn: item.title_en || undefined,
      coverImage: resolveImageUrl(item.cover_image),
      price: item.price,
    });
  };

  return (
    <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-gray-100 dark:bg-gray-700" onClick={onOpenLightbox}>
        <img
          src={resolveImageUrl(item.cover_image)}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute left-2 top-2 flex flex-col gap-1">
          {item.featured && (
            <Badge variant="default" className="text-xs">{locale === 'ko' ? '추천' : 'Featured'}</Badge>
          )}
          {item.is_free && (
            <Badge variant="success" className="text-xs">{locale === 'ko' ? '무료' : 'Free'}</Badge>
          )}
        </div>
        {hasMultiple && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white">
            <Images className="h-3 w-3" />
            {[item.cover_image, ...(item.sub_images || [])].length}
          </div>
        )}
      </div>

      <CardContent className="p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        <div className="mt-1.5 flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            {item.author_name && <p className="truncate text-xs text-gray-500 dark:text-gray-400">{item.author_name}</p>}
            {item.is_free ? (
              <span className="shrink-0 text-xs font-bold text-green-600">{locale === 'ko' ? '무료' : 'Free'}</span>
            ) : item.price > 0 ? (
              <span className="shrink-0 text-xs font-bold text-gray-900 dark:text-white">{formatPrice(item.price, locale)}</span>
            ) : null}
            <span className="inline-flex shrink-0 items-center gap-0.5 text-gray-400">
              <Eye className="h-3 w-3" />
              <span className="text-xs">{views}</span>
            </span>
          </div>
          {!item.is_free && item.price > 0 && (
            <button
              onClick={handleAddToCart}
              className={`shrink-0 rounded-full p-1 transition-colors ${
                inCart ? 'bg-green-100 text-green-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-blue-100 hover:text-blue-600'
              }`}
              title={inCart ? (locale === 'ko' ? '장바구니에 있음' : 'In cart') : (locale === 'ko' ? '장바구니 담기' : 'Add to cart')}
            >
              {inCart ? <Check className="h-3.5 w-3.5" /> : <ShoppingCart className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
