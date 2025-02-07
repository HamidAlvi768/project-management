import { Schema, model, Document } from 'mongoose';

export enum CustomerStatus {
  NEW = 'new',
  CONTRACTED = 'contracted',
  PENDING = 'pending',
  INACTIVE = 'inactive'
}

export interface ICustomer extends Document {
  name: string;
  phoneNumber: string;
  address: string;
  status: CustomerStatus;
  email?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  projects?: Schema.Types.ObjectId[];
}

const customerSchema = new Schema<ICustomer>(
  {
    name: {
      type: String,
      required: [true, 'Customer name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: Object.values(CustomerStatus),
      default: CustomerStatus.NEW,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    notes: {
      type: String,
      trim: true,
    },
    projects: [{
      type: Schema.Types.ObjectId,
      ref: 'Project'
    }]
  },
  {
    timestamps: true,
  }
);

export default model<ICustomer>('Customer', customerSchema); 