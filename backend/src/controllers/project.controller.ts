import { Request, Response } from 'express';
import { catchAsync } from '../middleware/error';
import Project from '../models/Project';
import Customer from '../models/Customer';
import { AppError } from '../middleware/error';

export const projectController = {
  // Create a new project
  create: catchAsync(async (req: Request, res: Response) => {
    const project = await Project.create(req.body);
    
    // Update customer's projects array
    await Customer.findByIdAndUpdate(
      req.body.customer,
      { $addToSet: { projects: project._id } }
    );

    // Log the updated customer for debugging
    const updatedCustomer = await Customer.findById(req.body.customer);
    console.log('Updated Customer after project creation:', updatedCustomer);

    res.status(201).json({
      status: 'success',
      data: project,
    });
  }),

  // Get all projects with pagination and filters
  getAll: catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query = Project.find();

    // Apply filters
    if (req.query.status) {
      query.where('status').equals(req.query.status);
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
      query.sort('-createdAt');
    }

    // Execute query with pagination
    const [projects, total] = await Promise.all([
      query.skip(skip).limit(limit).populate('customer', 'name'),
      Project.countDocuments(query.getFilter()),
    ]);

    res.status(200).json({
      status: 'success',
      results: projects.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: projects,
    });
  }),

  // Get a single project by ID with phases
  getOne: catchAsync(async (req: Request, res: Response) => {
    const project = await Project.findById(req.params.id)
      .populate('phases')
      .populate('customer', 'name');

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: project,
    });
  }),

  // Update a project
  update: catchAsync(async (req: Request, res: Response) => {
    const oldProject = await Project.findById(req.params.id);
    if (!oldProject) {
      throw new AppError('Project not found', 404);
    }

    // If customer is being changed
    if (req.body.customer && req.body.customer !== oldProject.customer.toString()) {
      // Remove project from old customer's projects array
      await Customer.findByIdAndUpdate(
        oldProject.customer,
        { $pull: { projects: oldProject._id } }
      );

      // Add project to new customer's projects array
      await Customer.findByIdAndUpdate(
        req.body.customer,
        { $addToSet: { projects: oldProject._id } }
      );
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).populate('customer', 'name');

    res.status(200).json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });
  }),

  // Delete a project
  delete: catchAsync(async (req: Request, res: Response) => {
    const project = await Project.findById(req.params.id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }

    // Remove project from customer's projects array
    await Customer.findByIdAndUpdate(
      project.customer,
      { $pull: { projects: project._id } }
    );

    // Log the updated customer for debugging
    const updatedCustomer = await Customer.findById(project.customer);
    console.log('Updated Customer after project deletion:', updatedCustomer);

    await project.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }),

  // Get project statistics
  getStats: catchAsync(async (req: Request, res: Response) => {
    const stats = await Project.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalBudget: { $sum: '$estimatedBudget' },
          totalCost: { $sum: '$actualCost' },
          avgCompletion: { $avg: '$completion' },
        },
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          count: 1,
          totalBudget: 1,
          totalCost: 1,
          avgCompletion: { $round: ['$avgCompletion', 2] },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: stats,
    });
  }),

  // Get project timeline
  getTimeline: catchAsync(async (req: Request, res: Response) => {
    const project = await Project.findById(req.params.id).populate({
      path: 'phases',
      populate: {
        path: 'tasks',
      },
    });

    if (!project) {
      throw new AppError('Project not found', 404);
    }

    const timeline = {
      project: {
        name: project.name,
        startDate: project.startDate,
        endDate: project.endDate,
        completion: project.completion,
      },
      phases: project.phases.map((phase: any) => ({
        name: phase.name,
        startDate: phase.startDate,
        endDate: phase.endDate,
        completion: phase.completion,
        tasks: phase.tasks.map((task: any) => ({
          name: task.name,
          startDate: task.startDate,
          endDate: task.endDate,
          status: task.status,
        })),
      })),
    };

    res.status(200).json({
      status: 'success',
      data: timeline,
    });
  }),
}; 