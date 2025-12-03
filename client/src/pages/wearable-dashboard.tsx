import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
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
  ArrowLeft,
  Smartphone,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
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
} from "recharts";

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

function EmptyState({ onConnect, onBack, onViewDemo }: { onConnect: () => void; onBack: () => void; onViewDemo: () => void }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 p-4 pb-24">
      <div className="max-w-lg mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4 -ml-2"
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        
        <div className="glass-card rounded-3xl p-8 bg-gradient-to-br from-blue-500/10 via-teal-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 shadow-xl dark:from-blue-500/20 dark:via-teal-500/20 dark:to-purple-500/20">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-500 flex items-center justify-center shadow-xl shadow-blue-500/30">
              <Watch className="w-12 h-12 text-white" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Connect Your Wearable
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                Link your smartwatch or fitness tracker to see real-time health metrics, sleep data, and personalized insights.
              </p>
            </div>
            
            <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center shadow-md">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Heart Rate</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-md">
                  <Moon className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Sleep</span>
              </div>
              <div className="flex flex-col items-center space-y-1">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-md">
                  <Footprints className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-gray-500 dark:text-gray-400">Steps</span>
              </div>
            </div>
            
            <div className="space-y-3 w-full max-w-xs pt-2">
              <Button
                onClick={onConnect}
                className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 hover:from-cyan-600 hover:via-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/30"
                data-testid="button-connect-wearable"
              >
                <Smartphone className="w-4 h-4 mr-2" />
                Connect Device
              </Button>
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
            
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Supports Apple Watch, Fitbit, Garmin, Oura Ring, and more
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WearableDashboard() {
  const [, setLocation] = useLocation();
  const [hasWearableData, setHasWearableData] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);
  const globalScore = getValueByType("Global Health Score") / 10;
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

  const handleConnect = () => {
    setHasWearableData(true);
  };

  const handleViewDemo = () => {
    setShowDemo(true);
    setHasWearableData(true);
  };

  if (!hasWearableData && !showDemo) {
    return (
      <EmptyState 
        onConnect={handleConnect} 
        onBack={() => setLocation("/")} 
        onViewDemo={handleViewDemo}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 p-4 pb-24">
      <div className="max-w-lg mx-auto">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLocation("/")}
          className="mb-4 -ml-2"
          data-testid="button-back-dashboard"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back
        </Button>
        
        <div className="space-y-4">
        
        <div className="glass-card rounded-3xl p-6 bg-gradient-to-br from-blue-500/10 via-teal-500/10 to-purple-500/10 backdrop-blur-xl border border-white/20 shadow-xl dark:from-blue-500/20 dark:via-teal-500/20 dark:to-purple-500/20">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Daily Wellness Summary
          </h2>
          
          <div className="flex flex-col items-center">
            <CircularProgress value={animatedScore} max={10} size={140} strokeWidth={10}>
              <div className="text-center">
                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                  {animatedScore.toFixed(1)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {getScoreLabel(animatedScore)}
                </div>
              </div>
            </CircularProgress>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="glass-card rounded-2xl p-4 bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg text-center" data-testid="tile-steps">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Footprints className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-white">{steps.toLocaleString()}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Steps</div>
          </div>
          
          <div className="glass-card rounded-2xl p-4 bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg text-center" data-testid="tile-sleep">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Moon className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-white">{formatDuration(sleepSeconds)}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Sleep</div>
          </div>
          
          <div className="glass-card rounded-2xl p-4 bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg text-center" data-testid="tile-active">
            <div className="w-10 h-10 mx-auto mb-2 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="text-xl font-bold text-gray-800 dark:text-white">{activeMinutes}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">Active Min</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card rounded-2xl p-4 bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg" data-testid="card-weekly-progress">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Weekly Progress</h3>
            <div className="h-24">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} barSize={16}>
                  <Bar dataKey="steps" radius={[4, 4, 0, 0]}>
                    {weeklyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-between mt-1">
              {weeklyData.map((d, i) => (
                <span key={i} className="text-[10px] text-gray-400 w-4 text-center">{d.day}</span>
              ))}
            </div>
          </div>
          
          <div className="glass-card rounded-2xl p-4 bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg" data-testid="card-calorie-burn">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Calorie Burn</h3>
            <div className="flex items-center justify-center">
              <CircularProgress value={calories} max={3000} size={80} strokeWidth={6}>
                <div className="text-center">
                  <Flame className="w-5 h-5 text-orange-500 mx-auto" />
                </div>
              </CircularProgress>
            </div>
            <div className="text-center mt-2">
              <span className="text-lg font-bold text-gray-800 dark:text-white">{calories}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">kcal</span>
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg" data-testid="card-biometrics">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Biometric Timeline</h3>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                HR
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                HRV
              </span>
            </div>
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={heartRateData}>
                <defs>
                  <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="hrvGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 10 }} stroke="#9CA3AF" axisLine={false} tickLine={false} />
                <YAxis hide domain={[40, 100]} />
                <Area type="monotone" dataKey="hr" stroke="#EC4899" strokeWidth={2} fill="url(#hrGradient)" />
                <Area type="monotone" dataKey="hrv" stroke="#8B5CF6" strokeWidth={2} fill="url(#hrvGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { icon: Heart, label: "HR", value: heartRate, unit: "bpm", color: "from-pink-500 to-rose-500" },
            { icon: Activity, label: "SpO2", value: spo2, unit: "%", color: "from-cyan-500 to-blue-500" },
            { icon: Brain, label: "HRV", value: hrv, unit: "ms", color: "from-purple-500 to-indigo-500" },
            { icon: Wind, label: "BR", value: breathingRate, unit: "/min", color: "from-teal-500 to-emerald-500" },
          ].map((metric, i) => (
            <div 
              key={i} 
              className="glass-card rounded-xl p-3 bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg text-center"
              data-testid={`metric-${metric.label.toLowerCase()}`}
            >
              <div className={`w-8 h-8 mx-auto mb-1.5 rounded-lg bg-gradient-to-br ${metric.color} flex items-center justify-center`}>
                <metric.icon className="w-4 h-4 text-white" />
              </div>
              <div className="text-sm font-bold text-gray-800 dark:text-white">{metric.value}</div>
              <div className="text-[10px] text-gray-500 dark:text-gray-400">{metric.unit}</div>
            </div>
          ))}
        </div>

        <div className="glass-card rounded-2xl p-4 bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg" data-testid="card-sleep-analysis">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Sleep Analysis</h3>
          <SleepStagesCircle />
          <div className="mt-3 pt-3 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-between text-xs">
            <div>
              <span className="text-gray-500 dark:text-gray-400">Efficiency</span>
              <span className="ml-2 font-semibold text-gray-800 dark:text-white">90%</span>
            </div>
            <div>
              <span className="text-gray-500 dark:text-gray-400">Quality</span>
              <span className="ml-2 font-semibold text-gray-800 dark:text-white">5/5</span>
            </div>
          </div>
        </div>

        <div className="space-y-2" data-testid="insights-section">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 px-1">Your Insights</h3>
          {insights.map((insight, i) => (
            <div 
              key={i}
              className="glass-card rounded-2xl p-4 bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/30 shadow-lg flex items-center gap-3"
              data-testid={`insight-card-${i}`}
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${insight.color} flex items-center justify-center flex-shrink-0`}>
                <insight.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-800 dark:text-white">{insight.title}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{insight.description}</div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
          ))}
        </div>

        </div>
      </div>
    </div>
  );
}
