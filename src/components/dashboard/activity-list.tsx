import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ArrowDownIcon, ArrowUpIcon, ArrowRightIcon } from "lucide-react"

interface Activity {
  id: string
  type: 'income' | 'expense' | 'transfer'
  amount: number
  description: string
  date: string
  category: string
}

interface ActivityListProps {
  activities: Activity[]
  className?: string
}

export function ActivityList({ activities, className }: ActivityListProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'income':
        return <ArrowUpIcon className="h-4 w-4 text-green-500" />
      case 'expense':
        return <ArrowDownIcon className="h-4 w-4 text-red-500" />
      case 'transfer':
        return <ArrowRightIcon className="h-4 w-4 text-blue-500" />
    }
  }

  const formatAmount = (amount: number, type: Activity['type']) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(Math.abs(amount))

    return type === 'expense' ? `-${formatted}` : formatted
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between space-x-4"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 rounded-full bg-muted">
                  {getActivityIcon(activity.type)}
                </div>
                <div>
                  <p className="text-sm font-medium leading-none">
                    {activity.description}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.category}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p
                  className={cn(
                    "text-sm font-medium",
                    activity.type === 'expense'
                      ? "text-red-500"
                      : activity.type === 'income'
                      ? "text-green-500"
                      : "text-blue-500"
                  )}
                >
                  {formatAmount(activity.amount, activity.type)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(activity.date), 'MMM d, yyyy')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 