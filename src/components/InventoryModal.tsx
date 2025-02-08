import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IInventory, IInventoryInput } from '../services/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCustomUnits } from '@/store/slices/customUnitSlice';
import { Link } from 'react-router-dom';

interface InventoryModalProps {
  inventory?: IInventory | null;
  onClose: () => void;
  onSave: (data: IInventoryInput) => void;
}

const inventorySchema = z.object({
  name: z.string()
    .min(1, 'Inventory name is required')
    .max(100, 'Name cannot be more than 100 characters'),
  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description cannot be more than 500 characters'),
  unit: z.string()
    .min(1, 'Unit is required'),
  unitValue: z.number()
    .min(0.01, 'Quantity must be greater than 0'),
  pricePerUnit: z.number()
    .min(0.01, 'Price per unit must be greater than 0'),
});

const InventoryModal: React.FC<InventoryModalProps> = ({ inventory, onClose, onSave }) => {
  const dispatch = useAppDispatch();
  const { units: customUnits } = useAppSelector((state) => state.customUnit);

  useEffect(() => {
    dispatch(fetchCustomUnits({ active: true }));
  }, [dispatch]);

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<IInventoryInput>({
    resolver: zodResolver(inventorySchema),
    defaultValues: inventory ? {
      name: inventory.name,
      description: inventory.description,
      unit: typeof inventory.unit === 'string' ? inventory.unit : inventory.unit._id,
      unitValue: inventory.unitValue,
      pricePerUnit: inventory.pricePerUnit,
    } : undefined
  });

  const onSubmit = (data: IInventoryInput) => {
    onSave(data);
  };

  const getUnitLabel = (unitId: string) => {
    const unit = customUnits.find(u => u._id === unitId);
    return unit ? `${unit.name} (${unit.symbol})` : '';
  };

  if (customUnits.length === 0) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>No Units Available</DialogTitle>
            <DialogDescription>
              You need to create at least one unit before adding inventory items.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center space-y-4 py-6">
            <p className="text-center text-muted-foreground">
              Please create a unit first to continue.
            </p>
            <Button asChild>
              <Link to="/settings/custom-units">Create Unit</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{inventory ? 'Edit Inventory' : 'Add New Inventory'}</DialogTitle>
          <DialogDescription>
            {inventory ? 'Edit the inventory details below.' : 'Fill in the inventory details below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              onValueChange={(value: string) => {
                setValue('unit', value, {
                  shouldValidate: true
                });
              }}
              value={watch('unit')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit">
                  {watch('unit') ? getUnitLabel(watch('unit')) : "Select unit"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {customUnits.map((unit) => (
                  <SelectItem key={unit._id} value={unit._id}>
                    {unit.name} ({unit.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.unit && (
              <p className="text-sm text-red-500">{errors.unit.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="unitValue">Quantity</Label>
            <Input
              id="unitValue"
              type="number"
              step="0.01"
              {...register('unitValue', { valueAsNumber: true })}
              placeholder="Enter quantity"
            />
            {errors.unitValue && (
              <p className="text-sm text-red-500">{errors.unitValue.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="pricePerUnit">Price per Unit</Label>
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
            <Label>Total Price</Label>
            <div className="p-2 bg-muted rounded-md">
              <span className="font-medium">
                PKR {((watch('unitValue') || 0) * (watch('pricePerUnit') || 0)).toLocaleString()}
              </span>
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