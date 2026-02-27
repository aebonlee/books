# DreamIT Biz Books - 개발일지 (Development Log)

## 프로젝트 개요
- **프로젝트명**: DreamIT Biz 출판사 서브사이트
- **도메인**: books.dreamitbiz.com
- **시작일**: 2026-02-27
- **기술 스택**: Next.js 16.1.6, React 19, TypeScript, Tailwind CSS v4, next-intl, Velite, PDF.js, epub.js, Sandpack

---

## Phase 1: 프로젝트 초기화 및 기반 구축 ✅

### 완료 항목
1. **Next.js 프로젝트 생성**
   - `create-next-app`으로 TypeScript + Tailwind CSS + ESLint 설정
   - React 19.2.3, Next.js 16.1.6 기반

2. **의존성 설치**
   - `next-intl` (i18n), `velite` (MDX 콘텐츠), `@mdx-js/loader`, `@mdx-js/react`
   - `rehype-slug`, `rehype-autolink-headings`, `rehype-pretty-code`, `shiki` (코드 하이라이팅)
   - `remark-gfm` (GitHub Flavored Markdown)
   - `flexsearch` (클라이언트 사이드 검색)
   - `lucide-react` (아이콘), `clsx`, `tailwind-merge`, `class-variance-authority` (유틸리티)
   - `@codesandbox/sandpack-react` (코드 플레이그라운드)
   - `pdfjs-dist` (PDF 뷰어), `epubjs` (ePub 리더)

3. **디렉토리 구조 설정**
   ```
   src/
   ├── app/           # Next.js App Router 페이지
   ├── components/    # UI, 레이아웃, 도서, 리더, MDX, 검색 컴포넌트
   ├── config/        # 사이트, 내비게이션, 카테고리 설정
   ├── i18n/          # next-intl 국제화 설정
   ├── lib/           # 유틸리티 및 콘텐츠 접근 레이어
   └── types/         # TypeScript 타입 정의
   content/
   └── books/         # MDX 도서 콘텐츠
   Dev_md/            # 개발 문서
   ```

4. **타입 정의** (`src/types/book.ts`)
   - `ContentCategory`: 6개 카테고리 (간행물, 뉴스기사, 교재, 강의안, 실습교재, 디지털교과서)
   - `Book`, `Author`, `ContentAsset`, `TocItem`, `SearchResult` 등

5. **설정 파일**
   - `src/config/site.ts` - 사이트 메타데이터 및 외부 링크
   - `src/config/categories.ts` - 6개 카테고리 정보 (한/영)
   - `src/config/navigation.ts` - 메인/푸터 내비게이션

6. **i18n 설정** (next-intl v4)
   - `src/i18n/routing.ts` - 라우팅 정의 (ko/en)
   - `src/i18n/request.ts` - 요청별 locale 설정
   - `src/i18n/navigation.ts` - i18n 네비게이션 헬퍼
   - `src/i18n/messages/ko.json`, `en.json` - 번역 메시지

7. **Velite 설정** (`velite.config.ts`)
   - MDX 기반 `books` 컬렉션 스키마 정의
   - 빌드 시 콘텐츠 처리 및 `.velite/` 출력

8. **UI 컴포넌트** (shadcn/ui 패턴)
   - `Button` (6 variants, 4 sizes), `Card`, `Badge`, `Input`, `Skeleton`, `Select`

9. **레이아웃 컴포넌트**
   - `Header` - 로고, 내비게이션, 검색, 언어 전환, 모바일 메뉴
   - `Footer` - 브랜드 정보, 회사 소개, 고객 지원 링크
   - `MobileNav` - 반응형 모바일 내비게이션

10. **Tailwind CSS 커스텀 테마** (`globals.css`)
    - 브랜드 색상 (brand-50~900)
    - Pretendard, JetBrains Mono 폰트
    - `.prose` MDX 스타일

---

## Phase 2: 콘텐츠 페이지 구축 ✅

### 완료 항목
1. **홈페이지** (`src/app/[locale]/page.tsx`)
   - 히어로 배너 (검색 CTA)
   - 추천 도서 섹션
   - 6개 카테고리 그리드
   - 신간 목록
   - 최신 뉴스

2. **전체 카탈로그** (`src/app/[locale]/catalog/page.tsx`)
   - 클라이언트 사이드 검색
   - 카테고리 필터
   - 정렬 (최신순/가격순/인기순)
   - 무료 콘텐츠 필터
   - 페이지네이션

3. **카테고리 목록** (`src/app/[locale]/category/[category]/page.tsx`)
   - 6개 카테고리별 도서 목록
   - `generateStaticParams` + `generateMetadata` SEO

4. **도서 상세** (`src/app/[locale]/books/[slug]/page.tsx`)
   - 커버 이미지, 메타 정보 (저자, ISBN, 페이지 수)
   - 가격/구매 CTA
   - MDX 본문 렌더링
   - 관련 도서 추천

5. **도서 컴포넌트**
   - `BookCard` - 커버, 배지, locale별 제목/가격
   - `BookGrid` - 반응형 2~5열 그리드
   - `CategoryCard` - 아이콘, 컬러 서클, 호버 효과

6. **샘플 MDX 콘텐츠** (카테고리별 1개씩, 6개)
   - `python-programming-basics.mdx` (교재)
   - `ai-trends-2025.mdx` (간행물)
   - `cloud-computing-news.mdx` (뉴스기사)
   - `web-development-lecture.mdx` (강의안)
   - `database-workshop.mdx` (실습교재)
   - `interactive-javascript.mdx` (디지털교과서)

---

## Phase 3: 인증/결제 연동 ✅

