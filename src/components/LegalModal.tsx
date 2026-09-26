import React from 'react';
import { X, ShieldCheck, FileText, Lock, AlertTriangle } from 'lucide-react';
import { LEGAL_DOCUMENTS, LegalDocument } from '../data/expertAndLegalData';

interface LegalModalProps {
  isOpen: boolean;
  docKey: 'privacy' | 'terms' | 'disclaimer' | null;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, docKey, onClose }) => {
  if (!isOpen || !docKey) return null;

  const doc: LegalDocument = LEGAL_DOCUMENTS[docKey] || LEGAL_DOCUMENTS.privacy;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="relative bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-slate-900">{doc.title}</h3>
              <p className="text-xs text-slate-500">Cập nhật lần cuối: {doc.lastUpdated} • Vay365.com</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 italic text-slate-600">
            {doc.summary}
          </div>

          {doc.sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base text-emerald-900">
                {sec.heading}
              </h4>
              {sec.body.map((p, pIdx) => (
                <p key={pIdx} className="text-slate-600 leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          ))}

          {docKey === 'disclaimer' && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
              <div className="font-bold flex items-center gap-1.5 text-amber-950">
                <AlertTriangle className="w-4 h-4 text-amber-700" />
                <span>Lưu ý quan trọng</span>
              </div>
              <p>
                Dịch vụ tại Vay365 là hoàn toàn miễn phí 100%. Quý khách tuyệt đối không chuyển tiền cọc cho bất kỳ ai. Mọi thắc mắc vui lòng liên hệ trực tiếp hotline: <strong>0583.345.345</strong>.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
          >
            Tôi Đã Hiểu &amp; Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
