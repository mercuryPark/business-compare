import type { TradeAreaFixture, TradeAreaStore } from './locationAnalysis';

const categoryDensityRatios = {
  gangnam: {
    coffee: { 300: 1, 500: 1.27, 1000: 1.29 },
    lunchbox: { 300: 1.33, 500: 1.5, 1000: 1.5 },
    chicken: { 300: 1.25, 500: 1.38, 1000: 1.39 },
    dessert: { 300: 1.13, 500: 1.38, 1000: 1.35 },
    'toast-burger': { 300: 1.2, 500: 1.4, 1000: 1.29 },
  },
  hongdae: {
    coffee: { 300: 1.18, 500: 1.34, 1000: 1.42 },
    lunchbox: { 300: 0.95, 500: 1.12, 1000: 1.2 },
    chicken: { 300: 1.05, 500: 1.22, 1000: 1.31 },
    dessert: { 300: 1.28, 500: 1.46, 1000: 1.52 },
    'toast-burger': { 300: 1.2, 500: 1.35, 1000: 1.44 },
  },
  seongsu: {
    coffee: { 300: 1.08, 500: 1.2, 1000: 1.25 },
    lunchbox: { 300: 0.82, 500: 0.96, 1000: 1.08 },
    chicken: { 300: 0.88, 500: 1.02, 1000: 1.1 },
    dessert: { 300: 1.18, 500: 1.32, 1000: 1.4 },
    'toast-burger': { 300: 1.02, 500: 1.16, 1000: 1.24 },
  },
} satisfies Record<string, TradeAreaFixture['categoryDensityRatios']>;

export const tradeAreaFixtures: TradeAreaFixture[] = [
  {
    id: 'gangnam',
    label: '서울 강남역',
    aliases: ['강남', '강남역', '서울 강남'],
    marketProfile: '업무·상업 유동인구가 많은 고밀도 상권',
    latitude: 37.4979,
    longitude: 127.0276,
    monthlyRentBaselineM: 5,
    rentMemo: '강남역 샘플 기준 임대료',
    salesPotentialIndex: 1.18,
    categoryDensityRatios: categoryDensityRatios.gangnam,
    stores: [
      store('gangnam-hansot', '한솥도시락 강남점', 'lunchbox', 37.4979, 127.0276, '한솥도시락'),
      store('gangnam-lunch-1', '역삼 도시락', 'lunchbox', 37.498, 127.028),
      store('gangnam-kimbap', '강남 김밥', 'restaurant', 37.4981, 127.0281),
      store('gangnam-coffee', '강남 커피', 'coffee', 37.4967, 127.0272),
      store('gangnam-toast', '강남 토스트', 'toast-burger', 37.4964, 127.0258),
      store('gangnam-lunch-2', '테헤란 도시락', 'lunchbox', 37.5008, 127.0302),
      store('gangnam-dessert', '강남 디저트', 'dessert', 37.503, 127.034),
    ],
  },
  {
    id: 'hongdae',
    label: '서울 홍대입구',
    aliases: ['홍대', '홍대입구', '서울 홍대'],
    marketProfile: '젊은 유동인구와 야간 수요가 강한 상권',
    latitude: 37.5572,
    longitude: 126.9249,
    monthlyRentBaselineM: 4.4,
    rentMemo: '홍대입구 샘플 기준 임대료',
    salesPotentialIndex: 1.12,
    categoryDensityRatios: categoryDensityRatios.hongdae,
    stores: [
      store('hongdae-toast', '홍대 토스트', 'toast-burger', 37.5572, 126.9249),
      store('hongdae-coffee-1', '홍대 커피', 'coffee', 37.5577, 126.9253),
      store('hongdae-dessert-1', '홍대 디저트', 'dessert', 37.5569, 126.9245),
      store('hongdae-chicken', '홍대 치킨', 'chicken', 37.5558, 126.9236),
      store('hongdae-lunch', '홍대 도시락', 'lunchbox', 37.5591, 126.9272),
      store('hongdae-bakery', '홍대 베이커리', 'bakery', 37.5612, 126.9295),
      store('hongdae-dessert-2', '연남 디저트', 'dessert', 37.563, 126.931),
    ],
  },
  {
    id: 'seongsu',
    label: '서울 성수동',
    aliases: ['성수', '성수동', '서울 성수'],
    marketProfile: '카페·브랜드 편집숍 방문 수요가 섞인 성장 상권',
    latitude: 37.5446,
    longitude: 127.0557,
    monthlyRentBaselineM: 3.8,
    rentMemo: '성수동 샘플 기준 임대료',
    salesPotentialIndex: 1.04,
    categoryDensityRatios: categoryDensityRatios.seongsu,
    stores: [
      store('seongsu-coffee-1', '성수 커피', 'coffee', 37.5446, 127.0557),
      store('seongsu-dessert', '성수 디저트', 'dessert', 37.5449, 127.056),
      store('seongsu-lunch', '성수 도시락', 'lunchbox', 37.5439, 127.0551),
      store('seongsu-bakery', '성수 베이커리', 'bakery', 37.5424, 127.0538),
      store('seongsu-chicken', '성수 치킨', 'chicken', 37.5468, 127.0585),
      store('seongsu-toast', '뚝섬 토스트', 'toast-burger', 37.5487, 127.0612),
      store('seongsu-restaurant', '성수 식당', 'restaurant', 37.5502, 127.063),
    ],
  },
];

function store(
  id: string,
  name: string,
  category: TradeAreaStore['category'],
  latitude: number,
  longitude: number,
  brandName?: string,
): TradeAreaStore {
  return { id, name, brandName, category, latitude, longitude };
}
