import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle,
  Circle,
  Activity,
  Heart,
  Droplets,
  Footprints,
  Utensils,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

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

// Calendar-based tasks - each date has its own tasks
const generateCalendarTasks = () => {
  const tasks: Record<string, any[]> = {};
  const today = new Date();
  
  // Generate tasks for past 7 days, today, and next 7 days
  for (let i = -7; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateKey = date.toISOString().split('T')[0];
    
    if (i === 0) { // Today's tasks
      tasks[dateKey] = [
        {
          id: `${dateKey}-1`,
          title: 'Take morning medications',
          completed: true,
          priority: 'high' as const,
          type: 'checkbox' as const
        },
        {
          id: `${dateKey}-2`,
          title: 'Record blood pressure',
          completed: false,
          priority: 'high' as const,
          type: 'value_input' as const,
          targetValue: 120,
          currentValue: 0,
          unit: 'mmHg'
        },
        {
          id: `${dateKey}-3`,
          title: 'Drink 8 glasses of water',
          completed: false,
          priority: 'medium' as const,
          type: 'value_input' as const,
          targetValue: 8,
          currentValue: 0,
          unit: 'glasses'
        },
        {
          id: `${dateKey}-4`,
          title: 'Take evening supplements',
          completed: false,
          priority: 'medium' as const,
          type: 'checkbox' as const
        }
      ];
    } else if (i < 0) { // Past days - some completed tasks
      tasks[dateKey] = [
        {
          id: `${dateKey}-1`,
          title: 'Take morning medications',
          completed: true,
          priority: 'high' as const,
          type: 'checkbox' as const
        },
        {
          id: `${dateKey}-2`,
          title: 'Record blood pressure',
          completed: Math.random() > 0.3,
          priority: 'high' as const,
          type: 'value_input' as const,
          targetValue: 120,
          currentValue: Math.random() > 0.5 ? 118 : 0,
          unit: 'mmHg'
        },
        {
          id: `${dateKey}-3`,
          title: '30-minute cardio workout',
          completed: Math.random() > 0.4,
          priority: 'medium' as const,
          type: 'activity_detail' as const,
          activityDetails: {
            duration: '30 minutes',
            instructions: 'Maintain moderate intensity'
          }
        }
      ];
    } else { // Future days - upcoming tasks
      tasks[dateKey] = [
        {
          id: `${dateKey}-1`,
          title: 'Take morning medications',
          completed: false,
          priority: 'high' as const,
          type: 'checkbox' as const
        },
        {
          id: `${dateKey}-2`,
          title: 'Record blood pressure',
          completed: false,
          priority: 'high' as const,
          type: 'value_input' as const,
          targetValue: 120,
          currentValue: 0,
          unit: 'mmHg'
        },
        {
          id: `${dateKey}-3`,
          title: 'Weekly health check',
          completed: false,
          priority: 'medium' as const,
          type: 'checkbox' as const
        }
      ];
    }
  }
  
  return tasks;
};

const calendarTasks = generateCalendarTasks();
const todayKey = new Date().toISOString().split('T')[0];
const todaysTasks = calendarTasks[todayKey] || [];

