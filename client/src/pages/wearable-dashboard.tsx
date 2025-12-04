import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, subDays, isAfter, isBefore, startOfDay, differenceInCalendarDays } from "date-fns";
import {
  Activity,
  Flame,
  Footprints,
  Heart,
  Moon,
  TrendingUp,
  Zap,
  Wind,
  Droplets,
  Brain,
  ChevronRight,
  Sparkles,
  Watch,
  RefreshCw,
  CalendarIcon,
  MoonStar,
  BrainCircuit,
  PersonStanding,
  Info,
  HelpCircle,
} from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Area,
  AreaChart,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Dumbbell, HeartPulse, Timer } from "lucide-react";

type MetricConfig = {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  color: string;
  tooltip: string;
};

const archetypeDescriptions: Record<string, string> = {
  'Night Owl': 'You often fall asleep late with irregular sleep timing. Your rhythm leans toward late nights, which can affect sleep quality.',
  'Strong Sleeper': 'You have good sleep efficiency with solid deep & REM sleep. You recover well with strong nighttime restoration.',
  'Sedentary Worker': 'You take few steps per day with long periods of inactivity. You may sit or stay inactive for extended times.',
  'Stress Responder': 'You spend long durations in a high-stress state or have lower HRV. Your nervous system may need more recovery.',
  'High Performer': 'You sleep well, stay active, have strong cardiovascular metrics, and balanced stress responses.',
  'Balanced Individual': 'You show no major weaknesses or extreme strengths. A stable lifestyle with room to grow.',
  'Recovery Needed': 'Several biomarker areas are in low or critical ranges. Your body may need recovery or lifestyle changes.',
};

const metricsConfig: MetricConfig[] = [
  {
    key: 'sleep',
    label: 'Sleep',
    icon: MoonStar,
    color: '#8B5CF6',
    tooltip: 'Based on: Total sleep duration, deep/light/REM sleep amounts, sleep efficiency, quality rating, time awake during night, and sleep schedule consistency.'
  },
  {
    key: 'activity',
    label: 'Activity',
    icon: Footprints,
    color: '#10B981',
    tooltip: 'Based on: Steps taken, active minutes, low/moderate/vigorous intensity activity, inactivity duration, walking distance, and active calories burned.'
  },
  {
    key: 'heart',
    label: 'Heart Health',
    icon: HeartPulse,
    color: '#EC4899',
    tooltip: 'Based on: Average, minimum, and maximum heart rate, plus Heart Rate Variability (HRV). Higher HRV indicates better recovery and stress resilience.'
  },
  {
    key: 'stress',
    label: 'Stress',
    icon: BrainCircuit,
    color: '#F97316',
    tooltip: 'Based on: Duration of high-stress physiological states. Less sustained stress throughout the day means a higher stress score.'
  },
  {
    key: 'calories',
    label: 'Metabolic',
    icon: Flame,
    color: '#EAB308',
    tooltip: 'Based on: Total calories burned and active calories from movement/exercise. More daily activity and higher active burn improves this score.'
  },
  {
    key: 'body',
    label: 'Body Composition',
    icon: PersonStanding,
    color: '#06B6D4',
    tooltip: 'Based on: Body Mass Index (BMI) and other body composition markers. Healthy weight-related metrics contribute to a higher score.'
  },
];

