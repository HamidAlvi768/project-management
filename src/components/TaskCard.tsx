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
  Clock,
  User,
  Tag,
  AlertCircle
} from 'lucide-react';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface Task {
  id: number;
  name: string;
  description: string;
  status: 'todo' | 'in-progress' | 'completed' | 'blocked';
  priority: 'low' | 'medium' | 'high';
  startDate: string;
  dueDate: string;
  completion: number;
  assignee: string;
  estimatedHours: number;
  actualHours: number;
  tags: string[];
  dependencies: number[];
  blockers?: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  onStatusChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
    }
  };

  const getTimeVariance = () => {
    const variance = task.actualHours - task.estimatedHours;
    return {
      text: variance > 0 ? `${variance}h over estimate` : `${Math.abs(variance)}h under estimate`,
      color: variance > 0 ? 'text-red-600' : 'text-green-600'
    };
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
            <CardTitle className="text-2xl font-bold leading-none flex items-center gap-2">
              {task.name}
              <Badge variant="outline" className={cn("text-sm", getPriorityColor(task.priority))}>
                {task.priority}
              </Badge>
            </CardTitle>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Due {new Date(task.dueDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="icon"
              className="h-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => onEdit(task)}
            >
              <FiEdit2 className="h-4 w-4 stroke-2" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => onDelete(task.id)}
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
            <Badge variant="outline" className={getStatusColor(task.status)}>
              {task.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Badge>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{task.assignee}</span>
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Completion</span>
              <span className="font-medium">{task.completion}%</span>
            </div>
            <Progress value={task.completion} className="h-2" />
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{task.actualHours}h / {task.estimatedHours}h</span>
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
          <div className="text-sm font-medium text-right">
            <span className={getTimeVariance().color}>
              {getTimeVariance().text}
            </span>
          </div>
        </div>

        {/* Expandable Details */}
        <div className={cn(
          "space-y-4 overflow-hidden transition-all duration-300",
          isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="text-sm text-muted-foreground">{task.description}</div>

          {task.tags.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {task.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {task.dependencies.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Dependencies</h4>
              <div className="flex gap-2">
                {task.dependencies.map(depId => (
                  <Badge key={depId} variant="outline">Task {depId}</Badge>
                ))}
              </div>
            </div>
          )}

          {task.blockers && (
            <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <p>{task.blockers}</p>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onStatusChange(task.id, 'in-progress')}
            disabled={task.status === 'in-progress' || task.status === 'completed'}
          >
            Start
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onStatusChange(task.id, 'completed')}
            disabled={task.status === 'completed'}
          >
            Complete
          </Button>
        </div>
        {task.status === 'blocked' && (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertTriangle className="h-4 w-4" />
            <span>Task is blocked</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default TaskCard; 