import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { formatRelativeDate } from "@/lib/utils";
import HealthScoreCard from "@/components/health/health-score-card";
import BiomarkerCard from "@/components/health/biomarker-card";
import { Bell, Upload, Edit, TrendingUp, CheckSquare, Brain } from "lucide-react";
import { Link } from "wouter";

export default function Dashboard() {
  const { user } = useAuth();

  const { data: healthScore } = useQuery({
    queryKey: ["/api/health-score"],
  });

  const { data: labResults = [] } = useQuery({
    queryKey: ["/api/lab-results", { limit: 5 }],
  });

  const { data: insights = [] } = useQuery({
    queryKey: ["/api/insights"],
  });

  const { data: actionPlans = [] } = useQuery({
    queryKey: ["/api/action-plans", { status: "active" }],
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              Welcome, {user?.fullName?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Let's check your health today</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="w-5 h-5" />
              {insights.length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              )}
            </Button>
            <Link href="/profile">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-semibold cursor-pointer">
                {user?.fullName?.charAt(0) || 'U'}
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Health Score Card */}
        {healthScore && (
          <HealthScoreCard
            score={healthScore.overallScore}
            cardiovascularScore={healthScore.cardiovascularScore}
            metabolicScore={healthScore.metabolicScore}
            vitaminScore={healthScore.vitaminScore}
          />
        )}

        {/* Quick Actions */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/upload">
              <Card className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Upload Results</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Add lab reports</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/manual-entry">
              <Card className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <Edit className="w-6 h-6 text-secondary" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Manual Entry</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Enter data manually</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/trends">
              <Card className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">View Trends</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Historical data</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/action-plans">
              <Card className="cursor-pointer hover:shadow-md transition-all border-2 hover:border-primary">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center mb-3 mx-auto">
                    <CheckSquare className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">Action Plans</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Health goals</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Biomarkers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Biomarkers</h3>
            <Link href="/trends">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>

          <div className="space-y-3">
            {labResults.length > 0 ? (
              labResults.slice(0, 3).map((result: any) => (
                <BiomarkerCard
                  key={result.id}
                  name={result.testName}
                  value={parseFloat(result.value)}
                  unit={result.unit}
                  referenceMin={result.referenceMin ? parseFloat(result.referenceMin) : undefined}
                  referenceMax={result.referenceMax ? parseFloat(result.referenceMax) : undefined}
                  testDate={result.testDate}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-gray-400 mb-2">📊</div>
                  <p className="text-gray-600 dark:text-gray-400">No lab results yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                    Upload your first lab results to get started
                  </p>
                  <Link href="/upload">
                    <Button className="mt-3" size="sm">
                      Upload Results
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* AI Insights */}
        {insights.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">AI Insights</h3>
            <div className="space-y-3">
              {insights.slice(0, 2).map((insight: any) => (
                <Card key={insight.id} className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 border-purple-200 dark:border-purple-800">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                        <Brain className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-gray-900 dark:text-gray-100">{insight.title}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {insight.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{insight.content}</p>
                        <Button variant="ghost" size="sm" className="text-primary">
                          View Recommendations →
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Active Action Plans Preview */}
        {actionPlans.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Active Plans</h3>
              <Link href="/action-plans">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </div>
            
            <div className="space-y-3">
              {actionPlans.slice(0, 2).map((plan: any) => (
                <Card key={plan.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">{plan.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {plan.type === 'ai_generated' ? 'AI Generated' : 'Doctor Validated'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{plan.description}</p>
                    
                    {plan.tasks && (
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {plan.tasks.filter((t: any) => t.completed).length}/{plan.tasks.length} tasks
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-primary rounded-full h-2 transition-all duration-500" 
                            style={{ 
                              width: `${(plan.tasks.filter((t: any) => t.completed).length / plan.tasks.length) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      Created {formatRelativeDate(plan.createdAt)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
