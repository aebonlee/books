# 조회수 기능 추가 (갤러리 + 도서)

**날짜**: 2026-02-28
**작업자**: Claude Code (Opus 4.6)
**빌드 결과**: 성공 (Next.js 16.1.6)

---

## 개요

갤러리와 도서 콘텐츠에 조회수(View Count) 기능을 추가.
Supabase `content_views` 테이블로 갤러리/도서 조회수를 통합 관리하며,
목록 페이지에서는 일괄 조회, 상세 페이지에서는 자동 증가 방식으로 동작.

## 아키텍처

| 영역 | 기술 | 설명 |
|------|------|------|
| 조회수 저장 | Supabase DB (`content_views` 테이블) | content_type + content_slug 복합 유니크 |
| 조회수 증가 | Supabase RPC (`increment_view`) | UPSERT 패턴으로 원자적 카운트 증가 |
| 목록 조회 | Supabase Query (`.in()` 일괄 조회) | 카테고리/카탈로그 페이지 진입 시 |
| UI 표시 | Eye 아이콘 + 숫자 | lucide-react Eye 아이콘 사용 |

## Supabase 스키마

```sql
CREATE TABLE content_views (
  id SERIAL PRIMARY KEY,
  content_type TEXT NOT NULL,        -- 'gallery' | 'book'
  content_slug TEXT NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(content_type, content_slug)
);

CREATE OR REPLACE FUNCTION increment_view(p_type TEXT, p_slug TEXT)
RETURNS INTEGER AS $$ ... $$ LANGUAGE plpgsql;
```

## 구현 내역

### 새 파일

| 파일 | 역할 |
|------|------|
| `src/lib/api/views.ts` | 조회수 API — `incrementView()`, `getViewCounts()`, `getViewCount()` |
| `src/components/view-counter.tsx` | ViewCounter 클라이언트 컴포넌트 (Eye 아이콘 + 카운트, increment prop) |

### 수정 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/lib/api/index.ts` | views 모듈 re-export 추가 |
| `src/components/gallery/gallery-card.tsx` | `viewCount` prop 추가, 라이트박스 열 때 `incrementView` 호출, Eye 아이콘 표시 |
| `src/app/[locale]/category/[category]/gallery-grid-client.tsx` | 아이템 로드 후 `getViewCounts('gallery', slugs)` 일괄 조회 → GalleryCard에 전달 |
| `src/components/book/book-card.tsx` | `viewCount` prop 추가, Eye 아이콘 표시 (세로/가로 카드 모두) |
| `src/components/book/book-grid.tsx` | `viewCounts` map prop 추가 → BookCard에 전달 |
| `src/app/[locale]/catalog/page.tsx` | 마운트 시 `getViewCounts('book', slugs)` 일괄 조회 → BookGrid에 전달 |
| `src/app/[locale]/books/[slug]/page.tsx` | ViewCounter 삽입 (increment=true), 메타 정보 그리드에 조회수 표시 |

## 조회수 증가 시점

| 콘텐츠 | 증가 시점 | 구현 방식 |
|--------|-----------|-----------|
| 갤러리 | 라이트박스 열 때 | `handleOpenLightbox`에서 `incrementView('gallery', slug)` 호출 |
| 도서 | 상세 페이지 진입 시 | `ViewCounter` 컴포넌트 `increment` prop으로 마운트 시 자동 호출 |

## 데이터 흐름

```
[목록 페이지]
  1. 컴포넌트 마운트
  2. 아이템 목록 로드
  3. getViewCounts(type, slugs[]) → 일괄 조회
  4. 각 카드에 viewCount 전달
  5. Eye 아이콘 + 숫자 표시

[갤러리 라이트박스]
  1. 사용자가 이미지 클릭
  2. incrementView('gallery', slug) 호출
  3. 반환된 새 카운트로 UI 업데이트
  4. 라이트박스 열림

[도서 상세]
  1. 페이지 진입
  2. ViewCounter(increment=true) 마운트
  3. incrementView('book', slug) 자동 호출
  4. 반환된 카운트 표시
```

## Supabase 자동 설정 (완료)

Supabase Management API를 통해 아래 항목을 자동으로 생성 완료:

| 항목 | 상태 |
|------|------|
| `content_views` 테이블 | 생성 완료 |
| `idx_content_views_type` 인덱스 | 생성 완료 |
| RLS 활성화 + anonymous read/insert/update 정책 | 적용 완료 |
| `increment_view(p_type, p_slug)` RPC 함수 | 생성 완료 |

검증 결과:
- `increment_view('gallery', 'test-item')` → 1 반환 (최초 삽입)
- 동일 호출 재실행 → 2 반환 (카운트 증가 정상)
- `content_views` SELECT 조회 → 정상 동작
