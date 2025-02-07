import { Request, Response } from 'express';
import { catchAsync } from '../middleware/error';
import Task from '../models/Task';
import Phase from '../models/Phase';
import { AppError } from '../middleware/error';

export const taskController = {
  // Create a new task
  create: catchAsync(async (req: Request, res: Response) => {
    // Validate phase exists
    const phase = await Phase.findById(req.params.phaseId);
    if (!phase) {
      throw new AppError('Phase not found', 404);
    }

    const task = await Task.create({
      ...req.body,
      phase: req.params.phaseId,
    });

    res.status(201).json({
      status: 'success',
      data: task,
    });
  }),

  // Get all tasks for a phase with pagination and filters
  getAllForPhase: catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query = Task.find({ phase: req.params.phaseId });

    // Apply filters
    if (req.query.status) {
      query.where('status').equals(req.query.status);
    }
    if (req.query.type) {
      query.where('type').equals(req.query.type);
    }
    if (req.query.assignedTo) {
      query.where('assignedTo').equals(req.query.assignedTo);
    }
    if (req.query.search) {
      query.or([
        { name: new RegExp(req.query.search as string, 'i') },
        { description: new RegExp(req.query.search as string, 'i') },
      ]);
    }

    // Apply sorting
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query.sort(sortBy);
    } else {
      query.sort('startDate');
    }

    // Execute query with pagination
    const [tasks, total] = await Promise.all([
      query.skip(skip).limit(limit),
      Task.countDocuments(query.getFilter()),
    ]);

    res.status(200).json({
      status: 'success',
      results: tasks.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: tasks,
    });
  }),

  // Get a single task by ID
  getOne: catchAsync(async (req: Request, res: Response) => {
    const task = await Task.findById(req.params.id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: task,
    });
  }),

  // Update a task
  update: catchAsync(async (req: Request, res: Response) => {
    console.log('Task Update Request:', {
      taskId: req.params.id,
      updateData: req.body
    });

    // First find the task
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Update task fields
    Object.assign(task, req.body);
    
    // Save to trigger middleware
    console.log('Saving task to trigger hooks...');
    const updatedTask = await task.save();
    console.log('Task saved successfully');

    res.status(200).json({
      status: 'success',
      data: updatedTask,
    });
  }),

  // Delete a task
  delete: catchAsync(async (req: Request, res: Response) => {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }),

  // Update task status
  updateStatus: catchAsync(async (req: Request, res: Response) => {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: task,
    });
  }),

  // Reassign task
  reassign: catchAsync(async (req: Request, res: Response) => {
    const { assignedTo } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { assignedTo },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: task,
    });
  }),

  // Get task statistics by type
  getStatsByType: catchAsync(async (req: Request, res: Response) => {
    const stats = await Task.aggregate([
      {
        $match: { phase: req.params.phaseId },
      },
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 },
          totalCost: { $sum: '$estimatedCost' },
          completedTasks: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
          type: '$_id',
          count: 1,
          totalCost: 1,
          completedTasks: 1,
          completionRate: {
            $round: [{ $multiply: [{ $divide: ['$completedTasks', '$count'] }, 100] }, 2],
          },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  }),
}; 