import type { P0FeeApiEvidence, P0FeeEvidenceCandidate } from './p0FeeApiEvidence';

const outputDir = 'docs/research/p0-fee-api-evidence';

export interface P0FeeApiEvidenceFile {
  path: string;
  content: string;
}

export interface P0FeeApiEvidenceFileOptions {
  capturedAt?: string;
}

export function buildP0FeeApiEvidenceFiles(
  evidenceRows: P0FeeApiEvidence[],
  options: P0FeeApiEvidenceFileOptions = {},
): P0FeeApiEvidenceFile[] {
  const capturedAt = options.capturedAt ?? new Date().toISOString();

  return [
    {
      path: `${outputDir}/README.md`,
      content: buildIndexContent(evidenceRows, capturedAt),
    },
    ...evidenceRows.map(buildBrandEvidenceFile),
  ];
}

export function formatP0FeeApiEvidenceFileGenerationReport(files: P0FeeApiEvidenceFile[]): string {
  const lines = ['P0 fee API evidence files: GENERATED', `Files: ${files.length}`, ''];

  for (const file of files) {
    lines.push(`- ${file.path}`);
  }

  return lines.join('\n');
}

function buildIndexContent(evidenceRows: P0FeeApiEvidence[], capturedAt: string): string {
  const lines = [
    '# P0 수수료 API 증거 파일',
    '',
    `Captured at: ${capturedAt}`,
    '',
    '공공데이터포털 FTC 수수료 API 응답 후보를 수동 원문 대조용으로 보관한 파일입니다.',
    '이 파일만으로는 브랜드 데이터 승격이 불가하며, API 반환 브랜드명과 FTC 원문을 별도로 확인해야 합니다.',
    '',
    '## 브랜드 파일',
    '',
  ];

  for (const evidence of evidenceRows) {
    lines.push(`- [${evidence.brandId} ${evidence.registeredBrandName}](./${evidence.brandId}.md)`);
  }

  return `${lines.join('\n')}\n`;
}

function buildBrandEvidenceFile(evidence: P0FeeApiEvidence): P0FeeApiEvidenceFile {
  return {
    path: `${outputDir}/${evidence.brandId}.md`,
    content: buildBrandEvidenceContent(evidence),
  };
}

function buildBrandEvidenceContent(evidence: P0FeeApiEvidence): string {
  return `# ${evidence.brandId} ${evidence.registeredBrandName} P0 수수료 API 증거

## 입력 상태

- brandMnno: ${evidence.brandMnno}
- readyForReviewRecord: ${evidence.readyForReviewRecord}
- brandConfirmationRequired: ${evidence.brandConfirmationRequired}

## 차액가맹금 후보

| 구분 | 금액/범위 | 지급기한 |
| --- | --- | --- |
${formatMarginRows(evidence.marginFeeCandidates)}

## 로열티/광고비/필수비용 후보

| 구분 | 금액/범위 | 대상 | 지급기한 |
| --- | --- | --- | --- |
${formatRecurringRows(evidence.recurringCostCandidates)}

## 차단 조건

${evidence.blockers.map((blocker) => `- ${blocker}`).join('\n')}

## 원본 API 조각

${formatRawEvidence(evidence)}
`;
}

function formatMarginRows(candidates: P0FeeEvidenceCandidate[]): string {
  if (candidates.length === 0) {
    return '| 후보 없음 | - | - |';
  }

  return candidates
    .map((candidate) =>
      `| ${cell(candidate.label)} | ${cell(candidate.amountText)} | ${cell(candidate.deadline ?? '-')} |`,
    )
    .join('\n');
}

function formatRecurringRows(candidates: P0FeeEvidenceCandidate[]): string {
  if (candidates.length === 0) {
    return '| 후보 없음 | - | - | - |';
  }

  return candidates
    .map((candidate) =>
      `| ${cell(candidate.label)} | ${cell(candidate.amountText)} | ${cell(candidate.target ?? '-')} | ${cell(
        candidate.deadline ?? '-',
      )} |`,
    )
    .join('\n');
}

function formatRawEvidence(evidence: P0FeeApiEvidence): string {
  const rawLines = [...evidence.marginFeeCandidates, ...evidence.recurringCostCandidates].map(
    (candidate, index) => `${index + 1}. \`${candidate.source}\` ${candidate.raw}`,
  );

  return rawLines.length > 0 ? rawLines.join('\n') : '- 원본 조각 없음';
}

function cell(value: string): string {
  return value.replace(/\|/g, '\\|').trim();
}
