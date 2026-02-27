import type { Book } from '@/types/book';

interface BookJsonLdProps {
  book: Book;
}

export function BookJsonLd({ book }: BookJsonLdProps) {
  const bookFormat = book.assets.some((a) => a.type === 'epub')
    ? 'EBook'
    : book.assets.some((a) => a.type === 'pdf')
      ? 'EBook'
      : 'Hardcover';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: book.authors.map((author) => ({
      '@type': 'Person',
      name: author.name,
    })),
    description: book.description,
    ...(book.isbn && { isbn: book.isbn }),
    image: book.coverImage,
    publisher: {
      '@type': 'Organization',
      name: 'DreamIT Biz',
      url: 'https://www.dreamitbiz.com',
    },
    datePublished: book.publishedAt,
    bookFormat,
    ...(book.pages && { numberOfPages: book.pages }),
    inLanguage: 'ko',
    ...(book.price !== undefined &&
      !book.isFree && {
        offers: {
          '@type': 'Offer',
          price: book.price,
          priceCurrency: 'KRW',
          availability: 'https://schema.org/InStock',
        },
      }),
    ...(book.isFree && {
      isAccessibleForFree: true,
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
