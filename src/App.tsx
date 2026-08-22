import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LoanCalculator } from './components/LoanCalculator';
import { LeadCaptureForm } from './components/LeadCaptureForm';
import { LoanPackages } from './components/LoanPackages';
import { ProcessSteps } from './components/ProcessSteps';
import { TipsAndNews } from './components/TipsAndNews';
import { FAQSection } from './components/FAQSection';
import { ArticleDetailModal } from './components/ArticleDetailModal';
import { AdminLeadsModal } from './components/AdminLeadsModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { Article, CalculationMethod, Lead, LeadStatus, LoanPackage, LoanPurpose } from './types';
import { ARTICLES_DATA, INITIAL_LEADS } from './data/constants';
import { syncAndMergeArticles } from './services/newsCrawler';
import { isAuthenticated, logout } from './services/authService';
import { CheckCircle2, Sparkles } from 'lucide-react';

const LEADS_STORAGE_KEY = 'duchai_fe_customer_leads';
const ARTICLES_STORAGE_KEY = 'duchai_fe_published_articles';
const LAST_NEWS_SYNC_KEY = 'duchai_fe_last_news_sync';

export default function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => isAuthenticated());
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminLeadsOpen, setIsAdminLeadsOpen] = useState<boolean>(false);

  // 1. Leads state with LocalStorage persistence
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem(LEADS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return INITIAL_LEADS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    } catch {
      // Ignore quota errors
    }
  }, [leads]);

  // 2. Articles state with LocalStorage persistence (allows Admin to add/edit/delete news)
  const [articles, setArticles] = useState<Article[]>(() => {
    try {
      const saved = localStorage.getItem(ARTICLES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }
    return ARTICLES_DATA;
  });

  const [isSyncingNews, setIsSyncingNews] = useState<boolean>(false);
  const [lastNewsSync, setLastNewsSync] = useState<string>(() => {
    return localStorage.getItem(LAST_NEWS_SYNC_KEY) || '';
  });
  const [syncToastMessage, setSyncToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
    } catch {
      // Ignore quota errors
    }
  }, [articles]);

  // Daily News Sync Handler (Crawl latest finance/lending news from VN press)
  const handleSyncDailyNews = useCallback(async (isAuto = false) => {
    setIsSyncingNews(true);
    try {
      const { mergedArticles, newCount } = await syncAndMergeArticles(articles);
      setArticles(mergedArticles);
      const nowIso = new Date().toISOString();
      setLastNewsSync(nowIso);
      localStorage.setItem(LAST_NEWS_SYNC_KEY, nowIso);

      if (!isAuto || newCount > 0) {
        const msg = newCount > 0
          ? `Đã cập nhật ${newCount} bài báo tài chính & lãi suất mới nhất từ VnExpress, CafeF, VietNamNet!`
          : `Tin tức tài chính đã ở trạng thái mới nhất hôm nay.`;
        setSyncToastMessage(msg);
        setTimeout(() => setSyncToastMessage(null), 4500);
      }
    } catch (err) {
      console.error('Error syncing news:', err);
    } finally {
      setIsSyncingNews(false);
    }
  }, [articles]);

  // Auto-sync on mount if no sync recorded or last sync > 2 hours ago
  useEffect(() => {
    const lastSyncTime = localStorage.getItem(LAST_NEWS_SYNC_KEY);
    const now = Date.now();
    const twoHoursMs = 2 * 60 * 60 * 1000;

    if (!lastSyncTime || now - new Date(lastSyncTime).getTime() > twoHoursMs) {
      handleSyncDailyNews(true);
    }
  }, []);

  // Selected article for reading modal
  const [readingArticle, setReadingArticle] = useState<Article | null>(null);

  // Admin portal entry handler - gated by auth check
  const handleOpenAdminPortal = () => {
    if (isAuthenticated()) {
      setIsLoggedIn(true);
      setIsAdminLeadsOpen(true);
    } else {
      setIsLoggedIn(false);
      setIsAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setIsAdminLoginOpen(false);
    setIsAdminLeadsOpen(true);
  };

  const handleAdminLogout = () => {
    logout();
    setIsLoggedIn(false);
    setIsAdminLeadsOpen(false);
    setIsAdminLoginOpen(false);
  };

  // Prefilled parameters for LeadForm when user clicks from Calculator or Packages
  const [formPrefillAmount, setFormPrefillAmount] = useState<number>(100_000_000);
  const [formPrefillTerm, setFormPrefillTerm] = useState<number>(24);
  const [formPrefillPurpose, setFormPrefillPurpose] = useState<LoanPurpose>('tin_chap_tieu_dung');

  // Navigation smoothly to a section
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Handler when user applies from Calculator
  const handleApplyFromCalculator = (amount: number, termMonths: number, method: CalculationMethod) => {
    setFormPrefillAmount(amount);
    setFormPrefillTerm(termMonths);
    scrollToSection('lead-form-section');
  };

  // Handler when user selects a loan package
  const handleSelectPackage = (pkg: LoanPackage) => {
    setFormPrefillAmount(pkg.minAmount);
    setFormPrefillTerm(pkg.minTerm);
    setFormPrefillPurpose(pkg.purposeValue);
    scrollToSection('lead-form-section');
  };

  // Handle new lead submission
  const handleNewLeadSubmit = (newLead: Lead) => {
    setLeads((prev) => [newLead, ...prev]);
  };

  // Update lead status in Admin Modal
  const handleUpdateLeadStatus = (leadId: string, status: LeadStatus, adminNote?: string) => {
    setLeads((prev) =>
      prev.map((item) =>
        item.id === leadId
          ? {
              ...item,
              status,
              adminNote: adminNote !== undefined ? adminNote : item.adminNote,
            }
          : item
      )
    );
  };

  // Delete a lead
  const handleDeleteLead = (leadId: string) => {
    setLeads((prev) => prev.filter((item) => item.id !== leadId));
  };

  // Reset sample leads
  const handleResetSampleLeads = () => {
    setLeads(INITIAL_LEADS);
  };

  // Article Management Handlers for Admin
  const handleSaveArticle = (savedArticle: Article) => {
    setArticles((prev) => {
      const index = prev.findIndex((a) => a.id === savedArticle.id);
      if (index >= 0) {
        const updated = [...prev];
        updated[index] = savedArticle;
        return updated;
      }
      return [savedArticle, ...prev];
    });
  };

  const handleDeleteArticle = (articleId: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== articleId));
  };

  const handleToggleFeaturedArticle = (articleId: string) => {
    setArticles((prev) =>
      prev.map((a) =>
        a.id === articleId ? { ...a, featured: !a.featured } : a
      )
    );
  };

  const handleResetSampleArticles = () => {
    setArticles(ARTICLES_DATA);
  };

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-600 selection:text-white flex flex-col relative">
      
      {/* Dynamic Sync Toast Notification */}
      {syncToastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 animate-in slide-in-from-top-4 duration-300 max-w-md">
          <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xs font-semibold leading-snug">{syncToastMessage}</p>
        </div>
      )}

      {/* 1. Header with navigation, live lead counter, and admin trigger */}
      <Header
        onOpenCalculator={() => scrollToSection('calculator')}
        onOpenLeadForm={() => scrollToSection('lead-form-section')}
        onOpenAdminLeads={handleOpenAdminPortal}
        onNavigateSection={scrollToSection}
        leadsCount={leads.length}
        newLeadsCount={newLeadsCount}
        isLoggedIn={isLoggedIn}
        onLogout={handleAdminLogout}
      />

      {/* Main Page Content */}
      <main className="flex-1">
        
        {/* 2. Hero Section */}
        <HeroSection
          onScrollToCalculator={() => scrollToSection('calculator')}
          onScrollToForm={() => scrollToSection('lead-form-section')}
        />

        {/* 3. Declining Balance Loan Calculator */}
        <LoanCalculator onApplyLoan={handleApplyFromCalculator} />

        {/* 4. Lead Capture Form (Thu thập thông tin Tên, SDT, Tỉnh, Nhu cầu vay) */}
        <LeadCaptureForm
          initialAmount={formPrefillAmount}
          initialTerm={formPrefillTerm}
          initialPurpose={formPrefillPurpose}
          onSubmitSuccess={handleNewLeadSubmit}
        />

        {/* 5. Loan Packages Showcase */}
        <LoanPackages onSelectPackage={handleSelectPackage} />

        {/* 6. 4-Step Loan Process */}
        <ProcessSteps />

        {/* 7. Financial Tips & Market News with dynamic articles list & Admin access */}
        <TipsAndNews
          articles={articles}
          onSelectArticle={(article) => setReadingArticle(article)}
          onScrollToForm={() => scrollToSection('lead-form-section')}
          onOpenAdminArticles={handleOpenAdminPortal}
          onRefreshNews={() => handleSyncDailyNews(false)}
          isRefreshingNews={isSyncingNews}
          lastNewsSync={lastNewsSync}
        />

        {/* 8. FAQ Section */}
        <FAQSection />

      </main>

      {/* 9. Footer */}
      <Footer
        onNavigateSection={scrollToSection}
        onOpenAdminLeads={handleOpenAdminPortal}
      />

      {/* 10. Floating Actions (Zalo, Hotline, Scroll to top) */}
      <FloatingActions
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onScrollToForm={() => scrollToSection('lead-form-section')}
        onScrollToCalculator={() => scrollToSection('calculator')}
      />

      {/* Modal: Read Full Article */}
      <ArticleDetailModal
        article={readingArticle}
        onClose={() => setReadingArticle(null)}
        onConsultLoan={() => scrollToSection('lead-form-section')}
      />

      {/* Modal: Admin Login & Authentication (Password, PIN, OTP) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Modal: Full Admin Portal (Leads & News Articles Management) */}
      <AdminLeadsModal
        isOpen={isAdminLeadsOpen}
        onClose={() => setIsAdminLeadsOpen(false)}
        onLogout={handleAdminLogout}
        leads={leads}
        onUpdateLeadStatus={handleUpdateLeadStatus}
        onDeleteLead={handleDeleteLead}
        onResetSampleLeads={handleResetSampleLeads}
        articles={articles}
        onSaveArticle={handleSaveArticle}
        onDeleteArticle={handleDeleteArticle}
        onToggleFeaturedArticle={handleToggleFeaturedArticle}
        onResetSampleArticles={handleResetSampleArticles}
        onPreviewArticle={(art) => {
          setIsAdminLeadsOpen(false);
          setReadingArticle(art);
        }}
        onCrawlLiveNews={() => handleSyncDailyNews(false)}
        isCrawlingNews={isSyncingNews}
        lastNewsSync={lastNewsSync}
      />

    </div>
  );
}
