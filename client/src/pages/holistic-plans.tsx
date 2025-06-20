import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Stethoscope, 
  Target, 
  Trophy, 
  Clock, 
  DollarSign, 
  CheckCircle2, 
  Circle,
  Plus,
  Sparkles,
  Award,
  TrendingUp
} from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface HolisticPlan {
  id: number;
  title: string;
  description: string;
  aiGenerated: boolean;
  doctorValidated: boolean;
  validatedBy?: string;
  validationDate?: string;
  validationCost: string;
  category: string;
  duration?: string;
  goals: string[];
  recommendations: {
    nutrition: string[];
    exercise: string[];
    lifestyle: string[];
    supplements?: string[];
    monitoring: string[];
  };
  status: string;
  createdAt: string;
}

interface HealthGoal {
  id: number;
  title: string;
  description?: string;
  targetValue?: number;
  currentValue: number;
  unit?: string;
  targetDate?: string;
  category: string;
  status: string;
  progress: number;
}

interface WellnessChallenge {
  id: number;
  title: string;
  description: string;
  type: string;
  duration: number;
  tasks: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    completedDate?: string;
  }[];
  completionPercentage: number;
  points: number;
  badge?: string;
  status: string;
  startDate: string;
  endDate?: string;
}

export default function HolisticPlans() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('plans');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isRequestValidationOpen, setIsRequestValidationOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<HolisticPlan | null>(null);

  // Form states
  const [planForm, setPlanForm] = useState({
    healthConcerns: '',
    goals: '',
    preferences: '',
    category: 'general'
  });

  // Fetch holistic plans
  const { data: plans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['/api/holistic-plans'],
  });

  // Fetch health goals
  const { data: goals = [], isLoading: goalsLoading } = useQuery({
    queryKey: ['/api/health-goals'],
  });

  // Fetch wellness challenges
  const { data: challenges = [], isLoading: challengesLoading } = useQuery({
    queryKey: ['/api/wellness-challenges'],
  });

  // Generate AI holistic plan
  const generatePlanMutation = useMutation({
    mutationFn: async (data: typeof planForm) => {
      return await apiRequest('POST', '/api/holistic-plans/generate', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/holistic-plans'] });
      setIsCreateDialogOpen(false);
      toast({
        title: "AI Plan Generated",
        description: "Your personalized holistic health plan has been created.",
      });
    },
    onError: () => {
      toast({
        title: "Generation Failed",
        description: "Unable to generate plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Request doctor validation
  const requestValidationMutation = useMutation({
    mutationFn: async (planId: number) => {
      return await apiRequest('POST', `/api/holistic-plans/${planId}/request-validation`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/holistic-plans'] });
      setIsRequestValidationOpen(false);
      toast({
        title: "Validation Requested",
        description: "A healthcare professional will review your plan for $15.",
      });
    },
    onError: () => {
      toast({
        title: "Request Failed",
        description: "Unable to request validation. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGeneratePlan = () => {
    if (!planForm.healthConcerns.trim() || !planForm.goals.trim()) {
      toast({
        title: "Missing Information",
        description: "Please describe your health concerns and goals.",
        variant: "destructive",
      });
      return;
    }
    generatePlanMutation.mutate(planForm);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'nutrition': return '🥗';
      case 'exercise': return '💪';
      case 'mental_health': return '🧘';
      case 'lifestyle': return '🌱';
      default: return '🎯';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Holistic Health Plans</h1>
            <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
              AI-generated and doctor-validated wellness plans
            </p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 px-6 py-2.5">
                <Plus className="w-4 h-4 mr-2" />
                Generate Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Generate AI Health Plan</DialogTitle>
              <DialogDescription>
                Tell us about your health goals and we'll create a personalized plan
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">Plan Category</Label>
                <Select value={planForm.category} onValueChange={(value) => setPlanForm(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Wellness</SelectItem>
                    <SelectItem value="nutrition">Nutrition Focus</SelectItem>
                    <SelectItem value="exercise">Fitness Focus</SelectItem>
                    <SelectItem value="mental_health">Mental Health</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle Change</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="concerns">Health Concerns</Label>
                <Textarea
                  id="concerns"
                  placeholder="Describe your current health concerns..."
                  value={planForm.healthConcerns}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, healthConcerns: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="goals">Health Goals</Label>
                <Textarea
                  id="goals"
                  placeholder="What do you want to achieve?"
                  value={planForm.goals}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, goals: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="preferences">Preferences</Label>
                <Textarea
                  id="preferences"
                  placeholder="Dietary restrictions, exercise preferences, etc."
                  value={planForm.preferences}
                  onChange={(e) => setPlanForm(prev => ({ ...prev, preferences: e.target.value }))}
                />
              </div>
              
              <Button 
                onClick={handleGeneratePlan} 
                disabled={generatePlanMutation.isPending}
                className="w-full"
              >
                <Brain className="w-4 h-4 mr-2" />
                {generatePlanMutation.isPending ? 'Generating...' : 'Generate AI Plan'}
              </Button>
            </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 h-12 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
          <TabsTrigger 
            value="plans" 
            className="flex items-center gap-2 font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Plans
          </TabsTrigger>
          <TabsTrigger 
            value="goals"
            className="flex items-center gap-2 font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Target className="w-4 h-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger 
            value="challenges"
            className="flex items-center gap-2 font-medium data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Trophy className="w-4 h-4" />
            Challenges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="plans" className="space-y-4">
          {plansLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : plans.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Brain className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No Plans Yet</h3>
                <p className="text-muted-foreground mb-4">
                  Generate your first AI-powered holistic health plan
                </p>
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Plan
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {plans.map((plan: HolisticPlan) => (
                <Card key={plan.id} className="overflow-hidden">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 flex items-center justify-center text-white font-semibold text-lg">
                            {getCategoryIcon(plan.category)}
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100 leading-tight">
                              {plan.title}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              {plan.aiGenerated && (
                                <div className="flex items-center gap-1 text-blue-600">
                                  <Brain className="w-3 h-3" />
                                  <span className="text-xs font-medium">AI Generated</span>
                                </div>
                              )}
                              {plan.doctorValidated ? (
                                <div className="flex items-center gap-1 text-green-600">
                                  <Stethoscope className="w-3 h-3" />
                                  <span className="text-xs font-medium">Doctor Validated</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-orange-600">
                                  <Clock className="w-3 h-3" />
                                  <span className="text-xs font-medium">Pending Validation</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <CardDescription className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                          {plan.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    {plan.duration && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-700 dark:text-gray-300">Duration:</span>
                        <span className="text-gray-600 dark:text-gray-400">{plan.duration}</span>
                      </div>
                    )}

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Goals:
                      </h4>
                      <div className="space-y-2">
                        {plan.goals.map((goal, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-pink-500 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{goal}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      {!plan.doctorValidated && (
                        <Dialog open={isRequestValidationOpen} onOpenChange={setIsRequestValidationOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              size="sm" 
                              onClick={() => setSelectedPlan(plan)}
                              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                            >
                              <DollarSign className="w-4 h-4" />
                              Validate ($15)
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Request Doctor Validation</DialogTitle>
                              <DialogDescription>
                                Have a healthcare professional review and validate your plan for $15
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                                <h4 className="font-medium mb-2">What's included:</h4>
                                <ul className="text-sm space-y-1">
                                  <li>• Professional medical review</li>
                                  <li>• Safety assessment</li>
                                  <li>• Personalized adjustments</li>
                                  <li>• Official validation certificate</li>
                                </ul>
                              </div>
                              <div className="flex items-center justify-between p-3 border rounded-lg">
                                <span className="font-medium">Validation Fee</span>
                                <span className="text-lg font-bold">$15.00</span>
                              </div>
                              <Button 
                                onClick={() => selectedPlan && requestValidationMutation.mutate(selectedPlan.id)}
                                disabled={requestValidationMutation.isPending}
                                className="w-full"
                              >
                                {requestValidationMutation.isPending ? 'Processing...' : 'Request Validation'}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          {goalsLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-5 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : goals.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Target className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
                <h3 className="text-xl font-semibold mb-3">No Goals Set</h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
                  Goals will be automatically created when you generate a holistic plan. Start by creating your first health plan!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {goals.map((goal: HealthGoal) => (
                <Card key={goal.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
                          {goal.title}
                        </h3>
                        {goal.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            {goal.description}
                          </p>
                        )}
                      </div>
                      <Badge className={`${getStatusColor(goal.status)} ml-4`}>
                        {goal.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Progress</span>
                          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-3" />
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                        {goal.targetValue && (
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Current Value</span>
                            <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                              {goal.currentValue} {goal.unit}
                            </div>
                          </div>
                        )}
                        {goal.targetValue && (
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Target Value</span>
                            <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
                              {goal.targetValue} {goal.unit}
                            </div>
                          </div>
                        )}
                      </div>

                      {goal.targetDate && (
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 pt-2">
                          <Clock className="w-4 h-4" />
                          <span>Target Date: {new Date(goal.targetDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="challenges" className="space-y-6">
          {challengesLoading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-200 rounded w-20"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : challenges.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Trophy className="w-16 h-16 mx-auto text-muted-foreground mb-6" />
                <h3 className="text-xl font-semibold mb-3">No Active Challenges</h3>
                <p className="text-muted-foreground text-base leading-relaxed max-w-md mx-auto">
                  Challenges will be created as part of your holistic health plans. Join a challenge to earn points and badges!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {challenges.map((challenge: WellnessChallenge) => (
                <Card key={challenge.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {challenge.title}
                          </h3>
                          {challenge.badge && (
                            <Badge variant="outline" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                              <Award className="w-3 h-3 mr-1" />
                              {challenge.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-3">
                          {challenge.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full ml-4">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="font-semibold text-green-700 dark:text-green-300">{challenge.points} pts</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Completion</span>
                          <span className="font-bold text-lg text-gray-900 dark:text-gray-100">{challenge.completionPercentage}%</span>
                        </div>
                        <Progress value={challenge.completionPercentage} className="h-3" />
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" />
                          Tasks Progress:
                        </h4>
                        <div className="space-y-2">
                          {challenge.tasks.slice(0, 3).map((task) => (
                            <div key={task.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                              {task.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                              )}
                              <span className={`text-sm ${task.completed ? 'line-through text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>
                                {task.title}
                              </span>
                              {task.completed && task.completedDate && (
                                <span className="text-xs text-green-600 ml-auto">
                                  {new Date(task.completedDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          ))}
                          {challenge.tasks.length > 3 && (
                            <div className="text-sm text-gray-500 text-center py-2">
                              +{challenge.tasks.length - 3} more tasks
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span className="capitalize">{challenge.type}</span>
                          </div>
                          <div>{challenge.duration} days</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}