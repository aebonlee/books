# 연구보고서 상세 페이지 전환 — 팝업 → 하위페이지 + iframe + 해설

**날짜**: 2026-02-28
**작업자**: Claude Code (Opus 4.6)
**빌드 결과**: 성공 (Next.js 16.1.6)

---

## 개요

연구보고서 카드 클릭 시 외부 URL로 새 탭을 여는 방식에서,
사이트 내 하위페이지(`/reports/[id]`)로 이동하여 iframe으로 슬라이드를 임베드하고
아래에 해설을 표시하는 방식으로 개선.

## 변경 전후 비교

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| 카드 클릭 | 외부 URL 새 탭 열기 (`<a target="_blank">`) | `/reports/[id]` 내부 하위페이지 이동 (`<Link>`) |
| 슬라이드 보기 | 외부 사이트에서 직접 | iframe 임베드 (16:9 비율) |
| 해설 | 카드 설명 2줄만 표시 | 개요 + 상세 해설(body) 표시 |
| 조회수 | 없음 | 상세 페이지 진입 시 자동 카운트, 카드에 표시 |
| CTA | 없음 | 장바구니 담기 + 원본 보기 버튼 |

## Supabase 스키마 변경

```sql
ALTER TABLE pub_reports ADD COLUMN IF NOT EXISTS body TEXT;
ALTER TABLE pub_reports ADD COLUMN IF NOT EXISTS body_en TEXT;
```

- `description` / `description_en`: 카드 요약용 (기존)
- `body` / `body_en`: 상세 페이지 해설용 (신규, 선택적)

## 구현 내역

### 새 파일

| 파일 | 역할 |
|------|------|
| `src/app/[locale]/reports/[id]/page.tsx` | 서버 래퍼 — `generateStaticParams`, `setRequestLocale` |
| `src/app/[locale]/reports/[id]/report-detail-client.tsx` | 클라이언트 컴포넌트 — iframe 임베드, 메타정보, 해설, CTA |

### 수정 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/lib/api/reports.ts` | `ReportItem`에 `body`, `body_en` 추가, `CreateReportData`에도 추가, `getReportById()` 함수 추가 |
| `src/lib/api/views.ts` | 타입 `'gallery' \| 'book'` → `'gallery' \| 'book' \| 'report'` 확장 |
| `src/components/view-counter.tsx` | 타입 `'gallery' \| 'book'` → `'gallery' \| 'book' \| 'report'` 확장 |
| `src/app/[locale]/reports/page.tsx` | `<a target="_blank">` → `<Link href={/reports/${id}}>`, 조회수 일괄 조회 및 표시, "슬라이드 보기" → "자세히 보기" |
| `src/app/[locale]/admin/reports/page.tsx` | `FormState`에 `body`, `body_en` 추가, 다이얼로그에 해설 textarea 추가 |

## 상세 페이지 레이아웃

```
┌─────────────────────────────────────────┐
│ ← 연구보고서 목록                         │
│                                         │
│ [플랫폼 배지] [추천] [무료]               │
│ 제목                                    │
│ 📅 발표일  👁 조회수                      │
│ 🏷 태그들                                │
│                                         │
│ ┌─────────────────────────────────────┐  │
│ │                                     │  │
│ │         iframe (16:9)               │  │
│ │         슬라이드 임베드               │  │
│ │                                     │  │
│ └─────────────────────────────────────┘  │
│                                         │
│ ## 개요                                 │
│ description 텍스트                       │
│                                         │
│ ────────────────────────                │
│ ## 상세 해설                             │
│ body 텍스트 (있을 경우)                   │
│                                         │
│ ┌─────────────────────────────────────┐  │
│ │ 가격    [장바구니 담기] [원본 보기]    │  │
│ └─────────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

## 데이터 흐름

```
[목록 페이지]
  1. getPublishedReports() → 보고서 목록 로드
  2. getViewCounts('report', slugs[]) → 조회수 일괄 조회
  3. 각 카드에 viewCount 전달, Eye 아이콘 표시
  4. 카드 클릭 → /reports/[id] 내부 라우팅

[상세 페이지]
  1. URL에서 id 파싱
  2. getReportById(id) → 단일 보고서 로드
  3. ViewCounter(increment=true) → 조회수 자동 증가
  4. iframe으로 report.url 임베드
  5. description + body 해설 표시
```

## GitHub Pages 동적 라우트 대응

정적 export(`output: 'export'`)에서 동적 라우트(`/reports/[id]`)는
`generateStaticParams()`에서 반환한 `[{ id: '_' }]`만 빌드되므로,
`/reports/1` 같은 URL 직접 접근 시 404 발생.

### 해결 방식: 404.html SPA fallback

GitHub Actions 워크플로우의 post-build 단계에서 `out/404.html`을
커스텀 SPA fallback으로 교체:

1. 404 발생 시 URL 패턴 매칭 (`/ko|en/reports/\d+` 등)
2. 매칭되면 XHR로 fallback 페이지(`_.html`) fetch
3. `document.write()`로 현재 문서 교체
4. URL은 유지되고 Next.js 클라이언트 사이드 렌더링 정상 동작
5. 매칭 안 되면 일반 404 UI 표시

### 적용 대상 동적 라우트

| 경로 패턴 | fallback 페이지 |
|-----------|----------------|
| `/(ko\|en)/reports/[id]` | `/(ko\|en)/reports/_.html` |
| `/(ko\|en)/books/[slug]` | `/(ko\|en)/books/_.html` |
| `/(ko\|en)/reader/[id]` | `/(ko\|en)/reader/_.html` |

### 수정 파일

| 파일 | 변경 내용 |
|------|-----------|
| `.github/workflows/deploy.yml` | post-build 단계에 404.html SPA fallback 생성 추가 |
| `vercel.json` | 삭제 (GitHub Pages 사용, Vercel 미사용) |

## Supabase 자동 설정 (완료)

| 항목 | 상태 |
|------|------|
| `pub_reports.body` TEXT 컬럼 | 추가 완료 |
| `pub_reports.body_en` TEXT 컬럼 | 추가 완료 |
