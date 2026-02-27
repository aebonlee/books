'use client';

import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { siteConfig } from '@/config/site';
import {
  BookOpen,
  Bookmark,
  Clock,
  CheckCircle,
  LogIn,
} from 'lucide-react';

export default function LibraryPage() {
  const t = useTranslations('library');
  const locale = useLocale();

  // In production, check auth state and fetch purchases
  const isAuthenticated = false;

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <BookOpen className="h-16 w-16 text-gray-300" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="mt-2 text-gray-600">{t('loginRequired')}</p>
          <a href={siteConfig.links.login} className="mt-6">
            <Button>
              <LogIn className="mr-2 h-4 w-4" />
              {locale === 'ko' ? '로그인' : 'Login'}
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
      <p className="mt-2 text-gray-600">{t('description')}</p>

      {/* Tabs */}
      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-base">{t('purchased')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
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

      {/* Empty State */}
      <div className="mt-12 flex flex-col items-center justify-center py-12 text-center">
        <BookOpen className="h-12 w-12 text-gray-300" />
        <p className="mt-4 text-gray-500">{t('empty')}</p>
        <Link href="/catalog" className="mt-4">
          <Button variant="outline">
            {locale === 'ko' ? '카탈로그 둘러보기' : 'Browse Catalog'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
