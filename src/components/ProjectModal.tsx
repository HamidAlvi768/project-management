import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IProject, IProjectInput, ProjectStatus } from '../services/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface ProjectModalProps {
  project?: IProject | null;
  onClose: () => void;
  onSave: (data: IProjectInput) => void;
}

const projectSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(100, 'Project name cannot be more than 100 characters'),
  estimatedBudget: z.number()
    .min(0, 'Budget must be positive'),
  startDate: z.string()
    .min(1, 'Start date is required'),
  endDate: z.string()
    .min(1, 'End date is required'),
  status: z.enum(['not-started', 'ongoing', 'completed', 'on-hold', 'cancelled'] as const),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot be more than 500 characters'),
  stakeholders: z.array(z.string())
    .min(1, 'At least one stakeholder is required')
});

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<IProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: project ? {
      name: project.name,
      estimatedBudget: project.estimatedBudget,
      startDate: project.startDate.split('T')[0],
      endDate: project.endDate.split('T')[0],
      status: project.status,
      description: project.description,
      stakeholders: project.stakeholders
    } : {
      status: 'not-started' as ProjectStatus,
      stakeholders: []
    }
  });

  const onSubmit = (data: IProjectInput) => {
    onSave(data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{project ? 'Edit Project' : 'Create Project'}</DialogTitle>
          <DialogDescription>
            {project ? 'Edit the project details below.' : 'Fill in the project details below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Project Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter project name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedBudget">Estimated Budget</Label>
            <Input
              id="estimatedBudget"
              type="number"
              {...register('estimatedBudget', { valueAsNumber: true })}
              placeholder="Enter estimated budget"
            />
            {errors.estimatedBudget && (
              <p className="text-sm text-red-500">{errors.estimatedBudget.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                {...register('startDate')}
              />
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                {...register('endDate')}
              />
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value: ProjectStatus) => setValue('status', value)}
              defaultValue={project?.status || 'not-started'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="on-hold">On Hold</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter project description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="stakeholders">Stakeholders</Label>
            <div className="flex gap-2">
              <Input
                id="stakeholders"
                placeholder="Enter stakeholder names (comma-separated)"
                {...register('stakeholders', {
                  setValueAs: (value: string | string[]) => {
                    if (Array.isArray(value)) return value;
                    return value.split(',').map(s => s.trim()).filter(Boolean);
                  }
                })}
                defaultValue={Array.isArray(project?.stakeholders) ? project.stakeholders.join(', ') : ''}
              />
            </div>
            {errors.stakeholders && (
              <p className="text-sm text-red-500">{errors.stakeholders.message}</p>
            )}
            <p className="text-sm text-muted-foreground">Enter stakeholder names separated by commas</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {project ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal; 