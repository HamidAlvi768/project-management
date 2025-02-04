import * as React from "react"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center text-sm", className)}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <React.Fragment key={item.label}>
            {index > 0 && (
              <ChevronRight className="h-4 w-4 mx-2 text-muted-foreground" />
            )}
            {isLast || !item.href ? (
              <span
                className={cn(
                  "text-sm",
                  isLast
                    ? "font-medium text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {item.label}
              </span>
            ) : (
              <Link
                to={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </Link>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
} 