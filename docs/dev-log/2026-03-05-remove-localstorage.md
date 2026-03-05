# localStorage 전면 제거

**날짜**: 2026-03-05

## 배경

모든 데이터에서 `localStorage` 사용을 금지하는 정책 적용. 기존 3개 파일에서 `localStorage`를 사용 중이었음.

## 기존 사용 현황

| 파일 | 용도 | 키 |
|------|------|----|
| `src/contexts/cart-context.tsx` | 장바구니 아이템 영속 저장 | `dreamitbiz_cart` |
| `src/lib/api/orders.ts` | Supabase 미연결 시 주문 fallback 저장 | `dreamitbiz_orders` |
| `src/lib/api/purchases.ts` | Supabase 미연결 시 구매 내역 fallback 조회 | `dreamitbiz_orders` |

## 수정 내역

### 1. 장바구니 — `sessionStorage`로 교체
**`src/contexts/cart-context.tsx`**
- `localStorage.getItem` → `sessionStorage.getItem`
- `localStorage.setItem` → `sessionStorage.setItem`
- 동작 차이: 탭 내에서는 유지, 탭/브라우저 종료 시 초기화

### 2. 주문/구매 fallback — 인메모리 배열로 교체
**`src/lib/api/fallback-store.ts`** (신규 생성)
```typescript
export interface FallbackOrder { ... }
export const fallbackOrders: FallbackOrder[] = [];
```

**`src/lib/api/orders.ts`**
- `JSON.parse(localStorage.getItem(...))` → `fallbackOrders` 배열 직접 참조
- `localStorage.setItem(...)` → `fallbackOrders.push(order)`

**`src/lib/api/purchases.ts`**
- 동일하게 `fallbackOrders` 배열에서 필터/매핑

### 3. 최종 검증
- `grep localStorage src/` → 결과 0건 (주석 포함 완전 제거)
- `npm run build` → 44/44 정적 페이지 빌드 성공

## 수정 파일 목록 (4개)

| 작업 | 파일 |
|------|------|
| 수정 | `src/contexts/cart-context.tsx` |
| 수정 | `src/lib/api/orders.ts` |
| 수정 | `src/lib/api/purchases.ts` |
| 생성 | `src/lib/api/fallback-store.ts` |
