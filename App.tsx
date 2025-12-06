
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import StatCard from './components/StatCard';
import ChartSection from './components/ChartSection';
import ChatInterface from './components/ChatInterface';
import HealthPlanner from './components/RecommendationEngine';
import NutritionSection from './components/NutritionSection';
import DoctorDirectory from './components/DoctorDirectory';
import HealthNewsCards from './components/HealthNewsCards';
import DoctorProfileModal from './components/DoctorProfileModal';
import HelpChatWidget from './components/HelpChatWidget';
import NewsSection from './components/NewsSection';
import { View, HealthDataPoint, Doctor } from './types';
import { Activity, Moon, Heart, Footprints, MessageCircle, FileText, Stethoscope, Utensils } from 'lucide-react';

// Mock Health Data
const mockHealthData: HealthDataPoint[] = [
  { day: 'Mon', value: 72, average: 70 },
  { day: 'Tue', value: 75, average: 71 },
  { day: 'Wed', value: 68, average: 70 },
  { day: 'Thu', value: 82, average: 71 },
  { day: 'Fri', value: 78, average: 72 },
  { day: 'Sat', value: 65, average: 71 },
  { day: 'Sun', value: 70, average: 70 },
];

function App() {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [isDark, setIsDark] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  const renderDashboard = () => (
    <div className="space-y-6 animate-in fade-in duration-500 pb-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Avg Heart Rate" 
          value="72" 
          change={-2} 
          unit="bpm" 
          icon={<Heart size={20} />} 
        />
        <StatCard 
          title="Sleep Duration" 
          value="7.5" 
          change={5} 
          unit="hrs" 
          icon={<Moon size={20} />} 
        />
        <StatCard 
          title="Daily Steps" 
          value="8,432" 
          change={12} 
          unit="steps" 
          icon={<Footprints size={20} />} 
        />
        <StatCard 
          title="Active Calories" 
          value="450" 
          change={-5} 
          unit="kcal" 
          icon={<Activity size={20} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSection data={mockHealthData} />
        </div>
        
        <div className="space-y-6">
           {/* Quick Actions */}
           <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setCurrentView(View.CHAT)}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left group"
                >
                  <div className="p-2 bg-blue-500/10 text-blue-500 dark:text-blue-400 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Consult Dr. AI</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Analyze symptoms or images</p>
                  </div>
                </button>
                
                <button 
                  onClick={() => setCurrentView(View.PLANNER)}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left group"
                >
                  <div className="p-2 bg-teal-500/10 text-teal-500 dark:text-teal-400 rounded-lg group-hover:bg-teal-500/20 transition-colors">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">View Care Plan</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Your daily health tasks</p>
                  </div>
                </button>

                <button 
                  onClick={() => setCurrentView(View.NUTRITION)}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left group"
                >
                  <div className="p-2 bg-orange-500/10 text-orange-500 dark:text-orange-400 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                    <Utensils size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Diet & Nutrition</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Meal plans & macros</p>
                  </div>
                </button>

                <button 
                  onClick={() => setCurrentView(View.DOCTORS)}
                  className="w-full flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-left group"
                >
                  <div className="p-2 bg-purple-500/10 text-purple-500 dark:text-purple-400 rounded-lg group-hover:bg-purple-500/20 transition-colors">
                    <Stethoscope size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">Find a Specialist</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Book appointments nearby</p>
                  </div>
                </button>
              </div>
           </div>

           {/* Daily Insight */}
           <div className="bg-gradient-to-br from-teal-50 to-slate-100 dark:from-teal-900/50 dark:to-slate-800 border border-teal-100 dark:border-slate-700 rounded-xl p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Daily Insight</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm">
              Your resting heart rate has improved by <span className="text-teal-600 dark:text-teal-400 font-bold">5%</span> this week. Consistent cardio is paying off!
            </p>
            <button 
              onClick={() => setCurrentView(View.PLANNER)}
              className="text-sm text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 font-medium flex items-center gap-1"
            >
              See all insights &rarr;
            </button>
          </div>
        </div>
      </div>
      
      <HealthNewsCards />
    </div>
  );

  return (
    <div className={isDark ? 'dark' : ''}>
        <Layout currentView={currentView} setView={setCurrentView} isDark={isDark} toggleTheme={toggleTheme}>
        {currentView === View.DASHBOARD && renderDashboard()}
        {currentView === View.CHAT && (
            <div className="animate-in slide-in-from-bottom-4 duration-500 pb-16">
            <ChatInterface onSelectDoctor={setSelectedDoctor} />
            </div>
        )}
        {currentView === View.PLANNER && (
            <div className="animate-in slide-in-from-right-4 duration-500 pb-16">
            <HealthPlanner />
            </div>
        )}
        {currentView === View.NUTRITION && (
            <div className="animate-in slide-in-from-right-4 duration-500 pb-16">
            <NutritionSection />
            </div>
        )}
        {currentView === View.DOCTORS && (
            <div className="animate-in slide-in-from-right-4 duration-500">
            <DoctorDirectory onSelectDoctor={setSelectedDoctor} />
            </div>
        )}
        </Layout>
        
        {/* Global Modals & Widgets */}
        {selectedDoctor && (
           <DoctorProfileModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} />
        )}
        <HelpChatWidget />
        <NewsSection />
    </div>
  );
}

export default App;