### 완료 항목
1. **API 라우트**
   - `src/app/api/auth/route.ts` - 쿠키 기반 인증 검증
   - `src/app/api/auth/purchases/route.ts` - 구매 이력/북마크/독서 진행률
   - `src/app/api/content/[id]/route.ts` - 콘텐츠 스트리밍 (인증 필요)

2. **내 서재** (`src/app/[locale]/library/page.tsx`)
   - 인증 게이트 (미로그인 시 로그인 유도)
   - 통계 카드 (보유 도서, 진행 중, 완료, 북마크)
   - 구매 콘텐츠 목록

3. **SSO 연동**
   - `dreamitbiz_auth` 쿠키 기반 세션 관리
   - 로그인/회원가입/결제는 www.dreamitbiz.com으로 위임

---

## Phase 4: 디지털 콘텐츠 전달 ✅

### 완료 항목
1. **PDF 뷰어** (`src/components/reader/pdf-viewer.tsx`)
   - pdfjs-dist 기반 Canvas 렌더링
   - 페이지 네비게이션 (이전/다음)
   - 줌 컨트롤 (50%~300%)
   - 전체 화면, 다운로드

2. **ePub 리더** (`src/components/reader/epub-reader.tsx`)
   - epubjs 기반 렌더링
   - 목차(TOC) 사이드바
   - 챕터 네비게이션
   - 읽기 진행률 표시

3. **리더 페이지** (`src/app/[locale]/reader/[id]/page.tsx`)
   - PDF/ePub 자동 감지
   - locale 기반 UI 텍스트

---

## Phase 5: 인터랙티브 기능 ✅

### 완료 항목
1. **MDX 커스텀 컴포넌트**
   - `Callout` - 5종 알림 박스 (info, warning, error, success, note)
   - `Figure` - Next.js Image + 캡션
   - `CodePlayground` - Sandpack 코드 실행 환경

2. **MDX 컴포넌트 레지스트리** (`src/components/mdx/mdx-components.tsx`)
   - HTML 요소 오버라이드 (h1~h3, p, a, code, table 등)
   - 커스텀 컴포넌트 등록

3. **검색 다이얼로그** (`src/components/search/search-dialog.tsx`)
   - FlexSearch 기반 클라이언트 사이드 검색
   - 키보드 지원 (Escape 닫기)
   - locale 기반 플레이스홀더

---

## Phase 6: 마무리 ✅

### 완료 항목
1. **SEO 최적화**
   - `src/app/sitemap.ts` - 동적 사이트맵 생성 (ko/en 양 locale)
   - `src/app/robots.ts` - 크롤링 규칙 (/api/, /reader/ 차단)
   - `json-ld.tsx` - Schema.org Book 구조화 데이터

2. **에러 처리**
   - `src/app/not-found.tsx` - 글로벌 404 페이지
   - `src/app/[locale]/not-found.tsx` - locale별 404 페이지
   - `src/app/[locale]/error.tsx` - 에러 바운더리 (재시도 버튼)

3. **플레이스홀더 이미지**
   - `public/images/placeholder-cover.svg` - 도서 커버 플레이스홀더

4. **설정 파일 최적화**
   - `next.config.ts` - Turbopack 호환 Velite 통합
   - `middleware.ts` - next-intl i18n 라우팅

5. **개발 문서**
   - `Dev_md/architecture.md` - 아키텍처 문서
   - `Dev_md/development-log.md` - 개발일지 (본 문서)

---

## 주요 기술 결정

| 항목 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | Next.js 16 (App Router) | SSR/SSG, 파일 기반 라우팅, 최신 React 19 |
| 스타일링 | Tailwind CSS v4 | 유틸리티 우선, @theme 블록으로 브랜드 커스텀 |
| 콘텐츠 관리 | Velite (MDX) | 빌드 타임 처리, 타입 세이프 스키마 |
| i18n | next-intl v4 | App Router 네이티브 지원, 서버 컴포넌트 |
| PDF 뷰어 | pdfjs-dist | Mozilla 공식, Canvas 렌더링 |
| ePub 리더 | epubjs | 경량, 브라우저 네이티브 |
| 코드 실행 | Sandpack | CodeSandbox 기반, 안전한 샌드박스 |
| 검색 | FlexSearch | 클라이언트 사이드, 제로 서버 부하 |
| UI 패턴 | shadcn/ui + cva | 복사-붙여넣기 커스터마이즈, 번들 최적화 |

---

## 파일 구조 요약

```
D:/books/
├── content/books/          # 6개 샘플 MDX 콘텐츠
├── Dev_md/                 # 개발 문서
├── public/images/          # 플레이스홀더 이미지
├── src/
│   ├── app/
│   │   ├── [locale]/       # i18n 라우트 (13개 페이지)
│   │   ├── api/            # 3개 API 라우트
│   │   └── *.ts            # sitemap, robots 등
│   ├── components/
│   │   ├── ui/             # 6개 기본 UI
│   │   ├── layout/         # 3개 레이아웃
│   │   ├── book/           # 3개 도서 관련
│   │   ├── reader/         # 2개 리더
│   │   ├── mdx/            # 4개 MDX
│   │   └── search/         # 1개 검색
│   ├── config/             # 3개 설정
│   ├── i18n/               # 5개 i18n 파일
│   ├── lib/                # 2개 유틸리티
│   └── types/              # 1개 타입 정의
├── middleware.ts            # i18n 미들웨어
├── next.config.ts          # Next.js + Velite 설정
├── velite.config.ts        # 콘텐츠 스키마
└── package.json            # 의존성 관리
```

**총 파일 수**: 약 50개 소스 파일