const biomarkersData = {
  biomarkers: [
    { marker_type: "Active Time", value: "11772", unit: "seconds", marker_status: "OptimalRange", benchmark_area: "Activity" },
    { marker_type: "Average Breathing Rate", value: "14", unit: "breaths/min", marker_status: "HealthyRange", benchmark_area: "Breathing" },
    { marker_type: "Average Heart Rate", value: "61", unit: "bpm", marker_status: "OptimalRange", benchmark_area: "Heart Rate" },
    { marker_type: "Average Oxygen Saturation", value: "99", unit: "%", marker_status: "HealthyRange", benchmark_area: "Oxygenation" },
    { marker_type: "HRV RMSSD", value: "29.83", unit: "ms", marker_status: "HealthyRange", benchmark_area: "Heart Rate" },
    { marker_type: "Calories Expenditure", value: "2382", unit: "kcal", marker_status: "HealthyRange", benchmark_area: "Calories" },
    { marker_type: "Steps", value: "2274", unit: "", marker_status: "DiseaseRange", benchmark_area: "Distance" },
    { marker_type: "Sleep Duration", value: "21685", unit: "seconds", marker_status: "HealthyRange", benchmark_area: "Duration" },
    { marker_type: "Deep Sleep", value: "4225", unit: "seconds", marker_status: "OptimalRange", benchmark_area: "Duration" },
    { marker_type: "Light Sleep", value: "12285", unit: "seconds", marker_status: "HealthyRange", benchmark_area: "Duration" },
    { marker_type: "REM Sleep", value: "5175", unit: "seconds", marker_status: "HealthyRange", benchmark_area: "Duration" },
    { marker_type: "Sleep Efficiency", value: "90", unit: "1-100 scale", marker_status: "OptimalRange", benchmark_area: "Scores" },
    { marker_type: "Sleep Quality", value: "5", unit: "1-5 scale", marker_status: "OptimalRange", benchmark_area: "Scores" },
    { marker_type: "Global Health Score", value: "67", unit: "0-100", marker_status: "HealthyRange", benchmark_area: "Health Score" },
    { marker_type: "Physical Health Score", value: "56", unit: "0-100", marker_status: "BorderlineRange", benchmark_area: "Health Score" },
    { marker_type: "Sleep Health Score", value: "78", unit: "0-100", marker_status: "HealthyRange", benchmark_area: "Health Score" },
    { marker_type: "High Stress Duration", value: "900", unit: "seconds", marker_status: "OptimalRange", benchmark_area: "Stress" },
    { marker_type: "Net Active Calories", value: "162", unit: "kcal", marker_status: "BorderlineRange", benchmark_area: "Calories" },
  ]
};

