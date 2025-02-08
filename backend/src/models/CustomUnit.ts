import { Schema, model, Document } from 'mongoose';

export interface ICustomUnit extends Document {
  name: string;
  symbol: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const customUnitSchema = new Schema<ICustomUnit>(
  {
    name: {
      type: String,
      required: [true, 'Unit name is required'],
      trim: true,
      maxlength: [50, 'Unit name cannot be more than 50 characters'],
      unique: true,
    },
    symbol: {
      type: String,
      required: [true, 'Unit symbol is required'],
      trim: true,
      maxlength: [10, 'Unit symbol cannot be more than 10 characters'],
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: [200, 'Description cannot be more than 200 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Create text indexes for search
customUnitSchema.index({ name: 'text', symbol: 'text', description: 'text' });

export default model<ICustomUnit>('CustomUnit', customUnitSchema); 