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

export default async function handler(req: any, res: any) {
  // Cấu hình CORS để frontend gọi không bị chặn
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

  // 2. GET leads - Xem danh sách khách hàng
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      leads: INITIAL_LEADS,
      message: 'Danh sách hồ sơ khách hàng Vay365'
    });
  }

  // 3. POST new lead - Khi khách gửi form đăng ký vay
  if (req.method === 'POST') {
    let leadData = req.body?.lead || req.body;
    if (typeof leadData === 'string') {
      try { leadData = JSON.parse(leadData); } catch {}
    }

    if (!leadData || !leadData.fullName || !leadData.phone) {
      return res.status(400).json({ success: false, message: 'Dữ liệu khách hàng không hợp lệ' });
    }

    const newLead = {
      ...leadData,
      id: leadData.id || `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: leadData.createdAt || new Date().toLocaleString('vi-VN'),
      status: 'new',
    };

    // Tự động bắn email thông báo về phamduchai6991@gmail.com
    const cleanPhone = String(newLead.phone || '').replace(/\s+/g, '');
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
          html: `<p>Khách hàng: <strong>${newLead.fullName}</strong> (${cleanPhone}) vừa đăng ký khoản vay <strong>${formattedAmount} đ</strong> kỳ hạn ${newLead.loanTenure} tháng.</p>`
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
