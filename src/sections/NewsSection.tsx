import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, ArrowRight, User, RefreshCw } from 'lucide-react';
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
    const isMobile = window.innerWidth < 768;
    if (isMobile) return;
    
    const ctx = gsap.context(() => {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=70%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // ENTRANCE (0-30%)
      scrollTl.fromTo(
        headingRef.current,
        { y: '-25vh', opacity: 0 },
        { y: 0, opacity: 1, ease: 'none' },
        0
      );

      const cards = cardsRef.current?.querySelectorAll('.news-card');
      cards?.forEach((card, index) => {
        scrollTl.fromTo(
          card,
          { y: '20vh', opacity: 0 },
          { y: 0, opacity: 1, ease: 'none' },
          0.05 + index * 0.03
        );
      });

      // EXIT (70-100%)
      scrollTl.fromTo(
        headingRef.current,
        { y: 0, opacity: 1 },
        { y: '-15vh', opacity: 0, ease: 'power2.in' },
        0.7
      );

      cards?.forEach((card, index) => {
        scrollTl.fromTo(
          card,
          { y: 0, opacity: 1 },
          { y: '15vh', opacity: 0, ease: 'power2.in' },
          0.72 + index * 0.02
        );
      });

      scrollTl.fromTo(
        '.news-bg',
        { scale: 1 },
        { scale: 1.06, ease: 'none' },
        0.7
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [articles]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getCategoryColor = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('tournament')) return 'bg-[#CFFF2E] text-[#0B3D2E]';
    if (c.includes('team')) return 'bg-blue-500 text-white';
    if (c.includes('match')) return 'bg-purple-500 text-white';
    if (c.includes('player')) return 'bg-orange-500 text-white';
    return 'bg-white/20 text-white';
  };

  return (
    <section
      ref={sectionRef}
      id="news"
      className="relative w-full min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 py-8 md:py-0"
    >
      {/* Background Image */}
      <div
        className="news-bg absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/pitch_midfield.jpg)' }}
      >
        <div className="absolute inset-0 bg-[#0B3D2E]/75 md:bg-[#0B3D2E]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        <div ref={headingRef} className="w-full">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-[#CFFF2E]" />
                <span className="text-[#CFFF2E] font-semibold text-xs sm:text-sm uppercase tracking-wider">
                  News & Updates
                </span>
              </div>
              <h2
                className="text-2xl sm:text-3xl md:text-4xl text-white font-black"
                style={{ fontFamily: 'League Spartan, sans-serif' }}
              >
                LATEST <span className="text-[#CFFF2E]">NEWS</span>
              </h2>
            </div>
            
            <Link
              to="/news"
              className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-[#CFFF2E] hover:bg-[#d4ff4d] rounded-full text-[#0B3D2E] font-semibold transition-all text-sm"
            >
              View All News
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* News Cards */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
            {isLoading ? (
              <div className="col-span-3 text-center py-8">
                <RefreshCw className="w-8 h-8 text-white/40 animate-spin mx-auto mb-4" />
                <p className="text-white/60">Loading news...</p>
              </div>
            ) : articles.length > 0 ? (
              articles.map((article) => (
                <Link
                  key={article.articleId}
                  to={`/news/${article.slug}`}
                  className="news-card block bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/10 hover:bg-white/15 transition-all group"
                >
                  {/* Featured Image */}
                  <div className="w-full h-32 sm:h-40 rounded-lg overflow-hidden mb-3 sm:mb-4 bg-[#0B3D2E]/50">
                    {article.featuredImage ? (
                      <img
                        src={article.featuredImage}
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Newspaper className="w-10 h-10 sm:w-12 sm:h-12 text-white/20" />
                      </div>
                    )}
                  </div>

                  {/* Category & Date */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold ${getCategoryColor(article.category)}`}>
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1 text-white/40 text-[10px] sm:text-xs">
                      <Calendar className="w-3 h-3" />
                      {formatDate(article.date)}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-bold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-[#CFFF2E] transition-colors">
                    {article.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-white/50 text-xs sm:text-sm line-clamp-2 mb-3">
                    {article.excerpt}
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-2 text-white/40 text-[10px] sm:text-xs">
                    <User className="w-3 h-3" />
                    {article.author}
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-3 text-center py-8 bg-white/5 rounded-xl">
                <Newspaper className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60">No news articles yet. Check back soon!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
