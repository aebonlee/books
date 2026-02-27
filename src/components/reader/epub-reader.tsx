'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  ChevronRight,
  List,
  Settings,
  Maximize,
} from 'lucide-react';

interface EpubReaderProps {
  url: string;
  title?: string;
}

export function EpubReader({ url, title }: EpubReaderProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [showToc, setShowToc] = useState(false);
  const [toc, setToc] = useState<Array<{ href: string; label: string; level: number }>>([]);
  const bookRef = useRef<unknown>(null);
  const renditionRef = useRef<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadEpub() {
      if (!viewerRef.current) return;

      try {
        setLoading(true);
        setError(null);

        const ePub = (await import('epubjs')).default;
        const book = ePub(url);
        bookRef.current = book;

        const rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          spread: 'none',
        });

        renditionRef.current = rendition;

        rendition.display();

        // Load TOC
        const navigation = await book.loaded.navigation;
        if (!cancelled && navigation?.toc) {
          setToc(
            navigation.toc.map((item: { href: string; label: string }) => ({
              href: item.href,
              label: item.label,
              level: 0,
            }))
          );
        }

        // Track location changes
        rendition.on('relocated', (location: { start: { percentage: number; cfi: string } }) => {
          if (!cancelled) {
            setProgress(Math.round((location.start.percentage || 0) * 100));
            setCurrentLocation(location.start.cfi);
          }
        });

        rendition.on('rendered', () => {
          if (!cancelled) setLoading(false);
        });
      } catch (err) {
        if (!cancelled) {
          setError('Failed to load ePub');
          setLoading(false);
          console.error('ePub load error:', err);
        }
      }
    }

    loadEpub();

    return () => {
      cancelled = true;
      if (bookRef.current) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (bookRef.current as any).destroy?.();
      }
    };
  }, [url]);

  const goNext = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (renditionRef.current as any)?.next?.();
  };

  const goPrev = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (renditionRef.current as any)?.prev?.();
  };

  const goToChapter = (href: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (renditionRef.current as any)?.display?.(href);
    setShowToc(false);
  };

  return (
    <div className="flex h-[80vh] flex-col rounded-lg border border-gray-200 bg-white">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-2">
          {title && <span className="text-sm font-medium text-gray-700">{title}</span>}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowToc(!showToc)}
            aria-label="Table of Contents"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => viewerRef.current?.requestFullscreen?.()}
            aria-label="Fullscreen"
          >
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative flex flex-1 overflow-hidden">
        {/* TOC Sidebar */}
        {showToc && (
          <div className="absolute left-0 top-0 z-10 h-full w-64 overflow-y-auto border-r border-gray-200 bg-white p-4">
            <h3 className="mb-3 font-semibold text-gray-900">Table of Contents</h3>
            <ul className="space-y-1">
              {toc.map((item, i) => (
                <li key={i}>
                  <button
                    onClick={() => goToChapter(item.href)}
                    className="w-full rounded px-2 py-1 text-left text-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Reader */}
        <div className="flex-1">
          {loading && (
            <div className="flex h-full items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          )}
          {error && (
            <div className="flex h-full items-center justify-center text-red-500">
              {error}
            </div>
          )}
          <div ref={viewerRef} className="h-full" />
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={goPrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-lg bg-black/5 p-2 hover:bg-black/10"
        >
          <ChevronLeft className="h-6 w-6 text-gray-600" />
        </button>
        <button
          onClick={goNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 rounded-l-lg bg-black/5 p-2 hover:bg-black/10"
        >
          <ChevronRight className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="border-t border-gray-200 px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="flex-1 rounded-full bg-gray-200">
            <div
              className="h-1.5 rounded-full bg-blue-600 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-gray-500">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
