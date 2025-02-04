import { Request, Response } from 'express';
import { catchAsync } from '../middleware/error';
import Phase from '../models/Phase';
import { AppError } from '../middleware/error';

export const phaseController = {
  // Create a new phase
  create: catchAsync(async (req: Request, res: Response) => {
    const phase = await Phase.create({
      ...req.body,
      project: req.params.projectId,
    });

    res.status(201).json({
      status: 'success',
      data: phase,
    });
  }),

  // Get all phases for a project with pagination and filters
  getAllForProject: catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const query = Phase.find({ project: req.params.projectId });

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
      query.sort('startDate');
    }

    // Execute query with pagination
    const [phases, total] = await Promise.all([
      query.skip(skip).limit(limit),
      Phase.countDocuments(query.getFilter()),
    ]);

    res.status(200).json({
      status: 'success',
      results: phases.length,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      data: phases,
    });
  }),

  // Get a single phase by ID with tasks
  getOne: catchAsync(async (req: Request, res: Response) => {
    const phase = await Phase.findById(req.params.id)
      .populate('tasks')
      .populate('dependencies');

    if (!phase) {
      throw new AppError('Phase not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: phase,
    });
  }),

  // Update a phase
  update: catchAsync(async (req: Request, res: Response) => {
    const phase = await Phase.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!phase) {
      throw new AppError('Phase not found', 404);
    }

    res.status(200).json({
      status: 'success',
      data: phase,
    });
  }),

  // Delete a phase
  delete: catchAsync(async (req: Request, res: Response) => {
    const phase = await Phase.findByIdAndDelete(req.params.id);

    if (!phase) {
      throw new AppError('Phase not found', 404);
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }),

  // Get phase cost breakdown
  getCostBreakdown: catchAsync(async (req: Request, res: Response) => {
    const phase = await Phase.findById(req.params.id);

    if (!phase) {
      throw new AppError('Phase not found', 404);
    }

    const totalCost = phase.laborCost + phase.materialCost + phase.equipmentCost;
    const costBreakdown = {
      total: totalCost,
      labor: {
        amount: phase.laborCost,
        percentage: totalCost > 0 ? Math.round((phase.laborCost / totalCost) * 100) : 0,
      },
      material: {
        amount: phase.materialCost,
        percentage: totalCost > 0 ? Math.round((phase.materialCost / totalCost) * 100) : 0,
      },
      equipment: {
        amount: phase.equipmentCost,
        percentage: totalCost > 0 ? Math.round((phase.equipmentCost / totalCost) * 100) : 0,
      },
      budgetVariance: phase.budgetVariance,
    };

    res.status(200).json({
      status: 'success',
      data: costBreakdown,
    });
  }),

  // Update phase dependencies
  updateDependencies: catchAsync(async (req: Request, res: Response) => {
    const { dependencies } = req.body;
    
    // Validate that all dependencies exist and belong to the same project
    const phase = await Phase.findById(req.params.id);
    if (!phase) {
      throw new AppError('Phase not found', 404);
    }

    const dependencyPhases = await Phase.find({
      _id: { $in: dependencies },
      project: phase.project,
    });

    if (dependencyPhases.length !== dependencies.length) {
      throw new AppError('Invalid dependencies provided', 400);
    }

    // Check for circular dependencies
    const isCircular = await checkCircularDependencies(req.params.id, dependencies);
    if (isCircular) {
      throw new AppError('Circular dependencies are not allowed', 400);
    }

    phase.dependencies = dependencies;
    await phase.save();

    res.status(200).json({
      status: 'success',
      data: phase,
    });
  }),
};

// Helper function to check for circular dependencies
async function checkCircularDependencies(
  phaseId: string,
  dependencies: string[],
  visited: Set<string> = new Set()
): Promise<boolean> {
  if (visited.has(phaseId)) {
    return true;
  }

  visited.add(phaseId);

  for (const depId of dependencies) {
    const depPhase = await Phase.findById(depId);
    if (!depPhase) continue;

    if (await checkCircularDependencies(depId, depPhase.dependencies, visited)) {
      return true;
    }
  }

  visited.delete(phaseId);
  return false;
} 