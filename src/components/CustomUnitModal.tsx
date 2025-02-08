import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ICustomUnit, ICustomUnitInput } from '../services/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface CustomUnitModalProps {
  unit?: ICustomUnit | null;
  onClose: () => void;
  onSave: (data: ICustomUnitInput) => void;
}

const customUnitSchema = z.object({
  name: z.string()
    .min(1, 'Unit name is required')
    .max(50, 'Unit name cannot be more than 50 characters'),
  symbol: z.string()
    .min(1, 'Unit symbol is required')
    .max(10, 'Unit symbol cannot be more than 10 characters'),
  description: z.string()
    .max(200, 'Description cannot be more than 200 characters')
    .optional(),
  isActive: z.boolean().optional(),
});

const CustomUnitModal: React.FC<CustomUnitModalProps> = ({ unit, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ICustomUnitInput>({
    resolver: zodResolver(customUnitSchema),
    defaultValues: unit ? {
      name: unit.name,
      symbol: unit.symbol,
      description: unit.description,
      isActive: unit.isActive,
    } : {
      isActive: true,
    }
  });

  const onSubmit = (data: ICustomUnitInput) => {
    onSave(data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{unit ? 'Edit Custom Unit' : 'Add New Custom Unit'}</DialogTitle>
          <DialogDescription>
            {unit ? 'Edit the custom unit details below.' : 'Fill in the custom unit details below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Unit Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter unit name (e.g., Square Feet)"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="symbol">Unit Symbol</Label>
            <Input
              id="symbol"
              {...register('symbol')}
              placeholder="Enter unit symbol (e.g., sq ft)"
            />
            {errors.symbol && (
              <p className="text-sm text-red-500">{errors.symbol.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter unit description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isActive">Active</Label>
            <Switch
              id="isActive"
              checked={watch('isActive')}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {unit ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomUnitModal; 