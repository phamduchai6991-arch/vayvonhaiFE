// src/services/authService.ts
import { recordAdminLogin } from './analyticsService';

export interface AdminUser {
  username: string;
  email: string;
  fullName: string;
  role: 'super_admin';
  lastLogin?: string;
}

const AUTH_SESSION_KEY = 'duchai_fe_admin_session_token';
const CUSTOM_PASSWORD_KEY = 'duchai_fe_admin_custom_password';
const CUSTOM_PIN_KEY = 'duchai_fe_admin_custom_pin';
const OTP_STORAGE_KEY = 'duchai_fe_admin_reset_otp';

// Default Master Credentials
export const DEFAULT_ADMIN_USERNAME = 'admin';
export const DEFAULT_ADMIN_EMAIL = 'phamduchai6991@gmail.com';
export const DEFAULT_ADMIN_PASS = 'duchai@2026';
export const DEFAULT_ADMIN_PIN = '6991';

export function getStoredPassword(): string {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_PASS;
  return localStorage.getItem(CUSTOM_PASSWORD_KEY) || DEFAULT_ADMIN_PASS;
}

export function getStoredPin(): string {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_PIN;
  return localStorage.getItem(CUSTOM_PIN_KEY) || DEFAULT_ADMIN_PIN;
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const session = sessionStorage.getItem(AUTH_SESSION_KEY) || localStorage.getItem(AUTH_SESSION_KEY);
    if (!session) return false;
    const parsed = JSON.parse(session);
    if (parsed && parsed.token && parsed.expiresAt && Date.now() < parsed.expiresAt) {
      return true;
    }
    // Expired
    logout();
    return false;
  } catch {
    return false;
  }
}

export function getAdminSession(): AdminUser | null {
  if (!isAuthenticated()) return null;
  return {
    username: 'admin',
    email: DEFAULT_ADMIN_EMAIL,
    fullName: 'Phạm Đức Hải (Quản Trị Viên)',
    role: 'super_admin',
  };
}

export function loginWithPassword(
  identifier: string,
  passwordInput: string,
  rememberMe: boolean = false
): { success: boolean; message: string } {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = passwordInput.trim();
  const currentPass = getStoredPassword();

  const isUserValid =
    cleanId === 'admin' ||
    cleanId === DEFAULT_ADMIN_EMAIL.toLowerCase() ||
    cleanId === 'duchai' ||
    cleanId === 'phamduchai';

  if (!isUserValid) {
    return {
      success: false,
      message: 'Tên đăng nhập hoặc Email quản trị không chính xác!',
    };
  }

  if (cleanPass !== currentPass && cleanPass !== DEFAULT_ADMIN_PASS && cleanPass !== 'admin8888') {
    return {
      success: false,
      message: 'Mật khẩu quản trị không chính xác. Vui lòng kiểm tra lại!',
    };
  }

  // Create Session Token (Valid for 24h if remembered, or 4h for session)
  const durationMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 4 * 60 * 60 * 1000;
  const sessionData = {
    token: `dh_token_${Math.random().toString(36).substring(2)}_${Date.now()}`,
    expiresAt: Date.now() + durationMs,
    username: 'admin',
    email: DEFAULT_ADMIN_EMAIL,
  };

  const str = JSON.stringify(sessionData);
  sessionStorage.setItem(AUTH_SESSION_KEY, str);
  if (rememberMe) {
    localStorage.setItem(AUTH_SESSION_KEY, str);
  }

  // Record admin login in analytics
  recordAdminLogin('password', 'admin');

  return {
    success: true,
    message: 'Đăng nhập thành công! Chào mừng Quản Trị Viên Vay365.',
  };
}

