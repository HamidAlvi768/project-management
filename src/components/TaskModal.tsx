import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ITask, ITaskInput } from '../services/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from "lucide-react";

interface TaskModalProps {
  task?: ITask | null;
  projectId: string;
  phaseId: string;
  onClose: () => void;
  onSave: (data: ITaskInput) => void;
}

const taskSchema = z.object({
  name: z.string()
    .min(1, 'Task name is required')
    .max(100, 'Task name cannot be more than 100 characters'),
  estimatedCost: z.number()
    .min(0, 'Estimated cost must be positive'),
  startDate: z.string()
    .min(1, 'Start date is required'),
  endDate: z.string()
    .min(1, 'End date is required'),
  status: z.enum(['not-started', 'pending', 'in-progress', 'completed'] as const),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot be more than 500 characters'),
  type: z.enum(['construction', 'procurement', 'inspection'] as const),
  assignedTo: z.string()
    .min(1, 'Assigned to is required'),
});

const TaskModal: React.FC<TaskModalProps> = ({ task, projectId, phaseId, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ITaskInput>({
    resolver: zodResolver(taskSchema),
    defaultValues: task ? {
      name: task.name,
      description: task.description,
      startDate: task.startDate.split('T')[0],
      endDate: task.endDate.split('T')[0],
      status: task.status,
      type: task.type,
      estimatedCost: task.estimatedCost,
      assignedTo: task.assignedTo
    } : {
      status: 'pending',
      type: 'construction',
      estimatedCost: 0
    }
  });

  const onSubmit = (data: ITaskInput) => {
    onSave(data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'Create Task'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Task Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter task name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value: TaskStatus) => setValue('status', value)}
              defaultValue={task?.status || 'not-started'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              onValueChange={(value) => setValue('type', value)}
              defaultValue={task?.type || 'construction'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="construction">Construction</SelectItem>
                <SelectItem value="procurement">Procurement</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-red-500">{errors.type.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <div 
                className="relative cursor-pointer" 
                onClick={() => document.getElementById('startDate')?.showPicker()}
              >
                <Input
                  id="startDate"
                  type="date"
                  {...register('startDate')}
                  className="pl-8 cursor-pointer"
                />
                <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
              {errors.startDate && (
                <p className="text-sm text-red-500">{errors.startDate.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <div 
                className="relative cursor-pointer" 
                onClick={() => document.getElementById('endDate')?.showPicker()}
              >
                <Input
                  id="endDate"
                  type="date"
                  {...register('endDate')}
                  className="pl-8 cursor-pointer"
                />
                <CalendarIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
              {errors.endDate && (
                <p className="text-sm text-red-500">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedCost">Estimated Cost</Label>
            <Input
              id="estimatedCost"
              type="number"
              {...register('estimatedCost', { valueAsNumber: true })}
              placeholder="Enter estimated cost"
            />
            {errors.estimatedCost && (
              <p className="text-sm text-red-500">{errors.estimatedCost.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignedTo">Assigned To</Label>
            <Input
              id="assignedTo"
              {...register('assignedTo')}
              placeholder="Enter assignee name"
            />
            {errors.assignedTo && (
              <p className="text-sm text-red-500">{errors.assignedTo.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter task description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {task ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskModal; 