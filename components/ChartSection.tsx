
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { HealthDataPoint } from '../types';

interface ChartSectionProps {
  data: HealthDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-lg shadow-xl">
        <p className="text-slate-600 dark:text-slate-300 mb-2">{label}</p>
        <p className="text-teal-600 dark:text-teal-400 font-bold text-sm">
          Heart Rate: {payload[0].value} bpm
        </p>
        <p className="text-blue-600 dark:text-blue-400 font-bold text-sm">
          Avg Resting: {payload[1].value} bpm
        </p>
      </div>
    );
  }
  return null;
};

const ChartSection: React.FC<ChartSectionProps> = ({ data }) => {
  return (
    <div className="w-full h-[400px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm dark:shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Heart Rate Trends</h2>
        <select className="bg-slate-50 dark:bg-slate-700 text-sm text-slate-700 dark:text-white border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-1 focus:outline-none">
          <option>Last 7 Days</option>
          <option>Last Month</option>
        </select>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" vertical={false} opacity={0.3} />
          <XAxis 
            dataKey="day" 
            stroke="#94a3b8" 
            tick={{fill: '#94a3b8'}}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#94a3b8"
            tick={{fill: '#94a3b8'}} 
            tickLine={false}
            axisLine={false}
            unit=" bpm"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#14b8a6" 
            fillOpacity={1} 
            fill="url(#colorValue)" 
            strokeWidth={3}
            name="Current Heart Rate"
            animationDuration={1500}
          />
          <Area 
            type="monotone" 
            dataKey="average" 
            stroke="#3b82f6" 
            fillOpacity={1} 
            fill="url(#colorAvg)" 
            strokeWidth={2}
            strokeDasharray="5 5"
            name="Resting Average"
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartSection;
