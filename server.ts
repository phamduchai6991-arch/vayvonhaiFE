import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Persistent Storage Directories & Files
const DATA_DIR = path.join(process.cwd(), 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads_db.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config_db.json');

// Admin Notification Email (Default phamduchai6991@gmail.com)
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'phamduchai6991@gmail.com';

function initStorage() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(LEADS_FILE)) {
    const initialLeads = [
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
        source: 'Công cụ tính lãi',
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
        source: 'Form trang chủ',
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
        source: 'Gói vay tín chấp KD',
      },
    ];
    fs.writeFileSync(LEADS_FILE, JSON.stringify(initialLeads, null, 2), 'utf-8');
  }

  if (!fs.existsSync(CONFIG_FILE)) {
    const initialConfig = {
      adminEmail: DEFAULT_ADMIN_EMAIL,
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(initialConfig, null, 2), 'utf-8');
  }
}

function getStoredLeads() {
  try {
    initStorage();
    const data = fs.readFileSync(LEADS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading leads:', err);
    return [];
  }
}

function saveStoredLeads(leads: any[]) {
  try {
    initStorage();
    fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing leads:', err);
    return false;
  }
}

function getStoredConfig() {
  try {
    initStorage();
    const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    return {
      adminEmail: DEFAULT_ADMIN_EMAIL,
    };
  }
}

function saveStoredConfig(config: any) {
  try {
    initStorage();
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error saving config:', err);
    return false;
  }
}

// Function to trigger Email Notification via SMTP or Formsubmit Relay
async function triggerEmailNotification(lead: any, recipient = DEFAULT_ADMIN_EMAIL) {
  const formattedAmount = new Intl.NumberFormat('vi-VN').format(lead.loanAmount || 0);
  const formattedIncome = lead.monthlyIncome ? new Intl.NumberFormat('vi-VN').format(lead.monthlyIncome) + ' VNĐ' : 'Chưa cung cấp';
  const cleanPhone = String(lead.phone || '').trim();

  const textContent = `
THÔNG BÁO HỒ SƠ VAY TÍN CHẤP MỚI TỪ WEBSITE VAY365
==================================================
Họ và tên khách hàng: ${lead.fullName}
Số điện thoại: ${cleanPhone}
Số tiền đăng ký vay: ${formattedAmount} VNĐ
Kỳ hạn vay mong muốn: ${lead.loanTenure} tháng (${(lead.loanTenure / 12).toFixed(1)} năm)
Gói vay / Nhu cầu: ${lead.loanPurposeName || lead.loanPurpose}
Nghề nghiệp: ${lead.occupation || 'Chưa cung cấp'}
Thu nhập hàng tháng: ${formattedIncome}
Tỉnh / Thành phố: ${lead.province || 'Chưa cung cấp'}
Ghi chú từ khách: ${lead.notes || lead.note || 'Không có ghi chú thêm'}
Thời gian gửi: ${lead.createdAt || new Date().toLocaleString('vi-VN')}
Mã hồ sơ (Lead ID): ${lead.id}

Hành động nhanh:
- Gọi điện ngay: tel:${cleanPhone}
- Nhắn Zalo: https://zalo.me/${cleanPhone}
==================================================
Hệ thống Quản Trị Website Đức Hải FE - Vay365 (Hotline: 0583.345.345)
Địa chỉ nhận: ${recipient}
`.trim();

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; margin: 0; padding: 20px; color: #1e293b; }
        .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
        .header { background: linear-gradient(135deg, #065f46 0%, #047857 100%); color: #ffffff; padding: 24px; text-align: center; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { margin: 6px 0 0; font-size: 13px; color: #a7f3d0; }
        .badge { display: inline-block; background: #fbbf24; color: #78350f; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; margin-top: 10px; text-transform: uppercase; }
        .body-content { padding: 24px; }
        .info-table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        .info-table tr { border-bottom: 1px solid #f1f5f9; }
        .info-table td { padding: 10px 8px; font-size: 13px; }
        .info-table td.label { font-weight: 600; color: #64748b; width: 38%; }
        .info-table td.val { font-weight: 700; color: #0f172a; }
        .highlight-val { color: #047857; font-size: 16px; font-weight: 800; }
        .phone-val { color: #2563eb; font-size: 15px; font-weight: 800; text-decoration: none; }
        .action-box { margin-top: 24px; text-align: center; padding: 18px; background: #ecfdf5; border-radius: 12px; border: 1px solid #a7f3d0; }
        .btn-call { display: inline-block; background: #059669; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 14px; padding: 12px 28px; border-radius: 10px; margin: 6px 4px; box-shadow: 0 2px 6px rgba(5,150,105,0.3); }
        .btn-zalo { display: inline-block; background: #0284c7; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 14px; padding: 12px 28px; border-radius: 10px; margin: 6px 4px; box-shadow: 0 2px 6px rgba(2,132,199,0.3); }
        .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>🔔 CÓ KHÁCH HÀNG MỚI ĐĂNG KÝ VAY</h1>
          <p>Hệ thống Vay365 - Đức Hải FE ghi nhận hồ sơ vay tín chấp trực tuyến</p>
          <div class="badge">Hồ Sơ Mới Chờ Liên Hệ</div>
        </div>

        <div class="body-content">
          <table class="info-table">
            <tr>
              <td class="label">Họ và tên khách:</td>
              <td class="val highlight-val">${lead.fullName}</td>
            </tr>
            <tr>
              <td class="label">Số điện thoại:</td>
              <td class="val"><a href="tel:${cleanPhone}" class="phone-val">📞 ${cleanPhone} (Bấm để gọi)</a></td>
            </tr>
            <tr>
              <td class="label">Số tiền đăng ký vay:</td>
              <td class="val highlight-val">${formattedAmount} VNĐ</td>
            </tr>
            <tr>
              <td class="label">Kỳ hạn mong muốn:</td>
              <td class="val">${lead.loanTenure} tháng (${(lead.loanTenure / 12).toFixed(1)} năm)</td>
            </tr>
            <tr>
              <td class="label">Gói vay / Nhu cầu:</td>
              <td class="val">${lead.loanPurposeName || lead.loanPurpose}</td>
            </tr>
            <tr>
              <td class="label">Nghề nghiệp:</td>
              <td class="val">${lead.occupation || 'Chưa cung cấp'}</td>
            </tr>
            <tr>
              <td class="label">Thu nhập hàng tháng:</td>
              <td class="val">${formattedIncome}</td>
            </tr>
            <tr>
              <td class="label">Tỉnh / Thành phố:</td>
              <td class="val">${lead.province || 'Chưa cung cấp'}</td>
            </tr>
            <tr>
              <td class="label">Ghi chú từ khách:</td>
              <td class="val">${lead.notes || lead.note || 'Không có ghi chú thêm'}</td>
            </tr>
            <tr>
              <td class="label">Thời gian gửi:</td>
              <td class="val">${lead.createdAt || new Date().toLocaleString('vi-VN')}</td>
            </tr>
            <tr>
              <td class="label">Mã Lead:</td>
              <td class="val"><code>${lead.id}</code></td>
            </tr>
          </table>

          <div class="action-box">
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #065f46; font-weight: 600;">Hãy liên hệ tư vấn và giải đáp cho khách hàng sớm nhất!</p>
            <a href="tel:${cleanPhone}" class="btn-call">📞 GỌI NGAY: ${cleanPhone}</a>
            <a href="https://zalo.me/${cleanPhone}" class="btn-zalo" target="_blank">💬 NHẮN ZALO</a>
          </div>
        </div>

        <div class="footer">
          Email thông báo tự động từ website <strong>Đức Hải FE - Tư Vấn Vay Tín Chấp &amp; Lãi Suất Dư Nợ Giảm Dần</strong><br/>
          Hộp thư nhận: <strong>${recipient}</strong> | Hotline hỗ trợ: <strong>0583.345.345</strong>
        </div>
      </div>
    </body>
    </html>
  `;

  // Try SMTP first
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
        auth: { user: smtpUser, pass: smtpPass },
        connectionTimeout: 15000,
        greetingTimeout: 10000,
        socketTimeout: 20000,
      });

      const sendInfo = await transporter.sendMail({
        from: `"Vay365 - Đức Hải FE" <${smtpUser}>`,
        to: recipient,
        replyTo: recipient,
        subject: `🔥 [VAY365] Khách mới: ${lead.fullName} (${cleanPhone}) - Vay ${formattedAmount}đ`,
        text: textContent,
        html: htmlContent,
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'Importance': 'high',
        },
      });

      console.log(`✅ SMTP email sent successfully for ${lead.id} to ${recipient}, messageId: ${sendInfo.messageId}`);
      return { success: true, method: 'server_smtp', messageId: sendInfo.messageId };
    } catch (smtpErr: any) {
      console.warn('SMTP send error, falling back to relay:', smtpErr?.message || smtpErr);
    }
  }

  // Fallback via Formsubmit relay
  try {
    const formData = new URLSearchParams();
    formData.append('_subject', `🔥 [VAY365] Khách mới: ${lead.fullName} (${cleanPhone}) - Vay ${formattedAmount}đ`);
    formData.append('_replyto', recipient);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');
    formData.append('Họ và Tên', lead.fullName);
    formData.append('Số Điện Thoại', cleanPhone);
    formData.append('Số Tiền Vay', `${formattedAmount} VNĐ`);
    formData.append('Kỳ Hạn Vay', `${lead.loanTenure} tháng`);
    formData.append('Gói Vay', lead.loanPurposeName || lead.loanPurpose);
    formData.append('Nghề Nghiệp', lead.occupation || 'Chưa cung cấp');
    formData.append('Thu Nhập', formattedIncome);
    formData.append('Tỉnh / Thành', lead.province || 'Chưa cung cấp');
    formData.append('Ghi Chú', lead.notes || lead.note || 'Không');
    formData.append('Mã Hồ Sơ', lead.id);

    const relayRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: 'POST',
      body: formData,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (relayRes.ok) {
      const relayJson: any = await relayRes.json().catch(() => ({}));
      if (relayJson.success !== false) {
        return { success: true, method: 'relay_service' };
      }
    }
  } catch (relayErr: any) {
    console.error('Relay error:', relayErr?.message || relayErr);
  }

  return { success: false, method: 'failed' };
}

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// 1. Health check & SMTP diagnostics endpoint
app.get('/api/health', (req, res) => {
  const config = getStoredConfig();
  res.json({
    status: 'ok',
    adminEmail: config.adminEmail || DEFAULT_ADMIN_EMAIL,
    smtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
    smtpUser: process.env.SMTP_USER || null,
    timestamp: new Date().toISOString(),
  });
});

// 1.1 Verify SMTP connection directly
app.get('/api/smtp/verify', async (req, res) => {
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 587;

  if (!smtpUser || !smtpPass) {
    return res.status(400).json({
      success: false,
      message: 'Chưa cấu hình tài khoản SMTP (SMTP_USER hoặc SMTP_PASS thiếu)',
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
      connectionTimeout: 10000,
    });

    await transporter.verify();
    return res.json({
      success: true,
      message: `Kết nối thành công tới máy chủ Gmail SMTP (${smtpUser})`,
      host: smtpHost,
      port: smtpPort,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: `Lỗi kết nối Gmail SMTP: ${err?.message || err}`,
    });
  }
});

// 2. Get all persistent leads from server
app.get('/api/leads', (req, res) => {
  const leads = getStoredLeads();
  res.json({ success: true, leads });
});

// 3. Create new lead (Saves permanently to server + Sends Email with AWAIT)
app.post('/api/leads', async (req, res) => {
  const leadData = req.body.lead || req.body;

  if (!leadData || !leadData.fullName || !leadData.phone) {
    return res.status(400).json({ success: false, message: 'Dữ liệu khách hàng không hợp lệ' });
  }

  const leads = getStoredLeads();
  const config = getStoredConfig();

  const newLead = {
    ...leadData,
    id: leadData.id || `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: leadData.createdAt || new Date().toLocaleString('vi-VN'),
    status: leadData.status || 'new',
  };

  // Prepend new lead so newest is at the top
  leads.unshift(newLead);
  saveStoredLeads(leads);

  // Send Email Notification and AWAIT so Cloud Run/serverless doesn't cut CPU before delivery
  let emailResult: any = { success: false, method: 'none' };
  try {
    emailResult = await triggerEmailNotification(newLead, config.adminEmail || DEFAULT_ADMIN_EMAIL);
    console.log(`📧 Email delivery result for ${newLead.id}:`, emailResult);
  } catch (err: any) {
    console.error(`Email delivery error for ${newLead.id}:`, err);
    emailResult = { success: false, error: err?.message || 'Lỗi gửi mail' };
  }

  return res.status(201).json({
    success: true,
    lead: newLead,
    emailResult,
    message: emailResult?.success
      ? 'Đã lưu hồ sơ thành công & gửi email thông báo tới Quản Trị Viên!'
      : 'Đã lưu hồ sơ thành công vào hệ thống quản trị!',
  });
});

// 4. Update lead (Status, AdminNote)
app.patch('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  const leads = getStoredLeads();
  const idx = leads.findIndex((l: any) => l.id === id);

  if (idx === -1) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ khách hàng' });
  }

  leads[idx] = { ...leads[idx], ...updates };
  saveStoredLeads(leads);
  return res.json({ success: true, lead: leads[idx] });
});

// 5. Delete lead
app.delete('/api/leads/:id', (req, res) => {
  const { id } = req.params;
  let leads = getStoredLeads();
  const initialLength = leads.length;
  leads = leads.filter((l: any) => l.id !== id);

  if (leads.length === initialLength) {
    return res.status(404).json({ success: false, message: 'Không tìm thấy hồ sơ để xóa' });
  }

  saveStoredLeads(leads);
  return res.json({ success: true, message: 'Đã xóa hồ sơ thành công' });
});

// 6. Reset leads to sample data
app.post('/api/leads/reset', (req, res) => {
  if (fs.existsSync(LEADS_FILE)) {
    fs.unlinkSync(LEADS_FILE);
  }
  initStorage();
  const leads = getStoredLeads();
  return res.json({ success: true, leads });
});

// 7. Legacy notify endpoint
app.post('/api/leads/notify', async (req, res) => {
  const { lead, targetEmail = DEFAULT_ADMIN_EMAIL } = req.body;

  if (!lead || !lead.fullName || !lead.phone) {
    return res.status(400).json({ success: false, message: 'Dữ liệu khách hàng không hợp lệ' });
  }

  const result = await triggerEmailNotification(lead, targetEmail);
  return res.json({
    success: result.success,
    message: result.success ? `Đã gửi email thông báo tới ${targetEmail}` : 'Không thể gửi email tự động',
    method: result.method,
  });
});

// 8. Admin Password Reset OTP via Email
app.post('/api/admin/reset-otp', async (req, res) => {
  const { email = DEFAULT_ADMIN_EMAIL, otp } = req.body;

  if (!otp) {
    return res.status(400).json({ success: false, message: 'Thiếu mã OTP' });
  }

  const recipient = email || DEFAULT_ADMIN_EMAIL;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.SMTP_PORT) || 587;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; background: #fff; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
      <h2 style="color: #065f46; margin-top: 0;">🔐 MÃ XÁC THỰC QUẢN TRỊ VIÊN ĐỨC HẢI FE</h2>
      <p>Bạn vừa yêu cầu khôi phục / đặt lại mật khẩu cổng Quản trị Lead Đức Hải FE.</p>
      <div style="background: #f1f5f9; padding: 16px; border-radius: 8px; text-align: center; margin: 20px 0;">
        <span style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #047857;">${otp}</span>
      </div>
      <p style="font-size: 13px; color: #64748b;">Mã này có hiệu lực trong 15 phút. Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
      <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
      <p style="font-size: 11px; color: #94a3b8;">Hệ thống Bảo Mật Đức Hải FE - Tư Vấn Vay Tín Chấp</p>
    </div>
  `;

  if (smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass },
      });

      await transporter.sendMail({
        from: `"Đức Hải FE Security" <${smtpUser}>`,
        to: recipient,
        subject: `[MÃ OTP: ${otp}] Khôi phục mật khẩu quản trị Đức Hải FE`,
        html: htmlContent,
      });

      return res.json({ success: true, message: 'Đã gửi OTP qua email' });
    } catch (err) {
      console.error('SMTP OTP error:', err);
    }
  }

  // Fallback via Relay
  try {
    const formData = new URLSearchParams();
    formData.append('_subject', `[MÃ OTP: ${otp}] Khôi phục mật khẩu quản trị Đức Hải FE`);
    formData.append('_replyto', recipient);
    formData.append('Mã OTP Khôi Phục', otp);
    formData.append('Hạn Dùng', '15 Phút');

    await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  } catch (relayErr) {
    console.error('Relay OTP error:', relayErr);
  }

  return res.json({ success: true, message: 'Đã phát lệnh gửi OTP' });
});

// Vite middleware setup
async function start() {
  initStorage();

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Đức Hải FE server listening on http://0.0.0.0:${PORT}`);
    console.log(`📧 Admin Notification Email: ${DEFAULT_ADMIN_EMAIL}`);
  });
}

start();
