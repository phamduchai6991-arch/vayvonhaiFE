import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'phamduchai6991@gmail.com';
const SECRET_SALT = 'VAY365_SECURITY_TOKEN_SALT_2026_LEAD_DEFENSE';

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

let inMemoryLeads: any[] = [...INITIAL_LEADS];

function getStoredLeads(): any[] {
  const tmpFile = path.join('/tmp', 'leads_db.json');
  try {
    if (fs.existsSync(tmpFile)) {
      const data = fs.readFileSync(tmpFile, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryLeads = parsed;
        return inMemoryLeads;
      }
    }
  } catch {}
  return inMemoryLeads;
}

function saveLeadToStorage(newLead: any): any[] {
  const leads = getStoredLeads();
  const exists = leads.some((l: any) => l.id === newLead.id || (l.phone === newLead.phone && l.createdAt === newLead.createdAt));
  if (!exists) {
    leads.unshift(newLead);
    inMemoryLeads = leads;
    try {
      fs.writeFileSync(path.join('/tmp', 'leads_db.json'), JSON.stringify(leads, null, 2), 'utf-8');
    } catch {}
  }
  return leads;
}

// Chống Spam & Giới hạn tần suất
const recentSubmissions = new Map<string, number>();

function isSpamOrFlooding(phone: string, ip: string): boolean {
  const now = Date.now();
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > 5 * 60 * 1000) recentSubmissions.delete(key);
  }

  const phoneKey = `phone:${phone}`;
  if (recentSubmissions.has(phoneKey) && now - recentSubmissions.get(phoneKey)! < 3 * 60 * 1000) {
    return true;
  }

  if (ip && ip !== 'unknown') {
    const ipKey = `ip:${ip}`;
    if (recentSubmissions.has(ipKey) && now - recentSubmissions.get(ipKey)! < 10 * 1000) {
      return true;
    }
    recentSubmissions.set(ipKey, now);
  }

  recentSubmissions.set(phoneKey, now);
  return false;
}

