import { CalculationSummary, LoanCalculationParams, MonthlySchedule } from '../types';

/**
 * Formats a number to Vietnamese Dong currency display
 * e.g., 500000000 -> 500.000.000 đ
 */
export function formatVND(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 đ';
  return new Intl.NumberFormat('vi-VN').format(Math.round(amount)) + ' đ';
}

/**
 * Formats VND with compact unit for easy reading (triệu, tỷ)
 * e.g. 50000000 -> 50 triệu, 1500000000 -> 1.5 tỷ
 */
export function formatVNDCompact(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 đ';
  if (amount >= 1_000_000_000) {
    const ty = amount / 1_000_000_000;
    return `${Number.isInteger(ty) ? ty : ty.toFixed(1).replace(/\.0$/, '')} tỷ`;
  }
  if (amount >= 1_000_000) {
    const trieu = amount / 1_000_000;
    return `${Number.isInteger(trieu) ? trieu : trieu.toFixed(1).replace(/\.0$/, '')} triệu`;
  }
  return formatVND(amount);
}

/**
 * Calculate loan amortization schedule according to Reducing Balance (Dư nợ giảm dần)
 * - Monthly principal = Loan Amount / Term in months
 * - Monthly interest = Remaining beginning balance * (Annual rate / 12 / 100)
 * - Total payment = Monthly principal + Monthly interest
 */
export function calculateReducingSchedule(params: LoanCalculationParams): {
  schedule: MonthlySchedule[];
  summary: CalculationSummary;
} {
  const { amount, termMonths, annualInterestRate } = params;
  const schedule: MonthlySchedule[] = [];
  
  if (termMonths <= 0 || amount <= 0) {
    return {
      schedule: [],
      summary: {
        totalPrincipal: 0,
        totalInterest: 0,
        totalPayment: 0,
        firstMonthPayment: 0,
        lastMonthPayment: 0,
        avgMonthlyPayment: 0,
        monthlyPrincipal: 0,
      },
    };
  }

  const monthlyPrincipal = amount / termMonths;
  const monthlyRate = annualInterestRate / 100 / 12;

  let currentBalance = amount;
  let totalInterest = 0;

  for (let month = 1; month <= termMonths; month++) {
    const beginningBalance = currentBalance;
    const interestPayment = beginningBalance * monthlyRate;
    
    // For the last month, ensure exact matching of remaining principal
    const principalPayment = month === termMonths ? currentBalance : monthlyPrincipal;
    const totalMonthlyPayment = principalPayment + interestPayment;
    const endingBalance = Math.max(0, beginningBalance - principalPayment);

    totalInterest += interestPayment;
    currentBalance = endingBalance;

    schedule.push({
      month,
      beginningBalance,
      principalPayment,
      interestPayment,
      totalMonthlyPayment,
      endingBalance,
    });
  }

  const firstMonthPayment = schedule.length > 0 ? schedule[0].totalMonthlyPayment : 0;
  const lastMonthPayment = schedule.length > 0 ? schedule[schedule.length - 1].totalMonthlyPayment : 0;
  const totalPayment = amount + totalInterest;
  const avgMonthlyPayment = totalPayment / termMonths;

  return {
    schedule,
    summary: {
      totalPrincipal: amount,
      totalInterest,
      totalPayment,
      firstMonthPayment,
      lastMonthPayment,
      avgMonthlyPayment,
      monthlyPrincipal,
    },
  };
}

/**
 * Calculate flat interest schedule (Lãi cố định trên nợ gốc) for comparison
 */
export function calculateFlatSchedule(params: LoanCalculationParams): {
  schedule: MonthlySchedule[];
  summary: CalculationSummary;
} {
  const { amount, termMonths, annualInterestRate } = params;
  const schedule: MonthlySchedule[] = [];

  if (termMonths <= 0 || amount <= 0) {
    return {
      schedule: [],
      summary: {
        totalPrincipal: 0,
        totalInterest: 0,
        totalPayment: 0,
        firstMonthPayment: 0,
        lastMonthPayment: 0,
        avgMonthlyPayment: 0,
        monthlyPrincipal: 0,
      },
    };
  }

  const monthlyPrincipal = amount / termMonths;
  const monthlyInterest = (amount * (annualInterestRate / 100)) / 12;
  const totalMonthlyPayment = monthlyPrincipal + monthlyInterest;
  const totalInterest = monthlyInterest * termMonths;

  let currentBalance = amount;

  for (let month = 1; month <= termMonths; month++) {
    const beginningBalance = currentBalance;
    const principalPayment = month === termMonths ? currentBalance : monthlyPrincipal;
    const endingBalance = Math.max(0, beginningBalance - principalPayment);
    currentBalance = endingBalance;

    schedule.push({
      month,
      beginningBalance,
      principalPayment,
      interestPayment: monthlyInterest,
      totalMonthlyPayment: principalPayment + monthlyInterest,
      endingBalance,
    });
  }

  return {
    schedule,
    summary: {
      totalPrincipal: amount,
      totalInterest,
      totalPayment: amount + totalInterest,
      firstMonthPayment: totalMonthlyPayment,
      lastMonthPayment: totalMonthlyPayment,
      avgMonthlyPayment: totalMonthlyPayment,
      monthlyPrincipal,
    },
  };
}
