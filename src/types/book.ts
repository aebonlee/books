export type ContentCategory =
  | 'publications'    // 간행물
  | 'news'           // 뉴스기사
  | 'textbooks'      // 교재
  | 'lectures'       // 강의안
  | 'workbooks'      // 실습교재
  | 'digital';       // 디지털교과서

export type ContentFormat = 'pdf' | 'epub' | 'mdx' | 'video' | 'interactive';

export interface Author {
  name: string;
  slug: string;
  avatar?: string;
  bio?: string;
  affiliation?: string;
}

export interface ContentAsset {
  type: ContentFormat;
  url: string;
  size?: number;
  label?: string;
}

export interface Book {
  slug: string;
  title: string;
  titleEn?: string;
  description: string;
  descriptionEn?: string;
  authors: Author[];
  category: ContentCategory;
  subcategory?: string;
  coverImage: string;
  publishedAt: string;
  updatedAt?: string;
  isbn?: string;
  pages?: number;
  price?: number;
  isFree: boolean;
  tags: string[];
  assets: ContentAsset[];
  sampleUrl?: string;
  toc?: TocItem[];
  featured?: boolean;
  body?: string;
}

export interface TocItem {
  title: string;
  slug: string;
  level: number;
  children?: TocItem[];
}

export interface CategoryInfo {
  slug: string;
  nameKo: string;
  nameEn: string;
  descriptionKo: string;
  descriptionEn: string;
  icon: string;
  color: string;
}

export interface SearchResult {
  slug: string;
  title: string;
  description: string;
  category: ContentCategory;
  coverImage: string;
  score?: number;
}

export interface UserLibrary {
  purchasedBooks: string[];
  bookmarks: string[];
  readingProgress: Record<string, number>;
}
