// src/data/expertAndLegalData.ts
/**
 * E-E-A-T Expert Profile, Legal Transparency Policies, Customer Case Studies,
 * Financial Knowledge Articles, Local SEO Hubs, and Product Silos.
 */

export interface ExpertProfile {
  name: string;
  role: string;
  previousCompany: string;
  experienceYears: number;
  phone: string;
  email: string;
  address: string;
  bio: string;
  credentials: string[];
  ethicsCommitment: string[];
}

export const EXPERT_PROFILE: ExpertProfile = {
  name: 'Phạm Đức Hải (Đức Hải FE)',
  role: 'Chuyên Viên Tư Vấn & Thẩm Định Tín Chấp Độc Lập (Direct Sales Specialist)',
  previousCompany: 'Từng công tác tại Công ty Tài chính TNHH MTV Ngân hàng Việt Nam Thịnh Vượng (FE Credit / VPBank Finance)',
  experienceYears: 7,
  phone: '0583.345.345',
  email: 'phamduchai6991@gmail.com',
  address: '12 Trần Minh Tông, Hưng Lộc, TP. Vinh, Nghệ An',
  bio: 'Với hơn 7 năm kinh nghiệm trực tiếp làm việc trong ngành tài chính tiêu dùng tại FE Credit và hệ thống ngân hàng đối tác, Đức Hải đã trực tiếp thẩm định, hoàn thiện hồ sơ và hỗ trợ giải ngân thành công cho hơn 4.200 khách hàng trên toàn quốc. Tôi thành lập Vay365 với sứ mệnh mang lại sự minh bạch 100% về lãi suất dư nợ giảm dần, bảo vệ người tiêu dùng khỏi các chiêu trò tín dụng đen và cam kết tư vấn hoàn toàn miễn phí, không thu phụ phí trước giải ngân.',
  credentials: [
    'Chứng chỉ Nghiệp vụ Thẩm định & Quản trị Rủi ro Tín dụng Tiêu dùng',
    'Từng là Top Direct Sales Specialist (DSS) xuất sắc khu vực Miền Trung - FE Credit',
    'Hơn 7 năm kinh nghiệm thẩm định thực địa và xét duyệt hồ sơ qua hệ thống CIC',
    'Am hiểu sâu sắc quy định của Ngân hàng Nhà nước Việt Nam (Thông tư 39/2016/TT-NHNN, Thông tư 43/2016/TT-NHNN và Thông tư 18/2019/TT-NHNN)'
  ],
  ethicsCommitment: [
    'Miễn phí tư vấn 100%: Tuyệt đối KHÔNG thu bất kỳ khoản phí hồ sơ, phí cọc hay phí thẩm định nào trước khi tiền vào tài khoản.',
    'Bảo mật dữ liệu tuyệt đối: Tuân thủ nghiêm ngặt Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.',
    'Minh bạch lãi suất: Luôn giải thích rõ ràng bảng tính lãi suất dư nợ giảm dần, số tiền gốc và lãi trả từng tháng trước khi khách ký hợp đồng.',
    'Chống tín dụng đen & lừa đảo: Cảnh báo và hướng dẫn khách hàng nhận diện các hành vi lừa đảo nạp tiền trước trên mạng.'
  ]
};

export interface CustomerCaseStudy {
  id: string;
  customerName: string; // e.g. "Anh Nguyễn V. T."
  location: string; // e.g. "Vinh, Nghệ An"
  loanPackage: string; // e.g. "Vay tín chấp theo bảng lương"
  amount: number;
  termMonths: number;
  interestRate: string;
  disbursementTime: string;
  situation: string;
  solution: string;
  feedback: string;
  rating: number;
  verifiedDate: string;
}

