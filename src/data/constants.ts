import { Lead, LoanPackage, LoanPurpose } from '../types';

export const VIETNAM_PROVINCES: string[] = [
  'Hà Nội',
  'TP. Hồ Chí Minh',
  'Nghệ An',
  'Đà Nẵng',
  'Hải Phòng',
  'Cần Thơ',
  'An Giang',
  'Bà Rịa - Vũng Tàu',
  'Bắc Giang',
  'Bắc Kạn',
  'Bạc Liêu',
  'Bắc Ninh',
  'Bến Tre',
  'Bình Định',
  'Bình Dương',
  'Bình Phước',
  'Bình Thuận',
  'Cà Mau',
  'Cao Bằng',
  'Đắk Lắk',
  'Đắk Nông',
  'Điện Biên',
  'Đồng Nai',
  'Đồng Tháp',
  'Gia Lai',
  'Hà Giang',
  'Hà Nam',
  'Hà Tĩnh',
  'Hải Dương',
  'Hậu Giang',
  'Hòa Bình',
  'Hưng Yên',
  'Khánh Hòa',
  'Kiên Giang',
  'Kon Tum',
  'Lai Châu',
  'Lâm Đồng',
  'Lạng Sơn',
  'Lào Cai',
  'Long An',
  'Nam Định',
  'Ninh Bình',
  'Ninh Thuận',
  'Phú Thọ',
  'Phú Yên',
  'Quảng Bình',
  'Quảng Nam',
  'Quảng Ngãi',
  'Quảng Ninh',
  'Quảng Trị',
  'Sóc Trăng',
  'Sơn La',
  'Tây Ninh',
  'Thái Bình',
  'Thái Nguyên',
  'Thanh Hóa',
  'Thừa Thiên Huế',
  'Tiền Giang',
  'Trà Vinh',
  'Tuyên Quang',
  'Vĩnh Long',
  'Vĩnh Phúc',
  'Yên Bái'
];

export const LOAN_PURPOSES: { value: LoanPurpose; label: string; description: string; icon: string }[] = [
  {
    value: 'tin_chap_tieu_dung',
    label: 'Vay tín chấp tiêu dùng cá nhân',
    description: 'Không cần tài sản thế chấp, duyệt nhanh trong ngày',
    icon: 'CreditCard'
  },
  {
    value: 'tin_chap_theo_luong',
    label: 'Vay tín chấp theo lương / Sao kê',
    description: 'Lãi suất ưu đãi từ 0.6%/tháng cho người đi làm hưởng lương',
    icon: 'Briefcase'
  },
  {
    value: 'tin_chap_kinh_doanh',
    label: 'Vay tín chấp tiểu thương & Hộ kinh doanh',
    description: 'Bổ sung vốn lưu động không cần thế chấp tài sản',
    icon: 'TrendingUp'
  },
  {
    value: 'tin_chap_online_nhanh',
    label: 'Vay tín chấp online duyệt tự động 24/7',
    description: 'Duyệt nhanh qua CCCD gắn chip, hạn mức đến 70 triệu',
    icon: 'Zap'
  },
  {
    value: 'tin_chap_bao_hiem_dien_nuoc',
    label: 'Vay tín chấp theo HĐ Bảo hiểm / Hóa đơn',
    description: 'Áp dụng cho khách hàng có HĐ bảo hiểm nhân thọ hoặc hóa đơn dịch vụ',
    icon: 'FileText'
  },
  {
    value: 'khac',
    label: 'Nhu cầu vay tín chấp khác',
    description: 'Tư vấn viên sẽ thiết kế phương án vay không thế chấp tối ưu nhất',
    icon: 'HelpCircle'
  }
];

