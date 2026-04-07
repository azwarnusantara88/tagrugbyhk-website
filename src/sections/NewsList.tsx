import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Newspaper, Search } from 'lucide-react';
import { fetchNews, type NewsItem } from '../services/googleSheets';

const NewsListPage = () => {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query) ||
        a.author.toLowerCase().includes(query)
      );
    }
    setFilteredArticles(filtered);
  }, [articles, searchQuery]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B3D2E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#CFFF2E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading news...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B3D2E]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B3D2E]/90 backdrop-blur-md py-4 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-[#CFFF2E] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <span className="text-white/60 text-sm">News & Updates</span>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-24 pb-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Newspaper className="w-8 h-8 text-[#CFFF2E]" />
            <span className="text-[#CFFF2E] font-mono text-sm tracking-[0.2em] uppercase">
              Latest News
            </span>
          </div>
          <h1 
            className="text-4xl sm:text-5xl lg:text-6xl text-white font-black mb-4"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            NEWS & UPDATES
          </h1>
          <p className="text-white/60 text-lg max-w-2xl">
            Stay informed with the latest announcements, match reports, and stories from the Tag Asia Cup 2026.
          </p>
        </div>
      </header>

      {/* Search */}
      <section className="px-4 sm:px-6 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-[#CFFF2E] transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="px-4 sm:px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          {filteredArticles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredArticles.map((article) => (
                <Link
                  key={article.slug}
                  to={`/news/${article.slug}`}
                  className="group block bg-white/5 rounded-2xl overflow-hidden border border-white/10 hover:border-[#CFFF2E]/50 transition-all duration-300 hover:scale-[1.02]"
                >
                  {/* Image */}
                  <div className="aspect-video overflow-hidden">
                    {article.imageUrl ? (
                      <img
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#CFFF2E]/20 to-[#CFFF2E]/5 flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-[#CFFF2E]/50" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-center gap-4 text-white/40 text-sm mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(article.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {article.author}
                      </span>
                    </div>
                    
                    <h3 className="text-white font-bold text-lg mb-2 group-hover:text-[#CFFF2E] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    
                    <p className="text-white/50 text-sm line-clamp-2">
                      {article.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Newspaper className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60 text-lg">No articles found.</p>
              {searchQuery && (
                <p className="text-white/40 text-sm mt-2">
                  Try adjusting your search terms.
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0B3D2E] border-t border-white/10 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-[#CFFF2E] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <p className="text-white/40 text-sm">
            © 2026 Hong Kong Tag Rugby. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NewsListPage;
