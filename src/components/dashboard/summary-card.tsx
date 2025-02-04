import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SummaryCardProps {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
  type: 'amount' | 'customers' | 'invoices' | 'estimates'
}

export function SummaryCard({
  title,
  value,
  icon,
  trend,
  className,
  type,
}: SummaryCardProps) {
  const getIconBackground = () => {
    switch (type) {
      case 'amount':
        return 'bg-[#ffeec3]'
      case 'customers':
        return 'bg-[#E6F4FF]'
      case 'invoices':
        return 'bg-[#E6FFE6]'
      case 'estimates':
        return 'bg-[#FFE6FF]'
      default:
        return 'bg-gray-100'
    }
  }

  const getProgressBarColor = () => {
    switch (type) {
      case 'amount':
        return 'bg-[#FFC107]'
      case 'customers':
        return 'bg-[#2196F3]'
      case 'invoices':
        return 'bg-[#4CAF50]'
      case 'estimates':
        return 'bg-[#E91E63]'
      default:
        return 'bg-gray-200'
    }
  }

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <div className="text-2xl font-semibold">{value}</div>
            {trend && (
              <div className="flex flex-col gap-1.5">
                <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={cn("h-full rounded-full", getProgressBarColor())} 
                    style={{ width: '60%' }}
                  />
                </div>
                <p
                  className={cn(
                    "text-xs font-medium",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}
                >
                  {trend.isPositive ? "+" : "-"}
                  {Math.abs(trend.value)}% since last week
                </p>
              </div>
            )}
          </div>
          {icon && (
            <div className={cn(
              "h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0",
              getIconBackground()
            )}>
              <div className="h-7 w-7">
                {icon}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 