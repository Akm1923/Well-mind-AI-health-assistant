
export interface Attachment {
  mimeType: string;
  data: string; // Base64
  name?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isGrounding?: boolean;
  sources?: Array<{ uri: string; title: string }>;
  attachments?: Attachment[];
}

export interface HealthDataPoint {
  day: string;
  value: number; // e.g., Heart Rate
  average: number;
}

export interface DailyTask {
  time: string;
  activity: string;
  category: 'Diet' | 'Exercise' | 'Mental' | 'Medical';
  status: 'pending' | 'completed';
}

export interface WeeklyGoal {
  id: number;
  title: string;
  description: string;
  target: string;
  progress: number; // 0-100
}

export interface MonthlyInsight {
  month: string;
  focusArea: string;
  summary: string;
  tips: string[];
}

export interface WellnessPlan {
  dailyRoutine: DailyTask[];
  weeklyGoals: WeeklyGoal[];
  monthlyInsight: MonthlyInsight;
}

// --- Nutrition Types ---
export interface FoodItem {
  name: string;
  portion: string;
  calories: number;
}

export interface Meal {
  type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';
  name: string;
  foods: FoodItem[];
  totalCalories: number;
  healthBenefit: string; // Specific reason why this meal helps the patient
}

export interface DietPlan {
  dailyCalories: number;
  macros: {
    protein: string;
    carbs: string;
    fats: string;
  };
  meals: Meal[];
  hydrationGoal: string;
  avoidList: string[];
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  qualification: string;
  hospital: string;
  experience: number;
  rating: number;
  reviews: number;
  image: string;
  fee: number;
  availability: string;
  about?: string;
  languages?: string[];
  location?: string;
}

export interface NewsItem {
  title: string;
  summary: string;
  url: string;
  source: string;
  timeAgo: string;
}

export enum View {
  DASHBOARD = 'DASHBOARD',
  CHAT = 'CHAT',
  PLANNER = 'PLANNER',
  DOCTORS = 'DOCTORS',
  NUTRITION = 'NUTRITION'
}
