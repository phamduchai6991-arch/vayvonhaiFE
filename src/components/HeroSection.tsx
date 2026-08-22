import React from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  BadgePercent, 
  ArrowRight,
  TrendingDown
} from 'lucide-react';

interface HeroSectionProps {
  onScrollToCalculator: () => void;
  onScrollToForm: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onScrollToCalculator,
  onScrollToForm
}) => {
  return (
    <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 pt-10 pb-16 lg:pt-14 lg:pb-24 border-b border-emerald-100/60">
      {/* Decorative subtle background elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Value Proposition & Hero Headline */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-100/90 border border-emerald-200 px-3.5 py-1.5 rounded-full text-emerald-900 text-xs sm:text-sm font-semibold shadow-xs">
              <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '8s' }} />
              <span>Chuyên Tư Vấn Vay Tín Chấp Không Cần Thế Chấp</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-[1.2]">
              Tư Vấn Vay Tín Chấp &amp; Tính Lãi{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600">
                Dư Nợ Giảm Dần
              </span>{' '}
              (6 - 36 Tháng)
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              <strong>100% không thế chấp tài sản</strong>, không giữ giấy tờ gốc. 
              Hạn mức vay từ <strong className="text-emerald-700 font-bold">3 triệu đến 100 triệu</strong>, 
              kỳ hạn trả góp linh hoạt từ <strong>6 đến 36 tháng</strong>, 
              lãi suất ưu đãi chỉ từ <strong className="text-emerald-700 font-bold">0.6%/tháng</strong>. 
              Tư vấn hoàn toàn <strong>miễn phí 100%</strong>, duyệt hạn mức nhanh trong 2 - 24 giờ.
            </p>

            {/* Core Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-emerald-100 shadow-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800">Không thế chấp</div>
                  <div className="text-[11px] text-slate-500">Chỉ cần CCCD / Lương</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-emerald-100 shadow-xs">
                <BadgePercent className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800">Từ 0.6%/tháng</div>
                  <div className="text-[11px] text-slate-500">Dư nợ giảm dần</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-emerald-100 shadow-xs">
                <Zap className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800">Duyệt 2 - 24H</div>
                  <div className="text-[11px] text-slate-500">Giải ngân cấp tốc</div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white border border-emerald-100 shadow-xs">
                <Clock className="w-5 h-5 text-teal-600 shrink-0" />
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800">Kỳ hạn 6-36th</div>
                  <div className="text-[11px] text-slate-500">Trả góp linh hoạt</div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onScrollToForm}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/35 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>Đăng Ký Vay Tín Chấp Ngay</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onScrollToCalculator}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-emerald-50 border-2 border-emerald-200 hover:border-emerald-400 text-emerald-800 font-bold text-base shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calculator className="w-5 h-5 text-emerald-600" />
                <span>Tính Lịch Trả Nợ 6 - 36 Tháng</span>
              </button>
            </div>

            {/* Guarantee Note */}
            <p className="text-xs text-slate-500 flex items-center justify-center lg:justify-start gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Cam kết <strong>không thu phí trước</strong>, bảo mật thông tin khoản vay tuyệt đối</span>
            </p>
          </div>

          {/* Right Column: Interactive Quick Calculation Card Preview */}
          <div className="lg:col-span-5">
            <div className="relative bg-white rounded-2xl p-6 sm:p-7 border border-emerald-100 shadow-xl shadow-emerald-950/5">
              
              {/* Top Card Header */}
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
                    <TrendingDown className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-800">Mô Phỏng Vay Tín Chấp</h2>
                    <p className="text-xs text-slate-500">Dư nợ giảm dần chuẩn 24 tháng</p>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full">
                  100% Không thế chấp
                </span>
              </div>

              {/* Sample Calculation Breakdown */}
              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl space-y-2 border border-slate-100">
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Số tiền vay tín chấp mẫu:</span>
                    <span className="font-bold text-slate-800">50.000.000 đ</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Thời hạn vay trả góp:</span>
                    <span className="font-bold text-emerald-800">24 tháng (2 năm)</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Lãi suất áp dụng:</span>
                    <span className="font-bold text-emerald-700">9.6%/năm (~0.8%/tháng)</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-emerald-50/90 border border-emerald-100">
                    <div className="text-[11px] font-medium text-emerald-900 mb-1">Tháng đầu tiên trả:</div>
                    <div className="text-base sm:text-lg font-black text-emerald-950">2.483.333 đ</div>
                    <div className="text-[10px] text-emerald-700 mt-0.5">Gốc: 2.083.333đ + Lãi 400.000đ</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-teal-50/90 border border-teal-100">
                    <div className="text-[11px] font-medium text-teal-900 mb-1">Tháng 24 (Tháng cuối):</div>
                    <div className="text-base sm:text-lg font-black text-teal-950">2.100.000 đ</div>
                    <div className="text-[10px] text-teal-700 mt-0.5">Tiền lãi chỉ còn 16.667đ</div>
                  </div>
                </div>

                {/* Savings highlight */}
                <div className="p-3 bg-gradient-to-r from-emerald-800 to-teal-900 rounded-xl text-white text-xs flex items-center justify-between">
                  <div>
                    <div className="text-emerald-200 text-[11px]">Tổng lãi tiết kiệm với dư nợ giảm dần:</div>
                    <div className="font-bold text-amber-300 text-sm">~4.600.000 đ</div>
                  </div>
                  <button
                    onClick={onScrollToCalculator}
                    className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
