# 전자출판 안내 페이지 + 전체 카탈로그 탭 확장

**날짜**: 2026-03-01
**작업 유형**: 신규 기능 / 리팩토링

---

## 개요

1. **전자출판 안내 페이지** — 내비게이션의 "전자출판" 메뉴를 갤러리 그리드 페이지(`/category/digital`)에서 전자출판 소개 페이지(`/e-publishing`)로 변경
2. **전체 카탈로그 탭 확장** — 도서 목록만 보여주던 카탈로그 페이지에 갤러리·연구보고서 탭을 추가하여 모든 콘텐츠를 한 곳에서 탐색 가능하게 개선

---

## 변경 파일 목록

| 파일 | 작업 | 설명 |
|------|------|------|
| `src/app/[locale]/e-publishing/page.tsx` | **신규** | 전자출판 안내 페이지 (서버 컴포넌트) |
| `src/components/report/report-card.tsx` | **신규** | ReportCard 공유 컴포넌트 추출 |
| `src/config/navigation.ts` | 수정 | 전자출판 href `/category/digital` → `/e-publishing` |
| `src/app/[locale]/reports/page.tsx` | 수정 | ReportCard import 경로 변경 |
| `src/lib/api/gallery.ts` | 수정 | `getAllPublishedGalleryItems()` 함수 추가 |
| `src/app/[locale]/catalog/page.tsx` | 수정 | 도서/갤러리/보고서 탭 UI 추가 |
| `src/i18n/messages/ko.json` | 수정 | 탭 관련 번역 키 추가 |
| `src/i18n/messages/en.json` | 수정 | 탭 관련 번역 키 추가 |

---

## 아키텍처

### 전자출판 안내 페이지 (`/e-publishing`)

```
┌─ 히어로 섹션 ─────────────────────────┐
│  제목: "전자출판 안내"                  │
│  서브타이틀: 서비스 소개 문구            │
└───────────────────────────────────────┘
┌─ 전자출판이란? ───────────────────────┐
│  개념 설명 (파란 배경 카드)             │
└───────────────────────────────────────┘
┌─ 제작 절차 ──────────────────────────┐
│  [1.상담] → [2.기획] → [3.제작] →     │
│  [4.검수] → [5.납품]                  │
└───────────────────────────────────────┘
┌─ 이용 가능 기능 ─────────────────────┐
│  PDF뷰어 | EPUB리더 | 갤러리 |        │
│  보고서뷰어 | 인터랙티브              │
└───────────────────────────────────────┘
┌─ CTA ────────────────────────────────┐
│  [맞춤 제작 의뢰] [갤러리 보기]       │
└───────────────────────────────────────┘
```

- 서버 컴포넌트 (SSG)
- `generateMetadata` 포함
- CTA에서 `/custom-order`, `/category/digital` 링크

### 카탈로그 탭 구조

```
[도서 | 갤러리 | 연구보고서]  ← 탭 바
────────────────────────────
도서 탭: 기존 BookGrid + 카테고리/정렬/검색/무료필터
갤러리 탭: GalleryCard 그리드 + 카테고리 필터 + 검색
보고서 탭: ReportCard 그리드 + 검색
```

- 각 탭별 독립적 검색/필터/페이지네이션 상태
- 갤러리·보고서는 탭 최초 클릭 시 lazy load
- `Pagination` 공통 함수 추출

### ReportCard 추출

```
reports/page.tsx (기존)
  └─ ReportCard (인라인)
      ↓ 추출
components/report/report-card.tsx (신규)
  ├─ ReportCard (export)
  ├─ getPlatformLabel (export)
  └─ getPlatformColor (export)
      ↕ import
  ├─ reports/page.tsx
  └─ catalog/page.tsx
```

### 갤러리 API 확장

```typescript
// 기존: 카테고리별 조회
getGalleryItemsByCategory(category) → GalleryItem[]

// 신규: 전체 공개 항목 조회 (카탈로그용)
getAllPublishedGalleryItems() → GalleryItem[]
```

---

## 추가된 i18n 키

| 키 | 한국어 | English |
|----|--------|---------|
| `catalog.tabBooks` | 도서 | Books |
| `catalog.tabGallery` | 갤러리 | Gallery |
| `catalog.tabReports` | 연구보고서 | Reports |
| `catalog.noGalleryItems` | 등록된 갤러리 항목이 없습니다 | No gallery items available |
| `catalog.noReports` | 등록된 연구보고서가 없습니다 | No reports available |

---

## 검증

- `npm run build` ✅ 성공 (40페이지 정적 생성)
- `/e-publishing` 라우트 정상 생성 확인
- 기존 `/category/digital` 라우트 유지 (갤러리 직접 접근 가능)

---

## 후속 수정 (같은 날)

- 히어로 서브타이틀 2줄 줄바꿈 (`<br />`) 적용
- 내비게이션 메뉴명 "전자출판" → "전자출판 안내" / "E-Publishing" → "E-Publishing Guide" 변경
- "전자출판이란?" 설명 텍스트 마침표 기준 줄바꿈 적용
