# 온라인 학습 콘텐츠 메뉴 + 카탈로그 위치 변경

**날짜**: 2026-03-01
**작업 유형**: 신규 기능 + 메뉴 구조 변경

## 변경 사항

### 1. 내비게이션 구조 변경
| 변경 전 | 변경 후 |
|---------|---------|
| 전체 카탈로그 | (제거 → 메인 페이지 배너로 이동) |
| 전자출판 안내 | 전자출판 안내 |
| 도서 & 교육교재 | 도서 & 교육교재 |
| 강의안 및 실습자료 | 강의안 및 실습자료 |
| 연구보고서 | 연구보고서 |
| — | **온라인 학습 콘텐츠** (신규) |
| 맞춤 제작의뢰 | 맞춤 제작의뢰 |

### 2. 메인 페이지 카탈로그 배너
- 카테고리 섹션 바로 아래에 "전체 카탈로그 바로가기" 배너 추가
- `/catalog` 링크, 아이콘 + 제목 + 설명 + 화살표 구성

### 3. Supabase 테이블
```sql
CREATE TABLE pub_learning_contents (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  title_en TEXT,
  description TEXT NOT NULL,
  description_en TEXT,
  content_type TEXT NOT NULL DEFAULT 'website',  -- website | exam | interactive | tool
  url TEXT NOT NULL,
  cover_image TEXT,
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  price INTEGER NOT NULL DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_free BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
- RLS: 공개 읽기 + 인증된 사용자 쓰기

### 4. 신규 파일

| 파일 | 설명 |
|------|------|
| `src/lib/api/learning-content.ts` | CRUD API (reports.ts 패턴) |
| `src/components/learning/learning-card.tsx` | 카드 컴포넌트 (외부 링크, 유형 배지) |
| `src/app/[locale]/learning/page.tsx` | 공개 목록 (필터 탭 + 카드 그리드 + CTA) |
| `src/app/[locale]/admin/learning-content/page.tsx` | 관리자 CRUD 페이지 |

### 5. 수정 파일

| 파일 | 변경 |
|------|------|
| `src/config/navigation.ts` | 카탈로그 제거, 온라인 학습 콘텐츠 추가 |
| `src/app/[locale]/page.tsx` | 카탈로그 배너 추가 |
| `src/i18n/messages/ko.json` | `learning` 네임스페이스 추가 |
| `src/i18n/messages/en.json` | `learning` 네임스페이스 추가 |
| `src/components/commerce/user-menu.tsx` | 관리자 드롭다운에 학습 콘텐츠 관리 링크 추가 |

### 6. 관리자 메뉴 구조
로그인 후 사용자 드롭다운 (관리자 전용):
- 갤러리 관리 → `/admin/gallery`
- 보고서 관리 → `/admin/reports`
- **학습 콘텐츠 관리** → `/admin/learning-content` (신규)

## 데이터 흐름

```
관리자 → /admin/learning-content → createLearningContent() → Supabase
사용자 → /learning → getPublishedLearningContents() → 카드 그리드 → 외부 URL 새 탭
```

## 콘텐츠 유형 (content_type)

| 값 | 한국어 | 용도 |
|----|--------|------|
| `website` | 웹사이트 | html.dreamitbiz.com 같은 학습 사이트 |
| `exam` | 시험 | 대학 시험/모의고사 사이트 |
| `interactive` | 인터랙티브 | 인터랙티브 교재/데모 |
| `tool` | 도구 | 학습 도구/유틸리티 |
