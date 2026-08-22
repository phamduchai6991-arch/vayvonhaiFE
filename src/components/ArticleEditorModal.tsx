import React, { useState, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Image as ImageIcon, 
  Tag, 
  FileText, 
  Check, 
  Calendar, 
  User, 
  Clock, 
  Bookmark,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Article, ArticleCategory } from '../types';

interface ArticleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveArticle: (article: Article) => void;
  editingArticle: Article | null;
}

const CATEGORY_OPTIONS: { value: ArticleCategory; label: string }[] = [
  { value: 'tips', label: 'Mẹo vay vốn' },
  { value: 'guide', label: 'Cẩm nang vay' },
  { value: 'news', label: 'Tin tức lãi suất' },
  { value: 'policy', label: 'Thủ tục pháp lý' },
];

const PRESET_IMAGES = [
  {
    name: 'Tài chính & Tiền tệ',
    url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Hợp đồng & Hồ sơ',
    url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Chuyên gia tư vấn',
    url: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Kế hoạch & Lãi suất',
    url: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ngân hàng số',
    url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
  },
];

export const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({
  isOpen,
  onClose,
  onSaveArticle,
  editingArticle,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ArticleCategory>('tips');
  const [summary, setSummary] = useState('');
  const [author, setAuthor] = useState('Đức Hải FE');
  const [readTime, setReadTime] = useState('3 phút đọc');
  const [coverImage, setCoverImage] = useState(PRESET_IMAGES[0].url);
  const [contentRaw, setContentRaw] = useState('');
  const [tagsRaw, setTagsRaw] = useState('Vay tín chấp, Lãi suất ưu đãi');
  const [featured, setFeatured] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (editingArticle) {
      setTitle(editingArticle.title);
      setCategory(editingArticle.category);
      setSummary(editingArticle.summary);
      setAuthor(editingArticle.author);
      setReadTime(editingArticle.readTime);
      setCoverImage(editingArticle.coverImage);
      setContentRaw(editingArticle.content.join('\n\n'));
      setTagsRaw(editingArticle.tags.join(', '));
      setFeatured(!!editingArticle.featured);
    } else {
      // Default new article state
      setTitle('');
      setCategory('tips');
      setSummary('');
      setAuthor('Đức Hải FE');
      setReadTime('3 phút đọc');
      setCoverImage(PRESET_IMAGES[0].url);
      setContentRaw('');
      setTagsRaw('Vay tín chấp, Lãi suất, Mẹo vay');
      setFeatured(false);
    }
    setErrors({});
  }, [editingArticle, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!title.trim()) errs.title = 'Vui lòng nhập tiêu đề bài viết';
    if (!summary.trim()) errs.summary = 'Vui lòng nhập tóm tắt ngắn cho bài viết';
    if (!contentRaw.trim()) errs.contentRaw = 'Vui lòng nhập nội dung chi tiết bài viết';
    if (!coverImage.trim()) errs.coverImage = 'Vui lòng chọn hoặc nhập URL ảnh bìa';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Convert slug
    const generatedSlug = title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    // Split content paragraphs by double or single newline
    const contentParagraphs = contentRaw
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    // Tags
    const tagList = tagsRaw
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const categoryObj = CATEGORY_OPTIONS.find((c) => c.value === category);
    const categoryName = categoryObj ? categoryObj.label : 'Mẹo vay vốn';

    const now = new Date();
    const formattedDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;

    const newArticle: Article = {
      id: editingArticle ? editingArticle.id : `art-${Date.now()}`,
      title: title.trim(),
      slug: generatedSlug || `bai-viet-${Date.now()}`,
      summary: summary.trim(),
      content: contentParagraphs.length > 0 ? contentParagraphs : [summary.trim()],
      category,
      categoryName,
      readTime: readTime.trim() || '3 phút đọc',
      publishedDate: editingArticle ? editingArticle.publishedDate : formattedDate,
      author: author.trim() || 'Chuyên gia VayVốn247',
      coverImage: coverImage.trim(),
      tags: tagList.length > 0 ? tagList : ['Vay tín chấp'],
      featured,
    };

    onSaveArticle(newArticle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-emerald-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/15">
              <FileText className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight">
                {editingArticle ? 'Chỉnh Sửa Bài Viết Tin Tức' : 'Thêm Bài Viết Mới Vào Mục Tin Tức'}
              </h3>
              <p className="text-xs text-emerald-200">
                Bài viết sau khi lưu sẽ hiển thị trực tiếp trên website cho khách hàng đọc
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* 1. Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Tiêu đề bài viết <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="VD: 5 Cách Chuẩn Bị Hồ Sơ Vay Tín Chấp Để Được Duyệt Hạn Mức Tối Đa..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                errors.title ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 bg-slate-50/50'
              } focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium`}
            />
            {errors.title && <p className="text-xs text-rose-500 mt-1">{errors.title}</p>}
          </div>

          {/* 2. Category & Author & Read Time Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Chuyên mục
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium cursor-pointer"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Tác giả / Ban biên tập
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Thời lượng đọc ước tính
              </label>
              <div className="relative">
                <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="VD: 4 phút đọc"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-300 bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>
            </div>
          </div>

          {/* 3. Cover Image Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              Ảnh bìa bài viết <span className="text-rose-500">*</span>
            </label>
            
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
              <input
                type="text"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Dán URL hình ảnh..."
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-600"
              />
              {coverImage && (
                <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                  <img src={coverImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* Presets */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[11px] text-slate-500 font-medium">Chọn nhanh ảnh mẫu:</span>
              {PRESET_IMAGES.map((img, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setCoverImage(img.url)}
                  className={`text-[11px] px-2.5 py-1 rounded-md border font-semibold transition-all cursor-pointer ${
                    coverImage === img.url
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-900 shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {img.name}
                </button>
              ))}
            </div>
            {errors.coverImage && <p className="text-xs text-rose-500">{errors.coverImage}</p>}
          </div>

          {/* 4. Short Summary */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Tóm tắt bài viết (Summary) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Tóm tắt 1 - 2 câu ngắn gọn về nội dung chính của bài viết..."
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border ${
                errors.summary ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 bg-slate-50/50'
              } focus:bg-white focus:outline-hidden focus:border-emerald-600`}
            />
            {errors.summary && <p className="text-xs text-rose-500 mt-1">{errors.summary}</p>}
          </div>

          {/* 5. Full Content */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5 flex justify-between items-center">
              <span>Nội dung chi tiết bài viết <span className="text-rose-500">*</span></span>
              <span className="text-[11px] font-normal text-slate-500">Mỗi đoạn văn cách nhau bằng 1 dòng trống (Enter 2 lần)</span>
            </label>
            <textarea
              rows={7}
              value={contentRaw}
              onChange={(e) => setContentRaw(e.target.value)}
              placeholder="Nhập hoặc dán nội dung chi tiết bài viết ở đây..."
              className={`w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border leading-relaxed ${
                errors.contentRaw ? 'border-rose-400 bg-rose-50/30' : 'border-slate-300 bg-slate-50/50'
              } focus:bg-white focus:outline-hidden focus:border-emerald-600`}
            />
            {errors.contentRaw && <p className="text-xs text-rose-500 mt-1">{errors.contentRaw}</p>}
          </div>

          {/* 6. Tags & Featured Setting */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Gắn thẻ từ khóa (Tags)
              </label>
              <div className="relative">
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={tagsRaw}
                  onChange={(e) => setTagsRaw(e.target.value)}
                  placeholder="Cách nhau bằng dấu phẩy: Lãi suất, Vay tín chấp"
                  className="w-full pl-8.5 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden focus:border-emerald-600 font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 sm:pt-4">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded-sm border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-800">
                  Ghim làm bài viết nổi bật (Hero Featured)
                </span>
              </label>
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs sm:text-sm font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Hủy bỏ
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-emerald-600/25 flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{editingArticle ? 'Cập Nhật Bài Viết' : 'Đăng Bài Viết Ngay'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
