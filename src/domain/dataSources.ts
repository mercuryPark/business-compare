export interface ProjectDataSource {
  title: string;
  description: string;
  status: string;
  url?: string;
}

export const currentProjectDataSources: ProjectDataSource[] = [
  {
    title: '경기도 가맹정보제공시스템 구조화 데이터',
    description: '브랜드별 창업비, 평균매출, 점포 수, 개점/계약종료/해지/명의변경 등 현재 비교표의 핵심 수치입니다.',
    status: '현재 반영',
    url: 'https://fair.gg.go.kr/fran/search/unifiedSearchBrandInteg.do',
  },
  {
    title: '공정거래위원회 정보공개서 원문/API',
    description: '정보공개서 원문 URL, 기준연도, 브랜드 매칭을 확인해 공식 검증 데이터로 승격하기 위한 기준입니다.',
    status: '원문 대조 필요',
    url: 'https://franchise.ftc.go.kr/',
  },
  {
    title: '공공데이터포털 정보공개서 공개본 API',
    description: '브랜드별 정보공개서 공개본 후보와 열람 URL을 찾기 위한 서비스키 기반 후보 데이터입니다.',
    status: '후보 수집용',
    url: 'https://www.data.go.kr/data/15125569/openapi.do',
  },
  {
    title: '공공데이터포털 가맹금/기타비용 API',
    description: '가맹비, 교육비, 차액가맹금, 광고비, 로열티, 필수구매 등 반복비용 검증 후보입니다.',
    status: '후보 수집용',
    url: 'https://www.data.go.kr/data/15125476/openapi.do',
  },
  {
    title: '수동 원문 대조 템플릿',
    description: 'FTC 원문 확인, 2차 교차확인, 검토자 기록, 수수료 근거를 구조화하기 위한 내부 검수 기록입니다.',
    status: '검수 워크플로',
  },
  {
    title: '브랜드·업종별 운영비 가정',
    description: '임대료, 인건비, 원가율, 배달비중, 공과금, 기타 운영비, 대출 조건을 시뮬레이터에 쓰는 내부 가정입니다.',
    status: '가정값',
  },
  {
    title: '후보지 분석 샘플 상권 데이터',
    description: '후보지 입력 흐름과 손익분기 계산을 검증하기 위한 샘플 상권 데이터입니다. 실제 상권 점포 수는 공공데이터 API 연동 뒤 대체합니다.',
    status: '예시 계산용',
  },
  {
    title: '시장 기사/브랜드 공지 신호',
    description: '브랜드 확장, 시장 이슈, 점포 확장 속도처럼 수치만으로 보기 어려운 맥락을 보조합니다.',
    status: '보조 맥락',
  },
];

export const recommendedProjectDataSources: ProjectDataSource[] = [
  {
    title: '소상공인시장진흥공단 상가(상권)정보',
    description: '후보 상권의 업종별 점포 밀도, 경쟁점 위치, 주소/좌표 기반 상권 분포를 보강할 수 있습니다.',
    status: '우선 확보',
    url: 'https://www.data.go.kr/data/15012005/openapi.do',
  },
  {
    title: '소상공인시장진흥공단 상가(상권)정보 파일 데이터',
    description: '분기별 전국 상가 위치 스냅샷을 내려받아 경쟁 밀도와 폐점/신규 출점 흐름을 오프라인 분석할 수 있습니다.',
    status: '우선 확보',
    url: 'https://www.data.go.kr/data/15083033/fileData.do',
  },
  {
    title: '행정안전부 지방행정 인허가 데이터',
    description: '일반음식점, 휴게음식점 등 업종별 인허가·폐업 이력을 통해 상권 생존성과 회전율을 보강할 수 있습니다.',
    status: '우선 확보',
    url: 'https://www.localdata.go.kr/',
  },
  {
    title: '서울시 우리마을가게 상권분석서비스',
    description: '서울권 후보지는 생활인구, 상권 단위, 업종별 매출·점포 흐름을 더 촘촘하게 확인할 수 있습니다.',
    status: '지역 보강',
    url: 'https://www.data.go.kr/data/15094719/fileData.do',
  },
  {
    title: '소상공인365 상권분석',
    description: '상권별 유동인구, 배후수요, 업종 분포를 후보 입지 설명에 붙일 수 있는 실무형 참고 데이터입니다.',
    status: '지역 보강',
    url: 'https://bigdata.sbiz.or.kr/',
  },
  {
    title: '한국부동산원 상업용부동산 임대동향조사',
    description: '지역·상권별 임대료 수준과 공실률을 월 임대료 입력값의 현실성 검증 기준으로 쓸 수 있습니다.',
    status: '비용 보강',
    url: 'https://www.reb.or.kr/r-one/',
  },
  {
    title: 'KOSIS 국가통계포털',
    description: '프랜차이즈, 도소매·숙박음식, 사업체 수, 종사자 수 같은 거시 기준선을 비교 기준으로 붙일 수 있습니다.',
    status: '시장 기준선',
    url: 'https://kosis.kr/',
  },
  {
    title: '국세통계포털',
    description: '지역·업종별 사업자 수, 생활업종 흐름, 과세 기반 통계를 상권의 실제 사업자 변화 확인에 활용할 수 있습니다.',
    status: '시장 기준선',
    url: 'https://tasis.nts.go.kr/',
  },
];
