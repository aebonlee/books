# DreamIT Biz Books - 개발일지 (Development Log)

## 프로젝트 개요
- **프로젝트명**: DreamIT Biz 출판사 서브사이트
- **도메인**: https://books.dreamitbiz.com
- **리포지토리**: https://github.com/aebonlee/books
- **시작일**: 2026-02-27
- **기술 스택**: Next.js 16.1.6, React 19, TypeScript, Tailwind CSS v4, next-intl, Velite, PDF.js, epub.js, Sandpack
- **배포**: GitHub Pages (GitHub Actions 자동 배포)

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
   - JSON-LD 구조화 데이터 (`json-ld.tsx`)

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
1. **내 서재** (`src/app/[locale]/library/page.tsx`)
   - 인증 게이트 (미로그인 시 로그인 유도)
   - 통계 카드 (보유 도서, 진행 중, 완료, 북마크)
   - 구매 콘텐츠 목록

2. **SSO 연동 설계**
   - `dreamitbiz_auth` 쿠키 기반 세션 관리
   - 로그인/회원가입/결제는 www.dreamitbiz.com으로 위임

> **참고**: GitHub Pages 정적 배포로 전환하면서 API 라우트(`/api/auth`, `/api/content`)는 제거됨.
> 추후 메인 사이트 API 또는 별도 백엔드에서 인증/결제 처리 예정.

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

3. **리더 페이지** (`src/app/[locale]/reader/[id]/`)
   - `page.tsx` (서버) + `reader-client.tsx` (클라이언트) 분리 구조
   - `generateStaticParams`로 정적 생성
   - PDF/ePub 타입별 뷰어 렌더링

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
   - `public/sitemap.xml` - 정적 사이트맵 (ko/en, 28개 URL)
   - `public/robots.txt` - 크롤링 규칙 (/reader/ 차단)
   - `json-ld.tsx` - Schema.org Book 구조화 데이터

2. **에러 처리**
   - `src/app/not-found.tsx` - 글로벌 404 페이지
   - `src/app/[locale]/not-found.tsx` - locale별 404 페이지
   - `src/app/[locale]/error.tsx` - 에러 바운더리 (재시도 버튼)

3. **플레이스홀더 이미지**
   - `public/images/placeholder-cover.svg` - 도서 커버 플레이스홀더

4. **설정 파일 최적화**
   - `next.config.ts` - Turbopack 호환 Velite 통합, `output: 'export'`

5. **개발 문서**
   - `Dev_md/architecture.md` - 아키텍처 문서
   - `Dev_md/development-log.md` - 개발일지 (본 문서)

---

## Phase 7: GitHub Pages 배포 전환 ✅

### 배경
- 초기 Vercel 배포에서 GitHub Pages 정적 배포로 전환
- 서버 사이드 기능 제거, 순수 정적 사이트로 변환

### 변경 사항
1. **`next.config.ts`**
   - `output: 'export'` 추가 (정적 HTML 생성)
   - `images: { unoptimized: true }` (GH Pages는 Image Optimization 미지원)

2. **제거된 파일**
   - `middleware.ts` - 정적 export에서 미지원
   - `src/app/api/auth/route.ts` - 서버 사이드 전용
   - `src/app/api/auth/purchases/route.ts` - 서버 사이드 전용
   - `src/app/api/content/[id]/route.ts` - 서버 사이드 전용
   - `src/app/robots.ts` - 정적 파일로 전환
   - `src/app/sitemap.ts` - 정적 파일로 전환

3. **추가된 파일**
   - `.github/workflows/deploy.yml` - GitHub Actions 자동 배포
   - `public/CNAME` - 커스텀 도메인 (`books.dreamitbiz.com`)
   - `public/.nojekyll` - Jekyll 처리 비활성화
   - `public/robots.txt` - 정적 robots.txt
   - `public/sitemap.xml` - 정적 사이트맵
   - `src/app/[locale]/reader/[id]/reader-client.tsx` - 클라이언트 컴포넌트 분리

