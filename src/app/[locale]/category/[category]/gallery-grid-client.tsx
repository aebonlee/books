'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { GalleryCard, type GalleryLayout } from '@/components/gallery/gallery-card';
import { getGalleryItemsByCategory } from '@/lib/api/gallery';
import type { GalleryItem, GalleryCategory } from '@/lib/api/gallery';
import { getViewCounts } from '@/lib/api/views';

interface GalleryGridClientProps {
  category: GalleryCategory;
  locale: string;
  layout?: GalleryLayout;
}

export function GalleryGridClient({ category, locale, layout = 'portrait' }: GalleryGridClientProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [viewCounts, setViewCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    getGalleryItemsByCategory(category).then(async (data) => {
      if (cancelled) return;
      setItems(data);
      const slugs = data.map((d) => d.slug);
      const counts = await getViewCounts('gallery', slugs);
      if (!cancelled) {
        setViewCounts(counts);
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [category]);

  if (loading) {
    const gridCls = layout === 'landscape'
      ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      : 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';

    return (
      <div className={gridCls}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className={layout === 'landscape' ? 'aspect-[4/3] w-full' : 'aspect-[3/4] w-full'} />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16 text-center text-gray-500">
        <p className="text-lg">
          {locale === 'ko' ? '등록된 항목이 없습니다' : 'No items available'}
        </p>
      </div>
    );
  }

  const gridCls = layout === 'landscape'
    ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    : 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';

  return (
    <div className={gridCls}>
      {items.map((item) => (
        <GalleryCard key={item.id} item={item} locale={locale} layout={layout} viewCount={viewCounts[item.slug] ?? 0} />
      ))}
    </div>
  );
}
