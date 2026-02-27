# 네비게이션 메뉴 변경 + 맞춤 제작의뢰 게시판

**날짜**: 2026-02-27
**작업자**: Claude Code (Opus 4.6)
**빌드 결과**: 성공 (50 pages, Next.js 16.1.6)

---

## 개요

네비게이션 메뉴를 6개에서 5개로 통합하고, "맞춤 제작의뢰" 게시판을 신규 구현.

### 메뉴 변경
| 기존 (6개) | 변경 (5개) |
|------------|------------|
| 전체 카탈로그 | 전체 카탈로그 |
| 간행물 | 전자출판 (= digital) |
| 교재 | 도서 & 교육교재 (= textbooks + publications) |
| 강의안 | 강의안 및 실습자료 (= lectures + workbooks) |
| 실습교재 | 맞춤 제작의뢰 (= 별도 게시판) |
| 디지털교과서 | — |

### 카테고리 매핑
기존 6개의 Velite 콘텐츠 카테고리(publications, news, textbooks, lectures, workbooks, digital)는 데이터 레이어에서 그대로 유지하되, 디스플레이 레이어에서 3개로 통합:

| 디스플레이 카테고리 | 포함 콘텐츠 카테고리 |
|---------------------|---------------------|
| 전자출판 (digital) | `digital` |
| 도서 & 교육교재 (textbooks) | `textbooks` + `publications` |
| 강의안 및 실습자료 (lectures) | `lectures` + `workbooks` |

## 구현 내역

### 수정 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/config/navigation.ts` | 5개 메뉴로 변경 (카탈로그, 전자출판, 도서&교육교재, 강의안및실습자료, 맞춤제작의뢰) |
| `src/config/categories.ts` | 3개 디스플레이 카테고리로 통합 (digital, textbooks, lectures) |
| `src/lib/content.ts` | `getBooksByCategory()`에 복수 카테고리 매핑 추가 |
| `src/types/book.ts` | `CategoryInfo.slug` 타입을 `string`으로 변경 (디스플레이 카테고리 유연성) |
| `src/app/[locale]/category/[category]/page.tsx` | 새 카테고리 목록 적용, 아이콘 매핑 정리 |
| `src/app/[locale]/catalog/page.tsx` | 카테고리 필터에 복수 카테고리 매핑 적용 |
| `src/i18n/messages/ko.json` | categories 라벨 업데이트 + customOrder 섹션 추가 |
| `src/i18n/messages/en.json` | 동일 영어 번역 |

### 신규 파일

| 파일 | 역할 |
|------|------|
| `src/lib/api/custom-requests.ts` | Supabase CRUD (getCustomRequests, getCustomRequest, createCustomRequest, deleteCustomRequest) |
| `src/app/[locale]/custom-order/page.tsx` | 맞춤 제작의뢰 페이지 (목록 + 글쓰기 모달) |

## 맞춤 제작의뢰 페이지 상세

### Supabase 테이블
`custom_requests` 테이블 (수동 SQL 실행):
- `id` (BIGSERIAL PK)
- `title`, `request_type`, `content`, `quantity`, `deadline`
- `author_name`, `author_email`, `author_phone`
- `user_id` (FK → auth.users)
- `status` (pending/reviewing/completed/cancelled)
- `admin_reply`, `created_at`, `updated_at`

### RLS 정책
- SELECT: 누구나 조회 가능
- INSERT: 인증 사용자만
- UPDATE/DELETE: 본인 또는 관리자

### 페이지 기능
- **목록**: 최신순 표시, 제목/유형/작성자/날짜/상태뱃지
- **상세 보기**: 아코디언 방식 확장 (클릭 시 상세 내용, 수량, 납기일, 관리자 답변 표시)
- **글쓰기 폼**: Dialog 모달 (로그인 필수)
  - 제목, 의뢰 유형 (전자출판/교재/교육자료/강의안/기타), 상세 내용
  - 수량, 희망 납기일, 이름, 연락처, 이메일
  - 사용자 프로필에서 이름/이메일 자동 채움
- **삭제**: 본인 작성 의뢰만 삭제 버튼 표시

### 사용자 흐름
```
/custom-order 접속 → 목록 표시 (Supabase에서 조회)
                    ↓
[제작 의뢰하기] 클릭 → 미로그인 시 /login?from=/custom-order 리다이렉트
                    → 로그인 시 모달 폼 표시
                    ↓
폼 작성 → 제출 → Supabase INSERT → 토스트 알림 → 목록 새로고침
```

## 기술적 결정

1. **ContentCategory 타입 유지**: Velite 스키마가 6개 원본 카테고리를 사용하므로, ContentCategory 타입은 변경하지 않고 디스플레이 레이어에서만 매핑 적용
2. **CategoryInfo.slug 타입 완화**: `ContentCategory` → `string`으로 변경하여 디스플레이 카테고리 유연성 확보
3. **카테고리 매핑 이중 적용**: `content.ts`의 `getBooksByCategory()`와 `catalog/page.tsx`의 필터 모두에 동일 매핑 적용

## 빌드 결과

```
Route (app)
├ ● /[locale]/category/[category]
│   ├ /ko/category/digital      ← 전자출판
│   ├ /ko/category/textbooks    ← 도서 & 교육교재
│   ├ /ko/category/lectures     ← 강의안 및 실습자료
├ ● /[locale]/custom-order      ← 맞춤 제작의뢰
│   ├ /ko/custom-order
│   └ /en/custom-order
```
