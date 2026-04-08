import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Facebook, Twitter, Link as LinkIcon, Tag } from 'lucide-react';
import { fetchNewsBySlug, fetchNews, type NewsArticle } from '../services/googleSheets';

const NewsArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const loadArticle = async () => {
      if (!slug) return;

      setIsLoading(true);
      try {
        const articleData = await fetchNewsBySlug(slug);
        setArticle(articleData);

        if (articleData) {
          // Fetch related articles (same category, excluding current)
          const allArticles = await fetchNews();
          const related = allArticles
            .filter((a) => a.category === articleData.category && a.slug !== slug)
            .slice(0, 3);
          setRelatedArticles(related);
        }
      } catch (err) {
        console.error('Failed to fetch article:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticle();
  }, [slug]);

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

  const handleShare = (platform: 'facebook' | 'twitter' | 'copy') => {
    const url = window.location.href;
    const text = article?.title || 'Check out this article';

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B3D2E] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#CFFF2E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-[#0B3D2E]">
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B3D2E]/90 backdrop-blur-md py-4 px-4 sm:px-6 border-b border-white/10">
          <div className="max-w-4xl mx-auto">
            <Link to="/" className="flex items-center gap-2 text-white hover:text-[#CFFF2E] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Home</span>
            </Link>
          </div>
        </nav>
        <div className="pt-24 px-4 text-center">
          <h1 className="text-2xl text-white font-bold mb-2">Article Not Found</h1>
          <p className="text-white/60 mb-4">The article you're looking for doesn't exist.</p>
          <Link to="/news" className="text-[#CFFF2E] hover:underline">
            View all news
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B3D2E]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B3D2E]/90 backdrop-blur-md py-4 px-4 sm:px-6 border-b border-white/10">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-[#CFFF2E] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Home</span>
          </Link>
          <Link to="/news" className="text-white/60 hover:text-white text-sm">
            All News
          </Link>
        </div>
      </nav>

      {/* Article Header */}
      <header className="pt-24 pb-8 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Category & Date */}
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
            <span className="flex items-center gap-1 text-white/50 text-sm">
              <Calendar className="w-4 h-4" />
              {formatDate(article.date)}
            </span>
          </div>

          {/* Title */}
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl text-white font-black mb-4"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            {article.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-2 text-white/60 mb-6">
            <User className="w-4 h-4" />
            <span>By {article.author}</span>
          </div>

          {/* Share Buttons */}
          <div className="flex items-center gap-2">
            <span className="text-white/40 text-sm mr-2">Share:</span>
            <button
              onClick={() => handleShare('facebook')}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-blue-600 flex items-center justify-center transition-colors"
            >
              <Facebook className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-sky-500 flex items-center justify-center transition-colors"
            >
              <Twitter className="w-5 h-5 text-white" />
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-[#CFFF2E] flex items-center justify-center transition-colors"
            >
              {copied ? (
                <span className="text-[#0B3D2E] text-xs font-bold">Copied!</span>
              ) : (
                <LinkIcon className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {article.featuredImage && (
        <div className="px-4 sm:px-6 mb-8">
          <div className="max-w-4xl mx-auto">
            <div className="w-full h-64 sm:h-96 rounded-2xl overflow-hidden">
              <img src={article.featuredImage} alt={article.title} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="px-4 sm:px-6 pb-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-white/80 text-base sm:text-lg leading-relaxed whitespace-pre-line">
            {article.content || article.excerpt}
          </div>

          {/* Tags */}
          {article.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-white/10">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-[#CFFF2E]" />
                <span className="text-white/60 text-sm">Tags:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-white/10 rounded-full text-white/70 text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="px-4 sm:px-6 pb-16 border-t border-white/10">
          <div className="max-w-4xl mx-auto pt-8">
            <h2 className="text-2xl text-white font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.articleId}
                  to={`/news/${related.slug}`}
                  className="group bg-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors"
                >
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold mb-2 ${getCategoryColor(related.category)}`}>
                    {related.category}
                  </span>
                  <h3 className="text-white font-semibold group-hover:text-[#CFFF2E] transition-colors line-clamp-2">
                    {related.title}
                  </h3>
                  <p className="text-white/50 text-sm mt-1">{formatDate(related.date)}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#0B3D2E] border-t border-white/10 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
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

export default NewsArticlePage;
