import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  CheckCircle,
  Circle,
  Activity,
  Heart,
  Droplets,
  Footprints,
  Utensils,
  X
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

// Today's Daily Tasks
const todaysTasks = [
  {
    id: '1',
    title: 'Take morning medications',
    completed: true,
    priority: 'high' as const,
    type: 'checkbox' as const
  },
  {
    id: '2',
    title: 'Record blood pressure',
    completed: false,
    priority: 'high' as const,
    type: 'value_input' as const,
    targetValue: 120,
    currentValue: 0,
    unit: 'mmHg'
  },
  {
    id: '3',
    title: 'Drink 8 glasses of water',
    completed: false,
    priority: 'medium' as const,
    type: 'value_input' as const,
    targetValue: 8,
    currentValue: 0,
    unit: 'glasses'
  },
  {
    id: '4',
    title: 'Take evening supplements',
    completed: false,
    priority: 'medium' as const,
    type: 'checkbox' as const
  }
];

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
  const { toast } = useToast();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
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
          <p className="text-gray-600 dark:text-gray-400 font-light">Complete daily tasks and long-term action plans</p>
        </div>

        {/* Today's Tasks */}
        <div className="mb-8">
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

        {/* Long-term Action Plans */}
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
                                <Button
                                  variant={completed ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => toggleTask(plan.id, task.id)}
                                  className={`transition-all duration-300 ${
                                    completed 
                                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
                                      : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
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
                                      onClick={() => toggleTask(plan.id, task.id)}
                                      className="ml-auto"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Save
                                    </Button>
                                  </div>
                                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div 
                                      className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full transition-all duration-300"
                                      style={{ width: `${progressPercent}%` }}
                                    />
                                  </div>
                                </div>
                              )}

                              {/* Activity Detail Task */}
                              {task.type === 'activity_detail' && (
                                <div className="space-y-3">
                                  <div className="flex gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setSelectedActivity(task)}
                                      className="flex-1"
                                    >
                                      <Activity className="w-4 h-4 mr-2" />
                                      View Details
                                    </Button>
                                    <Button
                                      size="sm"
                                      onClick={() => toggleTask(plan.id, task.id)}
                                      className={`${
                                        completed 
                                          ? 'bg-emerald-500 hover:bg-emerald-600' 
                                          : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                                      }`}
                                    >
                                      {completed ? <CheckCircle className="w-4 h-4 mr-2" /> : <Circle className="w-4 h-4 mr-2" />}
                                      {completed ? 'Done' : 'Start'}
                                    </Button>
                                  </div>
                                  {task.activityDetails?.duration && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                      Duration: {task.activityDetails.duration}
                                    </div>
                                  )}
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
        </div>
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