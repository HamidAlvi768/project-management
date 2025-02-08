import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store/store';
import { fetchCustomUnits, createCustomUnit, updateCustomUnit, deleteCustomUnit } from '@/store/slices/customUnitSlice';
import { ICustomUnit, ICustomUnitInput } from '@/services/types';
import CustomUnitModal from '@/components/CustomUnitModal';

const CustomUnits: React.FC = () => {
  const dispatch = useAppDispatch();
  const { units, isLoading, error } = useAppSelector((state: RootState) => state.customUnit);
  const [selectedUnit, setSelectedUnit] = useState<ICustomUnit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchCustomUnits())
      .unwrap()
      .catch((error) => {
        toast({
          title: "Error",
          description: error.message || "Failed to load custom units",
          variant: "destructive",
        });
      });
  }, [dispatch, toast]);

  const handleCreateUnit = async (data: ICustomUnitInput) => {
    try {
      await dispatch(createCustomUnit(data)).unwrap();
      toast({
        title: "Success",
        description: "Custom unit created successfully",
      });
      setIsModalOpen(false);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create custom unit",
        variant: "destructive",
      });
    }
  };

  const handleUpdateUnit = async (data: ICustomUnitInput) => {
    try {
      if (selectedUnit) {
        await dispatch(updateCustomUnit({ id: selectedUnit._id, data })).unwrap();
        toast({
          title: "Success",
          description: "Custom unit updated successfully",
        });
        setIsModalOpen(false);
        setSelectedUnit(null);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update custom unit",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUnit = async (unitId: string) => {
    if (window.confirm('Are you sure you want to delete this custom unit?')) {
      try {
        await dispatch(deleteCustomUnit(unitId)).unwrap();
        toast({
          title: "Success",
          description: "Custom unit deleted successfully",
        });
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to delete custom unit",
          variant: "destructive",
        });
      }
    }
  };

  const filteredUnits = units.filter(unit =>
    unit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    unit.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Custom Units</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Unit
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search units..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-8"
        />
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading custom units...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-4">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUnits.map((unit) => (
            <Card key={unit._id} className="relative">
              <CardContent className="pt-6">
                <div className="absolute top-4 right-4">
                  <Badge variant={unit.isActive ? "default" : "secondary"}>
                    {unit.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{unit.name}</h3>
                    <p className="text-sm text-muted-foreground">Symbol: {unit.symbol}</p>
                  </div>
                  {unit.description && (
                    <p className="text-sm text-muted-foreground">{unit.description}</p>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUnit(unit);
                        setIsModalOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteUnit(unit._id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {isModalOpen && (
        <CustomUnitModal
          unit={selectedUnit}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUnit(null);
          }}
          onSave={selectedUnit ? handleUpdateUnit : handleCreateUnit}
        />
      )}
    </div>
  );
};

export default CustomUnits; 