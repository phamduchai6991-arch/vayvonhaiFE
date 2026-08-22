import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin Notification Email (Default phamduchai6991@gmail.com)
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'phamduchai6991@gmail.com';

// 1. Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    adminEmail: DEFAULT_ADMIN_EMAIL,
    smtpConfigured: Boolean(process.env.SMTP_USER && process.env.SMTP_PASS),
    timestamp: new Date().toISOString(),
  });
});

// 2. Lead notification email endpoint
app.post('/api/leads/notify', async (req, res) => {
  const { lead, targetEmail = DEFAULT_ADMIN_EMAIL } = req.body;

  if (!lead || !lead.fullName || !lead.phone) {
    return res.status(400).json({ success: false, message: 'Dữ liệu khách hàng không hợp lệ' });
  }

  const recipient = targetEmail || DEFAULT_ADMIN_EMAIL;
  const formattedAmount = new Intl.NumberFormat('vi-VN').format(lead.loanAmount || 0);
  const formattedIncome = lead.monthlyIncome ? new Intl.NumberFormat('vi-VN').format(lead.monthlyIncome) + ' VNĐ' : 'Chưa cung cấp';

  // HTML Email Body
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
        .btn-call { display: inline-block; background: #059669; color: #ffffff; text-decoration: none; font-weight: 800; font-size: 14px; padding: 12px 28px; border-radius: 10px; margin-top: 8px; box-shadow: 0 2px 6px rgba(5,150,105,0.3); }
        .footer { background: #f8fafc; padding: 16px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1>🔔 CÓ KHÁCH HÀNG MỚI ĐĂNG KÝ VAY</h1>
          <p>Hệ thống Đức Hải FE ghi nhận hồ sơ vay tín chấp trực tuyến</p>
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
              <td class="val"><a href="tel:${lead.phone}" class="phone-val">📞 ${lead.phone} (Bấm để gọi)</a></td>
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
              <td class="val">${lead.notes || 'Không có ghi chú thêm'}</td>
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
            <p style="margin: 0; font-size: 13px; color: #065f46; font-weight: 600;">Hãy liên hệ tư vấn và giải đáp cho khách hàng sớm nhất!</p>
            <a href="tel:${lead.phone}" class="btn-call">📞 GỌI NGAY: ${lead.phone}</a>
          </div>
        </div>

        <div class="footer">
          Email thông báo tự động từ hệ thống Website <strong>Đức Hải FE - Tư Vấn Vay Tín Chấp</strong><br/>
          Địa chỉ nhận: ${recipient}
        </div>
      </div>
    </body>
    </html>
  `;

  // Check if SMTP is configured
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

      await transporter.sendMail({
        from: `"Đức Hải FE Alert" <${smtpUser}>`,
        to: recipient,
        subject: `🔥 [ĐỨC HẢI FE] Khách mới: ${lead.fullName} (${lead.phone}) - Vay ${formattedAmount}đ`,
        html: htmlContent,
      });

      return res.json({
        success: true,
        message: `Đã gửi email thông báo thành công qua SMTP tới ${recipient}`,
        method: 'server_smtp',
      });
    } catch (smtpErr: any) {
      console.error('SMTP send error:', smtpErr);
      // fallback to relay service
    }
  }

  // Fallback: Dispatch via Formsubmit / Cloud Mail Relay to recipient
  try {
    const formData = new URLSearchParams();
    formData.append('_subject', `🔥 [ĐỨC HẢI FE] Khách mới: ${lead.fullName} (${lead.phone}) - Vay ${formattedAmount}đ`);
    formData.append('_replyto', recipient);
    formData.append('_captcha', 'false');
    formData.append('_template', 'table');
    formData.append('Họ và Tên', lead.fullName);
    formData.append('Số Điện Thoại', lead.phone);
    formData.append('Số Tiền Vay', `${formattedAmount} VNĐ`);
    formData.append('Kỳ Hạn Vay', `${lead.loanTenure} tháng`);
    formData.append('Gói Vay', lead.loanPurposeName || lead.loanPurpose);
    formData.append('Nghề Nghiệp', lead.occupation || 'Chưa cung cấp');
    formData.append('Thu Nhập', formattedIncome);
    formData.append('Tỉnh / Thành', lead.province || 'Chưa cung cấp');
    formData.append('Ghi Chú', lead.notes || 'Không');
    formData.append('Mã Hồ Sơ', lead.id);

    const relayRes = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(recipient)}`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    if (relayRes.ok) {
      return res.json({
        success: true,
        message: `Đã gửi email thông báo tới ${recipient} thành công!`,
        method: 'relay_service',
      });
    }
  } catch (relayErr) {
    console.error('Relay error:', relayErr);
  }

  return res.json({
    success: true,
    message: `Đã lưu hồ sơ của ${lead.fullName}. Hệ thống sẵn sàng mở Gmail gửi thông báo.`,
    method: 'client_fallback',
  });
});

// 3. Admin Password Reset OTP via Email
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
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  } catch (relayErr) {
    console.error('Relay OTP error:', relayErr);
  }

  return res.json({ success: true, message: 'Đã phát lệnh gửi OTP' });
});

// Vite middleware setup
async function start() {
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
