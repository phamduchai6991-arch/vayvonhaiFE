import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Search, 
  Phone, 
  Trash2, 
  RefreshCw,
  MessageSquare,
  Mail,
  Send,
  Edit2,
  LogOut,
  KeyRound,
  ShieldCheck,
  Lock,
  Activity,
  Download,
  Copy,
  Check
} from 'lucide-react';
import { Lead, LeadStatus } from '../types';
import { formatVND, formatVNDCompact } from '../utils/loanCalculator';
import { LOAN_PURPOSES } from '../data/constants';
import { AdminAnalyticsTab } from './AdminAnalyticsTab';
import { 
  getAdminNotificationEmail, 
  setAdminNotificationEmail, 
  sendLeadEmailNotification, 
  generateLeadMailtoUrl 
} from '../services/emailService';
import { 
  changeAdminPassword, 
  changeAdminPin,
  logout 
} from '../services/authService';
import { 
  exportLeadsToCSV, 
  copyLeadsTable,
  verifySmtpConnection
} from '../services/leadService';

interface AdminLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  leads: Lead[];
  onUpdateLeadStatus: (leadId: string, status: LeadStatus, adminNote?: string) => void;
  onDeleteLead: (leadId: string) => void;
  onResetSampleLeads: () => void;
  onRefreshLeads?: () => void;
}

