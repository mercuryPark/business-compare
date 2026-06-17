import { createP0FeeApiEvidence, formatP0FeeApiEvidenceReport } from '../domain/p0FeeApiEvidence';

const sampleEvidence = createP0FeeApiEvidence({
  brandId: 'hansot',
  registeredBrandName: '한솥',
  brandMnno: 'BRD_20080100308',
  franchiseFeeResponse: {
    response: {
      body: {
        items: [
          {
            brandMnno: 'BRD_20080100308',
            brandNm: '한솥',
            jngAmtSeNm: '차액가맹금',
            jngAmtScopeVal: 'FTC_FEE_API_VALUE_REQUIRED',
            jngAmtGiveDdlnDateCn: 'FTC_FEE_API_DEADLINE_REQUIRED',
          },
        ],
      },
    },
  },
  otherCostResponse: {
    response: {
      body: {
        items: [
          {
            brandMnno: 'BRD_20080100308',
            brandNm: '한솥',
            othctSeNm: '광고비/기타비용',
            ctGiveTrgtNm: 'FTC_OTHER_COST_TARGET_REQUIRED',
            giveAmtCn: 'FTC_OTHER_COST_VALUE_REQUIRED',
          },
        ],
      },
    },
  },
});

console.log(formatP0FeeApiEvidenceReport([sampleEvidence]));

process.exitCode = 1;
