import * as React from "react"
import { cn } from "@/lib/utils"
import { Search, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

interface TopHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  user?: {
    name: string
    email: string
    avatar?: string
    role?: string
  }
}

export function TopHeader({ user, className }: TopHeaderProps) {
  const [calendarOpen, setCalendarOpen] = React.useState(false)

  return (
    <header
      className={cn(
        "flex h-16 items-center border-b bg-white px-4 w-full",
        className
      )}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-shrink-0">
          <img
            src="./logo.png"
            alt="Expense Manager"
            className="h-8 w-auto"
          />
        </div>
        <div className="relative flex items-center ml-4 max-w-md w-full">
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search here"
            className="pl-9 w-full bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        <Button 
          variant="outline" 
          size="icon" 
          className="bg-white border border-gray-200 hover:bg-gray-50 h-9 w-9 text-[0rem]"
          onClick={() => setCalendarOpen(true)}
        >
          <Calendar className="h-4 w-4 text-gray-700"  />
        </Button>

        <CalendarComponent
          open={calendarOpen}
          onOpenChange={setCalendarOpen}
        />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="icon" 
              className="rounded-full bg-white border border-gray-200 hover:bg-gray-50 h-9 w-9 p-0"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="flex items-center gap-2 p-2 border-b">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback>
                  {user?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user?.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user?.role || "Admin"}
                </span>
              </div>
            </div>
            <DropdownMenuItem className="cursor-pointer">Profile Settings</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer">Billing</DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer text-red-600">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
} 