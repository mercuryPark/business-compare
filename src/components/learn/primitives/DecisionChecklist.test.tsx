import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';

import { DecisionChecklist } from './DecisionChecklist';

afterEach(() => localStorage.clear());

describe('DecisionChecklist', () => {
  it('renders items and toggles a check, persisting to localStorage', async () => {
    const user = userEvent.setup();
    render(<DecisionChecklist id="contract" title="계약 전 체크" items={['정보공개서를 직접 읽었다', '영업지역을 확인했다']} />);

    expect(screen.getByText('계약 전 체크')).toBeTruthy();
    const first = screen.getByRole('checkbox', { name: '정보공개서를 직접 읽었다' });
    expect(first).not.toBeChecked();

    await user.click(first);
    expect(first).toBeChecked();
    expect(localStorage.getItem('learn-checklist:contract')).toContain('정보공개서를 직접 읽었다');
  });

  it('restores checked state from localStorage on mount', () => {
    localStorage.setItem('learn-checklist:contract', JSON.stringify(['영업지역을 확인했다']));
    render(<DecisionChecklist id="contract" title="계약 전 체크" items={['정보공개서를 직접 읽었다', '영업지역을 확인했다']} />);
    expect(screen.getByRole('checkbox', { name: '영업지역을 확인했다' })).toBeChecked();
  });
});
