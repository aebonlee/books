# 자체 구매/결제 시스템 구현

**날짜**: 2026-02-27
**작업자**: Claude Code (Opus 4.6)
**빌드 결과**: 성공 (52 pages, Next.js 16.1.6)

---

## 개요

books.dreamitbiz.com에서 구매/결제를 사이트 내에서 직접 처리하도록 변경.
기존 "구매하기" 버튼이 www.dreamitbiz.com으로 리다이렉트하던 방식에서,
사용자가 사이트를 떠나지 않고 장바구니 → 결제 → 완료까지 처리되도록 구현.

## 아키텍처

| 영역 | 기술 | 설명 |
|------|------|------|
| 장바구니 | React Context + localStorage | 클라이언트 사이드 상태 관리 |
| 인증 | **Supabase Auth** (Google/Kakao/Email) | www.dreamitbiz.com과 동일 Supabase 프로젝트 공유 |
| 결제 | PortOne V1 (Iamport) SDK | 클라이언트 사이드 PG 연동 (`imp61949262`) |
| 주문 관리 | **Supabase DB + Edge Functions** | orders/order_items 테이블, verify-payment 함수 |
| 정적 사이트 | `'use client'` 컴포넌트 | Next.js static export 호환 |

## 구현 내역

### Phase A: 기반 (타입, API, 컨텍스트)

| 파일 | 역할 |
|------|------|
| `src/types/commerce.ts` | 상거래 타입 정의 (CartItem, Order, Payment, Purchase) |
| `src/config/site.ts` | 사이트 설정 (API 섹션 제거 → Supabase/env로 이관) |
| `src/lib/supabase.ts` | **Supabase 클라이언트** (PKCE flow, 세션 자동 갱신) |
| `src/lib/auth.ts` | **인증 헬퍼** (Google/Kakao/Email 로그인, 로그아웃, 프로필 조회) |
| `src/lib/api/orders.ts` | 주문 API (**Supabase DB 직접 접근**) |
| `src/lib/api/purchases.ts` | 구매 내역 API (**Supabase DB 직접 접근**) |
| `src/lib/api/index.ts` | barrel export |
| `src/contexts/auth-context.tsx` | 인증 상태 관리 (**Supabase onAuthStateChange**) |
| `src/contexts/cart-context.tsx` | 장바구니 상태 관리 (useCart 훅, localStorage 영속화) |
| `src/components/providers.tsx` | AuthProvider + CartProvider + ToastProvider 래퍼 |
| `src/app/[locale]/layout.tsx` | Providers로 감싸기 |

> **삭제된 파일**: `src/lib/api/client.ts` (커스텀 HTTP 클라이언트), `src/lib/api/auth.ts` (커스텀 인증 API) → Supabase로 대체

### Phase B: UI 컴포넌트

| 파일 | 역할 |
|------|------|
| `src/components/ui/dialog.tsx` | 모달 다이얼로그 (ESC 닫기, 오버레이 클릭 닫기) |
| `src/components/ui/toast.tsx` | 토스트 알림 (success/error/info, 3초 자동 닫기) |
| `src/components/ui/label.tsx` | 폼 라벨 |
| `src/components/ui/separator.tsx` | 구분선 (horizontal/vertical) |

### Phase C: 상거래 컴포넌트

| 파일 | 역할 |
|------|------|
| `src/components/commerce/add-to-cart-button.tsx` | "장바구니 담기" + "바로 구매" 버튼 |
| `src/components/commerce/cart-icon.tsx` | 헤더 장바구니 아이콘 (뱃지) |
| `src/components/commerce/cart-item-row.tsx` | 장바구니 항목 행 |
| `src/components/commerce/order-summary.tsx` | 주문 요약 (소계, 합계) |
| `src/components/commerce/login-modal.tsx` | 사이트 내 로그인 모달 |
| `src/components/commerce/user-menu.tsx` | 사용자 메뉴 (드롭다운, 내 서재/로그아웃) |
| `src/components/commerce/payment-form.tsx` | 결제 폼 (주문자 정보 + PG 연동) |
| `src/components/commerce/payment-success.tsx` | 결제 완료 화면 |