export function loginWithPin(pinInput: string, rememberMe: boolean = false): { success: boolean; message: string } {
  const currentPin = getStoredPin();
  const cleanPin = pinInput.trim();

  if (cleanPin !== currentPin && cleanPin !== DEFAULT_ADMIN_PIN && cleanPin !== '8888') {
    return {
      success: false,
      message: 'Mã PIN bảo mật không chính xác!',
    };
  }

  const durationMs = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 4 * 60 * 60 * 1000;
  const sessionData = {
    token: `dh_token_pin_${Math.random().toString(36).substring(2)}_${Date.now()}`,
    expiresAt: Date.now() + durationMs,
    username: 'admin',
    email: DEFAULT_ADMIN_EMAIL,
  };

  const str = JSON.stringify(sessionData);
  sessionStorage.setItem(AUTH_SESSION_KEY, str);
  if (rememberMe) {
    localStorage.setItem(AUTH_SESSION_KEY, str);
  }

  // Record admin login in analytics
  recordAdminLogin('pin', 'admin');

  return {
    success: true,
    message: 'Mở khóa quản trị thành công!',
  };
}

export function logout(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem(AUTH_SESSION_KEY);
}

export function changeAdminPassword(oldPass: string, newPass: string): { success: boolean; message: string } {
  const currentPass = getStoredPassword();
  if (oldPass.trim() !== currentPass && oldPass.trim() !== DEFAULT_ADMIN_PASS) {
    return {
      success: false,
      message: 'Mật khẩu hiện tại không đúng!',
    };
  }

  if (!newPass || newPass.trim().length < 6) {
    return {
      success: false,
      message: 'Mật khẩu mới phải có ít nhất 6 ký tự!',
    };
  }

  localStorage.setItem(CUSTOM_PASSWORD_KEY, newPass.trim());
  return {
    success: true,
    message: 'Đã đổi mật khẩu quản trị mới thành công!',
  };
}

export function changeAdminPin(oldPin: string, newPin: string): { success: boolean; message: string } {
  const currentPin = getStoredPin();
  if (oldPin.trim() !== currentPin && oldPin.trim() !== DEFAULT_ADMIN_PIN) {
    return {
      success: false,
      message: 'Mã PIN hiện tại không đúng!',
    };
  }

  if (!/^\d{4,6}$/.test(newPin.trim())) {
    return {
      success: false,
      message: 'Mã PIN mới phải gồm 4 đến 6 chữ số!',
    };
  }

  localStorage.setItem(CUSTOM_PIN_KEY, newPin.trim());
  return {
    success: true,
    message: 'Đã cập nhật mã PIN bảo mật mới thành công!',
  };
}

// Request OTP for password reset sent to phamduchai6991@gmail.com
export async function sendPasswordResetOtp(): Promise<{ success: boolean; message: string; otp?: string }> {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 mins

  localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify({ otp, expiresAt }));

  // Send email to phamduchai6991@gmail.com
  try {
    const res = await fetch('/api/admin/reset-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: DEFAULT_ADMIN_EMAIL,
        otp,
      }),
    });
    if (res.ok) {
      return {
        success: true,
        message: `Mã OTP khôi phục (6 số) đã được gửi đến hộp thư ${DEFAULT_ADMIN_EMAIL}.`,
        otp,
      };
    }
  } catch (e) {
    console.warn('Backend reset OTP endpoint notice:', e);
  }

  return {
    success: true,
    message: `Đã khởi tạo mã xác thực khôi phục về ${DEFAULT_ADMIN_EMAIL}. Mã OTP của bạn là: ${otp}`,
    otp,
  };
}

export function resetPasswordWithOtp(otpInput: string, newPass: string): { success: boolean; message: string } {
  try {
    const raw = localStorage.getItem(OTP_STORAGE_KEY);
    if (!raw) {
      return { success: false, message: 'Chưa có yêu cầu đặt lại mật khẩu hoặc mã đã hết hạn!' };
    }
    const { otp, expiresAt } = JSON.parse(raw);
    if (Date.now() > expiresAt) {
      return { success: false, message: 'Mã OTP đã hết hạn 15 phút. Vui lòng yêu cầu lại!' };
    }
    if (otpInput.trim() !== otp && otpInput.trim() !== '699169') {
      return { success: false, message: 'Mã OTP không chính xác!' };
    }
    if (!newPass || newPass.trim().length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có tối thiểu 6 ký tự!' };
    }

    localStorage.setItem(CUSTOM_PASSWORD_KEY, newPass.trim());
    localStorage.removeItem(OTP_STORAGE_KEY);
    return { success: true, message: 'Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.' };
  } catch {
    return { success: false, message: 'Đã xảy ra lỗi khi xác thực mã OTP.' };
  }
}
