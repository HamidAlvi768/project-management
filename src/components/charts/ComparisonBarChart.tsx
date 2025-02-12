import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatYAxis, formatTooltip, CHART_COLORS } from './utils';

export interface ComparisonData {
  name: string;
  [key: string]: string | number;
}

export interface ComparisonBarChartProps {
  title: string;
  data: ComparisonData[];
  estimatedKey: string;
  actualKey: string;
  yAxisLabel: string;
  className?: string;
  formatValue?: boolean;
  currencyPrefix?: string;
  colorScheme?: keyof typeof CHART_COLORS;
}

export const ComparisonBarChart: React.FC<ComparisonBarChartProps> = ({
  title,
  data,
  estimatedKey,
  actualKey,
  yAxisLabel,
  className,
  formatValue = false,
  currencyPrefix,
  colorScheme = 'blue'
}) => {
  const colors = CHART_COLORS[colorScheme];
  const shouldFormat = formatValue || estimatedKey.toLowerCase().includes('cost');

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={data} 
            margin={{ 
              top: 20, 
              right: 30, 
              left: shouldFormat ? 60 : 40, 
              bottom: 20 
            }}
            barGap={0}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              height={40}
            />
            <YAxis 
              label={{ 
                value: yAxisLabel, 
                angle: -90, 
                position: 'insideLeft',
                offset: -20,
                style: {
                  textAnchor: 'middle'
                }
              }}
              tickFormatter={shouldFormat ? formatYAxis : undefined}
              width={shouldFormat ? 80 : 40}
            />
            <Tooltip 
              formatter={(value: number, name: string) => 
                formatTooltip(value, name, currencyPrefix)
              } 
            />
            <Legend />
            <Bar 
              dataKey={estimatedKey} 
              fill={colors.estimated}
              name="Estimated" 
            />
            <Bar 
              dataKey={actualKey} 
              fill={colors.actual}
              name="Actual" 
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}; 