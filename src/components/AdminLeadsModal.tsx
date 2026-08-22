import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Search, 
  Filter, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  RefreshCw,
  ExternalLink,
  MessageSquare,
  Mail,
  Send,
  Edit2,
  LogOut,
  KeyRound,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { Lead, LeadStatus } from '../types';
import { formatVND, formatVNDCompact } from '../utils/loanCalculator';
import { LOAN_PURPOSES } from '../data/constants';
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

interface AdminLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  leads: Lead[];
  onUpdateLeadStatus: (leadId: string, status: LeadStatus, adminNote?: string) => void;
  onDeleteLead: (leadId: string) => void;
  onResetSampleLeads: () => void;
}

export const AdminLeadsModal: React.FC<AdminLeadsModalProps> = ({
  isOpen,
  onClose,
  onLogout,
  leads,
  onUpdateLeadStatus,
  onDeleteLead,
  onResetSampleLeads,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');

  // Password & Security Management Modal
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [securityTab, setSecurityTab] = useState<'password' | 'pin'>('password');
  const [securityStatus, setSecurityStatus] = useState<{ msg: string; isError?: boolean } | null>(null);

  // Email Notification State
  const [adminEmail, setAdminEmailState] = useState<string>(() => getAdminNotificationEmail());
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [emailInputVal, setEmailInputVal] = useState(adminEmail);
  const [isSendingTestEmail, setIsSendingTestEmail] = useState(false);
  const [emailFeedback, setEmailFeedback] = useState<{ msg: string; isError?: boolean } | null>(null);
  const [resendingLeadId, setResendingLeadId] = useState<string | null>(null);

  const handleLogout = () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất khỏi trang Quản Trị Đức Hải FE?')) {
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
      fullName: 'Nguyễn Văn Thử Nghiệm (Test Lead)',
      phone: '0965234222',
      province: 'Hà Nội',
      loanAmount: 50_000_000,
      loanTenure: 24,
      loanPurpose: 'tin_chap_theo_luong',
      loanPurposeName: 'Vay Tín Chấp Theo Bảng Lương (Test)',
      occupation: 'Nhân viên công sở',
      monthlyIncome: 18_000_000,
      preferredContactTime: 'Trong giờ hành chính',
      note: 'Đây là lead thử nghiệm hệ thống thông báo Gmail tự động.',
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'new',
    };

    try {
      const res = await sendLeadEmailNotification(testLead);
      if (res.success) {
        setEmailFeedback({ msg: `✅ Đã gửi email test thành công tới ${adminEmail}! Hãy kiểm tra hộp thư đến/spam.` });
      } else {
        setEmailFeedback({ msg: `ℹ️ ${res.message}`, isError: false });
      }
    } catch (err: any) {
      setEmailFeedback({ msg: `Lỗi gửi test: ${err.message || 'Thử lại sau'}`, isError: true });
    } finally {
      setIsSendingTestEmail(false);
      setTimeout(() => setEmailFeedback(null), 7000);
    }
  };

  const handleResendLeadEmail = async (lead: Lead) => {
    setResendingLeadId(lead.id);
    try {
      const res = await sendLeadEmailNotification(lead);
      alert(`Đã gửi lại thông tin lead ${lead.fullName} (${lead.phone}) tới ${adminEmail}`);
    } catch (err) {
      alert('Không thể gửi email lúc này. Vui lòng sử dụng tính năng "Mở Gmail" để soạn thư trực tiếp.');
    } finally {
      setResendingLeadId(null);
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

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Ma_Lead,Ho_Ten,So_Dien_Thoai,Tinh_Thanh,So_Tien_Vay_VND,Thoi_Han_Thang,Muc_Dich,Trang_Thai,Thoi_Gian_Dang_Ky,Ghi_Chu\n';
    const rows = leads
      .map(
        (l) =>
          `"${l.id}","${l.fullName}","${l.phone}","${l.province}",${l.loanAmount},${l.loanTenure},"${l.loanPurpose}","${l.status}","${l.createdAt}","${(l.note || '').replace(/"/g, '""')}"`
      )
      .join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + encodeURIComponent(headers + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `Danh_sach_lead_khach_vay_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
  };

  const getPurposeLabel = (val: string) => {
    const found = LOAN_PURPOSES.find((p) => p.value === val);
    return found ? found.label : val;
  };

  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case 'new':
        return <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[11px] font-bold">Mới đăng ký</span>;
      case 'contacted':
        return <span className="px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 text-[11px] font-bold">Đã liên hệ</span>;
      case 'approved':
        return <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">Đã duyệt vay</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 text-[11px] font-bold">Không phù hợp</span>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
        <div 
          className="relative bg-white rounded-3xl max-w-6xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-emerald-100 overflow-hidden"
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
                  <span>Trung Tâm Quản Trị Đức Hải FE</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-400 text-slate-950 font-bold uppercase">
                    Admin Portal
                  </span>
                </h3>
                <p className="text-xs text-emerald-200">
                  Quản lý khách hàng vay vốn và theo dõi trạng thái tư vấn giải ngân
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap justify-end">
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
                <span className="hidden sm:inline">Đổi Mật Khẩu</span>
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
                onClick={handleExportCSV}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xuất File Excel</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* LEADS CONTENT */}
          <div className="flex-1 flex flex-col overflow-hidden">
              {/* Stats Metrics Bar */}
              <div className="bg-emerald-50/80 px-6 py-3.5 border-b border-emerald-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-xs">
                  <div className="text-[11px] text-slate-500 font-medium">Tổng số Lead</div>
                  <div className="text-lg font-black text-slate-900">{leads.length} khách</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-xs">
                  <div className="text-[11px] text-amber-700 font-medium">Cần liên hệ (Mới)</div>
                  <div className="text-lg font-black text-amber-600">{newLeadsCount} khách</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-xs">
                  <div className="text-[11px] text-emerald-700 font-medium">Đã duyệt giải ngân</div>
                  <div className="text-lg font-black text-emerald-600">{approvedLeadsCount} khách</div>
                </div>

                <div className="bg-white p-3 rounded-xl border border-emerald-100 shadow-xs">
                  <div className="text-[11px] text-slate-500 font-medium">Tổng nhu cầu vốn</div>
                  <div className="text-lg font-black text-emerald-800">{formatVNDCompact(totalLoanAmount)}</div>
                </div>
              </div>

              {/* Email Notification Status & Test Bar */}
              <div className="bg-emerald-950 text-white px-6 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-emerald-800">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="flex items-center gap-1.5 font-bold text-amber-300">
                    <Mail className="w-4 h-4 text-amber-400" />
                    <span>Thông Báo Lead Tự Động Qua Gmail:</span>
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

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {emailFeedback && (
                    <span className={`text-[11px] px-2 py-0.5 rounded ${emailFeedback.isError ? 'bg-rose-900 text-rose-200' : 'bg-emerald-800 text-emerald-100'}`}>
                      {emailFeedback.msg}
                    </span>
                  )}
                  <button
                    onClick={handleSendTestEmail}
                    disabled={isSendingTestEmail}
                    className="bg-amber-400 hover:bg-amber-300 disabled:opacity-50 text-slate-950 px-3 py-1 rounded-md font-bold text-[11px] flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                  >
                    <Send className="w-3 h-3" />
                    <span>{isSendingTestEmail ? 'Đang gửi test...' : 'Gửi Thử Email Test'}</span>
                  </button>
                </div>
              </div>

              {/* Filters Bar */}
              <div className="p-4 sm:p-6 bg-slate-50/70 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Tìm theo tên, SĐT, tỉnh thành..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-emerald-500 bg-white"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
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
              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                {filteredLeads.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-slate-500 font-medium text-sm">Không tìm thấy lead nào phù hợp.</p>
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
                          <th className="pb-3 px-4">Mã / Ngày</th>
                          <th className="pb-3 px-4">Họ và tên</th>
                          <th className="pb-3 px-4">Số điện thoại</th>
                          <th className="pb-3 px-4">Tỉnh thành</th>
                          <th className="pb-3 px-4">Khoản vay &amp; Kỳ hạn</th>
                          <th className="pb-3 px-4">Mục đích vay</th>
                          <th className="pb-3 px-4">Trạng thái</th>
                          <th className="pb-3 px-4 text-right">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {filteredLeads.map((lead) => (
                          <tr key={lead.id} className="hover:bg-emerald-50/40 transition-colors">
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-slate-900">{lead.id}</div>
                              <div className="text-[10px] text-slate-400">
                                {new Date(lead.createdAt).toLocaleDateString('vi-VN')}
                              </div>
                            </td>

                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              {lead.fullName}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={`tel:${lead.phone}`}
                                  className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                                >
                                  <Phone className="w-3 h-3" />
                                  <span>{lead.phone}</span>
                                </a>
                                <a
                                  href={`https://zalo.me/${lead.phone}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="px-1.5 py-0.5 rounded-sm bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200"
                                  title="Nhắn Zalo"
                                >
                                  Zalo
                                </a>
                              </div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="flex items-center gap-1 text-slate-600">
                                <MapPin className="w-3 h-3 text-slate-400" />
                                {lead.province}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="font-black text-emerald-800">{formatVND(lead.loanAmount)}</div>
                              <div className="text-[10px] text-slate-400">{lead.loanTenure} tháng</div>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium">
                                {getPurposeLabel(lead.loanPurpose)}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <select
                                value={lead.status}
                                onChange={(e) => onUpdateLeadStatus(lead.id, e.target.value as LeadStatus)}
                                className="text-[11px] font-bold px-2 py-1 rounded-lg border border-slate-200 bg-white focus:outline-hidden cursor-pointer"
                              >
                                <option value="new">🟡 Mới</option>
                                <option value="contacted">🔵 Đã gọi</option>
                                <option value="approved">🟢 Đã duyệt</option>
                                <option value="rejected">🔴 Không duyệt</option>
                              </select>
                            </td>

                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={generateLeadMailtoUrl(lead, adminEmail)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                                  title="Mở Gmail soạn thư"
                                >
                                  <Mail className="w-4 h-4" />
                                </a>

                                <button
                                  onClick={() => handleResendLeadEmail(lead)}
                                  disabled={resendingLeadId === lead.id}
                                  className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 disabled:opacity-50 transition-colors cursor-pointer"
                                  title="Gửi lại thông báo qua Gmail"
                                >
                                  <Send className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedLead(lead);
                                    setAdminNoteInput(lead.adminNote || '');
                                  }}
                                  className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                                  title="Xem chi tiết & Ghi chú"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => onDeleteLead(lead.id)}
                                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                                  title="Xóa lead"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Lead Details Modal / Drawer */}
              {selectedLead && (
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
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
                        <span className="font-bold text-slate-800">{selectedLead.phone}</span>
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
                        <span className="text-slate-400">Tỉnh / Thành phố:</span>
                        <span className="font-bold text-slate-800">{selectedLead.province}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-slate-50">
                        <span className="text-slate-400">Ghi chú của khách:</span>
                        <span className="font-medium text-slate-700">{selectedLead.note || 'Không có'}</span>
                      </div>
                    </div>

                    {/* Admin Internal Note Input */}
                    <div className="space-y-1.5 pt-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Ghi chú nội bộ chuyên viên thẩm định:
                      </label>
                      <textarea
                        rows={3}
                        value={adminNoteInput}
                        onChange={(e) => setAdminNoteInput(e.target.value)}
                        placeholder="Ghi chú: Khách hẹn bổ sung CCCD chiều nay, đã liên kết hồ sơ..."
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

                        <button
                          type="button"
                          onClick={() => handleResendLeadEmail(selectedLead)}
                          disabled={resendingLeadId === selectedLead.id}
                          className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 text-xs font-semibold flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5 text-blue-600" />
                          <span>Gửi Email Lại</span>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedLead(null)}
                          className="px-4 py-2 rounded-lg border border-slate-200 text-slate-600 text-xs font-semibold cursor-pointer"
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

          {/* Footer Note */}
          <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Dữ liệu được lưu trữ tự động trên trình duyệt và cập nhật ngay lên website</span>
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
