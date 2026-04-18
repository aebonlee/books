import { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getSupabase } from '@/lib/supabase';
import { Search, X } from 'lucide-react';

interface SearchResult {
  slug: string;
  title: string;
  description: string;
  category: string;
}

interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SearchDialog({ open, onClose }: SearchDialogProps) {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    const search = async () => {
      const supabase = getSupabase();
      if (!supabase) return;
      const { data } = await supabase
        .from('books_gallery')
        .select('slug, title, title_en, description, description_en, category')
        .or(`title.ilike.%${query}%,title_en.ilike.%${query}%,description.ilike.%${query}%`)
        .eq('is_published', true)
        .limit(10);

      if (data) {
        setResults(data.map((item) => ({
          slug: item.slug,
          title: language === 'ko' ? item.title : (item.title_en || item.title),
          description: language === 'ko' ? item.description : (item.description_en || item.description),
          category: item.category,
        })));
      }
    };

    const timer = setTimeout(search, 300);
    return () => clearTimeout(timer);
  }, [query, language]);

  const handleSelect = useCallback(
    (slug: string) => {
      navigate(`/books/${slug}`);
      onClose();
      setQuery('');
    },
    [navigate, onClose]
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
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />

      <div className="relative w-full max-w-lg rounded-lg bg-white shadow-2xl mx-4">
        <div className="flex items-center border-b border-gray-200 px-4">
          <Search className="h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            placeholder={language === 'ko' ? '도서, 저자, 키워드 검색...' : 'Search books, authors, keywords...'}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-0 focus-visible:ring-0"
          />
          <button onClick={onClose}>
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

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

        {query.length >= 2 && results.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            {language === 'ko' ? '검색 결과가 없습니다' : 'No results found'}
          </div>
        )}

        {query.length < 2 && (
          <div className="p-8 text-center text-sm text-gray-400">
            {language === 'ko' ? '2자 이상 입력해주세요' : 'Type at least 2 characters'}
          </div>
        )}
      </div>
    </div>
  );
}
