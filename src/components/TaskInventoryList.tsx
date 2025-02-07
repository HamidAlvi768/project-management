import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from 'lucide-react';
import { ITaskInventory } from '../services/types';
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch } from '@/store/hooks';
import { updateConsumedValue, deleteTaskInventory } from '@/store/slices/inventorySlice';

interface TaskInventoryListProps {
  taskId: string;
  inventory: ITaskInventory[];
  onAddClick: () => void;
}

const TaskInventoryList: React.FC<TaskInventoryListProps> = ({ taskId, inventory, onAddClick }) => {
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [consumedValue, setConsumedValue] = useState<number>(0);

  const handleUpdateConsumed = async (inventoryId: string, currentConsumed: number) => {
    try {
      await dispatch(updateConsumedValue({
        taskId,
        inventoryId,
        consumedValue: currentConsumed
      })).unwrap();
      setEditingId(null);
      toast({
        title: "Success",
        description: "Consumption updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update consumption",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (inventoryId: string) => {
    if (window.confirm('Are you sure you want to remove this inventory from the task?')) {
      try {
        await dispatch(deleteTaskInventory({ taskId, inventoryId })).unwrap();
        toast({
          title: "Success",
          description: "Inventory removed from task successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to remove inventory from task",
          variant: "destructive",
        });
      }
    }
  };

  const startEditing = (item: ITaskInventory) => {
    setEditingId(item._id);
    setConsumedValue(item.consumedValue);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Task Inventory</CardTitle>
        <Button onClick={onAddClick} size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Inventory
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        {inventory.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-4">
            No inventory items added to this task yet.
          </div>
        ) : (
          inventory.map((item) => (
            <Card key={item._id} className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{item.inventory.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.inventory.description}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(item._id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground block">Allocated</span>
                    <Badge variant="secondary">
                      {item.allocatedValue} {item.inventory.customUnit || item.inventory.unit}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground block">Consumed</span>
                    {editingId === item._id ? (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={consumedValue}
                          onChange={(e) => setConsumedValue(Number(e.target.value))}
                          className="h-8"
                          min={0}
                          max={item.allocatedValue}
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdateConsumed(item._id, consumedValue)}
                        >
                          Save
                        </Button>
                      </div>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => startEditing(item)}
                      >
                        {item.consumedValue} {item.inventory.customUnit || item.inventory.unit}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Consumption Progress</span>
                    <span className="font-medium">
                      {Math.round((item.consumedValue / item.allocatedValue) * 100)}%
                    </span>
                  </div>
                  <Progress
                    value={(item.consumedValue / item.allocatedValue) * 100}
                    className="h-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground block">Price per Unit</span>
                    <span className="font-medium">
                      PKR {item.inventory.pricePerUnit.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block">Total Cost</span>
                    <span className="font-medium">
                      PKR {(item.consumedValue * item.inventory.pricePerUnit).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default TaskInventoryList; 