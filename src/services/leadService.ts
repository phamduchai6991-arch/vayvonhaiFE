import { Lead, LeadStatus } from '../types';
import { INITIAL_LEADS } from '../data/constants';

const LOCAL_STORAGE_KEY = 'duchai_fe_customer_leads';

/**
 * Fetch all customer leads from backend server persistent storage.
 * Fallbacks to local storage if network fails.
 */
export async function fetchAllLeads(): Promise<Lead[]> {
  try {
    const res = await fetch('/api/leads');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.leads)) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.leads));
        }
        return data.leads;
      }
    }
  } catch (err) {
    console.warn('Cannot fetch leads from server, using local storage cache:', err);
  }

  // Fallback to local storage
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
  }
  return INITIAL_LEADS;
}

/**
 * Save new lead to backend database and trigger email notification
 */
export async function submitLead(lead: Lead): Promise<{ success: boolean; lead: Lead; emailResult?: any }> {
  try {
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.lead) {
        updateLocalLeadsCache(data.lead);
        return { success: true, lead: data.lead, emailResult: data.emailResult };
      }
    }
  } catch (err) {
    console.warn('Server save lead error, persisting locally:', err);
  }

  // Local fallback
  updateLocalLeadsCache(lead);
  return { success: true, lead };
}

/**
 * Diagnostic check for Gmail SMTP connectivity
 */
export async function verifySmtpConnection(): Promise<{ success: boolean; message: string; host?: string; port?: number }> {
  try {
    const res = await fetch('/api/smtp/verify');
    const data = await res.json();
    return {
      success: data.success,
      message: data.message || (data.success ? 'Kết nối Gmail SMTP thành công' : 'Không thể kết nối Gmail SMTP'),
      host: data.host,
      port: data.port,
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Không thể kết nối máy chủ: ${err?.message || 'Lỗi mạng'}`,
    };
  }
}

function updateLocalLeadsCache(newLead: Lead) {
  if (typeof window === 'undefined') return;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    const leads: Lead[] = saved ? JSON.parse(saved) : INITIAL_LEADS;
    const exists = leads.some(l => l.id === newLead.id);
    const updated = exists ? leads.map(l => l.id === newLead.id ? newLead : l) : [newLead, ...leads];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore
  }
}

/**
 * Update lead properties (Status, AdminNote)
 */
export async function updateLead(leadId: string, updates: Partial<Lead>): Promise<Lead | null> {
  try {
    const res = await fetch(`/api/leads/${encodeURIComponent(leadId)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.lead) {
        syncLocalLeadUpdate(data.lead);
        return data.lead;
      }
    }
  } catch (err) {
    console.warn('Server update error, updating local cache:', err);
  }

  // Local fallback
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const leads: Lead[] = JSON.parse(saved);
        const target = leads.find(l => l.id === leadId);
        if (target) {
          const updated = { ...target, ...updates };
          const newLeads = leads.map(l => l.id === leadId ? updated : l);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLeads));
          return updated;
        }
      }
    } catch {
      // Ignore
    }
  }
  return null;
}

function syncLocalLeadUpdate(updatedLead: Lead) {
  if (typeof window === 'undefined') return;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const leads: Lead[] = JSON.parse(saved);
      const newLeads = leads.map(l => l.id === updatedLead.id ? updatedLead : l);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newLeads));
    }
  } catch {
    // Ignore
  }
}

/**
 * Delete a lead
 */
export async function deleteLead(leadId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/leads/${encodeURIComponent(leadId)}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      removeLocalLead(leadId);
      return true;
    }
  } catch (err) {
    console.warn('Server delete error:', err);
  }

  removeLocalLead(leadId);
  return true;
}

function removeLocalLead(leadId: string) {
  if (typeof window === 'undefined') return;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      const leads: Lead[] = JSON.parse(saved);
      const filtered = leads.filter(l => l.id !== leadId);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch {
    // Ignore
  }
}

/**
 * Reset server leads database to initial sample dataset
 */
export async function resetServerLeads(): Promise<Lead[]> {
  try {
    const res = await fetch('/api/leads/reset', { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.leads)) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.leads));
        }
        return data.leads;
      }
    }
  } catch (err) {
    console.warn('Server reset error:', err);
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
  }
  return INITIAL_LEADS;
}

/**
 * Export Leads directly to CSV file formatted for Excel
 */
export function exportLeadsToCSV(leads: Lead[], filename = 'Danh_Sach_Khach_Vay_Tin_Chap.csv') {
  const headers = [
    'Mã Lead',
    'Thời Gian Tạo',
    'Họ Và Tên',
    'Số Điện Thoại',
    'Số Tiền Vay (VND)',
    'Kỳ Hạn (Tháng)',
    'Gói Vay / Mục Đích',
    'Thu Nhập Hàng Tháng',
    'Tỉnh / Thành Phố',
    'Trạng Thái',
    'Ghi Chú Khách',
    'Ghi Chú Nội Bộ',
  ];

  const escapeCSV = (str: string | number | undefined) => {
    if (str === undefined || str === null) return '""';
    const clean = String(str).replace(/"/g, '""');
    return `"${clean}"`;
  };

  const getStatusText = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'Mới';
      case 'contacted': return 'Đã liên hệ';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  const rows = leads.map((lead) => [
    escapeCSV(lead.id),
    escapeCSV(lead.createdAt),
    escapeCSV(lead.fullName),
    escapeCSV(`'${lead.phone}`), // Keep leading 0
    escapeCSV(lead.loanAmount),
    escapeCSV(lead.loanTenure),
    escapeCSV(lead.loanPurposeName || lead.loanPurpose),
    escapeCSV(lead.monthlyIncome ? lead.monthlyIncome : 'Không khai báo'),
    escapeCSV(lead.province),
    escapeCSV(getStatusText(lead.status)),
    escapeCSV(lead.notes || lead.note || ''),
    escapeCSV(lead.adminNote || ''),
  ]);

  // UTF-8 BOM (\uFEFF) ensures Excel correctly displays Vietnamese characters
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy leads table to clipboard (TSV format)
 */
export async function copyLeadsTable(leads: Lead[]): Promise<boolean> {
  const headers = [
    'Mã Lead',
    'Thời Gian',
    'Họ Và Tên',
    'Số Điện Thoại',
    'Số Tiền Vay',
    'Kỳ Hạn (tháng)',
    'Gói Vay',
    'Thu Nhập',
    'Tỉnh Thành',
    'Trạng Thái',
    'Ghi Chú Khách Hàng',
    'Ghi Chú Nội Bộ',
  ];

  const getStatusText = (status: LeadStatus) => {
    switch (status) {
      case 'new': return 'Mới';
      case 'contacted': return 'Đã liên hệ';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return status;
    }
  };

  const rows = leads.map(l => [
    l.id,
    l.createdAt,
    l.fullName,
    l.phone,
    new Intl.NumberFormat('vi-VN').format(l.loanAmount) + ' đ',
    l.loanTenure,
    l.loanPurposeName || l.loanPurpose,
    l.monthlyIncome ? new Intl.NumberFormat('vi-VN').format(l.monthlyIncome) + ' đ' : 'Chưa rõ',
    l.province,
    getStatusText(l.status),
    (l.notes || l.note || '').replace(/[\r\n\t]/g, ' '),
    (l.adminNote || '').replace(/[\r\n\t]/g, ' '),
  ]);

  const tsvText = [headers.join('\t'), ...rows.map(r => r.join('\t'))].join('\n');

  try {
    await navigator.clipboard.writeText(tsvText);
    return true;
  } catch (err) {
    console.error('Clipboard copy error:', err);
    return false;
  }
}
