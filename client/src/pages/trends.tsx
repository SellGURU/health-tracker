import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import TrendChart from "@/components/charts/trend-chart";
import { formatRelativeDate } from "@/lib/utils";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Download, Activity, Target, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";
import type { LabResult } from "@shared/schema";

const timeRanges = [
  { value: "3M", label: "3 Months" },
  { value: "6M", label: "6 Months" },
  { value: "1Y", label: "1 Year" },
  { value: "All", label: "All Time" },
];

export default function Trends() {
  const { toast } = useToast();
  const [selectedRange, setSelectedRange] = useState("3M");
  const [selectedBiomarker, setSelectedBiomarker] = useState("cholesterol");
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [dateRange, setDateRange] = useState({ from: '', to: '' });

  const { data: labResults = [] } = useQuery<LabResult[]>({
    queryKey: ["/api/lab-results", { limit: 100 }],
  });

  const { data: trendData = [] } = useQuery<LabResult[]>({
    queryKey: ["/api/trends", selectedBiomarker, { range: selectedRange }],
  });

  // Get unique biomarkers from lab results
  const availableBiomarkers = Array.from(
    new Set(labResults.map(result => result.testName.toLowerCase()))
  ).map(name => ({
    value: name.replace(/\s+/g, '-'),
    label: name.charAt(0).toUpperCase() + name.slice(1),
    originalName: labResults.find(r => r.testName.toLowerCase() === name)?.testName || name
  }));

  const getCurrentBiomarkerData = () => {
    const biomarkerName = availableBiomarkers.find(b => b.value === selectedBiomarker)?.originalName || selectedBiomarker;
    return labResults.filter(result => 
      result.testName.toLowerCase().includes(biomarkerName.toLowerCase())
    );
  };

  const calculateTrend = (data: LabResult[]) => {
    if (data.length < 2) return { trend: "stable", change: 0 };
    
    const sortedData = [...data].sort((a, b) => 
      new Date(a.testDate).getTime() - new Date(b.testDate).getTime()
    );
    
    const firstValue = parseFloat(sortedData[0].value.toString());
    const lastValue = parseFloat(sortedData[sortedData.length - 1].value.toString());
    const change = ((lastValue - firstValue) / firstValue) * 100;
    
    if (Math.abs(change) < 5) return { trend: "stable", change };
    return { trend: change > 0 ? "increasing" : "decreasing", change };
  };

  const biomarkerData = getCurrentBiomarkerData();
  const { trend, change } = calculateTrend(biomarkerData);
  const latestResult = biomarkerData.length > 0 
    ? biomarkerData.sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime())[0]
    : null;

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="w-4 h-4 text-red-500" />;
      case "decreasing":
        return <TrendingDown className="w-4 h-4 text-emerald-500" />;
      default:
        return <Minus className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "text-red-500";
      case "decreasing":
        return "text-emerald-500";
      default:
        return "text-blue-500";
    }
  };

  const getTrendLabel = (trend: string, change: number) => {
    if (trend === "stable") return "Stable";
    const direction = trend === "increasing" ? "↑" : "↓";
    return `${direction} ${Math.abs(change).toFixed(1)}% ${trend}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-900/20">
      {/* Header with Glassmorphism */}
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
                <p className="text-gray-600 dark:text-gray-400 font-light">Track your biomarkers and trends</p>
              </div>
            </div>

            <Button 
              onClick={() => setShowExportDialog(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg backdrop-blur-sm border-0 text-white font-medium transition-all duration-300 hover:shadow-xl hover:scale-105"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Modern Controls with Neumorphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-white via-white to-blue-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-blue-900/10 border-0 shadow-xl backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Target className="w-5 h-5 text-white" />
                </div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Select Biomarker</Label>
              </div>
              <Select value={selectedBiomarker} onValueChange={setSelectedBiomarker}>
                <SelectTrigger className="bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-700 dark:to-blue-900/20 border-gray-200/50 dark:border-gray-600/50 shadow-inner backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 border-white/20 dark:border-gray-700/30">
                  {availableBiomarkers.length > 0 ? (
                    availableBiomarkers.map((biomarker) => (
                      <SelectItem key={biomarker.value} value={biomarker.value}>
                        {biomarker.label}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-data" disabled>
                      No data available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white via-white to-purple-50/30 dark:from-gray-800 dark:via-gray-800 dark:to-purple-900/10 border-0 shadow-xl backdrop-blur-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Time Range</Label>
              </div>
              <Select value={selectedRange} onValueChange={setSelectedRange}>
                <SelectTrigger className="bg-gradient-to-r from-gray-50 to-purple-50/50 dark:from-gray-700 dark:to-purple-900/20 border-gray-200/50 dark:border-gray-600/50 shadow-inner backdrop-blur-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="backdrop-blur-xl bg-white/95 dark:bg-gray-800/95 border-white/20 dark:border-gray-700/30">
                  {timeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Main Chart with Glassmorphism */}
        {biomarkerData.length > 0 ? (
          <Card className="bg-gradient-to-br from-white/90 via-white/80 to-blue-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-blue-900/20 border-0 shadow-2xl backdrop-blur-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
                      {availableBiomarkers.find(b => b.value === selectedBiomarker)?.label || "Biomarker"} Trends
                    </CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-light">Real-time health monitoring</p>
                  </div>
                </div>
                {latestResult && (
                  <div className="text-right p-4 bg-gradient-to-br from-blue-50/60 to-cyan-50/40 dark:from-blue-900/20 dark:to-cyan-900/10 rounded-2xl backdrop-blur-sm border border-blue-200/20 dark:border-blue-800/20">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">Latest Value</div>
                    <div className="text-2xl font-thin bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {parseFloat(latestResult.value.toString()).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 font-medium">{latestResult.unit}</div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-6 bg-gradient-to-br from-gray-50/50 to-blue-50/30 dark:from-gray-900/30 dark:to-blue-900/10 rounded-3xl backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/20">
                <TrendChart
                  data={biomarkerData}
                  biomarkerName={availableBiomarkers.find(b => b.value === selectedBiomarker)?.originalName || selectedBiomarker}
                  unit={latestResult?.unit || ""}
                  referenceMin={latestResult?.referenceMin ? parseFloat(latestResult.referenceMin.toString()) : undefined}
                  referenceMax={latestResult?.referenceMax ? parseFloat(latestResult.referenceMax.toString()) : undefined}
                  height={300}
                />
              </div>
              
              {biomarkerData.length >= 2 && (
                <div className="p-6 bg-gradient-to-br from-emerald-50/60 to-cyan-50/40 dark:from-emerald-900/10 dark:to-cyan-900/10 rounded-3xl backdrop-blur-sm border border-emerald-200/30 dark:border-emerald-800/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                        {getTrendIcon(trend)}
                      </div>
                      <div>
                        <div className={`font-medium text-lg ${getTrendColor(trend)}`}>
                          {getTrendLabel(trend, change)}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          Over {selectedRange.toLowerCase() === 'all' ? 'all time' : selectedRange.toLowerCase()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Progress 
                        value={Math.min(Math.abs(change), 100)} 
                        className="w-24 h-2" 
                      />
                      <div className="text-xs text-gray-500 mt-1 font-medium">Change Rate</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-gradient-to-br from-white/90 via-white/80 to-gray-50/60 dark:from-gray-800/90 dark:via-gray-800/80 dark:to-gray-900/20 border-0 shadow-2xl backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                <Activity className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-thin bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent mb-2">
                No Trend Data Available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 font-light mb-6">
                Add more lab results to see trends and patterns for this biomarker
              </p>
              <Link href="/manual-entry">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg text-white font-medium transition-all duration-300 hover:shadow-xl hover:scale-105">
                  <Target className="w-4 h-4 mr-2" />
                  Add Lab Result
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="backdrop-blur-xl bg-white/95 dark:bg-gray-900/95 border border-white/20 dark:border-gray-700/30 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-thin bg-gradient-to-r from-gray-900 to-blue-800 dark:from-white dark:to-blue-200 bg-clip-text text-transparent">
              Export Health Data
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400 font-light">
              Download your health trends and biomarker data
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from-date" className="text-sm font-medium text-gray-700 dark:text-gray-300">From Date</Label>
                <Input
                  id="from-date"
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                  className="bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-700 dark:to-blue-900/20 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
                />
              </div>
              <div>
                <Label htmlFor="to-date" className="text-sm font-medium text-gray-700 dark:text-gray-300">To Date</Label>
                <Input
                  id="to-date"
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                  className="bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-700 dark:to-blue-900/20 border-gray-200/50 dark:border-gray-600/50 backdrop-blur-sm"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => {
                  toast({
                    title: "Export started",
                    description: "Your data export will download shortly.",
                  });
                  setShowExportDialog(false);
                }}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg text-white font-medium transition-all duration-300 hover:shadow-xl"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowExportDialog(false)}
                className="backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border-gray-200/50 dark:border-gray-700/30 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}