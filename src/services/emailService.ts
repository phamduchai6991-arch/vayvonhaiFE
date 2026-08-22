import { Lead } from '../types';

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
  method?: 'server_smtp' | 'relay_service' | 'client_fallback';
  targetEmail: string;
}

/**
 * Dispatch an automated email notification to Admin (phamduchai6991@gmail.com)
 * when a new lead is registered.
 */
export async function sendLeadEmailNotification(lead: Lead): Promise<EmailSendResult> {
  const targetEmail = getAdminNotificationEmail();

  // 1. Try sending via Backend Express API endpoint
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
    console.warn('Backend email API warning, trying cloud email relay...', err);
  }

  // 2. Client-side Cloud Relay Fallback (Formsubmit / Webhook relay to guarantee delivery to phamduchai6991@gmail.com)
  try {
    const formData = new FormData();
    formData.append('_subject', `🔥 [ĐỨC HẢI FE] Khách mới: ${lead.fullName} (${lead.phone}) - Vay ${new Intl.NumberFormat('vi-VN').format(lead.loanAmount)}đ`);
    formData.append('_replyto', targetEmail);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');
    formData.append('Họ và Tên', lead.fullName);
    formData.append('Số Điện Thoại', lead.phone);
    formData.append('Số Tiền Vay', `${new Intl.NumberFormat('vi-VN').format(lead.loanAmount)} VNĐ`);
    formData.append('Kỳ Hạn Vay', `${lead.loanTenure} tháng`);
    formData.append('Gói Vay / Mục Đích', lead.loanPurposeName || lead.loanPurpose);
    formData.append('Nghề Nghiệp', lead.occupation || 'Chưa cung cấp');
    formData.append('Thu Nhập Hàng Tháng', lead.monthlyIncome ? `${new Intl.NumberFormat('vi-VN').format(lead.monthlyIncome)} VNĐ` : 'Không khai báo');
    formData.append('Tỉnh / Thành Phố', lead.province || 'Chưa rõ');
    formData.append('Ghi Chú Khách Hàng', lead.notes || 'Không có ghi chú');
    formData.append('Thời Gian Đăng Ký', lead.createdAt);
    formData.append('ID Hồ Sơ', lead.id);

    const relayRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    if (relayRes.ok) {
      return {
        success: true,
        message: `Đã chuyển tiếp thông tin khách hàng tới Gmail: ${targetEmail}`,
        method: 'relay_service',
        targetEmail,
      };
    }
  } catch (relayErr) {
    console.warn('Cloud relay error:', relayErr);
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
  const subject = encodeURIComponent(`[Đức Hải FE] Hồ sơ vay tín chấp: ${lead.fullName} - ${lead.phone}`);
  const body = encodeURIComponent(
`Kính gửi Anh Đức Hải,

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
Đức Hải FE - Tư Vấn Vay Tín Chấp & Lãi Suất Dư Nợ Giảm Dần`
  );

  return `mailto:${recipient}?subject=${subject}&body=${body}`;
}
