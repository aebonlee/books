# DreamIT Biz Books - Architecture

## Tech Stack
- **Framework**: Next.js 14+ (App Router, TypeScript)
- **Styling**: Tailwind CSS v4 + shadcn/ui patterns
- **Content**: Velite (MDX-based)
- **i18n**: next-intl (ko/en)
- **Digital Readers**: PDF.js, epub.js
- **Code Playground**: Sandpack (CodeSandbox)
- **Search**: FlexSearch (client-side)

## Directory Structure
```
src/
├── app/
│   ├── [locale]/          # i18n routes
│   │   ├── layout.tsx     # Root layout with Header/Footer
│   │   ├── page.tsx       # Homepage
│   │   ├── catalog/       # Full catalog
│   │   ├── category/      # Category listings
│   │   ├── books/         # Book detail pages
│   │   ├── library/       # My Library (auth required)
│   │   └── reader/        # PDF/ePub reader
│   ├── api/               # API routes
│   │   ├── auth/          # Auth verification
│   │   └── content/       # Content streaming
│   ├── layout.tsx         # Minimal root layout
│   ├── page.tsx           # Root redirect
│   └── globals.css        # Global styles
├── components/
│   ├── ui/                # Base UI (Button, Card, Badge, etc.)
│   ├── layout/            # Header, Footer, MobileNav
│   ├── book/              # BookCard, BookGrid, CategoryCard
│   ├── reader/            # PdfViewer, EpubReader
│   ├── mdx/               # MDX components (Callout, Figure, etc.)
│   └── search/            # SearchDialog
├── config/                # Site, navigation, categories config
├── i18n/                  # next-intl setup
├── lib/                   # Utilities and content layer
└── types/                 # TypeScript types
content/
└── books/                 # MDX book content files
```

## Auth Flow
1. User clicks Login → redirected to www.dreamitbiz.com/login
2. Main site sets `dreamitbiz_auth` cookie
3. Books site reads cookie via middleware/API routes
4. Purchase status verified via API

## Content Pipeline
1. Authors write MDX files in `content/books/`
2. Velite processes MDX at build time
3. Generated data available via `@/lib/content`
4. Pages render with full SEO support
