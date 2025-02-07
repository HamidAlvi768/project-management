import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IPhase, IPhaseInput, PhaseStatus } from '../services/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from "lucide-react";

interface PhaseModalProps {
  phase?: IPhase | null;
  projectId: string;
  availableDependencies: { _id: string; name: string; }[];
  onClose: () => void;
  onSave: (data: IPhaseInput) => void;
}

const phaseSchema = z.object({
  name: z.string()
    .min(1, 'Phase name is required')
    .max(100, 'Phase name cannot be more than 100 characters'),
  estimatedBudget: z.number()
    .min(0, 'Estimated budget must be positive'),
  startDate: z.string()
    .min(1, 'Start date is required'),
  endDate: z.string()
    .min(1, 'End date is required'),
  status: z.enum(['not-started', 'in-progress', 'completed', 'on-hold', 'cancelled'] as const),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot be more than 500 characters'),
});

const PhaseModal: React.FC<PhaseModalProps> = ({ phase, projectId, availableDependencies, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<IPhaseInput>({
    resolver: zodResolver(phaseSchema),
    defaultValues: phase ? {
      name: phase.name,
      estimatedBudget: phase.estimatedBudget,
      startDate: phase.startDate.split('T')[0],
      endDate: phase.endDate.split('T')[0],
      status: phase.status,
      description: phase.description,
    } : {
      status: 'not-started' as PhaseStatus,
    }
  });

  const selectedDependencies = watch('dependencies') || [];

  const onSubmit = (data: IPhaseInput) => {
    onSave(data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{phase ? 'Edit Phase' : 'Create Phase'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Phase Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter phase name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                onValueChange={(value: PhaseStatus) => setValue('status', value)}
                defaultValue={phase?.status || 'not-started'}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-red-500">{errors.status.message}</p>
              )}
            </div>
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
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter phase description"
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
              {phase ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PhaseModal; 