export const REAL_CASE_STUDIES: CustomerCaseStudy[] = [
  {
    id: 'case-01',
    customerName: 'Anh Nguyễn V. T.',
    location: 'Quán Bàu, TP. Vinh, Nghệ An',
    loanPackage: 'Vay tín chấp theo bảng lương',
    amount: 60_000_000,
    termMonths: 24,
    interestRate: '0.8%/tháng (Dư nợ giảm dần)',
    disbursementTime: '3 giờ sau khi nộp hồ sơ',
    situation: 'Công nhân kỹ thuật tại KCN VSIP Nghệ An, lương chuyển khoản 11 triệu/tháng, cần vốn gấp để sửa sang nhà cửa trước mùa mưa bão nhưng ngại thủ tục ngân hàng truyền thống rườm rà.',
    solution: 'Đức Hải FE trực tiếp hỗ trợ tải sao kê ngân hàng online, tối ưu điểm tín dụng nội bộ, hồ sơ được phê duyệt tự động với hạn mức 60 triệu trong vòng 3 giờ.',
    feedback: '“Tôi rất ấn tượng vì anh Hải tư vấn cực kỳ rõ ràng, đưa cho tôi xem bảng tính từng tháng phải trả bao nhiêu tiền gốc và lãi. Đặc biệt không hề mất 1 đồng phí cọc nào như những chỗ khác trên mạng.”',
    rating: 5,
    verifiedDate: '15/08/2026'
  },
  {
    id: 'case-02',
    customerName: 'Chị Lê Thị M. H.',
    location: 'Cầu Giấy, Hà Nội',
    loanPackage: 'Vay tín chấp tiểu thương & Hộ kinh doanh',
    amount: 80_000_000,
    termMonths: 36,
    interestRate: '0.9%/tháng (Dư nợ giảm dần)',
    disbursementTime: 'Giải ngân trong ngày (24H)',
    situation: 'Chủ quầy tạp hóa và đồ gia dụng, cần 80 triệu nhập hàng đợt Tết nhưng không có tài sản thế chấp nhà đất và không có sao kê bảng lương công ty.',
    solution: 'Hỗ trợ thẩm định theo giấy phép đăng ký kinh doanh và mã QR thanh toán của quầy hàng. Lập kế hoạch trả góp 36 tháng để giảm áp lực dòng tiền mỗi tháng chỉ khoảng 2.9 triệu cả gốc lẫn lãi.',
    feedback: '“Thủ tục làm qua điện thoại rất tiện, nhân viên hướng dẫn chụp ảnh quầy hàng và CCCD gắn chip là xong. Tiền chuyển thẳng vào Vietcombank của mình.”',
    rating: 5,
    verifiedDate: '28/08/2026'
  },
  {
    id: 'case-03',
    customerName: 'Anh Trần H. Q.',
    location: 'Thủ Đức, TP. Hồ Chí Minh',
    loanPackage: 'Vay tín chấp qua HĐ Bảo hiểm Nhân thọ',
    amount: 70_000_000,
    termMonths: 24,
    interestRate: '0.85%/tháng (Dư nợ giảm dần)',
    disbursementTime: 'Duyệt trong 24 giờ',
    situation: 'Kinh doanh tự do, có tham gia bảo hiểm nhân thọ Manulife được 2.5 năm (phí 18 triệu/năm), từng bị một số app tài chính từ chối do nghề nghiệp tự do.',
    solution: 'Đức Hải kiểm tra lịch sử đóng phí bảo hiểm liên tục, hỗ trợ nộp hồ sơ theo gói ưu đãi dành riêng cho người có bảo hiểm nhân thọ, không cần chứng minh thu nhập phức tạp.',
    feedback: '“Ban đầu tôi sợ bị lừa vì trên mạng nhiều app đòi chuyển tiền trước mới giải ngân. Anh Hải cam kết ngay từ đầu là giải ngân xong mới thanh toán tiền vay qua ngân hàng đối tác, cực kỳ an tâm.”',
    rating: 5,
    verifiedDate: '04/09/2026'
  },
  {
    id: 'case-04',
    customerName: 'Bác Hoàng Đ. V.',
    location: 'Nghi Lộc, Nghệ An',
    loanPackage: 'Vay tín chấp tiêu dùng qua CCCD',
    amount: 35_000_000,
    termMonths: 18,
    interestRate: '1.0%/tháng (Dư nợ giảm dần)',
    disbursementTime: 'Duyệt trong 4 giờ',
    situation: 'Cần tiền đóng học phí đại học cho con trai tại Hà Nội, chỉ có CCCD gắn chip và hóa đơn tiền điện sinh hoạt gia đình.',
    solution: 'Hướng dẫn con trai bác tra cứu trước bảng tính lãi suất trên Vay365. Thẩm định qua CCCD gắn chip và số điện thoại chính chủ của bác.',
    feedback: '“Bảng tính lãi trên web rất dễ hiểu, người già như tôi nhìn vào cũng biết mỗi tháng trả mấy đồng. Anh Hải người Nghệ An tư vấn chân thật, nhiệt tình.”',
    rating: 5,
    verifiedDate: '12/09/2026'
  }
];

