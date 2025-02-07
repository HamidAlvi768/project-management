import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IInventory, IInventoryInput, InventoryUnit } from '../services/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface InventoryModalProps {
  inventory?: IInventory | null;
  onClose: () => void;
  onSave: (data: IInventoryInput) => void;
}

const inventorySchema = z.object({
  name: z.string()
    .min(1, 'Name is required')
    .max(100, 'Name cannot be more than 100 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot be more than 500 characters'),
  unit: z.enum(['pieces', 'kg', 'liters', 'meters', 'square_meters', 'cubic_meters', 'custom'] as const),
  customUnit: z.string().optional(),
  unitValue: z.number()
    .min(0, 'Qunatity must be positive'),
  pricePerUnit: z.number()
    .min(0, 'Price per unit must be positive'),
});

const InventoryModal: React.FC<InventoryModalProps> = ({ inventory, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<IInventoryInput>({
    resolver: zodResolver(inventorySchema),
    defaultValues: inventory ? {
      name: inventory.name,
      description: inventory.description,
      unit: inventory.unit,
      customUnit: inventory.customUnit,
      unitValue: inventory.unitValue,
      pricePerUnit: inventory.pricePerUnit,
    } : {
      unit: 'pieces' as InventoryUnit,
    }
  });

  const selectedUnit = watch('unit');
  const unitValue = watch('unitValue') || 0;
  const pricePerUnit = watch('pricePerUnit') || 0;
  const totalPrice = unitValue * pricePerUnit;

  const unitOptions: { value: InventoryUnit; label: string }[] = [
    { value: 'pieces', label: 'Pieces' },
    { value: 'kg', label: 'Kilograms' },
    { value: 'liters', label: 'Liters' },
    { value: 'meters', label: 'Meters' },
    { value: 'square_meters', label: 'Square Meters' },
    { value: 'cubic_meters', label: 'Cubic Meters' },
    { value: 'custom', label: 'Custom Unit' },
  ];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{inventory ? 'Edit Inventory' : 'Add New Inventory'}</DialogTitle>
          <DialogDescription>
            {inventory ? 'Edit the inventory details below.' : 'Fill in the inventory details below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter inventory name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Enter inventory description"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unit">Unit</Label>
            <Select
              onValueChange={(value: InventoryUnit) => setValue('unit', value)}
              defaultValue={inventory?.unit || 'pieces'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {unitOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.unit && (
              <p className="text-sm text-red-500">{errors.unit.message}</p>
            )}
          </div>

          {selectedUnit === 'custom' && (
            <div className="space-y-2">
              <Label htmlFor="customUnit">Custom Unit</Label>
              <Input
                id="customUnit"
                {...register('customUnit')}
                placeholder="Enter custom unit"
              />
              {errors.customUnit && (
                <p className="text-sm text-red-500">{errors.customUnit.message}</p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="unitValue">Quantity</Label>
            <Input
              id="unitValue"
              type="number"
              step="0.01"
              {...register('unitValue', { valueAsNumber: true })}
              placeholder="Enter Qunatity"
            />
            {errors.unitValue && (
              <p className="text-sm text-red-500">{errors.unitValue.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerUnit">Price per Unit (PKR)</Label>
            <Input
              id="pricePerUnit"
              type="number"
              step="0.01"
              {...register('pricePerUnit', { valueAsNumber: true })}
              placeholder="Enter price per unit"
            />
            {errors.pricePerUnit && (
              <p className="text-sm text-red-500">{errors.pricePerUnit.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Total Price (PKR)</Label>
            <div className="p-2 bg-gray-50 rounded-md">
              <span className="font-medium">{totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {inventory ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default InventoryModal; 