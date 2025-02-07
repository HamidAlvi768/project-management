import * as React from "react"
import { cn } from "@/lib/utils"
import { Link, useLocation, useParams } from "react-router-dom"
import {
  LayoutDashboard,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeftRight,
  PiggyBank,
  Building2,
  FileText,
  ChevronRight,
  Settings,
  Tags,
  Wallet,
  Layers,
  CheckSquare,
  Users,
  Calendar,
  UserSquare2,
  Package
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

interface SidebarItem {
  icon: React.ReactNode
  label: string
  href: string
  isActive?: boolean
  children?: SidebarItem[]
}

const sidebarItems: SidebarItem[] = [
  {
    icon: <LayoutDashboard className="h-5 w-5" />,
    label: "Dashboard",
    href: "/",
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    label: "Accounts",
    href: "/accounts",
  },
  {
    icon: <ArrowUpRight className="h-5 w-5" />,
    label: "Incomes",
    href: "/incomes",
  },
  {
    icon: <ArrowDownRight className="h-5 w-5" />,
    label: "Expenses",
    href: "/expenses",
  },
  {
    icon: <ArrowLeftRight className="h-5 w-5" />,
    label: "Transfers",
    href: "/transfers",
  },
  {
    icon: <PiggyBank className="h-5 w-5" />,
    label: "Budgets",
    href: "/budgets",
  },
  {
    icon: <Building2 className="h-5 w-5" />,
    label: "Bank Statements",
    href: "/bank-statements",
  },
  {
    icon: <FileText className="h-5 w-5" />,
    label: "Reports",
    href: "/reports",
    children: [
      {
        icon: <ArrowLeftRight className="h-5 w-5" />,
        label: "Transfer Reports",
        href: "/reports/transfers",
      },
      {
        icon: <ArrowUpRight className="h-5 w-5" />,
        label: "Income Reports",
        href: "/reports/incomes",
      },
      {
        icon: <ArrowDownRight className="h-5 w-5" />,
        label: "Expense Reports",
        href: "/reports/expenses",
      },
    ],
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: "Dropdowns Settings",
    href: "/settings",
    children: [
      {
        icon: <Tags className="h-5 w-5" />,
        label: "Keywords",
        href: "/settings/keywords",
      },
      {
        icon: <Tags className="h-5 w-5" />,
        label: "Settings Expense Category",
        href: "/settings/expense-category",
      },
      {
        icon: <Tags className="h-5 w-5" />,
        label: "Settings Income Category",
        href: "/settings/income-category",
      },
      {
        icon: <Wallet className="h-5 w-5" />,
        label: "Settings Account Type",
        href: "/settings/account-type",
      },
    ],
  }
]

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  const { projectId, phaseId } = useParams();

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  // Only show phases and tasks links when we're in a project context
  const showProjectManagement = location.pathname.includes('/projects/');
  const currentProjectId = projectId || location.pathname.split('/projects/')[1]?.split('/')[0];

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4" style={{width: '16vw'}}>
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-left">
            Overview
          </h2>
          <div className="space-y-1">
            <Button
              variant={isActive("/customers") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive("/customers")
                  ? "bg-secondary hover:bg-secondary/80"
                  : "hover:bg-gray-100 hover:text-gray-900 text-gray-700"
              )}
              asChild
            >
              <Link to="/customers">
                <UserSquare2 className="mr-2 h-4 w-4" />
                Customers
              </Link>
            </Button>
            <Button
              variant={isActive("/projects") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive("/projects")
                  ? "bg-secondary hover:bg-secondary/80"
                  : "hover:bg-gray-100 hover:text-gray-900 text-gray-700"
              )}
              asChild
            >
              <Link to="/projects">
                <Building2 className="mr-2 h-4 w-4" />
                Projects
              </Link>
            </Button>
            <Button
              variant={isActive("/inventory") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive("/inventory")
                  ? "bg-secondary hover:bg-secondary/80"
                  : "hover:bg-gray-100 hover:text-gray-900 text-gray-700"
              )}
              asChild
            >
              <Link to="/inventory">
                <Package className="mr-2 h-4 w-4" />
                Inventory
              </Link>
            </Button>
            <Button
              variant={isActive("/calendar") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive("/calendar")
                  ? "bg-secondary hover:bg-secondary/80"
                  : "hover:bg-gray-100 hover:text-gray-900 text-gray-700"
              )}
              asChild
            >
              <Link to="/calendar">
                <Calendar className="mr-2 h-4 w-4" />
                Calendar
              </Link>
            </Button>
            <Button
              variant={isActive("/reports") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive("/reports")
                  ? "bg-secondary hover:bg-secondary/80"
                  : "hover:bg-gray-100 hover:text-gray-900 text-gray-700"
              )}
              asChild
            >
              <Link to="/reports">
                <FileText className="mr-2 h-4 w-4" />
                Reports
              </Link>
            </Button>
          </div>
        </div>
        {showProjectManagement && (
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-left">
              Project Management
            </h2>
            <div className="space-y-1">
              <Button
                variant={isActive(`/projects/${currentProjectId}/phases`) ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive(`/projects/${currentProjectId}/phases`)
                    ? "bg-secondary hover:bg-secondary/80"
                    : "hover:bg-gray-100 hover:text-gray-900 text-gray-700"
                )}
                asChild
              >
                <Link to={`/projects/${currentProjectId}/phases`}>
                  <Layers className="mr-2 h-4 w-4" />
                  Phases
                </Link>
              </Button>
              {phaseId && (
                <Button
                  variant={isActive(`/projects/${currentProjectId}/phases/${phaseId}/tasks`) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive(`/projects/${currentProjectId}/phases/${phaseId}/tasks`)
                      ? "bg-secondary hover:bg-secondary/80"
                      : "hover:bg-gray-100 hover:text-gray-900 text-gray-700"
                  )}
                  asChild
                >
                  <Link to={`/projects/${currentProjectId}/phases/${phaseId}/tasks`}>
                    <CheckSquare className="mr-2 h-4 w-4" />
                    Tasks
                  </Link>
                </Button>
              )}
              <Button
                variant={isActive("/teams") ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  isActive("/teams")
                    ? "bg-secondary hover:bg-secondary/80"
                    : "hover:bg-gray-100 hover:text-gray-900 text-gray-700"
                )}
                asChild
              >
                <Link to="/teams">
                  <Users className="mr-2 h-4 w-4" />
                  Teams
                </Link>
              </Button>
            </div>
          </div>
        )}
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-left">
            Settings
          </h2>
          <div className="space-y-1">
            <Button
              variant={isActive("/settings") ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive("/settings")
                  ? "bg-secondary hover:bg-secondary/80"
                  : "hover:bg-gray-100 hover:text-gray-900 text-gray-700"
              )}
              asChild
            >
              <Link to="/settings">
                <Settings className="mr-2 h-4 w-4" />
                General Settings
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 