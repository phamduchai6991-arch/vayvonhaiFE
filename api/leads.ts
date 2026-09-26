import nodemailer from 'nodemailer';

const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'phamduchai6991@gmail.com';

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

// Bộ nhớ đệm chống Spam & chặn Flood request
const recentSubmissions = new Map<string, number>();

function isSpamOrFlooding(phone: string, ip: string): boolean {
  const now = Date.now();
  
  // Dọn dẹp các mục cũ quá 5 phút
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (now - timestamp > 5 * 60 * 1000) {
      recentSubmissions.delete(key);
    }
  }

  // 1. Chặn gửi trùng số điện thoại trong vòng 3 phút
  const phoneKey = `phone:${phone}`;
  if (recentSubmissions.has(phoneKey)) {
    const lastTime = recentSubmissions.get(phoneKey)!;
    if (now - lastTime < 3 * 60 * 1000) {
      return true;
    }
  }

  // 2. Chặn cùng 1 IP gửi dồn dập (tối thiểu 15 giây mới được gửi 1 lần)
  if (ip && ip !== 'unknown') {
    const ipKey = `ip:${ip}`;
    if (recentSubmissions.has(ipKey)) {
      const lastTime = recentSubmissions.get(ipKey)!;
      if (now - lastTime < 15 * 1000) {
        return true;
      }
    }
    recentSubmissions.set(ipKey, now);
  }

  recentSubmissions.set(phoneKey, now);
  return false;
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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

  // 2. GET leads - Danh sách khách hàng
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      leads: INITIAL_LEADS,
      message: 'Danh sách hồ sơ khách hàng Vay365'
    });
  }

  // 3. POST new lead - Khi khách gửi đơn
  if (req.method === 'POST') {
    let leadData = req.body?.lead || req.body;
    if (typeof leadData === 'string') {
      try { leadData = JSON.parse(leadData); } catch {}
    }

    if (!leadData || !leadData.fullName || !leadData.phone) {
      return res.status(400).json({ success: false, message: 'Dữ liệu khách hàng không hợp lệ' });
    }

    const cleanPhone = String(leadData.phone || '').replace(/\D/g, '');
    
    // Kiểm tra số điện thoại chuẩn Việt Nam (10 số, đầu 03, 05, 07, 08, 09)
    const vnPhoneRegex = /^(03|05|07|08|09)\d{8}$/;
    if (!vnPhoneRegex.test(cleanPhone)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Số điện thoại không hợp lệ theo chuẩn viễn thông Việt Nam' 
      });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || 'unknown';
    
    // Kiểm tra chặn Spam / Flood
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
