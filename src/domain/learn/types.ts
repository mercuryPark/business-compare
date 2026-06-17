import type { ComponentType } from 'react';

export type LearnPhase = 'prepare' | 'operate' | 'respond';

export type ReviewStatus = 'draft' | 'self-reviewed' | 'expert-reviewed';

export type LearnSourceCategory =
  | 'tax'
  | 'wage'
  | 'contract'
  | 'lease'
  | 'licensing'
  | 'general';

export interface LearnSource {
  id: string;
  category: LearnSourceCategory;
  sourceTitle: string;
  sourceUrl: string;
  lastCheckedAt: string; // ISO date, e.g. '2026-06-17'
  reviewStatus: ReviewStatus;
  reviewer: string | null;
}

export interface LearnChapter {
  id: string;
  slug: string;
  phase: LearnPhase;
  order: number;
  title: string;
  summary: string;
  body: ComponentType;
  sources: LearnSource[];
}

export type LearnRoute =
  | { view: 'home' }
  | { view: 'compare' }
  | { view: 'learn'; mode: 'chapter'; chapterSlug: string }
  | { view: 'learn'; mode: 'notFound'; requestedSlug: string };
