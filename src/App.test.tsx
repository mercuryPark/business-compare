import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import App from './App';

vi.setConfig({ testTimeout: 10000 });

const forbiddenDefaultCopy = [
  '원문 검토 필요',
  '원문 대조 전',
  'P0',
  '경고',
  '100만 원 단위',
  '현금흐름 재검토',
  '자료 부족',
  '100백만원',
] as const;

describe('App founder experience', () => {
  it('opens with beginner-friendly decision content and no internal review copy', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: '내 조건에 맞는 프랜차이즈 찾기' })).toBeTruthy();
    expect(screen.getByText('처음 보는 사람도 비용, 매출 규모, 운영 부담을 한 화면에서 비교할 수 있게 정리했습니다.')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: '한눈에 보는 창업 지도' })).toBeTruthy();
    expect(screen.getByText('브랜드를 고르기 전, 돈이 묶이는 정도와 매출 체감을 먼저 비교하세요.')).toBeTruthy();
    expect(screen.getByRole('group', { name: '한솥도시락 사업감 미니 차트' })).toBeTruthy();
    expect(screen.getByText('초보자용 읽는 법')).toBeTruthy();
    expect(screen.getByRole('heading', { level: 2, name: '한솥도시락' })).toBeTruthy();
    expect(screen.getAllByText('창업비').length).toBeGreaterThan(0);
    expect(screen.getAllByText('월매출').length).toBeGreaterThan(0);
    expect(screen.getByText('비교함 0/4')).toBeTruthy();

    for (const copy of forbiddenDefaultCopy) {
      expect(screen.queryByText(copy, { exact: false })).toBeNull();
    }
  });

  it('filters cards by category without losing the comparison workflow', async () => {
    const user = userEvent.setup();

    render(<App />);

    await user.click(screen.getByRole('button', { name: '커피' }));

    expect(screen.getByRole('button', { name: '커피' }).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByRole('heading', { level: 2, name: '메가커피' })).toBeTruthy();
    expect(screen.queryByRole('heading', { level: 2, name: '한솥도시락' })).toBeNull();
    expect(screen.getByText('비교함 0/4')).toBeTruthy();
  });

  it('shows one active learning report and opens another report from a card', async () => {
    const user = userEvent.setup();
    const scrollIntoView = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoView;

    render(<App />);

    expect(screen.getByRole('region', { name: '한솥도시락 창업 판단 리포트' })).toBeTruthy();
    expect(screen.queryByRole('region', { name: '이삭토스트 창업 판단 리포트' })).toBeNull();
    expect(screen.getAllByRole('region', { name: /창업 판단 리포트/ })).toHaveLength(1);

    await user.click(screen.getAllByRole('button', { name: '자세히 보기' })[1]);

    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
    expect(screen.queryByRole('region', { name: '한솥도시락 창업 판단 리포트' })).toBeNull();
    expect(screen.getByRole('region', { name: '이삭토스트 창업 판단 리포트' })).toBeTruthy();
  });

  it('keeps source evidence out of the default report until the user asks for it', async () => {
    const user = userEvent.setup();

    render(<App />);

    const report = screen.getByRole('region', { name: '한솥도시락 창업 판단 리포트' });
    expect(within(report).queryByText('자료 기준')).toBeNull();
    expect(within(report).queryByText('출처 열기')).toBeNull();

    await user.click(within(report).getByRole('button', { name: '자료 기준 보기' }));

    expect(within(report).getByText('자료 기준')).toBeTruthy();
    expect(within(report).getByRole('link', { name: '출처 열기' }).getAttribute('href')).toContain(
      'frnchsNo=20080100308',
    );
  });

  it('uses plain Korean money units in the simulator and avoids accounting jargon dead ends', async () => {
    const user = userEvent.setup();

    render(<App />);

    const report = screen.getByRole('region', { name: '한솥도시락 창업 판단 리포트' });
    expect(within(report).getByLabelText('월매출')).toBeTruthy();
    expect(within(report).getByLabelText('후보지 월 임대료')).toBeTruthy();
    expect(within(report).getByRole('button', { name: '기준형' }).getAttribute('aria-pressed')).toBe('true');
    expect(within(report).getByRole('button', { name: '보수형' }).getAttribute('aria-pressed')).toBe('false');
    expect(within(report).getByRole('button', { name: '개선형' }).getAttribute('aria-pressed')).toBe('false');
    expect(within(report).getByText('평균매출을 기준으로, 대출과 사장 인건비를 따로 비교합니다.')).toBeTruthy();
    expect(within(report).getByLabelText('대출 포함')).toBeTruthy();
    expect(within(report).getByLabelText('사장 인건비 포함')).toBeTruthy();
    expect(within(report).getAllByText('월 손에 남는 돈').length).toBeGreaterThanOrEqual(1);
    expect(within(report).getByText('버티기 쉬운 매출선')).toBeTruthy();
    expect(within(report).getByRole('heading', { level: 4, name: '월매출에서 순수익까지' })).toBeTruthy();
    expect(within(report).getAllByText('원가/필수구매').length).toBeGreaterThanOrEqual(1);
    expect(within(report).getAllByText('배달/포장 수수료').length).toBeGreaterThanOrEqual(1);
    expect(within(report).getAllByText('임대료').length).toBeGreaterThanOrEqual(1);
    expect(within(report).getAllByText('인건비/사장노동').length).toBeGreaterThanOrEqual(1);
    expect(within(report).getByRole('heading', { level: 4, name: '예외상황별 결과' })).toBeTruthy();
    expect(within(report).getByText('임대료 상승')).toBeTruthy();
    expect(within(report).getByText('배달 확대')).toBeTruthy();
    expect(within(report).queryByText('현재 가정에서는 회수 어려움')).toBeNull();
    expect(within(report).queryByText('흑자 조건부터 맞춰보기')).toBeNull();
    expect(within(report).getByText('현재 입력값에서는 매달 남는 돈이 생기는 구조입니다.')).toBeTruthy();
    expect(within(report).queryByText('100만 원 단위', { exact: false })).toBeNull();
    expect(within(report).queryByText('현금흐름 재검토')).toBeNull();

    await user.click(within(report).getByRole('button', { name: '개선형' }));

    expect(within(report).getByRole('button', { name: '개선형' }).getAttribute('aria-pressed')).toBe('true');
    expect(within(report).getByText('임대료와 배달 비중을 낮춘 목표 조건입니다.')).toBeTruthy();

    await user.click(within(report).getByRole('button', { name: '비용 자세히 조정' }));

    expect(within(report).getByLabelText('대출 원금')).toBeTruthy();
    expect(within(report).getByLabelText('직원 인건비')).toBeTruthy();
    expect(within(report).getByLabelText('내 인건비')).toBeTruthy();
    expect(within(report).getByLabelText('전기수도/관리비')).toBeTruthy();
    expect(within(report).getByLabelText('기타 운영비')).toBeTruthy();
    expect(within(report).getByLabelText('원가율')).toBeTruthy();
    expect(within(report).getByLabelText('배달앱 수수료')).toBeTruthy();
    expect(within(report).getByLabelText('배달대행 수수료')).toBeTruthy();
    expect(within(report).getByLabelText('포장비율')).toBeTruthy();
    expect(within(report).getByLabelText('카드 수수료')).toBeTruthy();
    expect(within(report).getByLabelText('세금 유보율')).toBeTruthy();
    expect(within(report).getByText('급여명세서나 채용공고의 월급 총액을 넣으세요.')).toBeTruthy();
    expect(within(report).getByText('배달앱 정산서의 주문중개 수수료율을 넣으세요.')).toBeTruthy();
  });

  it('shows cited market context only for brands with real external references', async () => {
    const user = userEvent.setup();

    render(<App />);

    expect(screen.queryByRole('heading', { level: 3, name: '시장 기사로 보는 맥락' })).toBeNull();

    await user.click(screen.getAllByRole('button', { name: '자세히 보기' })[2]);

    const report = screen.getByRole('region', { name: '메가커피 창업 판단 리포트' });
    expect(within(report).getByRole('heading', { level: 3, name: '시장 기사로 보는 맥락' })).toBeTruthy();
    expect(within(report).getByText('빠른 점포 확장')).toBeTruthy();
    expect(within(report).getByRole('link', { name: '기사 원문' }).getAttribute('href')).toContain('mega-mgccoffee');
  });

  it('shows candidate-location analysis in the active brand report', () => {
    render(<App />);

    const report = screen.getByRole('region', { name: '한솥도시락 창업 판단 리포트' });
    expect(within(report).getByRole('heading', { name: '내 후보지로 계산' })).toBeTruthy();
    expect(within(report).getByLabelText('후보지 상권명')).toBeTruthy();
    expect(within(report).getByLabelText('월 임대료')).toBeTruthy();
    expect(within(report).getByText('예시 상권 데이터')).toBeTruthy();
    expect(within(report).getByText('후보지 기대 월매출')).toBeTruthy();
    expect(within(report).getByText(/월 예상 (잔여금|부족액)/)).toBeTruthy();
    expect(within(report).getByText('손익분기 월매출')).toBeTruthy();
    expect(within(report).getByText('사장 인건비·대출 포함 기준')).toBeTruthy();
  });

  it('preserves simulator results when number inputs are empty or non-finite', async () => {
    const user = userEvent.setup();

    render(<App />);

    const report = screen.getByRole('region', { name: '한솥도시락 창업 판단 리포트' });
    const monthlySalesInput = within(report).getByLabelText('월매출') as HTMLInputElement;
    const initialCashLeft = getResultValue(report, '월 손에 남는 돈');

    await user.clear(monthlySalesInput);

    expect(getResultValue(report, '월 손에 남는 돈')).toBe(initialCashLeft);
    expect(within(report).queryByText(/NaN/)).toBeNull();

    await user.click(monthlySalesInput);
    await user.keyboard('{Control>}a{/Control}');
    await user.paste('1e309');

    expect(getResultValue(report, '월 손에 남는 돈')).toBe(initialCashLeft);
    expect(within(report).queryByText(/NaN/)).toBeNull();
  });

  it('clamps simulator percentage inputs to supported ranges', async () => {
    const user = userEvent.setup();

    render(<App />);

    const report = screen.getByRole('region', { name: '한솥도시락 창업 판단 리포트' });
    const deliveryRatioInput = within(report).getByLabelText('배달 비중') as HTMLInputElement;

    await user.clear(deliveryRatioInput);
    await user.type(deliveryRatioInput, '95');

    expect(deliveryRatioInput.value).toBe('90');
    expect(within(report).queryByText(/NaN/)).toBeNull();

    await user.click(within(report).getByRole('button', { name: '비용 자세히 조정' }));

    const taxReserveInput = within(report).getByLabelText('세금 유보율') as HTMLInputElement;
    await user.clear(taxReserveInput);
    await user.type(taxReserveInput, '50');

    expect(taxReserveInput.value).toBe('20');
    expect(within(report).queryByText(/NaN/)).toBeNull();
  });

  it('shows project data sources and better-data candidates at the bottom of the site', () => {
    render(<App />);

    const footer = screen.getByRole('contentinfo', { name: '데이터 출처와 보강 후보' });

    expect(within(footer).getByRole('heading', { level: 2, name: '데이터 출처와 보강 후보' })).toBeTruthy();
    expect(within(footer).getByText('현재 화면에 반영된 데이터')).toBeTruthy();
    expect(within(footer).getByText('추가 확보하면 정확도가 올라가는 데이터')).toBeTruthy();
    expect(within(footer).getByText('경기도 가맹정보제공시스템 구조화 데이터')).toBeTruthy();
    expect(within(footer).getByText('공정거래위원회 정보공개서 원문/API')).toBeTruthy();
    expect(within(footer).getByText('후보지 분석 샘플 상권 데이터')).toBeTruthy();
    expect(within(footer).getByText('소상공인시장진흥공단 상가(상권)정보')).toBeTruthy();
    expect(within(footer).getByText('한국부동산원 상업용부동산 임대동향조사')).toBeTruthy();
    expect(within(footer).getByRole('link', { name: '경기도 가맹정보제공시스템 구조화 데이터' })).toBeTruthy();
  });
});

function getResultValue(container: HTMLElement, label: string): string | null {
  return within(container).getAllByText(label)[0].nextElementSibling?.textContent ?? null;
}
