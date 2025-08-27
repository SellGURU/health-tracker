import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock,
  Calendar,
  CheckCircle,
  Target,
  MoreHorizontal,
  Plus,
  ArrowLeft,
  Bell,
  Edit3,
  RotateCcw
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  subtitle: string;
  category: 'Mobility' | 'Nutrition' | 'Mindfulness' | 'Sleep' | 'Exercise';
  duration?: string;
  timeWindow?: string;
  completed: boolean;
  progress?: number;
  timestamp: Date;
  createdFrom?: 'Deep Analysis' | 'Educational' | 'Manual';
  notes?: string;
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Morning Stretching Routine',
    subtitle: '15-minute full body stretch',
    category: 'Mobility',
    duration: '15 min',
    timeWindow: '7:00 - 9:00 AM',
    completed: true,
    progress: 100,
    timestamp: new Date(),
    createdFrom: 'Deep Analysis'
  },
  {
    id: '2',
    title: 'Take Vitamin D Supplement',
    subtitle: '2000 IU with breakfast',
    category: 'Nutrition',
    timeWindow: 'With breakfast',
    completed: true,
    timestamp: new Date(),
    createdFrom: 'Deep Analysis'
  },
  {
    id: '3',
    title: 'Mindful Breathing Exercise',
    subtitle: '10 minutes deep breathing',
    category: 'Mindfulness',
    duration: '10 min',
    timeWindow: '12:00 - 2:00 PM',
    completed: false,
    progress: 0,
    timestamp: new Date(),
    createdFrom: 'Educational'
  },
  {
    id: '4',
    title: 'Evening Walk',
    subtitle: '30-minute moderate pace walk',
    category: 'Exercise',
    duration: '30 min',
    timeWindow: '6:00 - 8:00 PM',
    completed: false,
    progress: 0,
    timestamp: new Date(),
    createdFrom: 'Deep Analysis'
  },
  {
    id: '5',
    title: 'Sleep Preparation',
    subtitle: 'No screens 1 hour before bed',
    category: 'Sleep',
    timeWindow: '9:00 PM onwards',
    completed: false,
    timestamp: new Date(),
    createdFrom: 'Manual'
  }
];

const categoryColors = {
  'Mobility': 'bg-blue-100 text-blue-800',
  'Nutrition': 'bg-green-100 text-green-800',
  'Mindfulness': 'bg-purple-100 text-purple-800',
  'Sleep': 'bg-indigo-100 text-indigo-800',
  'Exercise': 'bg-orange-100 text-orange-800'
};

export default function ActionPlanPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [completedCount, setCompletedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const completed = tasks.filter(task => task.completed).length;
    const total = tasks.length;
    setCompletedCount(completed);
    setTotalCount(total);
    setProgressPercentage(total > 0 ? (completed / total) * 100 : 0);
  }, [tasks]);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed, progress: !task.completed ? 100 : 0 }
        : task
    ));
  };

  const handleSnooze = (taskId: string) => {
    toast({
      title: "Task Snoozed",
      description: "Task will reappear in 1 hour",
    });
  };

  const handleReschedule = (taskId: string) => {
    toast({
      title: "Reschedule Task",
      description: "Opening reschedule options...",
    });
  };

  const handleDoneForToday = () => {
    toast({
      title: "Great work!",
      description: "You've completed your daily action plan. Rest well!",
    });
  };

  const CircularProgress = ({ percentage, size = 160 }: { percentage: number; size?: number }) => {
    const radius = (size - 20) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="text-blue-600 transition-all duration-500 ease-in-out"
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {Math.round(percentage)}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {completedCount} / {totalCount}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Today's Action Plan</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Plus className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Ring */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-8">
        <div className="flex justify-center">
          <CircularProgress percentage={progressPercentage} />
        </div>
        <div className="text-center mt-4">
          <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {completedCount === totalCount && totalCount > 0 
              ? "Excellent work! All tasks completed!" 
              : `${totalCount - completedCount} tasks remaining`
            }
          </p>
        </div>
      </div>

      {/* Tasks List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {tasks.map((task, index) => (
          <Card 
            key={task.id} 
            className={`transition-all duration-300 ${
              task.completed ? 'opacity-75 scale-98' : 'hover:shadow-md'
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={() => toggleTask(task.id)}
                  className="mt-1"
                />
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                        {task.title}
                      </h3>
                      <p className={`text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-600 dark:text-gray-400'}`}>
                        {task.subtitle}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={categoryColors[task.category]} variant="secondary">
                        {task.category}
                      </Badge>
                      {task.createdFrom && (
                        <Badge variant="outline" className="text-xs">
                          {task.createdFrom === 'Deep Analysis' && 'Created from Deep Analysis'}
                          {task.createdFrom === 'Educational' && 'From Educational'}
                          {task.createdFrom === 'Manual' && 'Manual'}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-4">
                      {task.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {task.duration}
                        </div>
                      )}
                      {task.timeWindow && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {task.timeWindow}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {task.progress !== undefined && task.progress > 0 && task.progress < 100 && (
                        <div className="flex items-center gap-2">
                          <Progress value={task.progress} className="w-16 h-2" />
                          <span>{task.progress}%</span>
                        </div>
                      )}
                      
                      {!task.completed && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSnooze(task.id)}
                            className="h-6 px-2"
                          >
                            <Clock className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReschedule(task.id)}
                            className="h-6 px-2"
                          >
                            <RotateCcw className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sticky Bottom Summary Bar */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {completedCount} of {totalCount} completed
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {progressPercentage === 100 ? 'All done for today!' : `${Math.round(progressPercentage)}% progress`}
              </div>
            </div>
          </div>
          
          <Button 
            onClick={handleDoneForToday}
            className="bg-blue-600 hover:bg-blue-700"
            disabled={progressPercentage < 100}
          >
            {progressPercentage === 100 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Done for Today
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}