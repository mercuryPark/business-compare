import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CHAPTERS } from '../../domain/learn/curriculum';
import { LearnSourcesProvider } from '../../components/learn/primitives/sourceContext';
import { Chapter2 } from './Chapter2';

describe('Chapter2 content', () => {
  const chapter = CHAPTERS.find((c) => c.id === 'ch2')!;

  it('renders a key heading with all sourceIds resolving against the chapter sources', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter2 />
      </LearnSourcesProvider>,
    );
    expect(screen.getByRole('heading', { name: /정보공개서·가맹계약서/ })).toBeTruthy();
  });

  it('renders the ContractQuestionList and the contract checklist', () => {
    render(
      <LearnSourcesProvider sources={chapter.sources}>
        <Chapter2 />
      </LearnSourcesProvider>,
    );
    expect(
      screen.getByText(
        '제 점포의 영업지역은 계약서에 어떻게(반경·행정동 등) 적혀 있나요?',
      ),
    ).toBeTruthy();
    expect(
      screen.getByText('공정위에 등록된 정보공개서 원본을 직접 조회해 읽었다'),
    ).toBeTruthy();
  });
});
