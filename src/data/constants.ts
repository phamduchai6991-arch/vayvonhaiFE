import { Article, Lead, LoanPackage, LoanPurpose } from '../types';

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

export const ARTICLES_DATA: Article[] = [
  {
    id: 'meo-tang-diem-tin-dung-cic',
    title: '5 Mẹo Vàng Tối Ưu Điểm Tín Dụng CIC Để Được Duyệt Vay Tín Chấp Hạn Mức Tối Đa',
    slug: '5-meo-vang-toi-uu-diem-tin-dung-cic',
    category: 'tips',
    categoryName: 'Mẹo vay vốn',
    readTime: '4 phút đọc',
    publishedDate: '18/08/2026',
    author: 'Chuyên gia Tài chính Trần Minh',
    coverImage: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
    tags: ['Điểm tín dụng', 'Vay tín chấp', 'Kinh nghiệm'],
    featured: true,
    summary: 'Điểm tín dụng CIC là yếu tố then chốt quyết định 80% khả năng phê duyệt khoản vay tín chấp không cần thế chấp. Xem ngay các mẹo giữ điểm tín dụng trên 650 điểm.',
    content: [
      'Trung tâm Thông tin Tín dụng Quốc gia (CIC) là nơi lưu trữ toàn bộ lịch sử vay nợ, mở thẻ tín dụng và thanh toán của mọi công dân tại Việt Nam. Với các gói vay tín chấp (không cần tài sản thế chấp), điểm CIC càng cao, ngân hàng duyệt hồ sơ càng nhanh với lãi suất càng thấp.',
      '1. Luôn thanh toán thẻ tín dụng và khoản vay tín chấp đúng hạn trước ngày đến hạn 2 - 3 ngày để tránh lỗi hệ thống ghi nhận chậm.',
      '2. Giữ tỷ lệ sử dụng hạn mức thẻ tín dụng dưới 40% (ví dụ thẻ 50 triệu chỉ nên chi tiêu tối đa 20 triệu mỗi chu kỳ).',
      '3. Không nộp hồ sơ vay ồ ạt ở 4 - 5 ngân hàng/công ty tài chính cùng một lúc, vì mỗi lần tra cứu CIC (Hard Inquiry) sẽ làm điểm số tạm thời bị giảm.',
      '4. Thường xuyên tự kiểm tra báo cáo tín dụng cá nhân trên cổng CIC để phát hiện sớm các sai sót hoặc các khoản nợ lạ.',
      '5. Nếu từng có nợ quá hạn nhóm 2, hãy tất toán dứt điểm ngay và duy trì lịch sử thanh toán chuẩn chỉ liên tục trong 12 tháng tiếp theo.'
    ]
  },
  {
    id: 'du-no-giam-dan-vs-lai-co-dinh',
    title: 'Phân Biệt Lãi Suất Dư Nợ Giảm Dần và Lãi Cố Định Phẳng Trong Vay Tín Chấp',
    slug: 'phan-biet-du-no-giam-dan-va-lai-co-dinh',
    category: 'guide',
    categoryName: 'Cẩm nang vay',
    readTime: '5 phút đọc',
    publishedDate: '15/08/2026',
    author: 'Ban Cố vấn Tài chính',
    coverImage: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
    tags: ['Lãi suất', 'Tính lãi', 'Dư nợ giảm dần'],
    featured: true,
    summary: 'Rất nhiều khách hàng nhầm lẫn giữa 2 cách tính lãi suất này khi vay tín chấp dẫn đến việc trả tiền chênh lệch đáng kể. Hướng dẫn chi tiết cách so sánh thực tế.',
    content: [
      'Khi vay tín chấp tiêu dùng từ 6 đến 36 tháng, hai phương thức tính lãi phổ biến nhất là "Tính theo Dư nợ giảm dần" và "Tính theo Dư nợ gốc ban đầu (Lãi phẳng)".',
      'LÃI THEO DƯ NỢ GIẢM DẦN: Tiền gốc được chia đều trả hàng tháng. Tiền lãi chỉ tính trên số tiền gốc thực tế còn nợ sau khi đã trừ đi các khoản gốc đã trả của các tháng trước. Do đó, số tiền trả hàng tháng sẽ giảm dần theo thời gian. Đây là phương thức chuẩn mực và minh bạch nhất của các ngân hàng thương mại.',
      'LÃI CỐ ĐỊNH PHẲNG: Tiền lãi mỗi tháng được tính cố định dựa trên số tiền vay ban đầu trong suốt toàn bộ kỳ hạn, bất kể bạn đã trả được bao nhiêu tiền gốc.',
      'LỜI KHUYÊN TỪ CHUYÊN GIA: Hãy luôn sử dụng công cụ tính lãi suất dư nợ giảm dần tại website Đức Hải FE để biết chính xác lịch trả nợ từng tháng và tổng số tiền lãi phải trả thực tế.'
    ]
  },
  {
    id: 'kinh-nghiem-vay-tin-chap-duyet-nhanh',
    title: 'Bí Quyết Chuẩn Bị Hồ Sơ Vay Tín Chấp Duyệt Nhanh Sau 2 Giờ',
    slug: 'bi-quyet-chuan-bi-ho-so-vay-tin-chap',
    category: 'news',
    categoryName: 'Kinh nghiệm vay',
    readTime: '3 phút đọc',
    publishedDate: '20/08/2026',
    author: 'Đức Hải FE',
    coverImage: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
    tags: ['Vay tín chấp', 'Hồ sơ nhanh', 'Ngân hàng'],
    featured: false,
    summary: 'Các mẹo đơn giản chuẩn bị CCCD gắn chip, sao kê ngân hàng và cách trả lời điện thoại thẩm định giúp hồ sơ vay tín chấp được duyệt tự động với hạn mức cao nhất.',
    content: [
      'Vay tín chấp không cần thế chấp tài sản nên ngân hàng và tổ chức tài chính sẽ thẩm định dựa trên mức độ uy tín và khả năng tạo ra thu nhập của người vay.',
      '1. CHUẨN BỊ CCCD GẮN CHIP RÕ NÉT: Chụp đủ 4 góc, không bị lóa sáng hay mất góc.',
      '2. SAO KÊ TÀI KHOẢN: Tải sao kê PDF có mã QR hoặc chữ ký điện tử trực tiếp từ ứng dụng ngân hàng (Mobile Banking).',
      '3. KHAI BÁO THÔNG TIN CHÍNH XÁC: Thông tin nơi làm việc và số điện thoại liên hệ phải trùng khớp để hệ thống AI phê duyệt tự động trong vài phút.',
      'Khách hàng đăng ký tư vấn tại Đức Hải FE sẽ được hỗ trợ chuẩn hóa hồ sơ hoàn toàn miễn phí.'
    ]
  },
  {
    id: 'loi-ich-vay-tin-chap-ngan-han',
    title: 'Vì Sao Nên Chọn Kỳ Hạn Vay Tín Chấp Từ 6 Đến 36 Tháng?',
    slug: 'loi-ich-vay-tin-chap-ngan-han',
    category: 'policy',
    categoryName: 'Lời khuyên tài chính',
    readTime: '4 phút đọc',
    publishedDate: '12/08/2026',
    author: 'Đức Hải FE',
    coverImage: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
    tags: ['Kỳ hạn vay', 'Quản lý tài chính', '6-36 tháng'],
    featured: false,
    summary: 'Khoảng thời gian 6 đến 36 tháng là tỷ lệ vàng giúp cân đối giữa số tiền trả góp hàng tháng vừa phải và tổng tiền lãi tối ưu nhất cho khách hàng cá nhân.',
    content: [
      'Khi vay tiêu dùng tín chấp, việc chọn kỳ hạn đóng vai trò then chốt:',
      '1. KỲ HẠN 6 - 12 THÁNG: Phù hợp cho nhu cầu cần tiền ngắn hạn gấp, tổng tiền lãi phát sinh rất ít, giúp bạn nhanh chóng tất toán khoản nợ.',
      '2. KỲ HẠN 18 - 24 THÁNG: Mức thời gian phổ biến nhất, số tiền gốc chia đều vừa vặn với ngân sách chi tiêu hàng tháng của người hưởng lương.',
      '3. KỲ HẠN 36 THÁNG: Giảm tối đa áp lực trả góp mỗi tháng đối với các khoản vay tín chấp từ 50 - 200 triệu, giúp bạn an tâm duy trì chi tiêu sinh hoạt.'
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
