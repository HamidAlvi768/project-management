import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import CustomerCard from '@/components/CustomerCard';
import CustomerModal from '@/components/CustomerModal';
import { ICustomer, ICustomerInput } from '@/services/types';
import { createCustomer, updateCustomer, deleteCustomer } from '@/services/api';
import { useToast } from "@/components/ui/use-toast";
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchCustomers, setSelectedCustomer } from '@/store/slices/customerSlice';
import { RootState } from '@/store/store';

const Customers: React.FC = () => {
  const dispatch = useAppDispatch();
  const { customers, isLoading, error } = useAppSelector((state: RootState) => state.customer);
  const [selectedCustomer, setLocalSelectedCustomer] = useState<ICustomer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchCustomers())
      .unwrap()
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to load customers",
          variant: "destructive",
        });
      });
  }, [dispatch, toast]);

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = searchQuery
      ? customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phoneNumber.includes(searchQuery)
      : true;

    const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCreateCustomer = async (data: ICustomerInput) => {
    try {
      const newCustomer = await createCustomer(data);
      dispatch(fetchCustomers()); // Refresh the list
      toast({
        title: "Success",
        description: "Customer created successfully",
      });
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create customer",
        variant: "destructive",
      });
    }
  };

  const handleUpdateCustomer = async (data: ICustomerInput) => {
    try {
      if (selectedCustomer) {
        await updateCustomer(selectedCustomer._id, data);
        dispatch(fetchCustomers()); // Refresh the list
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
        setIsModalOpen(false);
        setLocalSelectedCustomer(null);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCustomer = async (customerId: string) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await deleteCustomer(customerId);
        dispatch(fetchCustomers()); // Refresh the list
        toast({
          title: "Success",
          description: "Customer deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete customer",
          variant: "destructive",
        });
      }
    }
  };

  const handleEditCustomer = (customer: ICustomer) => {
    setLocalSelectedCustomer(customer);
    dispatch(setSelectedCustomer(customer));
    setIsModalOpen(true);
  };

  if (error) {
    return (
      <div className="container mx-auto py-6 text-center">
        <p className="text-red-500">Error loading customers: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Add Customer
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={setStatusFilter}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="contracted">Contracted</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="text-center py-4">Loading customers...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <CustomerCard
              key={customer._id}
              customer={customer}
              onEdit={handleEditCustomer}
              onDelete={handleDeleteCustomer}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={() => {
            setIsModalOpen(false);
            setLocalSelectedCustomer(null);
            dispatch(setSelectedCustomer(null));
          }}
          onSave={selectedCustomer ? handleUpdateCustomer : handleCreateCustomer}
        />
      )}
    </div>
  );
};

export default Customers; 