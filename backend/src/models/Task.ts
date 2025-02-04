import mongoose, { Document, Schema } from 'mongoose';
import { IPhase } from './Phase';
import { TaskStatus, TaskType, TASK_STATUS, TASK_TYPE, TASK_STATUS_VALUES, TASK_TYPE_VALUES } from '../types/task.types';

// Task document interface
export interface ITask extends Document {
  phase: IPhase['_id'];
  name: string;
  estimatedCost: number;
  startDate: Date;
  endDate: Date;
  status: TaskStatus;
  description: string;
  type: TaskType;
  assignedTo: string;
  createdAt: Date;
  updatedAt: Date;
}

// Task schema
const TaskSchema = new Schema<ITask>(
  {
    phase: {
      type: Schema.Types.ObjectId,
      ref: 'Phase',
      required: [true, 'Phase reference is required'],
    },
    name: {
      type: String,
      required: [true, 'Task name is required'],
      trim: true,
      maxlength: [100, 'Task name cannot be more than 100 characters'],
    },
    estimatedCost: {
      type: Number,
      required: [true, 'Estimated cost is required'],
      min: [0, 'Estimated cost cannot be negative'],
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
      enum: {
        values: TASK_STATUS_VALUES,
        message: 'Invalid task status'
      },
      default: TASK_STATUS.PENDING,
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    type: {
      type: String,
      enum: {
        values: TASK_TYPE_VALUES,
        message: 'Invalid task type'
      },
      required: [true, 'Task type is required'],
    },
    assignedTo: {
      type: String,
      required: [true, 'Task must be assigned to someone'],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure end date is after start date
TaskSchema.pre('save', function(next) {
  if (this.endDate < this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Update phase task count on task changes
TaskSchema.post('save', async function() {
  const Phase = mongoose.model('Phase');
  const taskCount = await mongoose.model('Task').countDocuments({ phase: this.phase });
  
  // Calculate phase completion based on completed tasks
  const tasks = await mongoose.model('Task').find({ phase: this.phase });
  const completedTasks = tasks.filter(task => task.status === 'completed').length;
  const completion = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
  
  await Phase.findByIdAndUpdate(this.phase, {
    taskCount,
    completion,
  });
});

// Update costs in phase based on task type
TaskSchema.post('save', async function() {
  const Phase = mongoose.model('Phase');
  const tasks = await mongoose.model('Task').find({ phase: this.phase });
  
  const costs = tasks.reduce((acc, task) => {
    switch (task.type) {
      case 'construction':
        acc.laborCost += task.estimatedCost;
        break;
      case 'procurement':
        acc.materialCost += task.estimatedCost;
        break;
      case 'inspection':
        acc.equipmentCost += task.estimatedCost;
        break;
    }
    return acc;
  }, { laborCost: 0, materialCost: 0, equipmentCost: 0 });
  
  await Phase.findByIdAndUpdate(this.phase, costs);
});

export default mongoose.model<ITask>('Task', TaskSchema); 