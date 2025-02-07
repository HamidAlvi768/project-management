import { Schema, model, Document } from 'mongoose';

export interface ITaskInventory extends Document {
  task: Schema.Types.ObjectId;
  phase: Schema.Types.ObjectId;
  project: Schema.Types.ObjectId;
  customer: Schema.Types.ObjectId;
  inventory: Schema.Types.ObjectId;
  allocatedValue: number;
  consumedValue: number;
  remainingValue: number;
  createdAt: Date;
  updatedAt: Date;
}

const taskInventorySchema = new Schema<ITaskInventory>(
  {
    task: {
      type: Schema.Types.ObjectId,
      ref: 'Task',
      required: [true, 'Task reference is required'],
    },
    phase: {
      type: Schema.Types.ObjectId,
      ref: 'Phase',
      required: [true, 'Phase reference is required'],
    },
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer reference is required'],
    },
    inventory: {
      type: Schema.Types.ObjectId,
      ref: 'Inventory',
      required: [true, 'Inventory reference is required'],
    },
    allocatedValue: {
      type: Number,
      required: [true, 'Allocated value is required'],
      min: [0, 'Allocated value cannot be negative'],
    },
    consumedValue: {
      type: Number,
      default: 0,
      min: [0, 'Consumed value cannot be negative'],
      validate: {
        validator: function(this: ITaskInventory, value: number) {
          return value <= this.allocatedValue;
        },
        message: 'Consumed value cannot exceed allocated value',
      },
    },
    remainingValue: {
      type: Number,
      default: function(this: ITaskInventory) {
        return this.allocatedValue;
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Update remaining value before saving
taskInventorySchema.pre('save', function(next) {
  this.remainingValue = this.allocatedValue - this.consumedValue;
  next();
});

// Populate references by default
taskInventorySchema.pre(/^find/, function(next) {
  this.populate('inventory', 'name unit customUnit pricePerUnit');
  next();
});

export default model<ITaskInventory>('TaskInventory', taskInventorySchema); 