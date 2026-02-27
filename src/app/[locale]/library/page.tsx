'use client';

import { useEffect, useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuth } from '@/contexts/auth-context';
import { getPurchases } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoginModal } from '@/components/commerce/login-modal';
import type { PurchaseRecord } from '@/types/commerce';
import Image from 'next/image';
import {
  BookOpen,
  Bookmark,
  Clock,
  CheckCircle,
  LogIn,
  Loader2,
} from 'lucide-react';

export default function LibraryPage() {
  const t = useTranslations('library');
  const locale = useLocale();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    setLoading(true);
    getPurchases()
      .then((res) => setPurchases(res.purchases))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-16">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <BookOpen className="h-16 w-16 text-gray-300" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-gray-600">{t('loginRequired')}</p>
          <Button className="mt-6" onClick={() => setLoginOpen(true)}>
            <LogIn className="mr-2 h-4 w-4" />
            {locale === 'ko' ? '로그인' : 'Login'}
          </Button>
          <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
      <p className="mt-2 text-gray-600">{t('description')}</p>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base">{t('purchased')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{purchases.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Bookmark className="h-5 w-5 text-yellow-600" />
            <CardTitle className="text-base">{t('bookmarks')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            <CardTitle className="text-base">{t('reading')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <CardTitle className="text-base">{t('completed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>

      {/* Purchased books */}
      {loading ? (
        <div className="mt-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      ) : purchases.length > 0 ? (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {purchases.map((p) => (
            <Link key={p.id} href={`/reader/${p.slug}`} className="group">
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 shadow-sm transition-shadow group-hover:shadow-md">
                <Image
                  src={p.coverImage}
                  alt={p.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-2 truncate text-sm font-medium text-gray-900 group-hover:text-blue-600">
                {p.title}
              </h3>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-12 flex flex-col items-center justify-center py-12 text-center">
          <BookOpen className="h-12 w-12 text-gray-300" />
          <p className="mt-4 text-gray-500">{t('empty')}</p>
          <Link href="/catalog" className="mt-4">
            <Button variant="outline">
              {locale === 'ko' ? '카탈로그 둘러보기' : 'Browse Catalog'}
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
