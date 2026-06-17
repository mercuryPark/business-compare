# P0 Source ID Map

Captured at: 2026-06-16

Primary structured cross-check source:

- List endpoint: `POST https://fair.gg.go.kr/stat/selectFrchsList.ajax`
- Detail endpoint: `POST https://fair.gg.go.kr/fran/selectBrandInfo.ajax`
- Detail params: `frnchsNo`, `brandYear=2024`

These IDs are source-locator metadata only. A brand should remain `verificationStatus: partial` until the original FTC disclosure is reviewed and second-checked.

For the official public-data fee APIs, use `brandMnno = BRD_{frnchsNo}` as the first candidate and confirm the returned brand before recording values.

The captured Gyeonggi numeric snapshot is stored in `src/domain/p0SourceSnapshots.ts`. Run `npm run check:p0:sources` after editing brand values or source IDs; the command catches mismatches between the app values, source URL metadata, and the captured snapshot. This is a typo/drift guard only, not P0 final verification.

| App ID | App brand | Gyeonggi `frnchsNo` | Registered brand name | Note |
| --- | --- | --- | --- | --- |
| `hansot` | 한솥도시락 | `20080100308` | 한솥 | Existing app label keeps 도시락 descriptor |
| `isaac` | 이삭토스트 | `20080500031` | 이삭토스트 | Direct match |
| `mega` | 메가커피 | `20160628` | 메가엠지씨커피(MEGA MGC COFFEE) | Existing app label keeps short consumer name |
| `momstouch` | 맘스터치 | `20080100157` | 맘스터치 | Direct match |
| `yoajung` | 요아정 | `20220572` | 카페요아정 | Selected over `20210826` because it matches franchise-start 2022 and 2024 store scale |
| `bondosirak` | 본도시락 | `20100100482` | 본도시락 | Direct match |
| `baskin` | 베스킨라빈스 | `20080500015` | 배스킨라빈스 | Source spelling differs from app spelling |
| `compose` | 컴포즈커피 | `20141250` | 컴포즈커피(COMPOSE COFFEE) | Direct match |
| `kyochon` | 교촌치킨 | `20080600002` | 교촌치킨 | Direct match |
| `ediya` | 이디야커피 | `20080100014` | 이디야커피 | Direct match |

## Yoajung Candidates

| `frnchsNo` | Registered brand | 2024 stores | 2024 average annual sales, thousand KRW | Decision |
| --- | --- | ---: | ---: | --- |
| `20210826` | 요거트아이스크림의 정석 | 187 | 426,842 | Not used for current app record |
| `20220572` | 카페요아정 | 372 | 623,918 | Used for current app record |
