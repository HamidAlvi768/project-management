import mongoose, { Document, Schema } from 'mongoose';
import { IProject } from './Project';
import { PhaseStatus } from '../types/phase.types';

// Phase document interface
export interface IPhase extends Document {
  project: Schema.Types.ObjectId;
  name: string;
  estimatedBudget: number;
  actualCost: number;
  startDate: Date;
  endDate: Date;
  status: PhaseStatus;
  description: string;
  completion: number;
  taskCount: number;
  budgetVariance: number;
  dependencies: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// Phase schema
const PhaseSchema = new Schema<IPhase>(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Phase name is required'],
      trim: true,
      maxlength: [100, 'Phase name cannot be more than 100 characters'],
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
      enum: ['not-started', 'in-progress', 'completed', 'on-hold', 'cancelled'],
      default: 'not-started',
    },
    description: {
      type: String,
      required: [true, 'Phase description is required'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    completion: {
      type: Number,
      default: 0,
      min: [0, 'Completion percentage cannot be less than 0'],
      max: [100, 'Completion percentage cannot be more than 100'],
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
    dependencies: [{
      type: Schema.Types.ObjectId,
      ref: 'Phase'
    }],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add virtual field for tasks
PhaseSchema.virtual('tasks', {
  ref: 'Task',
  localField: '_id',
  foreignField: 'phase',
});

// Pre-save middleware to calculate budget variance
PhaseSchema.pre('save', function(next) {
  this.budgetVariance = this.actualCost - this.estimatedBudget;
  next();
});

// Ensure end date is after start date
PhaseSchema.pre('save', function(next) {
  if (this.endDate < this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Update project phase count and budget on phase changes
PhaseSchema.post('save', async function() {
  const Project = mongoose.model('Project');
  const phaseCount = await mongoose.model('Phase').countDocuments({ project: this.project });
  
  const phases = await mongoose.model('Phase').find({ project: this.project });
  const totalActualCost = phases.reduce((sum, phase) => sum + phase.actualCost, 0);
  const totalCompletion = phases.reduce((sum, phase) => sum + phase.completion, 0);
  const averageCompletion = phases.length > 0 ? Math.round(totalCompletion / phases.length) : 0;
  
  await Project.findByIdAndUpdate(this.project, {
    phaseCount,
    actualCost: totalActualCost,
    completion: averageCompletion,
  });
});

export default mongoose.model<IPhase>('Phase', PhaseSchema);