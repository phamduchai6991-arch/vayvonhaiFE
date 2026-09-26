import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { LoanCalculator } from './components/LoanCalculator';
import { LeadCaptureForm } from './components/LeadCaptureForm';
import { LoanPackages } from './components/LoanPackages';
import { ProcessSteps } from './components/ProcessSteps';
import { FAQSection } from './components/FAQSection';
import { AdminLeadsModal } from './components/AdminLeadsModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Footer } from './components/Footer';
import { FloatingActions } from './components/FloatingActions';
import { CalculationMethod, Lead, LeadStatus, LoanPackage, LoanPurpose } from './types';
import { INITIAL_LEADS } from './data/constants';
import { isAuthenticated, logout } from './services/authService';
import { recordPageView, recordLeadSubmission } from './services/analyticsService';
import { 
  fetchAllLeads, 
  updateLead, 
  deleteLead, 
  resetServerLeads 
} from './services/leadService';

const LEADS_STORAGE_KEY = 'duchai_fe_customer_leads';

export default function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => isAuthenticated());
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminLeadsOpen, setIsAdminLeadsOpen] = useState<boolean>(false);

  // Leads state with LocalStorage + Server persistence
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

  // Fetch real persistent leads from server on startup
  useEffect(() => {
    fetchAllLeads().then((serverLeads) => {
      if (serverLeads && serverLeads.length > 0) {
        setLeads(serverLeads);
      }
    });
  }, []);

  // Synchronize with local storage as instant client cache
  useEffect(() => {
    try {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
    } catch {
      // Ignore quota errors
    }
  }, [leads]);

  // Record pageview & unique visitor for SEO & performance measurement
  useEffect(() => {
    recordPageView();
  }, []);

  // Admin portal entry handler - gated by auth check
  const handleOpenAdminPortal = () => {
    // Refresh leads on open
    handleRefreshLeads();

    if (isAuthenticated()) {
      setIsLoggedIn(true);
      setIsAdminLeadsOpen(true);
    } else {
      setIsLoggedIn(false);
      setIsAdminLoginOpen(true);
    }
  };

  const handleLoginSuccess = () => {
    handleRefreshLeads();
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
    recordLeadSubmission();
    setLeads((prev) => [newLead, ...prev.filter((l) => l.id !== newLead.id)]);
  };

  // Update lead status in Admin Modal
  const handleUpdateLeadStatus = async (
    leadId: string, 
    status: LeadStatus, 
    adminNote?: string
  ) => {
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

    // Persist changes to server
    await updateLead(leadId, {
      status,
      adminNote,
    });
  };

  // Delete a lead
  const handleDeleteLead = async (leadId: string) => {
    setLeads((prev) => prev.filter((item) => item.id !== leadId));
    await deleteLead(leadId);
  };

  // Reset sample leads
  const handleResetSampleLeads = async () => {
    const resetLeads = await resetServerLeads();
    setLeads(resetLeads && resetLeads.length > 0 ? resetLeads : INITIAL_LEADS);
  };

  // Refresh latest leads from server
  const handleRefreshLeads = async () => {
    const latest = await fetchAllLeads();
    if (latest && latest.length > 0) {
      setLeads(latest);
    }
  };

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-600 selection:text-white flex flex-col relative">
      
      {/* 1. Header with navigation, live lead counter, and admin trigger */}
      <Header
        onOpenCalculator={() => scrollToSection('calculator')}
        onOpenForm={() => scrollToSection('lead-form-section')}
        onOpenPackages={() => scrollToSection('packages')}
        onOpenProcess={() => scrollToSection('process')}
        onOpenFAQ={() => scrollToSection('faq')}
        onOpenAdminLeads={handleOpenAdminPortal}
        leadsCount={newLeadsCount}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <HeroSection
          onApplyClick={() => scrollToSection('lead-form-section')}
          onCalculateClick={() => scrollToSection('calculator')}
        />

        {/* 3. Interactive Loan Calculator */}
        <LoanCalculator onApplyLoan={handleApplyFromCalculator} />

        {/* 4. Lead Capture Form */}
        <LeadCaptureForm
          initialAmount={formPrefillAmount}
          initialTerm={formPrefillTerm}
          initialPurpose={formPrefillPurpose}
          onSubmitSuccess={handleNewLeadSubmit}
        />

        {/* 5. Loan Packages Showcase */}
        <LoanPackages onSelectPackage={handleSelectPackage} />

        {/* 6. Simple 4-Step Process */}
        <ProcessSteps onStartNow={() => scrollToSection('lead-form-section')} />

        {/* 7. Comprehensive FAQ */}
        <FAQSection onAskQuestion={() => scrollToSection('lead-form-section')} />
      </main>

      {/* Footer */}
      <Footer
        onNavigateSection={scrollToSection}
        onOpenAdminLeads={handleOpenAdminPortal}
      />

      {/* 9. Floating Actions (Zalo, Hotline, Scroll to top) */}
      <FloatingActions
        onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        onScrollToForm={() => scrollToSection('lead-form-section')}
        onScrollToCalculator={() => scrollToSection('calculator')}
      />

      {/* Modal: Admin Login & Authentication */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Modal: Full Admin Portal (Leads Management, Google Sheets & Sales Distribution) */}
      <AdminLeadsModal
        isOpen={isAdminLeadsOpen}
        onClose={() => setIsAdminLeadsOpen(false)}
        onLogout={handleAdminLogout}
        leads={leads}
        onUpdateLeadStatus={handleUpdateLeadStatus}
        onDeleteLead={handleDeleteLead}
        onResetSampleLeads={handleResetSampleLeads}
        onRefreshLeads={handleRefreshLeads}
      />

    </div>
  );
}