### Phase D: 페이지

| 파일 | 역할 |
|------|------|
| `src/app/[locale]/cart/page.tsx` | 장바구니 페이지 (상품 목록 + 주문 요약) |
| `src/app/[locale]/checkout/page.tsx` | 결제 페이지 (주문자 정보 + 결제 수단 + 결제하기) |
| `src/app/[locale]/checkout/success/page.tsx` | 결제 완료 페이지 (Suspense 래핑) |

### Phase E: 기존 파일 수정

| 파일 | 변경 내용 |
|------|-----------|
| `src/app/[locale]/books/[slug]/book-cta.tsx` | 도서 상세 CTA 클라이언트 컴포넌트 (신규) |
| `src/app/[locale]/books/[slug]/page.tsx` | 외부 링크 → BookCTA(AddToCartButton) 교체 |
| `src/components/layout/header.tsx` | CartIcon + UserMenu 추가 (외부 로그인 링크 제거) |
| `src/components/layout/mobile-nav.tsx` | 장바구니/내 서재 링크 추가 |
| `src/app/[locale]/library/page.tsx` | 실제 인증(useAuth) + 구매 내역(getPurchases) 연동 |

### Phase F: 다국어 + PG

| 파일 | 변경 내용 |
|------|-----------|
| `src/i18n/messages/ko.json` | cart, checkout, payment, auth 섹션 추가 |
| `src/i18n/messages/en.json` | 동일 영어 번역 |
| `src/lib/payment/pg-bridge.ts` | PortOne(Iamport) SDK 추상화 레이어 |

## 사용자 흐름

```
도서 상세 → [장바구니 담기] → 헤더 뱃지 업데이트, 토스트 알림
         → [바로 구매] → 체크아웃 페이지 직행
                           ↓
장바구니 페이지 → [결제 진행] → 로그인 필요 시 모달 (Google/Kakao/Email)
                                ↓
체크아웃 → 주문자 정보 자동 채움 (Supabase 프로필) → [결제하기]
                                ↓
          Supabase DB에 주문 생성 (orders + order_items)
                                ↓
          PortOne V1 결제 팝업 (카드 결제)
                                ↓
          Supabase Edge Function으로 결제 검증 → 성공 페이지
                                ↓
          내 서재에서 구매 도서 확인/읽기
```

## 이슈 및 해결

### 1. `useSearchParams()` Suspense 필요
- **문제**: checkout/success 페이지에서 `useSearchParams()` 사용 시 빌드 실패
- **원인**: Next.js 16에서 CSR bailout 방지를 위해 Suspense 경계 필수
- **해결**: 컴포넌트를 분리하고 `<Suspense>` 래핑

### 2. 로그인 흐름 버그 5건 (2d609e7)
| # | 문제 | 수정 |
|---|------|------|
| 1 | LoginModal 재오픈 시 이전 입력/에러 잔류 | `useEffect(open)` → email/password/error 초기화 |
| 2 | PaymentForm 자동채움 — `\|\|` 연산자로 입력 수정 불가 | `useEffect`로 초기값만 세팅, 이후 자유 수정 |
| 3 | 체크아웃에서 로그인 후 수동 재결제 필요 | `pendingSubmit` ref → 로그인 성공 시 `requestSubmit()` 자동 호출 |
| 4 | 로그아웃 시 토스트 알림 없음 | `logout()` 후 `toast('로그아웃되었습니다', 'info')` 추가 |
| 5 | 토큰 없는데 매번 `/auth/me` API 호출 | `localStorage.getItem('auth_token')` 확인 후 없으면 호출 생략 |

