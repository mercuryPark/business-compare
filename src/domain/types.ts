export type BrandCategory = 'coffee' | 'lunchbox' | 'chicken' | 'dessert' | 'toast-burger';

export type Priority = 'P0' | 'P1' | 'P2';
export type Confidence = 'high' | 'medium' | 'low';
export type Freshness = 'current' | 'needs-update' | 'outdated';
export type Grade = 'A' | 'B' | 'C' | 'D' | 'E' | 'insufficient-data';
export type RiskLevel = 'good' | 'normal' | 'watch' | 'high' | 'insufficient-data';
export type FitLabel = '적합' | '조건부' | '주의' | '자료 부족';
export type VerificationStatus = 'unverified' | 'partial' | 'verified';
export type CostBasis = 'manual-assumption' | 'public-data' | 'official-disclosure';
export type TradeAreaScenarioStatus = 'structural-only' | 'estimated' | 'verified';
export type P0Metric =
  | 'startup-cost'
  | 'store-count-trend'
  | 'average-sales'
  | 'closure-contract'
  | 'margin-fee-total'
  | 'royalty-ad-required-cost'
  | 'disclosure-source';

export interface SourceRef {
  type: 'official-disclosure' | 'franchisor' | 'ftc' | 'public-data' | 'news' | 'review' | 'manual-assumption';
  title: string;
  url?: string;
  referenceYear?: number;
  capturedAt: string;
  confidence: Confidence;
}

export interface AuditState {
  p0Verified: boolean;
  verificationStatus: VerificationStatus;
  p0Checklist: P0ChecklistItem[];
  researcher: string;
  reviewer?: string;
  lastVerifiedAt?: string;
  nextReviewMonth: string;
  correctionStatus?: 'none' | 'under-review';
}

export interface P0ChecklistItem {
  metric: P0Metric;
  status: VerificationStatus;
  sourceCount: number;
  originalDisclosureChecked: boolean;
  crossChecked: boolean;
  note: string;
}

export interface CostData {
  startupTotalM: number;
  franchiseFeeM: number;
  trainingFeeM: number;
  depositM: number;
  interiorM: number;
  equipmentM: number;
  otherStartupM: number;
  recurringRoyaltyRate: number;
  adFeeRate: number;
  requiredPurchaseBurdenRate: number;
  differenceFranchiseFeeTotalM: number | null;
  recurringCostBasis: CostBasis;
  recurringCostNote: string;
  renewalReserveM: number;
}

export interface SalesData {
  averageAnnualSalesM: number;
  salesPerAreaM: number;
  regionalLowAnnualSalesM?: number;
  regionalHighAnnualSalesM?: number;
  averageSalesCaveat: string;
}

export interface StabilityData {
  currentStores: number;
  directStores: number;
  storeChange3y: number;
  openings3y: number;
  closures3y: number;
  terminations3y: number;
  expirations3y: number;
  ownershipTransfers3y?: number;
  averageOperatingYears?: number;
}

export interface LaborModel {
  baseM: number;
  salesRate: number;
}

export interface SimulatorDefaults {
  monthlySalesM: number;
  monthlyRentM: number;
  deliveryRatio: number;
  laborCostM: number;
  ownerLaborM: number;
  cogsRate: number;
  deliveryCommissionRate: number;
  deliveryAgencyRate: number;
  packagingRate: number;
  cardFeeRate: number;
  loanPrincipalM: number;
  annualInterestRate: number;
  loanYears: number;
  taxReserveRate: number;
  utilitiesM: number;
  otherOpexM: number;
}

export interface TradeAreaScenario {
  id: string;
  label: string;
  fitLabel: FitLabel;
  status: TradeAreaScenarioStatus;
  expectedNetProfitM: number | null;
  monthlyRentM: number | null;
  deliveryRatio: number | null;
  note: string;
}

export interface Brand {
  id: string;
  name: string;
  operator: string;
  category: BrandCategory;
  categoryLabel: string;
  launchYear: number;
  franchiseStartYear: number;
  fitLabel: FitLabel;
  oneLine: string;
  suitableFor: string;
  cautionFor: string;
  cost: CostData;
  sales: SalesData;
  stability: StabilityData;
  simulatorDefaults: SimulatorDefaults;
  laborModel: LaborModel;
  trendDriven: boolean;
  tradeAreaFit: string[];
  tradeAreaAvoid: string[];
  tradeAreaScenarios: TradeAreaScenario[];
  keyRisks: string[];
  sources: SourceRef[];
  audit: AuditState;
  freshness: Freshness;
}
