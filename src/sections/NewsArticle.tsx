import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Facebook, Twitter, Link as LinkIcon } from 'lucide-react';
import { fetchNewsBySlug, fetchNews, type NewsItem } from '../services/googleSheets';

const NewsArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<NewsItem[]>([]);
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
          // Fetch related articles (excluding current)
          const allArticles = await fetchNews();
          const related = allArticles
            .filter(a => a.slug !== slug)
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
        year: 'numeric' 
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
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B3D2E]/90 backdrop-blur-md py-4 px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <Link to="/news" className="flex items-center gap-2 text-white hover:text-[#CFFF2E] transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to News</span>
            </Link>
          </div>
        </nav>
        <div className="pt-24 px-4 text-center">
          <h1 className="text-2xl text-white font-bold mb-2">Article Not Found</h1>
          <p className="text-white/60 mb-4">The article you're looking for doesn't exist.</p>
          <Link to="/news" className="text-[#CFFF2E] hover:underline">
            Back to news
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B3D2E]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B3D2E]/90 backdrop-blur-md py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/news" className="flex items-center gap-2 text-white hover:text-[#CFFF2E] transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to News</span>
          </Link>
          <span className="text-white/60 text-sm">Article</span>
        </div>
      </nav>

      {/* Hero Image */}
      <div className="pt-16">
        {article.imageUrl ? (
          <div className="aspect-[21/9] max-h-[400px] overflow-hidden">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-[21/9] max-h-[400px] bg-gradient-to-br from-[#CFFF2E]/20 to-[#CFFF2E]/5 flex items-center justify-center">
            <span className="text-6xl font-bold text-[#CFFF2E]/30">NEWS</span>
          </div>
        )}
      </div>

      {/* Article Content */}
      <article className="px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Meta */}
          <div className="flex items-center gap-4 text-white/40 text-sm mb-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {formatDate(article.date)}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {article.author}
            </span>
          </div>

          {/* Title */}
          <h1 
            className="text-3xl sm:text-4xl lg:text-5xl text-white font-black mb-6"
            style={{ fontFamily: 'League Spartan, sans-serif' }}
          >
            {article.title}
          </h1>

          {/* Share Buttons */}
          <div className="flex items-center gap-3 mb-8 pb-8 border-b border-white/10">
            <span className="text-white/40 text-sm">Share:</span>
            <button
              onClick={() => handleShare('facebook')}
              className="p-2 bg-white/5 rounded-lg hover:bg-[#1877F2] hover:text-white transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="p-2 bg-white/5 rounded-lg hover:bg-[#1DA1F2] hover:text-white transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleShare('copy')}
              className="p-2 bg-white/5 rounded-lg hover:bg-[#CFFF2E] hover:text-[#0B3D2E] transition-colors"
            >
              <LinkIcon className="w-5 h-5" />
            </button>
            {copied && <span className="text-[#CFFF2E] text-sm">Copied!</span>}
          </div>

          {/* Content */}
          <div 
            className="prose prose-invert prose-lg max-w-none text-white/80 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: article.content.replace(/\n/g, '<br/>') }}
          />
        </div>
      </article>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="px-4 sm:px-6 py-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl text-white font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {relatedArticles.map((related) => (
                <Link
                  key={related.slug}
                  to={`/news/${related.slug}`}
                  className="group block bg-white/5 rounded-xl overflow-hidden border border-white/10 hover:border-[#CFFF2E]/50 transition-all"
                >
                  <div className="aspect-video overflow-hidden">
                    {related.imageUrl ? (
                      <img
                        src={related.imageUrl}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#CFFF2E]/10 to-transparent" />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-white/40 text-xs mb-2">{formatDate(related.date)}</p>
                    <h3 className="text-white font-semibold text-sm line-clamp-2 group-hover:text-[#CFFF2E] transition-colors">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-[#0B3D2E] border-t border-white/10 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Link to="/news" className="inline-flex items-center gap-2 text-white/60 hover:text-[#CFFF2E] transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to News
          </Link>
          <p className="text-white/40 text-sm">
            © 2026 Hong Kong Tag Rugby. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NewsArticlePage;
