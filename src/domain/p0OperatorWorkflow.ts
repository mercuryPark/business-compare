import type { P0DataReplacementGapReport } from './p0DataGaps';
import { isP0ServiceKeyConfigured } from './p0ServiceKey';

export interface P0OperatorTemplateImportSummary {
  totalBrandFiles: number;
  importableRecords: number;
}

export interface P0OperatorWorkflowInput {
  serviceKey?: string;
  dataGapReport: P0DataReplacementGapReport;
  templateImportSummary: P0OperatorTemplateImportSummary;
}

export interface P0OperatorWorkflowStep {
  label: string;
  status: 'ready' | 'blocked';
  command: string;
  next: string;
}

export interface P0OperatorWorkflowReport {
  readyForPromotion: boolean;
  serviceKeyConfigured: boolean;
  templateImportSummary: P0OperatorTemplateImportSummary;
  replacementSummary: {
    totalBrands: number;
    replaceableBrands: number;
  };
  steps: P0OperatorWorkflowStep[];
}

export function buildP0OperatorWorkflowReport(input: P0OperatorWorkflowInput): P0OperatorWorkflowReport {
  const serviceKeyConfigured = isP0ServiceKeyConfigured(input.serviceKey);
  const templatesImportable =
    input.templateImportSummary.totalBrandFiles > 0 &&
    input.templateImportSummary.importableRecords === input.templateImportSummary.totalBrandFiles;
  const readyForPromotion = input.dataGapReport.readyForReplacement && templatesImportable;

  return {
    readyForPromotion,
    serviceKeyConfigured,
    templateImportSummary: input.templateImportSummary,
    replacementSummary: {
      totalBrands: input.dataGapReport.summary.totalBrands,
      replaceableBrands: input.dataGapReport.summary.replaceableBrands,
    },
    steps: [
      {
        label: 'Configure fee API key',
        status: serviceKeyConfigured ? 'ready' : 'blocked',
        command: 'export DATA_GO_KR_SERVICE_KEY=...',
        next: serviceKeyConfigured ? 'FTC 원문 공개본 조회 가능' : '공공데이터포털 서비스키 설정',
      },
      {
        label: 'Locate official disclosures',
        status: serviceKeyConfigured ? 'ready' : 'blocked',
        command: 'npm run report:p0-disclosure-api',
        next: serviceKeyConfigured ? '공개본 목록에서 브랜드별 정보공개서 후보 수집' : '서비스키 설정 후 재실행',
      },
      {
        label: 'Fetch official disclosure candidates',
        status: serviceKeyConfigured ? 'ready' : 'blocked',
        command: 'npm run fetch:p0-disclosure-api',
        next: serviceKeyConfigured ? '후보 viewer URL handoff 파일 생성' : '서비스키 설정 후 재실행',
      },
      {
        label: 'Generate disclosure candidate handoff',
        status: serviceKeyConfigured ? 'ready' : 'blocked',
        command: 'npm run generate:p0-disclosure-candidates',
        next: serviceKeyConfigured ? '후보 viewer URL을 FTC 원문과 대조' : '서비스키 설정 후 재실행',
      },
      {
        label: 'Fetch fee evidence',
        status: serviceKeyConfigured ? 'ready' : 'blocked',
        command: 'npm run fetch:p0-fee-evidence',
        next: serviceKeyConfigured ? 'API 반환 브랜드명과 후보 수수료 확인' : '서비스키 설정 후 재실행',
      },
      {
        label: 'Generate review preview',
        status: serviceKeyConfigured ? 'ready' : 'blocked',
        command: 'npm run generate:p0-template-preview',
        next: serviceKeyConfigured ? 'preview 값을 FTC 원문과 대조' : '서비스키 설정 후 재실행',
      },
      {
        label: 'Complete manual review templates',
        status: templatesImportable ? 'ready' : 'blocked',
        command: 'npm run report:p0-template-import',
        next: templatesImportable ? '수동 검토 기록 import 가능' : 'FTC 원문 URL, reviewer, 원문 확인 체크 작성',
      },
      {
        label: 'Promote verified data',
        status: readyForPromotion ? 'ready' : 'blocked',
        command: 'npm run report:p0-promotion',
        next: readyForPromotion ? '검증 데이터로 브랜드 파일 교체 가능' : '수동 검토 기록 완료 후 승격 게이트 재실행',
      },
    ],
  };
}

export function formatP0OperatorWorkflowReport(report: P0OperatorWorkflowReport): string {
  const lines = [
    `P0 operator workflow: ${report.readyForPromotion ? 'READY' : 'BLOCKED'}`,
    `DATA_GO_KR_SERVICE_KEY: ${report.serviceKeyConfigured ? 'SET' : 'MISSING'}`,
    `Template import: ${report.templateImportSummary.importableRecords}/${report.templateImportSummary.totalBrandFiles} importable`,
    `Replacement: ${report.replacementSummary.replaceableBrands}/${report.replacementSummary.totalBrands} replaceable`,
    '',
  ];

  report.steps.forEach((step, index) => {
    lines.push(`${index + 1}. ${step.label}: ${step.status.toUpperCase()}`);
    lines.push(`   Command: ${step.command}`);
    lines.push(`   Next: ${step.next}`);
  });

  return lines.join('\n');
}
