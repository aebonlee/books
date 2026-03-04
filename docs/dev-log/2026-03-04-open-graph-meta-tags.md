# Open Graph 메타 태그 전면 수정

**날짜**: 2026-03-04

## 배경

카카오톡/슬랙/트위터 등에서 URL 공유 시 미리보기(제목, 설명, 이미지)가 정상 표시되지 않는 문제 해결.

### 기존 문제점
| 항목 | 상태 |
|------|------|
| `og:image` | `siteConfig.ogImage` 경로만 설정, 실제 PNG 파일 부재 |
| `openGraph.images` | 레이아웃에 `images` 필드 미포함 |
| `twitter` 카드 | 전혀 없음 |
| 페이지별 메타데이터 | 14개 주요 페이지 중 11개에 없음 (`'use client'` 제약) |

## 수정 내역

### 1. OG 기본 이미지 생성
- **파일**: `public/images/og-default.png` (1200x630px)
- Sharp 라이브러리로 SVG→PNG 변환 생성
- 브랜드 블루 그라데이션 배경 + 사이트명(한/영) + 태그라인

### 2. 베이스 레이아웃 메타데이터 보강
**`src/app/[locale]/layout.tsx`**:
```typescript
openGraph: {
  images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.nameKo }],
},
twitter: {
  card: 'summary_large_image',
  title: siteConfig.nameKo,
  description: siteConfig.descriptionKo,
  images: [siteConfig.ogImage],
},
```

### 3. 도서 상세 페이지 — twitter 카드 추가
**`src/app/[locale]/books/[slug]/page.tsx`**: 기존 `generateMetadata`에 `twitter` 필드 추가, 커버 이미지 사용.

### 4. 연구보고서 상세 페이지 — generateMetadata 추가
**`src/app/[locale]/reports/[id]/page.tsx`**: 정적 제목/설명으로 `generateMetadata` 신규 추가.

### 5. 'use client' 페이지용 layout.tsx 생성 (7개)
`'use client'` 페이지는 `metadata` export 불가 → 각 라우트에 `layout.tsx` 생성하여 `generateMetadata` 제공.

| 라우트 | title (ko) | title (en) |
|--------|-----------|-----------|
| `catalog/layout.tsx` | 전체 카탈로그 | Catalog |
| `reports/layout.tsx` | 연구보고서 | Research Reports |
| `learning/layout.tsx` | 온라인 학습 콘텐츠 | Online Learning |
| `custom-order/layout.tsx` | 맞춤 제작의뢰 | Custom Request |
| `cart/layout.tsx` | 장바구니 | Shopping Cart |
| `library/layout.tsx` | 내 서재 | My Library |
| `login/layout.tsx` | 로그인 | Login |

`og:image`와 `twitter` 카드는 부모 레이아웃에서 자동 상속되어 중복 설정 불필요.

## 검증 결과

### 빌드
- `npm run build` — 44/44 정적 페이지 생성 성공

### 메타 태그 확인 (ko.html 기준)
```html
<meta property="og:image" content="https://books.dreamitbiz.com/images/og-default.png"/>
<meta property="og:image:width" content="1200"/>
<meta property="og:image:height" content="630"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:image" content="https://books.dreamitbiz.com/images/og-default.png"/>
```

### 페이지 타이틀 확인
| 페이지 | 타이틀 |
|--------|--------|
| 홈 | 드림아이티비즈 출판 |
| 카탈로그 | 전체 카탈로그 \| 드림아이티비즈 출판 |
| 장바구니 | 장바구니 \| 드림아이티비즈 출판 |
| 로그인 | 로그인 \| 드림아이티비즈 출판 |
| 연구보고서 | 연구보고서 \| 드림아이티비즈 출판 |
| 학습 콘텐츠 | 온라인 학습 콘텐츠 \| 드림아이티비즈 출판 |
| 맞춤 제작 | 맞춤 제작의뢰 \| 드림아이티비즈 출판 |
| 내 서재 | 내 서재 \| 드림아이티비즈 출판 |

## 수정 파일 목록 (11개)

| 작업 | 파일 |
|------|------|
| 생성 | `public/images/og-default.png` |
| 수정 | `src/app/[locale]/layout.tsx` |
| 수정 | `src/app/[locale]/books/[slug]/page.tsx` |
| 수정 | `src/app/[locale]/reports/[id]/page.tsx` |
| 생성 | `src/app/[locale]/catalog/layout.tsx` |
| 생성 | `src/app/[locale]/reports/layout.tsx` |
| 생성 | `src/app/[locale]/learning/layout.tsx` |
| 생성 | `src/app/[locale]/custom-order/layout.tsx` |
| 생성 | `src/app/[locale]/cart/layout.tsx` |
| 생성 | `src/app/[locale]/library/layout.tsx` |
| 생성 | `src/app/[locale]/login/layout.tsx` |
