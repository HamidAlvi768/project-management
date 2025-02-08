import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IProject, IProjectInput, ProjectStatus, ICustomer } from '../services/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CalendarIcon } from "lucide-react";
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchCustomers, setSelectedCustomer, loadFromLocalStorage } from '../store/slices/customerSlice';
import { RootState } from '../store/store';

interface ProjectModalProps {
  project?: IProject | null;
  onClose: () => void;
  onSave: (data: IProjectInput) => void;
}

const projectSchema = z.object({
  name: z.string()
    .min(1, 'Project name is required')
    .max(100, 'Project name cannot be more than 100 characters'),
  customer: z.string()
    .min(1, 'Customer is required'),
  estimatedBudget: z.number()
    .min(0, 'Estimated budget must be positive'),
  startDate: z.string()
    .min(1, 'Start date is required'),
  endDate: z.string()
    .min(1, 'End date is required'),
  status: z.enum(['not-started', 'ongoing', 'completed', 'on-hold', 'cancelled'] as const),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot be more than 500 characters'),
});

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onSave }) => {
  const dispatch = useAppDispatch();
  const { customers, selectedCustomer, isLoading } = useAppSelector((state: RootState) => state.customer);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<IProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: project ? {
      name: project.name,
      customer: typeof project.customer === 'string' ? project.customer : project.customer._id,
      estimatedBudget: project.estimatedBudget,
      startDate: project.startDate.split('T')[0],
      endDate: project.endDate.split('T')[0],
      status: project.status,
      description: project.description,
    } : {
      status: 'not-started' as ProjectStatus,
    }
  });

  const selectedCustomerId = watch('customer');

  console.log('Form Values:', watch());
  console.log('Selected Customer ID:', selectedCustomerId);
  console.log('Customers State:', customers);
  console.log('Project Props:', project);
  console.log('Selected Customer State:', selectedCustomer);

  useEffect(() => {
    // Load from localStorage first
    dispatch(loadFromLocalStorage());
    // Then fetch fresh data
    dispatch(fetchCustomers());
  }, [dispatch]);

  useEffect(() => {
    if (project?.customer) {
      setValue('customer', typeof project.customer === 'string' ? project.customer : project.customer._id);
      const initialCustomer = customers.find((c: ICustomer) => c._id === project.customer);
      if (initialCustomer) {
        dispatch(setSelectedCustomer(initialCustomer));
      }
    }
  }, [project, customers, setValue, dispatch]);

  useEffect(() => {
    if (!isLoading && selectedCustomerId && customers.length > 0) {
      const customer = customers.find((c: ICustomer) => c._id === selectedCustomerId);
      if (customer) {
        dispatch(setSelectedCustomer(customer));
      }
    }
  }, [selectedCustomerId, customers, isLoading, dispatch]);

  const onSubmit = (data: IProjectInput) => {
    onSave(data);
  };

  // For the date picker issue, let's create a type-safe helper
  const showDatePicker = (elementId: string) => {
    const element = document.getElementById(elementId) as HTMLInputElement;
    if (element?.showPicker) {
      element.showPicker();
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
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
            <Label htmlFor="customer">Customer</Label>
            <Select
              onValueChange={(value: string) => {
                console.log('Select onValueChange:', value);
                setValue('customer', value);
              }}
              value={selectedCustomerId}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue>
                  {isLoading && project?.customer
                    ? "Loading..."
                    : selectedCustomer
                      ? selectedCustomer.name
                      : "Select customer"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer._id} value={customer._id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.customer && (
              <p className="text-sm text-red-500">{errors.customer.message}</p>
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
              <div 
                className="relative cursor-pointer" 
                onClick={() => showDatePicker('startDate')}
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
                onClick={() => showDatePicker('endDate')}
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
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value: ProjectStatus) => setValue('status', value)}
              defaultValue={watch('status')}
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