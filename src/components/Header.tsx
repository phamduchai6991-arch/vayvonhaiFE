import React, { useState } from 'react';
import { 
  Calculator, 
  PhoneCall, 
  ShieldCheck, 
  Menu, 
  X, 
  Users, 
  FileText, 
  BadgePercent, 
  HelpCircle, 
  ChevronRight 
} from 'lucide-react';

interface HeaderProps {
  onOpenCalculator: () => void;
  onOpenLeadForm: () => void;
  onOpenAdminLeads: () => void;
  onNavigateSection: (sectionId: string) => void;
  leadsCount: number;
  newLeadsCount: number;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCalculator,
  onOpenLeadForm,
  onOpenAdminLeads,
  onNavigateSection,
  leadsCount,
  newLeadsCount,
  isLoggedIn = false,
  onLogout
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    onNavigateSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white text-xs sm:text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium bg-emerald-900/60 px-2.5 py-0.5 rounded-full text-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              Tư vấn miễn phí 100%
            </span>
            <span className="hidden md:inline text-emerald-100">
              Lãi suất ưu đãi chỉ từ <strong className="text-amber-300 font-semibold">0.6%/tháng</strong> • Duyệt hồ sơ nhanh 24h
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 text-xs">
            <a 
              href="tel:0583345345" 
              className="flex items-center gap-1.5 font-semibold text-white hover:text-amber-300 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>Hotline 24/7: <strong>0583.345.345</strong></span>
            </a>
            
            <button
              onClick={onOpenAdminLeads}
              className={`relative flex items-center gap-1.5 px-2.5 py-1 rounded-md font-medium transition-all text-xs border cursor-pointer ${
                isLoggedIn
                  ? 'bg-emerald-900/90 text-emerald-200 border-emerald-500/50 hover:bg-emerald-900 hover:text-white'
                  : 'bg-white/15 hover:bg-white/25 text-white border-white/20'
              }`}
              title={isLoggedIn ? "Mở Trung Tâm Quản Trị" : "Đăng nhập Cổng Quản Trị Viên Vay365"}
            >
              <Users className="w-3.5 h-3.5 text-emerald-200" />
              <span>{isLoggedIn ? 'Admin Vay365' : '🔒 Quản Trị (Admin)'}</span>
              {isLoggedIn && newLeadsCount > 0 && (
                <span className="bg-amber-400 text-emerald-950 font-bold px-1.5 py-0.2 rounded-full text-[10px]">
                  {newLeadsCount} mới
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('hero')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-600/20 group-hover:scale-105 transition-transform">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-0.5">
                <span className="text-2xl font-black tracking-tight text-emerald-950">Vay</span>
                <span className="text-2xl font-black tracking-tight text-emerald-600">365</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-500 tracking-wider uppercase">
                Tư Vấn Vay & Tính Lãi Suất
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <button
              onClick={() => handleNavClick('calculator')}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>Tính Lãi Dư Nợ Giảm Dần</span>
            </button>
            <button
              onClick={() => handleNavClick('packages')}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <BadgePercent className="w-4 h-4 text-emerald-600" />
              <span>Gói Vay Ưu Đãi</span>
            </button>
            <button
              onClick={() => handleNavClick('faq')}
              className="flex items-center gap-1.5 text-sm font-semibold text-slate-700 hover:text-emerald-700 transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Hỏi Đáp</span>
            </button>
          </nav>

          {/* Desktop Right CTA */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenCalculator}
              className="px-4 py-2.5 rounded-lg border border-emerald-200 text-emerald-800 font-semibold text-sm hover:bg-emerald-50 hover:border-emerald-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Calculator className="w-4 h-4" />
              <span>Tính Lãi Suất</span>
            </button>
            <button
              onClick={onOpenLeadForm}
              className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center gap-1.5 group cursor-pointer"
            >
              <span>Đăng Ký Vay Ngay</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenLeadForm}
              className="sm:hidden px-3 py-1.5 rounded-md bg-emerald-600 text-white font-semibold text-xs shadow-xs"
            >
              Đăng Ký Vay
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-emerald-100 bg-white px-4 pt-3 pb-5 space-y-2 shadow-lg animate-in slide-in-from-top duration-200">
          <button
            onClick={() => handleNavClick('calculator')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-slate-800 font-medium hover:bg-emerald-50 hover:text-emerald-800"
          >
            <span className="flex items-center gap-2.5">
              <Calculator className="w-4 h-4 text-emerald-600" />
              Công Cụ Tính Lãi Dư Nợ Giảm Dần
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => handleNavClick('lead-form-section')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-slate-800 font-medium hover:bg-emerald-50 hover:text-emerald-800"
          >
            <span className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Form Đăng Ký Tư Vấn Vay Vốn
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => handleNavClick('packages')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-slate-800 font-medium hover:bg-emerald-50 hover:text-emerald-800"
          >
            <span className="flex items-center gap-2.5">
              <BadgePercent className="w-4 h-4 text-emerald-600" />
              Các Gói Vay Ưu Đãi 2026
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>
          <button
            onClick={() => handleNavClick('faq')}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left text-slate-800 font-medium hover:bg-emerald-50 hover:text-emerald-800"
          >
            <span className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              Câu Hỏi Thường Gặp (FAQ)
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                onOpenAdminLeads();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-sm hover:bg-slate-200 cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-600" />
              <span>Quản Trị Admin (Quản Lý Leads)</span>
            </button>
            <button
              onClick={() => {
                onOpenLeadForm();
                setIsMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-emerald-600 text-white font-bold text-sm shadow-md shadow-emerald-600/25"
            >
              <span>Đăng Ký Nhận Tư Vấn Vay Ngay</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
