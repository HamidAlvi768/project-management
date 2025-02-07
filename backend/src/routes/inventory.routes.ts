import { Router } from 'express';
import { Types } from 'mongoose';
import Inventory from '../models/Inventory';
import { catchAsync } from '../middleware/error';
import { AppError } from '../middleware/error';

const router = Router();

// Get all inventory items
router.get('/', catchAsync(async (req, res) => {
  const { search } = req.query;
  let query: any = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  const inventory = await Inventory.find(query).sort({ createdAt: -1 });
  res.json({
    success: true,
    data: inventory,
    message: 'Inventory items retrieved successfully'
  });
}));

// Get a single inventory item
router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid inventory ID', 400);
  }

  const inventory = await Inventory.findById(id);
  
  if (!inventory) {
    throw new AppError('Inventory item not found', 404);
  }
  
  res.json({
    success: true,
    data: inventory,
    message: 'Inventory item retrieved successfully'
  });
}));

// Create a new inventory item
router.post('/', catchAsync(async (req, res) => {
  const inventory = new Inventory(req.body);
  await inventory.save();
  res.status(201).json({
    success: true,
    data: inventory,
    message: 'Inventory item created successfully'
  });
}));

// Update an inventory item
router.patch('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid inventory ID', 400);
  }

  const inventory = await Inventory.findByIdAndUpdate(
    id,
    { $set: req.body },
    { new: true, runValidators: true }
  );

  if (!inventory) {
    throw new AppError('Inventory item not found', 404);
  }

  res.json({
    success: true,
    data: inventory,
    message: 'Inventory item updated successfully'
  });
}));

// Delete an inventory item
router.delete('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError('Invalid inventory ID', 400);
  }

  const inventory = await Inventory.findByIdAndDelete(id);
  
  if (!inventory) {
    throw new AppError('Inventory item not found', 404);
  }

  res.json({
    success: true,
    data: id,
    message: 'Inventory item deleted successfully'
  });
}));

export default router; 