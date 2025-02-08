import { Router } from 'express';
import { Types } from 'mongoose';
import CustomUnit from '../models/CustomUnit';
import { catchAsync } from '../middleware/error';
import { AppError } from '../middleware/error';

const router = Router();

// Get all custom units with optional search
router.get('/', catchAsync(async (req, res) => {
  const { search, active } = req.query;
  let query: any = {};

  if (search) {
    query.$text = { $search: search as string };
  }

  if (active !== undefined) {
    query.isActive = active === 'true';
  }

  const units = await CustomUnit.find(query).sort({ createdAt: -1 });
  res.json({
    success: true,
    data: units,
    message: 'Custom units retrieved successfully'
  });
}));

// Get a single custom unit
router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid custom unit ID', 400);
  }

  const unit = await CustomUnit.findById(id);
  
  if (!unit) {
    throw new AppError('Custom unit not found', 404);
  }
  
  res.json({
    success: true,
    data: unit,
    message: 'Custom unit retrieved successfully'
  });
}));

// Create a new custom unit
router.post('/', catchAsync(async (req, res) => {
  const unit = new CustomUnit(req.body);
  await unit.save();
  res.status(201).json({
    success: true,
    data: unit,
    message: 'Custom unit created successfully'
  });
}));

// Update a custom unit
router.patch('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid custom unit ID', 400);
  }

  const unit = await CustomUnit.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!unit) {
    throw new AppError('Custom unit not found', 404);
  }

  res.json({
    success: true,
    data: unit,
    message: 'Custom unit updated successfully'
  });
}));

// Delete a custom unit (soft delete by setting isActive to false)
router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid custom unit ID', 400);
  }

  const unit = await CustomUnit.findByIdAndUpdate(
    id,
    { $set: { isActive: false } },
    { new: true }
  );
  
  if (!unit) {
    throw new AppError('Custom unit not found', 404);
  }

  res.json({
    success: true,
    data: unit,
    message: 'Custom unit deactivated successfully'
  });
}));

export default router; 