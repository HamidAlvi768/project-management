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
import { toast } from "@/components/ui/use-toast";

interface TaskInventoryModalProps {
  taskId: string;
  phaseId: string;
  projectId: string;
  customerId: string;
  onClose: () => void;
  onSave: (data: ITaskInventoryInput) => void;
}

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
  
  // Create a dynamic schema based on the selected inventory
  const createTaskInventorySchema = (remainingValue: number = 0) => z.object({
    inventory: z.string()
      .min(1, 'Inventory item is required'),
    allocatedValue: z.number()
      .min(0.01, 'Allocated value must be greater than 0')
      .max(remainingValue, `Cannot allocate more than the available quantity (${remainingValue})`)
  });

  const { register, handleSubmit, formState: { errors }, setValue, watch, control } = useForm<ITaskInventoryInput>({
    resolver: zodResolver(createTaskInventorySchema(0)),
    defaultValues: {
      task: taskId,
      phase: phaseId,
      project: projectId,
      customer: customerId,
    },
    mode: 'onChange'
  });

  const selectedInventoryId = watch('inventory');
  const selectedInventory = selectedInventoryId ? inventory.find(item => item._id === selectedInventoryId) : null;

  // Update form validation when selected inventory changes
  useEffect(() => {
    if (selectedInventory) {
      // Update the form with new validation schema
      control._options.resolver = zodResolver(createTaskInventorySchema(selectedInventory.remainingValue));
      
      // Reset the form with new validation rules but keep the selected inventory
      setValue('allocatedValue', undefined, {
        shouldValidate: true,
        shouldDirty: true,
      });
      
      // Trigger revalidation
      control._subjects.state.next({
        ...control._formState,
        isValidating: true,
      });
    }
  }, [selectedInventory, control, setValue]);

  // Fetch inventory data
  useEffect(() => {
    const loadInventory = async () => {
      try {
        await dispatch(fetchInventory()).unwrap();
      } catch (error) {
        console.error('Error fetching inventory:', error);
        toast({
          title: "Error",
          description: "Failed to load inventory items",
          variant: "destructive"
        });
      }
    };
    loadInventory();
  }, [dispatch]);

  const onSubmit = (data: ITaskInventoryInput) => {
    try {
      if (!selectedInventory) {
        throw new Error('No inventory item selected');
      }
      
      const allocatedValue = Number(data.allocatedValue);
      if (isNaN(allocatedValue)) {
        throw new Error('Invalid allocation value');
      }

      if (allocatedValue > selectedInventory.remainingValue) {
        throw new Error(`Cannot allocate more than the available quantity (${selectedInventory.remainingValue})`);
      }

      // Ensure all required IDs are included
      const formData = {
        ...data,
        allocatedValue,
        task: taskId,
        phase: phaseId,
        project: projectId,
        customer: customerId,
      };

      // Validate all required fields are present
      const requiredFields = ['task', 'phase', 'project', 'customer', 'inventory', 'allocatedValue'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      onSave(formData);
    } catch (error) {
      console.error('Form submission error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit form",
        variant: "destructive"
      });
    }
  };

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
              onValueChange={(value: string) => {
                setValue('inventory', value, {
                  shouldValidate: true,
                  shouldDirty: true,
                });
              }}
              value={watch('inventory')}
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
                    {item.name} ({item.remainingValue} {item.unit.symbol} available)
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
                    {selectedInventory.remainingValue} {selectedInventory.unit.symbol}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="allocatedValue">Allocated Value</Label>
                <Input
                  id="allocatedValue"
                  type="number"
                  step="0.01"
                  max={selectedInventory.remainingValue}
                  {...register('allocatedValue', { 
                    valueAsNumber: true,
                    max: {
                      value: selectedInventory.remainingValue,
                      message: `Cannot allocate more than the available quantity (${selectedInventory.remainingValue})`
                    }
                  })}
                  placeholder={`Enter value in ${selectedInventory.unit.symbol} (max: ${selectedInventory.remainingValue})`}
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
              disabled={isLoading || !selectedInventory || !watch('allocatedValue')}
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