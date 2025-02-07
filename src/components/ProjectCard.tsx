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
  stakeholders: string[];
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
  const [isHovered, setIsHovered] = useState(false);

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
    <Card 
      className={cn(
        "group transition-all duration-200",
        isHovered && "shadow-lg transform -translate-y-1"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-bold leading-none">{project.name}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className={
                project.status === 'ongoing' ? 'bg-green-100 text-green-800 border-green-200' :
                project.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                'bg-yellow-100 text-yellow-800 border-yellow-200'
              }>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="icon"
              className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => onEdit(project)}
            >
              <FiEdit2 className="h-4 w-4 stroke-2" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(project._id)}
            >
              <FiTrash2 className="h-4 w-4 stroke-2" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Primary Information */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-lg font-semibold">${project.actualCost.toLocaleString()}</span>
            </div>
            <span className={`text-sm font-medium ${getBudgetStatusColor(project.budgetVariance)}`}>
              {formatBudgetVariance(project.budgetVariance)}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-medium">{project.completion}%</span>
            </div>
            <Progress value={project.completion} className="h-2" />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Layers className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{project.phaseCount} Phases</span>
              </div>
              <div className="flex items-center gap-1">
                <CheckSquare className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{project.taskCount} Tasks</span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-sm hover:bg-transparent hover:text-primary"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Show Less' : 'Show More'}
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 ml-1" />
              ) : (
                <ChevronDown className="h-4 w-4 ml-1" />
              )}
            </Button>
          </div>
        </div>

        {/* Expandable Details */}
        <div className={cn(
          "space-y-4 overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="text-sm text-muted-foreground">{project.description}</div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Stakeholders
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.stakeholders.map((stakeholder, index) => (
                <Badge key={index} variant="secondary">
                  {stakeholder}
                </Badge>
              ))}
            </div>
          </div>

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