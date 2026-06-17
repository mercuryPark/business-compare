import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { brands } from '../domain/brands';
import { CandidateLocationPanel } from './CandidateLocationPanel';

describe('CandidateLocationPanel', () => {
  it('lets a founder compare a candidate area against break-even sales', async () => {
    const user = userEvent.setup();
    render(<CandidateLocationPanel brand={brands[0]} />);

    expect(screen.getByRole('heading', { name: '내 후보지로 계산' })).toBeTruthy();

    await user.clear(screen.getByLabelText('후보지 상권명'));
    await user.type(screen.getByLabelText('후보지 상권명'), '강남역');
    await user.clear(screen.getByLabelText('후보지 월 임대료'));
    await user.type(screen.getByLabelText('후보지 월 임대료'), '520');

    expect(screen.getByText('서울 강남역')).toBeTruthy();
    expect(screen.getByText('예시 상권 데이터')).toBeTruthy();
    expect(screen.getByText('반경 500m 경쟁 현황')).toBeTruthy();
    expect(screen.getByText('후보지 기대 월매출')).toBeTruthy();
    expect(screen.getByText(/월 예상 (잔여금|부족액)/)).toBeTruthy();
    expect(screen.getByText('손익분기 월매출')).toBeTruthy();
    expect(screen.getByText('신규점 보정 포함')).toBeTruthy();
    expect(screen.getByText('사장 인건비·대출 포함 기준')).toBeTruthy();
    expect(screen.getByText('표시 점포 수는 예시 데이터이고, 경쟁밀도는 상권 추정값으로 계산합니다.')).toBeTruthy();
    expect(screen.getByText('계약 전 확인 질문')).toBeTruthy();
  });

  it('shows a no-data state instead of fake numbers for an unknown area', async () => {
    const user = userEvent.setup();
    render(<CandidateLocationPanel brand={brands[0]} />);

    await user.clear(screen.getByLabelText('후보지 상권명'));
    await user.type(screen.getByLabelText('후보지 상권명'), '부산 서면');

    expect(screen.getByText('해당 상권 데이터 없음')).toBeTruthy();
    expect(screen.getByText('예: 강남, 홍대, 성수')).toBeTruthy();
    expect(screen.queryByText('손익분기 월매출')).toBeNull();
  });
});