4. **수정된 파일**
   - `src/app/page.tsx` - 서버 `redirect()` → 클라이언트 사이드 `router.replace()`
   - `src/app/[locale]/reader/[id]/page.tsx` - 서버/클라이언트 분리, `generateStaticParams` 추가

### 배포 설정
- **GitHub Pages**: Actions workflow 모드
- **커스텀 도메인**: `books.dreamitbiz.com`
- **DNS**: Cloudflare DNS에서 CNAME `books` → `aebonlee.github.io` 설정 필요
- **빌드 결과**: 46개 정적 페이지 (`out/` 디렉토리)

---

## 주요 기술 결정

| 항목 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | Next.js 16 (App Router) | SSG, 파일 기반 라우팅, 최신 React 19 |
| 배포 | GitHub Pages + Actions | 무료 호스팅, 자동 CI/CD, 커스텀 도메인 |
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
├── .github/workflows/      # GitHub Actions 배포
├── content/books/           # 6개 샘플 MDX 콘텐츠
├── Dev_md/                  # 개발 문서
├── public/
│   ├── images/              # 플레이스홀더 이미지
│   ├── CNAME                # 커스텀 도메인
│   ├── robots.txt           # 크롤링 규칙
│   └── sitemap.xml          # 사이트맵
├── src/
│   ├── app/
│   │   ├── [locale]/        # i18n 라우트 (14개 페이지)
│   │   ├── not-found.tsx    # 글로벌 404
│   │   ├── page.tsx         # 루트 → /ko 리다이렉트
│   │   ├── layout.tsx       # 루트 레이아웃
│   │   └── globals.css      # 글로벌 스타일
│   ├── components/
│   │   ├── ui/              # 6개 기본 UI
│   │   ├── layout/          # 3개 레이아웃
│   │   ├── book/            # 3개 도서 관련
│   │   ├── reader/          # 2개 리더
│   │   ├── mdx/             # 4개 MDX
│   │   └── search/          # 1개 검색
│   ├── config/              # 3개 설정
│   ├── i18n/                # 5개 i18n 파일
│   ├── lib/                 # 2개 유틸리티
│   └── types/               # 1개 타입 정의
├── next.config.ts           # Next.js + Velite + static export
├── velite.config.ts         # 콘텐츠 스키마
└── package.json             # 의존성 관리
```

**총 파일 수**: 약 48개 소스 파일 (API routes 제거 후)

---

## 전용 로그인 페이지 구현 (www.dreamitbiz.com 동일 스타일)

### 배경
기존에는 헤더의 로그인 버튼 클릭 시 모달(Dialog)로 로그인 폼을 표시.
www.dreamitbiz.com은 Google 스타일의 전용 로그인 페이지(`/login`)를 사용하고 있어 동일한 형태로 전환.

### 변경 내용

#### 1. 신규 파일
- **`src/app/[locale]/login/page.tsx`** — 전용 로그인 페이지
  - Google 스타일 카드 (420px max-width, 중앙 정렬, 흰색 카드)
  - 2단계 플로우: 방법 선택(Google/Kakao/Email) → 이메일 폼
  - 브랜드 로고: `Dream` `IT` `Biz`
  - OAuth 콜백 에러 감지, 이미 로그인 시 리다이렉트
  - `useSearchParams`를 Suspense 경계로 래핑 (Next.js 16 요구사항)
- **`src/app/auth.css`** — www의 auth.css에서 로그인 관련 스타일만 추출
  - CSS 변수 대신 직접 색상값 사용 (www와 일치)
  - 반응형: 768px 이하 모바일 대응

#### 2. 수정 파일
- **`src/components/commerce/user-menu.tsx`** — 비로그인 시 LoginModal 열기 → `/login?from=현재경로`로 이동
- **`src/components/layout/mobile-nav.tsx`** — 모바일 메뉴에 로그인 링크 추가 (`/login`)
- **`src/components/commerce/login-modal.tsx`** — 체크아웃용 모달을 www 스타일(auth-card-google)로 통일
- **`src/i18n/messages/ko.json`** / **`en.json`** — `auth.loginTitle`, `loginSubtitle`, `emailPlaceholder`, `passwordPlaceholder`, `back`, `loggingIn`, `forgotPassword`, `signUp` 키 추가

### 빌드 결과
- `npm run build` 성공 — 54 pages (login 페이지 추가)
- `/ko/login`, `/en/login` 정적 생성 확인

---

## 결제 흐름 버그 수정 — 주문자 정보 유실 문제

### 발견된 문제점

1. **OAuth 로그인 시 홈페이지로 리다이렉트 (치명적)**
   - `auth.ts`의 `redirectTo: window.location.origin`이 항상 홈페이지로 보냄
   - 체크아웃에서 Google/Kakao 로그인 → 홈페이지로 이동 → 주문자 정보 전부 유실

2. **이메일 로그인 후 자동 재제출 race condition**
   - `pendingSubmit` 자동 재시도가 auto-fill과 같은 렌더 사이클에 실행
   - `buyerName`/`buyerEmail` 상태 업데이트가 커밋되기 전에 `requestSubmit()` 호출
   - 결과: 빈 주문자 정보로 PG에 전달

3. **주문자 정보가 페이지 새로고침을 버티지 못함**
   - OAuth 리다이렉트로 인한 full page reload 시 React state 전부 소멸

### 수정 내용

| 파일 | 변경 |
|------|------|
| `src/lib/auth.ts` | `redirectTo`를 현재 페이지 URL로 변경 (hash 제외). OAuth 후 체크아웃/로그인 페이지로 복귀 |
| `src/components/commerce/payment-form.tsx` | ① sessionStorage로 주문자 정보 저장/복원 ② pendingSubmit을 `buyerEmail` 의존으로 변경 (race condition 제거) ③ 결제 완료 시 sessionStorage 정리 |

### Supabase 설정 주의
OAuth redirect URL이 경로까지 포함하므로, Supabase 대시보드 > Authentication > URL Configuration > Redirect URLs에 `https://books.dreamitbiz.com/**` 패턴 필요.

