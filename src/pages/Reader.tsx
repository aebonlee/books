import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { EpubReader } from '@/components/reader/epub-reader';
import { PdfViewer } from '@/components/reader/pdf-viewer';
import { getSupabase } from '@/lib/supabase';
import { resolveImageUrl } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';

interface ReaderAsset {
  type: string;
  url: string;
  label?: string;
}

export default function Reader() {
  const { id } = useParams<{ id: string }>();
  const { language } = useLanguage();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const ko = language === 'ko';

  const [title, setTitle] = useState('');
  const [asset, setAsset] = useState<ReaderAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchAsset() {
      setLoading(true);
      const client = getSupabase();
      if (!client) {
        setError(ko ? 'Supabase 연결 실패' : 'Supabase connection failed');
        setLoading(false);
        return;
      }

      try {
        const { data, error: fetchErr } = await client
          .from('pub_books')
          .select('title, title_en, assets, is_free')
          .eq('slug', id)
          .single();

        if (fetchErr || !data) {
          setError(ko ? '콘텐츠를 찾을 수 없습니다' : 'Content not found');
          setLoading(false);
          return;
        }

        const row = data as Record<string, unknown>;
        setTitle(ko ? (row.title as string) : ((row.title_en as string) || (row.title as string)));

        const assets = Array.isArray(row.assets) ? row.assets as ReaderAsset[] : [];
        const readable = assets.find((a) => ['pdf', 'epub'].includes(a.type));

        if (!readable) {
          setError(ko ? '읽기 가능한 포맷이 없습니다' : 'No readable format available');
          setLoading(false);
          return;
        }

        setAsset(readable);
      } catch {
        setError(ko ? '로딩 중 오류 발생' : 'Error loading content');
      } finally {
        setLoading(false);
      }
    }

    fetchAsset();
  }, [id, ko]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <p className="text-lg text-red-500">{error || (ko ? '콘텐츠를 찾을 수 없습니다' : 'Content not found')}</p>
        <Link to="/catalog" className="mt-4 inline-flex items-center gap-1 text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          {ko ? '카탈로그로 돌아가기' : 'Back to Catalog'}
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEOHead title={title} />

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <Link
          to={`/books/${id}`}
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {ko ? '도서 정보' : 'Book Details'}
        </Link>

        {asset.type === 'epub' ? (
          <EpubReader url={resolveImageUrl(asset.url)} title={title} />
        ) : (
          <PdfViewer url={resolveImageUrl(asset.url)} title={title} />
        )}
      </div>
    </>
  );
}