export interface FinancialArticle {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  targetKeyword: string;
  updatedAt: string;
  content: {
    heading: string;
    paragraphs: string[];
  }[];
  faq: { q: string; a: string }[];
}

export const FINANCIAL_KNOWLEDGE_ARTICLES: FinancialArticle[] = [
  {
    slug: 'cach-tinh-lai-suat-du-no-giam-dan-0-8-thang',
    title: 'Cách Tính Lãi Suất Dư Nợ Giảm Dần 0.8%/Tháng Chuẩn Ngân Hàng Kèm Bảng Mẫu',
    category: 'Cẩm Nang Tính Lãi',
    readTime: '6 phút đọc',
    summary: 'Hướng dẫn chi tiết công thức tính lãi suất theo dư nợ giảm dần 0.8%/tháng. So sánh cụ thể với lãi suất phẳng (cố định) để người vay không bị thiệt thòi hàng chục triệu đồng tiền lãi.',
    targetKeyword: 'cách tính lãi suất dư nợ giảm dần 0.8%/tháng',
    updatedAt: '26/09/2026',
    content: [
      {
        heading: '1. Lãi suất dư nợ giảm dần là gì?',
        paragraphs: [
          'Lãi suất theo dư nợ giảm dần (Reducing Balance Interest) là phương pháp tính tiền lãi chỉ dựa trên số tiền nợ gốc THỰC TẾ còn lại tại thời điểm tính, sau khi đã trừ đi phần tiền gốc người vay đã trả ở các kỳ trước đó.',
          'Ngược lại với lãi suất phẳng (Flat Interest - tính lãi trên số tiền vay ban đầu trong suốt toàn bộ kỳ hạn), phương pháp dư nợ giảm dần giúp số tiền lãi người vay phải trả giảm dần theo từng tháng, càng về cuối kỳ hạn số tiền phải nộp càng ít đi.'
        ]
      },
      {
        heading: '2. Công thức tính lãi suất dư nợ giảm dần chuẩn',
        paragraphs: [
          'Tiền gốc trả hàng tháng = Tổng số tiền vay ban đầu / Tổng số tháng vay.',
          'Tiền lãi tháng thứ N = (Số dư nợ gốc còn lại đầu tháng N) × (Lãi suất theo tháng).',
          'Tổng số tiền phải trả tháng N = Tiền gốc hàng tháng + Tiền lãi tháng thứ N.',
          'Ví dụ thực tế: Anh vay 60.000.000 đ trong 12 tháng với lãi suất 0.8%/tháng (tương đương 9.6%/năm tính theo dư nợ giảm dần). Tiền gốc cố định mỗi tháng = 60.000.000 / 12 = 5.000.000 đ. Tháng thứ 1: Tiền lãi = 60.000.000 × 0.8% = 480.000 đ. Tổng đóng = 5.480.000 đ. Tháng thứ 2: Tiền lãi = 55.000.000 × 0.8% = 440.000 đ. Tổng đóng = 5.440.000 đ. Tiền lãi giảm dần đều mỗi tháng 40.000 đ!'
        ]
      },
      {
        heading: '3. Vì sao nên dùng công cụ tính lịch trả nợ tại Vay365?',
        paragraphs: [
          'Thay vì phải lập bảng tính Excel phức tạp, Vay365 cung cấp bảng tính tự động hóa 100%. Bạn chỉ cần nhập số tiền và kỳ hạn, hệ thống sẽ xuất ngay lịch trả nợ chi tiết từng tháng từ tháng thứ 1 đến tháng thứ 36, kèm tính năng xuất file Excel hoặc in lịch hẹn trả nợ trực tiếp.'
        ]
      }
    ],
    faq: [
      {
        q: 'Lãi suất 0.8%/tháng tính theo dư nợ giảm dần tương đương bao nhiêu % lãi suất phẳng?',
        a: 'Lãi suất 0.8%/tháng dư nợ giảm dần tương đương khoảng 0.44% - 0.48%/tháng nếu tính theo lãi suất phẳng. Do đó nếu thấy tổ chức nào chào lãi suất phẳng hãy quy đổi ra dư nợ giảm dần để so sánh chính xác.'
      },
      {
        q: 'Có được tất toán hợp đồng vay trước hạn không?',
        a: 'Có. Khi vay tín chấp tiêu dùng theo Thông tư 43/2016/TT-NHNN, khách hàng hoàn toàn có quyền tất toán trước hạn bất kỳ lúc nào để tiết kiệm tiền lãi các tháng còn lại.'
      }
    ]
  },
  {
    slug: 'no-xau-nhom-2-co-vay-tin-chap-duoc-khong',
    title: 'Nợ Xấu Nhóm 2 Có Vay Tín Chấp Được Không? Hướng Dẫn Xử Lý Hồ Sơ Nhanh 2026',
    category: 'Kinh Nghiệm Thẩm Định',
    readTime: '7 phút đọc',
    summary: 'Giải đáp từ chuyên viên thẩm định tín dụng FE Credit về điều kiện vay vốn khi có nợ chú ý nhóm 2 trên CIC. Quy trình xóa nợ chú ý và phương án vay tín chấp hợp lệ.',
    targetKeyword: 'nợ xấu nhóm 2 có vay tín chấp theo bảng lương được không',
    updatedAt: '26/09/2026',
    content: [
      {
        heading: '1. Nợ chú ý nhóm 2 trên hệ thống CIC là gì?',
        paragraphs: [
          'Theo phân loại của Trung tâm Thông tin Tín dụng Quốc gia (CIC) thuộc Ngân hàng Nhà nước Việt Nam, nợ nhóm 2 (nợ cần chú ý) là các khoản vay hoặc dư nợ thẻ tín dụng quá hạn từ 10 ngày đến 90 ngày.',
          'Nợ nhóm 2 CHƯA PHẢI LÀ NỢ XẤU (nợ xấu chính thức tính từ nhóm 3 đến nhóm 5: quá hạn trên 90 ngày). Tuy nhiên, hầu hết các ngân hàng thương mại quốc doanh sẽ tự động từ chối hồ sơ khi hệ thống phát hiện khách hàng có nợ nhóm 2.'
        ]
      },
      {
        heading: '2. Nợ nhóm 2 có vay tín chấp theo bảng lương được không?',
        paragraphs: [
          'CÂU TRẢ LỜI LÀ CÓ THỂ, tùy thuộc vào 2 yếu tố quyết định:',
          'Yếu tố 1: Khoản nợ nhóm 2 đó đã được thanh toán xong chưa? Nếu bạn đã thanh toán dứt điểm và khoản nợ đã phát sinh cách đây từ 3 - 6 tháng, các công ty tài chính tiêu dùng được cấp phép (như FE Credit, Mirae Asset, Shinhan Finance) vẫn xem xét duyệt hồ sơ bình thường.',
          'Yếu tố 2: Nguồn thu nhập hiện tại của bạn. Nếu bạn có hợp đồng lao động và sao kê lương thực nhận trên 6 triệu đồng/tháng chuyển khoản ngân hàng, tỷ lệ duyệt vẫn đạt trên 80%.'
        ]
      },
      {
        heading: '3. Lời khuyên vàng từ Chuyên viên thẩm định Đức Hải',
        paragraphs: [
          'Tuyệt đối không nghe theo các đối tượng mạo danh cam kết "xóa nợ xấu CIC" để lừa chuyển tiền. Dữ liệu CIC do Ngân hàng Nhà nước quản lý tập trung và không một cá nhân nào có thể can thiệp sửa đổi.',
          'Cách duy nhất là thanh toán ngay số tiền quá hạn, lưu giữ biên lai nộp tiền và liên hệ chuyên viên uy tín để thiết kế phương án nộp hồ sơ vào đúng tổ chức tín dụng có chính sách chấp nhận nợ chú ý.'
        ]
      }
    ],
    faq: [
      {
        q: 'Sau khi trả hết nợ nhóm 2 thì bao lâu CIC cập nhật lại bình thường?',
        a: 'Thông thường sau khoảng 12 tháng kể từ ngày tất toán toàn bộ nợ nhóm 2, lịch sử tín dụng trên CIC sẽ hoàn toàn sạch và điểm tín dụng sẽ tăng trở lại mức tốt.'
      }
    ]
  },
  {
    slug: 'thu-tuc-vay-tin-chap-theo-hop-dong-bao-hiem-nhan-tho',
    title: 'Thủ Tục Vay Tín Chấp Theo Hợp Đồng Bảo Hiểm Nhân Thọ Hạn Mức Tới 100 Triệu',
    category: 'Hướng Dẫn Vay Vốn',
    readTime: '5 phút đọc',
    summary: 'Chi tiết điều kiện, thủ tục và lãi suất vay tín chấp qua sổ bảo hiểm nhân thọ (Prudential, Manulife, Dai-ichi, Bảo Việt...). Không cần sao kê lương, giải ngân nhanh trong 24h.',
    targetKeyword: 'thủ tục vay tín chấp theo hợp đồng bảo hiểm nhân thọ',
    updatedAt: '26/09/2026',
    content: [
      {
        heading: '1. Vay tín chấp theo hợp đồng bảo hiểm nhân thọ là gì?',
        paragraphs: [
          'Đây là gói vay tín chấp tiêu dùng không cần thế chấp tài sản, trong đó tổ chức tài chính căn cứ vào phí đóng bảo hiểm nhân thọ định kỳ hàng năm của khách hàng để làm thước đo đánh giá năng lực tài chính và uy tín trả nợ.',
          'Tổ chức tín dụng KHÔNG giữ lại hợp đồng bảo hiểm gốc của bạn và quyền lợi bảo hiểm của gia đình bạn vẫn được bảo toàn nguyên vẹn 100%.'
        ]
      },
      {
        heading: '2. Điều kiện áp dụng',
        paragraphs: [
          'Hợp đồng bảo hiểm nhân thọ có hiệu lực tối thiểu từ 1 năm (12 tháng) trở lên tại bất kỳ công ty bảo hiểm nào tại Việt Nam (Bảo Việt, Manulife, Prudential, Dai-ichi, AIA, MB Ageas...).',
          'Người đứng tên vay vốn phải là Bên mua bảo hiểm trên hợp đồng.',
          'Mức phí đóng bảo hiểm tối thiểu từ 2.000.000 đ/năm (phí đóng càng cao thì hạn mức duyệt vay càng lớn, tối đa lên tới 100.000.000 đ).'
        ]
      },
      {
        heading: '3. Hồ sơ cần chuẩn bị',
        paragraphs: [
          '1. Ảnh chụp bản gốc CCCD gắn chip (2 mặt rõ nét).',
          '2. Ảnh chụp trang đầu hợp đồng bảo hiểm nhân thọ (chứng minh bên mua và số hợp đồng).',
          '3. Biên lai đóng phí bảo hiểm kỳ gần nhất (hoặc ảnh chụp màn hình ứng dụng đóng phí online).'
        ]
      }
    ],
    faq: [
      {
        q: 'Tôi đóng phí bảo hiểm theo quý hoặc theo tháng có vay được không?',
        a: 'Được. Hệ thống sẽ quy đổi tổng phí đóng trong 1 năm để làm căn cứ cấp hạn mức vay từ 20 đến 100 triệu.'
      }
    ]
  }
];

