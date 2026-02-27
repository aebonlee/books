'use client';

import { useState, useMemo } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { BookGrid } from '@/components/book/book-grid';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { categories } from '@/config/categories';
import { getAllBooks } from '@/lib/content';
import { Search, X } from 'lucide-react';

export default function CatalogPage() {
  const t = useTranslations('catalog');
  const locale = useLocale();
  const allBooks = getAllBooks();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [freeOnly, setFreeOnly] = useState(false);
  const [page, setPage] = useState(1);
  const perPage = 12;

  const filteredBooks = useMemo(() => {
    let books = [...allBooks];

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          (b.titleEn?.toLowerCase().includes(q)) ||
          b.description.toLowerCase().includes(q) ||
          b.authors.some((a) => a.name.toLowerCase().includes(q)) ||
          b.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    // Category filter (with merged category mapping)
    if (selectedCategory !== 'all') {
      const categoryMap: Record<string, string[]> = {
        digital: ['digital'],
        textbooks: ['textbooks', 'publications'],
        lectures: ['lectures', 'workbooks'],
      };
      const mapped = categoryMap[selectedCategory] || [selectedCategory];
      books = books.filter((b) => mapped.includes(b.category));
    }

    // Free only filter
    if (freeOnly) {
      books = books.filter((b) => b.isFree);
    }

    // Sort
    switch (sortBy) {
      case 'oldest':
        books.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
        break;
      case 'priceAsc':
        books.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'priceDesc':
        books.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'title':
        books.sort((a, b) => a.title.localeCompare(b.title, locale));
        break;
      default: // newest
        books.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }

    return books;
  }, [allBooks, search, selectedCategory, sortBy, freeOnly, locale]);

  const totalPages = Math.ceil(filteredBooks.length / perPage);
  const paginatedBooks = filteredBooks.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
        <p className="mt-2 text-gray-600">{t('description')}</p>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder={locale === 'ko' ? '검색...' : 'Search...'}
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>

        {/* Category Filter */}
        <Select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); setPage(1); }}
          className="w-full sm:w-48"
        >
          <option value="all">{t('allCategories')}</option>
          {categories.map((cat) => (
            <option key={cat.slug} value={cat.slug}>
              {locale === 'ko' ? cat.nameKo : cat.nameEn}
            </option>
          ))}
        </Select>

        {/* Sort */}
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-40"
        >
          <option value="newest">{t('sortNewest')}</option>
          <option value="oldest">{t('sortOldest')}</option>
          <option value="priceAsc">{t('sortPriceAsc')}</option>
          <option value="priceDesc">{t('sortPriceDesc')}</option>
          <option value="title">{t('sortTitle')}</option>
        </Select>

        {/* Free Only Toggle */}
        <Button
          variant={freeOnly ? 'default' : 'outline'}
          size="sm"
          onClick={() => { setFreeOnly(!freeOnly); setPage(1); }}
        >
          {t('freeOnly')}
        </Button>
      </div>

      {/* Active Filters */}
      {(selectedCategory !== 'all' || freeOnly || search) && (
        <div className="mb-4 flex flex-wrap gap-2">
          {selectedCategory !== 'all' && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedCategory('all')}>
              {categories.find(c => c.slug === selectedCategory)?.[locale === 'ko' ? 'nameKo' : 'nameEn']}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          )}
          {freeOnly && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setFreeOnly(false)}>
              {t('freeOnly')} <X className="ml-1 h-3 w-3" />
            </Badge>
          )}
          {search && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearch('')}>
              &quot;{search}&quot; <X className="ml-1 h-3 w-3" />
            </Badge>
          )}
        </div>
      )}

      {/* Results Count */}
      <p className="mb-4 text-sm text-gray-500">
        {t('results', { count: filteredBooks.length.toString() })}
      </p>

      {/* Book Grid */}
      <BookGrid books={paginatedBooks} locale={locale} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            {locale === 'ko' ? '이전' : 'Previous'}
          </Button>
          <span className="text-sm text-gray-600">
            {page} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            {locale === 'ko' ? '다음' : 'Next'}
          </Button>
        </div>
      )}
    </div>
  );
}
