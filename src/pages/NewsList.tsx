import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Newspaper, Search, Filter, Tag } from 'lucide-react';
import { fetchNews, type NewsArticle } from '../services/googleSheets';

const NewsListPage = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const newsData = await fetchNews();
        setArticles(newsData);
        setFilteredArticles(newsData);
      } catch (err) {
        console.error('Failed to fetch articles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
  }, []);

  useEffect(() => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query) ||
          a.author.toLowerCase().includes(query) ||
          a.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    setFilteredArticles(filtered);
  }, [articles, searchQuery, selectedCategory]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getCategoryColor = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('match')) return 'bg-[#CFFF2E] text-[#0B3D2E]';
    if (c.includes('announcement')) return 'bg-blue-500 text-white';
    if (c.includes('feature')) return 'bg-purple-500 text-white';
    if (c.includes('tournament')) return 'bg-orange-500 text-white';
    return 'bg-white/20 text-white';
  };

  // Get unique categories
  const categories = ['All', ...Array.from(new Set(articles.map((a) => a.category).filter(Boolean)))];

  return (
    <div className="min-h-screen bg-[#0B3D2E]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B3D2E]/90 backdrop-blur-md py-4 px-4 sm:px-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-[#CFFF2E] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <span className="text-white font-bold" style={{ fontFamily: 'League Spartan, sans-serif' }}>
            HKTR NEWS
          </span>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-24 pb-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="w-8 h-8 text-[#CFFF2E]" />
            <span className="text-[#CFFF2E] font-semibold text-sm uppercase tracking-wider">
              News & Updates
            </span>
          </div>
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl text-white font-black mb-4"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            TAG ASIA CUP
            <span className="text-[#CFFF2E]"> NEWS</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Stay updated with the latest match reports, team announcements, and tournament updates.
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/10 rounded-full text-white placeholder:text-white/40 focus:outline-none focus:border-[#CFFF2E] transition-colors"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
              <Filter className="w-5 h-5 text-white/40 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category
                      ? 'bg-[#CFFF2E] text-[#0B3D2E]'
                      : 'bg-white/10 text-white/70 hover:bg-white/20'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="px-4 sm:px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="w-12 h-12 border-4 border-[#CFFF2E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-white/60">Loading news articles...</p>
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Link
                  key={article.articleId}
                  to={`/news/${article.slug}`}
                  className="group bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:bg-white/10 hover:border-[#CFFF2E]/30 transition-all"
                >
                  {/* Featured Image */}
                  <div className="w-full h-48 overflow-hidden bg-[#0B3D2E]/50">
                    {article.featuredImage ? (
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-white/20" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    {/* Category & Date */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                      <span className="flex items-center gap-1 text-white/40 text-xs">
                        <Calendar className="w-3 h-3" />
                        {formatDate(article.date)}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#CFFF2E] transition-colors">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-white/50 text-sm line-clamp-3 mb-4">{article.excerpt}</p>

                    {/* Author & Tags */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white/40 text-xs">
                        <User className="w-3 h-3" />
                        {article.author}
                      </div>
                      {article.tags.length > 0 && (
                        <div className="flex items-center gap-1 text-white/40 text-xs">
                          <Tag className="w-3 h-3" />
                          {article.tags.length}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white/5 rounded-2xl">
              <Newspaper className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-white font-bold text-xl mb-2">No articles found</h3>
              <p className="text-white/50">
                {searchQuery || selectedCategory !== 'All'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'Check back soon for the latest updates!'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0B3D2E] border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-[#CFFF2E] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <p className="text-white/40 text-sm">© 2026 Hong Kong Tag Rugby. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default NewsListPage;
