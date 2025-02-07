import mongoose, { Document, Schema } from 'mongoose';
import { IPhase } from './Phase';

export enum TaskStatus {
  NOT_STARTED = 'not-started',
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}

export enum TaskType {
  CONSTRUCTION = 'construction',
  PROCUREMENT = 'procurement',
  INSPECTION = 'inspection'
}

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
      enum: Object.values(TaskStatus),
      default: TaskStatus.NOT_STARTED,
    },
    description: {
      type: String,
      required: [true, 'Task description is required'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    type: {
      type: String,
      enum: Object.values(TaskType),
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
  console.log('Pre-save middleware triggered');
  if (this.endDate < this.startDate) {
    next(new Error('End date must be after start date'));
  }
  next();
});

// Update phase task count on task changes
TaskSchema.post('save', async function() {
  console.log('\n=== Phase Completion Calculation Debug ===');
  console.log('Post-save middleware triggered');
  console.log('Triggered by Task:', {
    taskId: this._id,
    taskName: this.name,
    taskStatus: this.status,
    phaseId: this.phase
  });

  try {
    const Phase = mongoose.model('Phase');
    const taskCount = await mongoose.model('Task').countDocuments({ phase: this.phase });
    console.log('Total Task Count:', taskCount);
    
    // Calculate phase completion based on completed tasks
    const tasks = await mongoose.model('Task').find({ phase: this.phase });
    console.log('All Tasks in Phase:', tasks.map(task => ({
      id: task._id,
      name: task.name,
      status: task.status
    })));
    
    const completedTasks = tasks.filter(task => task.status === TaskStatus.COMPLETED).length;
    const completion = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;
    
    console.log('Completion Calculation:', {
      totalTasks: tasks.length,
      completedTasks,
      completionPercentage: completion
    });
    
    await Phase.findByIdAndUpdate(this.phase, {
      taskCount,
      completion,
    });
    console.log('Phase Updated with completion:', completion);
  } catch (error) {
    console.error('Error in post-save hook:', error);
  }
  console.log('=====================================\n');
});

// Update costs in phase based on task type
TaskSchema.post('save', async function() {
  console.log('Post-save middleware triggered for cost update');
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
  console.log('Phase Updated with costs:', costs);
});

export default mongoose.model<ITask>('Task', TaskSchema); 