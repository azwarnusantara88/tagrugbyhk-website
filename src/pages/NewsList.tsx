import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Calendar, Newspaper, Search } from 'lucide-react';
import { fetchNews, type NewsItem } from '../services/googleSheets';

const NewsListPage = () => {
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNews().then(setArticles);
  }, []);

  const filtered = articles.filter(a => 
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B3D2E]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B3D2E]/90 backdrop-blur-md py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-white hover:text-[#CFFF2E]">
            <ArrowLeft className="w-5 h-5" /> Back to Home
          </Link>
        </div>
      </nav>

      <header className="pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Newspaper className="w-8 h-8 text-[#CFFF2E] mb-4" />
          <h1 className="text-4xl text-white font-black mb-4">NEWS & UPDATES</h1>
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40"
            />
          </div>
        </div>
      </header>

      <section className="px-4 pb-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(article => (
            <Link key={article.slug} to={`/news/${article.slug}`} className="bg-white/5 rounded-2xl overflow-hidden hover:bg-white/10">
              <div className="aspect-video bg-white/5 flex items-center justify-center">
                {article.imageUrl ? <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" /> : <Newspaper className="w-12 h-12 text-white/20" />}
              </div>
              <div className="p-5">
                <p className="text-white/40 text-sm flex items-center gap-1 mb-2"><Calendar className="w-4 h-4" /> {article.date}</p>
                <h3 className="text-white font-bold mb-2">{article.title}</h3>
                <p className="text-white/50 text-sm line-clamp-2">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NewsListPage;
