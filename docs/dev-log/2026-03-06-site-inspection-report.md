# 전체 사이트 종합 점검 보고서

**프로젝트**: DreamIT Biz Books (aebonlee/books)
**점검일**: 2026-03-06
**점검 범위**: 로컬 D:\books + GitHub 리포지토리 전체
**수정 반영**: 2026-03-07 (H-1 ~ H-4, M-7, L-4 수정 완료)

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 프레임워크 | Next.js 16.1.6 (Turbopack) + React 19.2.3 |
| 언어 | TypeScript 5.x (strict mode) |
| 스타일링 | Tailwind CSS v4 (CSS-in-CSS 방식) |
| 콘텐츠 | Velite (MDX) — 도서 / Supabase — 갤러리·보고서·학습 |
| 인증 | Supabase Auth (Google/Kakao OAuth, PKCE) |
| 결제 | PortOne V1 (KG이니시스) |
| i18n | next-intl v4 (ko/en) |
| 배포 | GitHub Pages (정적 내보내기, GitHub Actions) |
| 총 커밋 | 78개 |
| 브랜치 | main (단일) |
| 로컬 ↔ 원격 | 동기화 완료 (up to date) |

---

## 2. 항목별 점수 평가

### 종합 점수: 82 / 100 (B+)

| # | 평가 항목 | 점수 | 등급 | 비고 |
|---|----------|:---:|:---:|------|
| 1 | **빌드/배포 파이프라인** | 95 | A+ | 정적 내보내기 완벽, SPA 폴백 우수 |
| 2 | **정적 내보내기 호환성** | 100 | A+ | API Route/Server Action/Middleware 없음 |
| 3 | **프로젝트 구조** | 90 | A | 체계적 디렉토리, 관심사 분리 양호 |
| 4 | **의존성 관리** | 92 | A | 최신 패키지, 미사용 없음 |
| 5 | **TypeScript 타입 안전성** | 80 | B+ | strict mode, 일부 `Record<string, unknown>` |
| 6 | **i18n 국제화** | 78 | B | 구조 양호, not-found/error i18n 누락 (수정함) |
| 7 | **라우팅/네비게이션** | 85 | A- | Link import 수정 완료, 동적 라우트 양호 |
| 8 | **메타데이터/SEO** | 65 | C+ | 주요 페이지 OK, 7개 페이지 누락 |
| 9 | **보안** | 75 | B | PKCE 양호, 관리자 체크 클라이언트 측만 |
| 10 | **에러 처리** | 60 | C | API별 반환 방식 비일관, error.tsx 하드코딩 |
| 11 | **코드 품질** | 82 | B+ | no @ts-ignore, console.log 31개 잔존 |
| 12 | **Git/버전 관리** | 88 | A- | 깔끔한 히스토리, 임시 파일 정리함 |

### 등급 기준

| 등급 | 점수 | 의미 |
|:---:|:---:|------|
| A+ | 95-100 | 모범 사례 수준 |
| A | 90-94 | 우수 |
| A- | 85-89 | 양호 |
| B+ | 80-84 | 평균 이상 |
| B | 75-79 | 평균 |
| C+ | 65-74 | 개선 필요 |
| C | 60-64 | 주의 필요 |
| D | 50-59 | 문제 있음 |
| F | 0-49 | 심각 |

---

## 3. 수정 완료 항목

### ✅ H-1. 불필요한 파일 삭제 — 완료

- `NUL`, `tmp_chunk.js` 삭제
- `.gitignore`에 추가하여 재발 방지

### ✅ H-2. not-found.tsx Link import 수정 — 완료

| 파일 | 수정 전 | 수정 후 |
|------|--------|--------|
| `src/app/not-found.tsx` | `import Link from 'next/link'` | `<a href="/ko">` (루트 레벨이라 i18n 컨텍스트 없음) |
| `src/app/[locale]/not-found.tsx` | `import Link from 'next/link'` | `import { Link } from '@/i18n/navigation'` |

### ✅ H-3. GitHub Actions 환경변수 — 완료

```yaml
# 수정 전: 하드코딩
run: |
  export NEXT_PUBLIC_SUPABASE_URL="..."
  npm run build

# 수정 후: GitHub Variables 참조
env:
  NEXT_PUBLIC_SUPABASE_URL: ${{ vars.NEXT_PUBLIC_SUPABASE_URL }}
  NEXT_PUBLIC_SUPABASE_ANON_KEY: ${{ vars.NEXT_PUBLIC_SUPABASE_ANON_KEY }}
  NEXT_PUBLIC_IMP_CODE: ${{ vars.NEXT_PUBLIC_IMP_CODE }}
  NEXT_PUBLIC_PG_PROVIDER: ${{ vars.NEXT_PUBLIC_PG_PROVIDER }}
run: npm run build
```

