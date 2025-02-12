import * as React from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "./sidebar"
import { TopHeader } from "./top-header"
import { Breadcrumbs } from "./breadcrumbs"
import { useLocation } from "react-router-dom"

interface MainLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    email: string
    avatar?: string
    role?: string
  }
  breadcrumbs?: Array<{
    label: string
    href?: string
  }>
}

export function MainLayout({ children, user, breadcrumbs = [] }: MainLayoutProps) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/forgot-password';

  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      {!isAuthPage && <TopHeader user={user} className="sticky top-0 z-[40] flex-shrink-0" />}
      <div className="flex flex-1 overflow-hidden">
        {!isAuthPage && <Sidebar className="hidden md:block flex-shrink-0 bg-white" />}
        <main className={cn(
          "flex-1 relative overflow-y-auto w-full",
          isAuthPage && "flex items-center justify-center"
        )}>
          {!isAuthPage && breadcrumbs.length > 0 && (
            <div className="border-b bg-white">
              <div className="container mx-auto px-4 py-2 lg:px-8">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            </div>
          )}
          <div className={cn(
            "container mx-auto p-0",
            !isAuthPage && "max-w-[100vw] space-y-6 px-4 py-6 lg:px-8"
          )}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 