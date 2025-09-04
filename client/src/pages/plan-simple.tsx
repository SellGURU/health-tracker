import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle,
  Circle,
  Activity,
  Heart,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  Apple,
  Pill,
  Dumbbell,
  Users,
  ClipboardList
} from "lucide-react";

// Calendar-based tasks with detailed categories
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
          title: 'Mediterranean Diet',
          category: 'Diet',
          completed: false,
          details: {
            instruction: 'Focus on olive oil, fish, vegetables, and whole grains',
            total_macros: { fats: 65, carbs: 120, protein: 85 },
            notes: 'Include 2 servings of fish this week'
          }
        },
        {
          id: `${dateKey}-2`,
          title: 'Vitamin D3',
          category: 'Supplement',
          completed: true,
          details: {
            dose: '2000 IU',
            instruction: 'Take with fatty meal for better absorption',
            notes: 'Take in the morning'
          }
        },
        {
          id: `${dateKey}-3`,
          title: 'Sleep Quality',
          category: 'Lifestyle',
          completed: false,
          details: {
            instruction: 'Maintain consistent sleep schedule',
            value: 8,
            unit: 'hours',
            notes: 'No screens 1 hour before bed'
          }
        },
        {
          id: `${dateKey}-4`,
          title: 'Full Body Strength Training',
          category: 'Activity',
          completed: false,
          details: {
            instruction: 'Focus on compound movements',
            sections: [
              {
                section: 'Warm-Up',
                sets: '1',
                type: 'Circuit',
                exercises: [
                  {
                    title: 'Dynamic Stretching',
                    description: 'Prepare muscles for workout',
                    instruction: 'Hold each stretch for 30 seconds',
                    reps: '5 minutes',
                    exercise_filters: { type: 'Flexibility', level: 'Beginner' },
                    exercise_location: ['Home', 'Gym']
                  }
                ]
              },
              {
                section: 'Main',
                sets: '3',
                type: 'Superset',
                exercises: [
                  {
                    title: 'Squats',
                    description: 'Lower body compound movement',
                    instruction: 'Keep knees aligned with toes',
                    reps: '12',
                    rest: '60',
                    weight: 'bodyweight',
                    exercise_filters: { type: 'Strength', level: 'Intermediate', muscle: 'Glutes', equipment: 'Body Only' },
                    exercise_location: ['Home', 'Gym']
                  }
                ]
              }
            ],
            activity_location: ['Home', 'Gym'],
            notes: 'Focus on form over weight'
          }
        },
        {
          id: `${dateKey}-5`,
          title: 'Stress Level Check-in',
          category: 'Test',
          completed: false,
          details: {
            questions_count: 5,
            estimated_time: '2 minutes'
          }
        }
      ];
    } else if (i < 0) { // Past days - some completed tasks
      tasks[dateKey] = [
        {
          id: `${dateKey}-1`,
          title: 'Anti-Inflammatory Diet',
          category: 'Diet',
          completed: Math.random() > 0.3,
          details: {
            instruction: 'Reduce processed foods, increase omega-3 rich foods',
            total_macros: { fats: 70, carbs: 100, protein: 90 }
          }
        },
        {
          id: `${dateKey}-2`,
          title: 'Omega-3',
          category: 'Supplement',
          completed: Math.random() > 0.2,
          details: {
            dose: '1000 mg',
            instruction: 'Take with dinner'
          }
        },
        {
          id: `${dateKey}-3`,
          title: 'Morning Walk',
          category: 'Activity',
          completed: Math.random() > 0.4,
          details: {
            instruction: 'Moderate pace outdoor walk',
            sections: [
              {
                section: 'Main',
                sets: '1',
                type: 'Cardio',
                exercises: [{
                  title: 'Brisk Walking',
                  description: 'Cardiovascular exercise',
                  instruction: 'Maintain steady pace',
                  reps: '30 minutes'
                }]
              }
            ]
          }
        }
      ];
    } else { // Future days - upcoming tasks
      tasks[dateKey] = [
        {
          id: `${dateKey}-1`,
          title: 'Balanced Nutrition',
          category: 'Diet',
          completed: false,
          details: {
            instruction: 'Include all food groups in appropriate portions',
            total_macros: { fats: 60, carbs: 130, protein: 80 }
          }
        },
        {
          id: `${dateKey}-2`,
          title: 'Hydration Check',
          category: 'Lifestyle',
          completed: false,
          details: {
            instruction: 'Track daily water intake',
            value: 8,
            unit: 'glasses'
          }
        },
        {
          id: `${dateKey}-3`,
          title: 'Weekly Assessment',
          category: 'Test',
          completed: false,
          details: {
            questions_count: 10,
            estimated_time: '5 minutes'
          }
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
  const [selectedDate, setSelectedDate] = useState(todayKey);
  const { toast } = useToast();

  const formatDateKey = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDateRange = () => {
    const today = new Date();
    const dates = [];
    
    // Get 7 days before, today, and 7 days after (15 total days)
    for (let i = -7; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        key: date.toISOString().split('T')[0],
        date: date,
        day: date.getDate(),
        weekday: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }
    return dates;
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
    switch (task.category) {
      case 'Diet': return Apple;
      case 'Supplement': return Pill;
      case 'Lifestyle': return Users;
      case 'Activity': return Dumbbell;
      case 'Test': return ClipboardList;
      default: return Circle;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Diet': return 'bg-green-500';
      case 'Supplement': return 'bg-blue-500';
      case 'Lifestyle': return 'bg-purple-500';
      case 'Activity': return 'bg-orange-500';
      case 'Test': return 'bg-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getProgressPercent = (task: any) => {
    if (task.category === 'Lifestyle' && task.details.value) {
      const current = taskValues[task.id] || 0;
      return Math.min((current / task.details.value) * 100, 100);
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

  const renderTaskDetails = (task: any) => {
    const { category, details } = task;
    
    switch (category) {
      case 'Diet':
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">{details.instruction}</p>
            {details.total_macros && (
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded">
                  <div className="font-medium text-green-800 dark:text-green-300">Fats</div>
                  <div className="text-green-600 dark:text-green-400">{details.total_macros.fats}g</div>
                </div>
                <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded">
                  <div className="font-medium text-orange-800 dark:text-orange-300">Carbs</div>
                  <div className="text-orange-600 dark:text-orange-400">{details.total_macros.carbs}g</div>
                </div>
                <div className="bg-blue-100 dark:bg-blue-900/20 p-2 rounded">
                  <div className="font-medium text-blue-800 dark:text-blue-300">Protein</div>
                  <div className="text-blue-600 dark:text-blue-400">{details.total_macros.protein}g</div>
                </div>
              </div>
            )}
            {details.notes && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">{details.notes}</p>
            )}
          </div>
        );
        
      case 'Supplement':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-medium text-blue-600 dark:text-blue-400">Dose:</span>
              <span className="text-gray-700 dark:text-gray-300">{details.dose}</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{details.instruction}</p>
            {details.notes && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">{details.notes}</p>
            )}
          </div>
        );
        
      case 'Lifestyle':
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">{details.instruction}</p>
            {details.value && (
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    placeholder={`Enter ${details.unit || 'value'}`}
                    value={taskValues[task.id] || ''}
                    onChange={(e) => updateTaskValue(task.id, parseFloat(e.target.value) || 0)}
                    className="flex-1 h-9 text-sm"
                    disabled={task.completed}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    Target: {details.value} {details.unit}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercent(task)}%` }}
                  />
                </div>
              </div>
            )}
            {details.notes && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">{details.notes}</p>
            )}
          </div>
        );
        
      case 'Activity':
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">{details.instruction}</p>
            {details.sections && details.sections.map((section: any, index: number) => (
              <div key={index} className="border border-orange-200 dark:border-orange-700/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-medium text-orange-800 dark:text-orange-300">{section.section}</h5>
                  <Badge variant="secondary" className="text-xs">{section.sets} sets</Badge>
                </div>
                {section.exercises.map((exercise: any, exIndex: number) => (
                  <div key={exIndex} className="ml-2 space-y-1">
                    <div className="font-medium text-sm">{exercise.title}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">{exercise.description}</div>
                    <div className="text-xs">
                      {exercise.reps && <span className="mr-3">Reps: {exercise.reps}</span>}
                      {exercise.rest && <span className="mr-3">Rest: {exercise.rest}s</span>}
                      {exercise.weight && <span>Weight: {exercise.weight}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
            {details.activity_location && (
              <div className="flex gap-1">
                {details.activity_location.map((location: string) => (
                  <Badge key={location} variant="outline" className="text-xs">{location}</Badge>
                ))}
              </div>
            )}
            {details.notes && (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic">{details.notes}</p>
            )}
          </div>
        );
        
      case 'Test':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-4 text-sm">
              {details.questions_count && (
                <div className="flex items-center gap-1">
                  <span className="font-medium text-pink-600 dark:text-pink-400">Questions:</span>
                  <span className="text-gray-700 dark:text-gray-300">{details.questions_count}</span>
                </div>
              )}
              {details.estimated_time && (
                <div className="flex items-center gap-1">
                  <span className="font-medium text-pink-600 dark:text-pink-400">Time:</span>
                  <span className="text-gray-700 dark:text-gray-300">{details.estimated_time}</span>
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
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
                          completed ? 'bg-emerald-500' : getCategoryColor(task.category)
                        }`}>
                          <TaskIcon className="w-5 h-5 text-white" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="mb-3">
                            <h4 className={`text-sm font-medium ${
                              completed ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'
                            }`}>
                              {task.title}
                            </h4>
                            <Badge variant="outline" className="text-xs mt-1">{task.category}</Badge>
                          </div>
                          
                          {/* Task Details */}
                          <div className="mb-4">
                            {renderTaskDetails(task)}
                          </div>
                          
                          {/* Task Action Button */}
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
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            {/* Date Picker - Horizontal Row */}
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4 text-center">
                Select a Date
              </h3>
              <div className="flex gap-2 overflow-x-auto pb-2 justify-center">
                {getDateRange().map((dateInfo) => {
                  const isCurrentDay = isToday(dateInfo.key);
                  const isSelected = selectedDate === dateInfo.key;
                  const dayTasks = calendarTasks[dateInfo.key] || [];
                  const completionRate = getTaskCompletionRate(dayTasks);
                  
                  return (
                    <button
                      key={dateInfo.key}
                      onClick={() => setSelectedDate(dateInfo.key)}
                      className={`flex-shrink-0 p-3 rounded-2xl border-2 transition-all duration-200 min-w-[80px] ${
                        isSelected
                          ? isCurrentDay
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : isCurrentDay
                            ? 'border-green-300 bg-green-50/50 dark:bg-green-900/10 hover:border-green-400'
                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="text-center">
                        <div className={`text-2xl font-bold ${
                          isSelected
                            ? isCurrentDay
                              ? 'text-green-700 dark:text-green-300'
                              : 'text-blue-700 dark:text-blue-300'
                            : isCurrentDay
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-gray-800 dark:text-gray-200'
                        }`}>
                          {dateInfo.day}
                        </div>
                        <div className={`text-xs font-medium ${
                          isSelected
                            ? isCurrentDay
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-blue-600 dark:text-blue-400'
                            : isCurrentDay
                              ? 'text-green-500 dark:text-green-500'
                              : 'text-gray-500 dark:text-gray-400'
                        }`}>
                          {dateInfo.weekday}
                        </div>
                        {isCurrentDay && (
                          <div className="text-xs font-medium text-green-600 dark:text-green-400 mt-1">
                            Today
                          </div>
                        )}
                        {/* Progress indicator */}
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                            <div 
                              className={`h-1 rounded-full transition-all duration-300 ${
                                completionRate === 100 ? 'bg-green-500' : completionRate > 50 ? 'bg-yellow-500' : 'bg-gray-400'
                              }`}
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Date Tasks */}
            <div className="space-y-4">
              {(() => {
                const selectedDayTasks = calendarTasks[selectedDate] || [];
                const completionRate = getTaskCompletionRate(selectedDayTasks);
                const isCurrentDay = isToday(selectedDate);
                const selectedDateObj = new Date(selectedDate + 'T00:00:00');
                
                return (
                  <>
                    {/* Selected Day Header */}
                    <div className="mb-6">
                      <h4 className={`text-xl font-medium text-center mb-4 ${
                        isCurrentDay ? 'text-green-700 dark:text-green-300' : 'text-gray-800 dark:text-gray-200'
                      }`}>
                        {selectedDateObj.toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                        {isCurrentDay && (
                          <span className="ml-2 text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 px-2 py-1 rounded">
                            Today
                          </span>
                        )}
                      </h4>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            completionRate === 100 ? 'bg-green-500' : completionRate > 50 ? 'bg-yellow-500' : 'bg-gray-400'
                          }`}
                          style={{ width: `${completionRate}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Tasks for selected day */}
                    <div className="space-y-4">
                      {selectedDayTasks.map((task) => {
                        const TaskIcon = getTaskIcon(task);
                        const completed = task.completed;
                        const progressPercent = getProgressPercent(task);
                        
                        return (
                          <Card 
                            key={task.id}
                            className={`${isCurrentDay 
                              ? 'bg-gradient-to-br from-white/90 to-green-50/60 dark:from-gray-800/90 dark:to-green-900/20 border-green-200/30 dark:border-green-700/20' 
                              : 'bg-gradient-to-br from-white/90 to-gray-50/60 dark:from-gray-800/90 dark:to-gray-700/60 border-gray-200/30 dark:border-gray-700/20'
                            } border shadow-lg backdrop-blur-sm`}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                  completed ? 'bg-emerald-500' : getCategoryColor(task.category)
                                }`}>
                                  <TaskIcon className="w-5 h-5 text-white" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <div className="mb-3">
                                    <h5 className={`text-sm font-medium ${
                                      completed ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'
                                    }`}>
                                      {task.title}
                                    </h5>
                                    <Badge variant="outline" className="text-xs mt-1">{task.category}</Badge>
                                  </div>
                                  
                                  {/* Task Details */}
                                  <div className="mb-4">
                                    {renderTaskDetails(task)}
                                  </div>
                                  
                                  {/* Task Action Button */}
                                  <Button
                                    variant={completed ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => toggleTask(selectedDate, task.id)}
                                    className={`w-full ${
                                      completed 
                                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                                        : 'hover:bg-green-50 dark:hover:bg-green-900/20'
                                    }`}
                                  >
                                    {completed ? <CheckCircle className="w-4 h-4 mr-2" /> : <Circle className="w-4 h-4 mr-2" />}
                                    {completed ? 'Completed' : 'Mark Complete'}
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </>
                );
              })()}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}