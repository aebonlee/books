'use client';

import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Eye, ExternalLink, Globe, GraduationCap, Gamepad2, Wrench } from 'lucide-react';
import { resolveImageUrl } from '@/lib/utils';
import type { LearningContentItem, LearningContentType } from '@/lib/api/learning-content';

export function getContentTypeLabel(type: LearningContentType, locale: string) {
  const labels: Record<LearningContentType, Record<string, string>> = {
    website: { ko: '웹사이트', en: 'Website' },
    exam: { ko: '시험', en: 'Exam' },
    interactive: { ko: '인터랙티브', en: 'Interactive' },
    tool: { ko: '도구', en: 'Tool' },
  };
  return labels[type]?.[locale] || type;
}

export function getContentTypeColor(type: LearningContentType) {
  switch (type) {
    case 'website':
      return 'bg-blue-100 text-blue-800';
    case 'exam':
      return 'bg-orange-100 text-orange-800';
    case 'interactive':
      return 'bg-purple-100 text-purple-800';
    case 'tool':
      return 'bg-teal-100 text-teal-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

function getContentTypeIcon(type: LearningContentType) {
  switch (type) {
    case 'website':
      return Globe;
    case 'exam':
      return GraduationCap;
    case 'interactive':
      return Gamepad2;
    case 'tool':
      return Wrench;
    default:
      return Globe;
  }
}

export function LearningCard({
  item,
  locale,
  viewCount,
}: {
  item: LearningContentItem;
  locale: string;
  viewCount?: number;
}) {
  const Icon = getContentTypeIcon(item.content_type);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-gray-300"
    >
      {/* Thumbnail */}
      <div className="relative">
        {item.cover_image ? (
          <div className="relative aspect-[16/9] w-full overflow-hidden bg-gray-100">
            <Image
              src={resolveImageUrl(item.cover_image)}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="flex aspect-[16/9] w-full items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
            <Icon className="h-12 w-12 text-blue-300" />
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          {item.featured && (
            <span className="rounded bg-yellow-400 px-2 py-0.5 text-xs font-bold text-yellow-900 shadow-sm">
              {locale === 'ko' ? '추천' : 'Featured'}
            </span>
          )}
          {item.is_free && (
            <span className="rounded bg-green-500 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
              {locale === 'ko' ? '무료' : 'Free'}
            </span>
          )}
        </div>
        {/* External link icon */}
        <div className="absolute top-2 right-2">
          <span className="inline-flex items-center justify-center rounded-full bg-white/80 p-1.5 shadow-sm backdrop-blur-sm">
            <ExternalLink className="h-3.5 w-3.5 text-gray-600" />
          </span>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
          {locale === 'ko' ? item.title : (item.title_en || item.title)}
        </h3>
        {item.description && (
          <p className="mt-1.5 text-sm text-gray-500 line-clamp-2">
            {locale === 'ko' ? item.description : (item.description_en || item.description)}
          </p>
        )}

        {/* Tags & Type */}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${getContentTypeColor(item.content_type)}`}
          >
            <Icon className="h-3 w-3" />
            {getContentTypeLabel(item.content_type, locale)}
          </span>
          {(item.tags || []).map((tag) => (
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
            {new Date(item.published_date).toLocaleDateString(
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
        <span className="flex items-center gap-1 text-xs font-medium text-blue-600 group-hover:text-blue-700">
          {locale === 'ko' ? '바로가기' : 'Visit'}
          <ExternalLink className="h-3 w-3" />
        </span>
      </div>
    </a>
  );
}
