import React, { useEffect, useState } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageTitle } from '../components/ui/page-title';
import { useToast } from "@/components/ui/use-toast";
import { IInventory, IInventoryInput } from '../services/types';
import InventoryModal from '../components/InventoryModal';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchInventory, createInventory, updateInventory, deleteInventory, setSelectedInventory } from '../store/slices/inventorySlice';

const Inventory: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, selectedInventory, isLoading, error } = useAppSelector(state => state.inventory);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Fetch inventory data
  useEffect(() => {
    dispatch(fetchInventory({ search: searchTerm }));
  }, [dispatch, searchTerm]);

  const handleAddInventory = () => {
    dispatch(setSelectedInventory(null));
    setIsModalOpen(true);
  };

  const handleEditInventory = (item: IInventory) => {
    dispatch(setSelectedInventory(item));
    setIsModalOpen(true);
  };

  const handleDeleteInventory = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        await dispatch(deleteInventory(id)).unwrap();
        toast({
          title: "Success",
          description: "Inventory item deleted successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete inventory item",
          variant: "destructive",
        });
      }
    }
  };

  const handleSaveInventory = async (data: IInventoryInput) => {
    try {
      if (selectedInventory) {
        await dispatch(updateInventory({ id: selectedInventory._id, data })).unwrap();
        toast({
          title: "Success",
          description: "Inventory item updated successfully",
        });
      } else {
        await dispatch(createInventory(data)).unwrap();
        toast({
          title: "Success",
          description: "Inventory item created successfully",
        });
      }
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Error saving inventory:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save inventory item",
        variant: "destructive",
      });
    }
  };

  // Show loading state first
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <PageTitle
          title="Inventory Management"
          rightContent={
            <Button disabled className="gap-2">
              <Plus className="h-4 w-4" />
              Add Inventory
            </Button>
          }
        />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <PageTitle
          title="Inventory Management"
          rightContent={
            <Button onClick={handleAddInventory} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Inventory
            </Button>
          }
        />
        <div className="flex items-center justify-center h-[60vh] text-red-500">
          Error: {error}
        </div>
      </div>
    );
  }

  // Filter items
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <PageTitle
        title="Inventory Management"
        rightContent={
          <Button onClick={handleAddInventory} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Inventory
          </Button>
        }
      />

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No inventory items found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Card key={item._id} className="flex flex-col">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl font-bold">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Unit:</span>
                      <Badge variant="secondary">
                        {item.customUnit || item.unit}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Quantity:</span>
                      <span className="font-medium">{item.unitValue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Price per Unit:</span>
                      <span className="font-medium">PKR {item.pricePerUnit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Total Price:</span>
                      <span className="font-medium">PKR {item.totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Remaining Value:</span>
                      <span className="font-medium">{item.remainingValue} {item.customUnit || item.unit}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEditInventory(item)}>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteInventory(item._id)}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <InventoryModal
          inventory={selectedInventory}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveInventory}
        />
      )}
    </div>
  );
};

export default Inventory; 