> **필수 후속 작업**: GitHub 리포지토리 Settings → Secrets and variables → Variables에 4개 값 등록 필요

### ✅ H-4. 하드코딩 폴백값 제거 — 완료

| 파일 | 수정 전 | 수정 후 |
|------|--------|--------|
| `src/lib/supabase.ts` | `\|\| 'https://...'` | `?? ''` |
| `src/lib/payment/pg-bridge.ts` | `\|\| 'imp...'` | `?? ''` |

### ✅ M-7. `npm ci --force` 제거 — 완료

```yaml
# 수정 전
run: npm ci --force

# 수정 후
run: npm ci
```

### ✅ L-4. .gitignore 중복 `.vercel` 제거 — 완료

---

## 4. 미수정 잔여 항목

### 🟡 단기 개선 권장 (MEDIUM)

| # | 이슈 | 점수 영향 | 난이도 |
|---|------|:---:|:---:|
| M-1 | 메타데이터 누락 7개 페이지 | SEO -15 | 쉬움 |
| M-2 | 관리자 접근 제어 서버 측 검증 | 보안 -10 | 보통 |
| M-3 | 결제 SDK SRI 해시 미적용 | 보안 -5 | 쉬움 |
| M-4 | 에러 처리 패턴 비일관 | 품질 -10 | 보통 |
| M-5 | error.tsx 하드코딩 한국어 | i18n -5 | 쉬움 |
| M-6 | .env.example 파일 부재 | DX -3 | 쉬움 |

### 🟢 장기 개선 (LOW)

| # | 이슈 | 점수 영향 | 난이도 |
|---|------|:---:|:---:|
| L-1 | console.log 31개 잔존 | 품질 -3 | 쉬움 |
| L-2 | `Record<string, unknown>` 타입 | TS -3 | 보통 |
| L-3 | window.confirm() → 커스텀 모달 | UX -2 | 보통 |
| L-5 | root page.tsx `next/navigation` | - | 의도적 (i18n 컨텍스트 밖) |
| L-6 | Prettier 설정 없음 | DX -2 | 쉬움 |
| L-7 | 폼 스키마 검증 (zod) 없음 | 보안 -3 | 보통 |
| L-8 | loading.tsx 없음 | UX -2 | 쉬움 |

---

## 5. 빌드/배포 파이프라인 — 95점

### GitHub Actions 워크플로우

```
트리거: push to main + workflow_dispatch
Node.js: 20
Steps: checkout → setup-node → npm ci → build → 404.html 생성 → deploy
```

| 항목 | 상태 |
|------|------|
| actions/checkout | v4 ✅ |
| actions/setup-node | v4 ✅ |
| actions/upload-pages-artifact | v3 ✅ |
| actions/deploy-pages | v4 ✅ |
| 권한 스코프 | contents:read, pages:write, id-token:write ✅ |
| 동시성 제어 | ✅ (중복 배포 방지) |
| 환경변수 | ✅ GitHub Variables 참조 (수정 완료) |
| npm ci | ✅ --force 제거 (수정 완료) |

### SPA 폴백 라우트 (404.html)

```javascript
/^\/(ko|en)\/reports\/(\d+)\/?$/   → /$1/reports/_?id=$2
/^\/(ko|en)\/books\/([^\/]+)\/?$/  → /$1/books/$2
/^\/(ko|en)\/reader\/([^\/]+)\/?$/ → /$1/reader/$2
```

### 정적 내보내기 호환성 — 100점

| 체크 항목 | 결과 |
|----------|------|
| API Routes (route.ts) | 없음 ✅ |
| Server Actions ('use server') | 없음 ✅ |
| Middleware | 없음 ✅ |
| 이미지 최적화 | unoptimized: true ✅ |
| 동적 라우트 정적 파라미터 | 모두 구현 ✅ |
| 빌드 테스트 | 46 페이지 생성 성공 ✅ |

---

## 6. 보안 점검 — 75점

### 양호 (✅)

- Supabase publishable 키만 노출 (service role 키 없음)
- PKCE OAuth 플로우 사용
- sessionStorage 사용 (localStorage 전면 제거 완료)
- `dangerouslySetInnerHTML`은 빌드 타임 MDX에만 사용
- SQL 인젝션 불가 (Supabase 파라미터화 쿼리)
- 정적 내보내기로 서버 측 공격 면적 최소화
- 하드코딩 폴백값 제거 완료 (수정함)
- GitHub Actions 환경변수 분리 완료 (수정함)

### 주의 필요 (⚠️)

- 관리자 체크 클라이언트 측만 (이메일 화이트리스트)
- Supabase RLS 정책 별도 감사 필요
- 결제 SDK 외부 스크립트 SRI 미적용
- 폴백 모드에서 주문 자동 승인

---

