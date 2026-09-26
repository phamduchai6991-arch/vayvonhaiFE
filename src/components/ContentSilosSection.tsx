import React, { useState } from 'react';
import { 
  BookOpen, 
  MapPin, 
  Layers, 
  ArrowRight, 
  Clock, 
  Calendar, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  PhoneCall, 
  FileText,
  TrendingDown,
  Building,
  ChevronRight
} from 'lucide-react';
import { 
  FINANCIAL_KNOWLEDGE_ARTICLES, 
  LOCAL_SEO_HUBS, 
  FinancialArticle,
  LocalSeoHub 
} from '../data/expertAndLegalData';
import { LOAN_PACKAGES } from '../data/constants';
import { LoanPackage } from '../types';

interface ContentSilosSectionProps {
  onSelectPackage: (pkg: LoanPackage) => void;
  onApplyForLocation: (locationName: string) => void;
  onConsultClick: () => void;
}

export const ContentSilosSection: React.FC<ContentSilosSectionProps> = ({
  onSelectPackage,
  onApplyForLocation,
  onConsultClick
}) => {
  const [activeHub, setActiveHub] = useState<'articles' | 'local' | 'packages'>('articles');
  const [selectedArticle, setSelectedArticle] = useState<FinancialArticle | null>(null);
  const [selectedLocalHub, setSelectedLocalHub] = useState<LocalSeoHub | null>(null);

  return (
    <section id="content-silos" className="py-16 sm:py-20 bg-slate-50 border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-emerald-200">
            <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kiến Trúc Nội Dung Chuyên Sâu (Content Silos)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Cẩm Nang Tài Chính, <span className="text-emerald-600">Địa Bàn Hỗ Trợ &amp; Gói Vay Tách Biệt</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Cung cấp lời khuyên chuyên môn giải quyết các băn khoăn trước khi vay, hướng dẫn quy trình vay theo từng địa bàn và sản phẩm cụ thể.
          </p>

          {/* Navigation Pill Switcher */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            <button
              type="button"
              onClick={() => {
                setActiveHub('articles');
                setSelectedArticle(null);
                setSelectedLocalHub(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeHub === 'articles'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Chuyên Mục Kiến Thức ({FINANCIAL_KNOWLEDGE_ARTICLES.length} Bài Viết)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveHub('local');
                setSelectedArticle(null);
                setSelectedLocalHub(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeHub === 'local'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>Thị Trường Địa Phương (Local SEO)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveHub('packages');
                setSelectedArticle(null);
                setSelectedLocalHub(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeHub === 'packages'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Cụm Sản Phẩm Riêng Biệt</span>
            </button>
          </div>
        </div>

        {/* HUB 1: Financial Knowledge Articles */}
        {activeHub === 'articles' && (
          <div>
            {!selectedArticle ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {FINANCIAL_KNOWLEDGE_ARTICLES.map((art) => (
                  <div 
                    key={art.slug} 
                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-3">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-100">
                          {art.category}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {art.readTime}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                        {art.title}
                      </h3>

                      <p className="text-xs text-slate-600 mt-2.5 line-clamp-3 leading-relaxed">
                        {art.summary}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">Cập nhật: {art.updatedAt}</span>
                      <button
                        type="button"
                        onClick={() => setSelectedArticle(art)}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer group-hover:translate-x-1 transition-transform"
                      >
                        <span>Đọc toàn bài</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Single Article View */
              <div className="bg-white rounded-3xl p-6 sm:p-10 border border-emerald-100 shadow-md space-y-6 max-w-4xl mx-auto">
                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer pb-2"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>Quay lại danh sách bài viết kiến thức</span>
                </button>

                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3 text-xs text-slate-500 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      {selectedArticle.category}
                    </span>
                    <span>Tác giả: <strong>Phạm Đức Hải (FE Credit Specialist)</strong></span>
                    <span>• {selectedArticle.readTime}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                    {selectedArticle.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-2 italic bg-slate-50 p-3 rounded-xl border border-slate-200">
                    💡 <strong>Tóm tắt ý chính:</strong> {selectedArticle.summary}
                  </p>
                </div>

                {/* Article body content */}
                <div className="space-y-6 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {selectedArticle.content.map((sec, idx) => (
                    <div key={idx} className="space-y-2">
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 text-emerald-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        <span>{sec.heading}</span>
                      </h4>
                      {sec.paragraphs.map((p, pIdx) => (
                        <p key={pIdx} className="leading-relaxed text-slate-700">{p}</p>
                      ))}
                    </div>
                  ))}
                </div>

                {/* FAQ section of article */}
                {selectedArticle.faq.length > 0 && (
                  <div className="p-4 sm:p-6 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
                    <h5 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      <HelpCircle className="w-4 h-4 text-emerald-700" />
                      <span>Câu hỏi thường gặp liên quan đến bài viết</span>
                    </h5>
                    {selectedArticle.faq.map((f, fIdx) => (
                      <div key={fIdx} className="space-y-1 text-xs sm:text-sm">
                        <div className="font-bold text-emerald-950">Q: {f.q}</div>
                        <div className="text-slate-700">A: {f.a}</div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs text-slate-500">
                    Cần giải đáp chi tiết về trường hợp hồ sơ của bạn?
                  </div>
                  <button
                    type="button"
                    onClick={onConsultClick}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Nhận Tư Vấn Trực Tiếp Từ Đức Hải FE</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HUB 2: Local SEO Hubs */}
        {activeHub === 'local' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {LOCAL_SEO_HUBS.map((hub) => (
                <div 
                  key={hub.slug}
                  className={`bg-white rounded-2xl p-6 border transition-all flex flex-col justify-between ${
                    selectedLocalHub?.slug === hub.slug
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                      : 'border-slate-200 hover:border-emerald-300 shadow-xs'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                        Khu Vực Trọng Điểm
                      </span>
                      <span className="text-[11px] text-slate-500 font-bold">{hub.province}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {hub.name}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {hub.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                        Các quận huyện hỗ trợ giải ngân:
                      </div>
                      <ul className="space-y-1">
                        {hub.featuredAreas.slice(0, 3).map((area, i) => (
                          <li key={i} className="flex items-center gap-1.5 text-[11px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{area}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-700 font-semibold">{hub.disbursementTime}</span>
                    <button
                      type="button"
                      onClick={() => onApplyForLocation(hub.name)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Đăng ký tại đây
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-600">
                <strong>📍 Bạn ở tỉnh thành khác?</strong> Vay365 hỗ trợ duyệt hồ sơ online 100% qua CCCD gắn chip và tài khoản ngân hàng chính chủ cho khách hàng tại đủ <strong>63 tỉnh thành</strong> khắp cả nước.
              </div>
              <button
                type="button"
                onClick={onConsultClick}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
              >
                Tra cứu hồ sơ tỉnh của bạn
              </button>
            </div>
          </div>
        )}

        {/* HUB 3: Product Silos (Vay theo lương, Vay tiểu thương, Vay bảo hiểm) */}
        {activeHub === 'packages' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {LOAN_PACKAGES.map((pkg) => (
                <div 
                  key={pkg.id}
                  className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 mb-2">
                      {pkg.badge}
                    </span>
                    <h3 className="text-base font-black text-slate-900">{pkg.name}</h3>
                    
                    <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[11px] text-slate-500">Lãi suất chỉ từ</div>
                      <div className="text-lg font-black text-emerald-700">{pkg.baseRate}%/tháng</div>
                      <div className="text-[10px] text-slate-400">Dư nợ giảm dần</div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-600">
                      <div className="font-bold text-slate-800 text-[11px]">Điều kiện áp dụng:</div>
                      <ul className="space-y-1">
                        {pkg.requirements.map((req, rIdx) => (
                          <li key={rIdx} className="flex items-start gap-1.5 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectPackage(pkg)}
                    className="w-full mt-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Chọn Gói Vay Này</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
