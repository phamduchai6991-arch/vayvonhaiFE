import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  HelpCircle, 
  TrendingDown, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  BadgePercent, 
  Clock, 
  AlertCircle,
  Calculator
} from 'lucide-react';

export const SEOGuideSection: React.FC = () => {
  const [activeTopic, setActiveTopic] = useState<'so_sanh_lai' | 'dieu_kien_vay' | 'meo_duyet' | 'quy_trinh'>('so_sanh_lai');

  return (
    <section id="seo-guide" className="py-16 bg-white border-t border-b border-emerald-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with rich SEO semantics */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full text-emerald-800 text-xs font-semibold">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Cẩm Nang Tài Chính &amp; Kiến Thức Vay Tín Chấp 2026</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Hướng Dẫn &amp; Kinh Nghiệm Vay Tín Chấp Không Thế Chấp Chuẩn Ngân Hàng
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Tổng hợp thông tin minh bạch về <strong>cách tính lãi suất dư nợ giảm dần</strong>, 
            điều kiện duyệt hồ sơ qua CCCD và các giải pháp tài chính an toàn tại <strong>Vay365.com</strong>.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-8">
          <button
            type="button"
            onClick={() => setActiveTopic('so_sanh_lai')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTopic === 'so_sanh_lai'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            <span>Lãi Suất Giảm Dần vs Lãi Phẳng</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTopic('dieu_kien_vay')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTopic === 'dieu_kien_vay'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Điều Kiện Vay 3Tr - 100Tr</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTopic('meo_duyet')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTopic === 'meo_duyet'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Mẹo Duyệt Nhanh 2 - 24H</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTopic('quy_trinh')}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTopic === 'quy_trinh'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Kỳ Hạn 6 Đến 36 Tháng</span>
          </button>
        </div>

        {/* Content Box */}
        <div className="bg-slate-50 border border-emerald-100 rounded-3xl p-6 sm:p-8">
          
          {/* TOPIC 1: SO SÁNH LÃI SUẤT */}
          {activeTopic === 'so_sanh_lai' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <BadgePercent className="w-6 h-6 text-emerald-600" />
                  <span>Cách Phân Biệt Lãi Suất Dư Nợ Giảm Dần &amp; Lãi Suất Phẳng (Cố Định)</span>
                </h3>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                  Tiết kiệm đến 40% tiền lãi
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                
                {/* Dư Nợ Giảm Dần Card */}
                <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-base">
                    <CheckCircle2 className="w-5 h-5" />
                    <h4>1. Lãi Suất Dư Nợ Giảm Dần (Chuẩn Vay365)</h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Tiền lãi mỗi tháng được tính <strong>chỉ trên số tiền gốc thực tế còn lại</strong> sau khi đã trừ đi phần gốc bạn đã trả ở các kỳ trước.
                  </p>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Tiền lãi giảm liên tục</strong> qua từng tháng đến khi về 0 đồng.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span><strong>Tổng chi phí lãi thực tế thấp hơn</strong> rất nhiều so với lãi cố định cùng thời hạn.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>Được ngân hàng và các tổ chức tín dụng uy tín hàng đầu áp dụng minh bạch.</span>
                    </li>
                  </ul>
                </div>

                {/* Lãi Suất Cố Định Card */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-slate-700 font-bold text-base">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    <h4>2. Lãi Suất Phẳng (Tính Theo Gốc Ban Đầu)</h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    Tiền lãi mỗi tháng được tính <strong>cố định trên 100% số tiền vay ban đầu</strong> trong suốt toàn bộ kỳ hạn hợp đồng.
                  </p>
                  <ul className="space-y-2 text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Dù bạn đã trả gần hết gốc, tiền lãi tháng cuối vẫn bằng tiền lãi tháng đầu tiên.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Lãi suất ghi trên quảng cáo trông có vẻ thấp (ví dụ 1.2%/tháng) nhưng thực tế tương đương 2.2%/tháng giảm dần.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Tại Vay365, công cụ tính luôn công khai cả 2 phương pháp để khách hàng so sánh trực quan.</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* TOPIC 2: ĐIỀU KIỆN VAY */}
          {activeTopic === 'dieu_kien_vay' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  <span>Điều Kiện Vay Vốn Tín Chấp Tiêu Dùng Từ 3 Triệu Đến 100 Triệu</span>
                </h3>
                <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
                  100% Không Giữ Bản Gốc
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">1</div>
                  <h4 className="font-bold text-slate-900 text-base">Độ Tuổi &amp; Quốc Tịch</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Công dân Việt Nam từ <strong>18 đến 60 tuổi</strong> (tính đến thời điểm tất toán khoản vay), đang sinh sống và làm việc tại 63 tỉnh thành.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">2</div>
                  <h4 className="font-bold text-slate-900 text-base">Giấy Tờ Tùy Thân</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Có <strong>Căn cước công dân (CCCD gắn chip)</strong> hoặc tài khoản định danh điện tử VNeID mức 2 còn hiệu lực pháp lý.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-xs space-y-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">3</div>
                  <h4 className="font-bold text-slate-900 text-base">Nguồn Thu Nhập Ổn Định</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Thu nhập từ <strong>3.000.000 đ/tháng</strong> (từ lương chuyển khoản/tiền mặt, kinh doanh online, buôn bán tạp hóa hoặc hợp đồng bảo hiểm).
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 3: MẸO DUYỆT NHANH */}
          {activeTopic === 'meo_duyet' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  <span>4 Kinh Nghiệm Giúp Hồ Sơ Vay Tín Chấp Được Duyệt 100% Trong 2 - 24 Giờ</span>
                </h3>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                  Bí quyết từ chuyên viên
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="bg-white p-4.5 rounded-2xl border border-emerald-100 space-y-2">
                  <h4 className="font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>1. Cung cấp số điện thoại chính chủ</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Số thuê bao đăng ký chính chủ và dùng thường xuyên trên Zalo giúp điểm tín dụng của bạn tăng cao hơn 20% trong thuật toán thẩm định.
                  </p>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-emerald-100 space-y-2">
                  <h4 className="font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>2. Chọn kỳ hạn trả góp hợp lý (12 - 24 tháng)</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Kỳ hạn dài hơn sẽ giúp số tiền trả góp hàng tháng thấp xuống, tỷ lệ nợ trên thu nhập (DTI) an toàn giúp hồ sơ giải ngân nhanh chóng.
                  </p>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-emerald-100 space-y-2">
                  <h4 className="font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>3. Khai báo mục đích vay rõ ràng</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Nêu rõ mục đích thực tế: mua sắm gia đình, sửa nhà, đóng học phí, bổ sung vốn kinh doanh hàng hóa giúp nhân viên tư vấn dễ dàng chọn gói ưu đãi.
                  </p>
                </div>

                <div className="bg-white p-4.5 rounded-2xl border border-emerald-100 space-y-2">
                  <h4 className="font-bold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>4. Giữ liên lạc khi chuyên viên gọi hỗ trợ</span>
                  </h4>
                  <p className="text-slate-600 leading-relaxed">
                    Sau khi điền form trên website Vay365, hãy chú ý điện thoại hoặc tin nhắn Zalo để chuyên viên liên hệ đối chiếu thông tin trong vòng 5 - 15 phút.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TOPIC 4: KỲ HẠN VAY */}
          {activeTopic === 'quy_trinh' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Clock className="w-6 h-6 text-teal-600" />
                  <span>Kỳ Hạn Vay Trả Góp 6 Đến 36 Tháng Phù Hợp Với Ai?</span>
                </h3>
                <span className="px-3 py-1 bg-teal-100 text-teal-800 text-xs font-bold rounded-full">
                  Linh hoạt tài chính
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">Gói 6 - 9 Tháng (Ngắn Hạn)</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Thích hợp cho nhu cầu xoay vòng vốn kinh doanh ngắn, khoản vay từ 3 đến 20 triệu. Tổng tiền lãi cực ít, tất toán nhanh gọn.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-emerald-200 space-y-2">
                  <h4 className="font-bold text-emerald-800 text-base">Gói 12 - 24 Tháng (Phổ Biến Nhất)</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Lựa chọn tối ưu cho đại đa số người đi làm, vay từ 20 đến 70 triệu. Số tiền gốc + lãi chia đều hàng tháng rất nhẹ nhàng (chỉ từ vài trăm ngàn đến 2-3 triệu/tháng).
                  </p>
                </div>

                <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">Gói 30 - 36 Tháng (Dài Hạn)</h4>
                  <p className="text-slate-600 leading-relaxed">
                    Dành cho khoản vay lớn từ 70 đến 100 triệu để mua sắm lớn, sửa sang nhà cửa hoặc phát triển kinh doanh bền vững.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </section>
  );
};
