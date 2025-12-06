
import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  unit: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, unit, icon }) => {
  const isPositive = change > 0;
  const isNeutral = change === 0;

  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-lg hover:shadow-md dark:hover:shadow-emerald-500/10 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 bg-slate-100 dark:bg-slate-700/50 rounded-lg text-teal-600 dark:text-emerald-400">
          {icon}
        </div>
        <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
          {isNeutral ? <Minus size={16} /> : isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
          <span className="ml-1">{Math.abs(change)}%</span>
        </div>
      </div>
      <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-1">{title}</h3>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">{value}</span>
        <span className="ml-1 text-slate-400 dark:text-slate-500 text-sm">{unit}</span>
      </div>
    </div>
  );
};

export default StatCard;
