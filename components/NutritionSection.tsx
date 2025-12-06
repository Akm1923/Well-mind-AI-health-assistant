
import React, { useEffect, useState } from 'react';
import { generateDietPlan } from '../services/geminiService';
import { DietPlan } from '../types';
import { Utensils, Droplets, Ban, Apple, Flame, CheckCircle2, AlertCircle, Coffee, Sun, Moon, Sunset } from 'lucide-react';

const NutritionSection: React.FC = () => {
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      // Simulated context - In real app, this comes from user profile
      const context = "Male, 45, Type 2 Diabetes, High Cholesterol, Vegetarian Indian Diet Preference.";
      const data = await generateDietPlan(context);
      setPlan(data);
      setLoading(false);
    };

    fetchPlan();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center animate-bounce">
            <Apple className="text-green-600 dark:text-green-400" size={32} />
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-medium animate-pulse">Creating personalized nutrition plan...</p>
      </div>
    );
  }

  if (!plan) return null;

  const getMealIcon = (type: string) => {
      switch(type) {
          case 'Breakfast': return <Coffee className="text-orange-500" />;
          case 'Lunch': return <Sun className="text-yellow-500" />;
          case 'Dinner': return <Moon className="text-indigo-500" />;
          case 'Snack': return <Sunset className="text-pink-500" />;
          default: return <Utensils />;
      }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Utensils className="text-teal-600" /> Nutrition & Diet
            </h2>
            <p className="text-slate-500 dark:text-slate-400">AI-curated meal plan based on your health profile</p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-700">
            <Droplets className="text-blue-500" size={20} />
            <span className="text-sm font-bold text-blue-700 dark:text-blue-300">Goal: {plan.hydrationGoal}</span>
        </div>
      </div>

      {/* Macro Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Calories</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mt-1">{plan.dailyCalories}</span>
              <span className="text-xs text-slate-400">kcal/day</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Protein</span>
              <span className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">{plan.macros.protein}</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Carbs</span>
              <span className="text-2xl font-black text-orange-600 dark:text-orange-400 mt-1">{plan.macros.carbs}</span>
          </div>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center justify-center text-center">
              <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold">Fats</span>
              <span className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{plan.macros.fats}</span>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Meal Plan */}
          <div className="lg:col-span-2 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Daily Meal Schedule</h3>
              {plan.meals.map((meal, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                              <div className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl">
                                  {getMealIcon(meal.type)}
                              </div>
                              <div>
                                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">{meal.type}</h4>
                                  <p className="text-sm text-teal-600 dark:text-teal-400 font-medium">{meal.name}</p>
                              </div>
                          </div>
                          <span className="bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full">
                              {meal.totalCalories} kcal
                          </span>
                      </div>

                      <div className="space-y-3 mb-4">
                          {meal.foods.map((food, fIdx) => (
                              <div key={fIdx} className="flex justify-between items-center text-sm border-b border-slate-50 dark:border-slate-700 pb-2 last:border-0 last:pb-0">
                                  <span className="text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full"></div>
                                      {food.name}
                                  </span>
                                  <span className="text-slate-500 dark:text-slate-500 text-xs">
                                      {food.portion} ({food.calories} kcal)
                                  </span>
                              </div>
                          ))}
                      </div>

                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-3 flex items-start gap-3">
                          <CheckCircle2 className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" size={16} />
                          <p className="text-xs text-green-800 dark:text-green-300 leading-relaxed">
                              <span className="font-bold">Why this helps:</span> {meal.healthBenefit}
                          </p>
                      </div>
                  </div>
              ))}
          </div>

          {/* Sidebar: Avoid List & Tips */}
          <div className="space-y-6">
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl p-6">
                  <h3 className="text-lg font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-4">
                      <Ban size={20} /> Foods to Avoid
                  </h3>
                  <ul className="space-y-3">
                      {plan.avoidList.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                              {item}
                          </li>
                      ))}
                  </ul>
              </div>

              <div className="bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl p-6 text-white">
                  <Flame size={32} className="mb-4 text-yellow-300" />
                  <h3 className="text-xl font-bold mb-2">Pro Tip</h3>
                  <p className="text-teal-50 text-sm leading-relaxed opacity-90">
                      Consistency is key. Try to eat at the same times every day to regulate your blood sugar levels and metabolism effectively.
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
};

export default NutritionSection;
