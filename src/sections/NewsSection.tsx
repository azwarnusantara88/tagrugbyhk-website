import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { fetchNews, type NewsItem } from '../services/googleSheets';

const NewsSection = () => {
  const [articles, setArticles] = useState<NewsItem[]>([]);

  useEffect(() => {
    const loadNews = async () => {
      const data = await fetchNews();
      setArticles(data.slice(0, 3));
    };
    loadNews();
  }, []);

  return (
    <section id="news" className="bg-[#0B3D2E] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <Newspaper className="w-6 h-6 text-[#CFFF2E]" />
            <h2 className="text-2xl text-white font-bold">Latest News</h2>
          </div>
          <Link to="/news" className="text-[#CFFF2E] flex items-center gap-1 text-sm">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {articles.map(article => (
            <Link key={article.slug} to={`/news/${article.slug}`} className="bg-white/10 rounded-xl p-4 hover:bg-white/20">
              <p className="text-white/40 text-xs flex items-center gap-1 mb-2">
                <Calendar className="w-3 h-3" /> {article.date}
              </p>
              <h3 className="text-white font-semibold mb-2 line-clamp-2">{article.title}</h3>
              <p className="text-white/60 text-sm line-clamp-2">{article.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
