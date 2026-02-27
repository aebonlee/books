'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { searchBooks } from '@/lib/content';
import { Search, X } from 'lucide-react';
import type { SearchResult } from '@/types/book';

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const locale = useLocale();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (query.length >= 2) {
      const searchResults = searchBooks(query);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = useCallback(
    (slug: string) => {
      router.push(`/books/${slug}`);
      onClose();
      setQuery('');
    },
    [router, onClose]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (open) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-2xl mx-4">
        {/* Search Input */}
        <div className="flex items-center border-b border-gray-200 px-4">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            placeholder={locale === 'ko' ? '도서, 저자, 키워드 검색...' : 'Search books, authors, keywords...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />
          <button onClick={onClose}>
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="max-h-96 overflow-y-auto p-2">
            {results.map((result) => (
              <button
                key={result.slug}
                onClick={() => handleSelect(result.slug)}
                className="flex w-full items-start gap-3 rounded-md p-3 text-left hover:bg-gray-50"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{result.title}</p>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                    {result.description}
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {result.category}
                  </Badge>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* No Results */}
        {query.length >= 2 && results.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {locale === 'ko' ? '검색 결과가 없습니다' : 'No results found'}
          </div>
        )}

        {/* Hint */}
        {query.length < 2 && (
          <div className="p-8 text-center text-sm text-gray-400">
            {locale === 'ko' ? '2자 이상 입력해주세요' : 'Type at least 2 characters'}
          </div>
        )}
      </div>
    </div>
  );
}
