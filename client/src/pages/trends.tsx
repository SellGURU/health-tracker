import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import TrendChart from "@/components/charts/trend-chart";
import { formatRelativeDate } from "@/lib/utils";
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Download, 
  Activity, 
  Target, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  Info,
  Heart,
  Brain,
  Droplets,
  CheckCircle,
  AlertTriangle,
  X,
  BarChart3,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { LabResult } from "@shared/schema";

// Mock biomarker data for enhanced UI
const mockBiomarkers = [
  {
    id: 'ldl-cholesterol',
    name: 'LDL Cholesterol',
    value: 120,
    unit: 'mg/dL',
    status: 'normal', // normal, high, low, critical
    lastTest: '2024-01-15',
    referenceRange: '< 100',
    trend: 'improving',
    trendPercent: -8.5,
    icon: Heart,
    color: 'from-red-500 to-pink-500',
    bgColor: 'from-red-50/80 to-pink-50/60 dark:from-red-900/20 dark:to-pink-900/10',
    statusColor: 'text-yellow-600',
    description: 'LDL cholesterol should be less than 100 mg/dL for optimal heart health.',
    recommendations: [
      'Follow a Mediterranean-style diet',
      'Exercise regularly (150 min/week)',
      'Consider omega-3 supplements',
      'Reduce saturated fat intake'
    ],
    insights: [
      'Your LDL levels have improved by 8.5% since last month',
      'Current trend suggests you\'re on track to reach optimal levels',
      'Continue current lifestyle modifications'
    ]
  },
  {
    id: 'white-blood-cells',
    name: 'White Blood Cells',
    value: 6800,
    unit: '/µL',
    status: 'normal',
    lastTest: '2024-01-10',
    referenceRange: '4,000-11,000',
    trend: 'stable',
    trendPercent: 2.1,
    icon: Droplets,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'from-blue-50/80 to-cyan-50/60 dark:from-blue-900/20 dark:to-cyan-900/10',
    statusColor: 'text-emerald-600',
    description: 'White blood cells help fight infections and diseases.',
    recommendations: [
      'Maintain good hygiene practices',
      'Get adequate sleep (7-9 hours)',
      'Eat immune-boosting foods',
      'Manage stress levels'
    ],
    insights: [
      'Your white blood cell count is within healthy range',
      'Stable levels indicate good immune function',
      'No immediate concerns detected'
    ]
  },
  {
    id: 'hdl-cholesterol',
    name: 'HDL Cholesterol',
    value: 45,
    unit: 'mg/dL',
    status: 'low',
    lastTest: '2024-01-15',
    referenceRange: '> 40 (M), > 50 (F)',
    trend: 'improving',
    trendPercent: 12.5,
    icon: Heart,
    color: 'from-emerald-500 to-teal-500',
    bgColor: 'from-emerald-50/80 to-teal-50/60 dark:from-emerald-900/20 dark:to-teal-900/10',
    statusColor: 'text-orange-600',
    description: 'HDL cholesterol helps remove other forms of cholesterol from bloodstream.',
    recommendations: [
      'Increase aerobic exercise',
      'Add healthy fats to diet',
      'Quit smoking if applicable',
      'Consider niacin supplements'
    ],
    insights: [
      'HDL levels have improved by 12.5% - great progress!',
      'Continue current exercise routine',
      'Consider adding more olive oil and nuts to diet'
    ]
  },
  {
    id: 'glucose',
    name: 'Blood Glucose',
    value: 95,
    unit: 'mg/dL',
    status: 'normal',
    lastTest: '2024-01-12',
    referenceRange: '70-100',
    trend: 'stable',
    trendPercent: -1.2,
    icon: Activity,
    color: 'from-purple-500 to-indigo-500',
    bgColor: 'from-purple-50/80 to-indigo-50/60 dark:from-purple-900/20 dark:to-indigo-900/10',
    statusColor: 'text-emerald-600',
    description: 'Fasting blood glucose measures sugar levels in blood.',
    recommendations: [
      'Maintain current diet',
      'Continue regular exercise',
      'Monitor carbohydrate intake',
      'Stay hydrated'
    ],
    insights: [
      'Excellent glucose control maintained',
      'Low diabetes risk based on current levels',
      'Stable metabolic health indicators'
    ]
  },
  {
    id: 'creatinine',
    name: 'Creatinine',
    value: 1.1,
    unit: 'mg/dL',
    status: 'normal',
    lastTest: '2024-01-08',
    referenceRange: '0.6-1.2',
    trend: 'stable',
    trendPercent: 0.9,
    icon: Droplets,
    color: 'from-cyan-500 to-blue-500',
    bgColor: 'from-cyan-50/80 to-blue-50/60 dark:from-cyan-900/20 dark:to-blue-900/10',
    statusColor: 'text-emerald-600',
    description: 'Creatinine levels indicate kidney function.',
    recommendations: [
      'Stay well hydrated',
      'Maintain healthy blood pressure',
      'Limit protein supplements',
      'Regular kidney function monitoring'
    ],
    insights: [
      'Kidney function appears normal',
      'Stable creatinine levels over time',
      'Continue current health practices'
    ]
  },
  {
    id: 'free-testosterone',
    name: 'Free Testosterone',
    value: 18.5,
    unit: 'pg/mL',
    status: 'normal',
    lastTest: '2024-01-05',
    referenceRange: '9-30',
    trend: 'improving',
    trendPercent: 15.6,
    icon: Activity,
    color: 'from-orange-500 to-red-500',
    bgColor: 'from-orange-50/80 to-red-50/60 dark:from-orange-900/20 dark:to-red-900/10',
    statusColor: 'text-emerald-600',
    description: 'Free testosterone affects energy, muscle mass, and mood.',
    recommendations: [
      'Maintain strength training',
      'Get adequate sleep',
      'Manage stress levels',
      'Consider zinc supplementation'
    ],
    insights: [
      'Testosterone levels improving by 15.6%',
      'Good response to lifestyle changes',
      'Energy and vitality should improve'
    ]
  }
];

