import { useState, useMemo, useEffect } from "react";
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
  Calendar,
  MoreHorizontal
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { LabResult } from "@shared/schema";
import Application from "@/api/app";

// Mock biomarker data for enhanced UI
// const mockBiomarkers = [
//   {
//     id: 'ldl-cholesterol',
//     name: 'LDL Cholesterol',
//     value: 120,
//     unit: 'mg/dL',
//     status: 'normal', // normal, high, low, critical
//     lastTest: '2024-01-15',
//     referenceRange: '< 100',
//     trend: 'improving',
//     trendPercent: -8.5,
//     icon: Heart,
//     color: 'from-red-500 to-pink-500',
//     bgColor: 'from-red-50/80 to-pink-50/60 dark:from-red-900/20 dark:to-pink-900/10',
//     statusColor: 'text-yellow-600',
//     description: 'LDL cholesterol should be less than 100 mg/dL for optimal heart health.',
//     recommendations: [
//       'Follow a Mediterranean-style diet',
//       'Exercise regularly (150 min/week)',
//       'Consider omega-3 supplements',
//       'Reduce saturated fat intake'
//     ],
//     insights: [
//       'Your LDL levels have improved by 8.5% since last month',
//       'Current trend suggests you\'re on track to reach optimal levels',
//       'Continue current lifestyle modifications'
//     ]
//   },
//   {
//     id: 'white-blood-cells',
//     name: 'White Blood Cells',
//     value: 6800,
//     unit: '/µL',
//     status: 'normal',
//     lastTest: '2024-01-10',
//     referenceRange: '4,000-11,000',
//     trend: 'stable',
//     trendPercent: 2.1,
//     icon: Droplets,
//     color: 'from-blue-500 to-cyan-500',
//     bgColor: 'from-blue-50/80 to-cyan-50/60 dark:from-blue-900/20 dark:to-cyan-900/10',
//     statusColor: 'text-emerald-600',
//     description: 'White blood cells help fight infections and diseases.',
//     recommendations: [
//       'Maintain good hygiene practices',
//       'Get adequate sleep (7-9 hours)',
//       'Eat immune-boosting foods',
//       'Manage stress levels'
//     ],
//     insights: [
//       'Your white blood cell count is within healthy range',
//       'Stable levels indicate good immune function',
//       'No immediate concerns detected'
//     ]
//   },
//   {
//     id: 'hdl-cholesterol',
//     name: 'HDL Cholesterol',
//     value: 45,
//     unit: 'mg/dL',
//     status: 'low',
//     lastTest: '2024-01-15',
//     referenceRange: '> 40 (M), > 50 (F)',
//     trend: 'improving',
//     trendPercent: 12.5,
//     icon: Heart,
//     color: 'from-emerald-500 to-teal-500',
//     bgColor: 'from-emerald-50/80 to-teal-50/60 dark:from-emerald-900/20 dark:to-teal-900/10',
//     statusColor: 'text-orange-600',
//     description: 'HDL cholesterol helps remove other forms of cholesterol from bloodstream.',
//     recommendations: [
//       'Increase aerobic exercise',
//       'Add healthy fats to diet',
//       'Quit smoking if applicable',
//       'Consider niacin supplements'
//     ],
//     insights: [
//       'HDL levels have improved by 12.5% - great progress!',
//       'Continue current exercise routine',
//       'Consider adding more olive oil and nuts to diet'
//     ]
//   },
//   {
//     id: 'glucose',
//     name: 'Blood Glucose',
//     value: 95,
//     unit: 'mg/dL',
//     status: 'normal',
//     lastTest: '2024-01-12',
//     referenceRange: '70-100',
//     trend: 'stable',
//     trendPercent: -1.2,
//     icon: Activity,
//     color: 'from-purple-500 to-indigo-500',
//     bgColor: 'from-purple-50/80 to-indigo-50/60 dark:from-purple-900/20 dark:to-indigo-900/10',
//     statusColor: 'text-emerald-600',
//     description: 'Fasting blood glucose measures sugar levels in blood.',
//     recommendations: [
//       'Maintain current diet',
//       'Continue regular exercise',
//       'Monitor carbohydrate intake',
//       'Stay hydrated'
//     ],
//     insights: [
//       'Excellent glucose control maintained',
//       'Low diabetes risk based on current levels',
//       'Stable metabolic health indicators'
//     ]
//   },
//   {
//     id: 'creatinine',
//     name: 'Creatinine',
//     value: 1.1,
//     unit: 'mg/dL',
//     status: 'normal',
//     lastTest: '2024-01-08',
//     referenceRange: '0.6-1.2',
//     trend: 'stable',
//     trendPercent: 0.9,
//     icon: Droplets,
//     color: 'from-cyan-500 to-blue-500',
//     bgColor: 'from-cyan-50/80 to-blue-50/60 dark:from-cyan-900/20 dark:to-blue-900/10',
//     statusColor: 'text-emerald-600',
//     description: 'Creatinine levels indicate kidney function.',
//     recommendations: [
//       'Stay well hydrated',
//       'Maintain healthy blood pressure',
//       'Limit protein supplements',
//       'Regular kidney function monitoring'
//     ],
//     insights: [
//       'Kidney function appears normal',
//       'Stable creatinine levels over time',
//       'Continue current health practices'
//     ]
//   },
//   {
//     id: 'free-testosterone',
//     name: 'Free Testosterone',
//     value: 18.5,
//     unit: 'pg/mL',
//     status: 'normal',
//     lastTest: '2024-01-05',
//     referenceRange: '9-30',
//     trend: 'improving',
//     trendPercent: 15.6,
//     icon: Activity,
//     color: 'from-orange-500 to-red-500',
//     bgColor: 'from-orange-50/80 to-red-50/60 dark:from-orange-900/20 dark:to-red-900/10',
//     statusColor: 'text-emerald-600',
//     description: 'Free testosterone affects energy, muscle mass, and mood.',
//     recommendations: [
//       'Maintain strength training',
//       'Get adequate sleep',
//       'Manage stress levels',
//       'Consider zinc supplementation'
//     ],
//     insights: [
//       'Testosterone levels improving by 15.6%',
//       'Good response to lifestyle changes',
//       'Energy and vitality should improve'
//     ]
//   }
// ];

