import * as React from "react"
import { SummaryCard } from "./summary-card"
import { IncomeVsExpenseChart, ExpenseBreakdownChart } from "./charts"
import { ActivityList } from "./activity-list"
import {
  DollarSign,
  Users,
  FileText,
  FileEdit,
} from "lucide-react"

interface DashboardProps {
  data: {
    summary: {
      totalIncome: number
      totalExpenses: number
      totalTransfers: number
      balance: number
    }
    charts: {
      monthlyData: Array<{
        month: string
        income: number
        expenses: number
      }>
      expenseBreakdown: Array<{
        category: string
        amount: number
        percentage: number
      }>
    }
    recentActivity: Array<{
      id: string
      type: 'income' | 'expense' | 'transfer'
      amount: number
      description: string
      date: string
      category: string
    }>
  }
}

export function Dashboard({ data }: DashboardProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Amount Due"
          value={formatNumber(1642)}
          icon={<DollarSign className="w-full h-full text-[#FFC107]" />}
          trend={{
            value: 1.15,
            isPositive: false,
          }}
          type="amount"
          className="bg-white"
        />
        <SummaryCard
          title="Customers"
          value={formatNumber(3642)}
          icon={<Users className="w-full h-full text-[#2196F3]" />}
          trend={{
            value: 2.37,
            isPositive: true,
          }}
          type="customers"
          className="bg-white"
        />
        <SummaryCard
          title="Invoices"
          value={formatNumber(1041)}
          icon={<FileText className="w-full h-full text-[#4CAF50]" />}
          trend={{
            value: 3.77,
            isPositive: true,
          }}
          type="invoices"
          className="bg-white"
        />
        <SummaryCard
          title="Estimates"
          value={formatNumber(2150)}
          icon={<FileEdit className="w-full h-full text-[#E91E63]" />}
          trend={{
            value: 8.68,
            isPositive: false,
          }}
          type="estimates"
          className="bg-white"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <IncomeVsExpenseChart data={data.charts.monthlyData} />
        <ExpenseBreakdownChart data={data.charts.expenseBreakdown} />
      </div>

      <ActivityList
        activities={data.recentActivity}
        className="col-span-full"
      />
    </div>
  )
} 