export interface LocalSeoHub {
  slug: string;
  name: string;
  province: string;
  hotline: string;
  address: string;
  headline: string;
  description: string;
  featuredAreas: string[];
  disbursementTime: string;
}

export const LOCAL_SEO_HUBS: LocalSeoHub[] = [
  {
    slug: 'vay-tin-chap-nghe-an-tp-vinh',
    name: 'Nghệ An & TP. Vinh',
    province: 'Nghệ An',
    hotline: '0583.345.345',
    address: '12 Trần Minh Tông, Xã Hưng Lộc, TP. Vinh, Nghệ An',
    headline: 'Tư Vấn Vay Tín Chấp Tại Nghệ An & TP. Vinh Duyệt Nhanh 2 - 24H (Đức Hải FE)',
    description: 'Chuyên viên Đức Hải trực tiếp thẩm định và hỗ trợ hồ sơ vay tín chấp không thế chấp tại TP. Vinh, Cửa Lò, Nghi Lộc, Diễn Châu, Yên Thành, Hưng Nguyên, Quỳnh Lưu, Nam Đàn...',
    featuredAreas: [
      'TP. Vinh (Hưng Lộc, Quán Bàu, Hà Huy Tập, Lê Mao, Bến Thủy...)',
      'Khu kinh tế Đông Nam & KCN VSIP Nghệ An',
      'Huyện Nghi Lộc & Thị xã Cửa Lò',
      'Huyện Hưng Nguyên & Huyện Nam Đàn',
      'Huyện Diễn Châu, Yên Thành & Quỳnh Lưu'
    ],
    disbursementTime: 'Thẩm định trực tiếp hoặc online - Giải ngân 2 - 4H'
  },
  {
    slug: 'vay-tin-chap-ha-tinh',
    name: 'Hà Tĩnh & Vũng Áng',
    province: 'Hà Tĩnh',
    hotline: '0583.345.345',
    address: 'Khu vực Bắc Trung Bộ (Hỗ trợ online & tận nơi)',
    headline: 'Vay Tín Chấp Tiêu Dùng Hà Tĩnh - Hạn Mức 3 Tr - 100 Tr Lãi Suất Thấp',
    description: 'Hỗ trợ công nhân, cán bộ công chức, tiểu thương kinh doanh tại TP. Hà Tĩnh, Kỳ Anh, Hồng Lĩnh, Can Lộc, Nghi Xuân, Thạch Hà vay tín chấp tiêu dùng không cần thế chấp tài sản.',
    featuredAreas: [
      'TP. Hà Tĩnh & Thị xã Hồng Lĩnh',
      'Khu kinh tế Vũng Áng & Thị xã Kỳ Anh',
      'Huyện Nghi Xuân & Can Lộc',
      'Huyện Thạch Hà & Cẩm Xuyên'
    ],
    disbursementTime: 'Duyệt online qua CCCD - Tiền về tài khoản 24H'
  },
  {
    slug: 'vay-tin-chap-toan-quoc-online',
    name: 'Toàn Quốc (63 Tỉnh Thành)',
    province: 'Toàn Quốc',
    hotline: '0583.345.345',
    address: 'Hệ thống thẩm định & kết nối giải ngân trực tuyến 24/7',
    headline: 'Vay Tín Chấp Online 63 Tỉnh Thành - 100% Không Cần Gặp Mặt',
    description: 'Nền tảng Vay365 hỗ trợ tư vấn và nộp hồ sơ vay tín chấp cho khách hàng tại Hà Nội, TP.HCM, Đà Nẵng, Bình Dương, Đồng Nai, Hải Phòng và mọi tỉnh thành trên toàn quốc.',
    featuredAreas: [
      'Hà Nội & các tỉnh Đông Bắc / Tây Bắc Bộ',
      'TP. Hồ Chí Minh & các tỉnh Đông Nam Bộ',
      'Đà Nẵng & các tỉnh Duyên hải Miền Trung',
      'Cần Thơ & các tỉnh Đồng bằng Sông Cửu Long'
    ],
    disbursementTime: 'Quy trình eKYC số hóa - Giải ngân nhanh trong ngày'
  }
];