export const LOAN_PACKAGES: LoanPackage[] = [
  {
    id: 'tin-chap-theo-luong',
    name: 'Vay Tín Chấp Theo Bảng Lương',
    badge: 'Lãi suất thấp nhất',
    minAmount: 3_000_000,
    maxAmount: 100_000_000,
    minTerm: 6,
    maxTerm: 36,
    baseRate: 0.6,
    rateUnit: '%/tháng (~7.2%/năm)',
    disbursementTime: 'Duyệt trong 2 - 4 giờ',
    isPopular: true,
    purposeValue: 'tin_chap_theo_luong',
    requirements: [
      'Độ tuổi từ 20 - 60 tuổi',
      'Có Hợp đồng lao động hoặc giấy xác nhận công tác',
      'Thu nhập chuyển khoản hoặc tiền mặt từ 4.5 triệu/tháng'
    ],
    features: [
      'Không cần tài sản thế chấp hay bảo lãnh',
      'Hạn mức linh hoạt từ 3 đến 100 triệu',
      'Kỳ hạn linh hoạt 6 - 36 tháng',
      'Bảo mật thông tin cơ quan & gia đình'
    ]
  },
  {
    id: 'tin-chap-tieu-dung-nhanh',
    name: 'Vay Tín Chấp Tiêu Dùng Cá Nhân',
    badge: 'Giải ngân trong 24H',
    minAmount: 3_000_000,
    maxAmount: 70_000_000,
    minTerm: 6,
    maxTerm: 36,
    baseRate: 0.8,
    rateUnit: '%/tháng (~9.6%/năm)',
    disbursementTime: 'Giải ngân trong ngày',
    isPopular: false,
    purposeValue: 'tin_chap_tieu_dung',
    requirements: [
      'CCCD gắn chip chính chủ còn hiệu lực',
      'Không có nợ xấu ngân hàng nhóm 3 trở lên',
      'Có nguồn thu nhập tự do ổn định'
    ],
    features: [
      'Thủ tục 100% online không cần gặp mặt',
      'Hạn mức linh hoạt từ 3 đến 70 triệu',
      'Tính lãi trên dư nợ giảm dần',
      'Miễn phí hồ sơ thẩm định 100%'
    ]
  },
  {
    id: 'tin-chap-ho-kinh-doanh',
    name: 'Vay Tín Chấp Hộ Kinh Doanh / Tiểu Thương',
    badge: 'Vốn lưu động nhanh',
    minAmount: 5_000_000,
    maxAmount: 100_000_000,
    minTerm: 6,
    maxTerm: 36,
    baseRate: 0.9,
    rateUnit: '%/tháng (~10.8%/năm)',
    disbursementTime: 'Duyệt trong 24 giờ',
    isPopular: false,
    purposeValue: 'tin_chap_kinh_doanh',
    requirements: [
      'Có địa điểm kinh doanh, sạp chợ, cửa hàng hoặc bán online',
      'Hoạt động kinh doanh tối thiểu từ 3 tháng trở lên',
      'Có biên lai / sổ sách bán hàng hoặc tài khoản nhận tiền'
    ],
    features: [
      'Không cần thế chấp giấy tờ nhà đất',
      'Hạn mức kinh doanh tối đa 100 triệu',
      'Được tất toán trước hạn bất cứ lúc nào',
      'Bổ sung vốn nhập hàng kịp thời'
    ]
  },
  {
    id: 'tin-chap-bao-hiem-hoa-don',
    name: 'Vay Tín Chấp Theo Bảo Hiểm & Hóa Đơn',
    badge: 'Hồ sơ siêu đơn giản',
    minAmount: 3_000_000,
    maxAmount: 100_000_000,
    minTerm: 6,
    maxTerm: 36,
    baseRate: 1.0,
    rateUnit: '%/tháng (~12%/năm)',
    disbursementTime: 'Duyệt trong 24 - 48h',
    isPopular: false,
    purposeValue: 'tin_chap_bao_hiem_dien_nuoc',
    requirements: [
      'Hóa đơn điện/nước/internet từ 300.000 đ/tháng HOẶC HĐ Bảo hiểm nhân thọ',
      'Chính chủ hoặc người đứng tên cùng hộ khẩu'
    ],
    features: [
      'Không cần sao kê bảng lương',
      'Hạn mức hỗ trợ từ 3 đến 100 triệu',
      'Hồ sơ phê duyệt nhanh',
      'Tư vấn tận tình 24/7'
    ]
  }
];

