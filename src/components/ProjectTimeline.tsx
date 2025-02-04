import React from 'react';
import { IProjectTimeline } from '../services/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface ProjectTimelineProps {
  timeline: IProjectTimeline;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ timeline }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not-started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'on-hold':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'todo':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'blocked':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{timeline.name}</h2>
          <p className="text-sm text-muted-foreground">
            {new Date(timeline.startDate).toLocaleDateString()} - {new Date(timeline.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {timeline.phases.map((phase) => (
          <Card key={phase._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{phase.name}</CardTitle>
                <Badge variant="outline" className={getStatusColor(phase.status)}>
                  {phase.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                  {new Date(phase.startDate).toLocaleDateString()} - {new Date(phase.endDate).toLocaleDateString()}
                </span>
                <span>{phase.completion}% Complete</span>
              </div>
              <Progress value={phase.completion} className="h-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {phase.tasks.map((task) => (
                  <div key={task._id} className="pl-6 border-l-2 border-border">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{task.name}</h4>
                      <Badge variant="outline" className={getTaskStatusColor(task.status)}>
                        {task.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-1">
                      <span>
                        {new Date(task.startDate).toLocaleDateString()} - {new Date(task.endDate).toLocaleDateString()}
                      </span>
                      <span>{task.completion}% Complete</span>
                    </div>
                    <Progress value={task.completion} className="h-1.5 mt-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProjectTimeline; 