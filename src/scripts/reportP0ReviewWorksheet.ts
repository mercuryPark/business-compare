import { brands } from '../domain/brands';
import { createP0ReviewWorksheet, formatP0ReviewWorksheet } from '../domain/p0ReviewWorksheet';

const worksheet = createP0ReviewWorksheet(brands);

console.log(formatP0ReviewWorksheet(worksheet));

if (worksheet.summary.rowsRequiringOriginalDisclosureReview > 0 || worksheet.summary.rowsMissingFeeFields > 0) {
  process.exitCode = 1;
}
