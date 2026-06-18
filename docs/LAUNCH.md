# 창업 나침반 — Launch Readiness

## Public launch scope (v1): 학습 + 비교(검증 전 예시)
- Default route → Home; 학습(8개 챕터) 공개.
- 프랜차이즈 비교 대시보드도 **공개**(`src/config.ts` `COMPARE_ENABLED = true`). 단, 브랜드별
  비용·매출이 아직 프로토타입(미검증) 데이터라 `CompareView` 최상단에 **"검증 전 예시 데이터"
  경고 배너**(role="alert")를 노출함.
- 재게이트가 필요하면 `src/config.ts`의 `COMPARE_ENABLED`를 `false`로 두면 `#compare`가
  "준비 중" 안내(`ComparePending`)로 바뀜.
- 참고: `.env.production`의 `VITE_COMPARE_ENABLED`는 더 이상 사용하지 않음(게이트는 config.ts에서
  직접 제어). 정리하려면 `.env.production`을 삭제해도 됨.

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

## Compare is public with prototype data — finish these to drop the warning banner
비교 화면이 이미 공개돼 실명 브랜드의 미검증 수치가 노출됩니다. "검증 전 예시" 경고 배너를
제거하고 신뢰할 수 있는 비교로 만들려면:
- [ ] 브랜드 P0 데이터 2차 검수·모델 QA 통과(정보공개서 원문 대조).
- [ ] 정정 요청 경로(`CorrectionCta`) 노출·동작 확인.
- [ ] 브랜드 대면 문구 법률 검토.
- [ ] 검증 완료 후 `CompareView`의 경고 배너 제거.
- 위 검증 전까지 공개를 멈추고 싶으면 `src/config.ts` `COMPARE_ENABLED = false`로 재게이트.
