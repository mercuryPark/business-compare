# 창업 나침반 — Launch Readiness

## Public launch scope (v1): learn-only
- Default route → Home; 학습(8개 챕터) 공개.
- 프랜차이즈 비교 대시보드는 **프로덕션 빌드에서 "준비 중"**으로 게이트됨
  (`.env.production` → `VITE_COMPARE_ENABLED=false`). 프로토타입 브랜드 데이터를 공개하지 않음.
  (개발/테스트/E2E는 플래그 기본 ON이라 대시보드가 그대로 동작·검증됨.)

## Before sharing publicly (do these)
- [ ] `npm test` 그린, `npm run build` 성공.
- [ ] `npm run generate:og` 후 `public/og-changup-nachimbang.png`(1200×630) 존재 확인.
- [ ] **배포 경로/도메인 확정 후 OG·favicon 경로 점검** — `index.html`의 `og:image`/`favicon`은
      루트 절대경로(`/...`)다. 도메인 루트(`example.com/`) 배포면 그대로 OK. **서브패스
      배포(예: GitHub Pages `사용자.github.io/business-compare/`)라면** ① Vite `base`를
      `/business-compare/`로 설정하고 ② `og:image`/`twitter:image`를 **완전한 `https://` 절대
      URL**로 바꿔야 한다(카카오·네이버 등 크롤러는 경로형 og:image를 못 가져오는 경우가 많음).
- [ ] 배포본을 카카오톡/네이버 카페에 링크해 OG 미리보기(제목·설명·이미지) 정상 노출 확인.
- [ ] 모바일에서 홈→챕터 읽기 흐름·목차 드로어 동작 확인.

## Sensitive learn content (참고용으로 공개)
- 세무·노무·계약·임대차·인허가 항목은 `reviewStatus: 'draft'`이며 챕터별 "전문가 검토 전" 경고가 노출됨.
- 공개는 가능하나, 이를 "검증된 정보"로 격상하려면 세무사·노무사·가맹거래사 검토 후 해당
  `LearnSource.reviewStatus`를 `expert-reviewed`로 올리고 `npm run check:learn-sources` 통과.

## Before un-gating compare (future milestone)
- [ ] 브랜드 P0 데이터 2차 검수·모델 QA 통과(정보공개서 원문 대조).
- [ ] 정정 요청 경로(`CorrectionCta`) 노출·동작 확인.
- [ ] 브랜드 대면 문구 법률 검토.
- [ ] `.env.production`에서 `VITE_COMPARE_ENABLED=false` 제거(또는 `true`)로 비교 공개.
