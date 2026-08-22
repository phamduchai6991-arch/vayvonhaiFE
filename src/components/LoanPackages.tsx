import React from 'react';
import { 
  BadgePercent, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles,
  ShieldCheck,
  Zap,
  Briefcase,
  TrendingUp,
  FileText
} from 'lucide-react';
import { LoanPackage } from '../types';
import { LOAN_PACKAGES } from '../data/constants';
import { formatVNDCompact } from '../utils/loanCalculator';

interface LoanPackagesProps {
  onSelectPackage: (pkg: LoanPackage) => void;
}

export const LoanPackages: React.FC<LoanPackagesProps> = ({ onSelectPackage }) => {
  return (
    <section id="packages" className="py-16 sm:py-20 bg-slate-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-emerald-200">
            <BadgePercent className="w-3.5 h-3.5 text-emerald-600" />
            100% Vay Tín Chấp - Không Thế Chấp
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Các Gói <span className="text-emerald-600">Vay Tín Chấp Lãi Suất Thấp</span> (6 - 36 Tháng)
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Giải ngân nhanh 2 - 24 giờ, thủ tục online đơn giản không cần thế chấp tài sản hay giữ giấy tờ gốc.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {LOAN_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`bg-white rounded-2xl p-6 border flex flex-col justify-between transition-all duration-200 hover:-translate-y-1 hover:shadow-xl ${
                pkg.isPopular
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg shadow-emerald-500/10 relative'
                  : 'border-slate-200 shadow-xs'
              }`}
            >
              {pkg.isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[11px] font-black uppercase px-3 py-0.5 rounded-full tracking-wider shadow-sm flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300" />
                  Được chọn nhiều nhất
                </div>
              )}

              <div>
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {pkg.badge}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    {pkg.disbursementTime}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mb-2">{pkg.name}</h3>

                {/* Rate */}
                <div className="bg-emerald-50/60 p-3 rounded-xl mb-4 border border-emerald-100">
                  <div className="text-xs text-slate-500">Lãi suất chỉ từ:</div>
                  <div className="text-xl font-black text-emerald-700">
                    {pkg.baseRate} {pkg.rateUnit}
                  </div>
                </div>

                {/* Limit & Term */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-4 pb-4 border-b border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hạn mức:</span>
                    <span className="font-bold text-slate-800">
                      {formatVNDCompact(pkg.minAmount)} - {formatVNDCompact(pkg.maxAmount)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Thời hạn:</span>
                    <span className="font-bold text-emerald-800">
                      {pkg.minTerm} - {pkg.maxTerm} tháng
                    </span>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-2 mb-6">
                  <div className="text-xs font-bold text-slate-700">Ưu điểm gói vay:</div>
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onSelectPackage(pkg)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  pkg.isPopular
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25'
                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}
              >
                <span>Chọn Gói &amp; Đăng Ký</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