### 3. 로그인/로그아웃 모달·드롭다운 위치 오류 (74ddeae)
- **문제**: Dialog(로그인 모달)와 UserMenu(로그아웃 드롭다운)가 `<header sticky z-50>` 안에서 렌더링되어 헤더의 스태킹 컨텍스트에 갇힘 → 화면 상단에 붙어 표시
- **원인**: CSS stacking context — 부모(`header`)가 `position: sticky; z-index: 50`으로 스태킹 컨텍스트를 생성하면, 자식의 `position: fixed; z-index`가 부모 레이어 안에 한정됨
- **해결**:
  - `Dialog`: `createPortal(…, document.body)` + `z-[9999]` — body 직접 렌더링으로 헤더 탈출
  - `UserMenu` 드롭다운: `createPortal` + `getBoundingClientRect()` — 버튼 위치 기반 fixed 포지셔닝, `z-[9998]`

### 4. Supabase 인증 시스템으로 전환 (커스텀 API → Supabase)
- **배경**: 기존 커스텀 HTTP API 인증 방식에서 www.dreamitbiz.com과 동일한 Supabase 인증으로 전환 요구
- **참조**: `D:\www\react-source`의 기존 구현 (supabase.js, auth.js, AuthContext.jsx, Login.jsx)
- **변경 내용**:
  - `@supabase/supabase-js` 패키지 추가
  - `src/lib/supabase.ts` 신규 — Supabase 클라이언트 (PKCE flow, 세션 자동 갱신)
  - `src/lib/auth.ts` 신규 — Google/Kakao OAuth + Email/Password 인증 헬퍼
  - `src/contexts/auth-context.tsx` 재작성 — `onAuthStateChange` 기반, `user_profiles` 테이블 조회, 관리자 이메일 확인
  - `src/components/commerce/login-modal.tsx` 재작성 — 2단계 로그인 UI (방법 선택 → 이메일 폼)
  - `src/components/commerce/user-menu.tsx` 재작성 — Supabase 프로필 기반 표시
  - `src/lib/api/orders.ts` 재작성 — Supabase DB 직접 접근 (orders + order_items 테이블)
  - `src/lib/api/purchases.ts` 재작성 — Supabase DB에서 구매 내역 조회
  - `src/lib/payment/pg-bridge.ts` 수정 — 환경변수(`NEXT_PUBLIC_IMP_CODE`, `NEXT_PUBLIC_PG_PROVIDER`) 사용
  - `src/config/site.ts` 정리 — api, payment 섹션 제거
  - `src/types/commerce.ts` 정리 — Supabase 타입으로 대체된 타입 삭제
  - `.github/workflows/deploy.yml` — GitHub Secrets에서 환경변수 주입
  - **삭제**: `src/lib/api/client.ts`, `src/lib/api/auth.ts`
- **환경변수** (`.env.local` + GitHub Secrets):
  - `NEXT_PUBLIC_SUPABASE_URL` — Supabase 프로젝트 URL
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase 공개 키
  - `NEXT_PUBLIC_IMP_CODE` — PortOne V1 가맹점 코드
  - `NEXT_PUBLIC_PG_PROVIDER` — PG 제공자 식별자

## 파일 구조