export const AdminLeadsModal: React.FC<AdminLeadsModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  leads,
  onUpdateLeadStatus,
  onDeleteLead,
  onResetSampleLeads,
  onRefreshLeads,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'leads' | 'analytics'>('leads');
  const [copiedTableFeedback, setCopiedTableFeedback] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Password & Security Management Modal
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [securityTab, setSecurityTab] = useState<'password' | 'pin'>('password');
  const [securityStatus, setSecurityStatus] = useState<{ msg: string; isError?: boolean } | null>(null);

  // Email state
  const [adminEmail, setAdminEmailState] = useState<string>(getAdminNotificationEmail());
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInputVal, setEmailInputVal] = useState(adminEmail);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [isCheckingSmtp, setIsCheckingSmtp] = useState(false);
  const [showGmailHelp, setShowGmailHelp] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ msg: string; isError?: boolean } | null>(null);
  const [resendingLeadId, setResendingLeadId] = useState<string | null>(null);

  const handleCheckSmtpStatus = async () => {
    setIsCheckingSmtp(true);
    setEmailFeedback(null);
    try {
      const res = await verifySmtpConnection();
      if (res.success) {
        setEmailFeedback({ msg: `✅ Gmail SMTP Hoạt động tốt: Đã kết nối ${res.host || 'smtp.gmail.com'}` });
      } else {
        setEmailFeedback({ msg: `⚠️ ${res.message}`, isError: true });
      }
    } catch {
      setEmailFeedback({ msg: 'Lỗi kiểm tra kết nối SMTP', isError: true });
    } finally {
      setIsCheckingSmtp(false);
      setTimeout(() => setEmailFeedback(null), 8000);
    }
  };

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi trang Quản Trị Vay365?')) {
      logout();
      if (onLogout) {
        onLogout();
      } else {
        onClose();
      }
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityStatus(null);
    const res = changeAdminPassword(oldPassword, newPassword);
    setSecurityStatus({ msg: res.message, isError: !res.success });
    if (res.success) {
      setOldPassword('');
      setNewPassword('');
      setTimeout(() => {
        setIsSecurityModalOpen(false);
        setSecurityStatus(null);
      }, 2000);
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setSecurityStatus(null);
    const res = changeAdminPin(oldPin, newPin);
    setSecurityStatus({ msg: res.message, isError: !res.success });
    if (res.success) {
      setOldPin('');
      setNewPin('');
      setTimeout(() => {
        setIsSecurityModalOpen(false);
        setSecurityStatus(null);
      }, 2000);
    }
  };

  const handleSaveAdminEmail = () => {
    if (emailInputVal && emailInputVal.includes('@')) {
      setAdminNotificationEmail(emailInputVal);
      setAdminEmailState(emailInputVal.trim());
      setIsEditingEmail(false);
      setEmailFeedback({ msg: `Đã lưu email nhận thông báo: ${emailInputVal}` });
      setTimeout(() => setEmailFeedback(null), 4000);
    } else {
      alert('Vui lòng nhập định dạng email hợp lệ (ví dụ: phamduchai6991@gmail.com)');
    }
  };

  const handleSendTestEmail = async () => {
    setIsSendingTestEmail(true);
    setEmailFeedback(null);

    const testLead: Lead = {
      id: `TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: 'Nguyễn Thử Nghiệm (Kiểm Tra Gmail)',
      phone: '0912345678',
      province: 'Nghệ An',
      loanAmount: 50000000,
      loanTenure: 24,
      loanPurpose: 'tin_chap_theo_luong',
      loanPurposeName: 'Vay Tín Chấp Theo Bảng Lương',
      monthlyIncome: 15000000,
      notes: 'Thử nghiệm hệ thống chuyển tiếp email đến quản trị viên',
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'new',
    };

    try {
      const res = await sendLeadEmailNotification(testLead);
      if (res.success) {
        setEmailFeedback({ msg: `Đã gửi thử thành công đến ${adminEmail}` });
      } else {
        setEmailFeedback({ msg: res.message, isError: true });
      }
    } catch {
      setEmailFeedback({ msg: 'Lỗi gửi email', isError: true });
    } finally {
      setIsSendingTestEmail(false);
      setTimeout(() => setEmailFeedback(null), 7000);
    }
  };

  const handleResendLeadEmail = async (lead: Lead) => {
    setResendingLeadId(lead.id);
    try {
      await sendLeadEmailNotification(lead);
      alert(`Đã gửi lại thông tin lead ${lead.fullName} (${lead.phone}) tới ${adminEmail}`);
    } catch {
      alert('Không thể gửi email lúc này. Vui lòng sử dụng tính năng "Mở Gmail" để soạn thư trực tiếp.');
    } finally {
      setResendingLeadId(null);
    }
  };

  // Copy table for pasting into Excel/Sheets
  const handleCopyTable = async () => {
    const ok = await copyLeadsTable(filteredLeads);
    if (ok) {
      setCopiedTableFeedback(true);
      setTimeout(() => setCopiedTableFeedback(false), 3000);
    }
  };

  // Refresh leads from server
  const handleRefreshData = async () => {
    if (onRefreshLeads) {
      setIsRefreshing(true);
      await onRefreshLeads();
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  if (!isOpen) return null;

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchSearch =
      searchTerm.trim() === '' ||
      lead.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.province.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Analytics Stats
  const totalLoanAmount = leads.reduce((acc, curr) => acc + (curr.loanAmount || 0), 0);
  const newLeadsCount = leads.filter((l) => l.status === 'new').length;
  const contactedLeadsCount = leads.filter((l) => l.status === 'contacted').length;
  const approvedLeadsCount = leads.filter((l) => l.status === 'approved').length;

  const getPurposeLabel = (val: string) => {
    const found = LOAN_PURPOSES.find((p) => p.value === val);
    return found ? found.label : val;
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
        <div 
          className="relative bg-white rounded-3xl max-w-7xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-emerald-100 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top Header */}
          <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-white/15">
                <Users className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-black tracking-tight flex items-center gap-2">
                  <span>Trung Tâm Quản Trị Vay365</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold uppercase">
                    Admin Portal
                  </span>
                </h3>
                <p className="text-xs text-emerald-200">
                  Lưu trữ hồ sơ khách hàng, cập nhật tiến độ thẩm định &amp; xuất báo cáo
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap justify-end">
              {/* Refresh from server */}
              <button
                type="button"
                onClick={handleRefreshData}
                disabled={isRefreshing}
                className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
                title="Tải lại dữ liệu mới nhất từ máy chủ"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Làm Mới</span>
              </button>

              {/* Change Password / PIN button */}
              <button
                type="button"
                onClick={() => {
                  setSecurityStatus(null);
                  setIsSecurityModalOpen(true);
                }}
                className="px-2.5 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-950 text-emerald-200 border border-emerald-700/60 text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Đổi mật khẩu & mã PIN bảo mật quản trị"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Bảo Mật</span>
              </button>

              {/* Logout Button */}
              <button
                type="button"
                onClick={handleLogout}
                className="px-2.5 py-1.5 rounded-lg bg-rose-600/90 hover:bg-rose-600 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                title="Đăng xuất khỏi trang quản trị"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Đăng Xuất</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Primary Top Navigation Tabs */}
          <div className="bg-emerald-950/95 border-b border-emerald-800 px-6 py-2 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveAdminTab('leads')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeAdminTab === 'leads'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-emerald-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Hồ Sơ Khách Vay ({leads.length})</span>
                {newLeadsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px]">
                    {newLeadsCount} mới
                  </span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveAdminTab('analytics')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  activeAdminTab === 'analytics'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-emerald-200 hover:text-white hover:bg-white/10'
                }`}
              >
                <Activity className="w-4 h-4 text-amber-300" />
                <span>Thống Kê, SEO &amp; Phân Tích</span>
              </button>
            </div>
          </div>

          {/* ANALYTICS TAB CONTENT */}
          {activeAdminTab === 'analytics' ? (
            <AdminAnalyticsTab leadsCount={leads.length} />
          ) : (
            /* LEADS CONTENT */
            <div className="flex-1 flex flex-col overflow-hidden">
              
              {/* Stats Metrics Bar */}
              <div className="bg-emerald-50/80 px-6 py-3 border-b border-emerald-100 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tổng số Lead</div>
                  <div className="text-base sm:text-lg font-black text-slate-900">{leads.length} khách</div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-amber-200 shadow-xs">
                  <div className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">Cần gọi (Mới)</div>
                  <div className="text-base sm:text-lg font-black text-amber-600">{newLeadsCount} khách</div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-teal-200 shadow-xs">
                  <div className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">Đã liên hệ</div>
                  <div className="text-base sm:text-lg font-black text-teal-700">{contactedLeadsCount} khách</div>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-emerald-200 shadow-xs">
                  <div className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">Đã duyệt vay</div>
                  <div className="text-base sm:text-lg font-black text-emerald-600">{approvedLeadsCount} khách</div>
                </div>
              </div>

              {/* Email Notification & Quick Export Bar */}
              <div className="bg-emerald-950 text-white px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-emerald-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 font-bold text-amber-300">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Email Nhận Lead:</span>
                  </span>
                  {isEditingEmail ? (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="email"
                        value={emailInputVal}
                        onChange={(e) => setEmailInputVal(e.target.value)}
                        className="bg-slate-900 border border-emerald-500 rounded px-2 py-0.5 text-xs text-white font-mono"
                        placeholder="phamduchai6991@gmail.com"
                      />
                      <button
                        onClick={handleSaveAdminEmail}
                        className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-2 py-0.5 rounded text-[11px] cursor-pointer"
                      >
                        Lưu
                      </button>
                      <button
                        onClick={() => setIsEditingEmail(false)}
                        className="text-slate-400 hover:text-white px-1.5 text-[11px] cursor-pointer"
                      >
                        Hủy
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-900/90 text-emerald-200 border border-emerald-700/80 px-2 py-0.5 rounded font-mono font-bold">
                        {adminEmail}
                      </span>
                      <button
                        onClick={() => {
                          setEmailInputVal(adminEmail);
                          setIsEditingEmail(true);
                        }}
                        className="text-emerald-300 hover:text-white flex items-center gap-1 text-[11px] underline cursor-pointer"
                        title="Đổi email nhận"
                      >
                        <Edit2 className="w-3 h-3" /> Đổi
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                  {emailFeedback && (
                    <span className={`text-[11px] px-2 py-0.5 rounded ${emailFeedback.isError ? 'bg-rose-900 text-rose-200' : 'bg-emerald-800 text-emerald-100'}`}>
                      {emailFeedback.msg}
                    </span>
                  )}

                  <button
                    onClick={handleCheckSmtpStatus}
                    disabled={isCheckingSmtp}
                    className="bg-emerald-900 hover:bg-emerald-800 text-emerald-200 border border-emerald-700/60 px-2.5 py-1 rounded-md font-medium text-[11px] flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    title="Kiểm tra kết nối trực tiếp đến máy chủ Google Gmail SMTP"
                  >
                    <RefreshCw className={`w-3 h-3 ${isCheckingSmtp ? 'animate-spin' : ''}`} />
                    <span>{isCheckingSmtp ? 'Đang kiểm tra...' : 'Kiểm Tra SMTP'}</span>
                  </button>

                  <button
                    onClick={handleSendTestEmail}
                    disabled={isSendingTestEmail}
                    className="bg-emerald-800 hover:bg-emerald-700 disabled:opacity-50 text-emerald-100 px-2.5 py-1 rounded-md font-medium text-[11px] flex items-center gap-1 cursor-pointer"
                    title="Gửi một email thử nghiệm thực tế vào hòm thư phamduchai6991@gmail.com"
                  >
                    <Send className="w-3 h-3" />
                    <span>{isSendingTestEmail ? 'Đang gửi...' : 'Gửi Thử Gmail'}</span>
                  </button>

                  <button
                    onClick={() => setShowGmailHelp(!showGmailHelp)}
                    className="bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/40 px-2.5 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    title="Xem lưu ý vị trí nhận thư trong Gmail"
                  >
                    <span>💡 Hướng Dẫn Gmail</span>
                  </button>

                  <button
                    onClick={() => exportLeadsToCSV(filteredLeads)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    title="Xuất file CSV chuẩn cho Excel"
                  >
                    <Download className="w-3 h-3" />
                    <span>Tải File CSV</span>
                  </button>

                  <button
                    onClick={handleCopyTable}
                    className="bg-teal-700 hover:bg-teal-600 text-white px-2.5 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 cursor-pointer"
                    title="Sao chép bảng dữ liệu vào bộ nhớ đệm"
                  >
                    {copiedTableFeedback ? <Check className="w-3 h-3 text-amber-300" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedTableFeedback ? 'Đã sao chép bảng!' : 'Sao Chép Bảng'}</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Gmail Guidance Box */}
              {showGmailHelp && (
                <div className="bg-amber-50 border-b border-amber-200 px-6 py-3.5 text-xs text-amber-950 flex flex-col sm:flex-row items-start justify-between gap-3 animate-in fade-in duration-200">
                  <div className="space-y-1.5 max-w-4xl">
                    <div className="font-bold flex items-center gap-2 text-amber-900 text-sm">
                      <span>📌 Lưu ý kiểm tra thông báo tại hòm thư phamduchai6991@gmail.com</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 leading-relaxed">
                      <li>
                        <strong>Tiêu đề thư hệ thống:</strong> Bắt đầu bằng tiền tố <code>🔥 [VAY365] Khách mới: [Tên khách] ([SĐT])</code>.
                      </li>
                      <li>
                        <strong>Tại sao không thấy ở Hộp thư chính (Primary)?</strong> Do hệ thống gửi trực tiếp từ chính tài khoản <code>phamduchai6991@gmail.com</code> tới cùng tài khoản đó, bộ lọc Google thường tự động xếp thư vào các mục:
                        <span className="font-semibold text-rose-700"> Thư rác (Spam)</span>,
                        <span className="font-semibold text-slate-800"> Tất cả thư (All Mail)</span>, hoặc
                        <span className="font-semibold text-blue-700"> Cập nhật (Updates)</span>.
                      </li>
                      <li>
                        <strong>Cách khắc phục vĩnh viễn:</strong> Vào mục <em>Thư rác (Spam)</em> &gt; Mở thư của Vay365 &gt; Bấm nút <strong>"Báo cáo không phải nội dung rác" (Not spam)</strong>, hoặc tạo bộ lọc Gmail với điều kiện "Không bao giờ gửi vào thư rác" (Never send it to Spam).
                      </li>
                    </ul>
                  </div>
                  <button
                    onClick={() => setShowGmailHelp(false)}
                    className="text-amber-800 hover:text-amber-950 font-bold text-xs underline cursor-pointer self-start sm:self-center shrink-0"
                  >
                    Đã hiểu, thu gọn
                  </button>
                </div>
              )}

              {/* Filters Bar */}
              <div className="p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, SĐT, tỉnh thành, mã hồ sơ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 bg-white"
                  />
                </div>

                {/* Status Filter Buttons */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  <button
                    onClick={() => setStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      statusFilter === 'all' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Tất cả ({leads.length})
                  </button>
                  <button
                    onClick={() => setStatusFilter('new')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      statusFilter === 'new' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Mới ({newLeadsCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('contacted')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      statusFilter === 'contacted' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Đã gọi ({contactedLeadsCount})
                  </button>
                  <button
                    onClick={() => setStatusFilter('approved')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap cursor-pointer ${
                      statusFilter === 'approved' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Đã duyệt ({approvedLeadsCount})
                  </button>
                </div>
              </div>

              {/* Table / Leads list */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6">
                {filteredLeads.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500 font-medium text-sm">Không tìm thấy hồ sơ nào phù hợp.</p>
                    <button
                      onClick={onResetSampleLeads}
                      className="mt-3 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold hover:bg-emerald-100 transition-colors cursor-pointer"
                    >
                      Nạp lại dữ liệu mẫu
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs sm:text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                          <th className="pb-3 px-3">Mã / Ngày</th>
                          <th className="pb-3 px-3">Khách Hàng</th>
                          <th className="pb-3 px-3">Khoản Vay</th>
                          <th className="pb-3 px-3">Gói Vay</th>
                          <th className="pb-3 px-3">Trạng Thái</th>
                          <th className="pb-3 px-3">Ghi Chú</th>
                          <th className="pb-3 px-3 text-right">Thao Tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {filteredLeads.map((lead) => {
                          return (
                            <tr key={lead.id} className="hover:bg-emerald-50/40 transition-colors">
                              {/* ID & Date */}
                              <td className="py-3 px-3">
                                <div className="font-bold text-slate-900">{lead.id}</div>
                                <div className="text-[10px] text-slate-400">
                                  {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString('vi-VN') : 'Mới'}
                                </div>
                              </td>

                              {/* Customer info */}
                              <td className="py-3 px-3">
                                <div className="font-bold text-slate-900">{lead.fullName}</div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <a
                                    href={`tel:${lead.phone}`}
                                    className="text-emerald-700 hover:underline flex items-center gap-0.5 text-xs font-bold"
                                  >
                                    <Phone className="w-3 h-3" />
                                    <span>{lead.phone}</span>
                                  </a>
                                  <a
                                    href={`https://zalo.me/${lead.phone}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="px-1.5 py-0.2 rounded-sm bg-blue-50 text-blue-800 text-[10px] font-bold border border-blue-200"
                                    title="Nhắn Zalo"
                                  >
                                    Zalo
                                  </a>
                                  <span className="text-[10px] text-slate-400">({lead.province})</span>
                                </div>
                              </td>

                              {/* Loan Amount */}
                              <td className="py-3 px-3">
                                <div className="font-black text-emerald-800">{formatVND(lead.loanAmount)}</div>
                                <div className="text-[10px] text-slate-400">{lead.loanTenure} tháng</div>
                              </td>

                              {/* Purpose */}
                              <td className="py-3 px-3">
                                <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                                  {getPurposeLabel(lead.loanPurpose)}
                                </span>
                              </td>

                              {/* Status Dropdown */}
                              <td className="py-3 px-3">
                                <select
                                  value={lead.status}
                                  onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadStatus, lead.adminNote)}
                                  className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white focus:outline-hidden cursor-pointer"
                                >
                                  <option value="new">🟡 Mới</option>
                                  <option value="contacted">🔵 Đã gọi</option>
                                  <option value="approved">🟢 Đã duyệt</option>
                                  <option value="rejected">🔴 Không duyệt</option>
                                </select>
                              </td>

                              {/* Notes */}
                              <td className="py-3 px-3 max-w-xs truncate text-xs text-slate-500">
                                {lead.adminNote ? (
                                  <span className="text-emerald-800 font-medium">📝 {lead.adminNote}</span>
                                ) : (
                                  <span>{lead.note || lead.notes || '—'}</span>
                                )}
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-3 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() => handleResendLeadEmail(lead)}
                                    disabled={resendingLeadId === lead.id}
                                    className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-colors cursor-pointer"
                                    title="Gửi lại thông báo qua Gmail"
                                  >
                                    <Send className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setSelectedLead(lead);
                                      setAdminNoteInput(lead.adminNote || '');
                                    }}
                                    className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                                    title="Xem chi tiết & Ghi chú"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    onClick={() => onDeleteLead(lead.id)}
                                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                    title="Xóa lead"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Lead Details Modal */}
              {selectedLead && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                      <h4 className="font-bold text-slate-900 text-base">
                        Chi Tiết Khách Hàng #{selectedLead.id}
                      </h4>
                      <button
                        onClick={() => setSelectedLead(null)}
                        className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-400">Họ và tên:</span>
                        <span className="font-bold text-slate-800">{selectedLead.fullName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-400">Số điện thoại:</span>
                        <div className="flex items-center gap-2">
                          <a href={`tel:${selectedLead.phone}`} className="font-bold text-emerald-700 hover:underline">
                            📞 {selectedLead.phone}
                          </a>
                          <a
                            href={`https://zalo.me/${selectedLead.phone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="px-2 py-0.5 rounded-sm bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200"
                          >
                            Zalo
                          </a>
                        </div>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-400">Số tiền cần vay:</span>
                        <span className="font-bold text-emerald-800">{formatVND(selectedLead.loanAmount)}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-400">Thời hạn:</span>
                        <span className="font-bold text-slate-800">{selectedLead.loanTenure} tháng</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-400">Thu nhập hàng tháng:</span>
                        <span className="font-bold text-slate-800">
                          {selectedLead.monthlyIncome ? formatVND(selectedLead.monthlyIncome) : 'Không khai báo'}
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-400">Tỉnh / Thành phố:</span>
                        <span className="font-bold text-slate-800">{selectedLead.province}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-400">Ghi chú của khách:</span>
                        <span className="font-medium text-slate-700">{selectedLead.note || selectedLead.notes || 'Không có'}</span>
                      </div>
                    </div>

                    {/* Admin Internal Note Input */}
                    <div className="space-y-1.5 pt-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Ghi chú nội bộ thẩm định:
                      </label>
                      <textarea
                        rows={2}
                        value={adminNoteInput}
                        onChange={(e) => setAdminNoteInput(e.target.value)}
                        placeholder="Ghi chú: Khách hẹn gửi CCCD chiều nay, đã kiểm tra CIC..."
                        className="w-full p-2.5 text-xs rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-600"
                      />
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <a
                          href={generateLeadMailtoUrl(selectedLead, adminEmail)}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                        >
                          <Mail className="w-3.5 h-3.5 text-amber-700" />
                          <span>Mở Gmail</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedLead(null)}
                          className="px-3 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
                        >
                          Đóng
                        </button>
                        <button
                          onClick={() => {
                            onUpdateLeadStatus(selectedLead.id, selectedLead.status, adminNoteInput);
                            setSelectedLead(null);
                          }}
                          className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold cursor-pointer"
                        >
                          Lưu Ghi Chú
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Note */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Dữ liệu khách hàng được bảo mật và lưu trữ tập trung trên máy chủ</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer"
            >
              Đóng Bảng Quản Trị
            </button>
          </div>
        </div>
      </div>

      {/* Security Settings Modal (Change Password & PIN) */}
      {isSecurityModalOpen && (
        <div className="fixed inset-0 z-60 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">Bảo Mật Quản Trị Viên</h4>
                  <p className="text-xs text-slate-500">Đổi mật khẩu hoặc mã PIN truy cập nội bộ</p>
                </div>
              </div>
              <button
                onClick={() => setIsSecurityModalOpen(false)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tabs: Password vs PIN */}
            <div className="grid grid-cols-2 gap-1 bg-slate-100 p-1 rounded-xl mb-4 text-xs font-bold">
              <button
                type="button"
                onClick={() => {
                  setSecurityTab('password');
                  setSecurityStatus(null);
                }}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  securityTab === 'password'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Đổi Mật Khẩu</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setSecurityTab('pin');
                  setSecurityStatus(null);
                }}
                className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  securityTab === 'pin'
                    ? 'bg-white text-emerald-950 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Đổi Mã PIN (4 Số)</span>
              </button>
            </div>

            {securityStatus && (
              <div className={`p-3 rounded-xl mb-4 text-xs font-semibold ${
                securityStatus.isError ? 'bg-rose-50 border border-rose-200 text-rose-800' : 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              }`}>
                {securityStatus.msg}
              </div>
            )}

            {securityTab === 'password' ? (
              <form onSubmit={handleChangePassword} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Nhập mật khẩu cũ..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mật khẩu mới (tối thiểu 6 ký tự)</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSecurityModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Cập Nhật Mật Khẩu
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleChangePin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã PIN hiện tại</label>
                  <input
                    type="password"
                    maxLength={6}
                    value={oldPin}
                    onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mã PIN mới (4 - 6 số)</label>
                  <input
                    type="password"
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    required
                  />
                </div>
                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSecurityModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                  >
                    Cập Nhật Mã PIN
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
};
