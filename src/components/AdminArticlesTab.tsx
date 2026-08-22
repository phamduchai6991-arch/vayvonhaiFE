import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Sparkles, 
  BookOpen, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  ExternalLink,
  RefreshCw,
  Eye,
  Globe,
  Radio,
  CheckCircle2
} from 'lucide-react';
import { Article, ArticleCategory } from '../types';
import { NEWS_SOURCES } from '../services/newsCrawler';

interface AdminArticlesTabProps {
  articles: Article[];
  onOpenCreateArticle: () => void;
  onEditArticle: (article: Article) => void;
  onDeleteArticle: (articleId: string) => void;
  onToggleFeatured: (articleId: string) => void;
  onResetSampleArticles: () => void;
  onPreviewArticle: (article: Article) => void;
  onCrawlLiveNews?: () => Promise<void>;
  isCrawlingNews?: boolean;
  lastNewsSync?: string;
}

export const AdminArticlesTab: React.FC<AdminArticlesTabProps> = ({
  articles,
  onOpenCreateArticle,
  onEditArticle,
  onDeleteArticle,
  onToggleFeatured,
  onResetSampleArticles,
  onPreviewArticle,
  onCrawlLiveNews,
  isCrawlingNews = false,
  lastNewsSync
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all'); // all, auto, manual

  const filteredArticles = articles.filter((art) => {
    const matchCategory = categoryFilter === 'all' || art.category === categoryFilter;
    const matchSource = 
      sourceFilter === 'all' || 
      (sourceFilter === 'auto' && art.isAutomated) || 
      (sourceFilter === 'manual' && !art.isAutomated);
    
    const matchSearch =
      searchTerm.trim() === '' ||
      art.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      art.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (art.sourceName && art.sourceName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      art.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchCategory && matchSource && matchSearch;
  });

  const autoCount = articles.filter((a) => a.isAutomated).length;
  const manualCount = articles.filter((a) => !a.isAutomated).length;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
      
      {/* Top News Sources Notification Bar */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 sm:px-6 py-3 border-b border-blue-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/30 text-blue-200 border border-blue-400/30">
            <Radio className="w-4 h-4 text-amber-300 animate-pulse" />
          </div>
          <div>
            <div className="text-xs font-bold flex items-center gap-2">
              <span>Hệ Thống Tự Động Quét Tin Báo Chí</span>
              <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.2 rounded-full uppercase">
                Active
              </span>
            </div>
            <p className="text-[11px] text-blue-200">
              Nguồn cấp: VnExpress Kinh Doanh, CafeF Tài Chính, VietNamNet, Tuổi Trẻ (Lãi suất, Vay tín chấp, FE Credit)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch md:self-auto justify-end">
          {onCrawlLiveNews && (
            <button
              onClick={onCrawlLiveNews}
              disabled={isCrawlingNews}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
              title="Quét các đầu báo và nạp ngay các bài viết tài chính mới nhất hôm nay"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCrawlingNews ? 'animate-spin' : ''}`} />
              <span>{isCrawlingNews ? 'Đang cào tin từ báo...' : '⚡ Cào Tin Mới Ngay'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="p-4 sm:p-6 bg-white border-b border-slate-200 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
        
        {/* Search & Filter */}
        <div className="flex flex-1 flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề, nguồn báo, từ khóa..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-hidden focus:border-emerald-500 bg-slate-50 focus:bg-white"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white font-medium focus:outline-hidden focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Tất cả chuyên mục</option>
            <option value="news">Tin tức lãi suất</option>
            <option value="tips">Mẹo vay vốn</option>
            <option value="guide">Cẩm nang vay</option>
            <option value="policy">Thủ tục pháp lý</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 bg-white font-medium focus:outline-hidden focus:border-emerald-500 cursor-pointer"
          >
            <option value="all">Nguồn: Tất cả ({articles.length})</option>
            <option value="auto">📰 Tin cào từ Báo chí ({autoCount})</option>
            <option value="manual">✍️ Do Đức Hải FE viết ({manualCount})</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 self-end lg:self-auto">
          <button
            onClick={onResetSampleArticles}
            title="Khôi phục danh sách bài viết mẫu ban đầu"
            className="px-3 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Khôi phục bài gốc</span>
          </button>

          <button
            onClick={onOpenCreateArticle}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Viết Bài Mới</span>
          </button>
        </div>
      </div>

      {/* Articles Count & Summary */}
      <div className="px-6 py-2.5 bg-emerald-50/60 border-b border-emerald-100 text-xs text-emerald-900 font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
          <span>Tổng số bài viết: <strong>{articles.length} bài</strong> ({autoCount} bài từ báo chí, {manualCount} bài viết chuyên gia)</span>
        </div>
        {lastNewsSync && (
          <span className="text-[11px] text-slate-500 hidden sm:inline">
            Cập nhật lần cuối: {new Date(lastNewsSync).toLocaleTimeString('vi-VN')} {new Date(lastNewsSync).toLocaleDateString('vi-VN')}
          </span>
        )}
      </div>

      {/* Articles List Table / Cards */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-700">Chưa có bài viết nào phù hợp</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              Không tìm thấy bài viết theo tiêu chí lọc. Bạn có thể nhấn nút cào tin mới từ các báo hoặc viết bài mới.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              {onCrawlLiveNews && (
                <button
                  onClick={onCrawlLiveNews}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Cào Tin Báo Chí Ngay</span>
                </button>
              )}
              <button
                onClick={onOpenCreateArticle}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer"
              >
                + Viết Bài Viết Mới
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredArticles.map((article) => (
              <div
                key={article.id}
                className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-emerald-300 hover:shadow-md transition-all group"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative group">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {article.featured && (
                      <span className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-sm shadow-xs">
                        Nổi bật
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {article.categoryName}
                      </span>

                      {article.sourceName ? (
                        <span className="text-[11px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200 flex items-center gap-1">
                          <Globe className="w-3 h-3 text-blue-600" />
                          Báo: {article.sourceName}
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                          Admin tự viết
                        </span>
                      )}

                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {article.publishedDate}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {article.readTime}
                      </span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {article.title}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {article.summary}
                    </p>

                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {article.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-sm font-medium"
                        >
                          #{tag}
                        </span>
                      ))}

                      {article.sourceUrl && (
                        <a
                          href={article.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-0.5 ml-2 font-medium"
                        >
                          <span>Link báo gốc</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                  {/* View on website */}
                  <button
                    onClick={() => onPreviewArticle(article)}
                    className="p-2 rounded-xl text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors cursor-pointer"
                    title="Xem trước bài viết đầy đủ"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Toggle Featured */}
                  <button
                    onClick={() => onToggleFeatured(article.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 ${
                      article.featured
                        ? 'bg-amber-50 border-amber-300 text-amber-800'
                        : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                    }`}
                    title={article.featured ? 'Bỏ ghim nổi bật' : 'Ghim làm bài viết nổi bật'}
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${article.featured ? 'text-amber-500 fill-amber-400' : ''}`} />
                    <span className="hidden lg:inline">{article.featured ? 'Nổi bật' : 'Ghim'}</span>
                  </button>

                  {/* Edit Article */}
                  <button
                    onClick={() => onEditArticle(article)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                    title="Chỉnh sửa nội dung bài viết"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Sửa</span>
                  </button>

                  {/* Delete Article */}
                  <button
                    onClick={() => {
                      if (window.confirm(`Bạn có chắc chắn muốn xóa bài viết "${article.title}"?`)) {
                        onDeleteArticle(article.id);
                      }
                    }}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Xóa bài viết"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
