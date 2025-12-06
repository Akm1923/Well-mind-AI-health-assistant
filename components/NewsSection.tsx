
import React, { useEffect, useState } from 'react';
import { fetchHealthNews } from '../services/geminiService';
import { NewsItem } from '../types';
import { Newspaper, ExternalLink, Clock, Globe } from 'lucide-react';

const NewsSection: React.FC = () => {
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

  if (loading) return null;
  if (news.length === 0) return null;

  return (
    <div className="w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl fixed bottom-0 left-0 right-0 z-40 h-16 flex items-center overflow-hidden group">
      <div className="flex items-center px-4 h-full bg-teal-600 dark:bg-teal-900 text-white z-10 shadow-md flex-shrink-0">
         <Globe size={18} className="animate-pulse mr-2"/>
         <span className="font-bold text-sm uppercase tracking-wider hidden sm:block">Global Health Wire</span>
      </div>
      
      <div className="flex overflow-hidden flex-1 relative h-full items-center">
        <div className="flex animate-scroll whitespace-nowrap hover:pause">
           {[...news, ...news].map((item, index) => (
             <a 
               key={index} 
               href={item.url}
               target="_blank"
               rel="noopener noreferrer"
               className="inline-flex items-center gap-3 px-8 border-r border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 h-16 transition-colors"
             >
               <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase border border-teal-200 dark:border-teal-500/30 px-2 py-0.5 rounded">
                  {item.source}
               </span>
               <span className="text-sm font-medium text-slate-800 dark:text-slate-200">
                  {item.title}
               </span>
               <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={10} /> {item.timeAgo}
               </span>
             </a>
           ))}
        </div>
      </div>
    </div>
  );
};

export default NewsSection;
