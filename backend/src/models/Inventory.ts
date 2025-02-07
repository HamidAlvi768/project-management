import { Schema, model, Document } from 'mongoose';

export enum InventoryUnit {
  PIECES = 'pieces',
  KG = 'kg',
  LITERS = 'liters',
  METERS = 'meters',
  SQUARE_METERS = 'square_meters',
  CUBIC_METERS = 'cubic_meters',
  CUSTOM = 'custom'
}

export interface IInventory extends Document {
  name: string;
  description: string;
  unit: InventoryUnit;
  unitValue: number;
  pricePerUnit: number;
  totalPrice: number;
  remainingValue: number;
  customUnit?: string;
  createdAt: Date;
  updatedAt: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    name: {
      type: String,
      required: [true, 'Inventory name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    unit: {
      type: String,
      enum: Object.values(InventoryUnit),
      required: [true, 'Unit is required'],
    },
    unitValue: {
      type: Number,
      required: [true, 'Qunatity is required'],
      min: [0, 'Qunatity cannot be negative'],
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price per unit is required'],
      min: [0, 'Price per unit cannot be negative'],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    remainingValue: {
      type: Number,
      default: function(this: IInventory) {
        return this.unitValue;
      },
    },
    customUnit: {
      type: String,
      trim: true,
      validate: {
        validator: function(this: IInventory, value: string | undefined): boolean {
          return this.unit !== InventoryUnit.CUSTOM || (!!value && value.length > 0);
        },
        message: 'Custom unit is required when unit type is custom',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total price before saving
inventorySchema.pre('save', function(this: IInventory & Document, next) {
  if (this.isModified('unitValue') || this.isModified('pricePerUnit')) {
    this.totalPrice = this.unitValue * this.pricePerUnit;
  }
  next();
});

export default model<IInventory>('Inventory', inventorySchema); 