const mockActionPlans: ActionPlan[] = [
  {
    id: '1',
    title: 'Cardiovascular Health Plan',
    description: 'Complete 4-week cardiovascular improvement program',
    category: 'Cardiovascular',
    progress: 75,
    dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    tasks: [
      {
        id: '1',
        title: '30-minute cardio workout',
        completed: false,
        priority: 'high',
        type: 'activity_detail',
        activityDetails: {
          sets: 1,
          duration: '30 minutes',
          instructions: 'Maintain moderate intensity throughout. Monitor heart rate between 120-150 bpm.',
          benefits: ['Improves circulation', 'Strengthens heart muscle', 'Reduces blood pressure']
        }
      },
      {
        id: '2',
        title: 'Weekly health assessment',
        completed: true,
        priority: 'medium',
        type: 'checkbox'
      },
      {
        id: '3',
        title: 'Track weekly weight',
        completed: false,
        priority: 'medium',
        type: 'value_input',
        targetValue: 165,
        currentValue: 0,
        unit: 'lbs'
      }
    ]
  },
  {
    id: '2',
    title: 'Nutrition Optimization',
    description: '6-week nutrition plan for optimal health markers',
    category: 'Nutrition',
    progress: 45,
    dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000),
    tasks: [
      {
        id: '1',
        title: 'Meal prep for the week',
        completed: false,
        priority: 'high',
        type: 'checkbox'
      },
      {
        id: '2',
        title: 'Track daily protein intake',
        completed: false,
        priority: 'medium',
        type: 'value_input',
        targetValue: 100,
        currentValue: 0,
        unit: 'grams'
      }
    ]
  }
];

