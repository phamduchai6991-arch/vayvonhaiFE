import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Search, 
  Clock, 
  User, 
  ArrowRight, 
  Tag, 
  Sparkles, 
  BookOpen, 
  Share2, 
  TrendingUp,
  PlusCircle,
  Settings,
  RefreshCw,
  Globe,
  Radio,
  ExternalLink
} from 'lucide-react';
import { Article, ArticleCategory } from '../types';
import { ARTICLES_DATA } from '../data/constants';

interface TipsAndNewsProps {
  onSelectArticle: (article: Article) => void;
  onScrollToForm: () => void;
  articles?: Article[];
  onOpenAdminArticles?: () => void;
  onRefreshNews?: () => Promise<void>;
  isRefreshingNews?: boolean;
  lastNewsSync?: string;
}

export const TipsAndNews: React.FC<TipsAndNewsProps> = ({ 
  onSelectArticle, 
  onScrollToForm,
  articles = ARTICLES_DATA,
  onOpenAdminArticles,
  onRefreshNews,
  isRefreshingNews = false,
  lastNewsSync
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchKeyword, setSearchKeyword] = useState<string>('');

  const categories = [
    { id: 'all', label: 'Tất cả bài viết' },
    { id: 'news', label: 'Tin tức lãi suất' },
    { id: 'tips', label: 'Mẹo vay vốn' },
    { id: 'guide', label: 'Cẩm nang vay' },
    { id: 'policy', label: 'Thủ tục pháp lý' },
  ];

  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      const matchCat = selectedCategory === 'all' || art.category === selectedCategory;
      const matchSearch =
        searchKeyword.trim() === '' ||
        art.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        art.summary.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (art.sourceName && art.sourceName.toLowerCase().includes(searchKeyword.toLowerCase())) ||
        art.tags.some((t) => t.toLowerCase().includes(searchKeyword.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [articles, selectedCategory, searchKeyword]);

  const featuredArticle = useMemo(() => {
    return articles.find((a) => a.featured) || articles[0];
  }, [articles]);

  return (
    <section id="tips-news" className="py-16 sm:py-20 bg-white border-b border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <div className="inline-flex items-center gap-1.5 bg-emerald-100/90 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-emerald-200">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                Cẩm Nang &amp; Kiến Thức Vay Tín Chấp
              </div>

              <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-bold px-2.5 py-1 rounded-full border border-blue-200">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
                <span>Tự động cập nhật từ VnExpress, CafeF, VietNamNet</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              Mẹo Vặt &amp; <span className="text-emerald-600">Tin Tức Vay Vốn Hàng Ngày</span>
            </h2>
            <p className="mt-2 text-sm text-slate-600 max-w-xl">
              Cập nhật thông tin thị trường lãi suất mới nhất và các kinh nghiệm quý báu giúp bạn vay vốn an toàn, hiệu quả.
            </p>
          </div>

          {/* Search Bar & Auto-Sync Live Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
            {onRefreshNews && (
              <button
                onClick={onRefreshNews}
                disabled={isRefreshingNews}
                className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                title="Quét và tải bài báo tài chính mới nhất từ VnExpress, CafeF"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-blue-600 ${isRefreshingNews ? 'animate-spin' : ''}`} />
                <span>{isRefreshingNews ? 'Đang cào tin mới...' : 'Cập nhật tin báo mới'}</span>
              </button>
            )}

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tin tức, lãi suất..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-emerald-500"
              />
            </div>

            {onOpenAdminArticles && (
              <button
                onClick={onOpenAdminArticles}
                className="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                title="Quản trị viên: Thêm hoặc chỉnh sửa bài viết tin tức"
              >
                <PlusCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Quản lý bài viết</span>
              </button>
            )}
          </div>
        </div>

        {/* Live News Banner Status */}
        {lastNewsSync && (
          <div className="mb-6 px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-emerald-600" />
              <span>Nguồn tổng hợp: <strong>VnExpress Kinh Doanh</strong>, <strong>CafeF Tài Chính</strong>, <strong>VietNamNet</strong>, <strong>Tuổi Trẻ</strong></span>
            </div>
            <span>Lần cập nhật gần nhất: {new Date(lastNewsSync).toLocaleTimeString('vi-VN')} {new Date(lastNewsSync).toLocaleDateString('vi-VN')}</span>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Featured Big Card */}
        {!searchKeyword && selectedCategory === 'all' && featuredArticle && (
          <div 
            onClick={() => onSelectArticle(featuredArticle)}
            className="mb-10 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 rounded-3xl overflow-hidden shadow-xl text-white cursor-pointer group grid grid-cols-1 lg:grid-cols-12"
          >
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-400 text-emerald-950 text-[11px] font-black uppercase px-2.5 py-0.5 rounded-full">
                    ★ Bài viết nổi bật
                  </span>
                  {featuredArticle.sourceName && (
                    <span className="bg-blue-500/30 text-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-400/30 flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5" />
                      {featuredArticle.sourceName}
                    </span>
                  )}
                  <span className="text-xs text-emerald-200">{featuredArticle.readTime}</span>
                </div>
                
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white group-hover:text-amber-300 transition-colors leading-snug">
                  {featuredArticle.title}
                </h3>

                <p className="text-xs sm:text-sm text-emerald-100/90 line-clamp-3 leading-relaxed">
                  {featuredArticle.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-emerald-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-emerald-200">
                  <User className="w-3.5 h-3.5" />
                  <span>{featuredArticle.author}</span>
                  <span>•</span>
                  <span>{featuredArticle.publishedDate}</span>
                </div>

                <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 group-hover:translate-x-1 transition-transform">
                  <span>Đọc toàn bộ</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full overflow-hidden">
              <img
                src={featuredArticle.coverImage}
                alt={featuredArticle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-emerald-950/60 to-transparent" />
            </div>
          </div>
        )}

        {/* Articles Grid */}
        {filteredArticles.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-slate-500 text-sm">Không tìm thấy bài viết nào phù hợp với từ khóa "{searchKeyword}".</p>
            <button
              onClick={() => {
                setSearchKeyword('');
                setSelectedCategory('all');
              }}
              className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
            >
              Xem tất cả bài viết
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => onSelectArticle(art)}
                className="bg-slate-50 hover:bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-200 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Thumbnail Image */}
                  <div className="relative h-44 overflow-hidden bg-slate-100">
                    <img
                      src={art.coverImage}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-white/95 text-emerald-800 text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs border border-emerald-100">
                      {art.categoryName}
                    </span>

                    {art.sourceName && (
                      <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <Globe className="w-3 h-3 text-blue-300" />
                        {art.sourceName}
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{art.readTime}</span>
                      <span>•</span>
                      <span>{art.publishedDate}</span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {art.summary}
                    </p>
                  </div>
                </div>

                {/* Bottom Tags and Read Action */}
                <div className="p-5 pt-0 border-t border-slate-100/80 flex items-center justify-between text-xs mt-2">
                  <div className="flex flex-wrap gap-1">
                    {art.tags.slice(0, 2).map((tag, idx) => (
                      <span key={idx} className="bg-white px-2 py-0.5 rounded-md text-[10px] text-slate-500 border border-slate-200">
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <span className="font-bold text-emerald-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Đọc tiếp</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
