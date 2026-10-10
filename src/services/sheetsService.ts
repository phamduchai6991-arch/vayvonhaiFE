import { Lead } from './types';

// Key for storing Google Apps Script Web App URL in localStorage
export const GOOGLE_SHEETS_WEBHOOK_KEY = 'vay365_google_sheets_webhook_url';

export function getGoogleSheetsWebhookUrl(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(GOOGLE_SHEETS_WEBHOOK_KEY);
    if (saved && saved.startsWith('http')) {
      return saved.trim();
    }
  }
  return '';
}

export function setGoogleSheetsWebhookUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(GOOGLE_SHEETS_WEBHOOK_KEY, url.trim());
  }
}

/**
 * Dispatch lead to Google Sheets Webhook via Apps Script
 */
export async function pushLeadToGoogleSheets(lead: Lead, customWebhookUrl?: string): Promise<{ success: boolean; message: string }> {
  const webhookUrl = customWebhookUrl || getGoogleSheetsWebhookUrl();
  if (!webhookUrl) {
    return { success: false, message: 'Chưa cấu hình Webhook URL của Google Sheets' };
  }

  try {
    const payload = {
      id: lead.id,
      timestamp: lead.createdAt || new Date().toLocaleString('vi-VN'),
      fullName: lead.fullName,
      phone: lead.phone,
      loanAmount: lead.loanAmount,
      loanTenure: lead.loanTenure,
      loanPurpose: lead.loanPurposeName || lead.loanPurpose,
      monthlyIncome: lead.monthlyIncome || '',
      province: lead.province,
      status: lead.status,
      notes: lead.notes || lead.note || '',
    };

    // Mode no-cors avoids CORS restriction when pushing to Google Apps Script
    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return {
      success: true,
      message: 'Đã đồng bộ hồ sơ vào Google Sheets thành công',
    };
  } catch (err: any) {
    console.warn('Google Sheets sync error:', err);
    return {
      success: false,
      message: `Lỗi đồng bộ Google Sheets: ${err?.message || 'Không thể kết nối'}`,
    };
  }
}
