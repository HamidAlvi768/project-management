import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IInventory, ITaskInventoryInput } from '../services/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchInventory } from '@/store/slices/inventorySlice';
import { RootState } from '@/store/store';

interface TaskInventoryModalProps {
  taskId: string;
  phaseId: string;
  projectId: string;
  customerId: string;
  onClose: () => void;
  onSave: (data: ITaskInventoryInput) => void;
}

const taskInventorySchema = z.object({
  inventory: z.string()
    .min(1, 'Inventory item is required'),
  allocatedValue: z.number()
    .min(0.01, 'Allocated value must be greater than 0'),
});

const TaskInventoryModal: React.FC<TaskInventoryModalProps> = ({
  taskId,
  phaseId,
  projectId,
  customerId,
  onClose,
  onSave
}) => {
  const dispatch = useAppDispatch();
  const { items: inventory = [], isLoading } = useAppSelector((state: RootState) => state.inventory);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ITaskInventoryInput>({
    resolver: zodResolver(taskInventorySchema),
    defaultValues: {
      task: taskId,
      phase: phaseId,
      project: projectId,
      customer: customerId,
    }
  });

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const onSubmit = (data: ITaskInventoryInput) => {
    // Ensure all required IDs are included
    const formData = {
      ...data,
      task: taskId,
      phase: phaseId,
      project: projectId,
      customer: customerId,
    };
    onSave(formData);
  };

  const selectedInventoryId = watch('inventory');
  const selectedInventory = selectedInventoryId ? inventory.find(item => item._id === selectedInventoryId) : null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Inventory to Task</DialogTitle>
          <DialogDescription>
            Select inventory item and specify the allocated value.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="inventory">Inventory Item</Label>
            <Select
              onValueChange={(value: string) => setValue('inventory', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading inventory..." : "Select inventory item"} />
              </SelectTrigger>
              <SelectContent>
                {inventory.length === 0 && (
                  <SelectItem value="placeholder" disabled>
                    {isLoading ? "Loading..." : "No inventory items available"}
                  </SelectItem>
                )}
                {inventory.map((item) => (
                  <SelectItem key={item._id} value={item._id}>
                    {item.name} ({item.remainingValue} {item.customUnit || item.unit} available)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.inventory && (
              <p className="text-sm text-red-500">{errors.inventory.message}</p>
            )}
          </div>

          {selectedInventory && (
            <>
              <div className="space-y-2">
                <Label>Available Value</Label>
                <div className="p-2 bg-gray-50 rounded-md">
                  <span className="font-medium">
                    {selectedInventory.remainingValue} {selectedInventory.customUnit || selectedInventory.unit}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allocatedValue">Allocated Value</Label>
                <Input
                  id="allocatedValue"
                  type="number"
                  step="0.01"
                  {...register('allocatedValue', { valueAsNumber: true })}
                  placeholder={`Enter value in ${selectedInventory.customUnit || selectedInventory.unit}`}
                />
                {errors.allocatedValue && (
                  <p className="text-sm text-red-500">{errors.allocatedValue.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Price per Unit</Label>
                <div className="p-2 bg-gray-50 rounded-md">
                  <span className="font-medium">
                    PKR {selectedInventory.pricePerUnit.toLocaleString()}
                  </span>
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !selectedInventory}
            >
              Add to Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskInventoryModal; 