const getValueByType = (type: string) => {
  const biomarker = biomarkersData.biomarkers.find(b => b.marker_type === type);
  return biomarker ? parseFloat(biomarker.value) : 0;
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${mins}m`;
};

const heartRateData = [
  { time: '12am', hr: 58, hrv: 32 },
  { time: '2am', hr: 56, hrv: 35 },
  { time: '4am', hr: 54, hrv: 38 },
  { time: '6am', hr: 62, hrv: 28 },
  { time: '8am', hr: 72, hrv: 25 },
  { time: '10am', hr: 68, hrv: 30 },
  { time: '12pm', hr: 75, hrv: 27 },
  { time: '2pm', hr: 70, hrv: 29 },
  { time: '4pm', hr: 78, hrv: 24 },
  { time: '6pm', hr: 82, hrv: 22 },
  { time: '8pm', hr: 74, hrv: 28 },
  { time: '10pm', hr: 65, hrv: 31 },
];

const weeklyData = [
  { day: 'S', steps: 4500, goal: 10000, color: '#60A5FA' },
  { day: 'M', steps: 8200, goal: 10000, color: '#34D399' },
  { day: 'T', steps: 6800, goal: 10000, color: '#60A5FA' },
  { day: 'W', steps: 9500, goal: 10000, color: '#34D399' },
  { day: 'T', steps: 7200, goal: 10000, color: '#60A5FA' },
  { day: 'F', steps: 5400, goal: 10000, color: '#FBBF24' },
  { day: 'S', steps: 2274, goal: 10000, color: '#F87171' },
];

const insights = [
  { icon: Moon, title: "Great sleep quality!", description: "Keep it up.", color: "from-purple-500 to-indigo-500" },
  { icon: Footprints, title: "Try a light walk", description: "to hit your step goal.", color: "from-orange-500 to-red-500" },
  { icon: Heart, title: "Heart rate optimal", description: "Resting HR is healthy.", color: "from-pink-500 to-rose-500" },
];

const weeklyStepsData = [
  { day: 'Sun', steps: 4500, goal: 10000 },
  { day: 'Mon', steps: 8200, goal: 10000 },
  { day: 'Tue', steps: 6800, goal: 10000 },
  { day: 'Wed', steps: 9500, goal: 10000 },
  { day: 'Thu', steps: 7200, goal: 10000 },
  { day: 'Fri', steps: 5400, goal: 10000 },
  { day: 'Sat', steps: 2274, goal: 10000 },
];

const weeklySleepData = [
  { day: 'Sun', hours: 7.2 },
  { day: 'Mon', hours: 6.5 },
  { day: 'Tue', hours: 8.1 },
  { day: 'Wed', hours: 7.8 },
  { day: 'Thu', hours: 6.0 },
  { day: 'Fri', hours: 7.5 },
  { day: 'Sat', hours: 6.0 },
];

const weeklyCaloriesData = [
  { day: 'Sun', calories: 2100 },
  { day: 'Mon', calories: 2450 },
  { day: 'Tue', calories: 2200 },
  { day: 'Wed', calories: 2600 },
  { day: 'Thu', calories: 2350 },
  { day: 'Fri', calories: 2150 },
  { day: 'Sat', calories: 2382 },
];

const weeklyActiveData = [
  { day: 'Sun', minutes: 45 },
  { day: 'Mon', minutes: 120 },
  { day: 'Tue', minutes: 85 },
  { day: 'Wed', minutes: 150 },
  { day: 'Thu', minutes: 95 },
  { day: 'Fri', minutes: 60 },
  { day: 'Sat', minutes: 196 },
];

const currentScores = {
  scores: {
    sleep: 81.98,
    activity: 60.10,
    heart: 85.13,
    stress: 100.0,
    calories: 63.04,
    body: 20.0,
    global: 72.70
  },
  archetype: "Sedentary Worker",
  lastSync: new Date('2024-12-04T14:32:00')
};

const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateScoreHistory = (fromDate: Date, toDate: Date) => {
  const data = [];
  const normalizedFrom = startOfDay(fromDate);
  const normalizedTo = startOfDay(toDate);
  const totalDays = differenceInCalendarDays(normalizedTo, normalizedFrom) + 1;
  
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(normalizedFrom);
    currentDate.setDate(currentDate.getDate() + i);
    
    const dayOfYear = Math.floor((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    const dateSeed = currentDate.getFullYear() * 1000 + dayOfYear;
    
    const baseVariation = Math.sin(dayOfYear * 0.1) * 5;
    const getVariation = (offset: number) => (seededRandom(dateSeed + offset) - 0.5) * 8;
    
    data.push({
      date: format(currentDate, 'MMM d'),
      fullDate: new Date(currentDate),
      sleep: Math.round(Math.min(100, Math.max(60, 78 + baseVariation + getVariation(1))) * 10) / 10,
      activity: Math.round(Math.min(100, Math.max(40, 55 + baseVariation * 1.2 + getVariation(2))) * 10) / 10,
      heart: Math.round(Math.min(100, Math.max(70, 83 + baseVariation * 0.5 + getVariation(3))) * 10) / 10,
      stress: Math.round(Math.min(100, Math.max(75, 90 + baseVariation * 0.8 + getVariation(4))) * 10) / 10,
      calories: Math.round(Math.min(100, Math.max(45, 60 + baseVariation + getVariation(5))) * 10) / 10,
      body: Math.round(Math.min(100, Math.max(15, 19 + baseVariation * 0.3 + getVariation(6) * 0.5)) * 10) / 10,
      global: Math.round(Math.min(100, Math.max(60, 70 + baseVariation * 0.7 + getVariation(7))) * 10) / 10,
    });
  }
  
  return data;
};

const scoreColors: Record<string, string> = {
  sleep: '#8B5CF6',
  activity: '#10B981',
  heart: '#EC4899',
  stress: '#F59E0B',
  calories: '#EAB308',
  body: '#06B6D4',
  global: '#3B82F6',
};

const scoreLabels: Record<string, string> = {
  sleep: 'Sleep',
  activity: 'Activity',
  heart: 'Heart Health',
  stress: 'Stress',
  calories: 'Metabolic',
  body: 'Body Comp',
  global: 'Global Wellness',
};

function CircularProgress({ 
  value, 
  max, 
  size = 120, 
  strokeWidth = 8,
  children 
}: { 
  value: number; 
  max: number; 
  size?: number; 
  strokeWidth?: number;
  children?: React.ReactNode;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const percent = Math.min(value / max, 1);
  const offset = circumference - percent * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.1)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#gradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06B6D4" />
            <stop offset="50%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

function SleepStagesCircle() {
  const deep = getValueByType("Deep Sleep");
  const light = getValueByType("Light Sleep");
  const rem = getValueByType("REM Sleep");
  const total = deep + light + rem;
  
  const data = [
    { name: 'Deep', value: deep, color: '#6366F1' },
    { name: 'Light', value: light, color: '#60A5FA' },
    { name: 'REM', value: rem, color: '#A78BFA' },
  ];

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={28}
              outerRadius={40}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center">
          <Moon className="w-5 h-5 text-indigo-400" />
        </div>
      </div>
      <div className="flex-1 space-y-1.5">
        {data.map((stage) => (
          <div key={stage.name} className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: stage.color }} />
            <span className="text-xs text-gray-600 dark:text-gray-300 flex-1">{stage.name}</span>
            <span className="text-xs font-medium text-gray-800 dark:text-gray-100">
              {formatDuration(stage.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onViewDemo }: { onViewDemo: () => void }) {
  return (
    <div className="flex-1 flex items-center justify-center p-4 bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      <div className="max-w-lg w-full">
        <div className="glass-card rounded-3xl p-6 bg-gradient-to-br from-blue-500/10 via-teal-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 shadow-xl dark:from-blue-500/20 dark:via-teal-500/20 dark:to-purple-500/20">
          <div className="flex flex-col items-center text-center space-y-5">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center shadow-xl shadow-blue-500/30">
              <Watch className="w-10 h-10 text-white" />
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Your Wellness Dashboard Is Waiting for Data
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                We analyze your sleep, movement, stress, heart rhythms, and body metrics to generate your:
              </p>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-left text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                  <span className="text-gray-600 dark:text-gray-300">Sleep Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-gray-600 dark:text-gray-300">Activity Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  <span className="text-gray-600 dark:text-gray-300">Stress Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-pink-500" />
                  <span className="text-gray-600 dark:text-gray-300">Heart Health Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                  <span className="text-gray-600 dark:text-gray-300">Body Composition Score</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                  <span className="text-gray-600 dark:text-gray-300">Global Wellness Score</span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
                  <span className="text-gray-600 dark:text-gray-300">Personal Health Archetype</span>
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm pt-1">
                Connect your wearable device to unlock your personalized insights.
              </p>
            </div>
            
            <div className="w-full max-w-xs pt-2">
              <Button
                variant="outline"
                onClick={onViewDemo}
                className="w-full border-gray-200 dark:border-gray-700"
                data-testid="button-view-demo"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                View Demo Data
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WearableDashboard() {
  const [hasWearableData, setHasWearableData] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const [visibleScores, setVisibleScores] = useState<string[]>(['global', 'sleep', 'activity', 'heart', 'stress', 'calories', 'body']);
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfDay(subDays(new Date(), 6)),
    to: startOfDay(new Date())
  });
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [scoreHistory, setScoreHistory] = useState(() => generateScoreHistory(startOfDay(subDays(new Date(), 6)), startOfDay(new Date())));
  const globalScore = currentScores.scores.global / 10;

  useEffect(() => {
    setScoreHistory(generateScoreHistory(dateRange.from, dateRange.to));
  }, [dateRange]);

  const steps = getValueByType("Steps");
  const sleepSeconds = getValueByType("Sleep Duration");
  const activeMinutes = Math.round(getValueByType("Active Time") / 60);
  const calories = Math.round(getValueByType("Calories Expenditure"));
  const heartRate = Math.round(getValueByType("Average Heart Rate"));
  const spo2 = Math.round(getValueByType("Average Oxygen Saturation"));
  const hrv = Math.round(getValueByType("HRV RMSSD"));
  const breathingRate = Math.round(getValueByType("Average Breathing Rate"));

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(globalScore);
    }, 300);
    return () => clearTimeout(timer);
  }, [globalScore]);

  const getScoreLabel = (score: number) => {
    if (score >= 8) return "Feeling Great!";
    if (score >= 6) return "Good Day";
    if (score >= 4) return "Fair";
    return "Needs Attention";
  };

  const handleViewDemo = () => {
    setShowDemo(true);
    setHasWearableData(true);
  };

  const toggleScoreVisibility = (scoreKey: string) => {
    setVisibleScores(prev => 
      prev.includes(scoreKey) 
        ? prev.filter(s => s !== scoreKey)
        : [...prev, scoreKey]
    );
  };

  const getDateRangeLabel = () => {
    const diffDays = Math.round((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    if (diffDays === 7) return "Last 7 days";
    if (diffDays === 14) return "Last 14 days";
    if (diffDays === 30) return "Last 30 days";
    return `${format(dateRange.from, 'MMM d')} - ${format(dateRange.to, 'MMM d')}`;
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    if (!dateRange.from || (dateRange.from && dateRange.to)) {
      setDateRange({ from: date, to: date });
    } else {
      if (isBefore(date, dateRange.from)) {
        setDateRange({ from: date, to: dateRange.from });
      } else {
        setDateRange({ from: dateRange.from, to: date });
      }
      setIsDatePickerOpen(false);
    }
  };

  const setPresetRange = (days: number) => {
    setDateRange({
      from: startOfDay(subDays(new Date(), days - 1)),
      to: startOfDay(new Date())
    });
    setIsDatePickerOpen(false);
  };

  if (!hasWearableData && !showDemo) {
    return (
      <EmptyState onViewDemo={handleViewDemo} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 p-4 pb-24">
      <div className="max-w-lg mx-auto pt-4">
        <div className="space-y-4">
        
        {/* Unified Wellness Snapshot Card */}
        <div className="glass-card rounded-3xl p-6 bg-gradient-to-br from-blue-500/10 via-teal-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 shadow-xl dark:from-blue-500/20 dark:via-teal-500/20 dark:to-purple-500/20" data-testid="card-wellness-snapshot">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              Wellness Summary
            </h2>
            <TooltipProvider delayDuration={200}>
              <UITooltip>
                <TooltipTrigger asChild>
                  <button className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 flex items-center gap-1 hover:from-cyan-500/30 hover:to-blue-500/30 transition-all">
                    {currentScores.archetype}
                    <Info className="w-3 h-3 opacity-60" />
                  </button>
                </TooltipTrigger>
                <TooltipContent 
                  side="bottom" 
                  align="end"
                  className="max-w-[220px] text-[10px] leading-relaxed bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                >
                  <p className="font-medium mb-1">{currentScores.archetype}</p>
                  <p>{archetypeDescriptions[currentScores.archetype] || 'Your wellness archetype based on your health patterns.'}</p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
          
          {/* Global Score Hero */}
          <TooltipProvider delayDuration={200}>
            <div className="flex flex-col items-center mb-6">
              <CircularProgress value={animatedScore} max={10} size={140} strokeWidth={10}>
                <div className="text-center">
                  <div className="text-4xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                    {animatedScore.toFixed(1)}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Global Score
                    </span>
                    <UITooltip>
                      <TooltipTrigger asChild>
                        <button className="p-0.5 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded transition-colors">
                          <Info className="w-3 h-3 text-gray-400 dark:text-gray-500" />
                        </button>
                      </TooltipTrigger>
                      <TooltipContent 
                        side="bottom" 
                        className="max-w-[220px] text-[10px] leading-relaxed bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                      >
                        <p>Your Global Wellness Score combines all 6 metrics: Sleep, Activity, Heart Health, Stress, Calories, and Body Composition to give you an overall view of your health balance.</p>
                      </TooltipContent>
                    </UITooltip>
                  </div>
                </div>
              </CircularProgress>
            </div>
          </TooltipProvider>
          
          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent dark:via-gray-600/50 mb-4" />
          
          {/* Individual Scores Grid */}
          <TooltipProvider delayDuration={200}>
            <div className="grid grid-cols-3 gap-3">
              {metricsConfig.map((metric) => {
                const scoreValue = currentScores?.scores?.[metric.key as keyof typeof currentScores.scores] ?? null;
                const hasValue = scoreValue !== null && scoreValue !== undefined;
                const IconComponent = metric.icon;
                
                return (
                  <div 
                    key={metric.key}
                    className={`text-center p-3 rounded-xl border transition-all ${
                      hasValue 
                        ? 'bg-white/40 dark:bg-white/5 border-white/30' 
                        : 'bg-gray-100/30 dark:bg-gray-800/30 border-dashed border-gray-300/50 dark:border-gray-600/50'
                    }`}
                    data-testid={`score-${metric.key}`}
                  >
                    <div 
                      className="w-8 h-8 mx-auto mb-2 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: hasValue ? `${metric.color}15` : '#9ca3af20' }}
                    >
                      <IconComponent 
                        className="w-4 h-4"
                        style={{ color: hasValue ? metric.color : '#9ca3af' }}
                      />
                    </div>
                    <div 
                      className="text-xl font-bold"
                      style={{ color: hasValue ? metric.color : '#9ca3af' }}
                    >
                      {hasValue ? Math.round(scoreValue) : '—'}
                    </div>
                    <div className="flex items-center justify-center gap-0.5">
                      <span className="text-[10px] text-gray-500 dark:text-gray-400">{metric.label}</span>
                      <UITooltip>
                        <TooltipTrigger asChild>
                          <button className="p-0.5 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded transition-colors">
                            <Info className="w-2.5 h-2.5 text-gray-400 dark:text-gray-500" />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent 
                          side="top" 
                          className="max-w-[200px] text-[10px] leading-relaxed bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-lg"
                        >
                          <p>{metric.tooltip}</p>
                        </TooltipContent>
                      </UITooltip>
                    </div>
                  </div>
                );
              })}
            </div>
          </TooltipProvider>
          
          {/* Subtle Last Sync Footer */}
          <div className="mt-4 pt-3 border-t border-gray-200/30 dark:border-gray-700/30">
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
              <RefreshCw className="w-2.5 h-2.5" />
              <span>Last synced {format(currentScores.lastSync, 'MMM d')} at {format(currentScores.lastSync, 'h:mm a')}</span>
            </div>
          </div>
        </div>

        {/* Score Progression History */}
        <div className="glass-card rounded-2xl p-4 bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg" data-testid="card-score-progression">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Score Progression</h3>
            <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
              <PopoverTrigger asChild>
                <button 
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-600 dark:text-gray-300 bg-white/60 dark:bg-white/10 hover:bg-white/80 dark:hover:bg-white/20 border border-gray-200/50 dark:border-gray-600/50 transition-all duration-200"
                  data-testid="date-picker-trigger"
                >
                  <CalendarIcon className="w-3.5 h-3.5" />
                  <span>{getDateRangeLabel()}</span>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 shadow-xl rounded-2xl" align="end">
                <div className="p-3 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex gap-1.5 flex-wrap">
                    <button
                      onClick={() => setPresetRange(7)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-700 dark:text-cyan-300 hover:from-cyan-500/20 hover:to-blue-500/20 transition-all"
                      data-testid="preset-7-days"
                    >
                      7 days
                    </button>
                    <button
                      onClick={() => setPresetRange(14)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-700 dark:text-cyan-300 hover:from-cyan-500/20 hover:to-blue-500/20 transition-all"
                      data-testid="preset-14-days"
                    >
                      14 days
                    </button>
                    <button
                      onClick={() => setPresetRange(30)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-700 dark:text-cyan-300 hover:from-cyan-500/20 hover:to-blue-500/20 transition-all"
                      data-testid="preset-30-days"
                    >
                      30 days
                    </button>
                  </div>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-2">
                    Or select custom range below
                  </p>
                </div>
                <Calendar
                  mode="range"
                  selected={{ from: dateRange.from, to: dateRange.to }}
                  onSelect={(range) => {
                    if (range?.from && range?.to) {
                      setDateRange({ from: range.from, to: range.to });
                      setIsDatePickerOpen(false);
                    } else if (range?.from) {
                      setDateRange({ from: range.from, to: range.from });
                    }
                  }}
                  disabled={(date) => isAfter(date, new Date())}
                  numberOfMonths={1}
                  className="rounded-b-2xl"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          {/* Score Legend Toggles */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {Object.keys(scoreColors).map((key) => (
              <button
                key={key}
                onClick={() => toggleScoreVisibility(key)}
                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all duration-200 flex items-center gap-1 ${
                  visibleScores.includes(key)
                    ? 'bg-white/80 dark:bg-white/20 shadow-sm'
                    : 'bg-transparent opacity-50'
                }`}
                data-testid={`toggle-${key}`}
              >
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: scoreColors[key] }}
                />
                <span className="text-gray-700 dark:text-gray-300">{scoreLabels[key]}</span>
              </button>
            ))}
          </div>
          
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={scoreHistory} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  {Object.entries(scoreColors).map(([key, color]) => (
                    <linearGradient key={key} id={`${key}Gradient`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                      <stop offset="95%" stopColor={color} stopOpacity={0}/>
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="rgba(148, 163, 184, 0.15)" 
                  vertical={false}
                />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 9, fill: '#9CA3AF' }} 
                  stroke="#E5E7EB" 
                  axisLine={false} 
                  tickLine={false}
                  interval={0}
                  padding={{ left: 10, right: 10 }}
                />
                <YAxis 
                  hide 
                  domain={[0, 100]} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.98)', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    fontSize: '11px',
                    padding: '8px 12px'
                  }}
                  labelStyle={{ fontWeight: 600, marginBottom: 6, fontSize: '12px' }}
                  itemStyle={{ padding: '2px 0' }}
                />
                {visibleScores.includes('global') && (
                  <Line 
                    type="monotone" 
                    dataKey="global" 
                    name="Global"
                    stroke={scoreColors.global} 
                    strokeWidth={3} 
                    dot={false}
                    activeDot={{ r: 5, fill: scoreColors.global, stroke: '#fff', strokeWidth: 2 }}
                  />
                )}
                {visibleScores.includes('sleep') && (
                  <Line 
                    type="monotone" 
                    dataKey="sleep"
                    name="Sleep"
                    stroke={scoreColors.sleep} 
                    strokeWidth={1.5} 
                    strokeOpacity={0.85}
                    dot={false}
                    activeDot={{ r: 4, fill: scoreColors.sleep, stroke: '#fff', strokeWidth: 2 }}
                  />
                )}
                {visibleScores.includes('activity') && (
                  <Line 
                    type="monotone" 
                    dataKey="activity"
                    name="Activity"
                    stroke={scoreColors.activity} 
                    strokeWidth={1.5} 
                    strokeOpacity={0.85}
                    dot={false}
                    activeDot={{ r: 4, fill: scoreColors.activity, stroke: '#fff', strokeWidth: 2 }}
                  />
                )}
                {visibleScores.includes('heart') && (
                  <Line 
                    type="monotone" 
                    dataKey="heart"
                    name="Heart"
                    stroke={scoreColors.heart} 
                    strokeWidth={1.5} 
                    strokeOpacity={0.85}
                    dot={false}
                    activeDot={{ r: 4, fill: scoreColors.heart, stroke: '#fff', strokeWidth: 2 }}
                  />
                )}
                {visibleScores.includes('stress') && (
                  <Line 
                    type="monotone" 
                    dataKey="stress"
                    name="Stress"
                    stroke={scoreColors.stress} 
                    strokeWidth={1.5} 
                    strokeOpacity={0.85}
                    dot={false}
                    activeDot={{ r: 4, fill: scoreColors.stress, stroke: '#fff', strokeWidth: 2 }}
                  />
                )}
                {visibleScores.includes('calories') && (
                  <Line 
                    type="monotone" 
                    dataKey="calories"
                    name="Calories"
                    stroke={scoreColors.calories} 
                    strokeWidth={1.5} 
                    strokeOpacity={0.85}
                    dot={false}
                    activeDot={{ r: 4, fill: scoreColors.calories, stroke: '#fff', strokeWidth: 2 }}
                  />
                )}
                {visibleScores.includes('body') && (
                  <Line 
                    type="monotone" 
                    dataKey="body"
                    name="Body"
                    stroke={scoreColors.body} 
                    strokeWidth={1.5} 
                    strokeOpacity={0.85}
                    dot={false}
                    activeDot={{ r: 4, fill: scoreColors.body, stroke: '#fff', strokeWidth: 2 }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
}
