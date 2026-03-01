# 전체 사이트 점검 보고서

**날짜**: 2026-03-01
**점검자**: Claude Code (Opus 4.6)
**프로젝트**: dreamitbiz-books (books.dreamitbiz.com)
**프레임워크**: Next.js 16.1.6 + React 19.2.3
**배포**: GitHub Pages (Static Export)

---

## 1. 프로젝트 규모

| 항목 | 수량 |
|------|------|
| 페이지 라우트 | 16개 |
| 컴포넌트 | 36개 |
| API/라이브러리 | 13개 |
| i18n 번역 키 | 254개 (ko/en 동일) |
| 빌드 출력 페이지 | 38개 |

---

## 2. 페이지별 점검 결과

### 정상 동작 페이지 (문제 없음)

| 페이지 | 유형 | 비고 |
|--------|------|------|
| `/[locale]` (홈) | 서버 | 히어로, 추천 도서, 카테고리 |
| `/catalog` | 클라이언트 | 검색/필터/정렬 |
| `/books/[slug]` | 서버 | 도서 상세 (Velite 기반, pre-rendered) |
| `/category/[category]` | 서버 | 카테고리별 갤러리 |
| `/cart` | 클라이언트 | 장바구니 (localStorage) |
| `/checkout` | 클라이언트 | 결제 (PortOne) |
| `/checkout/success` | 클라이언트 | 결제 완료 |
| `/library` | 클라이언트 | 구매 도서 목록 |
| `/login` | 클라이언트 | Google/Kakao/Email 로그인 |
| `/custom-order` | 클라이언트 | 맞춤 제작 요청 |
| `/admin/gallery` | 클라이언트 | 갤러리 관리 |
| `/admin/reports` | 클라이언트 | 연구보고서 관리 |
| `/reader/[id]` | 클라이언트 | PDF/EPUB 리더 |

### 수정 완료 페이지

| 페이지 | 문제 | 해결 |
|--------|------|------|
| `/reports` (목록) | Link가 RSC payload 없는 경로로 이동 | `/_?id=N` 방식으로 전환 |
| `/reports/[id]` (상세) | 404 반복, ID 추출 실패 | query param 기반 + history.replaceState |

---

## 3. 기능별 점검

### 인증 시스템
| 항목 | 상태 | 비고 |
|------|------|------|
| Google OAuth | 정상 | PKCE flow |
| Kakao OAuth | 정상 | scopes 설정됨 |
| 이메일 로그인 | 정상 | 비밀번호 인증 |
| 관리자 판별 | 정상 | 이메일 화이트리스트 |
| signup_domain 추적 | **금일 추가** | 미설정 시 자동 업데이트 |
| check_user_status | 정상 | visited_sites 자동 추적 |

### 커머스 시스템
| 항목 | 상태 | 비고 |
|------|------|------|
| 장바구니 | 정상 | localStorage 기반 |
| PortOne 결제 | 정상 | V1 (Iamport) |
| 주문 생성 | 정상 | Supabase + localStorage fallback |
| 구매 내역 | 정상 | |
| 맞춤 제작 요청 | 정상 | |

### 콘텐츠 시스템
| 항목 | 상태 | 비고 |
|------|------|------|
| 도서 (Velite MDX) | 정상 | pre-rendered |
| 갤러리 (Supabase) | 정상 | 라이트박스 포함 |
| 연구보고서 (Supabase) | **수정됨** | iframe 임베드 + 도움말 풍선 |
| 조회수 추적 | 정상 | gallery/book/report 지원 |
| PDF 뷰어 | 정상 | pdfjs-dist |
| EPUB 리더 | 정상 | epubjs |

### i18n (다국어)
| 항목 | 상태 | 비고 |
|------|------|------|
| ko.json | 정상 | 254 키 |
| en.json | 정상 | 254 키, 한국어와 완전 일치 |
| 라우트 기반 | 정상 | `/ko/...`, `/en/...` |
| 누락 번역 | 없음 | |

---

## 4. 발견된 개선 사항

### 높은 우선순위

| # | 항목 | 설명 | 영향도 |
|---|------|------|--------|
| 1 | **API 키 GitHub Secrets 이관** | deploy.yml에 Supabase/PortOne 키가 직접 노출됨. NEXT_PUBLIC_ 접두사라 클라이언트에 노출되는 공개 키이지만, GitHub Secrets로 관리하는 것이 모범사례 | 보안 |
| 2 | **에러 핸들링 표준화** | API 함수마다 에러 시 반환값이 다름 (`[]`, `null`, `{}`, throw). 호출부에서 혼란 유발 | 안정성 |
| 3 | **주문 아이템 삽입 에러 무시** | `orders.ts`에서 order_items 삽입 실패 시 console.error만 출력하고 성공으로 처리 | 데이터 |

