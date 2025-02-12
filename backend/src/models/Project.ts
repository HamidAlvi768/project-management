import mongoose, { Document, Schema } from 'mongoose';
import { ProjectStatus, PROJECT_STATUS_VALUES } from '../types/project.types';

// Project document interface
export interface IProject extends Document {
  name: string;
  customer: Schema.Types.ObjectId;
  estimatedBudget: number;
  actualCost: number;
  startDate: Date;
  endDate: Date;
  status: ProjectStatus;
  description: string;
  completion: number;
  phaseCount: number;
  taskCount: number;
  budgetVariance: number;
  createdAt: Date;
  updatedAt: Date;
}

// Project schema
const ProjectSchema = new Schema<IProject>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name cannot be more than 100 characters'],
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: 'Customer',
      required: [true, 'Customer is required'],
    },
    estimatedBudget: {
      type: Number,
      required: [true, 'Estimated budget is required'],
      min: [0, 'Estimated budget cannot be negative'],
    },
    actualCost: {
      type: Number,
      default: 0,
      min: [0, 'Actual cost cannot be negative'],
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    status: {
      type: String,
      enum: PROJECT_STATUS_VALUES,
      default: 'not-started',
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    completion: {
      type: Number,
      default: 0,
      min: [0, 'Completion percentage cannot be less than 0'],
      max: [100, 'Completion percentage cannot be more than 100'],
    },
    phaseCount: {
      type: Number,
      default: 0,
      min: [0, 'Phase count cannot be negative'],
    },
    taskCount: {
      type: Number,
      default: 0,
      min: [0, 'Task count cannot be negative'],
    },
    budgetVariance: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add virtual field for phases
ProjectSchema.virtual('phases', {
  ref: 'Phase',
  localField: '_id',
  foreignField: 'project',
});

// Pre-save middleware to calculate budget variance
ProjectSchema.pre('save', function(next) {
  this.budgetVariance = this.actualCost - this.estimatedBudget;
  next();
});

// Ensure end date is after start date
ProjectSchema.pre('save', function(next) {
  if (this.endDate < this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

export default mongoose.model<IProject>('Project', ProjectSchema); 