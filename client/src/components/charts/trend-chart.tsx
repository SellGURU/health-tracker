import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format, parseISO } from "date-fns";
import type { LabResult } from "@shared/schema";

interface TrendChartProps {
  data: LabResult[];
  biomarkerName: string;
  unit: string;
  referenceMin?: number;
  referenceMax?: number;
  height?: number;
}

export default function TrendChart({ 
  data, 
  biomarkerName, 
  unit, 
  referenceMin, 
  referenceMax,
  height = 200 
}: TrendChartProps) {
  const chartData = useMemo(() => {
    return data
      .filter(result => result.testName.toLowerCase().includes(biomarkerName.toLowerCase()))
      .sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime())
      .map(result => ({
        date: format(new Date(result.testDate), 'MMM dd'),
        value: parseFloat(result.value.toString()),
        fullDate: result.testDate,
        referenceMin,
        referenceMax,
      }));
  }, [data, biomarkerName, referenceMin, referenceMax]);

  if (chartData.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg border">
        <div className="text-center">
          <div className="text-gray-400 mb-2">📊</div>
          <p className="text-gray-600 dark:text-gray-400">No data available for {biomarkerName}</p>
        </div>
      </div>
    );
  }

  const getLineColor = () => {
    const latestValue = chartData[chartData.length - 1]?.value;
    if (!latestValue || !referenceMin || !referenceMax) return "#3B82F6";
    
    if (latestValue >= referenceMin && latestValue <= referenceMax) return "#10B981";
    if (latestValue < referenceMin || latestValue > referenceMax) return "#EF4444";
    return "#F59E0B";
  };

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis 
            dataKey="date" 
            fontSize={12}
            tick={{ fill: '#6B7280' }}
          />
          <YAxis 
            fontSize={12}
            tick={{ fill: '#6B7280' }}
            domain={['dataMin - 10', 'dataMax + 10']}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
            }}
            formatter={(value, name) => [`${value} ${unit}`, biomarkerName]}
            labelFormatter={(label) => `Date: ${label}`}
          />
          
          {/* Reference range lines */}
          {referenceMin && (
            <Line
              type="monotone"
              dataKey="referenceMin"
              stroke="#EF4444"
              strokeDasharray="5 5"
              strokeWidth={1}
              dot={false}
              legendType="none"
            />
          )}
          {referenceMax && (
            <Line
              type="monotone"
              dataKey="referenceMax"
              stroke="#EF4444"
              strokeDasharray="5 5"
              strokeWidth={1}
              dot={false}
              legendType="none"
            />
          )}
          
          {/* Main data line */}
          <Line
            type="monotone"
            dataKey="value"
            stroke={getLineColor()}
            strokeWidth={3}
            dot={{ fill: getLineColor(), strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: getLineColor(), strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      {referenceMin && referenceMax && (
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Normal range: {referenceMin} - {referenceMax} {unit}
        </div>
      )}
    </div>
  );
}
