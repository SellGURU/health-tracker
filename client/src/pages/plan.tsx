import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

import { 
  Target,
  Calendar,
  CheckCircle,
  Clock,
  TrendingUp,
  Award,
  Play,
  Pause,
  MoreHorizontal,
  Plus,
  Brain,
  Activity,
  Heart
} from "lucide-react";

interface Goal {
  id: string;
  title: string;
  description: string;
  category: 'Health' | 'Fitness' | 'Nutrition' | 'Mental Health';
  progress: number;
  targetDate: Date;
  status: 'active' | 'completed' | 'paused';
  createdDate: Date;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  participants: number;
  category: 'Movement' | 'Nutrition' | 'Mindfulness' | 'Sleep';
  progress: number;
  status: 'active' | 'completed' | 'upcoming';
  startDate: Date;
  rewards: string[];
}

interface ActionPlan {
  id: string;
  title: string;
  description: string;
  createdDate: Date;
  status: 'active' | 'completed' | 'archived';
  tasksTotal: number;
  tasksCompleted: number;
  source: 'Deep Analysis' | 'Manual' | 'Goal-based';
  lastUpdated: Date;
}

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Improve Cardiovascular Health',
    description: 'Reduce cholesterol levels and improve heart health through diet and exercise',
    category: 'Health',
    progress: 65,
    targetDate: new Date('2025-06-01'),
    status: 'active',
    createdDate: new Date('2024-12-01')
  },
  {
    id: '2',
    title: 'Lose 15 pounds',
    description: 'Achieve healthy weight through sustainable diet and exercise plan',
    category: 'Fitness',
    progress: 40,
    targetDate: new Date('2025-04-15'),
    status: 'active',
    createdDate: new Date('2024-11-15')
  },
  {
    id: '3',
    title: 'Establish Meditation Practice',
    description: 'Practice mindfulness meditation for 20 minutes daily',
    category: 'Mental Health',
    progress: 100,
    targetDate: new Date('2025-01-01'),
    status: 'completed',
    createdDate: new Date('2024-10-01')
  }
];

const mockChallenges: Challenge[] = [
  {
    id: '1',
    title: '30-Day Movement Challenge',
    description: 'Move your body for at least 30 minutes every day',
    duration: 30,
    participants: 1247,
    category: 'Movement',
    progress: 73,
    status: 'active',
    startDate: new Date('2025-01-01'),
    rewards: ['Fitness Badge', '50 Health Points', 'Movement Master Title']
  },
  {
    id: '2',
    title: 'Hydration Hero',
    description: 'Drink 8 glasses of water daily for 2 weeks',
    duration: 14,
    participants: 892,
    category: 'Nutrition',
    progress: 100,
    status: 'completed',
    startDate: new Date('2024-12-15'),
    rewards: ['Hydration Champion', '30 Health Points']
  },
  {
    id: '3',
    title: 'Sleep Quality Boost',
    description: '7+ hours of quality sleep every night for 21 days',
    duration: 21,
    participants: 645,
    category: 'Sleep',
    progress: 0,
    status: 'upcoming',
    startDate: new Date('2025-02-01'),
    rewards: ['Sleep Master', '40 Health Points', 'Rest & Recovery Badge']
  }
];

const mockActionPlans: ActionPlan[] = [
  {
    id: '1',
    title: 'Metabolic Health Optimization',
    description: 'Comprehensive plan to improve metabolic markers and energy levels',
    createdDate: new Date('2025-01-15'),
    status: 'active',
    tasksTotal: 12,
    tasksCompleted: 8,
    source: 'Deep Analysis',
    lastUpdated: new Date('2025-01-27')
  },
  {
    id: '2',
    title: 'Cardiovascular Fitness Plan',
    description: 'Exercise and lifestyle plan to strengthen heart health',
    createdDate: new Date('2024-12-10'),
    status: 'completed',
    tasksTotal: 15,
    tasksCompleted: 15,
    source: 'Deep Analysis',
    lastUpdated: new Date('2025-01-10')
  },
  {
    id: '3',
    title: 'Stress Management Protocol',
    description: 'Mindfulness and stress reduction techniques',
    createdDate: new Date('2024-11-20'),
    status: 'archived',
    tasksTotal: 8,
    tasksCompleted: 6,
    source: 'Manual',
    lastUpdated: new Date('2024-12-20')
  }
];

const categoryColors = {
  'Health': 'bg-red-100 text-red-800',
  'Fitness': 'bg-blue-100 text-blue-800',
  'Nutrition': 'bg-green-100 text-green-800',
  'Mental Health': 'bg-purple-100 text-purple-800',
  'Movement': 'bg-orange-100 text-orange-800',
  'Mindfulness': 'bg-indigo-100 text-indigo-800',
  'Sleep': 'bg-gray-100 text-gray-800'
};

const statusColors = {
  'active': 'bg-green-100 text-green-800',
  'completed': 'bg-blue-100 text-blue-800',
  'paused': 'bg-yellow-100 text-yellow-800',
  'archived': 'bg-gray-100 text-gray-800',
  'upcoming': 'bg-purple-100 text-purple-800'
};