---

## GitHub Actions 환경변수 빌드 실패 수정

### 근본 원인
GitHub Actions 워크플로우의 `env:` 블록에서 `${{ secrets.X }}`가 미설정 시 빈 문자열(`""`)로 평가됨 → `.env.production`의 정상 값을 덮어씀 → Supabase URL/Key가 빈 문자열로 빌드됨 → 배포된 사이트에서 인증 완전 비활성화.

### 증상
- 배포된 JS 번들에 Supabase URL/Key 미포함 확인
- 로그인 페이지에서 버튼 클릭 시 무반응 (Supabase 클라이언트 null)

### 수정 내용
`deploy.yml`의 빌드 단계를 수정:
- secrets를 임시 변수(`_SUPABASE_URL` 등)에 할당
- `if [ -n "$VAR" ]` 조건으로 비어있지 않을 때만 `export`
- secrets 미설정 시 `.env.production` 값이 그대로 사용됨

---

## 커밋 이력

| 커밋 | 내용 |
|------|------|
| `0926816` | feat: DreamIT Biz 출판사 서브사이트 전체 구현 (Phase 1~6) |
| `18bf773` | refactor: GitHub Pages 정적 배포로 전환 (Phase 7) |

---

## DNS 설정 안내

Cloudflare DNS 패널에서 다음 레코드를 확인/추가:

| 타입 | 이름 | 값 | 프록시 |
|------|------|---|--------|
| CNAME | books | aebonlee.github.io | DNS only (프록시 OFF) |

