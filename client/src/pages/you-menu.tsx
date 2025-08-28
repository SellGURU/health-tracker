import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { bodySystemSurveys, type SurveyQuestion } from "@/data/body-system-surveys";
import { 
  User, 
  Edit3, 
  Crown, 
  Stethoscope, 
  Pill, 
  Moon, 
  Zap, 
  Baby, 
  UtensilsCrossed,
  ArrowLeft,
  Check,
  Heart,
  Thermometer,
  Activity,
  Shield,
  Droplets,
  Brain,
  Wind,
  Download,
  CheckCircle,
  MessageCircle,
  BookOpen,
  Calendar,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link, useLocation } from "wouter";

const healthModules = [
  { id: 'checkups', name: 'Checkups', icon: Stethoscope, color: 'text-blue-600' },
  { id: 'health-profile', name: 'Health Profile', icon: User, color: 'text-green-600', progress: 20 },
  { id: 'vitamins', name: 'Vitamins', icon: Pill, color: 'text-orange-600' },
  { id: 'sleep', name: 'Sleep', icon: Moon, color: 'text-purple-600' },
  { id: 'fat-burning', name: 'Fat Burning', icon: Zap, color: 'text-red-600' },
  { id: 'future-mom', name: 'Future Mom', icon: Baby, color: 'text-pink-600' },
  { id: 'meal-plan', name: 'Meal Plan', icon: UtensilsCrossed, color: 'text-yellow-600' },
  { id: 'fasting', name: 'Fasting', icon: Activity, color: 'text-indigo-600' },
  { id: 'post-covid', name: 'Post-COVID', icon: Shield, color: 'text-teal-600' }
];

const surveyIcons = {
  blood: Droplets,
  hormones: Thermometer,
  liver: Heart,
  cardiovascular: Heart,
  urogenital: Droplets,
  immunity: Shield,
  digestion: UtensilsCrossed,
  nerves: Brain,
  respiratory: Wind
};

