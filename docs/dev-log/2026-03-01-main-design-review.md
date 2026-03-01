# 메인 페이지 디자인 검토 및 가독성 개선

**날짜**: 2026-03-01
**작업 유형**: UI/UX 개선

---

## 개요

메인 페이지 디자인 전반 검토 및 단어 잘림(word-break) 문제 해결.

---

## 변경 사항

### 1. 글로벌 가독성 개선 (`globals.css`)
- `word-break: keep-all` — 한글 단어가 음절 단위로 잘리지 않도록 설정
- `overflow-wrap: break-word` — 긴 URL 등은 안전하게 줄바꿈
- 전체 사이트에 일괄 적용

### 2. 히어로 섹션 개선 (`page.tsx`)
- 배경: 단순 그라데이션 → 패턴 오버레이 추가로 시각적 깊이 부여
- 반응형 패딩 강화 (`sm:py-24 lg:py-28`)
- "전자출판 안내" 버튼 추가 (2차 CTA)
- `SectionHeader` 공통 함수 추출로 코드 정리

### 3. 카테고리 그리드 수정 (`page.tsx`)
- `grid-cols-2 sm:grid-cols-3 lg:grid-cols-6` → `grid-cols-1 sm:grid-cols-3`
- 카테고리가 3개뿐이므로 적절한 크기로 표시

### 4. 카테고리 카드 레이아웃 개선 (`category-card.tsx`)
- 모바일: 아이콘 + 텍스트 가로 배치 (좁은 화면에서 가독성 향상)
- 데스크탑: 기존 세로 중앙 정렬 유지
- 설명 텍스트에 `leading-relaxed` 추가

---

## 변경 파일

| 파일 | 설명 |
|------|------|
| `src/app/globals.css` | `word-break: keep-all`, `overflow-wrap: break-word` 추가 |
| `src/app/[locale]/page.tsx` | 히어로 개선, 카테고리 그리드 수정, SectionHeader 추출 |
| `src/components/book/category-card.tsx` | 반응형 가로/세로 레이아웃 |

---

## 검증

- `npm run build` ✅ 성공