또는 A 레코드 사용 시:
- `185.199.108.153`
- `185.199.109.153`
- `185.199.110.153`
- `185.199.111.153`

> **주의**: Cloudflare 프록시(주황색 구름)를 켜면 GitHub Pages HTTPS 인증서 발급이 실패할 수 있음. 초기 설정 시 "DNS only"로 설정 권장.

---

## 관리자용 갤러리 게시판 시스템 (Supabase CRUD + 장바구니) ✅

### 배경
전자출판 / 도서&교육교재 / 강의안및실습자료 3개 카테고리 페이지를 관리자가 CRUD로 관리하는 동적 갤러리 게시판으로 전환.
- **기존**: Velite MDX 정적 빌드 콘텐츠 (빌드 타임에 결정)
- **변경**: Supabase `gallery_items` 테이블 → 클라이언트 사이드 동적 로딩
- 관리자가 항목 등록/수정/삭제, 카테고리 구분, 장바구니 연동

### 구현 내용

#### Phase 1: 데이터베이스 (SQL — Supabase 대시보드에서 수동 실행)
- `gallery_items` 테이블 생성
  - `id`, `slug`, `title`, `title_en`, `description`, `description_en`, `category`, `cover_image`, `price`, `is_free`, `featured`, `sort_order`, `is_published`, `author_name`, `tags`, `created_at`, `updated_at`
  - `category` CHECK: `'digital'`, `'textbooks'`, `'lectures'`
  - `updated_at` 자동 갱신 트리거
- RLS 정책:
  - `gallery_public_read`: 공개 항목 누구나 읽기
  - `gallery_admin_*`: 관리자 이메일(`aebon@kakao.com`, `aebon@kyonggi.ac.kr`)만 INSERT/UPDATE/DELETE
- 인덱스: `(category, is_published, sort_order)`

#### Phase 2: API 모듈 — `src/lib/api/gallery.ts` (신규)
기존 `custom-requests.ts`와 동일한 패턴으로 구현:

| 함수 | 용도 |
|------|------|
| `getGalleryItemsByCategory(category)` | 공개 항목 조회 (카테고리 페이지) |
| `getGalleryItemsAdmin(category?)` | 전체 항목 조회 (관리자, 비공개 포함) |
| `createGalleryItem(data)` | 항목 생성 |
| `updateGalleryItem(id, data)` | 항목 수정 |
| `deleteGalleryItem(id)` | 항목 삭제 |
| `uploadCoverImage(file, slug)` | Supabase Storage 이미지 업로드 |

`src/lib/api/index.ts`에 gallery 관련 함수/타입 re-export 추가.

#### Phase 3: 갤러리 카드 — `src/components/gallery/gallery-card.tsx` (신규)
- 기존 `BookCard` 패턴을 따르되, GalleryItem 데이터 모델에 맞게 구현
- `layout` prop: `portrait` (3:4 비율) / `landscape` (4:3 비율)
- 인라인 장바구니 버튼: `useCart().addItem()` 호출
- 뱃지: 추천(featured), 무료(is_free)
- 이미 장바구니에 있으면 체크 아이콘 표시

#### Phase 4: 카테고리 페이지 전환
- **`gallery-grid-client.tsx` (신규)**: `'use client'` 컴포넌트, `useEffect`로 `getGalleryItemsByCategory()` 호출
  - 로딩 스켈레톤 → 빈 상태 → GalleryCard 그리드 렌더링
- **`page.tsx` (수정)**: Velite `getBooksByCategory` + `BookGrid` 제거 → `<GalleryGridClient>` 교체
  - `generateStaticParams()`, `generateMetadata()` 유지 (정적 셸)

