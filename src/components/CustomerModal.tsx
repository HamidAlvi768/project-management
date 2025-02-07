import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ICustomer, ICustomerInput, CustomerStatus } from '../services/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface CustomerModalProps {
  customer?: ICustomer | null;
  onClose: () => void;
  onSave: (data: ICustomerInput) => void;
}

const customerSchema = z.object({
  name: z.string()
    .min(1, 'Customer name is required')
    .max(100, 'Customer name cannot be more than 100 characters'),
  phoneNumber: z.string()
    .min(1, 'Phone number is required')
    .regex(/^\+?[\d\s-()]+$/, 'Invalid phone number format'),
  address: z.string()
    .min(1, 'Address is required')
    .max(200, 'Address cannot be more than 200 characters'),
  status: z.enum(['new', 'contracted', 'pending', 'inactive'] as const),
  email: z.string()
    .email('Invalid email format')
    .optional()
    .or(z.literal('')),
  notes: z.string()
    .max(500, 'Notes cannot be more than 500 characters')
    .optional()
});

const CustomerModal: React.FC<CustomerModalProps> = ({ customer, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ICustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer ? {
      name: customer.name,
      phoneNumber: customer.phoneNumber,
      address: customer.address,
      status: customer.status,
      email: customer.email || '',
      notes: customer.notes || ''
    } : {
      status: 'new' as CustomerStatus
    }
  });

  const onSubmit = (data: ICustomerInput) => {
    onSave(data);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{customer ? 'Edit Customer' : 'Add New Customer'}</DialogTitle>
          <DialogDescription>
            {customer ? 'Edit the customer details below.' : 'Fill in the customer details below.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Customer Name</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Enter customer name"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              {...register('phoneNumber')}
              placeholder="Enter phone number"
            />
            {errors.phoneNumber && (
              <p className="text-sm text-red-500">{errors.phoneNumber.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email (Optional)</Label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="Enter email address"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              {...register('address')}
              placeholder="Enter address"
            />
            {errors.address && (
              <p className="text-sm text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value: CustomerStatus) => setValue('status', value)}
              defaultValue={customer?.status || 'new'}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="contracted">Contracted</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && (
              <p className="text-sm text-red-500">{errors.status.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              {...register('notes')}
              placeholder="Enter additional notes"
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {customer ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomerModal; 