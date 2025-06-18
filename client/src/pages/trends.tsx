import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import TrendChart from "@/components/charts/trend-chart";
import { formatRelativeDate } from "@/lib/utils";
import { ArrowLeft, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { Link } from "wouter";
import type { LabResult } from "@shared/schema";

const timeRanges = [
  { value: "3M", label: "3 Months" },
  { value: "6M", label: "6 Months" },
  { value: "1Y", label: "1 Year" },
  { value: "All", label: "All Time" },
];

export default function Trends() {
  const [selectedRange, setSelectedRange] = useState("3M");
  const [selectedBiomarker, setSelectedBiomarker] = useState("cholesterol");

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
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case "decreasing":
        return <TrendingDown className="w-4 h-4 text-green-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "text-red-600";
      case "decreasing":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  const getTrendLabel = (trend: string, change: number) => {
    if (trend === "stable") return "Stable";
    const direction = trend === "increasing" ? "↑" : "↓";
    return `${direction} ${Math.abs(change).toFixed(1)}% ${trend}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mr-4">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Health Trends</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Biomarker
            </label>
            <Select value={selectedBiomarker} onValueChange={setSelectedBiomarker}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Time Range
            </label>
            <Select value={selectedRange} onValueChange={setSelectedRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {timeRanges.map((range) => (
                  <SelectItem key={range.value} value={range.value}>
                    {range.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Chart */}
        {biomarkerData.length > 0 ? (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  {availableBiomarkers.find(b => b.value === selectedBiomarker)?.label || "Biomarker"} Trend
                </CardTitle>
                {latestResult && (
                  <div className="text-right">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Latest:</div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100">
                      {parseFloat(latestResult.value.toString()).toLocaleString()} {latestResult.unit}
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <TrendChart
                data={biomarkerData}
                biomarkerName={availableBiomarkers.find(b => b.value === selectedBiomarker)?.originalName || selectedBiomarker}
                unit={latestResult?.unit || ""}
                referenceMin={latestResult?.referenceMin ? parseFloat(latestResult.referenceMin.toString()) : undefined}
                referenceMax={latestResult?.referenceMax ? parseFloat(latestResult.referenceMax.toString()) : undefined}
                height={250}
              />
              
              {biomarkerData.length >= 2 && (
                <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTrendIcon(trend)}
                      <span className={`font-medium ${getTrendColor(trend)}`}>
                        {getTrendLabel(trend, change)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Over {selectedRange.toLowerCase() === 'all' ? 'all time' : selectedRange.toLowerCase()}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-gray-400 mb-2">📊</div>
              <p className="text-gray-600 dark:text-gray-400">No trend data available</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Add more lab results to see trends for this biomarker
              </p>
              <Link href="/manual-entry">
                <Button className="mt-3" size="sm">
                  Add Lab Result
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Additional Biomarker Cards */}
        {labResults.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Results</h3>
            <div className="grid gap-4">
              {/* Show recent unique biomarkers */}
              {Array.from(new Map(
                labResults
                  .sort((a, b) => new Date(b.testDate).getTime() - new Date(a.testDate).getTime())
                  .map(result => [result.testName.toLowerCase(), result])
              ).values()).slice(0, 3).map((result) => {
                const biomarkerTrendData = labResults.filter(r => 
                  r.testName.toLowerCase() === result.testName.toLowerCase()
                );
                const biomarkerTrend = calculateTrend(biomarkerTrendData);

                return (
                  <Card key={result.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-gray-100">{result.testName}</h4>
                        <div className="flex items-center space-x-1">
                          {getTrendIcon(biomarkerTrend.trend)}
                          <span className={`text-sm ${getTrendColor(biomarkerTrend.trend)}`}>
                            {biomarkerTrend.trend === 'stable' ? 'Stable' : `${Math.abs(biomarkerTrend.change).toFixed(1)}%`}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-gray-900 dark:text-gray-100">
                            {parseFloat(result.value.toString()).toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                            {result.unit}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            {formatRelativeDate(result.testDate)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-500">
                            {biomarkerTrendData.length} test{biomarkerTrendData.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* No Data State */}
        {labResults.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center">
              <div className="text-gray-400 mb-2">📈</div>
              <p className="text-gray-600 dark:text-gray-400">No lab results available</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1 mb-4">
                Start tracking your health by adding lab results
              </p>
              <div className="flex gap-2 justify-center">
                <Link href="/upload">
                  <Button size="sm">Upload Results</Button>
                </Link>
                <Link href="/manual-entry">
                  <Button variant="outline" size="sm">Manual Entry</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