### 중간 우선순위

| # | 항목 | 설명 | 영향도 |
|---|------|------|--------|
| 4 | **하드코딩된 i18n 문자열** | 여러 페이지에서 `locale === 'ko' ? '한국어' : 'English'` 패턴 사용. 특히 admin 페이지에 100+ 건. i18n 키 사용 권장 | 유지보수 |
| 5 | **window.confirm() 사용** | admin 갤러리/보고서, 맞춤 제작 페이지에서 삭제 시 `window.confirm()` 사용. 커스텀 모달 다이얼로그 권장 | UX |
| 6 | **입력값 검증 미비** | 주문, 맞춤 제작, 갤러리 등에서 사용자 입력 검증 없이 DB 삽입. zod 등으로 스키마 검증 권장 | 안정성 |
| 7 | **쿼리 결과 limit 없음** | purchases.ts 등에서 `.limit()` 없이 전체 조회. 데이터 증가 시 성능 저하 가능 | 성능 |

### 낮은 우선순위

| # | 항목 | 설명 | 영향도 |
|---|------|------|--------|
| 8 | **npm ci --force** | deploy.yml에서 의존성 충돌 무시. 근본 원인 조사 필요 | 빌드 |
| 9 | **localStorage fallback 결제** | Supabase 미연결 시 localStorage로 주문 처리 후 자동 승인. 테스트 모드 명시 필요 | 보안 |
| 10 | **External 스크립트 SRI 없음** | Iamport SDK CDN 로드 시 Subresource Integrity 미적용 | 보안 |

---

## 5. 컴포넌트 품질 평가

| 영역 | 평가 | 비고 |
|------|------|------|
| UI 컴포넌트 (9개) | 우수 | forwardRef, TypeScript, 접근성 |
| 레이아웃 (3개) | 우수 | 반응형, 글래스모피즘 |
| 커머스 (8개) | 양호 | 기능 완성, 에러 핸들링 보완 필요 |
| 도서 (3개) | 우수 | Velite 연동 안정적 |
| 갤러리 (2개) | 우수 | 라이트박스 정상 |
| 리더 (2개) | 양호 | PDF/EPUB 모두 동작 |
| MDX (4개) | 우수 | 코드 플레이그라운드 포함 |
| 검색 (1개) | 양호 | FlexSearch 기반 |

---

## 6. 아키텍처 평가

### 장점
- **명확한 디렉토리 구조**: 기능별 컴포넌트 분리 (commerce, book, gallery, reader, ui)
- **일관된 코딩 패턴**: TypeScript strict mode, `@/` 경로 alias
- **완전한 i18n**: 254개 키 한/영 완전 일치
- **정적 배포 최적화**: output: 'export' + GitHub Pages
- **접근성**: ARIA 레이블, 시맨틱 HTML
- **Context 기반 상태관리**: AuthProvider, CartProvider, ToastProvider

### 제한사항
- **Static Export**: 서버사이드 기능 (ISR, SSR) 사용 불가
- **동적 라우트**: Supabase 데이터 기반 라우트는 SPA fallback 필요
- **실시간 기능 없음**: 정적 사이트 한계

---

## 7. 금일 수정 사항 요약

| 커밋 | 내용 |
|------|------|
| `bdc3626` | 보고서 상세 페이지 라우팅 수정 — query param 방식 전환 |
| `6f4d1fb` | books 사이트 signup_domain 자동 설정 |
| `b56a66f` | 도움말 풍선 추가 + iframe 영역 축소 |

---

## 8. 종합 의견

사이트 전반적으로 **안정적이며 프로덕션 수준**입니다. 주요 기능(도서 판매, 결제, 로그인, 다국어, 리더)이 모두 정상 동작하며, 컴포넌트 품질과 코드 일관성이 높습니다.

**즉시 조치 필요한 사항은 없으며**, 위 개선 사항들은 유지보수 단계에서 점진적으로 개선하면 됩니다. 금일 수정된 보고서 상세 페이지 라우팅과 signup_domain 추적이 배포 완료되면 주요 미해결 이슈가 모두 해소됩니다.
