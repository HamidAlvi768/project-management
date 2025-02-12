import { Schema, model, Document, Types } from 'mongoose';

export interface IInventory extends Document {
  name: string;
  description: string;
  unit: Types.ObjectId;
  unitValue: number;
  pricePerUnit: number;
  totalPrice: number;
  remainingValue: number;
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
      type: Schema.Types.ObjectId,
      ref: 'CustomUnit',
      required: [true, 'Unit is required'],
      validate: {
        validator: function(value: Types.ObjectId) {
          return Types.ObjectId.isValid(value);
        },
        message: 'Invalid unit ID'
      }
    },
    unitValue: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0, 'Quantity cannot be negative'],
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

// Always populate the unit reference
inventorySchema.pre(/^find/, function(next) {
  this.populate({
    path: 'unit',
    select: 'name symbol'
  });
  next();
});

export default model<IInventory>('Inventory', inventorySchema); 