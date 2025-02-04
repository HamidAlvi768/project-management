import * as React from "react"
import { cn } from "@/lib/utils"

interface PageTitleProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
}

export function PageTitle({ title, leftContent, rightContent, className, ...props }: PageTitleProps) {
  return (
    <div className={cn("grid grid-cols-3 items-center mb-6", className)} {...props}>
      <div className="justify-self-start">
        {leftContent}
      </div>
      <div className="justify-self-center">
        <h1 className="text-3xl font-bold text-center">{title}</h1>
      </div>
      <div className="justify-self-end">
        {rightContent}
      </div>
    </div>
  );
} 