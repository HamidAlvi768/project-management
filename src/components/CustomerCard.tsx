import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Building2 } from "lucide-react";
import { ICustomer } from '../services/types';

interface CustomerCardProps {
  customer: ICustomer;
  onEdit: (customer: ICustomer) => void;
  onDelete: (customerId: string) => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'contracted':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'new':
        return 'bg-blue-500';
      case 'inactive':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-md hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold">{customer.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Badge className={getStatusColor(customer.status)}>
                {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{customer.phoneNumber}</span>
          </div>
          {customer.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-gray-500" />
              <span>{customer.email}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <span>{customer.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <span>{customer.projects?.length || 0} Projects</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => onEdit(customer)}>
          Edit
        </Button>
        <Button variant="destructive" onClick={() => onDelete(customer._id)}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CustomerCard; 