#### Phase 5: 관리자 페이지 — `src/app/[locale]/admin/gallery/page.tsx` (신규)
- **접근 제어**: `useAuth().isAdmin` → 비관리자 "접근 권한 없음" 표시
- **테이블 뷰**: 이미지 썸네일, 제목, 카테고리, 가격, 공개/추천 상태, 수정/삭제 버튼
- **카테고리 필터**: 전체/전자출판/도서&교육교재/강의안및실습자료 탭
- **생성/수정 Dialog 폼**: 제목(한/영), 슬러그(auto-generate), 카테고리, 설명(한/영), 커버 이미지(URL 또는 파일 업로드), 가격, 무료/추천/공개 체크박스, 정렬 순서, 저자명, 태그

#### Phase 6: i18n 추가
`ko.json` / `en.json`에 `gallery` + `admin.gallery` 섹션 추가.

### 파일 변경 요약

| 파일 | 작업 |
|------|------|
| `src/lib/api/gallery.ts` | **신규** — Supabase CRUD + 이미지 업로드 |
| `src/lib/api/index.ts` | **수정** — gallery re-export 추가 |
| `src/components/gallery/gallery-card.tsx` | **신규** — 갤러리 카드 (장바구니 버튼) |
| `src/app/[locale]/category/[category]/gallery-grid-client.tsx` | **신규** — 클라이언트 갤러리 그리드 |
| `src/app/[locale]/category/[category]/page.tsx` | **수정** — Velite→Supabase 전환 |
| `src/app/[locale]/admin/gallery/page.tsx` | **신규** — 관리자 CRUD 대시보드 |
| `src/i18n/messages/ko.json` | **수정** — gallery, admin.gallery 메시지 |
| `src/i18n/messages/en.json` | **수정** — gallery, admin.gallery 메시지 |

### 빌드 결과
- `npm run build` 성공 — 52 pages
- `/ko/admin/gallery`, `/en/admin/gallery` 정적 생성 확인
- 카테고리 페이지 3개 정상 빌드

### Supabase 설정 필요 사항
1. SQL Editor에서 테이블/RLS/트리거 생성 (Phase 1 SQL)
2. Storage에 `public-assets` 버킷 생성 (이미지 업로드용)
3. Storage 정책: 인증 사용자 업로드, 공개 읽기

### 추가 변경 사항

#### 테이블명 변경: `gallery_items` → `pub_gallery_items`
기존 메인 사이트의 `gallery_items` 테이블과 충돌 방지를 위해 출판 전용 테이블명 `pub_gallery_items`로 변경.
- `src/lib/api/gallery.ts`의 모든 `.from()` 호출 수정

#### 샘플 MDX 데이터 삭제
- `content/books/` 디렉토리의 6개 샘플 MDX 파일 전부 삭제
- `output: 'export'`에서 빈 `generateStaticParams()` 에러 방지를 위해 `books/[slug]`, `reader/[id]` 페이지에 플레이스홀더 파라미터(`{ slug: '_' }`) 반환 처리

#### 관리자 메뉴 링크 추가
- `src/components/commerce/user-menu.tsx` 수정
- `isAdmin`일 때 풍선 드롭다운 메뉴에 **갤러리 관리** (Settings 아이콘 + `/admin/gallery` 링크) 표시

#### 서브 이미지 지원 (커버 1장 + 서브 최대 5장)
- **DB**: `pub_gallery_items` 테이블에 `sub_images text[] DEFAULT '{}'` 컬럼 추가
- **API**: `GalleryItem` 인터페이스에 `sub_images: string[]` 필드 추가
- **갤러리 카드**: 이미지 개수 뱃지 표시 (📷 N), 카드 클릭 시 라이트박스 오픈
- **라이트박스** (`gallery-lightbox.tsx` 신규):
  - 전체 이미지 슬라이드 뷰어
  - 좌우 화살표 + 키보드(←→, Esc) 네비게이션
  - 하단 썸네일 스트립 + 카운터
  - 제목/설명 표시
- **관리자 폼**: 서브 이미지 파일 업로드(최대 5장), 개별 삭제, 미리보기 썸네일 UI
