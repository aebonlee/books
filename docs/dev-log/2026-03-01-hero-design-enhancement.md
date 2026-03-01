# 메인 히어로 디자인 강화

**날짜**: 2026-03-01
**작업 유형**: UI/UX 개선

---

## 개요

메인 히어로 영역의 2번째 버튼 폰트 컬러 버그 수정 및 전반적 디자인 강화.

---

## 수정 사항

### 1. 히어로 2번째 버튼 폰트 컬러 수정

**원인**: `variant="outline"`의 베이스 스타일(`bg-white text-gray-700`)이 className의 `text-white`와 충돌. `twMerge`가 텍스트 색상은 병합하지만, `bg-white`가 그대로 남아 파란 배경 위에 흰색 배경 버튼으로 렌더링됨.

**수정**: variant 미사용, 직접 스타일 적용
```tsx
// Before (버그)
<Button variant="outline" className="border-white/30 text-white hover:bg-white/10">

// After (수정)
<Button className="border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
```

### 2. 히어로 디자인 강화

- 장식 요소: blur 그라데이션 원 3개 추가 (시각적 깊이)
- 태그 라인: "전자출판 · 교재 · 연구보고서" 배지 추가
- 제목 줄바꿈: `<br>` 태그로 데스크탑에서 자연스러운 줄바꿈
- 스탯 바: 전자출판/맞춤 제작/온라인 뷰어 3항목 표시

### 3. 섹션 헤더 개선

- `SectionHeader`에 `description` prop 추가
- 각 섹션에 부제목 텍스트 추가

### 4. 하단 CTA 섹션 추가

- 푸터 직전에 "원하는 콘텐츠를 찾지 못하셨나요?" CTA 배너
- 맞춤 제작 의뢰 + 전자출판 안내 버튼

---

## 변경 파일

| 파일 | 설명 |
|------|------|
| `src/app/[locale]/page.tsx` | 히어로 버튼 수정, 디자인 강화, 하단 CTA 추가 |

---

## 검증

- `npm run build` ✅ 성공