export default function Trends() {
  const { toast } = useToast();
  const [mockBiomarkers,setMochBiomarkers] = useState<Array<any>>([])
  const [expandedCards, setExpandedCards] = useState<{[key: string]: boolean}>({});
  const [selectedBiomarker, setSelectedBiomarker] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [activeTab, setActiveTab] = useState('results');
  const [searchQuery, setSearchQuery] = useState('');
  const resolveColor = (key: string) => {
    if (key == 'Needs Focus' || key == 'CriticalRange') {
      return '#B2302E';
    }
    if (key == 'DiseaseRange') {
      return '#BA5225';
    }
    if (key == 'Ok' || key == 'BorderlineRange') {
      return '#D8D800';
    }
    if (key == 'Good' || key == 'HealthyRange') {
      return '#72C13B';
    }
    if (key == 'Excellent' || key == 'OptimalRange') {
      return '#37B45E';
    }
    return '#FBAD37';
  };  
  useEffect(() => {
    Application.getBiomarkersData().then((res) => {
      console.log(res)
      setMochBiomarkers(res.data.biomarkers)
    })
  },[])
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

  const filteredBiomarkers = useMemo(() => {
    if (!searchQuery) return mockBiomarkers;
    return mockBiomarkers.filter(biomarker =>
      biomarker.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery,mockBiomarkers]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900/20">
      <div className="w-full max-w-none mx-auto px-4 py-6 overflow-hidden">
        {/* Your Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-thin bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-2">
            Your Results
          </h2>
          <p className="text-gray-600 dark:text-gray-400 font-light mb-4">Click on any biomarker to view detailed information</p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Input
              type="text"
              placeholder="Search biomarkers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-4 pr-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-xl"
            />
          </div>
        </div>

        {/* Biomarker Cards - Single Column */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {filteredBiomarkers.map((biomarker) => {
            const Icon = biomarker.icon;
            const isExpanded = expandedCards[biomarker.id];
            const statusBadge = getStatusBadge(biomarker.status);
            const optimalRange = biomarker.chart_bounds.filter((el:any) =>el.status == 'OptimalRange')[0]

            return (
              <Card 
                key={biomarker.name} 
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer rounded-xl"
                onClick={() => openDetailModal(biomarker)}
              >
                <CardContent className="p-6">
                  {/* Card Header */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 bg-gradient-to-br  rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                        <Droplets color="red"></Droplets>
                        {/* <Icon className="w-5 h-5 text-white" /> */}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-base truncate">
                          {biomarker.name}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Last test: {new Date(biomarker.date[0]).toLocaleDateString()}
                      </p>
                      <Badge style={{backgroundColor:resolveColor(biomarker.status)}} className={`text-xs flex-shrink-0`}>
                        {biomarker.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Current Value */}
                  <div className="mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                        {biomarker.values[0].toLocaleString()}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {biomarker.unit}
                      </span>
                    </div>
                  </div>

                  {/* Reference Range */}
                  <div className="mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-lg">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Optimal Range</div>
                    <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {optimalRange?.low ==null && '>'}
                      {optimalRange?.high ==null && '<'}
                      {optimalRange?.low??""} 
                      {optimalRange?.low !=null && optimalRange?.high != null && "-"}
                      {optimalRange?.high}
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
                <div style={{color:resolveColor(selectedBiomarker.status[0])}} className={`w-12 h-12 bg-gradient-to-br rounded-2xl flex items-center justify-center shadow-lg`}>
                  <Droplets></Droplets>
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
                          {selectedBiomarker.values[0].toLocaleString()}
                        </div>
                        <div className="text-lg text-gray-600 dark:text-gray-400">
                          {selectedBiomarker.unit}
                        </div>
                        <Badge style={{backgroundColor:resolveColor(selectedBiomarker.status[0])}} className={`mt-3`}>
                          {selectedBiomarker.status[0].toUpperCase()}
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
                          <span className="text-gray-600 dark:text-gray-400">Optimal Range:</span>
                          <span className="font-medium">{selectedBiomarker.referenceRange}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Last Test:</span>
                          <span className="font-medium">{new Date(selectedBiomarker.date[0]).toLocaleDateString()}</span>
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
                      {selectedBiomarker.more_info}
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="improve" className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">Recommendations to Improve</h3>
                <div className="grid gap-4">
                  {/* {selectedBiomarker.recommendations.map((rec: string, index: number) => (
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
                  ))} */}
                    <Card  className="bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-900/20 dark:to-teal-900/10">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                          <p className="text-gray-700 dark:text-gray-300">{selectedBiomarker.how_to_improve}</p>
                        </div>
                      </CardContent>
                    </Card>                  
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-4 mt-6">
                <h3 className="text-lg font-medium">AI-Generated Insights</h3>
                <div className="grid gap-4">
                  {/* {selectedBiomarker.insights.map((insight: string, index: number) => (
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
                  ))} */}
                  <Card className="bg-gradient-to-br from-blue-50/80 to-indigo-50/60 dark:from-blue-900/20 dark:to-indigo-900/10">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Brain className="w-4 h-4 text-white" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{selectedBiomarker.insight}</p>
                      </div>
                    </CardContent>
                  </Card>                  
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}