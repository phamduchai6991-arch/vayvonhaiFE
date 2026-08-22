import React, { useState } from 'react';
import { 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  X, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  HelpCircle,
  Mail,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { 
  loginWithPassword, 
  loginWithPin, 
  sendPasswordResetOtp, 
  resetPasswordWithOtp,
  DEFAULT_ADMIN_USERNAME,
  DEFAULT_ADMIN_PASS,
  DEFAULT_ADMIN_PIN,
  DEFAULT_ADMIN_EMAIL
} from '../services/authService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'password' | 'pin' | 'forgot'>('password');
  
  // Password Mode States
  const [identifier, setIdentifier] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // PIN Mode States
  const [pin, setPin] = useState('');

  // Forgot Password States
  const [resetEmail, setResetEmail] = useState(DEFAULT_ADMIN_EMAIL);
  const [resetOtp, setResetOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // Status/Error States
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoHint, setShowDemoHint] = useState(false);

  if (!isOpen) return null;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!identifier.trim()) {
      setErrorMessage('Vui lòng nhập Tên đăng nhập hoặc Email');
      return;
    }
    if (!password) {
      setErrorMessage('Vui lòng nhập Mật khẩu quản trị');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = loginWithPassword(identifier, password, rememberMe);
      setIsSubmitting(false);

      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      } else {
        setErrorMessage(result.message);
      }
    }, 300);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!pin.trim()) {
      setErrorMessage('Vui lòng nhập mã PIN bảo mật 4 số');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = loginWithPin(pin, rememberMe);
      setIsSubmitting(false);

      if (result.success) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      } else {
        setErrorMessage(result.message);
      }
    }, 300);
  };

  const handleSendOtp = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSendingOtp(true);

    try {
      const res = await sendPasswordResetOtp();
      setIsOtpSent(true);
      setSuccessMessage(res.message);
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi gửi mã OTP. Thử lại sau.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!resetOtp.trim()) {
      setErrorMessage('Vui lòng nhập mã OTP 6 số đã nhận qua email');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      setErrorMessage('Mật khẩu mới phải có tối thiểu 6 ký tự');
      return;
    }

    const result = resetPasswordWithOtp(resetOtp, newPassword);
    if (result.success) {
      setSuccessMessage(result.message);
      setTimeout(() => {
        setAuthMode('password');
        setPassword(newPassword);
        setIdentifier('admin');
        setIsOtpSent(false);
      }, 1500);
    } else {
      setErrorMessage(result.message);
    }
  };

  const handleQuickFillDefault = () => {
    setIdentifier('admin');
    setPassword(DEFAULT_ADMIN_PASS);
    setPin(DEFAULT_ADMIN_PIN);
    setErrorMessage(null);
    setSuccessMessage('Đã điền tài khoản mặc định!');
    setTimeout(() => setSuccessMessage(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200/80 overflow-hidden">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/30">
              <Lock className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold tracking-tight">Cổng Quản Trị Viên</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  BẢO MẬT
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Đăng nhập để xem danh sách Leads & thông tin khách hàng
              </p>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="grid grid-cols-3 gap-1 bg-slate-950/50 p-1 rounded-xl mt-5 border border-white/10 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('password');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'password'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Mật Khẩu</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('pin');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'pin'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Mã PIN (4 Số)</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('forgot');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                authMode === 'forgot'
                  ? 'bg-emerald-600 text-white shadow-xs font-bold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Khôi Phục</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          
          {/* Alerts */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5 animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="font-medium">{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="font-semibold">{successMessage}</div>
            </div>
          )}

          {/* 1. PASSWORD MODE */}
          {authMode === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Tài Khoản / Email Quản Trị
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin hoặc phamduchai6991@gmail.com"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  autoComplete="username"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Mật Khẩu Quản Trị
                  </label>
                  <button
                    type="button"
                    onClick={() => setAuthMode('forgot')}
                    className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu..."
                    className="w-full px-3.5 py-2.5 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Duy trì đăng nhập trên máy này</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang xác thực...</span>
                  </>
                ) : (
                  <>
                    <span>Đăng Nhập Vào Quản Trị</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* 2. PIN CODE MODE */}
          {authMode === 'pin' && (
            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 text-center">
                  Nhập Mã PIN Bảo Mật (4 Chữ Số)
                </label>
                <div className="flex justify-center my-3">
                  <input
                    type="password"
                    maxLength={6}
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-44 text-center tracking-[12px] text-2xl font-mono font-bold px-4 py-3 bg-slate-50 border-2 border-emerald-500/50 rounded-2xl text-emerald-950 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/20 transition-all"
                    autoFocus
                    required
                  />
                </div>
                <p className="text-[11px] text-slate-500 text-center">
                  Mã PIN mặc định cho Anh Đức Hải: <strong className="text-emerald-700 font-mono">6991</strong> (4 số cuối Gmail)
                </p>
              </div>

              <div className="flex items-center justify-center pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Ghi nhớ mở khóa nhanh</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-700 to-teal-700 hover:from-emerald-800 hover:to-teal-800 text-white font-bold text-sm shadow-md shadow-emerald-700/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang kiểm tra...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Mở Khóa Quản Trị</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* 3. FORGOT / RESET PASSWORD MODE */}
          {authMode === 'forgot' && (
            <div className="space-y-4">
              {!isOtpSent ? (
                <div>
                  <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                    Hệ thống sẽ gửi mã OTP xác nhận về hòm thư Gmail của Quản trị viên để đặt lại mật khẩu mới an toàn:
                  </p>

                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl mb-4 text-xs font-mono font-bold text-emerald-900 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{DEFAULT_ADMIN_EMAIL}</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSendingOtp}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-60"
                  >
                    {isSendingOtp ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang gửi mã OTP...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        <span>Gửi Mã OTP Về Gmail Ngay</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mã OTP (6 Chữ Số Nhận Qua Email)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={resetOtp}
                      onChange={(e) => setResetOtp(e.target.value)}
                      placeholder="Ví dụ: 123456"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mật Khẩu Mới Muốn Đổi
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Ít nhất 6 ký tự..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Lưu Mật Khẩu Mới & Đăng Nhập</span>
                  </button>
                </form>
              )}

              <button
                type="button"
                onClick={() => setAuthMode('password')}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer pt-1"
              >
                ← Quay lại màn hình đăng nhập
              </button>
            </div>
          )}

          {/* Quick Helper for Admin Duc Hai */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowDemoHint(!showDemoHint)}
              className="w-full flex items-center justify-between text-[11px] text-slate-500 hover:text-emerald-700 font-semibold cursor-pointer py-1"
            >
              <span className="flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Thông tin tài khoản mặc định (Dành cho Anh Đức Hải)</span>
              </span>
              <span>{showDemoHint ? '▲ Thu gọn' : '▼ Xem'}</span>
            </button>

            {showDemoHint && (
              <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 space-y-1.5 animate-in fade-in">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Tài khoản:</span>
                  <span className="font-mono font-bold text-slate-900">admin</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Mật khẩu mặc định:</span>
                  <span className="font-mono font-bold text-emerald-800">duchai@2026</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Mã PIN mở khóa nhanh:</span>
                  <span className="font-mono font-bold text-amber-700">6991</span>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleQuickFillDefault}
                    className="w-full py-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-900 font-bold text-[11px] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3 text-emerald-700" />
                    <span>Tự động điền nhanh tài khoản mặc định</span>
                  </button>
                  <p className="text-[10px] text-slate-400 text-center mt-1">
                    * Sau khi đăng nhập, Anh có thể tự đổi mật khẩu riêng trong mục Cài đặt.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Secure Footer Note */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Hệ thống bảo vệ dữ liệu khách hàng theo tiêu chuẩn mã hóa SSL 256-bit</span>
        </div>

      </div>
    </div>
  );
};
