import React, { useState, useEffect } from 'react';
import { 
  Send, 
  CheckCircle2, 
  User, 
  Phone, 
  MapPin, 
  DollarSign, 
  Calendar, 
  Clock, 
  Briefcase, 
  ShieldCheck, 
  Sparkles,
  HelpCircle,
  FileText,
  Mail,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Lead, LoanPurpose } from '../types';
import { LOAN_PURPOSES, VIETNAM_PROVINCES } from '../data/constants';
import { formatVND, formatVNDCompact } from '../utils/loanCalculator';
import { sendLeadEmailNotification, getAdminNotificationEmail } from '../services/emailService';

interface LeadCaptureFormProps {
  initialAmount?: number;
  initialTerm?: number;
  initialPurpose?: LoanPurpose;
  onSubmitSuccess: (lead: Lead) => void;
}

export const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  initialAmount = 50_000_000,
  initialTerm = 24,
  initialPurpose = 'tin_chap_tieu_dung',
  onSubmitSuccess,
}) => {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [province, setProvince] = useState('Hà Nội');
  const [provinceSearch, setProvinceSearch] = useState('');
  const [isProvinceDropdownOpen, setIsProvinceDropdownOpen] = useState(false);
  
  const [loanAmount, setLoanAmount] = useState<number>(initialAmount);
  const [loanTenure, setLoanTenure] = useState<number>(initialTerm);
  const [loanPurpose, setLoanPurpose] = useState<LoanPurpose>(initialPurpose);
  const [monthlyIncome, setMonthlyIncome] = useState<string>('15000000');
  const [preferredContactTime, setPreferredContactTime] = useState<string>('Bất kỳ lúc nào');
  const [note, setNote] = useState('');

  // Form states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedLead, setSubmittedLead] = useState<Lead | null>(null);

  // Sync when initial props change from Calculator
  useEffect(() => {
    if (initialAmount) setLoanAmount(initialAmount);
  }, [initialAmount]);

  useEffect(() => {
    if (initialTerm) setLoanTenure(initialTerm);
  }, [initialTerm]);

  useEffect(() => {
    if (initialPurpose) setLoanPurpose(initialPurpose);
  }, [initialPurpose]);

  // Filter provinces
  const filteredProvinces = VIETNAM_PROVINCES.filter((p) =>
    p.toLowerCase().includes(provinceSearch.toLowerCase())
  );

  // Validate form
  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) {
      errs.fullName = 'Vui lòng nhập họ và tên của bạn';
    } else if (fullName.trim().length < 2) {
      errs.fullName = 'Họ và tên quá ngắn';
    }

    const cleanPhone = phone.replace(/\D/g, '');
    const phoneRegex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!cleanPhone) {
      errs.phone = 'Vui lòng nhập số điện thoại';
    } else if (!phoneRegex.test(cleanPhone)) {
      errs.phone = 'Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 03, 05, 07, 08, 09)';
    }

    if (!province) {
      errs.province = 'Vui lòng chọn tỉnh/thành phố bạn đang sinh sống';
    }

    if (!loanAmount || loanAmount < 3_000_000) {
      errs.loanAmount = 'Số tiền vay tối thiểu là 3.000.000 đ';
    } else if (loanAmount > 100_000_000) {
      errs.loanAmount = 'Số tiền vay tối đa là 100.000.000 đ';
    }

    if (!loanTenure || loanTenure < 3) {
      errs.loanTenure = 'Thời hạn vay tối thiểu là 3 tháng';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const [emailStatus, setEmailStatus] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setEmailStatus('Đang gửi thông tin đến chuyên viên...');

    const purposeObj = LOAN_PURPOSES.find(p => p.value === loanPurpose);

    const newLead: Lead = {
      id: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: fullName.trim(),
      phone: phone.replace(/\D/g, ''),
      province,
      loanAmount,
      loanTenure,
      loanPurpose,
      loanPurposeName: purposeObj ? purposeObj.label : loanPurpose,
      employmentType: 'Người đi làm / Kinh doanh',
      occupation: 'Người đi làm / Kinh doanh',
      monthlyIncome: monthlyIncome ? parseInt(monthlyIncome.replace(/\D/g, ''), 10) : undefined,
      preferredContactTime,
      notes: note.trim() || undefined,
      note: note.trim() || undefined,
      createdAt: new Date().toLocaleString('vi-VN'),
      status: 'new',
      source: 'Form thu lead trực tuyến',
    };

    // Trigger Confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // Safe fallback
    }

    // Trigger automated email dispatch in background
    try {
      const emailRes = await sendLeadEmailNotification(newLead);
      if (emailRes.success) {
        setEmailStatus(`Đã gửi thông báo tới ${emailRes.targetEmail}`);
      } else {
        setEmailStatus(emailRes.message);
      }
    } catch (err) {
      console.error('Email dispatch error:', err);
    }

    setIsSubmitting(false);
    setSubmittedLead(newLead);
    onSubmitSuccess(newLead);
  };

  const handleResetForm = () => {
    setSubmittedLead(null);
    setEmailStatus(null);
    setFullName('');
    setPhone('');
    setNote('');
    setErrors({});
  };

  return (
    <section id="lead-form-section" className="py-16 sm:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Form Explanation & Guarantee */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Bảo Mật Thông Tin 100%
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Đăng Ký Nhận Tư Vấn <span className="text-emerald-600">Gói Vay Tín Chấp</span> Trong 15 Phút
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Điền thông tin nhu cầu của bạn vào biểu mẫu bên cạnh. Chuyên viên tài chính của chúng tôi 
              sẽ thẩm định sơ bộ và liên hệ tư vấn phương án vay có lãi suất thấp nhất hoàn toàn miễn phí.
            </p>

            {/* Benefit Checkpoints */}
            <div className="space-y-3.5 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Không gọi làm phiền người thân</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Mọi trao đổi được bảo mật tuyệt đối chỉ giữa bạn và chuyên viên tài chính.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Miễn phí tư vấn &amp; thẩm định</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Tuyệt đối không thu bất kỳ khoản phí môi giới hay tiền cọc nào trước khi giải ngân.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                  ✓
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Tỷ lệ duyệt hồ sơ trên 95%</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Liên kết với mạng lưới hơn 20 ngân hàng lớn và công ty tài chính được NHNN cấp phép.
                  </p>
                </div>
              </div>
            </div>

            {/* Hotline Emergency Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 text-white flex items-center justify-between shadow-md">
              <div>
                <div className="text-xs text-emerald-100 font-medium">Cần vay gấp trong ngày?</div>
                <div className="text-base sm:text-lg font-black text-amber-300">Hotline: 0583.345.345</div>
              </div>
              <a
                href="tel:0583345345"
                className="px-3.5 py-2 rounded-lg bg-white text-emerald-950 text-xs font-bold hover:bg-amber-300 transition-colors"
              >
                Gọi Ngay
              </a>
            </div>

          </div>

          {/* Right Column: Lead Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border-2 border-emerald-100 shadow-xl shadow-emerald-900/5 relative">
              
              {/* Success Modal / State */}
              {submittedLead ? (
                <div className="text-center py-8 space-y-5 animate-in fade-in duration-300">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>

                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Đăng Ký Thành Công
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
                      Cảm ơn bạn, {submittedLead.fullName}!
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1.5">
                      Hồ sơ của bạn đã được tiếp nhận với mã tra cứu{' '}
                      <strong className="text-emerald-700 font-black">{submittedLead.id}</strong>. 
                      Chuyên viên tài chính khu vực <strong>{submittedLead.province}</strong> sẽ liên hệ qua số điện thoại{' '}
                      <strong>{submittedLead.phone}</strong> trong vòng 15 - 30 phút.
                    </p>
                  </div>

                  {/* Summary Card */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs sm:text-sm space-y-2 max-w-md mx-auto">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Số tiền đăng ký vay:</span>
                      <span className="font-bold text-emerald-800">{formatVND(submittedLead.loanAmount)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Thời hạn vay mong muốn:</span>
                      <span className="font-bold text-slate-800">{submittedLead.loanTenure} tháng</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Khu vực:</span>
                      <span className="font-bold text-slate-800">{submittedLead.province}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Thời gian tiện nhận cuộc gọi:</span>
                      <span className="font-semibold text-emerald-700">{submittedLead.preferredContactTime}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-600">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <Mail className="w-3.5 h-3.5 text-emerald-600" />
                        Thông báo Gmail Admin:
                      </span>
                      <span className="bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-mono font-medium">
                        {getAdminNotificationEmail()}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={handleResetForm}
                      className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-50 cursor-pointer"
                    >
                      Đăng ký hồ sơ khác
                    </button>
                    <a
                      href="tel:0583345345"
                      className="px-6 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md cursor-pointer"
                    >
                      Gọi Hotline Tư Vấn Ngay
                    </a>
                  </div>
                </div>
              ) : (
                /* Actual Active Form */
                <form onSubmit={handleSubmit} className="space-y-5">
                  
                  <div className="border-b border-slate-100 pb-3 mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-emerald-600" />
                      <span>Thông Tin Đăng Ký Vay Tín Chấp</span>
                    </h3>
                    <p className="text-xs text-slate-500">Điền nhanh trong 1 phút - Nhận kết quả thẩm định ngay</p>
                  </div>

                  {/* 1. Full Name & Phone Number (Primary User Request) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Họ và tên <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <User className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          placeholder="Ví dụ: Nguyễn Văn A"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className={`w-full pl-9.5 pr-3 py-2.5 text-sm rounded-xl border ${
                            errors.fullName ? 'border-red-400 bg-red-50/30' : 'border-slate-300 bg-slate-50/50'
                          } focus:bg-white focus:outline-hidden focus:border-emerald-600 transition-colors`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Số điện thoại <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Phone className="w-4 h-4" />
                        </div>
                        <input
                          type="tel"
                          placeholder="0912 345 678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          maxLength={12}
                          className={`w-full pl-9.5 pr-3 py-2.5 text-sm rounded-xl border ${
                            errors.phone ? 'border-red-400 bg-red-50/30' : 'border-slate-300 bg-slate-50/50'
                          } focus:bg-white focus:outline-hidden focus:border-emerald-600 transition-colors`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.phone}</p>
                      )}
                    </div>

                  </div>

                  {/* 2. Province / City Selection (Primary User Request) */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Tỉnh / Thành phố đang sinh sống <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value)}
                        className="w-full pl-9.5 pr-8 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-emerald-600 appearance-none cursor-pointer"
                      >
                        {VIETNAM_PROVINCES.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 text-xs">
                        ▼
                      </div>
                    </div>
                    {errors.province && (
                      <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.province}</p>
                    )}
                  </div>

                  {/* 3. Loan Purpose & Loan Requirements (Primary User Request) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Purpose */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Mục đích vay vốn <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={loanPurpose}
                        onChange={(e) => setLoanPurpose(e.target.value as LoanPurpose)}
                        className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                      >
                        {LOAN_PURPOSES.map((lp) => (
                          <option key={lp.value} value={lp.value}>
                            {lp.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Loan Amount */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Số tiền cần vay (3tr - 100tr) <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <DollarSign className="w-4 h-4" />
                        </div>
                        <input
                          type="text"
                          value={loanAmount ? new Intl.NumberFormat('vi-VN').format(loanAmount) : ''}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/\D/g, '');
                            const num = raw ? Math.min(100_000_000, parseInt(raw, 10)) : 0;
                            setLoanAmount(num);
                          }}
                          className="w-full pl-9.5 pr-8 py-2.5 text-sm font-bold text-emerald-800 rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                          placeholder="30.000.000"
                        />
                        <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs font-semibold text-slate-400">
                          VNĐ
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1.5 flex flex-wrap items-center justify-between gap-1">
                        <span className="font-semibold text-emerald-700">{formatVNDCompact(loanAmount)}</span>
                        <div className="flex gap-1.5 text-[10px]">
                          {[5_000_000, 10_000_000, 30_000_000, 50_000_000, 100_000_000].map((quickAmt) => (
                            <button
                              key={quickAmt}
                              type="button"
                              onClick={() => setLoanAmount(quickAmt)}
                              className={`px-1.5 py-0.5 rounded border ${
                                loanAmount === quickAmt
                                  ? 'bg-emerald-600 text-white border-emerald-600 font-bold'
                                  : 'bg-slate-100 text-slate-600 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50'
                              } cursor-pointer transition-colors`}
                            >
                              {formatVNDCompact(quickAmt)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* 4. Loan Tenure & Income */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Loan Tenure */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Thời hạn vay mong muốn (6 - 36 tháng)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Calendar className="w-4 h-4" />
                        </div>
                        <select
                          value={loanTenure}
                          onChange={(e) => setLoanTenure(Number(e.target.value))}
                          className="w-full pl-9.5 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                        >
                          <option value={6}>6 tháng</option>
                          <option value={9}>9 tháng</option>
                          <option value={12}>12 tháng (1 năm)</option>
                          <option value={18}>18 tháng (1.5 năm)</option>
                          <option value={24}>24 tháng (2 năm)</option>
                          <option value={30}>30 tháng (2.5 năm)</option>
                          <option value={36}>36 tháng (3 năm)</option>
                        </select>
                      </div>
                    </div>

                    {/* Preferred Contact Time */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Thời gian tiện nghe máy
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Clock className="w-4 h-4" />
                        </div>
                        <select
                          value={preferredContactTime}
                          onChange={(e) => setPreferredContactTime(e.target.value)}
                          className="w-full pl-9.5 pr-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                        >
                          <option value="Bất kỳ lúc nào">Bất kỳ lúc nào (Gọi sớm nhất)</option>
                          <option value="Buổi sáng (8h - 12h)">Buổi sáng (8h - 12h)</option>
                          <option value="Buổi chiều (13h30 - 17h30)">Buổi chiều (13h30 - 17h30)</option>
                          <option value="Buổi tối (18h - 21h)">Buổi tối (18h - 21h)</option>
                        </select>
                      </div>
                    </div>

                  </div>

                  {/* 5. Additional Note */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Ghi chú thêm về hồ sơ (Hình thức nhận lương, công ty đang làm, hóa đơn...)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ví dụ: Đang nhận lương chuyển khoản VCB 15tr/tháng, cần vay gấp 50tr tiêu dùng..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-base shadow-xl shadow-emerald-600/25 hover:shadow-2xl hover:shadow-emerald-600/35 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Đang gửi hồ sơ thẩm định...</span>
                        </div>
                      ) : (
                        <>
                          <span>GỬI YÊU CẦU TƯ VẤN VAY NGAY (MIỄN PHÍ 100%)</span>
                          <Send className="w-5 h-5" />
                        </>
                      )}
                    </button>
                    <p className="text-[11px] text-center text-slate-400 mt-2">
                      Bằng việc gửi thông tin, bạn đồng ý để chuyên viên tài chính liên hệ tư vấn gói vay thích hợp.
                    </p>
                  </div>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
