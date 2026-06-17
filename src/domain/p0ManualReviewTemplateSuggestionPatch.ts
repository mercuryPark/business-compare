import type { P0ManualReviewTemplateFile } from './p0ManualReviewTemplates';
import type { P0FeeApiTemplateSuggestionRow } from './p0FeeApiTemplateSuggestions';
import type { P0OfficialDisclosureFetchRow } from './p0OfficialDisclosureApiFetch';

const outputDir = 'docs/research/p0-manual-review-preview';

export interface P0ManualReviewTemplateSuggestionPatchOptions {
  capturedAt?: string;
  disclosureRows?: P0OfficialDisclosureFetchRow[];
}

export function buildP0ManualReviewTemplateSuggestionPatchFiles(
  templates: P0ManualReviewTemplateFile[],
  suggestions: P0FeeApiTemplateSuggestionRow[],
  options: P0ManualReviewTemplateSuggestionPatchOptions = {},
): P0ManualReviewTemplateFile[] {
  const capturedAt = options.capturedAt ?? new Date().toISOString();
  const suggestionsByBrand = new Map(suggestions.map((suggestion) => [suggestion.brandId, suggestion]));
  const disclosuresByBrand = new Map((options.disclosureRows ?? []).map((row) => [row.brandId, row]));
  const previewFiles = templates
    .filter((template) => !template.path.endsWith('/README.md'))
    .map((template) => {
      const brandId = template.path.split('/').pop()?.replace(/\.md$/, '') ?? '';
      const suggestion = suggestionsByBrand.get(brandId);
      const disclosureRow = disclosuresByBrand.get(brandId);

      return suggestion || hasSingleDisclosureCandidate(disclosureRow)
        ? buildPreviewFile(template, suggestion, disclosureRow)
        : undefined;
    })
    .filter((file): file is P0ManualReviewTemplateFile => Boolean(file));

  return [
    {
      path: `${outputDir}/README.md`,
      content: buildIndexContent(previewFiles, capturedAt),
    },
    ...previewFiles,
  ];
}

export function formatP0ManualReviewTemplateSuggestionPatchReport(files: P0ManualReviewTemplateFile[]): string {
  const lines = ['P0 manual review template preview: GENERATED', `Files: ${files.length}`, ''];

  for (const file of files) {
    lines.push(`- ${file.path}`);
  }

  return lines.join('\n');
}

function buildPreviewFile(
  template: P0ManualReviewTemplateFile,
  suggestion: P0FeeApiTemplateSuggestionRow | undefined,
  disclosureRow: P0OfficialDisclosureFetchRow | undefined,
): P0ManualReviewTemplateFile {
  const brandId = template.path.split('/').pop()?.replace(/\.md$/, '') ?? '';

  return {
    path: `${outputDir}/${suggestion?.brandId ?? brandId}.md`,
    content: applySuggestionToContent(template.content, suggestion, disclosureRow),
  };
}

function buildIndexContent(files: P0ManualReviewTemplateFile[], capturedAt: string): string {
  const lines = [
    '# P0 수동 원문 대조 preview',
    '',
    `Captured at: ${capturedAt}`,
    '',
    'API 후보값을 수동 원문 대조 템플릿에 미리 반영한 preview입니다.',
    'FTC 원문 URL, reviewer, 원문 확인 체크박스는 자동으로 채우지 않습니다.',
    '',
    '## Preview 파일',
    '',
  ];

  for (const file of files) {
    const fileName = file.path.split('/').pop() ?? file.path;
    lines.push(`- [${fileName}](./${fileName})`);
  }

  return `${lines.join('\n')}\n`;
}

function applySuggestionToContent(
  content: string,
  suggestion: P0FeeApiTemplateSuggestionRow | undefined,
  disclosureRow: P0OfficialDisclosureFetchRow | undefined,
): string {
  const fields = suggestion?.suggestedFields;
  let patched = content;

  if (fields) {
    patched = replaceField(patched, 'recurringRoyaltyRate', fields.recurringRoyaltyRate);
    patched = replaceField(patched, 'adFeeRate', fields.adFeeRate);
    patched = replaceField(patched, 'requiredPurchaseBurdenRate', fields.requiredPurchaseBurdenRate);
    patched = replaceField(patched, 'differenceFranchiseFeeTotalM', fields.differenceFranchiseFeeTotalM);
    patched = replaceField(patched, 'recurringCostNote', fields.recurringCostNote);
    patched = replaceMetricRawValue(
      patched,
      '차액가맹금 총액',
      fields.differenceFranchiseFeeTotalM === undefined
        ? undefined
        : `${fields.differenceFranchiseFeeTotalM}백만원 (API 후보)`,
    );
    patched = replaceMetricRawValue(patched, '로열티/광고비/필수비용', formatRecurringMetricValue(fields));
  }

  const disclosureCandidate = disclosureRow?.candidates[0];
  if (disclosureCandidate && disclosureRow.candidateCount === 1) {
    patched = replaceField(patched, 'disclosureSourceUrl', disclosureCandidate.viewerUrl);
    patched = replaceMetricRawValue(
      patched,
      '정보공개서 기준연도/출처',
      replaceDisclosureCandidateInSourceMetric(patched, disclosureCandidate.disclosureSerial),
    );
  }

  return patched;
}

function replaceField(content: string, field: string, value: string | number | undefined): string {
  if (value === undefined) {
    return content;
  }

  return content.replace(new RegExp(`^- ${field}: .+$`, 'm'), `- ${field}: ${value}`);
}

function replaceMetricRawValue(content: string, metricLabel: string, value: string | undefined): string {
  if (!value) {
    return content;
  }

  const escapedLabel = metricLabel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return content.replace(new RegExp(`^\\| ${escapedLabel} \\| [^|]+ \\|`, 'm'), `| ${metricLabel} | ${value} |`);
}

function formatRecurringMetricValue(fields: P0FeeApiTemplateSuggestionRow['suggestedFields']): string | undefined {
  const parts: string[] = [];

  if (fields.recurringRoyaltyRate !== undefined) {
    parts.push(`royalty=${fields.recurringRoyaltyRate}`);
  }
  if (fields.adFeeRate !== undefined) {
    parts.push(`ad=${fields.adFeeRate}`);
  }
  if (fields.requiredPurchaseBurdenRate !== undefined) {
    parts.push(`requiredPurchase=${fields.requiredPurchaseBurdenRate}`);
  }

  return parts.length > 0 ? `${parts.join(', ')} (API 후보)` : undefined;
}

function hasSingleDisclosureCandidate(row: P0OfficialDisclosureFetchRow | undefined): boolean {
  return row?.candidateCount === 1 && row.candidates.length === 1;
}

function replaceDisclosureCandidateInSourceMetric(content: string, disclosureSerial: string): string | undefined {
  const match = content.match(/^\| 정보공개서 기준연도\/출처 \| ([^|]+) \|/m);
  const rawValue = match?.[1]?.trim();

  if (!rawValue) {
    return undefined;
  }

  return rawValue.replace('crossCheckSource=', `disclosureCandidate=${disclosureSerial}, crossCheckSource=`);
}
