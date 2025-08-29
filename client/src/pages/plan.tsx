import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Target, 
  Trophy, 
  Plus, 
  Calendar,
  Clock,
  Zap,
  Award,
  TrendingUp,
  CheckCircle,
  Circle,
  Star,
  Flame,
  Activity,
  Heart,
  Brain,
  Settings,
  ArrowRight,
  Users,
  Timer,
  BarChart3,
  Info,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  Droplets,
  Footprints,
  Utensils,
  Minus,
  X
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  target: number;
  unit: string;
  deadline: Date;
  priority: 'high' | 'medium' | 'low';
  status: 'active' | 'completed' | 'paused';
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number;
  participants: number;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  reward: string;
  startDate: Date;
  joined: boolean;
}

interface ActionPlan {
  id: string;
  title: string;
  description: string;
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    priority: 'high' | 'medium' | 'low';
    type: 'checkbox' | 'value_input' | 'activity_detail';
    targetValue?: number;
    currentValue?: number;
    unit?: string;
    activityDetails?: {
      image?: string;
      sets?: number;
      reps?: string;
      weight?: string;
      duration?: string;
      instructions?: string;
      benefits?: string[];
    };
  }>;
  category: string;
  progress: number;
  dueDate: Date;
}

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Improve Cholesterol Levels',
    description: 'Reduce LDL cholesterol to below 100 mg/dL',
    category: 'Cardiovascular',
    progress: 75,
    target: 100,
    unit: 'mg/dL',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    priority: 'high',
    status: 'active'
  },
  {
    id: '2',
    title: 'Weight Management',
    description: 'Achieve and maintain optimal BMI range',
    category: 'Fitness',
    progress: 40,
    target: 165,
    unit: 'lbs',
    deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    priority: 'medium',
    status: 'active'
  },
  {
    id: '3',
    title: 'Better Sleep Quality',
    description: 'Consistent 7-8 hours of quality sleep nightly',
    category: 'Lifestyle',
    progress: 85,
    target: 8,
    unit: 'hours',
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    priority: 'high',
    status: 'active'
  }
];

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: '30-Day Mediterranean Diet',
    description: 'Adopt Mediterranean eating patterns to improve heart health and reduce inflammation',
    duration: 30,
    participants: 2847,
    category: 'Nutrition',
    difficulty: 'intermediate',
    reward: '500 Health Points + Badge',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    joined: false
  },
  {
    id: '2',
    title: 'Daily Movement Challenge',
    description: 'Achieve 10,000 steps daily for improved cardiovascular health',
    duration: 21,
    participants: 1256,
    category: 'Fitness',
    difficulty: 'beginner',
    reward: '300 Health Points',
    startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    joined: true
  },
  {
    id: '3',
    title: 'Mindful Stress Management',
    description: 'Practice meditation and breathing exercises to reduce stress levels',
    duration: 14,
    participants: 892,
    category: 'Mental Health',
    difficulty: 'beginner',
    reward: '200 Health Points + Calm Badge',
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    joined: false
  }
];

