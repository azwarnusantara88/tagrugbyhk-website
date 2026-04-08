import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, ArrowRight, User } from 'lucide-react';
import { fetchNews, type NewsArticle } from '../services/googleSheets';

gsap.registerPlugin(ScrollTrigger);

const NewsSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setIsLoading(true);
      try {
        const newsData = await fetchNews();
        // Show first 3 featured articles
        setArticles(newsData.slice(0, 3));
      } catch (err) {
        console.error('Failed to load news:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadNews();

    // Auto-refresh every 60 seconds
    const interval = setInterval(loadNews, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
        }
      );

      const cards = cardsRef.current?.querySelectorAll('.news-card');
      if (cards) {
        gsap.fromTo(
          cards,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: cardsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isLoading, articles]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
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

  if (isLoading) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full min-h-screen flex items-center justify-center bg-[#0B3D2E] py-20"
      >
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#CFFF2E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading news...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="news"
      className="relative w-full min-h-screen bg-[#0B3D2E] py-20 px-4 sm:px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div ref={headingRef} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#CFFF2E]/20 rounded-full mb-4">
              <Newspaper className="w-5 h-5 text-[#CFFF2E]" />
              <span className="text-[#CFFF2E] text-sm font-semibold uppercase tracking-wider">
                Latest Updates
              </span>
            </div>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl text-white font-black"
              style={{ fontFamily: 'League Spartan, sans-serif' }}
            >
              TOURNAMENT <span className="text-[#CFFF2E]">NEWS</span>
            </h2>
          </div>

          <Link
            to="/news"
            className="flex items-center gap-2 px-6 py-3 bg-[#CFFF2E] hover:bg-[#d4ff4d] rounded-full text-[#0B3D2E] font-semibold transition-all"
          >
            View All News
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* News Cards */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.length > 0 ? (
            articles.map((article) => (
              <Link
                key={article.articleId}
                to={`/news/${article.slug}`}
                className="news-card group bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-[#CFFF2E]/30 transition-all"
              >
                {/* Featured Image */}
                <div className="w-full h-48 bg-[#0B3D2E]/50 overflow-hidden">
                  {article.featuredImage ? (
                    <img
                      src={article.featuredImage}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0B3D2E] to-[#0B3D2E]/50">
                      <Newspaper className="w-12 h-12 text-white/20" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Category & Date */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${getCategoryColor(article.category)}`}>
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
                  <p className="text-white/50 text-sm line-clamp-2 mb-4">{article.excerpt}</p>

                  {/* Author */}
                  <div className="flex items-center gap-2 text-white/40 text-xs">
                    <User className="w-3 h-3" />
                    {article.author}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-3 text-center py-16">
              <Newspaper className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No news articles yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
