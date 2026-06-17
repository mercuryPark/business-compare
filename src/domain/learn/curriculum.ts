import type { LearnChapter, LearnPhase } from './types';
import { Chapter1 } from '../../content/learn/Chapter1';
import { Chapter2 } from '../../content/learn/Chapter2';
import { Chapter3 } from '../../content/learn/Chapter3';
import { Chapter4 } from '../../content/learn/Chapter4';
import { Chapter5 } from '../../content/learn/Chapter5';
import { Chapter6 } from '../../content/learn/Chapter6';
import { Chapter7 } from '../../content/learn/Chapter7';
import { Chapter8 } from '../../content/learn/Chapter8';

export const PHASES: { id: LearnPhase; label: string }[] = [
  { id: 'prepare', label: '준비' },
  { id: 'operate', label: '운영' },
  { id: 'respond', label: '대응' },
];

// Seed each chapter with at least one draft source so curriculum invariants hold
// before Part 2 authoring. Real sources are added with the content.
const seedSource = (id: string): LearnChapter['sources'] => [
  {
    id,
    category: 'general',
    sourceTitle: '작성 예정',
    sourceUrl: 'https://example.com',
    lastCheckedAt: '2026-06-17',
    reviewStatus: 'draft',
    reviewer: null,
  },
];

export const CHAPTERS: LearnChapter[] = [
  {
    id: 'ch1',
    slug: 'ch1-mindset-money',
    phase: 'prepare',
    order: 1,
    title: '마음가짐과 자금 준비',
    summary: '자금 준비와 창업하면 안 되는 조건',
    body: Chapter1,
    sources: [
      {
        id: 'ch1-semas-startup',
        category: 'general',
        sourceTitle: '소상공인시장진흥공단 — 소상공인 창업 일반 안내',
        sourceUrl: 'https://www.semas.or.kr/',
        lastCheckedAt: '2026-06-17',
        reviewStatus: 'draft',
        reviewer: null,
      },
    ],
  },
  {
    id: 'ch2',
    slug: 'ch2-contract',
    phase: 'prepare',
    order: 2,
    title: '계약 전 멈춤 — 정보공개서·가맹계약서',
    summary: '계약 전 반드시 확인할 것',
    body: Chapter2,
    sources: [
      {
        id: 'ch2-ftc-disclosure',
        category: 'contract',
        sourceTitle: '공정거래위원회 — 등록 정보공개서 공개본 목록 조회(공공데이터포털)',
        sourceUrl: 'https://www.data.go.kr/data/15125569/openapi.do',
        lastCheckedAt: '2026-06-17',
        reviewStatus: 'draft',
        reviewer: null,
      },
    ],
  },
  {
    id: 'ch3',
    slug: 'ch3-location-license',
    phase: 'prepare',
    order: 3,
    title: '입지·상권·임대차·인허가',
    summary: '장소를 구하고 허가받기',
    body: Chapter3,
    sources: [
      {
        id: 'ch3-lease-guide',
        category: 'lease',
        sourceTitle: '소상공인시장진흥공단 — 상가(상권)정보 / 임대차 안내',
        sourceUrl: 'https://bigdata.sbiz.or.kr/',
        lastCheckedAt: '2026-06-17',
        reviewStatus: 'draft',
        reviewer: null,
      },
      {
        id: 'ch3-restaurant-license',
        category: 'licensing',
        sourceTitle: '식품의약품안전처 — 식품접객업 영업신고 안내',
        sourceUrl: 'https://www.mfds.go.kr/',
        lastCheckedAt: '2026-06-17',
        reviewStatus: 'draft',
        reviewer: null,
      },
    ],
  },
  { id: 'ch4', slug: 'ch4-startup-cost', phase: 'prepare', order: 4, title: '창업에 드는 돈 — 초기비용 전체 지도', summary: '초기비용과 최악의 손실 계산', body: Chapter4, sources: seedSource('ch4-seed') },
  { id: 'ch5', slug: 'ch5-monthly-cashflow', phase: 'operate', order: 5, title: '매달 나가는 돈 + 돈의 흐름', summary: '운영비용과 손익 흐름', body: Chapter5, sources: seedSource('ch5-seed') },
  { id: 'ch6', slug: 'ch6-operations', phase: 'operate', order: 6, title: '일상 운영의 기본기', summary: '손익·인력·재고·마케팅', body: Chapter6, sources: seedSource('ch6-seed') },
  { id: 'ch7', slug: 'ch7-low-sales', phase: 'respond', order: 7, title: '매출이 안 나올 때 — 진단과 회복', summary: '원인 진단과 손절 판단', body: Chapter7, sources: seedSource('ch7-seed') },
  { id: 'ch8', slug: 'ch8-high-sales', phase: 'respond', order: 8, title: '매출이 잘 나올 때 — 지속과 확장', summary: '세금·확장·번아웃 관리', body: Chapter8, sources: seedSource('ch8-seed') },
];

export const CHAPTER_SLUGS = CHAPTERS.map((c) => c.slug);

export function getChapter(slug: string): LearnChapter | undefined {
  return CHAPTERS.find((c) => c.slug === slug);
}

export function getAdjacentChapters(slug: string): {
  prev: LearnChapter | null;
  next: LearnChapter | null;
} {
  const index = CHAPTERS.findIndex((c) => c.slug === slug);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? CHAPTERS[index - 1] : null,
    next: index < CHAPTERS.length - 1 ? CHAPTERS[index + 1] : null,
  };
}
