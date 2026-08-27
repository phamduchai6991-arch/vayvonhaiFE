import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingDown, 
  Table, 
  Calendar, 
  DollarSign, 
  Percent, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  FileSpreadsheet,
  Printer,
  ShieldCheck
} from 'lucide-react';
import { CalculationMethod } from '../types';
import { calculateReducingSchedule, calculateFlatSchedule, formatVND, formatVNDCompact } from '../utils/loanCalculator';
import { recordCalculationRun } from '../services/analyticsService';

interface LoanCalculatorProps {
  onApplyLoan: (amount: number, termMonths: number, method: CalculationMethod) => void;
}

const PRESET_AMOUNTS = [
  { label: '3 triệu', value: 3_000_000 },
  { label: '5 triệu', value: 5_000_000 },
  { label: '10 triệu', value: 10_000_000 },
  { label: '20 triệu', value: 20_000_000 },
  { label: '30 triệu', value: 30_000_000 },
  { label: '50 triệu', value: 50_000_000 },
  { label: '70 triệu', value: 70_000_000 },
  { label: '100 triệu', value: 100_000_000 },
];

const PRESET_TERMS = [
  { label: '6 tháng', value: 6 },
  { label: '9 tháng', value: 9 },
  { label: '12 tháng (1 năm)', value: 12 },
  { label: '18 tháng', value: 18 },
  { label: '24 tháng (2 năm)', value: 24 },
  { label: '30 tháng', value: 30 },
  { label: '36 tháng (3 năm)', value: 36 },
];

const PRESET_RATES = [
  { label: '28%/năm (Ưu đãi)', value: 28 },
  { label: '35%/năm (Tiêu chuẩn)', value: 35 },
  { label: '45%/năm (Linh hoạt)', value: 45 },
  { label: '55%/năm (Nhanh 24h)', value: 55 },
  { label: '70%/năm (Tối đa)', value: 70 },
];

