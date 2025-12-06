
import React, { useEffect, useState } from 'react';
import { generateHealthPlan } from '../services/geminiService';
import { WellnessPlan, DailyTask, WeeklyGoal } from '../types';
import { Activity, Calendar, Clock, CheckCircle2, Target, Flame, Brain, Apple, HeartPulse, ChevronRight } from 'lucide-react';

const WellnessPlanner: React.FC = () => {
  const [plan, setPlan] = useState<WellnessPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'daily' | 'weekly' | 'monthly'>('daily');

  useEffect(() => {
    const fetchPlans = async () => {
      // Simulated patient profile
      const context = "Male, 45 years old, sedentary job, recovering from minor injury, wants to improve heart health and sleep quality.";
      const data = await generateHealthPlan(context);
      setPlan(data);
      setLoading(false);
    };

    fetchPlans();
  }, []);

  const toggleDailyTask = (index: number) => {
    if (!plan) return;
    const newRoutine = [...plan.dailyRoutine];
    newRoutine[index].status = newRoutine[index].status === 'completed' ? 'pending' : 'completed';
    setPlan({ ...plan, dailyRoutine: newRoutine });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Diet': return <Apple size={18} />;
      case 'Exercise': return <Activity size={18} />;
      case 'Mental': return <Brain size={18} />;
      case 'Medical': return <HeartPulse size={18} />;
      default: return <Activity size={18} />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Diet': return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-500/10 border-green-200 dark:border-green-500/20';
      case 'Exercise': return 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/20';
      case 'Mental': return 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20';
      case 'Medical': return 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20';
      default: return 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-500/10';
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <div className="w-12 h-12 border-4 border-teal-600 dark:border-teal-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-600 dark:text-slate-400 animate-pulse">Generating personalized wellness plan...</p>
      </div>
    );
  }

  if (!plan) return null;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6">
        <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Wellness Plan</h2>
            <p className="text-slate-500 dark:text-slate-400">Personalized roadmap for your health journey</p>
        </div>
        
        <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 mt-4 md:mt-0 shadow-sm">
          {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab 
                  ? 'bg-teal-600 text-white shadow-md' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* DAILY VIEW */}
      {activeTab === 'daily' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 md:ml-6 space-y-8">
            {plan.dailyRoutine.map((task, idx) => (
              <div key={idx} className="relative pl-8 md:pl-12">
                <div className={`absolute -left-[9px] top-0 w-5 h-5 rounded-full border-4 border-slate-50 dark:border-slate-900 ${
                  task.status === 'completed' ? 'bg-teal-500' : 'bg-slate-300 dark:bg-slate-600'
                }`}></div>
                
                <div 
                    onClick={() => toggleDailyTask(idx)}
                    className={`group flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 rounded-xl cursor-pointer transition-all hover:border-teal-500/30 hover:shadow-lg hover:shadow-teal-900/10 ${
                        task.status === 'completed' ? 'opacity-60' : ''
                    }`}
                >
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-100 dark:bg-slate-900 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 min-w-[80px] text-center">
                            <span className="text-slate-600 dark:text-slate-300 font-mono text-sm">{task.time}</span>
                        </div>
                        <div>
                            <h4 className={`font-medium text-lg ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900 dark:text-white'}`}>
                                {task.activity}
                            </h4>
                            <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border mt-1 ${getCategoryColor(task.category)}`}>
                                {getCategoryIcon(task.category)}
                                {task.category}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 flex items-center justify-end">
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                            task.status === 'completed' 
                                ? 'border-teal-500 bg-teal-500 text-white' 
                                : 'border-slate-300 dark:border-slate-600 text-transparent group-hover:border-teal-500/50'
                        }`}>
                            <CheckCircle2 size={16} />
                        </div>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* WEEKLY VIEW */}
      {activeTab === 'weekly' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {plan.weeklyGoals.map((goal) => (
                <div key={goal.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl hover:border-blue-500/30 transition-colors shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
                            <Target size={24} />
                        </div>
                        <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded border border-slate-200 dark:border-slate-700">
                            Target: {goal.target}
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{goal.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{goal.description}</p>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400">
                            <span>Progress</span>
                            <span>{goal.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-900 h-2 rounded-full overflow-hidden">
                            <div 
                                className="bg-gradient-to-r from-blue-500 to-teal-400 h-full rounded-full transition-all duration-1000"
                                style={{ width: `${goal.progress}%` }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* MONTHLY VIEW */}
      {activeTab === 'monthly' && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            {/* Hero Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-slate-800 dark:from-indigo-900 dark:to-slate-900 border border-indigo-500/30 rounded-2xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 bg-indigo-500/20 blur-3xl rounded-full pointer-events-none"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <Calendar className="text-indigo-200 dark:text-indigo-400" size={24} />
                        <span className="text-indigo-100 dark:text-indigo-300 font-medium uppercase tracking-wider text-sm">{plan.monthlyInsight.month} Focus</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {plan.monthlyInsight.focusArea}
                    </h2>
                    <p className="text-indigo-100/90 dark:text-indigo-100/80 text-lg leading-relaxed max-w-2xl">
                        {plan.monthlyInsight.summary}
                    </p>
                </div>
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plan.monthlyInsight.tips.map((tip, idx) => (
                    <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 rounded-xl flex items-start gap-4 shadow-sm">
                        <div className="mt-1 min-w-[24px]">
                            <div className="w-6 h-6 rounded-full bg-teal-100 dark:bg-teal-500/10 flex items-center justify-center text-teal-600 dark:text-teal-400 text-xs font-bold">
                                {idx + 1}
                            </div>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                            {tip}
                        </p>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};

export default WellnessPlanner;