const mockActionPlans: ActionPlan[] = [
  {
    id: '1',
    title: 'Daily Cardiovascular Care',
    description: 'Essential daily actions for heart health improvement',
    category: 'Cardiovascular',
    progress: 80,
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    tasks: [
      { id: '1a', title: 'Take morning omega-3 supplement', completed: true, priority: 'high', type: 'checkbox' },
      { 
        id: '1b', 
        title: 'Gentle Mobility Reset', 
        completed: false, 
        priority: 'medium', 
        type: 'activity_detail',
        activityDetails: {
          sets: 3,
          reps: '10,10,10',
          weight: '50',
          duration: '03:48',
          instructions: 'Focus on controlled movements and proper form. Keep your core engaged throughout.',
          benefits: ['Improves flexibility', 'Reduces muscle tension', 'Enhances blood circulation', 'Promotes relaxation']
        }
      },
      { id: '1c', title: 'Eat fiber-rich breakfast', completed: false, priority: 'high', type: 'checkbox' },
      { id: '1d', title: 'Monitor blood pressure', completed: true, priority: 'medium', type: 'checkbox' },
      { 
        id: '1e', 
        title: 'Drink water throughout day', 
        completed: false, 
        priority: 'low', 
        type: 'value_input',
        targetValue: 8,
        currentValue: 3,
        unit: 'glasses'
      }
    ]
  },
  {
    id: '2',
    title: 'Weekly Metabolic Health',
    description: 'Weekly routine for optimal metabolic function',
    category: 'Metabolic',
    progress: 60,
    dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    tasks: [
      { 
        id: '2a', 
        title: 'Strength Training Session', 
        completed: true, 
        priority: 'high', 
        type: 'activity_detail',
        activityDetails: {
          sets: 4,
          reps: '12,10,8,6',
          weight: '65-80lbs',
          duration: '45:00',
          instructions: 'Progressive overload with proper rest between sets. Focus on compound movements.',
          benefits: ['Builds muscle mass', 'Increases metabolism', 'Improves bone density', 'Enhances strength']
        }
      },
      { 
        id: '2b', 
        title: 'Daily steps target', 
        completed: false, 
        priority: 'medium', 
        type: 'value_input',
        targetValue: 10000,
        currentValue: 6500,
        unit: 'steps'
      },
      { id: '2c', title: 'Get 7+ hours sleep nightly', completed: true, priority: 'high', type: 'checkbox' },
      { 
        id: '2d', 
        title: 'Protein intake', 
        completed: false, 
        priority: 'low', 
        type: 'value_input',
        targetValue: 120,
        currentValue: 85,
        unit: 'grams'
      }
    ]
  }
];

