import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { DollarSign } from 'lucide-react';
import { Pencil, Trash2 } from 'lucide-react';

interface Phase {
  id: number;
  name: string;
  estimatedBudget: number;
  actualCost: number;
  startDate: string;
  endDate: string;
  status: 'not-started' | 'in-progress' | 'completed';
  description: string;
  completion: number;
  taskCount: number;
  budgetVariance: number;
}

interface PhaseCardProps {
  phase: Phase;
  onEdit: (phase: Phase) => void;
  onDelete: (id: number) => void;
  onViewTasks: (id: number) => void;
}

const PhaseCard: React.FC<PhaseCardProps> = ({
  phase,
  onEdit,
  onDelete,
  onViewTasks
}) => {
  const getBudgetStatusColor = (variance: number) => {
    if (variance <= 0) return 'text-green-600';
    if (variance < 25000) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatBudgetVariance = (variance: number) => {
    const prefix = variance <= 0 ? 'Under budget: ' : 'Over budget: ';
    return `${prefix}$${Math.abs(variance).toLocaleString()}`;
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-xl font-bold">{phase.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="space-y-4">
          {/* Primary Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <span className="text-lg font-semibold">${phase.actualCost.toLocaleString()}</span>
              </div>
              <span className={`text-sm font-medium ${getBudgetStatusColor(phase.budgetVariance)}`}>
                {formatBudgetVariance(phase.budgetVariance)}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Completion</span>
                <span className="font-medium">{phase.completion}%</span>
              </div>
              <Progress value={phase.completion} className="h-2" />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tasks: {phase.taskCount}</span>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">{phase.description}</div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            onClick={() => onEdit(phase)}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(phase.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => onViewTasks(phase.id)}
        >
          View Tasks
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PhaseCard; 