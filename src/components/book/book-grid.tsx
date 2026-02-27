import { BookCard } from './book-card';
import type { Book } from '@/types/book';

interface BookGridProps {
  books: Book[];
  locale?: string;
}

export function BookGrid({ books, locale = 'ko' }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500">
        {locale === 'ko' ? '도서가 없습니다' : 'No books found'}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {books.map((book) => (
        <BookCard key={book.slug} book={book} locale={locale} />
      ))}
    </div>
  );
}
