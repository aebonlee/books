import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number, locale: string = 'ko'): string {
  if (locale === 'ko') {
    return `${price.toLocaleString('ko-KR')}원`;
  }
  return `$${(price / 1300).toFixed(2)}`;
}

export function formatDate(date: string, locale: string = 'ko'): string {
  return new Date(date).toLocaleDateString(
    locale === 'ko' ? 'ko-KR' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  );
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com/aebonlee/books/main/';

/** 상대 경로를 GitHub raw URL로 변환. 이미 절대 URL이면 그대로 반환. */
export function resolveImageUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('/')) {
    return path;
  }
  return GITHUB_RAW_BASE + path;
}
