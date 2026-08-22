import React from 'react';
import { 
  X, 
  Clock, 
  User, 
  Calendar, 
  Tag, 
  Share2, 
  ArrowRight, 
  ShieldCheck, 
  PhoneCall, 
  CheckCircle2,
  ExternalLink,
  Globe
} from 'lucide-react';
import { Article } from '../types';

interface ArticleDetailModalProps {
  article: Article | null;
  onClose: () => void;
  onConsultLoan: () => void;
}

export const ArticleDetailModal: React.FC<ArticleDetailModalProps> = ({
  article,
  onClose,
  onConsultLoan,
}) => {
  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-blue-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header with Close button */}
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              {article.categoryName}
            </span>
            {article.sourceName && (
              <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 flex items-center gap-1">
                <Globe className="w-3 h-3" />
                Nguồn: {article.sourceName}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Hero Cover Image */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <h1 className="text-xl sm:text-2xl font-black leading-tight text-white drop-shadow-md">
              {article.title}
            </h1>
          </div>
        </div>

        {/* Metadata bar */}
        <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              {article.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {article.publishedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {article.tags.map((tag, idx) => (
              <span key={idx} className="bg-white border border-slate-200 px-2 py-0.5 rounded-md text-[11px] text-slate-600">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Article Body Content */}
        <div className="p-6 sm:p-8 space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          
          <div className="p-4 rounded-xl bg-emerald-50/80 border-l-4 border-emerald-600 font-medium text-emerald-950 text-sm italic">
            "{article.summary}"
          </div>

          {article.content.map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed">
              {paragraph}
            </p>
          ))}

          {/* Original Source link if available */}
          {article.sourceUrl && (
            <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200 flex items-center justify-between text-xs text-blue-900 mt-4">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Bài viết tự động cập nhật từ nguồn báo <strong>{article.sourceName || 'Chính Thống'}</strong></span>
              </div>
              <a
                href={article.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-bold text-blue-700 hover:text-blue-900 hover:underline shrink-0"
              >
                <span>Xem bài gốc</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Embedded Consultation Box */}
          <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white space-y-4 shadow-lg">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
              <h3 className="text-lg font-bold text-white">Cần Chuyên Gia Tư Vấn Trực Tiếp Khoản Vay?</h3>
            </div>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              Đức Hải FE hỗ trợ tính toán phương án tài chính tối ưu nhất theo thu nhập thực tế của bạn, 
              hoàn toàn miễn phí và bảo mật thông tin tuyệt đối.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  onClose();
                  onConsultLoan();
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <span>Đăng Ký Tư Vấn Vay Miễn Phí</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <a
                href="tel:0965234222"
                className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 border border-white/20"
              >
                <PhoneCall className="w-4 h-4 text-amber-300" />
                <span>Gọi Hotline 0965 234 222</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs sm:text-sm font-bold cursor-pointer"
          >
            Đóng bài viết
          </button>
        </div>

      </div>
    </div>
  );
};
