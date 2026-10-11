import type { Handler, HandlerEvent } from '@netlify/functions';
import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'phamduchai6991@gmail.com';
const GMAIL_USER = process.env.GMAIL_USER || 'phamduchai6991@gmail.com';
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD || '';

export const handler: Handler = async (event: HandlerEvent) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const lead = data.lead || data;

    const formattedAmount = new Intl.NumberFormat('vi-VN').format(lead.loanAmount || 0);
    const formattedIncome = lead.monthlyIncome ? new Intl.NumberFormat('vi-VN').format(lead.monthlyIncome) + ' VNĐ' : 'Chưa cung cấp';
    const cleanPhone = String(lead.phone || '').trim();

    // 1. If GMAIL_APP_PASSWORD exists in Netlify Environment Variables, send via secure Gmail SMTP
    if (GMAIL_APP_PASSWORD) {
      try {
        const transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD,
          },
        });

        await transporter.sendMail({
          from: `"Vay365 Hệ Thống" <${GMAIL_USER}>`,
          to: ADMIN_EMAIL,
          subject: `🔥 [VAY365] Khách mới: ${lead.fullName} (${cleanPhone}) - Vay ${formattedAmount}đ`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
              <div style="background: #059669; color: white; padding: 20px; text-align: center;">
                <h2 style="margin: 0;">🔔 HỒ SƠ VAY TÍN CHẤP MỚI</h2>
                <p style="margin: 5px 0 0; font-size: 14px;">Ghi nhận từ website Vay365.com</p>
              </div>
              <div style="padding: 24px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; color: #64748b; font-weight: bold;">Họ và tên:</td><td style="padding: 10px; font-weight: bold; color: #0f172a; font-size: 16px;">${lead.fullName}</td></tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; color: #64748b; font-weight: bold;">Số điện thoại:</td><td style="padding: 10px; font-weight: bold; color: #2563eb; font-size: 16px;"><a href="tel:${cleanPhone}">📞 ${cleanPhone}</a></td></tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; color: #64748b; font-weight: bold;">Số tiền cần vay:</td><td style="padding: 10px; font-weight: bold; color: #059669; font-size: 18px;">${formattedAmount} VNĐ</td></tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; color: #64748b; font-weight: bold;">Kỳ hạn:</td><td style="padding: 10px; font-weight: bold;">${lead.loanTenure} tháng</td></tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; color: #64748b; font-weight: bold;">Gói vay:</td><td style="padding: 10px;">${lead.loanPurposeName || lead.loanPurpose}</td></tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; color: #64748b; font-weight: bold;">Thu nhập:</td><td style="padding: 10px;">${formattedIncome}</td></tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; color: #64748b; font-weight: bold;">Tỉnh / Thành:</td><td style="padding: 10px;">${lead.province || 'Chưa cung cấp'}</td></tr>
                  <tr style="border-bottom: 1px solid #f1f5f9;"><td style="padding: 10px; color: #64748b; font-weight: bold;">Ghi chú:</td><td style="padding: 10px;">${lead.notes || lead.note || 'Không có'}</td></tr>
                  <tr><td style="padding: 10px; color: #64748b; font-weight: bold;">Thời gian:</td><td style="padding: 10px;">${lead.createdAt || new Date().toLocaleString('vi-VN')}</td></tr>
                </table>
                <div style="margin-top: 24px; text-align: center;">
                  <a href="tel:${cleanPhone}" style="display: inline-block; background: #059669; color: white; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px; margin: 4px;">Gọi Điện Ngay</a>
                  <a href="https://zalo.me/${cleanPhone}" style="display: inline-block; background: #0284c7; color: white; text-decoration: none; font-weight: bold; padding: 12px 24px; border-radius: 8px; margin: 4px;">Nhắn Zalo Ngay</a>
                </div>
              </div>
            </div>
          `,
        });

        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ success: true, message: 'Đã gửi email thành công qua Gmail SMTP' }),
        };
      } catch (smtpErr: any) {
        console.warn('Netlify Gmail SMTP warning:', smtpErr);
      }
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        success: true,
        message: 'Netlify Function đã ghi nhận lead',
        leadId: lead.id,
      }),
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
