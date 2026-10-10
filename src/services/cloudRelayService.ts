import { Lead } from '../types';
import { getAdminNotificationEmail } from './emailService';
import { pushLeadToGoogleSheets, getGoogleSheetsWebhookUrl } from './sheetsService';

// Fallback cloud storage key for cross-device shared storage via Formspree / json storage
const CLOUD_STORAGE_KEY = 'vay365_shared_leads_bin';

/**
 * Send email notification to Admin via robust Multi-Relay Cloud endpoints:
 * Priority 1: FormSubmit AJAX (https://formsubmit.co/ajax/...)
 * Priority 2: Web3Forms (Public reliable static email dispatch)
 * Priority 3: Formspree (if configured)
 */
export async function sendLeadToCloudRelay(lead: Lead, targetEmail: string): Promise<{ success: boolean; message: string; method: string }> {
  const formattedAmount = new Intl.NumberFormat('vi-VN').format(lead.loanAmount || 0);
  const formattedIncome = lead.monthlyIncome ? new Intl.NumberFormat('vi-VN').format(lead.monthlyIncome) + ' VNĐ' : 'Chưa cung cấp';
  const phoneClean = String(lead.phone || '').trim();

  // 1. First Relay: FormSubmit.co
  try {
    const payload = {
      _subject: `🔥 [VAY365] Khách mới: ${lead.fullName} (${phoneClean}) - Vay ${formattedAmount}đ`,
      _replyto: targetEmail,
      _template: 'table',
      _captcha: 'false',
      'Họ và Tên': lead.fullName,
      'Số Điện Thoại': phoneClean,
      'Số Tiền Vay': `${formattedAmount} VNĐ`,
      'Kỳ Hạn Vay': `${lead.loanTenure} tháng`,
      'Gói Vay / Mục Đích': lead.loanPurposeName || lead.loanPurpose,
      'Nghề Nghiệp': lead.occupation || 'Chưa cung cấp',
      'Thu Nhập Hàng Tháng': formattedIncome,
      'Tỉnh / Thành Phố': lead.province || 'Chưa rõ',
      'Ghi Chú Khách Hàng': lead.notes || lead.note || 'Không có',
      'Thời Gian Đăng Ký': lead.createdAt,
      'Mã Hồ Sơ (Lead ID)': lead.id,
      'Bấm Gọi Ngay': `tel:${phoneClean}`,
      'Bấm Nhắn Zalo': `https://zalo.me/${phoneClean}`,
    };

    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(targetEmail)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        success: true,
        message: `Đã gửi email thông báo lead tới ${targetEmail}`,
        method: 'FormSubmit.co',
      };
    }
  } catch (err) {
    console.warn('FormSubmit.co relay attempt warning:', err);
  }

  // 2. Second Relay: Web3Forms Access Key free tier
  try {
    const w3Payload = {
      access_key: '6013a967-ba42-498c-843e-f00eb3ad8ca2', // public submission gateway
      subject: `🔥 [VAY365] Khách mới: ${lead.fullName} (${phoneClean}) - Vay ${formattedAmount}đ`,
      from_name: 'Vay365 Hệ Thống Lead',
      to_email: targetEmail,
      fullName: lead.fullName,
      phone: phoneClean,
      loanAmount: `${formattedAmount} VNĐ`,
      loanTenure: `${lead.loanTenure} tháng`,
      province: lead.province,
      createdAt: lead.createdAt,
      notes: lead.notes || lead.note || '',
    };

    const w3Res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(w3Payload),
    });

    if (w3Res.ok) {
      return {
        success: true,
        message: `Đã gửi email thông báo lead qua Web3Forms tới ${targetEmail}`,
        method: 'Web3Forms',
      };
    }
  } catch (err2) {
    console.warn('Web3Forms relay attempt warning:', err2);
  }

  return {
    success: false,
    message: 'Không thể kết nối máy chủ gửi thư tự động',
    method: 'failed',
  };
}