// Kiểm tra chữ ký bảo mật Client-Server
function verifySecurityToken(token: string | undefined, clientTs: number | undefined): boolean {
  if (!token || !clientTs) return false;
  const now = Date.now();
  // Khách người thật mất ít nhất 2.5 giây để nhập form
  if (now - clientTs < 2500) return false;
  // Token tối đa 3 tiếng
  if (now - clientTs > 3 * 3600 * 1000) return false;

  const str = `${clientTs}:${SECRET_SALT}:${Math.floor(clientTs / 3600000)}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const expectedToken = `SEC-${Math.abs(hash).toString(36)}-${clientTs.toString(36)}`;
  return token === expectedToken;
}

function generateExcelCSV(leads: any[]): string {
  const headers = [
    'Mã Hồ Sơ',
    'Thời Gian Gửi',
    'Họ Và Tên',
    'Số Điện Thoại',
    'Số Tiền Vay (VNĐ)',
    'Kỳ Hạn (Tháng)',
    'Gói Vay / Mục Đích',
    'Thu Nhập Hàng Tháng',
    'Tỉnh / Thành Phố',
    'Trạng Thái',
    'Ghi Chú Khách',
    'Ghi Chú Quản Trị',
  ];

  const escapeCSV = (val: any) => {
    if (val === undefined || val === null) return '""';
    return `"${String(val).replace(/"/g, '""')}"`;
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Chưa gọi (Mới)';
      case 'contacted': return 'Đã liên hệ tư vấn';
      case 'approved': return 'Đã duyệt giải ngân';
      case 'rejected': return 'Từ chối';
      default: return status || 'Mới';
    }
  };

  const rows = leads.map((lead: any) => [
    escapeCSV(lead.id || ''),
    escapeCSV(lead.createdAt || ''),
    escapeCSV(lead.fullName || ''),
    escapeCSV(`'${lead.phone || ''}`),
    escapeCSV(new Intl.NumberFormat('vi-VN').format(lead.loanAmount || 0)),
    escapeCSV(lead.loanTenure || 24),
    escapeCSV(lead.loanPurposeName || lead.loanPurpose || 'Vay Tín Chấp'),
    escapeCSV(lead.monthlyIncome ? new Intl.NumberFormat('vi-VN').format(Number(lead.monthlyIncome) || 0) : 'Không khai báo'),
    escapeCSV(lead.province || 'Chưa cung cấp'),
    escapeCSV(getStatusText(lead.status)),
    escapeCSV(lead.notes || lead.note || ''),
    escapeCSV(lead.adminNote || ''),
  ]);

  return '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const url = req.url || '';

  // 1. Kiểm tra trạng thái SMTP
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

  // 2. Xuất file Excel (.csv chuẩn tiếng Việt)
  if (req.method === 'GET' && (url.includes('export=excel') || url.includes('export=csv') || req.query?.export)) {
    const leads = getStoredLeads();
    const csvData = generateExcelCSV(leads);
    const filename = `Vay365_Danh_Sach_Ho_So_${new Date().toISOString().slice(0, 10)}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csvData);
  }

  // 3. Lấy danh sách hồ sơ JSON
  if (req.method === 'GET') {
    const leads = getStoredLeads();
    return res.status(200).json({
      success: true,
      total: leads.length,
      leads,
      message: 'Danh sách hồ sơ khách hàng Vay365'
    });
  }

  // 4. TIẾP NHẬN HỒ SƠ KHÁCH HÀNG (KÈM BỘ 3 TẦNG BẢO VỆ CHỐNG BOT SPAM)
  if (req.method === 'POST') {
    let payload = req.body || {};
    if (typeof payload === 'string') {
      try { payload = JSON.parse(payload); } catch {}
    }

    const leadData = payload?.lead || payload;

    // --- TẦNG 1: BẪY BOT TÀNG HÌNH (HONEYPOT) ---
    // Bot đọc mã nguồn HTML sẽ tự động điền các ô ẩn này. Người thật không nhìn thấy.
    const honeypotWebsite = payload.hp_website || payload.hp_company || leadData?.hp_company_website || leadData?.hp_website;
    if (honeypotWebsite && String(honeypotWebsite).trim().length > 0) {
      console.warn('🛡️ Bot trapped in honeypot:', honeypotWebsite);
      // Trả về thành công giả để bot không thử lại, nhưng KHÔNG gửi mail và KHÔNG lưu database
      return res.status(200).json({ success: true, message: 'Đã nhận hồ sơ' });
    }

    // --- TẦNG 2: XÁC THỰC MÃ BẢO MẬT CLIENT SIGNATURE ---
    const securityToken = payload.securityToken || leadData.securityToken;
    const clientTs = Number(payload.clientTs || leadData.clientTs || 0);
    const isVerifiedClient = verifySecurityToken(securityToken, clientTs);

    if (!isVerifiedClient) {
      console.warn('🛡️ Bot or direct curl request blocked due to invalid/missing security token');
      return res.status(403).json({
        success: false,
        message: 'Yêu cầu không hợp lệ hoặc đã hết hạn phiên làm việc. Vui lòng tải lại trang và thử lại.',
      });
    }

    // --- TẦNG 3: XÁC THỰC PHÉP TÍNH CHỐNG SPAM (CAPTCHA) ---
    const captchaExpected = payload.captchaExpected ?? leadData.captchaExpected;
    const captchaAnswer = payload.captchaAnswer ?? leadData.captchaAnswer;
    if (captchaExpected !== undefined && captchaAnswer !== undefined) {
      if (Number(captchaAnswer) !== Number(captchaExpected)) {
        return res.status(400).json({
          success: false,
          message: 'Câu trả lời chống spam không chính xác. Vui lòng kiểm tra lại phép tính.'
        });
      }
    }

    // Kiểm tra dữ liệu cơ bản
    if (!leadData || !leadData.fullName || !leadData.phone) {
      return res.status(400).json({ success: false, message: 'Dữ liệu khách hàng không hợp lệ' });
    }

    const cleanPhone = String(leadData.phone || '').replace(/\D/g, '');
    const vnPhoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!vnPhoneRegex.test(cleanPhone)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Số điện thoại không hợp lệ theo chuẩn viễn thông Việt Nam' 
      });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    if (isSpamOrFlooding(cleanPhone, String(clientIp))) {
      return res.status(429).json({
        success: false,
        message: 'Hệ thống đã nhận được yêu cầu, vui lòng không gửi lại liên tục.'
      });
    }

    const newLead = {
      ...leadData,
      id: leadData.id || `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: leadData.createdAt || new Date().toLocaleString('vi-VN'),
      status: 'new',
    };

    // Lưu vào Backend để sẵn sàng xuất Excel
    saveLeadToStorage(newLead);

    // Gửi email về Gmail (chỉ khi vượt qua toàn bộ 3 tầng bảo mật)
    const formattedAmount = new Intl.NumberFormat('vi-VN').format(newLead.loanAmount || 0);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: Number(process.env.SMTP_PORT) || 587,
          secure: Number(process.env.SMTP_PORT) === 465,
          auth: { user: smtpUser, pass: smtpPass },
        });

        await transporter.sendMail({
          from: `"Vay365 Thông Báo" <${smtpUser}>`,
          to: DEFAULT_ADMIN_EMAIL,
          subject: `🔥 [Vay365] Khách mới: ${newLead.fullName} (${cleanPhone}) - ${formattedAmount}đ`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <h2 style="color: #065f46; margin-top: 0; font-size: 18px;">🔥 HỒ SƠ ĐĂNG KÝ VAY TÍN CHẤP MỚI</h2>
              <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 14px;">
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 140px; color: #475569;">Họ và tên:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #0f172a;">${newLead.fullName}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Số điện thoại:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;"><a href="tel:${cleanPhone}" style="color: #059669; font-weight: bold; text-decoration: none;">📞 ${cleanPhone}</a></td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Số tiền vay:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; color: #059669; font-weight: bold;">${formattedAmount} VNĐ</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Kỳ hạn vay:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${newLead.loanTenure || 24} tháng</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Tỉnh/Thành:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${newLead.province || 'Chưa cung cấp'}</td></tr>
                <tr><td style="padding: 8px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #475569;">Thời gian gửi:</td><td style="padding: 8px; border-bottom: 1px solid #f1f5f9;">${newLead.createdAt}</td></tr>
              </table>
              <div style="margin-top: 20px; display: flex; gap: 10px;">
                <a href="tel:${cleanPhone}" style="display: inline-block; padding: 10px 18px; background: #059669; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px;">📞 Gọi Khách Ngay</a>
                <a href="https://zalo.me/${cleanPhone}" style="display: inline-block; padding: 10px 18px; background: #0284c7; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 13px;">💬 Nhắn Zalo</a>
              </div>
            </div>
          `
        });
      } catch (e) {
        console.error('SMTP Error:', e);
      }
    }

    return res.status(201).json({
      success: true,
      lead: newLead,
      message: 'Đã lưu hồ sơ thành công vào hệ thống quản trị!',
    });
  }

  return res.status(200).json({ success: true, message: 'API Vay365 Leads Service Ready' });
}
