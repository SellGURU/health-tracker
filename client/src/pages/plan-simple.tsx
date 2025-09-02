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
  Calendar,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";

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

export default function Plan() {
  const [taskValues, setTaskValues] = useState<Record<string, number>>({});
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("today");
  const [selectedWeek, setSelectedWeek] = useState(0);
  const { toast } = useToast();

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
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

          <TabsContent value="today" className="space-y-6">
            {/* Today's Tasks Content */}
            <div className="space-y-4">
              {todaysTasks.map((task) => {
                const TaskIcon = getTaskIcon(task);
                const completed = task.completed;
                const progressPercent = getProgressPercent(task);
                
                return (
                  <Card 
                    key={task.id}
                    className="bg-gradient-to-br from-white/90 to-green-50/60 dark:from-gray-800/90 dark:to-green-900/20 border border-green-200/30 dark:border-green-700/20 shadow-lg backdrop-blur-sm"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          completed ? 'bg-emerald-500' : task.type === 'value_input' ? 'bg-blue-500' : 'bg-gray-400'
                        }`}>
                          <TaskIcon className="w-5 h-5 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className={`text-sm font-medium ${
                              completed ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'
                            }`}>
                              {task.title}
                            </h4>
                            <Badge 
                              variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}
                              className="text-xs flex-shrink-0"
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
                              className={`w-full ${
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
                              <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3">
                                  <Input
                                    type="number"
                                    placeholder={`Enter ${task.unit || 'value'}`}
                                    value={taskValues[task.id] || task.currentValue || ''}
                                    onChange={(e) => updateTaskValue(task.id, parseFloat(e.target.value) || 0)}
                                    className="flex-1 h-9 text-sm"
                                    disabled={completed}
                                  />
                                  <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                                    Target: {task.targetValue} {task.unit}
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => toggleTask('today', task.id)}
                                  className="w-full"
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
                    </CardContent>
                  </Card>
                );
              })}
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
                Previous
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
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Weekly Calendar Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
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
                    <CardHeader className="pb-2 text-center">
                      <div className={`text-sm font-medium ${
                        isCurrentDay ? 'text-green-700 dark:text-green-300' : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {formatDateKey(dateKey)}
                      </div>
                      {isCurrentDay && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs">
                          Today
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-3 pb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {dayTasks.length} tasks
                        </span>
                        <span className={`text-xs font-medium ${
                          completionRate === 100 ? 'text-green-600' : completionRate > 50 ? 'text-yellow-600' : 'text-gray-500'
                        }`}>
                          {completionRate}%
                        </span>
                      </div>
                      
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            completionRate === 100 ? 'bg-green-500' : completionRate > 50 ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                      
                      <div className="space-y-1">
                        {dayTasks.slice(0, 2).map((task) => (
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
                        {dayTasks.length > 2 && (
                          <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-1">
                            +{dayTasks.length - 2} more
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