export const LoanCalculator: React.FC<LoanCalculatorProps> = ({ onApplyLoan }) => {
  // Calculator state: default 50M, 24 months, 28% - 70% annual rate
  const [amount, setAmount] = useState<number>(50_000_000);
  const [termMonths, setTermMonths] = useState<number>(24);
  const [annualRate, setAnnualRate] = useState<number>(35);
  const [method, setMethod] = useState<CalculationMethod>('reducing');
  const [scheduleSearchMonth, setScheduleSearchMonth] = useState<string>('');

  // Calculations
  const calcResult = useMemo(() => {
    const params = {
      amount,
      termMonths,
      annualInterestRate: annualRate,
      method,
    };
    return method === 'reducing'
      ? calculateReducingSchedule(params)
      : calculateFlatSchedule(params);
  }, [amount, termMonths, annualRate, method]);

  // Comparison with flat method
  const comparisonResult = useMemo(() => {
    const flatRes = calculateFlatSchedule({
      amount,
      termMonths,
      annualInterestRate: annualRate,
      method: 'flat',
    });
    const reducingRes = calculateReducingSchedule({
      amount,
      termMonths,
      annualInterestRate: annualRate,
      method: 'reducing',
    });
    const difference = flatRes.summary.totalInterest - reducingRes.summary.totalInterest;
    return {
      flatTotalInterest: flatRes.summary.totalInterest,
      reducingTotalInterest: reducingRes.summary.totalInterest,
      interestSaved: Math.max(0, difference),
    };
  }, [amount, termMonths, annualRate]);

  // Filtered schedule for display (since term is max 36 months, we can show all cleanly)
  const displayedSchedule = useMemo(() => {
    let list = calcResult.schedule;
    if (scheduleSearchMonth.trim()) {
      const target = parseInt(scheduleSearchMonth.trim(), 10);
      if (!isNaN(target)) {
        list = list.filter((item) => item.month === target);
      }
    }
    return list;
  }, [calcResult.schedule, scheduleSearchMonth]);

  // Handle amount manual input
  const handleAmountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\D/g, '');
    const num = rawVal ? Math.min(100_000_000, Math.max(0, parseInt(rawVal, 10))) : 0;
    setAmount(num);
  };

  // Export / Print schedule
  const handlePrintSchedule = () => {
    window.print();
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Ky_Thang,Du_No_Dau_Ky,Goc_Tra_Hang_Thang,Lai_Tra_Hang_Thang,Tong_Tra_Hang_Thang,Du_No_Cuoi_Ky\n';
    const rows = calcResult.schedule
      .map(
        (s) =>
          `${s.month},${Math.round(s.beginningBalance)},${Math.round(s.principalPayment)},${Math.round(
            s.interestPayment
          )},${Math.round(s.totalMonthlyPayment)},${Math.round(s.endingBalance)}`
      )
      .join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(headers + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `Lich_tra_no_tin_chap_${amount / 1_000_000}tr_${termMonths}thang.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  const monthlyRateFormatted = (annualRate / 12).toFixed(2);

  return (
    <section id="calculator" className="py-16 sm:py-20 bg-slate-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-emerald-200">
            <Calculator className="w-3.5 h-3.5 text-emerald-700" />
            Vay Tín Chấp Không Thế Chấp
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Tính Lãi Suất <span className="text-emerald-600">Vay Tín Chấp Dư Nợ Giảm Dần</span> (6 - 36 Tháng)
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Xem chính xác số tiền gốc, tiền lãi và tổng số tiền phải trả mỗi tháng theo chuẩn ngân hàng. 
            Thời hạn vay linh hoạt từ <strong>6 đến 36 tháng</strong>, không cần thế chấp tài sản.
          </p>
        </div>

        {/* Calculation Mode Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/80 p-1.5 rounded-xl inline-flex gap-1.5 max-w-md w-full">
            <button
              onClick={() => setMethod('reducing')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                method === 'reducing'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-white/60'
              }`}
            >
              <TrendingDown className="w-4 h-4" />
              <span>Dư Nợ Giảm Dần (Chuẩn)</span>
            </button>
            <button
              onClick={() => setMethod('flat')}
              className={`flex-1 py-2.5 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                method === 'flat'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'text-slate-700 hover:text-emerald-700 hover:bg-white/60'
              }`}
            >
              <DollarSign className="w-4 h-4" />
              <span>Lãi Cố Định Trên Nợ Gốc</span>
            </button>
          </div>
        </div>

        {/* Main 2-Column Calculator Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Sliders & Controls */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-emerald-100 shadow-lg shadow-emerald-900/5 space-y-7">
            
            {/* Input 1: Loan Amount */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  <span>Số tiền cần vay tín chấp (3 đến 100 triệu):</span>
                </label>
                <div className="flex items-center gap-1 text-base sm:text-lg font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  <input
                    type="text"
                    value={amount ? new Intl.NumberFormat('vi-VN').format(amount) : ''}
                    onChange={handleAmountInputChange}
                    className="w-36 text-right font-black text-emerald-800 bg-transparent focus:outline-hidden"
                  />
                  <span>đ</span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={3_000_000}
                max={100_000_000}
                step={1_000_000}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />

              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>3 triệu</span>
                <span>20 triệu</span>
                <span>50 triệu</span>
                <span>100 triệu</span>
              </div>

              {/* Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_AMOUNTS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setAmount(preset.value)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium border transition-colors ${
                      amount === preset.value
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Loan Term (6 - 36 Months) */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" />
                  <span>Thời hạn vay (6 đến 36 tháng):</span>
                </label>
                <div className="text-base sm:text-lg font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  {termMonths} tháng{' '}
                  <span className="text-xs font-semibold text-slate-500">
                    ({(termMonths / 12).toFixed(1).replace(/\.0$/, '')} năm)
                  </span>
                </div>
              </div>

              {/* Slider 6 to 36 months */}
              <input
                type="range"
                min={6}
                max={36}
                step={3}
                value={termMonths}
                onChange={(e) => setTermMonths(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />

              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>6 tháng (Nửa năm)</span>
                <span>12 tháng (1 năm)</span>
                <span>24 tháng (2 năm)</span>
                <span>36 tháng (3 năm)</span>
              </div>

              {/* Presets 6 - 36 months */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_TERMS.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setTermMonths(preset.value)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium border transition-colors ${
                      termMonths === preset.value
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 3: Interest Rate (28% to 70% per year) */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center">
                <div>
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <Percent className="w-4 h-4 text-emerald-600" />
                    <span>Lãi suất vay theo năm (28% - 70%):</span>
                  </label>
                  <span className="text-xs text-slate-500">
                    (Tương đương ~{monthlyRateFormatted}%/tháng)
                  </span>
                </div>
                <div className="flex items-center gap-1 text-base sm:text-lg font-black text-emerald-800 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                  <input
                    type="number"
                    step="0.5"
                    min="28"
                    max="70"
                    value={annualRate}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value);
                      setAnnualRate(isNaN(val) ? 28 : Math.min(70, Math.max(28, val)));
                    }}
                    className="w-16 text-right font-black text-emerald-800 bg-transparent focus:outline-hidden"
                  />
                  <span>%/năm</span>
                </div>
              </div>

              {/* Slider 28% - 70% */}
              <input
                type="range"
                min={28}
                max={70}
                step={0.5}
                value={annualRate}
                onChange={(e) => setAnnualRate(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
              />

              <div className="flex justify-between text-[11px] font-medium text-slate-400">
                <span>28% (Ưu đãi)</span>
                <span>35% (Tiêu chuẩn)</span>
                <span>45%</span>
                <span>55%</span>
                <span>70% (Tối đa)</span>
              </div>

              {/* Quick Rate Presets */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {PRESET_RATES.map((preset) => (
                  <button
                    key={preset.value}
                    onClick={() => setAnnualRate(preset.value)}
                    className={`px-2.5 py-1 text-xs rounded-md font-medium border transition-colors cursor-pointer ${
                      annualRate === preset.value
                        ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Explanatory Note on Reducing Balance */}
            <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-1">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Info className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>
                  {method === 'reducing'
                    ? 'Nguyên lý Dư Nợ Giảm Dần trong Vay Tín Chấp:'
                    : 'Nguyên lý Lãi Cố Định Trên Nợ Gốc:'}
                </span>
              </div>
              <p className="leading-relaxed">
                {method === 'reducing'
                  ? 'Gốc được chia đều trả trong 6 - 36 tháng. Tiền lãi chỉ tính trên số dư nợ gốc thực tế còn lại sau mỗi tháng. Càng về các tháng sau, tiền lãi càng giảm đáng kể.'
                  : 'Tiền lãi mỗi tháng được tính cố định trên 100% số tiền vay ban đầu trong suốt thời hạn vay.'}
              </p>
            </div>

          </div>

          {/* Column 2: Result Summary Card (Deep Emerald Gradient) */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-950 text-white rounded-2xl p-6 sm:p-7 shadow-xl shadow-emerald-950/20 relative overflow-hidden">
              
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-semibold text-emerald-200 uppercase tracking-wider">
                    Kết quả vay tín chấp ({method === 'reducing' ? 'Dư nợ giảm dần' : 'Lãi cố định'})
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-white mt-1">
                    {formatVND(calcResult.summary.firstMonthPayment)}
                  </div>
                  <div className="text-xs text-emerald-300">
                    {method === 'reducing' ? 'Số tiền trả tháng đầu tiên (Cao nhất)' : 'Số tiền trả đều mỗi tháng'}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/10 text-amber-300 border border-white/10">
                  <Calculator className="w-6 h-6" />
                </div>
              </div>

              {/* Key breakdown metrics */}
              <div className="space-y-3 pt-4 border-t border-emerald-700/60 text-sm">
                
                {method === 'reducing' && (
                  <div className="flex justify-between items-center">
                    <span className="text-emerald-200 text-xs sm:text-sm">Số tiền trả tháng {termMonths} (Tháng cuối):</span>
                    <span className="font-bold text-teal-200 text-sm sm:text-base">
                      {formatVND(calcResult.summary.lastMonthPayment)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-emerald-200 text-xs sm:text-sm">Tiền gốc trả hàng tháng:</span>
                  <span className="font-bold text-white">
                    {formatVND(calcResult.summary.monthlyPrincipal)}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-emerald-200 text-xs sm:text-sm">Tổng tiền lãi phải trả ({termMonths} tháng):</span>
                  <span className="font-bold text-amber-300 text-sm sm:text-base">
                    {formatVND(calcResult.summary.totalInterest)}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-emerald-700/40">
                  <span className="text-emerald-100 font-semibold text-xs sm:text-sm">Tổng số tiền gốc + lãi:</span>
                  <span className="font-black text-white text-base sm:text-lg">
                    {formatVND(calcResult.summary.totalPayment)}
                  </span>
                </div>
              </div>

              {/* Visual Principal vs Interest Ratio */}
              <div className="mt-6 pt-4 border-t border-emerald-700/60">
                <div className="flex justify-between text-xs text-emerald-200 mb-1.5 font-medium">
                  <span>Gốc: {Math.round((amount / (calcResult.summary.totalPayment || 1)) * 100)}%</span>
                  <span>Lãi: {Math.round((calcResult.summary.totalInterest / (calcResult.summary.totalPayment || 1)) * 100)}%</span>
                </div>
                <div className="w-full h-3 bg-emerald-950/80 rounded-full overflow-hidden flex border border-emerald-700/50">
                  <div 
                    className="bg-emerald-400 h-full"
                    style={{ width: `${(amount / (calcResult.summary.totalPayment || 1)) * 100}%` }}
                    title={`Tiền gốc: ${formatVND(amount)}`}
                  />
                  <div 
                    className="bg-amber-400 h-full"
                    style={{ width: `${(calcResult.summary.totalInterest / (calcResult.summary.totalPayment || 1)) * 100}%` }}
                    title={`Tiền lãi: ${formatVND(calcResult.summary.totalInterest)}`}
                  />
                </div>
              </div>

              {/* Saving comparison alert */}
              {method === 'reducing' && comparisonResult.interestSaved > 0 && (
                <div className="mt-5 p-3 rounded-xl bg-emerald-500/30 border border-emerald-400/40 text-xs text-emerald-100 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
                  <span>
                    Dư nợ giảm dần giúp bạn tiết kiệm{' '}
                    <strong className="text-amber-300 font-bold">
                      {formatVND(comparisonResult.interestSaved)}
                    </strong>{' '}
                    tiền lãi so với cách tính lãi phẳng!
                  </span>
                </div>
              )}

              {/* CTA Button to Form */}
              <button
                onClick={() => {
                  recordCalculationRun();
                  onApplyLoan(amount, termMonths, method);
                }}
                className="mt-6 w-full py-3.5 px-5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-black text-sm sm:text-base shadow-lg shadow-amber-400/25 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Đăng Ký Vay Tín Chấp Với Thông Số Này</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

            </div>

            {/* Quick Consultation Badge */}
            <div className="bg-white rounded-xl p-4 border border-emerald-100 shadow-xs flex items-center justify-between text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-800">100% Không cần thế chấp tài sản</span>
              </div>
              <span className="text-emerald-700 font-bold">Duyệt nhanh 24h</span>
            </div>
          </div>

        </div>

        {/* Amortization Schedule Table */}
        <div className="mt-12 bg-white rounded-2xl p-6 sm:p-8 border border-emerald-100 shadow-md">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-100">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                <Table className="w-5 h-5 text-emerald-600" />
                <span>Bảng Lịch Trả Nợ Tín Chấp ({termMonths} Tháng)</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Khoản vay: <strong>{formatVNDCompact(amount)}</strong> | Thời hạn:{' '}
                <strong>{termMonths} tháng</strong> | Lãi suất: <strong>{annualRate}%/năm</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-44">
                <input
                  type="number"
                  placeholder="Tìm kỳ tháng..."
                  min="1"
                  max={termMonths}
                  value={scheduleSearchMonth}
                  onChange={(e) => setScheduleSearchMonth(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500"
                />
              </div>

              <button
                onClick={handleExportCSV}
                className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                title="Tải bảng tính Excel CSV"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                <span>Xuất Excel</span>
              </button>

              <button
                onClick={handlePrintSchedule}
                className="px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
                title="In bảng lịch trả nợ"
              >
                <Printer className="w-3.5 h-3.5 text-emerald-600" />
                <span>In lịch</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto mt-4 max-h-[480px] overflow-y-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="sticky top-0 bg-emerald-50/95 text-emerald-950 font-bold uppercase tracking-wider text-[11px] border-b border-emerald-100 backdrop-blur-xs">
                <tr>
                  <th className="py-3 px-3.5 text-center">Kỳ (Tháng)</th>
                  <th className="py-3 px-3.5 text-right">Dư nợ đầu kỳ</th>
                  <th className="py-3 px-3.5 text-right">Tiền gốc trả</th>
                  <th className="py-3 px-3.5 text-right">Tiền lãi trả</th>
                  <th className="py-3 px-3.5 text-right font-black text-emerald-900">Tổng trả hàng tháng</th>
                  <th className="py-3 px-3.5 text-right">Dư nợ cuối kỳ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {displayedSchedule.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Không tìm thấy kỳ trả nợ phù hợp.
                    </td>
                  </tr>
                ) : (
                  displayedSchedule.map((item) => (
                    <tr key={item.month} className="hover:bg-emerald-50/50 transition-colors">
                      <td className="py-3 px-3.5 text-center font-bold text-slate-900 bg-slate-50/50">
                        Tháng {item.month}
                      </td>
                      <td className="py-3 px-3.5 text-right text-slate-600">
                        {formatVND(item.beginningBalance)}
                      </td>
                      <td className="py-3 px-3.5 text-right text-slate-800 font-semibold">
                        {formatVND(item.principalPayment)}
                      </td>
                      <td className="py-3 px-3.5 text-right text-amber-700 font-semibold">
                        {formatVND(item.interestPayment)}
                      </td>
                      <td className="py-3 px-3.5 text-right font-bold text-emerald-800 bg-emerald-50/40">
                        {formatVND(item.totalMonthlyPayment)}
                      </td>
                      <td className="py-3 px-3.5 text-right text-slate-500">
                        {formatVND(item.endingBalance)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </section>
  );
};
