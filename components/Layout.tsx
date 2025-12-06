import React from 'react';
import { LayoutDashboard, MessageSquare, ListTodo, Activity, Menu, X, Settings, UserCircle, Stethoscope, Moon, Sun, Utensils } from 'lucide-react';
import { View } from '../types';

interface LayoutProps {
  currentView: View;
  setView: (view: View) => void;
  children: React.ReactNode;
  isDark: boolean;
  toggleTheme: () => void;
}

const Layout: React.FC<LayoutProps> = ({ currentView, setView, children, isDark, toggleTheme }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: View.DASHBOARD, label: 'Health Dashboard', icon: LayoutDashboard },
    { id: View.CHAT, label: 'Well Mind Chat', icon: MessageSquare },
    { id: View.PLANNER, label: 'Wellness Plan', icon: ListTodo },
    { id: View.NUTRITION, label: 'Nutrition & Diet', icon: Utensils },
    { id: View.DOCTORS, label: 'Find Doctors', icon: Stethoscope },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 flex transition-colors duration-300 font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex flex-col w-64 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 transition-colors duration-300 sticky top-0 h-screen z-30">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-600/20">
            <Activity className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-blue-600 dark:from-teal-400 dark:to-blue-400">
            Well Mind AI
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.id
                  ? 'bg-teal-50 dark:bg-teal-600/10 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-500/20 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 space-y-4 mt-auto">
           {/* Theme Toggle */}
           <button 
             onClick={toggleTheme}
             className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 transition-colors"
           >
             <span className="text-sm font-medium">Theme</span>
             {isDark ? <Moon size={18} /> : <Sun size={18} />}
           </button>

          <div className="bg-slate-100 dark:bg-slate-900 rounded-xl p-4 border border-slate-200 dark:border-slate-800 transition-colors hover:border-teal-500/30 cursor-pointer group">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <UserCircle className="text-white" size={20} />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">Amit Kumar Bind</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Patient ID: #8492</p>
              </div>
              <Settings size={16} className="text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors" />
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-teal-500 h-full w-[90%] rounded-full" />
            </div>
            <p className="text-[10px] text-slate-500 mt-2 text-center font-medium">Profile 90% Complete</p>
          </div>
        </div>
      </aside>

      {/* Mobile Header & Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="lg:hidden h-16 bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 transition-colors duration-300 z-30 sticky top-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center text-white shadow-md">
                <Activity size={18} />
            </div>
            <span className="font-bold text-lg text-slate-900 dark:text-white">Well Mind AI</span>
          </div>
          <div className="flex items-center gap-3">
              <button onClick={toggleTheme} className="p-2 text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {isDark ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-900 dark:text-white">
                {isMobileMenuOpen ? <X /> : <Menu />}
              </button>
          </div>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-900 z-50 border-b border-slate-200 dark:border-slate-800 p-4 shadow-2xl transition-colors duration-300">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setView(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl border ${
                    currentView === item.id
                      ? 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-800'
                      : 'text-slate-500 dark:text-slate-400 border-transparent'
                  }`}
                >
                  <item.icon size={20} />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
        )}

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative scroll-smooth">
            <div className="p-4 lg:p-8 max-w-7xl mx-auto h-full pb-24">
                {children}
            </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;