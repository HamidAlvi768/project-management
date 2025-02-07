import { Router } from 'express';
import { Types } from 'mongoose';
import TaskInventory from '../models/TaskInventory';
import Inventory from '../models/Inventory';
import Task from '../models/Task';
import Phase from '../models/Phase';
import { catchAsync } from '../middleware/error';
import { AppError } from '../middleware/error';

const router = Router({ mergeParams: true });

// Get all inventory items for a task
router.get('/', catchAsync(async (req, res) => {
  const { taskId } = req.params;
  
  if (!Types.ObjectId.isValid(taskId)) {
    throw new AppError('Invalid task ID', 400);
  }

  const taskInventory = await TaskInventory.find({ task: taskId })
    .populate('inventory')
    .sort({ createdAt: -1 });

  res.json(taskInventory);
}));

// Add inventory to task
router.post('/', catchAsync(async (req, res) => {
  const { taskId } = req.params;
  const { inventory: inventoryId, allocatedValue } = req.body;
  
  if (!Types.ObjectId.isValid(taskId) || !Types.ObjectId.isValid(inventoryId)) {
    throw new AppError('Invalid task ID or inventory ID', 400);
  }

  // First, get the task
  const task = await Task.findById(taskId);
  if (!task) {
    throw new AppError('Task not found', 404);
  }

  // Get the phase
  const phase = await Phase.findById(task.phase).populate({
    path: 'project',
    populate: {
      path: 'customer'
    }
  });
  if (!phase) {
    throw new AppError('Phase not found', 404);
  }

  if (!phase.project) {
    throw new AppError('Project not found', 404);
  }

  if (!phase.project.customer) {
    throw new AppError('Customer not found', 404);
  }

  // Check if inventory exists and has enough remaining value
  const inventory = await Inventory.findById(inventoryId);
  if (!inventory) {
    throw new AppError('Inventory item not found', 404);
  }

  if (inventory.remainingValue < allocatedValue) {
    throw new AppError('Not enough inventory remaining', 400);
  }

  // Create task inventory with all required references
  const taskInventory = new TaskInventory({
    task: taskId,
    phase: phase._id,
    project: phase.project._id,
    customer: phase.project.customer._id,
    inventory: inventoryId,
    allocatedValue
  });

  await taskInventory.save();

  // Update inventory remaining value
  inventory.remainingValue -= allocatedValue;
  await inventory.save();

  await taskInventory.populate('inventory');
  res.status(201).json(taskInventory);
}));

// Update task inventory
router.patch('/:inventoryId', catchAsync(async (req, res) => {
  const { taskId, inventoryId } = req.params;
  const { allocatedValue } = req.body;
  
  if (!Types.ObjectId.isValid(taskId) || !Types.ObjectId.isValid(inventoryId)) {
    throw new AppError('Invalid task ID or inventory ID', 400);
  }

  const taskInventory = await TaskInventory.findOne({
    task: taskId,
    _id: inventoryId,
  });

  if (!taskInventory) {
    throw new AppError('Task inventory not found', 404);
  }

  if (allocatedValue !== undefined) {
    const inventory = await Inventory.findById(taskInventory.inventory);
    if (!inventory) {
      throw new AppError('Inventory item not found', 404);
    }

    // Calculate the difference in allocation
    const allocationDiff = allocatedValue - taskInventory.allocatedValue;
    if (allocationDiff > inventory.remainingValue) {
      throw new AppError('Not enough inventory remaining', 400);
    }

    // Update inventory remaining value
    inventory.remainingValue -= allocationDiff;
    await inventory.save();
  }

  Object.assign(taskInventory, req.body);
  await taskInventory.save();
  await taskInventory.populate('inventory');

  res.json(taskInventory);
}));

// Delete task inventory
router.delete('/:inventoryId', catchAsync(async (req, res) => {
  const { taskId, inventoryId } = req.params;
  
  if (!Types.ObjectId.isValid(taskId) || !Types.ObjectId.isValid(inventoryId)) {
    throw new AppError('Invalid task ID or inventory ID', 400);
  }

  const taskInventory = await TaskInventory.findOne({
    task: taskId,
    _id: inventoryId,
  });

  if (!taskInventory) {
    throw new AppError('Task inventory not found', 404);
  }

  // Return allocated value to inventory
  const inventory = await Inventory.findById(taskInventory.inventory);
  if (inventory) {
    inventory.remainingValue += taskInventory.allocatedValue - taskInventory.consumedValue;
    await inventory.save();
  }

  await taskInventory.deleteOne();
  res.status(204).json(null);
}));

// Update consumed value
router.patch('/:inventoryId/consume', catchAsync(async (req, res) => {
  const { taskId, inventoryId } = req.params;
  const { consumedValue } = req.body;
  
  if (!Types.ObjectId.isValid(taskId) || !Types.ObjectId.isValid(inventoryId)) {
    throw new AppError('Invalid task ID or inventory ID', 400);
  }

  const taskInventory = await TaskInventory.findOne({
    task: taskId,
    _id: inventoryId,
  });

  if (!taskInventory) {
    throw new AppError('Task inventory not found', 404);
  }

  if (consumedValue > taskInventory.allocatedValue) {
    throw new AppError('Consumed value cannot exceed allocated value', 400);
  }

  taskInventory.consumedValue = consumedValue;
  await taskInventory.save();
  await taskInventory.populate('inventory');

  res.json(taskInventory);
}));

export default router; 