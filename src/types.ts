export type LoanPurpose =
  | 'tin_chap_tieu_dung'
  | 'tin_chap_theo_luong'
  | 'tin_chap_kinh_doanh'
  | 'tin_chap_online_nhanh'
  | 'tin_chap_bao_hiem_dien_nuoc'
  | 'khac';

export type LeadStatus = 'new' | 'contacted' | 'approved' | 'rejected';

export interface Lead {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  loanAmount: number; // in VND
  loanTenure: number; // in months (6 - 36 months)
  loanPurpose: LoanPurpose;
  loanPurposeName?: string;
  employmentType?: string;
  occupation?: string;
  monthlyIncome?: number; // in VND
  preferredContactTime?: string;
  note?: string;
  notes?: string;
  createdAt: string; // ISO string or formatted string
  status: LeadStatus;
  adminNote?: string;
  source?: string;
}

export type CalculationMethod = 'reducing' | 'flat';

export interface LoanCalculationParams {
  amount: number; // VND
  termMonths: number;
  annualInterestRate: number; // percentage, e.g., 9.5
  method: CalculationMethod;
}

export interface MonthlySchedule {
  month: number;
  beginningBalance: number;
  principalPayment: number;
  interestPayment: number;
  totalMonthlyPayment: number;
  endingBalance: number;
}

export interface CalculationSummary {
  totalPrincipal: number;
  totalInterest: number;
  totalPayment: number;
  firstMonthPayment: number;
  lastMonthPayment: number;
  avgMonthlyPayment: number;
  monthlyPrincipal: number;
}

export type ArticleCategory = 'tips' | 'news' | 'guide' | 'policy';

export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string[];
  category: ArticleCategory;
  categoryName: string;
  readTime: string;
  publishedDate: string;
  author: string;
  coverImage: string;
  tags: string[];
  featured?: boolean;
  sourceUrl?: string;
  sourceName?: string;
  isAutomated?: boolean;
}

export interface LoanPackage {
  id: string;
  name: string;
  badge: string;
  minAmount: number;
  maxAmount: number;
  minTerm: number; // e.g., 6
  maxTerm: number; // e.g., 36
  baseRate: number; // %/year or %/month
  rateUnit: string;
  disbursementTime: string;
  requirements: string[];
  features: string[];
  isPopular?: boolean;
  purposeValue: LoanPurpose;
}
