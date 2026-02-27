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
| 인증 | www.dreamitbiz.com API | 서브도메인 쿠키 공유 + Bearer 토큰 fallback |
| 결제 | PortOne(Iamport) SDK | 클라이언트 사이드 PG 연동 |
| 주문 관리 | www.dreamitbiz.com API | 주문 생성, 결제 검증 |
| 정적 사이트 | `'use client'` 컴포넌트 | Next.js static export 호환 |

## 구현 내역

### Phase A: 기반 (타입, API, 컨텍스트)

| 파일 | 역할 |
|------|------|
| `src/types/commerce.ts` | 상거래 타입 정의 (CartItem, User, Order, Payment, Purchase) |
| `src/config/site.ts` | API 엔드포인트 추가 (auth, orders, purchases) |
| `src/lib/api/client.ts` | HTTP 클라이언트 (credentials: include + Bearer fallback) |
| `src/lib/api/auth.ts` | 인증 API (login, logout, getMe) |
| `src/lib/api/orders.ts` | 주문 API (createOrder, verifyPayment) |
| `src/lib/api/purchases.ts` | 구매 내역 API (getPurchases, checkOwnership) |
| `src/lib/api/index.ts` | barrel export |
| `src/contexts/auth-context.tsx` | 인증 상태 관리 (useAuth 훅) |
| `src/contexts/cart-context.tsx` | 장바구니 상태 관리 (useCart 훅, localStorage 영속화) |
| `src/components/providers.tsx` | AuthProvider + CartProvider + ToastProvider 래퍼 |
| `src/app/[locale]/layout.tsx` | Providers로 감싸기 |

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
장바구니 페이지 → [결제 진행] → 로그인 필요 시 모달
                                ↓
체크아웃 → 주문자 정보 입력 → [결제하기]
                                ↓
          www.dreamitbiz.com API로 주문 생성
                                ↓
          PG 결제 팝업 (카드 결제)
                                ↓
          결제 검증 → 성공 페이지
                                ↓
          내 서재에서 구매 도서 확인/읽기
```

## 빌드 이슈 및 해결

1. **`useSearchParams()` Suspense 필요**
   - 문제: checkout/success 페이지에서 `useSearchParams()` 사용 시 빌드 실패
   - 원인: Next.js 16에서 CSR bailout 방지를 위해 Suspense 경계 필수
   - 해결: 컴포넌트를 분리하고 `<Suspense>` 래핑

## 파일 구조

```
src/
├── types/
│   └── commerce.ts          ← NEW
├── config/
│   └── site.ts              ← MODIFIED (api endpoints 추가)
├── lib/
│   ├── api/
│   │   ├── client.ts        ← NEW
│   │   ├── auth.ts          ← NEW
│   │   ├── orders.ts        ← NEW
│   │   ├── purchases.ts     ← NEW
│   │   └── index.ts         ← NEW
│   └── payment/
│       └── pg-bridge.ts     ← NEW
├── contexts/
│   ├── auth-context.tsx     ← NEW
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

## 향후 작업

- [ ] www.dreamitbiz.com 백엔드 API 구현 (auth, orders, purchases)
- [ ] PortOne 실서비스 가맹점 ID 설정 (현재 테스트 MID)
- [ ] CORS 설정 (books.dreamitbiz.com → www.dreamitbiz.com API)
- [ ] 결제 수단 추가 (계좌이체, 가상계좌 등)
- [ ] 주문 내역 상세 페이지
- [ ] 환불 기능
- [ ] E2E 테스트