export default function PlanPage() {
  const [activeTab, setActiveTab] = useState('goals');
  const { toast } = useToast();

  const handleGoalAction = (goalId: string, action: 'pause' | 'resume' | 'complete') => {
    toast({
      title: `Goal ${action}d`,
      description: `Goal has been ${action}d successfully`,
    });
  };

  const handleChallengeJoin = (challengeId: string) => {
    toast({
      title: "Challenge Joined",
      description: "You've successfully joined the challenge!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Your Plan</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your goals, challenges, and action plans
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="challenges">Challenges</TabsTrigger>
              <TabsTrigger value="action-plans">Action Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="goals" className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Health Goals</h2>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  New Goal
                </Button>
              </div>

              <div className="space-y-4">
                {mockGoals.map((goal) => (
                  <Card key={goal.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {goal.title}
                            </h3>
                            <Badge className={categoryColors[goal.category]}>
                              {goal.category}
                            </Badge>
                            <Badge className={statusColors[goal.status]}>
                              {goal.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {goal.description}
                          </p>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Progress</span>
                              <span className="font-medium">{goal.progress}%</span>
                            </div>
                            <Progress value={goal.progress} className="h-2" />
                          </div>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mt-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Target: {goal.targetDate.toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Created: {goal.createdDate.toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {goal.status === 'active' && (
                            <>
                              <Button variant="ghost" size="sm" onClick={() => handleGoalAction(goal.id, 'pause')}>
                                <Pause className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleGoalAction(goal.id, 'complete')}>
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {goal.status === 'paused' && (
                            <Button variant="ghost" size="sm" onClick={() => handleGoalAction(goal.id, 'resume')}>
                              <Play className="w-4 h-4" />
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
        </TabsContent>

        <TabsContent value="challenges" className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Health Challenges</h2>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Browse Challenges
                </Button>
              </div>

              <div className="space-y-4">
                {mockChallenges.map((challenge) => (
                  <Card key={challenge.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {challenge.title}
                            </h3>
                            <Badge className={categoryColors[challenge.category]}>
                              {challenge.category}
                            </Badge>
                            <Badge className={statusColors[challenge.status]}>
                              {challenge.status}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {challenge.description}
                          </p>
                          
                          <div className="flex items-center gap-6 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {challenge.duration} days
                            </div>
                            <div className="flex items-center gap-1">
                              <TrendingUp className="w-4 h-4" />
                              {challenge.participants} participants
                            </div>
                          </div>
                          
                          {challenge.status === 'active' && (
                            <div className="space-y-2 mb-3">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Progress</span>
                                <span className="font-medium">{challenge.progress}%</span>
                              </div>
                              <Progress value={challenge.progress} className="h-2" />
                            </div>
                          )}
                          
                          <div className="flex flex-wrap gap-2">
                            {challenge.rewards.map((reward, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Award className="w-3 h-3 mr-1" />
                                {reward}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          {challenge.status === 'upcoming' && (
                            <Button onClick={() => handleChallengeJoin(challenge.id)}>
                              Join Challenge
                            </Button>
                          )}
                          {challenge.status === 'active' && (
                            <Button variant="outline">
                              View Details
                            </Button>
                          )}
                          {challenge.status === 'completed' && (
                            <Badge className="bg-green-100 text-green-800">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
        </TabsContent>

        <TabsContent value="action-plans" className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold">Action Plans</h2>
                <Link href="/action-plan">
                  <Button size="sm">
                    <Target className="w-4 h-4 mr-2" />
                    Today's Plan
                  </Button>
                </Link>
              </div>

              <div className="space-y-4">
                {mockActionPlans.map((plan) => (
                  <Card key={plan.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                              {plan.title}
                            </h3>
                            <Badge className={statusColors[plan.status]}>
                              {plan.status}
                            </Badge>
                            {plan.source === 'Deep Analysis' && (
                              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                                <Brain className="w-3 h-3 mr-1" />
                                AI Generated
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-gray-600 dark:text-gray-400 mb-3">
                            {plan.description}
                          </p>
                          
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <CheckCircle className="w-4 h-4" />
                                {plan.tasksCompleted} / {plan.tasksTotal} tasks
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                Created {plan.createdDate.toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-500">
                              Updated {plan.lastUpdated.toLocaleDateString()}
                            </div>
                          </div>
                          
                          {plan.status === 'active' && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">Completion</span>
                                <span className="font-medium">
                                  {Math.round((plan.tasksCompleted / plan.tasksTotal) * 100)}%
                                </span>
                              </div>
                              <Progress 
                                value={(plan.tasksCompleted / plan.tasksTotal) * 100} 
                                className="h-2" 
                              />
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4">
                          {plan.status === 'active' && (
                            <Link href="/action-plan">
                              <Button>
                                <Activity className="w-4 h-4 mr-2" />
                                Continue
                              </Button>
                            </Link>
                          )}
                          {plan.status === 'completed' && (
                            <Button variant="outline">
                              <Heart className="w-4 h-4 mr-2" />
                              Review
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}