export default function PlanPage() {
  const [activeTab, setActiveTab] = useState('actions');
  const [showNewGoalDialog, setShowNewGoalDialog] = useState(false);
  const [showNewGoal, setShowNewGoal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [taskValues, setTaskValues] = useState<{[key: string]: number}>({});
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: '',
    target: '',
    unit: '',
    deadline: '',
    priority: 'medium' as const
  });
  const { toast } = useToast();

  const createGoal = () => {
    if (!newGoal.title || !newGoal.target) return;
    
    toast({
      title: "Goal created!",
      description: `Your goal "${newGoal.title}" has been added to your plan.`,
    });
    
    setShowNewGoalDialog(false);
    setNewGoal({
      title: '',
      description: '',
      category: '',
      target: '',
      unit: '',
      deadline: '',
      priority: 'medium'
    });
  };

  const joinChallenge = (challengeId: string) => {
    toast({
      title: "Challenge joined!",
      description: "You've successfully joined the challenge. Good luck!",
    });
  };

  const toggleTask = (planId: string, taskId: string) => {
    toast({
      title: "Task updated",
      description: "Your progress has been saved.",
    });
  };

  const updateTaskValue = (taskId: string, value: number) => {
    setTaskValues(prev => ({ ...prev, [taskId]: value }));
    toast({
      title: "Progress updated",
      description: "Your value has been recorded.",
    });
  };

  const showActivityDetails = (task: any) => {
    setSelectedActivity(task);
  };

  const getTaskIcon = (task: any) => {
    if (task.type === 'value_input') {
      if (task.unit === 'glasses') return Droplets;
      if (task.unit === 'steps') return Footprints;
      if (task.unit === 'grams') return Utensils;
      return BarChart3;
    }
    if (task.type === 'activity_detail') return Activity;
    return task.completed ? CheckCircle : Circle;
  };

  const getCurrentValue = (task: any) => {
    return taskValues[task.id] ?? task.currentValue ?? 0;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'from-red-500 to-pink-500';
      case 'medium': return 'from-yellow-500 to-orange-500';
      case 'low': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-yellow-500 to-orange-500';
      case 'advanced': return 'from-red-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getDaysUntil = (date: Date) => {
    const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const isTaskCompleted = (task: any) => {
    if (task.type === 'value_input') {
      const current = getCurrentValue(task);
      return current >= task.targetValue;
    }
    return task.completed;
  };

  const getProgressPercent = (task: any) => {
    if (task.type === 'value_input') {
      const current = getCurrentValue(task);
      return Math.min((current / task.targetValue) * 100, 100);
    }
    return task.completed ? 100 : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/40 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/10">
      {/* Minimal Header */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/10 dark:border-gray-700/20 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <Target className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Your Plan Card */}
        <div className="mb-6">
          <Card className="bg-gradient-to-br from-teal-50/50 via-white/50 to-cyan-50/50 dark:from-teal-900/20 dark:via-gray-800/50 dark:to-cyan-900/20 border-0 shadow-xl backdrop-blur-lg">
            <CardContent className="p-6 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 rounded-lg"></div>
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-thin text-lg text-gray-900 dark:text-gray-100 mb-1">Your Plan Overview</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-light">Track your progress across goals, challenges & action plans</p>
                  </div>
                </div>
                <div className="relative">
                  <div className="w-20 h-20 relative">
                    <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 64 64">
                      <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="3" className="text-gray-200/30 dark:text-gray-700/30" />
                      <circle cx="32" cy="32" r="28" fill="none" stroke="url(#progressGradient)" strokeWidth="3" strokeDasharray={`${60 * 0.6} ${60}`} strokeLinecap="round" className="drop-shadow-sm" />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#14b8a6" />
                          <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-thin bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">60%</span>
                    </div>
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2">
                    <div className="w-2 h-2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full shadow-lg animate-pulse"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation with Glassmorphism */}
          <div className="flex justify-center">
            <TabsList className="bg-gradient-to-r from-white/80 to-purple-50/50 dark:from-gray-800/80 dark:to-purple-900/30 p-2 rounded-3xl backdrop-blur-lg border border-white/30 dark:border-gray-700/20 shadow-2xl">
              <TabsTrigger 
                value="goals" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-2xl px-6 py-3"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  <span className="font-medium">Goals</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="challenges" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-600 data-[state=active]:to-red-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-2xl px-6 py-3"
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  <span className="font-medium">Challenges</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="actions" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-cyan-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-2xl px-6 py-3"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  <span className="font-medium">Action Plans</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Goals Tab */}
          <TabsContent value="goals" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-thin bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Your Health Goals
                </h2>
                <p className="text-gray-600 dark:text-gray-400 font-light">Track and achieve your health objectives</p>
              </div>
              <Dialog open={showNewGoalDialog} onOpenChange={setShowNewGoalDialog}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg text-white font-medium transition-all duration-300 hover:shadow-xl hover:scale-105">
                    <Plus className="w-4 h-4 mr-2" />
                    New Goal
                  </Button>
                </DialogTrigger>
                <DialogContent className="backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/30 shadow-2xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-thin bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      Create New Goal
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 dark:text-gray-400 font-light">
                      Set a specific, measurable health goal to track your progress
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="goal-title" className="text-sm font-medium text-gray-700 dark:text-gray-300">Goal Title</Label>
                      <Input
                        id="goal-title"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Improve Cholesterol Levels"
                        className="bg-gradient-to-r from-gray-50 to-purple-50/50 dark:from-gray-700 dark:to-purple-900/20 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="goal-description" className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</Label>
                      <Textarea
                        id="goal-description"
                        value={newGoal.description}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Describe what you want to achieve..."
                        className="bg-gradient-to-r from-gray-50 to-purple-50/50 dark:from-gray-700 dark:to-purple-900/20 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="goal-category" className="text-sm font-medium text-gray-700 dark:text-gray-300">Category</Label>
                        <Select value={newGoal.category} onValueChange={(value) => setNewGoal(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger className="bg-gradient-to-r from-gray-50 to-purple-50/50 dark:from-gray-700 dark:to-purple-900/20 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 border-white/20 dark:border-gray-700/30">
                            <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                            <SelectItem value="fitness">Fitness</SelectItem>
                            <SelectItem value="nutrition">Nutrition</SelectItem>
                            <SelectItem value="mental-health">Mental Health</SelectItem>
                            <SelectItem value="lifestyle">Lifestyle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="goal-priority" className="text-sm font-medium text-gray-700 dark:text-gray-300">Priority</Label>
                        <Select value={newGoal.priority} onValueChange={(value: any) => setNewGoal(prev => ({ ...prev, priority: value }))}>
                          <SelectTrigger className="bg-gradient-to-r from-gray-50 to-purple-50/50 dark:from-gray-700 dark:to-purple-900/20 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 border-white/20 dark:border-gray-700/30">
                            <SelectItem value="high">High</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="low">Low</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="goal-target" className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Value</Label>
                        <Input
                          id="goal-target"
                          value={newGoal.target}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, target: e.target.value }))}
                          placeholder="e.g., 100"
                          className="bg-gradient-to-r from-gray-50 to-purple-50/50 dark:from-gray-700 dark:to-purple-900/20 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="goal-unit" className="text-sm font-medium text-gray-700 dark:text-gray-300">Unit</Label>
                        <Input
                          id="goal-unit"
                          value={newGoal.unit}
                          onChange={(e) => setNewGoal(prev => ({ ...prev, unit: e.target.value }))}
                          placeholder="e.g., mg/dL"
                          className="bg-gradient-to-r from-gray-50 to-purple-50/50 dark:from-gray-700 dark:to-purple-900/20 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="goal-deadline" className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Date</Label>
                      <Input
                        id="goal-deadline"
                        type="date"
                        value={newGoal.deadline}
                        onChange={(e) => setNewGoal(prev => ({ ...prev, deadline: e.target.value }))}
                        className="bg-gradient-to-r from-gray-50 to-purple-50/50 dark:from-gray-700 dark:to-purple-900/20 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={createGoal}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg text-white font-medium transition-all duration-300 hover:shadow-xl"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Create Goal
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setShowNewGoalDialog(false)}
                        className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockGoals.map((goal) => (
                <Card key={goal.id} className="bg-gradient-to-br from-white/90 via-white/80 to-purple-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-purple-900/20 border-0 shadow-xl backdrop-blur-lg hover:shadow-2xl transition-all duration-300 hover:scale-102">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-14 h-14 bg-gradient-to-br ${getPriorityColor(goal.priority)} rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <Target className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-xl font-medium text-gray-900 dark:text-gray-100 leading-tight break-words pr-2">
                            {goal.title}
                          </CardTitle>
                          <Badge variant={goal.priority === 'high' ? 'destructive' : goal.priority === 'medium' ? 'default' : 'secondary'} className="text-xs flex-shrink-0">
                            {goal.priority}
                          </Badge>
                        </div>
                        <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 text-xs">
                          {goal.category}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-5">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-light leading-relaxed break-words">
                      {goal.description}
                    </p>
                    
                    <div className="space-y-3 bg-purple-50/30 dark:bg-purple-900/10 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                        <span className="text-xl font-semibold text-purple-600 dark:text-purple-400">{goal.progress}%</span>
                      </div>
                      <div className="relative">
                        <div className="w-full bg-gray-200/60 dark:bg-gray-700/60 rounded-full h-3 shadow-inner">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full shadow-sm transition-all duration-500" 
                            style={{ width: `${goal.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-gray-200/50 dark:border-gray-700/30">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{formatDate(goal.deadline)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-medium">
                          <Clock className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{getDaysUntil(goal.deadline)} days left</span>
                        </div>
                      </div>
                      
                      <Button 
                        variant="outline"
                        size="sm"
                        className="w-full backdrop-blur-sm bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200/50 dark:border-purple-700/30 hover:shadow-lg transition-all duration-300"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Challenges Tab */}
          <TabsContent value="challenges" className="space-y-6">
            <div>
              <h2 className="text-2xl font-thin bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                Wellness Challenges
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light">Join community challenges and earn rewards</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockChallenges.map((challenge) => (
                <Card key={challenge.id} className="bg-gradient-to-br from-white/90 via-white/80 to-orange-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-orange-900/20 border-0 shadow-xl backdrop-blur-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getDifficultyColor(challenge.difficulty)} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">{challenge.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                              {challenge.category}
                            </Badge>
                            <Badge variant={challenge.difficulty === 'advanced' ? 'destructive' : challenge.difficulty === 'intermediate' ? 'default' : 'secondary'}>
                              {challenge.difficulty}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {challenge.joined && (
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                          Joined
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-light">{challenge.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 bg-gradient-to-br from-gray-50 to-orange-50/50 dark:from-gray-700/50 dark:to-orange-900/20 rounded-xl backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/20">
                        <div className="flex items-center gap-2">
                          <Timer className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{challenge.duration} days</span>
                        </div>
                      </div>
                      <div className="p-3 bg-gradient-to-br from-gray-50 to-orange-50/50 dark:from-gray-700/50 dark:to-orange-900/20 rounded-xl backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/20">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-orange-600" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{challenge.participants.toLocaleString()} joined</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/10 rounded-xl backdrop-blur-sm border border-yellow-200/30 dark:border-yellow-800/20">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Reward: {challenge.reward}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4" />
                        <span>Starts {formatDate(challenge.startDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 font-medium">
                        <Clock className="w-4 h-4" />
                        <span>{getDaysUntil(challenge.startDate)} days</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button 
                        onClick={() => joinChallenge(challenge.id)}
                        disabled={challenge.joined}
                        className={`w-full font-medium transition-all duration-300 hover:shadow-xl ${
                          challenge.joined 
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' 
                            : 'bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 shadow-lg text-white hover:scale-105'
                        }`}
                      >
                        {challenge.joined ? (
                          <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Joined
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Join Challenge
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Action Plans Tab */}
          <TabsContent value="actions" className="space-y-6">
            <div>
              <h2 className="text-2xl font-thin bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
                Action Plans
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-light">Complete daily and weekly tasks for optimal health</p>
            </div>

            <div className="space-y-6">
              {mockActionPlans.map((plan) => (
                <Card key={plan.id} className="bg-gradient-to-br from-white/90 via-white/80 to-blue-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-blue-900/20 border-0 shadow-xl backdrop-blur-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-lg font-medium text-gray-900 dark:text-gray-100">{plan.title}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                              {plan.category}
                            </Badge>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Due {formatDate(plan.dueDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-thin bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          {plan.progress}%
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Complete</div>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Progress value={plan.progress} className="h-2" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-light mb-4">{plan.description}</p>
                    
                    <div className="space-y-4">
                      {plan.tasks.map((task) => {
                        const TaskIcon = getTaskIcon(task);
                        const completed = isTaskCompleted(task);
                        const progressPercent = getProgressPercent(task);
                        
                        return (
                          <div 
                            key={task.id}
                            className="p-4 bg-gradient-to-br from-gray-50/80 to-blue-50/50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-xl backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/20 hover:shadow-lg transition-all duration-300"
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                completed ? 'bg-emerald-500' : task.type === 'value_input' ? 'bg-blue-500' : task.type === 'activity_detail' ? 'bg-purple-500' : 'bg-gray-400'
                              }`}>
                                <TaskIcon className="w-4 h-4 text-white" />
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <h4 className={`text-sm font-medium ${
                                    completed ? 'text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'
                                  }`}>
                                    {task.title}
                                  </h4>
                                  <Badge 
                                    variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                                    className="text-xs ml-2 flex-shrink-0"
                                  >
                                    {task.priority}
                                  </Badge>
                                </div>
                                
                                {/* Regular Checkbox Task */}
                                {task.type === 'checkbox' && (
                                  <div 
                                    onClick={() => toggleTask(plan.id, task.id)}
                                    className="cursor-pointer flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                                  >
                                    <span>{completed ? '✅ Completed' : '⏳ Click to mark complete'}</span>
                                  </div>
                                )}
                                
                                {/* Value Input Task */}
                                {task.type === 'value_input' && (
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        <span>Current:</span>
                                        <Input
                                          type="number"
                                          value={getCurrentValue(task)}
                                          onChange={(e) => updateTaskValue(task.id, parseInt(e.target.value) || 0)}
                                          className="w-20 h-8 text-center"
                                          max={(task.targetValue || 100) * 2}
                                          min={0}
                                        />
                                        <span>/ {task.targetValue || 100} {task.unit}</span>
                                      </div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="flex justify-between text-xs text-gray-500">
                                        <span>Progress</span>
                                        <span>{Math.round(progressPercent)}%</span>
                                      </div>
                                      <div className="w-full bg-gray-200/60 dark:bg-gray-700/60 rounded-full h-2">
                                        <div 
                                          className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-500" 
                                          style={{ width: `${progressPercent}%` }}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Activity Detail Task */}
                                {task.type === 'activity_detail' && (
                                  <div className="space-y-3">
                                    <div className="flex items-center gap-4 text-sm">
                                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">Sets:</span>
                                        <span>{task.activityDetails?.sets}</span>
                                      </div>
                                      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                        <span className="font-medium">Duration:</span>
                                        <span>{task.activityDetails?.duration}</span>
                                      </div>
                                    </div>
                                    <div className="flex gap-2">
                                      <Button
                                        onClick={() => showActivityDetails(task)}
                                        variant="outline"
                                        size="sm"
                                        className="flex-1 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 border-purple-200 dark:border-purple-800"
                                      >
                                        <Info className="w-4 h-4 mr-2" />
                                        View Details
                                      </Button>
                                      <Button
                                        onClick={() => toggleTask(plan.id, task.id)}
                                        variant={completed ? "default" : "outline"}
                                        size="sm"
                                        className={completed ? "bg-emerald-500 hover:bg-emerald-600" : ""}
                                      >
                                        {completed ? (
                                          <><CheckCircle className="w-4 h-4 mr-2" />Done</>
                                        ) : (
                                          <><Circle className="w-4 h-4 mr-2" />Mark Complete</>
                                        )}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Activity Detail Modal */}
      {selectedActivity && (
        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                {selectedActivity.title}
              </DialogTitle>
              <DialogDescription>
                Complete this activity to improve your health
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Activity Image */}
              <div className="relative bg-gradient-to-br from-gray-100 to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-xl h-48 flex items-center justify-center">
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Activity className="w-16 h-16 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Activity demonstration video</p>
                </div>
                
                {/* Play controls overlay */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2">
                  <Button size="sm" variant="outline" className="bg-white/80 dark:bg-gray-800/80">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="bg-white/80 dark:bg-gray-800/80">
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Duration overlay */}
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-2 py-1 rounded text-sm">
                  {selectedActivity.activityDetails?.duration || '03:48'}
                </div>
              </div>
              
              {/* Activity Stats */}
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedActivity.activityDetails?.sets || '03'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Sets</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedActivity.activityDetails?.weight || '50'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Weight</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedActivity.activityDetails?.reps || '10,10,10'}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rep</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {selectedActivity.activityDetails?.duration?.split(':')[0] || '90'}s
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Rest</div>
                </div>
              </div>
              
              {/* Instructions */}
              {selectedActivity.activityDetails?.instructions && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Instructions</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {selectedActivity.activityDetails.instructions}
                  </p>
                </div>
              )}
              
              {/* Benefits */}
              {selectedActivity.activityDetails?.benefits && (
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Benefits</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedActivity.activityDetails.benefits.map((benefit: string, index: number) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => {
                    toggleTask('', selectedActivity.id);
                    setSelectedActivity(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedActivity(null)}
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}