import type { Brand, Grade } from './types';
import { calculateBrandScore } from './scoring';

export interface ScoreAuditBrand {
  brandId: string;
  brandName: string;
  categoryLabel: string;
  grade: Grade;
  label: string;
  referenceOnly: boolean;
  blockers: string[];
}

export interface ScoreAuditReport {
  readyForAbsoluteGrades: boolean;
  summary: {
    totalBrands: number;
    absoluteGradeBrands: number;
    referenceOnlyBrands: number;
  };
  brands: ScoreAuditBrand[];
}

export function auditScoreReadiness(brands: Brand[]): ScoreAuditReport {
  const brandAudits = brands.map((brand) => {
    const score = calculateBrandScore(brand, { benchmarkBrands: brands });
    const referenceOnly = score.grade === 'insufficient-data';

    return {
      brandId: brand.id,
      brandName: brand.name,
      categoryLabel: brand.categoryLabel,
      grade: score.grade,
      label: score.grade === 'insufficient-data' ? '자료 부족' : `${score.grade} 등급`,
      referenceOnly,
      blockers: score.drivers,
    };
  });
  const absoluteGradeBrands = brandAudits.filter((brand) => !brand.referenceOnly).length;

  return {
    readyForAbsoluteGrades: absoluteGradeBrands === brandAudits.length,
    summary: {
      totalBrands: brandAudits.length,
      absoluteGradeBrands,
      referenceOnlyBrands: brandAudits.length - absoluteGradeBrands,
    },
    brands: brandAudits,
  };
}

export function formatScoreAuditReport(report: ScoreAuditReport): string {
  const lines = [
    `Score audit: ${report.readyForAbsoluteGrades ? 'ABSOLUTE_GRADES_READY' : 'REFERENCE_ONLY'}`,
    `Absolute grades: ${report.summary.absoluteGradeBrands}/${report.summary.totalBrands}`,
    '',
  ];

  for (const brand of report.brands) {
    lines.push(`- ${brand.brandId} ${brand.brandName}: ${brand.label}`);
    if (brand.blockers.length > 0) {
      lines.push(`  Blockers: ${brand.blockers.join(', ')}`);
    }
  }

  return lines.join('\n');
}
