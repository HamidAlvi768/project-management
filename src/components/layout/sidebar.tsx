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
  Package,
  Users2,
  Ruler
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
    icon: <Users2 className="h-4 w-4" />,
    label: "Customers",
    href: "/customers",
  },
  {
    icon: <Building2 className="h-4 w-4" />,
    label: "Projects",
    href: "/projects",
  },
  {
    icon: <Package className="h-4 w-4" />,
    label: "Inventory",
    href: "/inventory",
  },
  {
    icon: <Settings className="h-4 w-4" />,
    label: "Settings",
    href: "/settings",
    children: [
      {
        icon: <Ruler className="h-4 w-4" />,
        label: "Custom Units",
        href: "/settings/custom-units",
      }
    ]
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
            {sidebarItems.map((item) => (
              <React.Fragment key={item.href}>
                <Button
                  variant={isActive(item.href) ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    isActive(item.href)
                      ? "bg-secondary hover:bg-secondary/80"
                      : "hover:bg-gray-100 hover:text-gray-900 text-gray-700"
                  )}
                  asChild
                >
                  <Link to={item.href}>
                    {item.icon}
                    <span className="ml-2">{item.label}</span>
                    {item.children && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                </Button>
                {item.children && isActive(item.href) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <Button
                        key={child.href}
                        variant={isActive(child.href) ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          isActive(child.href)
                            ? "bg-secondary hover:bg-secondary/80"
                            : "hover:bg-gray-100 hover:text-gray-900 text-gray-700"
                        )}
                        asChild
                      >
                        <Link to={child.href}>
                          {child.icon}
                          <span className="ml-2">{child.label}</span>
                        </Link>
                      </Button>
                    ))}
                  </div>
                )}
              </React.Fragment>
            ))}
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
                    "w-full justify-start ml-4",
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 