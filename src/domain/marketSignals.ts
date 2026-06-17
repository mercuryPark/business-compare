import type { Brand } from './types';

export interface MarketSignal {
  label: string;
  title: string;
  summary: string;
  takeaway: string;
  sourceName: string;
  sourceUrl: string;
}

const marketSignals: Record<string, MarketSignal[]> = {
  mega: [
    {
      label: '빠른 점포 확장',
      title: '4000호점에 가까워진 저가커피 대형 브랜드',
      summary: '점포 수가 빠르게 늘어 브랜드 인지도는 강하지만, 같은 상권 안 경쟁 밀도도 같이 봐야 합니다.',
      takeaway: '후보 상권 반경 500m 안의 같은 가격대 커피 매장을 먼저 세어보세요.',
      sourceName: '메가MGC커피 보도자료',
      sourceUrl:
        'https://www.mega-mgccoffee.com/bbs/detail/?YmJzX2lkeD00NTcmYmJzX2NhdGVnb3J5PTcmYmJzX2RldGFpbF9jYXRlZ29yeT0mYmJzX3BhZ2U9MQ=%3D',
    },
  ],
  yoajung: [
    {
      label: '트렌드 확장',
      title: '국내 600호점과 해외 진출을 내세운 디저트 브랜드',
      summary: '빠르게 커지는 브랜드는 초기 수요가 강하지만, 유행 지속성과 재구매율을 따로 확인해야 합니다.',
      takeaway: '주말 피크 매출보다 평일 반복 구매가 유지되는지 물어보세요.',
      sourceName: '파이낸스투데이',
      sourceUrl: 'https://www.fntoday.co.kr/news/articleView.html?idxno=343085',
    },
  ],
  kyochon: [
    {
      label: '가맹점 매출 지표',
      title: '가맹점 평균 매출과 폐점률 지표가 기사화된 치킨 브랜드',
      summary: '높은 평균매출은 장점이지만, 치킨 업종은 원재료비와 배달 수수료가 순이익을 크게 흔듭니다.',
      takeaway: '매출보다 배달앱 비중, 전용 원부자재, 인건비 피크타임을 먼저 계산하세요.',
      sourceName: 'ZDNet Korea',
      sourceUrl: 'https://zdnet.co.kr/view/?no=20260518090745',
    },
  ],
  momstouch: [
    {
      label: '해외 확장',
      title: '해외 매장 확대와 가맹사업 확장 계획이 보도된 버거 브랜드',
      summary: '해외 확장은 브랜드 체력을 보여줄 수 있지만, 국내 점포의 임대료와 인건비 구조와는 분리해서 봐야 합니다.',
      takeaway: '해외 성장 기사보다 내 상권의 점심·저녁 회전율을 먼저 검증하세요.',
      sourceName: '매일경제',
      sourceUrl: 'https://www.mk.co.kr/news/business/11242054',
    },
  ],
};

export function getMarketSignals(brand: Brand): MarketSignal[] {
  return marketSignals[brand.id] ?? [];
}
