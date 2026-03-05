# 관리자 회원 관리 페이지

**날짜**: 2026-03-05

## 배경

관리자 메뉴에 회원 관리 기능이 없었음. `user_profiles` 테이블의 `signup_domain` 필드를 활용하여
`books.dreamitbiz.com`에서 가입한 회원만 필터링하여 보여주는 관리자 전용 페이지를 추가.

## 수정/생성 파일

| 작업 | 파일 | 설명 |
|------|------|------|
| 생성 | `src/lib/api/members.ts` | 회원 목록 API 함수 |
| 생성 | `src/app/[locale]/admin/members/page.tsx` | 회원 관리 페이지 |
| 생성 | `src/app/[locale]/admin/members/layout.tsx` | 메타데이터 레이아웃 |
| 수정 | `src/components/commerce/user-menu.tsx` | admin 메뉴에 링크 추가 |
| 수정 | `src/lib/api/index.ts` | re-export 추가 |

## 구현 상세

### 1. 회원 목록 API — `members.ts`

```typescript
export async function getBooksSiteMembers(): Promise<MemberProfile[]> {
  const { data } = await client
    .from('user_profiles')
    .select('id, email, display_name, avatar_url, provider, role, signup_domain, created_at')
    .eq('signup_domain', 'books.dreamitbiz.com')
    .order('created_at', { ascending: false });
  return data ?? [];
}
```

- `signup_domain = 'books.dreamitbiz.com'` 필터로 해당 사이트 가입자만 조회
- 최신 가입순 정렬

### 2. 회원 관리 페이지 — `admin/members/page.tsx`

- 기존 admin 페이지 패턴 동일: `'use client'` → `useAuth()` → `isAdmin` 체크
- 테이블 컬럼: 아바타+이름, 이메일, 가입 방법(Google/Kakao/Email), 역할, 가입일
- 실시간 검색: 이름/이메일 텍스트 필터
- 총 회원 수 Badge 표시

### 3. 사용자 메뉴 링크

```
Users 아이콘 + "회원 관리 / Members"
```

기존 admin 메뉴(갤러리 관리, 보고서 관리, 학습 콘텐츠 관리) 하단에 추가.

## 데이터 흐름

```
사용자 메뉴 → /admin/members → getBooksSiteMembers()
  → Supabase: user_profiles WHERE signup_domain = 'books.dreamitbiz.com'
  → 테이블 렌더링 (클라이언트 검색 필터)
```

## 검증

- `npm run build` 성공
- `/ko/admin/members`, `/en/admin/members` 정상 생성
