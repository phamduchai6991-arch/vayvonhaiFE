import React from 'react';
import { 
  FileEdit, 
  Search, 
  CheckCircle, 
  Banknote, 
  Zap
} from 'lucide-react';

export const ProcessSteps: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'Đăng Ký Nhu Cầu Online',
      desc: 'Chọn số tiền (10tr - 300tr) và kỳ hạn (6 - 36 tháng) vào biểu mẫu tư vấn hoặc công cụ tính lãi.',
      icon: FileEdit,
      badge: 'Chỉ 1 phút',
    },
    {
      number: '02',
      title: 'Tư Vấn Tín Chấp Miễn Phí',
      desc: 'Chuyên viên gọi điện sau 15 phút để tư vấn gói vay tín chấp không thế chấp phù hợp với điều kiện thu nhập.',
      icon: Search,
      badge: 'Miễn phí 100%',
    },
    {
      number: '03',
      title: 'Phê Duyệt Hạn Mức Tự Động',
      desc: 'Hệ thống đối tác tài chính xét duyệt hạn mức online qua CCCD gắn chip và bảng lương/hóa đơn.',
      icon: CheckCircle,
      badge: 'Duyệt nhanh 2 - 4H',
    },
    {
      number: '04',
      title: 'Nhận Tiền Vào Tài Khoản',
      desc: 'Ký hợp đồng điện tử và nhận tiền trực tiếp vào tài khoản ngân hàng chính chủ của bạn ngay trong ngày.',
      icon: Banknote,
      badge: 'Giải ngân 24H',
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-emerald-200">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            Thủ Tục Online 100%
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Quy Trình Vay Tín Chấp <span className="text-emerald-600">4 Bước Tinh Gọn</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Không cần tài sản đảm bảo, kỳ hạn từ 6 đến 36 tháng, nhận tiền giải ngân nhanh chóng trong ngày.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={idx}
                className="bg-slate-50/80 rounded-2xl p-6 border border-emerald-100/80 hover:border-emerald-300 hover:bg-white hover:shadow-lg transition-all duration-200 flex flex-col justify-between relative group"
              >
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <span className="text-2xl font-black text-emerald-300 group-hover:text-emerald-600 transition-colors">
                      {step.number}
                    </span>
                    <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      {step.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 shadow-xs group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