export const FAQ_DATA = [
  {
    q: 'Hạn mức số tiền vay tín chấp tại Đức Hải FE là bao nhiêu?',
    a: 'Đức Hải FE hỗ trợ các khoản vay tín chấp linh hoạt từ 3 triệu (3.000.000 đ) đến tối đa 100 triệu (100.000.000 đ). Bạn có thể lựa chọn số tiền phù hợp với nhu cầu và kỳ hạn trả góp từ 6 đến 36 tháng.'
  },
  {
    q: 'Vay tín chấp tại Đức Hải FE có cần tài sản thế chấp hoặc người bảo lãnh không?',
    a: 'HOÀN TOÀN KHÔNG. Tất cả các gói vay tại Đức Hải FE đều là Vay Tín Chấp 100% không cần thế chấp sổ đỏ, nhà đất hay xe cộ. Bạn chỉ cần chứng minh thu nhập hoặc có CCCD gắn chip hợp lệ.'
  },
  {
    q: 'Thời hạn vay tín chấp tối thiểu và tối đa là bao lâu?',
    a: 'Thời hạn vay tín chấp linh hoạt từ 6 tháng đến tối đa 36 tháng (3 năm). Bạn có thể tự do lựa chọn kỳ hạn 6, 12, 18, 24, 30 hoặc 36 tháng tùy theo khả năng tài chính.'
  },
  {
    q: 'Tôi bị nợ xấu hoặc nợ chú ý nhóm 2 thì có thể đăng ký vay tín chấp được không?',
    a: 'Đức Hải FE có các giải pháp tài chính linh hoạt. Tùy thuộc vào thời điểm phát sinh nợ quá hạn và việc bạn đã tất toán hay chưa, chuyên viên tư vấn sẽ hỗ trợ tìm phương án khả thi nhất.'
  },
  {
    q: 'Sau khi gửi thông tin đăng ký vay tín chấp, bao lâu tôi sẽ nhận được tư vấn?',
    a: 'Bạn sẽ nhận được cuộc gọi tư vấn miễn phí từ chuyên viên trong vòng 15 - 30 phút (từ 8h00 - 21h00 tất cả các ngày trong tuần).'
  },
  {
    q: 'Đức Hải FE có thu phí tư vấn hay phí thẩm định trước khi giải ngân không?',
    a: 'TUYỆT ĐỐI KHÔNG! Dịch vụ tư vấn, lập bảng tính lãi suất và hỗ trợ hồ sơ tại Đức Hải FE hoàn toàn MIỄN PHÍ 100%. Chúng tôi không bao giờ thu tiền cọc hay bất kỳ phụ phí nào.'
  }
];

export const INITIAL_LEADS: Lead[] = [
  {
    id: 'LEAD-9082',
    fullName: 'Nguyễn Văn Hùng',
    phone: '0912345678',
    province: 'Nghệ An',
    loanAmount: 80_000_000,
    loanTenure: 24,
    loanPurpose: 'tin_chap_theo_luong',
    monthlyIncome: 18_000_000,
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
    loanAmount: 50_000_000,
    loanTenure: 18,
    loanPurpose: 'tin_chap_tieu_dung',
    monthlyIncome: 15_000_000,
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
    loanAmount: 120_000_000,
    loanTenure: 36,
    loanPurpose: 'tin_chap_kinh_doanh',
    monthlyIncome: 30_000_000,
    preferredContactTime: 'Buổi chiều (13h30 - 17h30)',
    note: 'Kinh doanh cửa hàng tạp hóa, cần vốn nhập hàng không thế chấp',
    createdAt: '2026-08-20T14:40:00Z',
    status: 'approved',
    adminNote: 'Đã duyệt hồ sơ tín chấp 120tr kỳ hạn 36 tháng',
    source: 'Gói vay tín chấp KD'
  }
];
