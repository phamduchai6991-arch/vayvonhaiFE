import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { FAQ_DATA } from '../data/constants';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-slate-50 border-b border-emerald-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 bg-emerald-100/90 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 border border-emerald-200">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            Giải Đáp Thắc Mắc
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Câu Hỏi Thường Gặp (FAQ)
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Tổng hợp các câu hỏi khách hàng thường băn khoăn khi làm hồ sơ vay tín chấp và giải pháp từ chuyên gia.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-3.5">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs transition-all hover:border-emerald-200"
              >
                <button
                  onClick={() => toggleIndex(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 hover:text-emerald-700 transition-colors text-sm sm:text-base cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 text-xs font-black">
                      Q{idx + 1}
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-emerald-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-emerald-50/20">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Security & Free Consultation Re-assurance */}
        <div className="mt-10 p-6 rounded-2xl bg-white border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Vẫn còn thắc mắc về điều kiện vay?</h4>
              <p className="text-xs text-slate-500">Chuyên viên trực tiếp lắng nghe và giải đáp mọi trường hợp hồ sơ khó.</p>
            </div>
          </div>
          <a
            href="tel:0583345345"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm whitespace-nowrap shadow-sm shadow-emerald-600/20 cursor-pointer"
          >
            Gọi Chuyên Viên 0583.345.345
          </a>
        </div>

      </div>
    </section>
  );
};
