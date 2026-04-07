import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { fetchNewsBySlug, type NewsItem } from '../services/googleSheets';

const NewsArticlePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<NewsItem | null>(null);

  useEffect(() => {
    if (slug) fetchNewsBySlug(slug).then(setArticle);
  }, [slug]);

  if (!article) return <div className="min-h-screen bg-[#0B3D2E] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0B3D2E]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B3D2E]/90 backdrop-blur-md py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/news" className="flex items-center gap-2 text-white hover:text-[#CFFF2E]">
            <ArrowLeft className="w-5 h-5" /> Back to News
          </Link>
        </div>
      </nav>

      <div className="pt-16">
        {article.imageUrl ? (
          <div className="aspect-[21/9] max-h-[400px] overflow-hidden">
            <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-[21/9] max-h-[400px] bg-gradient-to-br from-[#CFFF2E]/20 to-[#CFFF2E]/5 flex items-center justify-center">
            <span className="text-6xl font-bold text-[#CFFF2E]/30">NEWS</span>
          </div>
        )}
      </div>

      <article className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 text-white/40 text-sm mb-4">
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {article.date}</span>
            <span className="flex items-center gap-1"><User className="w-4 h-4" /> {article.author}</span>
          </div>
          <h1 className="text-4xl text-white font-black mb-6">{article.title}</h1>
          <div className="text-white/80 leading-relaxed whitespace-pre-line">{article.content}</div>
        </div>
      </article>
    </div>
  );
};

export default NewsArticlePage;
