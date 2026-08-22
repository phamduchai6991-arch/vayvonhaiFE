import React from 'react';
import { 
  Calculator, 
  PhoneCall, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Heart
} from 'lucide-react';

interface FooterProps {
  onNavigateSection: (sectionId: string) => void;
  onOpenAdminLeads: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenAdminLeads }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Calculator className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black text-white">Đức Hải</span>
                <span className="text-2xl font-black text-emerald-400">FE</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Dịch vụ tư vấn tài chính chuyên nghiệp Đức Hải FE, cung cấp công cụ tính lãi suất dư nợ giảm dần chuẩn xác và hỗ trợ kết nối khách hàng vay tín chấp nhanh chóng, an toàn, bảo mật.
            </p>

            <div className="pt-2 text-xs space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Bảo mật thông tin khách hàng tuyệt đối</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Hỗ trợ tư vấn 24/7 toàn quốc</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Công Cụ &amp; Dịch Vụ</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection('calculator')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Tính lãi dư nợ giảm dần</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('lead-form-section')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Đăng ký tư vấn vay vốn</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('packages')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Các gói vay ưu đãi</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('tips-news')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Mẹo vặt &amp; Tin tức vay</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('faq')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Câu hỏi thường gặp</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Loan Products */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Gói Vay Tín Chấp</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Vay tín chấp theo bảng lương</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Vay tín chấp tiêu dùng cá nhân</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Vay tín chấp tiểu thương &amp; kinh doanh</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Vay tín chấp theo HĐ bảo hiểm &amp; hóa đơn</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Thời hạn vay trả góp 6 - 36 tháng</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Hotline */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Liên Hệ Tư Vấn</h4>
            
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <PhoneCall className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-slate-200 font-bold text-sm">0965 234 222 (Tư vấn 24/7)</div>
                  <div className="text-[11px] text-slate-500">Giờ làm việc: 8h00 - 21h00 hàng ngày</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>phamduchai6991@gmail.com</span>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>12 Trần Minh Tông, Hưng Lộc, Vinh, Nghệ An</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenAdminLeads}
                className="text-[11px] px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium border border-slate-700 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>🔒 Cổng Quản Trị Bảo Mật</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Disclaimer & Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} Đức Hải FE. Mọi quyền được bảo lưu. Tư vấn vay tín chấp &amp; tính lãi suất chính xác.
          </p>

          <p className="flex items-center gap-1">
            <span>Tư vấn tài chính minh bạch &amp; an toàn</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
