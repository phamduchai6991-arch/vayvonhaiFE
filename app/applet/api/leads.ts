import type { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'phamduchai6991@gmail.com';

// Initial leads fallback
const INITIAL_LEADS = [
  {
    id: 'LEAD-9082',
    fullName: 'Nguyễn Văn Hùng',
    phone: '0912345678',
    province: 'Nghệ An',
    loanAmount: 80000000,
    loanTenure: 24,
    loanPurpose: 'tin_chap_theo_luong',
    loanPurposeName: 'Vay Tín Chấp Theo Bảng Lương',
    monthlyIncome: 18000000,
    preferredContactTime: 'Buổi sáng (8h - 12h)',
    note: 'Nhận lương chuyển khoản Vietcombank 18tr/tháng, cần vay tín chấp sửa sang nhà',
    createdAt: '2026-08-21T08:30:00Z',
    status: 'new',
    source: 'Công cụ tính lãi'
  },
  {
    id: 'LEAD-8741',
    fullName: 'Trần Thị Mai Phương',
    phone: '0987654321',
    province: 'Hà Nội',
    loanAmount: 50000000,
    loanTenure: 18,
    loanPurpose: 'tin_chap_tieu_dung',
    loanPurposeName: 'Vay Tín Chấp Tiêu Dùng Cá Nhân',
    monthlyIncome: 15000000,
    preferredContactTime: 'Bất kỳ lúc nào',
    note: 'Vay tín chấp tiêu dùng cá nhân không thế chấp',
    createdAt: '2026-08-21T04:15:00Z',
    status: 'contacted',
    adminNote: 'Đã gọi tư vấn, khách hẹn gửi sao kê lương qua Zalo chiều nay',
    source: 'Form trang chủ'
  },
  {
    id: 'LEAD-7319',
    fullName: 'Lê Hoàng Nam',
    phone: '0903456789',
    province: 'TP. Hồ Chí Minh',
    loanAmount: 100000000,
    loanTenure: 36,
    loanPurpose: 'tin_chap_kinh_doanh',
    loanPurposeName: 'Vay Tín Chấp Hộ Kinh Doanh',
    monthlyIncome: 30000000,
    preferredContactTime: 'Buổi chiều (13h30 - 17h30)',
    note: 'Kinh doanh cửa hàng tạp hóa, cần vốn nhập hàng không thế chấp',
    createdAt: '2026-08-20T14:40:00Z',
    status: 'approved',
    adminNote: 'Đã duyệt hồ sơ tín chấp 100tr kỳ hạn 36 tháng',
    source: 'Gói vay tín chấp KD'
  }
];

// Helper to get stored leads (checks /tmp on serverless environments)
function getLeads(): any[] {
  const tmpFile = path.join('/tmp', 'leads_db.json');
  try {
    if (fs.existsSync(tmpFile)) {
      const data = fs.readFileSync(tmpFile, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }

  const localFile = path.join(process.cwd(), 'data', 'leads_db.json');
  try {
    if (fs.existsSync(localFile)) {
      const data = fs.readFileSync(localFile, 'utf-8');
      return JSON.parse(data);
    }
  } catch {
    // ignore
  }

  return INITIAL_LEADS;
}

// Helper to save stored leads
function saveLeads(leads: any[]) {
  const tmpFile = path.join('/tmp', 'leads_db.json');
  try {
    fs.writeFileSync(tmpFile, JSON.stringify(leads, null, 2), 'utf-8');
  } catch {
    // ignore
  }

  const localFile = path.join(process.cwd(), 'data', 'leads_db.json');
  try {
    fs.writeFileSync(localFile, JSON.stringify(leads, null, 2), 'utf-8');
  } catch {
    // ignore
  }
}

// Helper to parse JSON body
function getBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
    });
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Send Email notification
async function sendNotificationEmail(lead: any, recipientEmail: string) {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 587;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const cleanPhone = String(lead.phone || '').replace(/\s+/g, '');
      const formattedAmount = new Intl.NumberFormat('vi-VN').format(lead.loanAmount || 0);

      await transporter.sendMail({
        from: `"Vay365 Thông Báo" <${smtpUser}>`,
        to: recipientEmail,
        subject: `🔥 [Vay365] Hồ sơ vay mới: ${lead.fullName} (${cleanPhone}) - ${formattedAmount}đ`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #065f46; margin-top: 0;">🔥 HỒ SƠ ĐĂNG KÝ VAY TÍN CHẤP MỚI</h2>
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
              <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 140px;">Họ và tên:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${lead.fullName}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Số điện thoại:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;"><a href="tel:${cleanPhone}">📞 ${cleanPhone}</a></td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Số tiền vay:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #059669; font-weight: bold;">${formattedAmount} VNĐ</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Kỳ hạn vay:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${lead.loanTenure} tháng</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Gói vay:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${lead.loanPurposeName || lead.loanPurpose}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Tỉnh/Thành:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${lead.province || 'Chưa cung cấp'}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Ghi chú:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${lead.notes || lead.note || 'Không có'}</td></tr>
              <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold;">Thời gian gửi:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${lead.createdAt || new Date().toLocaleString('vi-VN')}</td></tr>
            </table>
            <div style="margin-top: 15px;">
              <a href="tel:${cleanPhone}" style="display: inline-block; padding: 10px 20px; background: #059669; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold; margin-right: 10px;">📞 Gọi Khách Ngay</a>
              <a href="https://zalo.me/${cleanPhone}" style="display: inline-block; padding: 10px 20px; background: #0284c7; color: #fff; text-decoration: none; border-radius: 8px; font-weight: bold;">💬 Nhắn Zalo</a>
            </div>
          </div>
        `
      });
      return { success: true, method: 'server_smtp' };
    } catch (err: any) {
      console.error('Vercel serverless SMTP error:', err);
    }
  }

  // Fallback to relay
  try {
    const formData = new URLSearchParams();
    formData.append('_subject', `🔥 [VAY365] Khách mới: ${lead.fullName} (${lead.phone})`);
    formData.append('Họ và Tên', lead.fullName);
    formData.append('Số Điện Thoại', lead.phone);
    formData.append('Số Tiền Vay', `${new Intl.NumberFormat('vi-VN').format(lead.loanAmount || 0)} VNĐ`);
    formData.append('Kỳ Hạn Vay', `${lead.loanTenure} tháng`);
    formData.append('Tỉnh / Thành', lead.province || 'Chưa rõ');

    await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipientEmail)}`, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' },
    });
    return { success: true, method: 'cloud_relay' };
  } catch (err: any) {
    console.error('Relay error:', err);
    return { success: false, error: err?.message };
  }
}

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const url = req.url || '';

  // 1. SMTP verify
  if (url.includes('/smtp/verify')) {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    return res.status(200).json({
      success: !!(smtpUser && smtpPass),
      message: smtpUser && smtpPass ? 'Gmail SMTP đã được cấu hình' : 'Chưa cấu hình biến môi trường SMTP_USER / SMTP_PASS',
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
    });
  }

  // 2. GET leads
  if (req.method === 'GET') {
    const leads = getLeads();
    return res.status(200).json({ success: true, leads });
  }

  // 3. POST new lead
  if (req.method === 'POST') {
    const body = req.body || await getBody(req);
    const leadData = body.lead || body;

    if (!leadData || !leadData.fullName || !leadData.phone) {
      return res.status(400).json({ success: false, message: 'Dữ liệu khách hàng không hợp lệ' });
    }

    const leads = getLeads();
    const newLead = {
      ...leadData,
      id: leadData.id || `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: leadData.createdAt || new Date().toLocaleString('vi-VN'),
      status: leadData.status || 'new',
    };

    leads.unshift(newLead);
    saveLeads(leads);

    // Trigger email
    const emailResult = await sendNotificationEmail(newLead, DEFAULT_ADMIN_EMAIL);

    return res.status(201).json({
      success: true,
      lead: newLead,
      emailResult,
      message: 'Đã lưu hồ sơ thành công vào hệ thống quản trị!',
    });
  }

  // 4. PATCH update lead
  if (req.method === 'PATCH') {
    const body = req.body || await getBody(req);
    const id = req.query?.id || url.split('/').pop();
    const leads = getLeads();
    const idx = leads.findIndex((l) => l.id === id);

    if (idx === -1) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ' });
    }

    leads[idx] = { ...leads[idx], ...body };
    saveLeads(leads);
    return res.status(200).json({ success: true, lead: leads[idx] });
  }

  // 5. DELETE lead
  if (req.method === 'DELETE') {
    const id = req.query?.id || url.split('/').pop();
    let leads = getLeads();
    const initialLen = leads.length;
    leads = leads.filter((l) => l.id !== id);

    if (leads.length === initialLen) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ' });
    }

    saveLeads(leads);
    return res.status(200).json({ success: true, message: 'Đã xóa hồ sơ thành công' });
  }

  return res.status(405).json({ success: false, message: 'Method Not Allowed' });
}
