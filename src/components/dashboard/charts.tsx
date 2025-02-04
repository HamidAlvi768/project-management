import * as React from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend as RechartsLegend,
  ResponsiveContainer,
  PieChart,
  Pie as RechartsPie,
  Cell,
  LineChart,
  Line,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip as ChartTooltip,
  Legend as ChartLegend,
  type ChartData,
  type ChartOptions
} from 'chart.js';
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

ChartJS.register(ArcElement, ChartTooltip, ChartLegend);

interface MonthlyData {
  month: string
  income: number
  expenses: number
}

interface ExpenseBreakdown {
  category: string
  amount: number
  percentage: number
}

interface IncomeVsExpenseChartProps {
  data: MonthlyData[]
}

interface ExpenseBreakdownChartProps {
  data: ExpenseBreakdown[]
}

const COLORS = [
  "#7C3AED", // Purple for Invoiced
  "#EF4444", // Red for Pending
  "#10B981", // Green for Received
]

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text 
      x={x} 
      y={y} 
      fill="white"
      textAnchor="middle" 
      dominantBaseline="central"
      className="text-sm font-medium"
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-2 shadow-lg rounded-lg border border-gray-200">
        <p className="text-sm font-medium">
          {data.category}: {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(data.amount)}
        </p>
      </div>
    );
  }
  return null;
};

interface LegendItemProps {
  color: string
  label: string
  value: string | number
}

function LegendItem({ color, label, value }: LegendItemProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div 
        className="w-2 h-2 rounded-full" 
        style={{ backgroundColor: color }}
      />
      <span className="text-xs text-gray-600">{label}</span>
      <span className="text-xs font-medium text-gray-900">${value}</span>
    </div>
  )
}

function CustomLegend({ items }: { items: LegendItemProps[] }) {
  return (
    <div className="grid grid-cols-3 gap-x-4 gap-y-2 mt-2 px-4">
      {items.map((item) => (
        <LegendItem key={item.label} {...item} />
      ))}
    </div>
  )
}

type ChartDataType = ChartData<'pie', number[], string>;
type ChartOptionsType = ChartOptions<'pie'>;

export function IncomeVsExpenseChart({ data }: IncomeVsExpenseChartProps) {
  const [period, setPeriod] = React.useState<'monthly' | 'yearly'>('monthly')

  return (
    <Card className="bg-white h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <CardTitle className="text-xl font-medium">Income vs Expenses</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="reverse-add" className="h-8">
              {period === 'monthly' ? 'Monthly' : 'Yearly'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setPeriod('monthly')}>
              Monthly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPeriod('yearly')}>
              Yearly
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col pt-6">
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <RechartsLegend />
              <Line 
                type="monotone" 
                dataKey="income" 
                stroke="#7C3AED" 
                strokeWidth={2} 
                dot={{ fill: '#7C3AED', r: 4 }}
                name="Income"
              />
              <Line 
                type="monotone" 
                dataKey="expenses" 
                stroke="#EF4444" 
                strokeWidth={2} 
                dot={{ fill: '#EF4444', r: 4 }}
                name="Expenses"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export function ExpenseBreakdownChart({ data }: ExpenseBreakdownChartProps) {
  const [period, setPeriod] = React.useState<'monthly' | 'yearly'>('monthly')
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value)
  }

  const [isMobile, setIsMobile] = React.useState(window.innerWidth < 640);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <Card className="bg-white h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b p-4">
        <CardTitle className="text-xl font-medium">Expense Breakdown</CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="reverse-add" className="h-8">
              {period === 'monthly' ? 'Monthly' : 'Yearly'}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setPeriod('monthly')}>
              Monthly
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPeriod('yearly')}>
              Yearly
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-center">
        <div className="h-[300px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart style={{ cursor: 'default' }}>
              <RechartsPie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="50%"
                outerRadius="80%"
                fill="#8884d8"
                paddingAngle={2}
                dataKey="amount"
                label={renderCustomizedLabel}
                labelLine={false}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={1000}
                animationEasing="ease"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    style={{ outline: 'none' }}
                  />
                ))}
              </RechartsPie>
              <RechartsTooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend for mobile screens */}
        <div className="mt-4 grid grid-cols-2 gap-6 sm:hidden">
          {data.map((entry, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{entry.category}</div>
                <div className="text-lg font-semibold">
                  {formatCurrency(entry.amount)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <CustomLegend
          items={[
            { color: '#7C3AED', label: 'ATM Withdrawals', value: 2132 },
            { color: '#EF4444', label: 'Bank Charges', value: 973 },
            { color: '#10B981', label: 'Money Transfers', value: 1763 },
            { color: '#F59E0B', label: 'Grocery', value: 1500 },
            { color: '#3B82F6', label: 'Cash Withdrawals', value: 1200 },
            { color: '#EC4899', label: 'Withholding Taxes', value: 800 }
          ]}
        />
      </CardContent>
    </Card>
  )
}

export function InvoiceAnalytics() {
  const data = {
    invoiced: 2132,
    pending: 973,
    received: 1763
  };

  const chartData: ChartDataType = {
    labels: ['Invoiced', 'Pending', 'Received'],
    datasets: [
      {
        data: [data.invoiced, data.pending, data.received],
        backgroundColor: ['#7C3AED', '#FF8BA7', '#10B981'],
        borderWidth: 0,
      },
    ],
  };

  const options: ChartOptionsType = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  const legendItems: LegendItemProps[] = [
    { color: '#7C3AED', label: 'Invoiced', value: data.invoiced },
    { color: '#FF8BA7', label: 'Pending', value: data.pending },
    { color: '#10B981', label: 'Received', value: data.received }
  ];

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between border-b pb-6">
        <CardTitle className="text-xl font-medium text-purple-700">Invoice Analytics</CardTitle>
        <select 
          className="bg-transparent border rounded-lg px-3 py-1.5 text-sm text-purple-500 border-purple-500 font-medium cursor-pointer hover:bg-purple-50 transition-colors"
          defaultValue="monthly"
        >
          <option value="monthly">Monthly ▾</option>
          <option value="yearly">Yearly</option>
        </select>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-center py-6">
        <div className="relative h-[250px] w-full">
          <Pie data={chartData} options={options} />
        </div>

        <CustomLegend items={legendItems} />
      </CardContent>
    </Card>
  );
} 