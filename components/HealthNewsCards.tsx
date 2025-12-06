
import React, { useEffect, useState } from 'react';
import { fetchHealthNews } from '../services/geminiService';
import { NewsItem } from '../types';
import { ExternalLink, Clock, Globe, Newspaper, ChevronRight, Loader2 } from 'lucide-react';

const HealthNewsCards: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const items = await fetchHealthNews();
        setNews(items);
      } catch (e) {
        console.error("Failed to load news", e);
      } finally {
        setLoading(false);
      }
    };

    loadNews();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-12 flex justify-center">
        <Loader2 className="animate-spin text-teal-600 dark:text-teal-400" size={32} />
      </div>
    );
  }

  if (news.length === 0) return null;

  return (
    <div className="mt-8 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex items-center gap-3 mb-6 px-1">
        <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
           <Globe className="text-red-600 dark:text-red-400" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">Global Health Headlines</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">Real-time updates from trusted medical sources</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item, index) => (
          <div 
            key={index} 
            className="group flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden hover:shadow-xl hover:shadow-teal-900/5 dark:hover:shadow-black/40 hover:border-teal-500/30 transition-all duration-300"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 px-2 py-1 rounded border border-teal-100 dark:border-teal-800">
                  {item.source}
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock size={10} /> {item.timeAgo}
                </span>
              </div>
              
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                {item.title}
              </h4>
              
              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-3 mb-4 flex-1">
                {item.summary}
              </p>
              
              <a 
                href={item.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-auto"
              >
                Read Full Article <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="h-1 w-full bg-gradient-to-r from-teal-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HealthNewsCards;