```
src/
├── types/
│   └── commerce.ts          ← NEW (Supabase 전환으로 간소화)
├── config/
│   └── site.ts              ← MODIFIED (api/payment 섹션 제거)
├── lib/
│   ├── supabase.ts          ← NEW (Supabase 클라이언트)
│   ├── auth.ts              ← NEW (Google/Kakao/Email 인증 헬퍼)
│   ├── api/
│   │   ├── orders.ts        ← NEW (Supabase DB 주문)
│   │   ├── purchases.ts     ← NEW (Supabase DB 구매 내역)
│   │   └── index.ts         ← NEW (barrel export)
│   └── payment/
│       └── pg-bridge.ts     ← NEW (PortOne V1)
├── contexts/
│   ├── auth-context.tsx     ← NEW (Supabase onAuthStateChange)
│   └── cart-context.tsx     ← NEW
├── components/
│   ├── providers.tsx        ← NEW
│   ├── ui/
│   │   ├── dialog.tsx       ← NEW
│   │   ├── toast.tsx        ← NEW
│   │   ├── label.tsx        ← NEW
│   │   └── separator.tsx    ← NEW
│   ├── commerce/
│   │   ├── add-to-cart-button.tsx  ← NEW
│   │   ├── cart-icon.tsx           ← NEW
│   │   ├── cart-item-row.tsx       ← NEW
│   │   ├── order-summary.tsx       ← NEW
│   │   ├── login-modal.tsx         ← NEW
│   │   ├── user-menu.tsx           ← NEW
│   │   ├── payment-form.tsx        ← NEW
│   │   └── payment-success.tsx     ← NEW
│   └── layout/
│       ├── header.tsx       ← MODIFIED (CartIcon + UserMenu)
│       └── mobile-nav.tsx   ← MODIFIED (장바구니/서재 링크)
├── app/[locale]/
│   ├── layout.tsx           ← MODIFIED (Providers 추가)
│   ├── cart/
│   │   └── page.tsx         ← NEW
│   ├── checkout/
│   │   ├── page.tsx         ← NEW
│   │   └── success/
│   │       └── page.tsx     ← NEW
│   ├── books/[slug]/
│   │   ├── page.tsx         ← MODIFIED (BookCTA 교체)
│   │   └── book-cta.tsx     ← NEW
│   └── library/
│       └── page.tsx         ← MODIFIED (실제 인증 연동)
└── i18n/messages/
    ├── ko.json              ← MODIFIED (cart/checkout/payment/auth 추가)
    └── en.json              ← MODIFIED (동일 영어 번역)
```

### 5. 코드 품질 개선 (2de1a18)

| # | 항목 | 변경 |
|---|------|------|
| 1 | OAuth redirect URL 불안정 | `origin + pathname` → `origin`만 사용 (OAuth 콜백 경로 일관성 확보) |
| 2 | 에러 silent catch | `purchases.ts`, `orders.ts`, `library/page.tsx`에 `console.error` 로깅 추가 |
| 3 | 관리자 이메일 하드코딩 | `ADMIN_EMAILS` → `NEXT_PUBLIC_ADMIN_EMAILS` 환경변수로 외부화 (기본값 유지) |

### 6. 전체 통합 검증 체크리스트

| 항목 | 상태 |
|------|------|
| 로컬 빌드 (52 pages) | ✅ 성공 |
| GitHub Actions 배포 (5회 연속) | ✅ 성공 |
| `.env.local` 환경변수 4개 | ✅ www와 동일 값 확인 |
| GitHub Secrets 4개 | ✅ 배포 성공으로 확인 |
| Supabase DB 테이블 (`orders`, `order_items`, `user_profiles`) | ✅ www에 이미 존재, 컬럼명 일치 |
| Edge Functions (`verify-payment`, `portone-webhook`) | ✅ www에 이미 배포됨 |
| RLS 정책 (22개+) | ✅ 설정 완료 |
| OAuth redirect URL 등록 (Google/Kakao) | ✅ 수동 처리 완료 |

## 배포 환경변수 (GitHub Secrets 필요)

| Secret 이름 | 용도 |
|-------------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 프로젝트 URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 공개 Anon 키 |
| `NEXT_PUBLIC_IMP_CODE` | PortOne V1 가맹점 코드 |
| `NEXT_PUBLIC_PG_PROVIDER` | PG 제공자 (html5_inicis.MOIkorcom1) |

## 향후 작업

- [x] ~~GitHub Repository Secrets 설정 (위 4개 환경변수)~~ ✅
- [x] ~~Supabase에 `orders`, `order_items` 테이블 생성~~ ✅ (www에 이미 존재)
- [x] ~~Supabase Edge Function `verify-payment` 배포~~ ✅ (www에 이미 배포)
- [x] ~~OAuth redirect URL에 books.dreamitbiz.com 등록 (Google/Kakao)~~ ✅ 수동 처리 완료
- [ ] PortOne 실서비스 가맹점 ID 설정 (현재 테스트 MID)
- [ ] 결제 수단 추가 (계좌이체, 가상계좌 등)
- [ ] 주문 내역 상세 페이지
- [ ] 환불 기능
- [ ] E2E 테스트
