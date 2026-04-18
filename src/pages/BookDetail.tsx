import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useToast } from '@/contexts/ToastContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ViewCounter } from '@/components/view-counter';
import { getSupabase } from '@/lib/supabase';
import { formatPrice, formatDate, resolveImageUrl } from '@/lib/utils';
import { getCategoryName } from '@/config/categories';
import type { Book } from '@/types/book';
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Tag,
  ShoppingCart,
  Check,
  ExternalLink,
  FileText,
  Download,
} from 'lucide-react';

export default function BookDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const { isLoggedIn } = useAuth();
  const { addItem, isInCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const ko = language === 'ko';

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const inCart = slug ? isInCart(slug) : false;

  useEffect(() => {
    if (!slug) return;

    async function fetchBook() {
      setLoading(true);
      const client = getSupabase();
      if (!client) {
        setLoading(false);
        setNotFound(true);
        return;
      }

      const { data, error } = await client
        .from('pub_books')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const row = data as Record<string, unknown>;
      setBook({
        slug: row.slug as string,
        title: row.title as string,
        titleEn: (row.title_en as string) || undefined,
        description: (row.description as string) || '',
        descriptionEn: (row.description_en as string) || undefined,
        authors: Array.isArray(row.authors) ? row.authors as Book['authors'] : [],
        category: (row.category as Book['category']) || 'textbooks',
        subcategory: (row.subcategory as string) || undefined,
        coverImage: (row.cover_image as string) || '',
        publishedAt: (row.published_date as string) || '',
        updatedAt: (row.updated_at as string) || undefined,
        isbn: (row.isbn as string) || undefined,
        pages: (row.pages as number) || undefined,
        price: (row.price as number) || 0,
        isFree: (row.is_free as boolean) || false,
        tags: Array.isArray(row.tags) ? row.tags as string[] : [],
        assets: Array.isArray(row.assets) ? row.assets as Book['assets'] : [],
        sampleUrl: (row.sample_url as string) || undefined,
        toc: Array.isArray(row.toc) ? row.toc as Book['toc'] : [],
        featured: (row.featured as boolean) || false,
        body: (row.body as string) || undefined,
      });
      setLoading(false);
    }

    fetchBook();
  }, [slug]);

  const handleAddToCart = () => {
    if (!book) return;
    if (inCart) {
      navigate('/cart');
      return;
    }
    addItem({
      slug: book.slug,
      title: book.title,
      titleEn: book.titleEn,
      coverImage: resolveImageUrl(book.coverImage),
      price: book.price || 0,
    });
    showToast(ko ? '장바구니에 담았습니다' : 'Added to cart', 'success');
  };

  const handleBuyNow = () => {
    if (!book) return;
    if (!inCart) {
      addItem({
        slug: book.slug,
        title: book.title,
        titleEn: book.titleEn,
        coverImage: resolveImageUrl(book.coverImage),
        price: book.price || 0,
      });
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600" />
      </div>
    );
  }

  if (notFound || !book) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {ko ? '도서를 찾을 수 없습니다' : 'Book not found'}
        </h1>
        <Link to="/catalog" className="mt-4 inline-flex items-center gap-1 text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          {ko ? '카탈로그로 돌아가기' : 'Back to Catalog'}
        </Link>
      </div>
    );
  }

  const title = ko ? book.title : (book.titleEn || book.title);
  const description = ko ? book.description : (book.descriptionEn || book.description);

  return (
    <>
      <SEOHead title={title} description={description} />

      <div className="container mx-auto px-4 py-8">
        {/* Back link */}
        <Link
          to="/catalog"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
        >
          <ArrowLeft className="h-4 w-4" />
          {ko ? '카탈로그' : 'Catalog'}
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Cover Image */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 shadow-lg">
              <div className="relative aspect-[3/4]">
                <img
                  src={resolveImageUrl(book.coverImage)}
                  alt={title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="lg:col-span-2">
            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">{getCategoryName(book.category, language)}</Badge>
              {book.featured && (
                <Badge variant="default">{ko ? '추천' : 'Featured'}</Badge>
              )}
              {book.isFree && (
                <Badge variant="success">{ko ? '무료' : 'Free'}</Badge>
              )}
            </div>

            {/* Title */}
            <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white">{title}</h1>

            {/* Authors */}
            {book.authors.length > 0 && (
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {book.authors.map((a) => a.name).join(', ')}
              </p>
            )}

            {/* View Counter */}
            <div className="mt-3">
              <ViewCounter type="book" slug={book.slug} increment />
            </div>

            {/* Price & Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="text-2xl font-bold">
                {book.isFree ? (
                  <span className="text-green-600">{ko ? '무료' : 'Free'}</span>
                ) : book.price ? (
                  <span className="text-gray-900 dark:text-white">{formatPrice(book.price, language)}</span>
                ) : null}
              </div>
              {!book.isFree && book.price && book.price > 0 && (
                <div className="flex gap-3">
                  <Button onClick={handleAddToCart} variant={inCart ? 'outline' : 'default'}>
                    {inCart ? <Check className="mr-2 h-4 w-4" /> : <ShoppingCart className="mr-2 h-4 w-4" />}
                    {inCart ? (ko ? '장바구니 보기' : 'View Cart') : (ko ? '장바구니 담기' : 'Add to Cart')}
                  </Button>
                  <Button onClick={handleBuyNow} variant="secondary">
                    {ko ? '바로 구매' : 'Buy Now'}
                  </Button>
                </div>
              )}
            </div>

            {/* Assets (read/download links) */}
            {book.assets.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                {book.assets.map((asset, i) => (
                  <a
                    key={i}
                    href={resolveImageUrl(asset.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    {asset.type === 'pdf' && <FileText className="h-4 w-4" />}
                    {asset.type === 'epub' && <BookOpen className="h-4 w-4" />}
                    {!['pdf', 'epub'].includes(asset.type) && <Download className="h-4 w-4" />}
                    {asset.label || asset.type.toUpperCase()}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            )}

            {/* Sample */}
            {book.sampleUrl && (
              <div className="mt-4">
                <a
                  href={resolveImageUrl(book.sampleUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                  <BookOpen className="h-4 w-4" />
                  {ko ? '샘플 챕터 보기' : 'View Sample Chapter'}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}

            <Separator className="my-8" />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {ko ? '도서 소개' : 'Description'}
              </h2>
              <div className="mt-4 whitespace-pre-wrap text-gray-600 dark:text-gray-400 leading-relaxed">
                {description}
              </div>
              {book.body && (
                <div
                  className="prose prose-sm mt-4 max-w-none text-gray-600 dark:text-gray-400"
                  dangerouslySetInnerHTML={{ __html: book.body }}
                />
              )}
            </div>

            {/* TOC */}
            {book.toc && book.toc.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {ko ? '목차' : 'Table of Contents'}
                </h2>
                <ul className="mt-4 space-y-2">
                  {book.toc.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm text-gray-600 dark:text-gray-400"
                      style={{ paddingLeft: `${item.level * 16}px` }}
                    >
                      {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Meta */}
            <Separator className="my-8" />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {book.publishedAt && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4" />
                  <span>{ko ? '출간일' : 'Published'}: {formatDate(book.publishedAt, language)}</span>
                </div>
              )}
              {book.pages && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <FileText className="h-4 w-4" />
                  <span>{book.pages} {ko ? '페이지' : 'pages'}</span>
                </div>
              )}
              {book.isbn && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ISBN: {book.isbn}
                </div>
              )}
            </div>

            {/* Tags */}
            {book.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                {book.tags.map((tag) => (
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