export default function Trends() {
  const { toast } = useToast();
  const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({});
  const [selectedBiomarker, setSelectedBiomarker] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState('results');

  const { data: labResults = [] } = useQuery<LabResult[]>({
    queryKey: ["/api/lab-results", { limit: 100 }],
  });

  const toggleCardExpansion = (biomarkerId: string) => {
    setExpandedCards(prev => ({
      ...prev,
      [biomarkerId]: !prev[biomarkerId]
    }));
  };

  const openDetailModal = (biomarker: any) => {
    setSelectedBiomarker(biomarker);
    setShowDetailModal(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      normal: { variant: 'default', color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' },
      high: { variant: 'destructive', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' },
      low: { variant: 'secondary', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300' },
      critical: { variant: 'destructive', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' }
    };
    return variants[status as keyof typeof variants] || variants.normal;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="w-4 h-4 text-emerald-500" />;
      case 'declining':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-blue-500" />;
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900/20">
      {/* Header */}
      <div className="backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-white/20 dark:border-gray-700/30 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="backdrop-blur-sm bg-white/60 dark:bg-gray-800/60 border-white/30 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-thin bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                  Health Monitor
                </h1>
                <p className="text-gray-600 dark:text-gray-400 font-light">Track your biomarkers and health metrics</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Your Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-thin bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-2">
            Your Results
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-light">Click on any biomarker to view detailed information</p>
        </div>

        {/* Biomarker Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockBiomarkers.map((biomarker) => {
            const Icon = biomarker.icon;
            const isExpanded = expandedCards[biomarker.id];
            const statusBadge = getStatusBadge(biomarker.status);
            
            return (
              <Card 
                key={biomarker.id} 
                className={`bg-gradient-to-br ${biomarker.bgColor} border-0 shadow-xl backdrop-blur-lg hover:shadow-2xl transition-all duration-300 cursor-pointer ${
                  isExpanded ? 'lg:col-span-2' : ''
                }`}
                onClick={() => openDetailModal(biomarker)}
              >
                <CardContent className="p-5">
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-br ${biomarker.color} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 dark:text-gray-100 leading-tight">
                          {biomarker.name}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Last test: {new Date(biomarker.lastTest).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={statusBadge.color}>
                        {biomarker.status}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleCardExpansion(biomarker.id);
                        }}
                        className="h-6 w-6 p-0 hover:bg-white/50"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Current Value */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-thin text-gray-900 dark:text-gray-100">
                        {biomarker.value.toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {biomarker.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {getTrendIcon(biomarker.trend)}
                      <span className={`text-sm font-medium ${
                        biomarker.trend === 'improving' ? 'text-emerald-600' :
                        biomarker.trend === 'declining' ? 'text-red-600' : 'text-blue-600'
                      }`}>
                        {biomarker.trendPercent > 0 ? '+' : ''}{biomarker.trendPercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  {/* Reference Range */}
                  <div className="mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Reference Range</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {biomarker.referenceRange}
                    </div>
                  </div>

                  {/* Expanded Graph View */}
                  {isExpanded && (
                    <div className="mt-4 p-4 bg-white/30 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                        Trend Chart
                      </h4>
                      <div className="h-40 bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10 rounded-lg flex items-center justify-center">
                        <div className="text-center text-gray-500 dark:text-gray-400">
                          <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">Interactive chart showing trends over time</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Detailed Information Modal */}
      {selectedBiomarker && (
        <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-br ${selectedBiomarker.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <selectedBiomarker.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-thin">
                    {selectedBiomarker.name}
                  </DialogTitle>
                  <DialogDescription>
                    Detailed analysis and recommendations
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="results">Results</TabsTrigger>
                <TabsTrigger value="improve">How to Improve</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* Current Value Card */}
                  <Card className={`bg-gradient-to-br ${selectedBiomarker.bgColor}`}>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">Current Value</h3>
                      <div className="text-center">
                        <div className="text-4xl font-thin text-gray-900 dark:text-gray-100 mb-2">
                          {selectedBiomarker.value.toLocaleString()}
                        </div>
                        <div className="text-lg text-gray-600 dark:text-gray-400">
                          {selectedBiomarker.unit}
                        </div>
                        <Badge className={`mt-3 ${getStatusBadge(selectedBiomarker.status).color}`}>
                          {selectedBiomarker.status.toUpperCase()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Reference Range Card */}
                  <Card className="bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-800 dark:to-blue-900/10">
                    <CardContent className="p-6">
                      <h3 className="text-lg font-medium mb-4">Reference Range</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Normal Range:</span>
                          <span className="font-medium">{selectedBiomarker.referenceRange}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Last Test:</span>
                          <span className="font-medium">{new Date(selectedBiomarker.lastTest).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600 dark:text-gray-400">Trend:</span>
                          <div className="flex items-center gap-2">
                            {getTrendIcon(selectedBiomarker.trend)}
                            <span className={`font-medium ${
                              selectedBiomarker.trend === 'improving' ? 'text-emerald-600' :
                              selectedBiomarker.trend === 'declining' ? 'text-red-600' : 'text-blue-600'
                            }`}>
                              {selectedBiomarker.trendPercent > 0 ? '+' : ''}{selectedBiomarker.trendPercent.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Description */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-3">About This Biomarker</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {selectedBiomarker.description}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="improve" className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Recommendations to Improve</h3>
                <div className="grid gap-4">
                  {selectedBiomarker.recommendations.map((rec: string, index: number) => (
                    <Card key={index} className="bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-900/20 dark:to-teal-900/10">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{rec}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">AI-Generated Insights</h3>
                <div className="grid gap-4">
                  {selectedBiomarker.insights.map((insight: string, index: number) => (
                    <Card key={index} className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 dark:from-blue-900/20 dark:to-indigo-900/10">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{insight}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}