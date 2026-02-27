import { BookCard } from './book-card';
import type { Book } from '@/types/book';

export type BookGridLayout = 'portrait' | 'landscape';

interface BookGridProps {
  books: Book[];
  locale?: string;
  layout?: BookGridLayout;
}

export function BookGrid({ books, locale = 'ko', layout = 'portrait' }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        {locale === 'ko' ? '도서가 없습니다' : 'No books found'}
      </div>
    );
  }

  const gridClass = layout === 'landscape'
    ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    : 'grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';

  return (
    <div className={gridClass}>
      {books.map((book) => (
        <BookCard key={book.slug} book={book} locale={locale} layout={layout} />
      ))}
    </div>
  );
}
