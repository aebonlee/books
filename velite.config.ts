import { defineConfig, defineCollection, s } from 'velite';

const books = defineCollection({
  name: 'Book',
  pattern: 'books/**/*.mdx',
  schema: s.object({
    slug: s.slug('books'),
    title: s.string().max(200),
    titleEn: s.string().max(200).optional(),
    description: s.string().max(1000),
    descriptionEn: s.string().max(1000).optional(),
    authors: s.array(
      s.object({
        name: s.string(),
        slug: s.string(),
        avatar: s.string().optional(),
        bio: s.string().optional(),
        affiliation: s.string().optional(),
      })
    ),
    category: s.enum([
      'publications',
      'news',
      'textbooks',
      'lectures',
      'workbooks',
      'digital',
    ]),
    subcategory: s.string().optional(),
    coverImage: s.string().default('/images/covers/default.png'),
    publishedAt: s.isodate(),
    updatedAt: s.isodate().optional(),
    isbn: s.string().optional(),
    pages: s.number().optional(),
    price: s.number().optional(),
    isFree: s.boolean().default(false),
    tags: s.array(s.string()).default([]),
    assets: s
      .array(
        s.object({
          type: s.enum(['pdf', 'epub', 'mdx', 'video', 'interactive']),
          url: s.string(),
          size: s.number().optional(),
          label: s.string().optional(),
        })
      )
      .default([]),
    sampleUrl: s.string().optional(),
    featured: s.boolean().default(false),
    toc: s
      .array(
        s.object({
          title: s.string(),
          slug: s.string(),
          level: s.number(),
        })
      )
      .optional(),
    body: s.mdx(),
  }),
});

export default defineConfig({
  root: 'content',
  output: {
    data: '.velite',
    assets: 'public/static',
    base: '/static/',
    name: '[name]-[hash:6].[ext]',
    clean: true,
  },
  collections: { books },
  mdx: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});
