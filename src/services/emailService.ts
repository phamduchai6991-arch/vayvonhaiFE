import { Lead } from '../types';
import { sendLeadToCloudRelay } from './cloudRelayService';

export const DEFAULT_ADMIN_EMAIL = 'phamduchai6991@gmail.com';
export const ADMIN_EMAIL_STORAGE_KEY = 'duchai_fe_admin_notification_email';

export function getAdminNotificationEmail(): string {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(ADMIN_EMAIL_STORAGE_KEY);
    if (saved && saved.includes('@')) {
      return saved.trim();
    }
  }
  return DEFAULT_ADMIN_EMAIL;
}

export function setAdminNotificationEmail(email: string): void {
  if (typeof window !== 'undefined' && email && email.includes('@')) {
    localStorage.setItem(ADMIN_EMAIL_STORAGE_KEY, email.trim());
  }
}

export interface EmailSendResult {
  success: boolean;
  message: string;
  method?: 'server_smtp' | 'relay_service' | 'client_fallback' | string;
  targetEmail: string;
}

/**
 * Dispatch an automated email notification to Admin (phamduchai6991@gmail.com)
 * when a new lead is registered.
 */
export async function sendLeadEmailNotification(lead: Lead): Promise<EmailSendResult> {
  const targetEmail = getAdminNotificationEmail();

  // 1. Direct Cloud Relay First (Guaranteed to work on Netlify & static hosts without Node.js backend)
  try {
    const cloudRes = await sendLeadToCloudRelay(lead, targetEmail);
    if (cloudRes.success) {
      return {
        success: true,
        message: cloudRes.message,
        method: cloudRes.method,
        targetEmail,
      };
    }
  } catch (cloudErr) {
    console.warn('Cloud relay dispatch error, trying backend API:', cloudErr);
  }

  // 2. Try sending via Backend Express API endpoint (if running on Node.js)
  try {
    const res = await fetch('/api/leads/notify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        lead,
        targetEmail,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return {
        success: true,
        message: data.message || `Đã gửi thông báo lead tới ${targetEmail}`,
        method: data.method || 'server_smtp',
        targetEmail,
      };
    }
  } catch (err) {
    console.warn('Backend email API warning:', err);
  }

  return {
    success: false,
    message: `Đã lưu hồ sơ vào hệ thống nội bộ. Bạn có thể mở Gmail gửi thủ công.`,
    method: 'client_fallback',
    targetEmail,
  };
}

/**
 * Generate a mailto: URL with full lead details so Admin can open Gmail with 1 click
 */
export function generateLeadMailtoUrl(lead: Lead, recipient: string = DEFAULT_ADMIN_EMAIL): string {
  const subject = encodeURIComponent(`[Vay365] Hồ sơ vay tín chấp: ${lead.fullName} - ${lead.phone}`);
  const body = encodeURIComponent(
`Kính gửi Ban Quản Trị Vay365,

Hệ thống vừa ghi nhận hồ sơ đăng ký vay tín chấp mới:

- Họ và tên: ${lead.fullName}
- Số điện thoại: ${lead.phone}
- Số tiền vay: ${new Intl.NumberFormat('vi-VN').format(lead.loanAmount)} VNĐ
- Kỳ hạn vay: ${lead.loanTenure} tháng
- Gói vay: ${lead.loanPurposeName || lead.loanPurpose}
- Nghề nghiệp: ${lead.occupation || 'Chưa cung cấp'}
- Thu nhập: ${lead.monthlyIncome ? new Intl.NumberFormat('vi-VN').format(lead.monthlyIncome) + ' VNĐ' : 'Chưa cung cấp'}
- Tỉnh/Thành: ${lead.province || 'Chưa cung cấp'}
- Ghi chú: ${lead.notes || 'Không có'}
- Thời gian: ${lead.createdAt}
- Mã hồ sơ: ${lead.id}

---
Vay365 - Tư Vấn Vay Tín Chấp & Lãi Suất Dư Nợ Giảm Dần`
  );

  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}
