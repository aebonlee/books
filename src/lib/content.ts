// Content data access layer
// This module provides typed access to Velite-generated content

import type { Book, ContentCategory, SearchResult } from '@/types/book';

// Velite generates data at build time into .velite directory
// We import it dynamically to avoid issues during development
function getBooks(): Book[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { books } = require('../../.velite');
    return books || [];
  } catch {
    // Return empty array if velite data not yet generated
    return [];
  }
}

export function getAllBooks(): Book[] {
  return getBooks().sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getBookBySlug(slug: string): Book | undefined {
  return getBooks().find((book) => book.slug === slug);
}

export function getBooksByCategory(category: ContentCategory): Book[] {
  return getAllBooks().filter((book) => book.category === category);
}

export function getFeaturedBooks(): Book[] {
  return getAllBooks().filter((book) => book.featured);
}

export function getRecentBooks(count: number = 6): Book[] {
  return getAllBooks().slice(0, count);
}

export function getBooksByTag(tag: string): Book[] {
  return getAllBooks().filter((book) => book.tags.includes(tag));
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  getBooks().forEach((book) => {
    book.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

export function searchBooks(query: string): SearchResult[] {
  const normalizedQuery = query.toLowerCase();
  return getAllBooks()
    .filter(
      (book) =>
        book.title.toLowerCase().includes(normalizedQuery) ||
        (book.titleEn?.toLowerCase().includes(normalizedQuery)) ||
        book.description.toLowerCase().includes(normalizedQuery) ||
        book.authors.some((a) =>
          a.name.toLowerCase().includes(normalizedQuery)
        ) ||
        book.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
    )
    .map((book) => ({
      slug: book.slug,
      title: book.title,
      description: book.description,
      category: book.category,
      coverImage: book.coverImage,
    }));
}

export function getRelatedBooks(slug: string, count: number = 4): Book[] {
  const book = getBookBySlug(slug);
  if (!book) return [];

  return getAllBooks()
    .filter(
      (b) =>
        b.slug !== slug &&
        (b.category === book.category ||
          b.tags.some((t) => book.tags.includes(t)))
    )
    .slice(0, count);
}
