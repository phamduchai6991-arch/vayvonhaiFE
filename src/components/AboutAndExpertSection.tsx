import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  CheckCircle2, 
  PhoneCall, 
  Mail, 
  MapPin, 
  FileCheck, 
  UserCheck, 
  Sparkles, 
  Building2, 
  Star,
  ExternalLink,
  Lock,
  HeartHandshake
} from 'lucide-react';
import { EXPERT_PROFILE, REAL_CASE_STUDIES } from '../data/expertAndLegalData';

interface AboutAndExpertSectionProps {
  onConsultClick: () => void;
}

export const AboutAndExpertSection: React.FC<AboutAndExpertSectionProps> = ({ onConsultClick }) => {
  const [activeTab, setActiveTab] = useState<'expert' | 'case_studies' | 'ethics'>('expert');

  return (
    <section id="about-expert" className="py-16 sm:py-20 bg-gradient-to-b from-white via-slate-50 to-white border-b border-emerald-100/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-emerald-200">
            <Award className="w-3.5 h-3.5 text-emerald-700" />
            <span>Tiêu Chuẩn E-E-A-T: Uy Tín &amp; Chuyên Môn Thực Chiến</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Về Chúng Tôi &amp; <span className="text-emerald-600">Hồ Sơ Chuyên Gia Thẩm Định</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
            Minh bạch nhân sự thực tế, chứng chỉ hành nghề và kinh nghiệm hơn 7 năm trực tiếp hỗ trợ giải ngân tín chấp tiêu dùng.
          </p>

          {/* Sub Navigation Tabs */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('expert')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'expert'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-4 h-4 text-emerald-600" />
                <span>Hồ Sơ Đức Hải FE</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('case_studies')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'case_studies'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Đánh Giá &amp; Case Study ({REAL_CASE_STUDIES.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('ethics')}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'ethics'
                    ? 'bg-white text-emerald-700 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Cam Kết Đạo Đức Nghề Nghiệp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tab 1: Expert Profile */}
        {activeTab === 'expert' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-lg shadow-emerald-600/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Avatar & Trust Card */}
            <div className="lg:col-span-5 flex flex-col items-center text-center p-6 rounded-2xl bg-gradient-to-b from-emerald-50/60 to-slate-50 border border-emerald-100">
              <div className="relative mb-4">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-emerald-500/20 shadow-md bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white text-3xl font-black">
                  ĐH
                </div>
                <div className="absolute bottom-0 right-0 bg-emerald-600 text-white p-2 rounded-full shadow-md border-2 border-white" title="Chuyên viên xác thực danh tính">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900">{EXPERT_PROFILE.name}</h3>
              <p className="text-xs text-emerald-700 font-bold mt-1 px-3 py-0.5 rounded-full bg-emerald-100/80">
                Direct Sales Specialist (DSS)
              </p>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Kinh nghiệm thực chiến: <strong>{EXPERT_PROFILE.experienceYears}+ Năm</strong></span>
              </div>

              <div className="w-full border-t border-slate-200/80 my-4 pt-4 text-left space-y-2.5 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <PhoneCall className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Hotline trực tiếp: <strong className="text-slate-900">{EXPERT_PROFILE.phone}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="truncate">Email: <strong className="text-slate-900">{EXPERT_PROFILE.email}</strong></span>
                </div>
                <div className="flex items-start gap-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>Địa bàn phụ trách: <strong className="text-slate-900">{EXPERT_PROFILE.address}</strong> &amp; Toàn quốc online</span>
                </div>
              </div>

              <button
                type="button"
                onClick={onConsultClick}
                className="w-full mt-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Gặp Chuyên Viên Tư Vấn Ngay</span>
              </button>
            </div>

            {/* Right Column: Experience, Background & Qualifications */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                  Tiểu Sử Nghề Nghiệp &amp; Kinh Nghiệm (Experience)
                </span>
                <h4 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                  Chuyên Gia Trực Tiếp Thẩm Định &amp; Bảo Vệ Quyền Lợi Người Vay
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {EXPERT_PROFILE.bio}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 space-y-1.5">
                <div className="font-bold text-slate-900 flex items-center gap-1.5 text-xs uppercase text-emerald-800">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Quá trình công tác chính thống</span>
                </div>
                <p className="text-xs text-slate-600">
                  {EXPERT_PROFILE.previousCompany}. Trực tiếp tiếp nhận, thẩm định thực địa tại nhà và cơ quan, hướng dẫn hồ sơ khách hàng nộp vào hệ thống ngân hàng theo quy định Ngân hàng Nhà nước.
                </p>
              </div>

              <div>
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Năng Lực Chuyên Môn &amp; Thẩm Định (Expertise)</span>
                </h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {EXPERT_PROFILE.credentials.map((cred, idx) => (
                    <li key={idx} className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{cred}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Statistics highlight */}
              <div className="grid grid-cols-3 gap-3 pt-2 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-lg sm:text-xl font-black text-emerald-700">4.200+</div>
                  <div className="text-[11px] text-slate-500 font-medium">Hồ sơ đã hỗ trợ</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-lg sm:text-xl font-black text-emerald-700">0 Đồng</div>
                  <div className="text-[11px] text-slate-500 font-medium">Phí trước giải ngân</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="text-lg sm:text-xl font-black text-emerald-700">100%</div>
                  <div className="text-[11px] text-slate-500 font-medium">Bảo mật thông tin</div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Real Case Studies & Social Proof */}
        {activeTab === 'case_studies' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-emerald-900">
              <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                <strong>Bảo vệ quyền riêng tư:</strong> Toàn bộ họ tên và thông tin nhạy cảm của khách hàng đã được làm mờ (theo chuẩn Nghị định 13/2023/NĐ-CP). Các trường hợp dưới đây là hồ sơ thật đã được thẩm định và giải ngân thành công qua hệ thống đối tác của Vay365.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {REAL_CASE_STUDIES.map((cs) => (
                <div key={cs.id} className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{cs.customerName}</span>
                          <span className="text-[10px] text-slate-400 font-normal">({cs.location})</span>
                        </div>
                        <span className="inline-block mt-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {cs.loanPackage}
                        </span>
                      </div>

                      <div className="text-right">
                        <div className="text-base font-black text-emerald-700">
                          {new Intl.NumberFormat('vi-VN').format(cs.amount)} đ
                        </div>
                        <div className="text-[11px] text-slate-500">Kỳ hạn {cs.termMonths} tháng</div>
                      </div>
                    </div>

                    <div className="pt-3 space-y-2 text-xs">
                      <div>
                        <span className="font-bold text-slate-700">Tình huống khách hàng: </span>
                        <span className="text-slate-600">{cs.situation}</span>
                      </div>
                      <div>
                        <span className="font-bold text-slate-700">Giải pháp của Vay365: </span>
                        <span className="text-slate-600">{cs.solution}</span>
                      </div>
                    </div>

                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs italic text-slate-700 relative">
                      {cs.feedback}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(cs.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                      <span className="ml-1 font-bold text-slate-700">Đã xác minh</span>
                    </div>
                    <span>Giải ngân: {cs.disbursementTime}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={onConsultClick}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>Đăng Ký Để Được Hỗ Trợ Giải Ngân Như Các Trường Hợp Trên</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Ethics & Anti-Scam Commitment */}
        {activeTab === 'ethics' && (
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-md space-y-6">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Chuẩn Mực Đạo Đức Nghề Nghiệp (Trust &amp; Transparency)
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                4 Cam Kết Vàng Bảo Vệ Người Tiêu Dùng Tài Chính
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Vay365 tuân thủ nghiêm ngặt Luật Các tổ chức tín dụng và các hướng dẫn của Ngân hàng Nhà nước Việt Nam.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {EXPERT_PROFILE.ethicsCommitment.map((item, idx) => {
                const parts = item.split(':');
                const title = parts[0];
                const desc = parts.slice(1).join(':');

                return (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-colors flex gap-3 items-start">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-700 shrink-0 mt-0.5">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{title}</h4>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm space-y-2">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <Lock className="w-4 h-4 text-amber-700 shrink-0" />
                <span>Cảnh báo mạo danh &amp; Hướng dẫn tự bảo vệ tài chính</span>
              </div>
              <p className="leading-relaxed">
                Hiện nay trên mạng xã hội xuất hiện nhiều đối tượng giả danh ngân hàng, giả danh công ty tài chính FE Credit yêu cầu khách hàng đóng "phí giải ngân", "phí bảo hiểm khoản vay", "phí mở mã hồ sơ" qua số tài khoản cá nhân. <strong>Vay365 xin khẳng định lại: Mọi hành vi yêu cầu chuyển tiền trước đều là LỪA ĐẢO.</strong> Tiền vay của quý khách luôn được chuyển thẳng vào tài khoản ngân hàng chính chủ của quý khách do ngân hàng đối tác giải ngân.
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
