import React, { useState, useEffect } from 'react';
import { PhoneCall, MessageCircle, ChevronUp, Calculator } from 'lucide-react';

interface FloatingActionsProps {
  onScrollToTop: () => void;
  onScrollToForm: () => void;
  onScrollToCalculator: () => void;
}

export const FloatingActions: React.FC<FloatingActionsProps> = ({
  onScrollToTop,
  onScrollToForm,
  onScrollToCalculator,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 pointer-events-auto">
      
      {/* Scroll to Top */}
      {showScrollTop && (
        <button
          onClick={onScrollToTop}
          className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-900 text-white flex items-center justify-center shadow-lg backdrop-blur-xs transition-all hover:scale-110"
          title="Lên đầu trang"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Quick Calculator floating button */}
      <button
        onClick={onScrollToCalculator}
        className="hidden sm:flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-white text-emerald-800 font-bold text-xs shadow-xl border border-emerald-200 hover:bg-emerald-50 transition-all hover:scale-105 cursor-pointer"
        title="Tính lãi suất"
      >
        <Calculator className="w-4 h-4 text-emerald-600" />
        <span>Tính lãi suất</span>
      </button>

      {/* Zalo Chat Floating Action */}
      <a
        href="https://zalo.me/0583345345"
        target="_blank"
        rel="noreferrer"
        className="w-12 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl shadow-emerald-600/30 transition-transform hover:scale-110 group relative"
        title="Chat Zalo Tư Vấn"
      >
        <span className="font-black text-sm">Zalo</span>
        <span className="absolute right-full mr-2 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Chat Zalo tư vấn ngay
        </span>
      </a>

      {/* Hotline Call Floating Action with pulse animation */}
      <a
        href="tel:0583345345"
        className="relative flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-xl shadow-rose-500/40 hover:scale-110 transition-transform group"
        title="Gọi Hotline 0583.345.345"
      >
        <span className="absolute -inset-1 rounded-full bg-rose-500/40 animate-ping" />
        <PhoneCall className="w-6 h-6 animate-pulse relative z-10" />
        <span className="absolute right-full mr-2 bg-slate-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
          Hotline: 0583.345.345 (Tư vấn 24/7)
        </span>
      </a>

    </div>
  );
};