export default function YouMenu() {
  const [currentView, setCurrentView] = useState<'main' | 'avatar-edit' | 'go-plus' | 'see-all' | 'health-profile' | 'checkups' | 'personalized-checkup' | 'survey' | 'subscriptions' | 'deep-analysis'>('main');
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string | string[]>>({});
  const [completedSurveys, setCompletedSurveys] = useState<string[]>([]);
  const [hasRequiredData, setHasRequiredData] = useState(true);
  const [biologicalAge, setBiologicalAge] = useState<number | null>(28);
  const [chronologicalAge, setChronologicalAge] = useState(25);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleUpgrade = () => {
    toast({
      title: "Upgrade to HolistiCare Plus",
      description: "Unlock advanced health insights and personalized recommendations.",
    });
  };

  const startSurvey = (surveyId: string) => {
    const survey = bodySystemSurveys.find(s => s.id === surveyId);
    if (survey && survey.questions.length > 0) {
      setSelectedSurvey(surveyId);
      setCurrentQuestionIndex(0);
      setSurveyAnswers({});
      setCurrentView('survey');
    } else {
      toast({
        title: "Survey coming soon",
        description: `The ${surveyId} survey questions will be available in the next update.`,
      });
    }
  };

  const handleSurveyAnswer = (questionId: string, answer: string | string[]) => {
    setSurveyAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const nextQuestion = () => {
    const survey = bodySystemSurveys.find(s => s.id === selectedSurvey);
    if (survey && currentQuestionIndex < survey.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Complete survey
      if (selectedSurvey) {
        setCompletedSurveys(prev => [...prev, selectedSurvey]);
        toast({
          title: "Survey completed!",
          description: `${survey?.name} survey has been completed successfully.`,
        });
      }
      setCurrentView('health-profile');
      setSelectedSurvey(null);
      setCurrentQuestionIndex(0);
      setSurveyAnswers({});
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // For showing health-related cards - using hasRequiredData as indicator
  const hasHealthData = hasRequiredData;

  const renderMainView = () => (
    <div className="space-y-6">
      {/* Header with User Name */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">Welcome, User</h1>
        <p className="text-gray-600 dark:text-gray-400">Your health dashboard</p>
      </div>

      {/* Age Cards - Prominent Display */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({ title: "Biological Age", description: "Calculation details coming soon" })}>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {hasRequiredData && biologicalAge ? biologicalAge : '?'}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Biological Age</p>
            {hasRequiredData && biologicalAge && (
              <p className="text-xs text-green-600 mt-1">Optimal range</p>
            )}
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast({ title: "Chronological Age", description: "Based on your date of birth" })}>
          <CardContent className="p-4 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{chronologicalAge}</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Chronological Age</p>
            <p className="text-xs text-gray-500 mt-1">Years lived</p>
          </CardContent>
        </Card>
      </div>

      {/* Complete Profile CTA if data missing */}
      {!hasRequiredData && (
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-4 text-center">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Complete your Health Profile
            </h3>
            <p className="text-blue-700 dark:text-blue-300 text-sm mb-4">
              We need your date of birth, height, weight, and some health data to calculate your biological age
            </p>
            <Button onClick={() => setCurrentView('health-profile')} className="bg-blue-600 hover:bg-blue-700">
              Complete Profile
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Health Summary Card */}
      {hasHealthData && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Health Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">8.5</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Overall Score</div>
              </div>
              <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600">85%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Goals Progress</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Cardiovascular Health</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                  <span className="text-sm font-medium">Good</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Metabolic Health</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <span className="text-sm font-medium">Fair</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Mental Wellness</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
                  </div>
                  <span className="text-sm font-medium">Excellent</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Latest Deep Analysis Card */}
      {hasHealthData && (
        <Card className="cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Latest Deep Analysis</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Generated Jan 15, 2025</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); /* Previous analysis */ }}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Badge variant="outline">1 of 3</Badge>
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); /* Next analysis */ }}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Metabolic health optimized</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">12 personalized action items</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                <span className="text-sm">Biological age: 28 years</span>
              </div>
            </div>
            
            <Button className="w-full mt-4" onClick={() => setLocation('/plan')}>
              View Full Analysis
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Your Plan Card */}
      {hasHealthData && (
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setLocation('/plan')}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-1">Your Plan</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Goals, challenges & action plans</p>
              </div>
              <div className="w-16 h-16 relative">
                <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" className="text-gray-200 dark:text-gray-700" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="currentColor" strokeWidth="4" strokeDasharray={`${60 * 0.6} ${60}`} className="text-blue-600" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">60%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" className="h-16 flex flex-col gap-1" onClick={() => setLocation('/chat')}>
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm">Chat</span>
        </Button>
        
        <Button variant="outline" className="h-16 flex flex-col gap-1" onClick={() => toast({ title: "Book Coaching", description: "Opening booking interface..." })}>
          <Calendar className="w-5 h-5" />
          <span className="text-sm">Book Coaching</span>
        </Button>
        
        <Button variant="outline" className="h-16 flex flex-col gap-1" onClick={() => setCurrentView('deep-analysis')}>
          <Brain className="w-5 h-5" />
          <span className="text-sm">Deep Analysis</span>
        </Button>
        
        <Button variant="outline" className="h-16 flex flex-col gap-1" onClick={() => setLocation('/educational')}>
          <BookOpen className="w-5 h-5" />
          <span className="text-sm">Educational</span>
        </Button>
      </div>
    </div>
  );

  const renderSubscriptionsView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('health-profile')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold ml-4">Subscription Plans</h1>
      </div>

      {/* Plans */}
      <div className="space-y-4">
        <Card className="border-2 border-blue-200 bg-blue-50 dark:bg-blue-900/20 relative">
          <div className="absolute -top-3 left-4">
            <Badge className="bg-orange-500 text-white">POPULAR</Badge>
          </div>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">12-Month Plan</h3>
                <p className="text-gray-600 dark:text-gray-400">Best value for committed users</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">$199</div>
                <div className="text-sm text-gray-500">$16.58/month</div>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Weekly coaching sessions (bookable)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Deep Analysis every 3 months (quarterly)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Priority booking and support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Unlimited chat with AI copilot</span>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
              Purchase Plan
            </Button>
            
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">12 weekly coaching sessions remaining</p>
              <p className="text-xs text-gray-500">Next Deep Analysis: March 2025</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">3-Month Plan</h3>
                <p className="text-gray-600 dark:text-gray-400">Perfect for getting started</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">$79</div>
                <div className="text-sm text-gray-500">$26.33/month</div>
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">One comprehensive Deep Analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Chat with Copilot & coach booking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">Full access to educational content</span>
              </div>
            </div>

            <Button variant="outline" className="w-full" size="lg">
              Purchase Plan
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Current Subscription Status */}
      <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-green-900 dark:text-green-100">Active Subscription</h4>
              <p className="text-sm text-green-700 dark:text-green-300">12-month plan • Expires Dec 15, 2025</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Total paid: $199.00</p>
            </div>
            <Button variant="ghost" size="sm" className="text-green-700">
              <Download className="w-4 h-4 mr-2" />
              Download Invoice
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderDeepAnalysisView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold ml-4">Deep Analysis</h1>
      </div>

      {/* Analysis Info */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
              <Brain className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                Comprehensive Health Analysis
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Get a detailed analysis of your physiological and behavioral patterns, 
                with personalized recommendations and a custom action plan.
              </p>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Analysis of all your health data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Personalized action plan generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Biological age calculation</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">Risk assessment and recommendations</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>



      {/* Generate Button */}
      <Button 
        className="w-full bg-purple-600 hover:bg-purple-700" 
        size="lg"
        onClick={() => {
          toast({
            title: "Deep Analysis Started",
            description: "Your analysis is being generated. This will take a few moments.",
          });
          setTimeout(() => {
            setLocation('/action-plan');
          }, 2000);
        }}
      >
        Generate Deep Analysis
      </Button>

      <p className="text-center text-sm text-gray-500">
        Your personalized action plan will be generated based on your health data and goals.
      </p>
    </div>
  );

  const renderHealthProfile = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold ml-4">Health Profile</h1>
      </div>

      {/* User Avatar and Progress */}
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-full border-4 border-blue-200 flex items-center justify-center">
            <Avatar className="w-20 h-20">
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>RZ</AvatarFallback>
            </Avatar>
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-600" 
               style={{ clipPath: 'polygon(0 0, 20% 0, 20% 100%, 0 100%)' }} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">rezi</h2>
          <p className="text-gray-600 dark:text-gray-400">Your profile is 20% complete</p>
        </div>
      </div>

      {/* Completed Progress */}
      <div className="space-y-3">
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Basic survey complete</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700">+10%</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Health app connected</span>
              <Badge variant="secondary" className="bg-green-100 text-green-700">+10%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* What to do next */}
      <div>
        <h3 className="text-lg font-semibold mb-4">What to do next?</h3>
        
        {/* Body System Surveys */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Take the body system surveys</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Complete detailed health assessments for each body system
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {bodySystemSurveys.map((survey) => {
              const IconComponent = surveyIcons[survey.id as keyof typeof surveyIcons];
              return (
                <div key={survey.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                    <span className="font-medium">{survey.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">+{survey.points}%</Badge>
                    {completedSurveys.includes(survey.id) ? (
                      <Badge variant="default" className="bg-green-600">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    ) : (
                      <Button 
                        size="sm" 
                        onClick={() => startSurvey(survey.id)}
                      >
                        Complete
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </CardContent>
          

        </Card>

        {/* Test Cards */}
        <div className="space-y-3">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">Take a general blood test</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Screen for infections, inflammation, anemia, and blood diseases
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-red-50 text-red-700">+20%</Badge>
                  <Button size="sm" variant="destructive" onClick={() => setCurrentView('checkups')}>
                    View in Checkup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">Take a urinalysis test</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Screen kidney and urinary tract health
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">+15%</Badge>
                  <Button size="sm" onClick={() => setCurrentView('checkups')}>
                    View in Checkup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="font-medium">Take specialized tests</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Customized based on health, genetics, and lifestyle
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">+20%</Badge>
                  <Button size="sm" onClick={() => setCurrentView('checkups')}>
                    View in Checkup
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderSurveyView = () => {
    const survey = bodySystemSurveys.find(s => s.id === selectedSurvey);
    if (!survey || !survey.questions.length) return null;

    const currentQuestion = survey.questions[currentQuestionIndex];
    const currentAnswer = surveyAnswers[currentQuestion.id] || currentQuestion.defaultAnswer;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView('health-profile')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="text-center">
            <h1 className="text-xl font-bold">{survey.name} Survey</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {survey.questions.length}
            </p>
          </div>
          <div className="w-8" />
        </div>

        {/* Progress */}
        <Progress value={((currentQuestionIndex + 1) / survey.questions.length) * 100} className="mb-6" />

        {/* Question */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentQuestion.type === 'single' ? (
              <RadioGroup
                value={currentAnswer as string}
                onValueChange={(value) => handleSurveyAnswer(currentQuestion.id, value)}
              >
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={`${currentQuestion.id}-${index}`} />
                    <Label htmlFor={`${currentQuestion.id}-${index}`} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-2">
                {currentQuestion.options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox
                      id={`${currentQuestion.id}-${index}`}
                      checked={(currentAnswer as string[])?.includes(option)}
                      onCheckedChange={(checked) => {
                        const currentAnswers = (currentAnswer as string[]) || [];
                        if (checked) {
                          handleSurveyAnswer(currentQuestion.id, [...currentAnswers, option]);
                        } else {
                          handleSurveyAnswer(currentQuestion.id, currentAnswers.filter(a => a !== option));
                        }
                      }}
                    />
                    <Label htmlFor={`${currentQuestion.id}-${index}`} className="text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <Button 
            variant="outline" 
            onClick={previousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </Button>
          <Button onClick={nextQuestion}>
            {currentQuestionIndex === survey.questions.length - 1 ? 'Complete Survey' : 'Next'}
          </Button>
        </div>
      </div>
    );
  };

  const renderCheckupsView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold ml-4">Basic checkup for women 18-29 years old</h1>
      </div>

      {/* Feature Highlight */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-medium">Free test list based on WHO recommendations</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Helps identify major health risks
          </p>
          <Button variant="link" className="p-0 h-auto text-blue-600">
            Learn more
          </Button>
        </CardContent>
      </Card>

      {/* Personalization Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">You can account for 110 personal factors in your checkup</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pick a test based on your body type
              </p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => setCurrentView('personalized-checkup')}
      >
        Personalize your checkup
      </Button>

      {/* Missing Tests */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Missing tests</h3>
        <div className="space-y-3">
          {[
            'Clinical blood count without leukocyte formula (venous blood)',
            'Biochemical blood test, basic',
            'Urinalysis'
          ].map((test, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">{test}</span>
                  <Checkbox />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <Button className="w-full mt-4">
          <Download className="w-4 h-4 mr-2" />
          Download list
        </Button>
      </div>
    </div>
  );

  const renderPersonalizedCheckupView = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView('checkups')}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold ml-4">Personalized Checkup</h1>
      </div>

      {/* Progress */}
      <div className="text-center space-y-4">
        <div className="w-24 h-24 mx-auto relative">
          <div className="w-24 h-24 rounded-full border-4 border-gray-200 flex items-center justify-center">
            <User className="w-12 h-12 text-gray-600" />
          </div>
          <div className="absolute inset-0 rounded-full border-4 border-blue-600" 
               style={{ clipPath: 'polygon(0 0, 27% 0, 27% 100%, 0 100%)' }} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Your personalized checkup takes into account</h2>
          <p className="text-2xl font-bold text-blue-600">30 of 110 factors</p>
        </div>
      </div>

      {/* Completed Progress */}
      <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Basic survey complete</span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">+30</Badge>
          </div>
        </CardContent>
      </Card>

      {/* How to account for more factors */}
      <div>
        <h3 className="text-lg font-semibold mb-4">How can I account for more factors?</h3>
        
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-base">Take the body system surveys</CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Help identify hidden health risks and guide personalized tests
            </p>
          </CardHeader>
          <CardContent className="space-y-2">
            {bodySystemSurveys.map((survey) => (
              <div key={survey.id} className="flex items-center justify-between p-3 border rounded-lg">
                <span className="font-medium">{survey.name}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">+{survey.points}</Badge>
                  {completedSurveys.includes(survey.id) ? (
                    <Badge variant="default" className="bg-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completed
                    </Badge>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => startSurvey(survey.id)}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderCurrentView = () => {
    switch (currentView) {
      case 'main':
        return renderMainView();
      case 'health-profile':
        return renderHealthProfile();
      case 'survey':
        return renderSurveyView();
      case 'checkups':
        return renderCheckupsView();
      case 'personalized-checkup':
        return renderPersonalizedCheckupView();
      case 'deep-analysis':
        return renderDeepAnalysisView();
      case 'avatar-edit':
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-bold ml-4">Avatar Edit</h1>
            </div>
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-4">Choose your appearance</p>
              <div className="space-y-4">
                <Button variant="outline" className="w-full">Choose skin colour</Button>
                <Button variant="outline" className="w-full">Choose body shape</Button>
                <Button onClick={() => setCurrentView('main')}>Done</Button>
              </div>
            </div>
          </div>
        );
      case 'go-plus':
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-bold ml-4">Try HolistiCare Plus</h1>
            </div>
            <div className="space-y-4">
              <Card className="relative">
                <Badge className="absolute -top-2 left-4 bg-orange-500">POPULAR</Badge>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">12 months</h3>
                      <p className="text-sm text-gray-500">$2.30/week</p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">$79.99</div>
                      <div className="text-sm text-green-600">Save 33%</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">1 month</h3>
                      <p className="text-sm text-gray-500">Cancel anytime</p>
                    </div>
                    <div className="font-bold">$9.99</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">Forever (Lifetime)</h3>
                      <p className="text-sm text-gray-500">$1.53/week - Lifetime access</p>
                    </div>
                    <div className="font-bold">$249.99</div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button onClick={handleUpgrade} className="w-full">Continue</Button>
                <Button variant="outline" className="w-full">
                  Not sure yet? Enable 1-year intro offer
                </Button>
                <Button variant="ghost" className="w-full text-sm">
                  Restore purchases
                </Button>
              </div>
            </div>
          </div>
        );
      case 'see-all':
        return (
          <div className="space-y-6">
            <div className="flex items-center mb-6">
              <Button variant="ghost" size="sm" onClick={() => setCurrentView('main')}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-bold ml-4">All Health Modules</h1>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {healthModules.map((module) => {
                const IconComponent = module.icon;
                return (
                  <Card key={module.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <IconComponent className={`w-8 h-8 mx-auto mb-2 ${module.color}`} />
                      <h3 className="font-medium text-sm">{module.name}</h3>
                      {module.progress && (
                        <div className="mt-2">
                          <Progress value={module.progress} className="h-2" />
                          <p className="text-xs text-gray-500 mt-1">{module.progress}% complete</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      default:
        return renderMainView();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        {renderCurrentView()}
      </div>
    </div>
  );
}