export default function Plan() {
  const [taskValues, setTaskValues] = useState<Record<string, number>>({});
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("today");
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = current week, -1 = previous, +1 = next
  const { toast } = useToast();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateKey = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getWeekDates = (weekOffset: number) => {
    const today = new Date();
    const currentDay = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - currentDay + (weekOffset * 7));
    
    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      weekDates.push(date.toISOString().split('T')[0]);
    }
    return weekDates;
  };

  const isToday = (dateKey: string) => {
    return dateKey === todayKey;
  };

  const getTaskCompletionRate = (tasks: any[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(task => task.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const getTaskIcon = (task: any) => {
    if (task.type === 'value_input') return Activity;
    if (task.type === 'activity_detail') return Heart;
    return Circle;
  };

  const isTaskCompleted = (task: any) => {
    return task.completed;
  };

  const getProgressPercent = (task: any) => {
    if (task.type === 'value_input' && task.targetValue) {
      const current = taskValues[task.id] || task.currentValue || 0;
      return Math.min((current / task.targetValue) * 100, 100);
    }
    return task.completed ? 100 : 0;
  };

  const toggleTask = (planId: string, taskId: string) => {
    toast({
      title: "Task Updated",
      description: "Your progress has been saved.",
    });
  };

  const updateTaskValue = (taskId: string, value: number) => {
    setTaskValues(prev => ({ ...prev, [taskId]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-indigo-900/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-thin bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Action Plans
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-light">Complete daily tasks and track your calendar</p>
        </div>

        {/* Tabs for Today vs Calendar */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="today" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Today's Tasks
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Calendar View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="today" className="space-y-8">
            {/* Today's Tasks Content */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
                Today's Tasks
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {todaysTasks.map((task) => {
              const TaskIcon = getTaskIcon(task);
              const completed = task.completed;
              const progressPercent = getProgressPercent(task);
              
              return (
                <div 
                  key={task.id}
                  className="p-4 bg-gradient-to-br from-white/90 via-white/80 to-green-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-green-900/20 rounded-xl backdrop-blur-sm border border-green-200/30 dark:border-green-700/20 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      completed ? 'bg-emerald-500' : task.type === 'value_input' ? 'bg-blue-500' : 'bg-gray-400'
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
                        <Button
                          variant={completed ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleTask('today', task.id)}
                          className={`transition-all duration-300 ${
                            completed 
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                              : 'hover:bg-green-50 dark:hover:bg-green-900/20'
                          }`}
                        >
                          {completed ? <CheckCircle className="w-4 h-4 mr-2" /> : <Circle className="w-4 h-4 mr-2" />}
                          {completed ? 'Completed' : 'Mark Complete'}
                        </Button>
                      )}

                      {/* Value Input Task */}
                      {task.type === 'value_input' && (
                        <div className="space-y-3">
                          <div className="flex items-center gap-3">
                            <Input
                              type="number"
                              placeholder={`Enter ${task.unit || 'value'}`}
                              value={taskValues[task.id] || task.currentValue || ''}
                              onChange={(e) => updateTaskValue(task.id, parseFloat(e.target.value) || 0)}
                              className="w-32 h-8 text-sm"
                              disabled={completed}
                            />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Target: {task.targetValue} {task.unit}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => toggleTask('today', task.id)}
                              className="ml-auto"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Save
                            </Button>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
                })}
              </div>
            </div>

            {/* Long-term Action Plans for Today Tab */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse"></div>
                Long-term Plans
              </h3>
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
                        {plan.tasks.slice(0, 2).map((task) => {
                          const TaskIcon = getTaskIcon(task);
                          const completed = isTaskCompleted(task);
                          
                          return (
                            <div 
                              key={task.id}
                              className="p-3 bg-gradient-to-br from-gray-50/80 to-blue-50/50 dark:from-gray-700/50 dark:to-blue-900/20 rounded-lg backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/20"
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  completed ? 'bg-emerald-500' : 'bg-gray-400'
                                }`}>
                                  <TaskIcon className="w-3 h-3 text-white" />
                                </div>
                                <span className={`text-sm ${
                                  completed ? 'text-gray-500 line-through' : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {task.title}
                                </span>
                                <Badge 
                                  variant={task.priority === 'high' ? 'destructive' : 'secondary'}
                                  className="text-xs ml-auto"
                                >
                                  {task.priority}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            {/* Calendar Navigation */}
            <div className="flex items-center justify-between mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(selectedWeek - 1)}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous Week
              </Button>
              
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {selectedWeek === 0 ? 'This Week' : selectedWeek > 0 ? `${selectedWeek} Week${selectedWeek > 1 ? 's' : ''} Ahead` : `${Math.abs(selectedWeek)} Week${Math.abs(selectedWeek) > 1 ? 's' : ''} Ago`}
                </h3>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedWeek(selectedWeek + 1)}
                className="flex items-center gap-2"
              >
                Next Week
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Weekly Calendar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
              {getWeekDates(selectedWeek).map((dateKey) => {
                const dayTasks = calendarTasks[dateKey] || [];
                const completionRate = getTaskCompletionRate(dayTasks);
                const isCurrentDay = isToday(dateKey);
                
                return (
                  <Card 
                    key={dateKey} 
                    className={`${isCurrentDay 
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-700' 
                      : 'bg-gradient-to-br from-white/90 to-gray-50/60 dark:from-gray-800/90 dark:to-gray-700/60'
                    } border shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300`}
                  >
                    <CardHeader className="pb-2">
                      <div className="text-center">
                        <div className={`text-sm font-medium ${
                          isCurrentDay ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {formatDateKey(dateKey)}
                        </div>
                        {isCurrentDay && (
                          <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            Today
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {dayTasks.length} tasks
                        </span>
                        <span className={`text-xs font-medium ${
                          completionRate === 100 ? 'text-green-600' : completionRate > 50 ? 'text-yellow-600' : 'text-gray-500'
                        }`}>
                          {completionRate}% done
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            completionRate === 100 ? 'bg-green-500' : completionRate > 50 ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        {dayTasks.slice(0, 3).map((task) => (
                          <div 
                            key={task.id}
                            className={`text-xs p-2 rounded-lg ${
                              task.completed 
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 line-through' 
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {task.title}
                          </div>
                        ))}
                        {dayTasks.length > 3 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                            +{dayTasks.length - 3} more
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
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
                <Heart className="w-5 h-5 text-red-500" />
                {selectedActivity.title}
              </DialogTitle>
              <DialogDescription>
                Activity details and instructions
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Duration and Sets */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration</div>
                  <div className="text-lg font-semibold text-blue-600">{selectedActivity.activityDetails?.duration || 'N/A'}</div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">Sets</div>
                  <div className="text-lg font-semibold text-green-600">{selectedActivity.activityDetails?.sets || 'N/A'}</div>
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