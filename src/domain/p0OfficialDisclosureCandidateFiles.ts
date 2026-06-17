import type { P0OfficialDisclosureCandidate, P0OfficialDisclosureFetchRow } from './p0OfficialDisclosureApiFetch';

const outputDir = 'docs/research/p0-disclosure-api-candidates';

export interface P0OfficialDisclosureCandidateFile {
  path: string;
  content: string;
}

export interface P0OfficialDisclosureCandidateFileOptions {
  capturedAt?: string;
}

export function buildP0OfficialDisclosureCandidateFiles(
  rows: P0OfficialDisclosureFetchRow[],
  options: P0OfficialDisclosureCandidateFileOptions = {},
): P0OfficialDisclosureCandidateFile[] {
  const capturedAt = options.capturedAt ?? new Date().toISOString();

  return [
    {
      path: `${outputDir}/README.md`,
      content: buildIndexContent(rows, capturedAt),
    },
    ...rows.map(buildBrandCandidateFile),
  ];
}

export function formatP0OfficialDisclosureCandidateFileGenerationReport(
  files: P0OfficialDisclosureCandidateFile[],
): string {
  const lines = ['P0 official disclosure candidate files: GENERATED', `Files: ${files.length}`, ''];

  for (const file of files) {
    lines.push(`- ${file.path}`);
  }

  return lines.join('\n');
}

function buildIndexContent(rows: P0OfficialDisclosureFetchRow[], capturedAt: string): string {
  const lines = [
    '# P0 정보공개서 공개본 후보 파일',
    '',
    `Captured at: ${capturedAt}`,
    '',
    '공식 FTC 정보공개서 공개본 목록 API 응답 후보를 수동 원문 대조용으로 보관한 파일입니다.',
    '이 파일만으로는 브랜드 데이터 승격이 불가하며, viewer 원문과 브랜드/기준연도/수수료 항목을 별도로 확인해야 합니다.',
    '',
    '## 브랜드 파일',
    '',
  ];

  for (const row of rows) {
    lines.push(`- [${row.brandId} ${row.registeredBrandName}](./${row.brandId}.md)`);
  }

  return `${lines.join('\n')}\n`;
}

function buildBrandCandidateFile(row: P0OfficialDisclosureFetchRow): P0OfficialDisclosureCandidateFile {
  return {
    path: `${outputDir}/${row.brandId}.md`,
    content: buildBrandCandidateContent(row),
  };
}

function buildBrandCandidateContent(row: P0OfficialDisclosureFetchRow): string {
  return `# ${row.brandId} ${row.registeredBrandName} P0 정보공개서 공개본 후보

## 입력 상태

- lookupKeyword: ${row.lookupKeyword}
- candidateCount: ${row.candidateCount}
- readyForManualReviewUrlInput: false

## 공개본 후보

| 일련번호 | 브랜드명 | 법인명 | 등록번호 | 사업자번호 |
| --- | --- | --- | --- | --- |
${formatCandidateRows(row.candidates)}

## Viewer URL

${formatViewerUrls(row.candidates)}

## 차단 조건

${row.blockers.map((blocker) => `- ${blocker}`).join('\n')}

## 원본 API 조각

${formatRawCandidates(row.candidates)}
`;
}

function formatCandidateRows(candidates: P0OfficialDisclosureCandidate[]): string {
  if (candidates.length === 0) {
    return '| 후보 없음 | - | - | - | - |';
  }

  return candidates
    .map(
      (candidate) =>
        `| ${cell(candidate.disclosureSerial)} | ${cell(candidate.brandName)} | ${cell(
          candidate.corporationName,
        )} | ${cell(candidate.registrationNumber)} | ${cell(candidate.businessRegistrationNumber)} |`,
    )
    .join('\n');
}

function formatViewerUrls(candidates: P0OfficialDisclosureCandidate[]): string {
  if (candidates.length === 0) {
    return '- 후보 없음';
  }

  return candidates
    .map((candidate, index) => `${index + 1}. ${candidate.viewerUrl}`)
    .join('\n');
}

function formatRawCandidates(candidates: P0OfficialDisclosureCandidate[]): string {
  if (candidates.length === 0) {
    return '- 원본 조각 없음';
  }

  return candidates.map((candidate, index) => `${index + 1}. ${candidate.raw}`).join('\n');
}

function cell(value: string): string {
  return value.replace(/\|/g, '\\|').trim();
}