export interface LegalDocument {
  id: string;
  title: string;
  lastUpdated: string;
  summary: string;
  sections: {
    heading: string;
    body: string[];
  }[];
}

export const LEGAL_DOCUMENTS: Record<string, LegalDocument> = {
  privacy: {
    id: 'privacy-policy',
    title: 'Chính Sách Bảo Mật Thông Tin Khách Hàng (Privacy Policy)',
    lastUpdated: '26/09/2026',
    summary: 'Vay365 cam kết bảo vệ toàn vẹn dữ liệu cá nhân của người dùng tuân thủ nghiêm ngặt Luật An toàn thông tin mạng và Nghị định số 13/2023/NĐ-CP của Chính phủ.',
    sections: [
      {
        heading: '1. Mục đích thu thập thông tin',
        body: [
          'Vay365 chỉ thu thập các thông tin tối thiểu cần thiết phục vụ cho việc tư vấn gói vay, bao gồm: Họ và tên, Số điện thoại, Tỉnh/thành phố sinh sống, Số tiền vay và Kỳ hạn vay mong muốn.',
          'Mọi thông tin do khách hàng cung cấp chỉ được sử dụng duy nhất vào mục đích: (i) Liên hệ giải đáp và tư vấn gói vay tín chấp phù hợp nhất; (ii) Giúp khách hàng lập bảng tính lịch trả nợ dự kiến theo phương pháp dư nợ giảm dần.'
        ]
      },
      {
        heading: '2. Cam kết không mua bán dữ liệu',
        body: [
          'Vay365 cam kết TUYỆT ĐỐI KHÔNG bán, cho thuê, chia sẻ hay trao đổi thông tin khách hàng cho bất kỳ bên thứ ba không liên quan nào vì mục đích quảng cáo rác.',
          'Thông tin chỉ được chuyển đến đối tác ngân hàng / công ty tài chính được cấp phép khi có sự đồng thuận rõ ràng của khách hàng để tiến hành thẩm định khoản vay.'
        ]
      },
      {
        heading: '3. Quyền của khách hàng đối với dữ liệu',
        body: [
          'Khách hàng có toàn quyền yêu cầu Vay365 kiểm tra, cập nhật, chỉnh sửa hoặc xóa vĩnh viễn thông tin cá nhân của mình khỏi hệ thống lưu trữ bất cứ lúc nào bằng cách liên hệ Hotline: 0583.345.345 hoặc email: phamduchai6991@gmail.com.'
        ]
      }
    ]
  },
  terms: {
    id: 'terms-of-service',
    title: 'Điều Khoản Sử Dụng Dịch Vụ Vay365 (Terms of Service)',
    lastUpdated: '26/09/2026',
    summary: 'Các quy định sử dụng công cụ tính lãi suất và dịch vụ tư vấn tài chính trực tuyến tại website Vay365.com.',
    sections: [
      {
        heading: '1. Chấp thuận điều khoản',
        body: [
          'Khi truy cập và sử dụng website Vay365.com, người dùng được coi là đã đọc, hiểu và đồng ý tuân thủ toàn bộ các điều khoản được quy định tại đây.',
          'Người dùng phải từ đủ 18 tuổi trở lên, có đầy đủ năng lực hành vi dân sự theo quy định của pháp luật Việt Nam.'
        ]
      },
      {
        heading: '2. Tính chất của công cụ tính lãi suất',
        body: [
          'Công cụ tính lãi suất dư nợ giảm dần trên website được phát triển nhằm mục đích cung cấp bảng mô phỏng lịch trả nợ tham khảo chính xác theo toán học tài chính.',
          'Số tiền trả góp thực tế sẽ được quy định cụ thể tại Hợp đồng tín dụng chính thức giữa khách hàng và tổ chức cho vay (ngân hàng/công ty tài chính đối tác) dựa trên kết quả thẩm định điểm tín dụng cá nhân.'
        ]
      },
      {
        heading: '3. Nguyên tắc miễn phí dịch vụ',
        body: [
          'Dịch vụ tư vấn, sử dụng công cụ tính toán và tiếp nhận đăng ký tại Vay365 là HOÀN TOÀN MIỄN PHÍ. Khách hàng không phải chi trả bất kỳ khoản phí môi giới nào cho đội ngũ của chúng tôi.'
        ]
      }
    ]
  },
  disclaimer: {
    id: 'disclaimer',
    title: 'Tuyên Bố Miễn Trừ Trách Nhiệm Pháp Lý & Minh Bạch E-E-A-T (Disclaimer)',
    lastUpdated: '26/09/2026',
    summary: 'Phân định rõ ràng vai trò pháp lý độc lập của Vay365 và chuyên viên tư vấn tài chính Đức Hải FE.',
    sections: [
      {
        heading: '1. Vay365 là kênh tư vấn độc lập',
        body: [
          'Vay365 (phụ trách bởi Chuyên viên Phạm Đức Hải) là website cung cấp công cụ tính lịch trả nợ tài chính và dịch vụ tư vấn tín chấp độc lập.',
          'Vay365 KHÔNG PHẢI là một tổ chức tín dụng trực tiếp cho vay vốn, và KHÔNG PHẢI là ngân hàng. Chúng tôi đóng vai trò là cầu nối tư vấn chuyên môn, hỗ trợ khách hàng tiếp cận các gói vay tín chấp tiêu dùng chính thống từ các ngân hàng và tổ chức tài chính được Ngân hàng Nhà nước cấp phép.'
        ]
      },
      {
        heading: '2. Cảnh báo an toàn tín dụng & Phòng chống lừa đảo',
        body: [
          'Vay365 KHÔNG BAO GIỜ yêu cầu khách hàng phải chuyển khoản đặt cọc, nộp phí thẩm định trước hay mua bảo hiểm trước khi giải ngân.',
          'Nếu có bất kỳ ai tự xưng là nhân viên Vay365 yêu cầu bạn chuyển tiền trước để được duyệt vay, đó chắc chắn là hành vi lừa đảo giả mạo. Xin vui lòng thông báo ngay cho chúng tôi qua Hotline 0583.345.345.'
        ]
      },
      {
        heading: '3. Quyết định vay vốn của người dùng',
        body: [
          'Khách hàng nên cân nhắc kỹ khả năng thanh toán hàng tháng dựa trên bảng tính dư nợ giảm dần do Vay365 cung cấp trước khi quyết định ký kết bất kỳ hợp đồng vay vốn nào, đảm bảo tỷ lệ trả nợ không vượt quá 40% tổng thu nhập hàng tháng để duy trì sức khỏe tài chính ổn định.'
        ]
      }
    ]
  }
};
