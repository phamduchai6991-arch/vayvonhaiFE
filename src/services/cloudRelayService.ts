import { Lead } from '../types';
import { pushLeadToGoogleSheets } from './sheetsService';

/**
 * Universal Multi-Channel Dispatcher:
 * 1. Native Netlify Forms Submission (Stores in Netlify Dashboard & triggers Netlify Email Notification)
 * 2. Netlify Serverless Function (Calls /api/notify or /.netlify/functions/notify)
 * 3. FormSubmit.co API (Form-encoded delivery to phamduchai6991@gmail.com)
 * 4. Google Sheets Sync (If Webhook URL is set)
 */
export async function sendLeadToCloudRelay(
  lead: Lead,
  targetEmail: string
): Promise<{ success: boolean; message: string; method: string }> {
  const formattedAmount = new Intl.NumberFormat('vi-VN').format(lead.loanAmount || 0);
  const formattedIncome = lead.monthlyIncome
    ? new Intl.NumberFormat('vi-VN').format(lead.monthlyIncome) + ' VNĐ'
    : 'Chưa cung cấp';
  const phoneClean = String(lead.phone || '').trim();

  let isDispatched = false;
  let primaryMethod = 'client_fallback';

  // CHANNEL 1: Native Netlify Forms (Build-in to Netlify, 100% reliable without rate limit)
  try {
    const netlifyFormData = new URLSearchParams();
    netlifyFormData.append('form-name', 'vay365-leads');
    netlifyFormData.append('fullName', lead.fullName);
    netlifyFormData.append('phone', phoneClean);
    netlifyFormData.append('loanAmount', `${formattedAmount} VNĐ`);
    netlifyFormData.append('loanTenure', `${lead.loanTenure} tháng`);
    netlifyFormData.append('loanPurpose', lead.loanPurposeName || lead.loanPurpose);
    netlifyFormData.append('monthlyIncome', formattedIncome);
    netlifyFormData.append('province', lead.province || 'Chưa rõ');
    netlifyFormData.append('notes', lead.notes || lead.note || '');
    netlifyFormData.append('createdAt', lead.createdAt || new Date().toLocaleString('vi-VN'));
    netlifyFormData.append('leadId', lead.id);

    const netlifyRes = await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: netlifyFormData.toString(),
    });

    if (netlifyRes.ok) {
      isDispatched = true;
      primaryMethod = 'Netlify Forms';
    }
  } catch (netlifyErr) {
    console.warn('Netlify Forms submission warning:', netlifyErr);
  }

  // CHANNEL 2: Netlify Function Endpoint (/.netlify/functions/notify)
  try {
    const fnRes = await fetch('/.netlify/functions/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lead }),
    });
    if (fnRes.ok) {
      isDispatched = true;
      primaryMethod = 'Netlify Function';
    }
  } catch (fnErr) {
    console.warn('Netlify Function endpoint warning:', fnErr);
  }

  // CHANNEL 3: FormSubmit.co Form Data (Direct Email Delivery)
  try {
    const formData = new FormData();
    formData.append('_subject', `🔥 [VAY365] Khách mới: ${lead.fullName} (${phoneClean}) - Vay ${formattedAmount}đ`);
    formData.append('_replyto', targetEmail);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');
    formData.append('Họ và Tên', lead.fullName);
    formData.append('Số Điện Thoại', phoneClean);
    formData.append('Số Tiền Vay', `${formattedAmount} VNĐ`);
    formData.append('Kỳ Hạn Vay', `${lead.loanTenure} tháng`);
    formData.append('Gói Vay / Mục Đích', lead.loanPurposeName || lead.loanPurpose);
    formData.append('Nghề Nghiệp', lead.occupation || 'Chưa cung cấp');
    formData.append('Thu Nhập Hàng Tháng', formattedIncome);
    formData.append('Tỉnh / Thành Phố', lead.province || 'Chưa rõ');
    formData.append('Ghi Chú Khách Hàng', lead.notes || lead.note || 'Không có');
    formData.append('Thời Gian Đăng Ký', lead.createdAt || new Date().toLocaleString('vi-VN'));
    formData.append('Mã Hồ Sơ', lead.id);

    const formsubmitRes = await fetch(`https://formsubmit.co/${encodeURIComponent(targetEmail)}`, {
      method: 'POST',
      body: formData,
      mode: 'no-cors', // Guarantees browser doesn't block cross-origin request
    });

    isDispatched = true;
    if (primaryMethod === 'client_fallback') {
      primaryMethod = 'FormSubmit Relay';
    }
  } catch (fsErr) {
    console.warn('Formsubmit relay warning:', fsErr);
  }

  // CHANNEL 4: Google Sheets (If webhook configured)
  try {
    await pushLeadToGoogleSheets(lead);
  } catch (sheetsErr) {
    console.warn('Google sheets sync warning:', sheetsErr);
  }

  return {
    success: isDispatched,
    message: isDispatched
      ? `Đã chuyển tiếp hồ sơ khách hàng tới email ${targetEmail}`
      : 'Đã lưu hồ sơ vào hệ thống nội bộ',
    method: primaryMethod,
  };
}