## 7. 페이지별 점검 매트릭스

| 경로 | 서버/클라 | 메타 | 정적파라미터 | 인증 | Link |
|------|:---:|:---:|:---:|:---:|:---:|
| `/` (redirect) | Client | - | - | - | ✅ |
| `/[locale]/` | Server | ✅ | ✅ | - | ✅ |
| `/[locale]/books/[slug]` | Server | ✅ | ✅ | - | ✅ |
| `/[locale]/reader/[id]` | Server | ❌ | ✅ | - | ✅ |
| `/[locale]/category/[cat]` | Server | ✅ | ✅ | - | ✅ |
| `/[locale]/reports` | Client | ✅ | - | - | ✅ |
| `/[locale]/reports/[id]` | Server | ✅ | ✅ | - | ✅ |
| `/[locale]/cart` | Client | ✅ | - | - | ✅ |
| `/[locale]/checkout` | Client | ❌ | - | - | ✅ |
| `/[locale]/checkout/success` | Client | ❌ | - | - | ✅ |
| `/[locale]/library` | Client | ✅ | - | ✅ | ✅ |
| `/[locale]/login` | Client | ✅ | - | - | ✅ |
| `/[locale]/catalog` | Client | ❌ | - | - | ✅ |
| `/[locale]/e-publishing` | Server | ✅ | - | - | ✅ |
| `/[locale]/learning` | Client | ❌ | - | - | ✅ |
| `/[locale]/custom-order` | Client | ❌ | - | ✅ | ✅ |
| `/[locale]/admin/gallery` | Client | ❌ | - | Admin | ✅ |
| `/[locale]/admin/reports` | Client | ❌ | - | Admin | ✅ |
| `/[locale]/admin/learning` | Client | ❌ | - | Admin | ✅ |
| `/[locale]/admin/members` | Client | ✅ | - | Admin | ✅ |
| not-found (root) | Server | - | - | - | ✅ (수정) |
| not-found (locale) | Client | - | - | - | ✅ (수정) |

---

## 8. 의존성 현황 — 92점

| 패키지 | 버전 | 상태 |
|--------|------|------|
| next | 16.1.6 | ✅ 최신 |
| react / react-dom | 19.2.3 | ✅ 최신 |
| @supabase/supabase-js | ^2.98.0 | ✅ 최신 |
| next-intl | ^4.8.3 | ✅ 최신 |
| tailwindcss | ^4 | ✅ 최신 |
| typescript | ^5 | ✅ 최신 |
| velite | ^0.3.1 | ✅ 현행 |
| pdfjs-dist | ^5.4.624 | ✅ 최신 |
| epubjs | ^0.3.93 | ⚠️ 오래됨 (v0.3) |
| lucide-react | ^0.575.0 | ✅ 최신 |
| shiki | ^3.23.0 | ✅ 최신 |
| flexsearch | ^0.8.212 | ✅ 현행 |

미사용 의심 패키지: 없음

---

## 9. 점수 개선 로드맵

### 현재 82점 → 목표 95점

| 조치 | 예상 점수 변동 | 난이도 | 우선순위 |
|------|:---:|:---:|:---:|
| 메타데이터 7개 페이지 추가 | +8 | 쉬움 | 1 |
| 에러 처리 패턴 통일 | +5 | 보통 | 2 |
| error.tsx i18n 적용 | +2 | 쉬움 | 3 |
| 관리자 RLS 서버 측 검증 | +4 | 보통 | 4 |
| 결제 SDK SRI 해시 추가 | +2 | 쉬움 | 5 |
| console.log 정리 | +2 | 쉬움 | 6 |
| .env.example 추가 | +1 | 쉬움 | 7 |

---

## 10. 결론

DreamIT Biz Books 프로젝트는 **현대적 기술 스택을 잘 활용**하고 있으며, **정적 내보내기와 GitHub Pages 배포가 올바르게 설정**되어 있습니다.

**강점**:
- Next.js 16 + React 19 최신 스택
- 완벽한 정적 내보내기 호환성 (API 라우트, 서버 액션, 미들웨어 없음)
- 잘 설계된 SPA 폴백 메커니즘
- localStorage 전면 제거 (보안 개선)
- 체계적인 프로젝트 구조

**금일 수정 완료**:
- 임시 파일 삭제 + .gitignore 정리
- not-found.tsx Link import 수정 (2곳)
- GitHub Actions 환경변수 → Variables 참조
- 소스 코드 하드코딩 폴백값 제거
- `npm ci --force` → `npm ci`
- 빌드 테스트 통과 (46 페이지 정상 생성)

**전체 위험도**: 🟡 보통 → 🟢 양호 (수정 반영 후)

---

*점검 수행: Claude Opus 4.6*
*최초 작성: 2026-03-06*
*수정 반영: 2026-03-07*
