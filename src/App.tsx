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

const LEADS_STORAGE_KEY = 'duchai_fe_customer_leads';

export default function App() {
  // Authentication state
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => isAuthenticated());
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState<boolean>(false);
  const [isAdminLeadsOpen, setIsAdminLeadsOpen] = useState<boolean>(false);

  // Leads state with LocalStorage persistence
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

  const newLeadsCount = leads.filter((l) => l.status === 'new').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-emerald-600 selection:text-white flex flex-col relative">
      
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

        {/* 4. Lead Capture Form */}
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

        {/* 7. FAQ Section */}
        <FAQSection />

      </main>

      {/* 8. Footer */}
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

      {/* Modal: Full Admin Portal (Leads Management) */}
      <AdminLeadsModal
        isOpen={isAdminLeadsOpen}
        onClose={() => setIsAdminLeadsOpen(false)}
        onLogout={handleAdminLogout}
        leads={leads}
        onUpdateLeadStatus={handleUpdateLeadStatus}
        onDeleteLead={handleDeleteLead}
        onResetSampleLeads={handleResetSampleLeads}
      />

    </div>
  );
}
