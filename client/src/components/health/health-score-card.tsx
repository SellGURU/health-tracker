import { Card, CardContent } from "@/components/ui/card";
import { calculateHealthScoreColor, calculateHealthScoreGradient } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface HealthScoreCardProps {
  score: number;
  cardiovascularScore?: number;
  metabolicScore?: number;
  vitaminScore?: number;
  className?: string;
}

export default function HealthScoreCard({ 
  score, 
  cardiovascularScore,
  metabolicScore,
  vitaminScore,
  className 
}: HealthScoreCardProps) {

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="p-0">
        <div className={cn("p-6 text-white bg-gradient-to-r", calculateHealthScoreGradient(score))}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Your Health Score</h3>
              <p className="text-white/80 text-sm">Based on recent data</p>
            </div>
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-2xl font-bold">{score}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-white/20 rounded-full h-2">
              <div 
                className="bg-white rounded-full h-2 transition-all duration-500" 
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="text-sm font-medium">{score}%</span>
          </div>
        </div>

        {(cardiovascularScore || metabolicScore || vitaminScore) && (
          <div className="p-4 bg-gray-50 dark:bg-gray-900">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Category Breakdown</h4>
            <div className="space-y-2">
              {cardiovascularScore && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Cardiovascular</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-blue-500 rounded-full h-1.5 transition-all duration-500"
                        style={{ width: `${cardiovascularScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-8">
                      {cardiovascularScore}
                    </span>
                  </div>
                </div>
              )}
              
              {metabolicScore && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Metabolic</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-green-500 rounded-full h-1.5 transition-all duration-500"
                        style={{ width: `${metabolicScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-8">
                      {metabolicScore}
                    </span>
                  </div>
                </div>
              )}
              
              {vitaminScore && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Vitamins</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-yellow-500 rounded-full h-1.5 transition-all duration-500"
                        style={{ width: `${vitaminScore}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 w-8">
                      {vitaminScore}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
