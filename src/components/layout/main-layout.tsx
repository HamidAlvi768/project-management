import * as React from "react"
import { cn } from "@/lib/utils"
import { Sidebar } from "./sidebar"
import { TopHeader } from "./top-header"
import { Breadcrumbs } from "./breadcrumbs"

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
  return (
    <div className="min-h-screen bg-[#F8F9FC] flex flex-col">
      <TopHeader user={user} className="sticky top-0 z-[40] flex-shrink-0" />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="hidden md:block flex-shrink-0 bg-white" />
        <main className="flex-1 relative overflow-y-auto w-full">
          {breadcrumbs.length > 0 && (
            <div className="border-b bg-white">
              <div className="container mx-auto px-4 py-2 lg:px-4">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            </div>
          )}
          <div className="container mx-auto px-4 py-4 lg:px-4 max-w-[100vw]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
} 