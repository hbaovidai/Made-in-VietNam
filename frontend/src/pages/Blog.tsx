import React, { useState, useEffect } from 'react';
import { Search, ArrowRight, Calendar, X, BookOpen, Clock, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SEOHead } from '../components/SEOHead';
import { BreadcrumbBar } from '../components/BreadcrumbBar';
import { blogDb, BlogPost, BlogCategory, BlogSettings } from '../utils/blogDb';

export function Blog() {
  const { t, i18n } = useTranslation();
  const isVi = i18n.language?.startsWith('vi');

  // Load from DB
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [settings, setSettings] = useState<BlogSettings | null>(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    // Initial load
    setPosts(blogDb.getPosts());
    setCategories(blogDb.getCategories().filter(c => c.isVisible));
    setSettings(blogDb.getSettings());
  }, []);

  // Filter Logic
  const filteredPosts = posts
    .filter(post => {
      // Must be published to show on public site
      if (post.status !== 'PUBLISHED') return false;

      const titleMatch = (isVi ? post.title.vi : post.title.en)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const excerptMatch = (isVi ? post.excerpt.vi : post.excerpt.en)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesSearch = titleMatch || excerptMatch;

      const matchesCategory = activeCategory === 'all' || post.category === activeCategory;

      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => a.order - b.order);

  // Pagination Slice
  const postsPerPage = settings?.postsPerPage || 6;
  const displayedPosts = filteredPosts.slice(0, visibleCount);
  const hasMore = filteredPosts.length > visibleCount;

  // Reset pagination when filter changes or settings load
  useEffect(() => {
    if (settings) {
      setVisibleCount(settings.postsPerPage);
    }
  }, [searchQuery, activeCategory, settings]);

  // Lock body scroll when modal is active
  useEffect(() => {
    if (selectedPost) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedPost]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setActiveCategory('all');
  };

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  // Get active translation title / subtitle
  const displayTitle = isVi ? settings.titleVi : settings.titleEn;
  const displaySubtitle = isVi ? settings.subtitleVi : settings.subtitleEn;

  return (
    <div className="bg-slate-50 min-h-screen pb-16 font-sans">
      <SEOHead
        title={displayTitle + " - VIEProduct"}
        description={displaySubtitle}
        keywords="blog, insights, b2b marketplace, sourcing vietnam, vietnam exports"
        canonical="/blog"
      />

      <BreadcrumbBar items={[{ label: t('blog') }]} />

      {/* ─── Header: 2-column layout on plain background ─── */}
      <section className="px-6 sm:px-10 lg:px-16 py-8 border-b border-slate-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 items-start">
          {/* Left Column: Title + Description */}
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-3">
              VIE Share
            </h1>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              {displaySubtitle}
            </p>
          </div>

          {/* Right Column: Search + Category Tags */}
          <div className="flex flex-col gap-4">
            {/* Search bar */}
            {settings.showSearch && (
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder={isVi ? "Tìm kiếm bài viết..." : "Search articles..."}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-2.5 bg-white border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  style={{ borderRadius: 8 }}
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Category Tags */}
            {settings.showCategories && (
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-4 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer border ${
                    activeCategory === 'all'
                      ? 'bg-primary text-white border-primary shadow-sm' 
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'
                  }`}
                  style={{ borderRadius: 999 }}
                >
                  {isVi ? "Tất cả" : "All"}
                </button>
                {categories.map(cat => {
                  const active = activeCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => setActiveCategory(cat.key)}
                      className={`px-4 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer border ${
                        active 
                          ? 'bg-primary text-white border-primary shadow-sm' 
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400 hover:text-slate-900'
                      }`}
                      style={{ borderRadius: 999 }}
                    >
                      {isVi ? cat.vi : cat.en}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Blog Listing Section ─── */}
      <main className="px-6 sm:px-10 lg:px-16 mt-10">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl p-8 max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {isVi ? "Không tìm thấy bài viết" : "No articles found"}
            </h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-6">
              {isVi 
                ? "Vui lòng thử lại với từ khóa khác hoặc xóa bộ lọc để hiển thị toàn bộ bài viết."
                : "Try searching with other terms, or clear the current filters to see all articles."}
            </p>
            <button 
              onClick={handleClearFilters}
              className="px-4 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
            >
              {isVi ? "Xoá bộ lọc" : "Clear filters"}
            </button>
          </div>
        ) : (
          <div>
            {/* Card Grid Layout or List Layout */}
            <div className={settings.layout === 'list' 
              ? "flex flex-col gap-6" 
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
            }>
              {displayedPosts.map(post => {
                const categoryObj = categories.find(c => c.key === post.category);
                const displayCategory = categoryObj ? (isVi ? categoryObj.vi : categoryObj.en) : post.category;

                return (
                  <article 
                    key={post.id} 
                    onClick={() => setSelectedPost(post)}
                    className={`card-interactive flex overflow-hidden shadow-xs hover:shadow-md transition-all group ${
                      settings.layout === 'list' 
                        ? 'flex-col md:flex-row bg-white' 
                        : 'flex-col bg-white'
                    }`}
                  >
                    {/* Thumbnail Image */}
                    <div className={`relative overflow-hidden bg-slate-100 border-b md:border-b-0 border-slate-100 ${
                      settings.layout === 'list' 
                        ? 'aspect-video md:aspect-[4/3] md:w-80 shrink-0' 
                        : 'aspect-video w-full'
                    }`}>
                      <img 
                        src={post.image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'} 
                        alt={isVi ? post.title.vi : post.title.en} 
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300 ease-out"
                        loading="lazy"
                      />
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Category & Time */}
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/5 text-primary tracking-wide uppercase">
                            {displayCategory}
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3" />
                            {isVi ? post.readTime.vi : post.readTime.en}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-slate-800 leading-snug mb-2 group-hover:text-primary transition-colors line-clamp-2">
                          {isVi ? post.title.vi : post.title.en}
                        </h3>

                        {/* Excerpt */}
                        <p className="text-slate-500 text-xs leading-relaxed mb-4 line-clamp-3">
                          {isVi ? post.excerpt.vi : post.excerpt.en}
                        </p>
                      </div>

                      {/* Card Footer */}
                      <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString(isVi ? 'vi-VN' : 'en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </span>
                        <span className="text-primary text-xs font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          {isVi ? "Xem chi tiết" : "Read more"}
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-12 md:mt-16">
                <button
                  onClick={() => setVisibleCount(prev => prev + postsPerPage)}
                  className="px-6 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 text-slate-700 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  {isVi ? "Xem thêm bài viết" : "Load more articles"}
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─── Detailed Article Modal ─── */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-modal-backdrop">
          {/* Backdrop Closer */}
          <div className="absolute inset-0" onClick={() => setSelectedPost(null)} />

          {/* Modal Panel */}
          <div className="relative w-full max-w-6xl max-h-[95vh] bg-white shadow-2xl overflow-y-auto flex flex-col animate-modal-content z-10" style={{ borderRadius: 0 }}>
            {/* Header Sticky Info */}
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-20">
              <div className="flex items-center gap-2">
                <Tag className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-bold text-primary tracking-wide uppercase">
                  {(() => {
                    const catObj = categories.find(c => c.key === selectedPost.category);
                    return catObj ? (isVi ? catObj.vi : catObj.en) : selectedPost.category;
                  })()}
                </span>
              </div>
              <button 
                onClick={() => setSelectedPost(null)}
                className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Contents */}
            <div className="p-6 md:p-8">
              {/* Title */}
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-800 leading-tight mb-4">
                {isVi ? selectedPost.title.vi : selectedPost.title.en}
              </h2>

              {/* Meta information */}
              <div className="flex items-center gap-4 text-xs text-slate-400 font-medium mb-6 pb-4 border-b border-slate-100">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(selectedPost.date).toLocaleDateString(isVi ? 'vi-VN' : 'en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {isVi ? selectedPost.readTime.vi : selectedPost.readTime.en}
                </span>
                <span>• {isVi ? "Tác giả:" : "By:"} {selectedPost.author}</span>
              </div>

              {/* Large Image */}
              <div className="aspect-video w-full overflow-hidden mb-6 bg-slate-50 border border-slate-100" style={{ borderRadius: 0 }}>
                <img 
                  src={selectedPost.image || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'} 
                  alt={isVi ? selectedPost.title.vi : selectedPost.title.en} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Paragraphs body */}
              <div className="prose prose-slate max-w-none text-slate-600 text-sm md:text-base leading-relaxed space-y-4">
                {(isVi ? selectedPost.content.vi : selectedPost.content.en).split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-slate-600 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Footer Closer */}
            <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setSelectedPost(null)}
                className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                {isVi ? "Đóng" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
