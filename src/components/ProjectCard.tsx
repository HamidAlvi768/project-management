import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  ChevronDown, 
  ChevronUp, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  Users,
  Layers,
  CheckSquare
} from 'lucide-react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface Project {
  _id: string;
  name: string;
  customer: string | { _id: string; name: string };
  estimatedBudget: number;
  actualCost: number;
  startDate: string;
  endDate: string;
  status: 'ongoing' | 'completed' | 'on-hold';
  description: string;
  completion: number;
  phaseCount: number;
  taskCount: number;
  budgetVariance: number;
}

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onViewPhases: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onEdit,
  onDelete,
  onViewPhases
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getBudgetStatusColor = (variance: number) => {
    if (variance <= 0) return 'text-green-600';
    if (variance < 50000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatBudgetVariance = (variance: number) => {
    const prefix = variance <= 0 ? 'Under budget: ' : 'Over budget: ';
    return `${prefix}$${Math.abs(variance).toLocaleString()}`;
  };

  const getCustomerName = (customer: string | { _id: string; name: string }) => {
    return typeof customer === 'object' ? customer.name : customer;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-bold">{project.name}</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(project)}
          >
            <FiEdit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(project._id)}
          >
            <FiTrash2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                className={cn(
                  "capitalize",
                  project.status === 'ongoing' ? 'bg-green-100 text-green-800 border-green-200' :
                  project.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                  'bg-yellow-100 text-yellow-800 border-yellow-200'
                )}
              >
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <Layers className="h-3 w-3" />
                {project.phaseCount} Phases
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckSquare className="h-3 w-3" />
                {project.taskCount} Tasks
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progress</span>
              <span>{project.completion}%</span>
            </div>
            <Progress value={project.completion} className="h-2" />
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{new Date(project.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{new Date(project.endDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className={cn(
            "space-y-4 overflow-hidden transition-all duration-300",
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}>
            <div className="text-sm text-muted-foreground">{project.description}</div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Estimated Budget</span>
                <p className="text-sm font-medium">${project.estimatedBudget.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <span className="text-sm text-muted-foreground">Actual Cost</span>
                <p className="text-sm font-medium">${project.actualCost.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => onViewPhases(project._id)}
        >
          View Phases
        </Button>
        {project.budgetVariance > 50000 && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span>Budget variance exceeds threshold</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProjectCard; 