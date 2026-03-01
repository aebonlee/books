# 연구보고서 뷰어 개선 — 라우팅 수정 + 도움말 풍선 + signup_domain

**날짜**: 2026-03-01
**작업자**: Claude Code (Opus 4.6)
**빌드 결과**: 성공 (Next.js 16.1.6)

---

## 1. 보고서 상세 페이지 라우팅 수정

### 문제

Static export(`output: 'export'`)에서 동적 라우트 `/reports/[id]`가 작동하지 않아
"보고서를 찾을 수 없습니다" 오류 반복 발생.

### 원인

| 항목 | 문제 |
|------|------|
| `<Link href="/reports/1">` | RSC payload(`.txt`)가 pre-rendered 되지 않아 클라이언트 내비게이션 실패 |
| `404.html` `document.write()` | Next.js 스크립트 로딩 깨짐 |
| 서버 params | `generateStaticParams` fallback으로 항상 `'_'` |

### 해결

| 항목 | 변경 |
|------|------|
| 목록 페이지 Link | `/reports/${id}` → `/reports/_?id=${id}` (pre-rendered 페이지로 직접 이동) |
| 클라이언트 컴포넌트 | `?id=` query param에서 ID 추출 → `history.replaceState`로 URL 정리 |
| 404.html | `document.write()` → `location.replace()` 리다이렉트 방식으로 전환 |

### 동작 흐름

```
[목록에서 클릭]
  <Link href="/reports/_?id=5">
  → pre-rendered /reports/_ 페이지 로드 (RSC payload 존재)
  → 클라이언트: ?id=5 에서 ID 추출
  → history.replaceState → URL을 /reports/5 로 정리
  → getReportById(5) 호출 → 보고서 표시

[직접 URL 접근: /ko/reports/5]
  → GitHub Pages 404
  → 404.html 매칭: /ko/reports/\d+
  → location.replace('/ko/reports/_?id=5')
  → 위와 동일한 흐름
```

### 수정 파일

| 파일 | 변경 |
|------|------|
| `src/app/[locale]/reports/page.tsx` | Link href를 `/_?id=N` 형태로 변경 |
| `src/app/[locale]/reports/[id]/report-detail-client.tsx` | query param 기반 ID 추출 + replaceState |
| `.github/workflows/deploy.yml` | 404.html: location.replace 방식으로 전환 |

---

## 2. 슬라이드 뷰어 도움말 풍선 + 뷰 영역 축소

### 변경 사항

| 항목 | 변경 전 | 변경 후 |
|------|---------|---------|
| iframe 비율 | `paddingBottom: 56.25%` (16:9) | `paddingBottom: 45%` (축소) |
| 도움말 | 없음 | "조작법" 풍선 도움말 버튼 추가 |

### 도움말 내용 (한국어)

- `< >` 좌우 화살표 또는 클릭으로 슬라이드 이동
- `[ ]` 우측 하단 전체화면 버튼으로 크게 보기
- `...` 하단 메뉴에서 페이지 목록 확인
- `(i)` 원본 보기 버튼으로 플랫폼에서 직접 확인

### 수정 파일

| 파일 | 변경 |
|------|------|
| `src/app/[locale]/reports/[id]/report-detail-client.tsx` | HelpCircle 아이콘 + 토글 풍선 도움말 + iframe 비율 축소 |

---

## 3. signup_domain 자동 설정

### 문제

books.dreamitbiz.com에서 로그인한 사용자의 가입사이트(signup_domain)가 "미설정"으로 표시됨.

### 해결

`auth-context.tsx`의 `loadProfile` 함수에서 `check_user_status` RPC 호출 후,
`user_profiles.signup_domain`이 비어있으면 현재 도메인으로 자동 설정.

```typescript
if (p && !p.signup_domain) {
  await client.from('user_profiles')
    .update({ signup_domain: window.location.hostname })
    .eq('id', authUser.id);
  await client.auth.updateUser({
    data: { signup_domain: window.location.hostname },
  });
}
```

### 수정 파일

| 파일 | 변경 |
|------|------|
| `src/contexts/auth-context.tsx` | signup_domain 미설정 시 자동 업데이트 로직 추가 |
