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
  onOpenLegalModal: (docKey: 'privacy' | 'terms' | 'disclaimer') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateSection, onOpenAdminLeads, onOpenLegalModal }) => {
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
              <div className="flex items-center gap-0.5">
                <span className="text-2xl font-black text-white">Vay</span>
                <span className="text-2xl font-black text-emerald-400">365</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Dịch vụ tư vấn tài chính tiêu dùng chuyên nghiệp Vay365, phụ trách bởi Chuyên viên <strong>Phạm Đức Hải (cựu Direct Sales Specialist tại FE Credit)</strong>. Cung cấp công cụ tính lãi suất dư nợ giảm dần chuẩn xác và bảo vệ quyền lợi người vay.
            </p>

            <div className="pt-2 text-xs space-y-1.5 text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Bảo mật dữ liệu tuyệt đối (Nghị định 13/2023/NĐ-CP)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>Tư vấn miễn phí 100% không thu phí cọc</span>
              </div>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Khám Phá &amp; Dịch Vụ</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigateSection('about-expert')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer text-emerald-300 font-semibold"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Về chúng tôi &amp; Chuyên gia</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateSection('content-silos')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer text-emerald-300 font-semibold"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  <span>Cẩm nang &amp; Thị trường</span>
                </button>
              </li>
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
                  <span>Gói vay tín chấp ưu đãi</span>
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

          {/* Col 3: Loan Products & Policies */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Pháp Lý &amp; Minh Bạch</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('privacy')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Chính sách bảo mật (Privacy Policy)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('terms')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Điều khoản dịch vụ (Terms)</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenLegalModal('disclaimer')}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer text-left"
                >
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Tuyên bố miễn trừ trách nhiệm</span>
                </button>
              </li>
              <li className="pt-2 border-t border-slate-800 text-[11px] text-slate-500">
                <span>Vay tín chấp theo lương • Tiểu thương • Hóa đơn &amp; HĐ Bảo hiểm</span>
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
                  <div className="text-slate-200 font-bold text-sm">0583.345.345 (Tư vấn 24/7)</div>
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

        {/* YMYL & E-E-A-T Consumer Protection & Transparency Notice */}
        <div className="pt-6 pb-6 border-b border-slate-800 text-[11px] text-slate-400 space-y-2 leading-relaxed">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Tuyên Bố Minh Bạch Tài Chính &amp; Bảo Vệ Người Tiêu Dùng (Theo Tiêu Chuẩn Google E-E-A-T)</span>
          </div>
          <p>
            <strong>Thông tin dịch vụ:</strong> Vay365.com (phụ trách tư vấn: Chuyên viên Đức Hải FE - Hotline 0583.345.345) là kênh tư vấn tài chính độc lập và cung cấp công cụ tính lịch trả nợ dự kiến theo phương pháp dư nợ giảm dần. Chúng tôi kết nối khách hàng với các gói vay tín chấp tiêu dùng từ các đối tác ngân hàng và tổ chức tín dụng được Ngân hàng Nhà nước cấp phép hoạt động tại Việt Nam.
          </p>
          <p>
            <strong>Hạn mức &amp; Lãi suất:</strong> Hạn mức vay từ 3.000.000 VNĐ đến 100.000.000 VNĐ. Kỳ hạn vay từ 6 tháng đến tối đa 36 tháng. Lãi suất vay tín chấp ưu đãi từ 0.6%/tháng đến tối đa 1.8%/tháng (tương đương 7.2% - 21.6%/năm tính theo dư nợ giảm dần), tùy thuộc vào điểm tín dụng CIC và hồ sơ thu nhập cụ thể của khách hàng.
          </p>
          <p className="text-amber-300/90 font-medium">
            ⚠️ <strong>Cảnh báo quan trọng:</strong> Dịch vụ tư vấn và lập bảng tính lãi suất tại Vay365 là <u>hoàn toàn miễn phí 100%</u>. Chúng tôi tuyệt đối KHÔNG thu bất kỳ khoản tiền nào trước khi giải ngân (không thu phí hồ sơ, không thu phí bảo hiểm ứng trước). Mọi yêu cầu chuyển tiền cọc đều là hành vi giả mạo mạo danh. Cam kết bảo mật tuyệt đối thông tin khách hàng theo Nghị định 13/2023/NĐ-CP.
          </p>
        </div>

        {/* Bottom Bar: Disclaimer & Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>
            © {new Date().getFullYear()} Vay365 - Đức Hải FE. Mọi quyền được bảo lưu. Tư vấn vay tín chấp &amp; tính lãi suất chính xác.
          </p>

          <p className="flex items-center gap-1">
            <span>Tư vấn tài chính minh bạch, chuẩn ngân hàng &amp; an toàn</span>
          </p>
        </div>

      </div>
    </footer>
  );
};
