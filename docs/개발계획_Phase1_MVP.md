# MyPoopAI Phase 1 MVP 개발 계획

> **작성일**: 2026-04-22
> **목표**: PWA 웹앱 MVP (성인 모드) 빠른 검증
> **MVP 완성 정의**: 사용자가 PWA 설치 → 온보딩 → 로그인(게스트/이메일/Google) → 촬영 → AI 분석 → 히스토리 확인 → 설정 관리까지 가능한 상태

---

## 현재 상태 (2026-04-22 기준)

| 영역 | 상태 | 비고 |
|------|------|------|
| 프론트엔드 | 95% | 6개 페이지 구현 완료 |
| 인증 | 90% | Guest/Email/Google/Apple 코드 존재, 실제 연동 필요 |
| 상태관리 | 95% | Local + Firestore 이중 저장 |
| Firestore | 90% | 컬렉션 설계 완료, 기본 규칙 적용 |
| Cloud Storage | 90% | 이미지 업로드/다운로드 구현 |
| AI 분석 | 5% | Mock 상태 — 실제 Vision API 연동 필요 |
| 배포 | 0% | Firebase Hosting 설정만 완료 |

---

## Sprint 0: 기반 정리 (2시간)

### 0.1 Git 커밋 — 현재 작업물 베이스라인
- 미커밋 파일 18개 (수정 7 + 신규 11) 전부 커밋
- `.env` 파일 `.gitignore`에 추가 (보안)

### 0.2 Firebase 프로젝트 확인
- Firebase Console에서 Auth 제공자 활성화 확인
- Firestore 데이터베이스 생성 확인
- Storage 버킷 확인

### 0.3 빌드 확인
- `npm run build` 정상 동작 확인
- `npm run dev` 로컬 실행 확인

---

## Sprint 1: 네비게이션 구조 변경 (4시간)

### 1.1 탭 구조 4개 → 3개
- **현재**: 홈 / 카메라 / 히스토리 / 설정
- **목표**: 카메라(기본) / 히스토리 / 설정
- 파일: `BottomNav.jsx`, `App.jsx`

### 1.2 홈 페이지 콘텐츠 → 히스토리로 이동
- 주간 건강 요약 카드를 히스토리 페이지 상단으로 이동
- 파일: `HistoryPage.jsx`, `Home.jsx`

### 1.3 카메라 페이지 듀얼 스테이트
- 대기 상태: 촬영 버튼 + BottomNav 표시
- 촬영 상태: 전체화면, BottomNav 숨김

---

## Sprint 2: Claude Vision AI 실제 연동 (6시간) ⭐ 핵심

### 2.1 Firebase Cloud Function 생성
- `functions/index.js` — 이미지 받아서 Claude Vision API 호출
- Anthropic API 키는 Firebase Functions config에 저장
- **필수**: Firebase Blaze 플랜 (외부 API 호출에 필요)

### 2.2 Claude Vision 프롬프트 설계
- Bristol Stool Scale 타입 (1-7) 분석
- 색상 분류 + 건강 점수 (0-5, 0.5단위)
- 한국어 추천사항 생성
- 구조화된 JSON 반환

### 2.3 프론트엔드 연동
- `analysisService.js` 수정 — Cloud Function 호출
- Mock 분석은 개발용 폴백으로 유지
- `VITE_USE_REAL_AI=true` 환경변수로 토글

---

## Sprint 3: PWA 완성 (3시간)

### 3.1 앱 아이콘 생성
- `icon-192.png`, `icon-512.png` 플레이스홀더 생성
- 라벤더 배경 + 심플 아이콘

### 3.2 서비스 워커
- `vite-plugin-pwa` 추가
- 오프라인 앱 셸 캐싱 (AI 분석은 온라인 필수)

### 3.3 iOS 지원
- Apple Touch Icon + 스플래시 메타태그

---

## Sprint 4: 인증 완성 (3시간)

### 4.1 Firebase Auth 제공자 연동
- 이메일/비밀번호 ✅ (코드 존재)
- Google OAuth ✅ (코드 존재, Console 설정 필요)
- Apple OAuth (코드 존재, Apple Developer 설정 필요)
- Kakao OAuth (커스텀 구현 필요 — Firebase 네이티브 미지원)

### 4.2 게스트 → 정식 계정 업그레이드 플로우 검증

---

## Sprint 5: 히스토리 페이지 강화 (4시간)

### 5.1 꺾은선 그래프
- `recharts` 라이브러리 추가
- 7일/30일 전환, X축 날짜, Y축 별점

### 5.2 캘린더 뷰
- 날짜별 색상 도트 (녹/노/빨)
- 날짜 탭 → 해당 기록 상세

### 5.3 뷰 전환
- 리스트 / 차트 / 캘린더 세그먼트 컨트롤

---

## Sprint 6: 배포 (3시간)

### 6.1 Firebase Hosting 배포
- `npm run build` → `firebase deploy --only hosting`

### 6.2 Cloud Functions 배포
- `firebase deploy --only functions`

### 6.3 도메인 연결
- mypoopai.com DNS 설정

### 6.4 보안 규칙 배포
- `firebase deploy --only firestore:rules,storage`

---

## Sprint 7: 개인정보 + 마무리 (3시간)

### 7.1 개인정보 처리방침 페이지
### 7.2 계정 삭제 기능
### 7.3 카메라 사용 동의 플로우

---

## Phase 2 이후 (MVP 이후)

| Phase | 내용 |
|-------|------|
| Phase 2 | 베이비 모드 + 캐릭터 스티커 |
| Phase 3 | 광고 + PDF 유료 다운로드 |
| Phase 4 | React Native 네이티브 앱 |
| Phase 5 | B2B 비식별 데이터 판매 |

### MVP 이후 백로그
- 베이비 모드 UI/UX
- 커스텀 캐릭터 스티커 (일러스트레이터 작업)
- 카카오 로그인 (커스텀 OAuth)
- AI 추가 질문 (이상 감지 시)
- PDF 다운로드 (5,000원 유료)
- 언어 전환 (한국어/English)
- 건강 정보 등록/수정
- AI 7일 총평
- 변기/기저귀 자동 인식
- 배너 광고 + 기부형 광고
- baby.mypoopai.com 서브도메인

---

## 의존성 그래프

```
Sprint 0 (기반 정리)
    ├── Sprint 1 (네비게이션) → Sprint 5 (히스토리)
    ├── Sprint 2 (AI 연동) → Sprint 6 (배포)
    ├── Sprint 3 (PWA)
    ├── Sprint 4 (인증)
    └── Sprint 7 (마무리)
```

Sprint 1~4는 병렬 작업 가능. Sprint 6은 Sprint 2 완료 후 진행.

---

## 리스크 & 대응

| 리스크 | 대응 |
|--------|------|
| Firebase Blaze 플랜 필요 | Cloud Function 외부 API 호출에 필수. 무료 대안: Cloudflare Workers |
| Claude Vision API 비용 | 이미지당 ~$0.01-0.03. 일일 분석 횟수 제한 검토 |
| iOS PWA 카메라 제한 | `<input type="file" capture>` 폴백 준비 |
| .env 파일 보안 | .gitignore 추가 필수 (Sprint 0) |
