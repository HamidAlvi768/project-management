import { Router } from 'express';
import { Types } from 'mongoose';
import Customer, { CustomerStatus } from '../models/Customer';

const router = Router();

// Create a new customer
router.post('/', async (req, res) => {
  try {
    const customer = new Customer(req.body);
    await customer.save();
    res.status(201).json(customer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Get all customers with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    let query: any = {};

    if (status && Object.values(CustomerStatus).includes(status as CustomerStatus)) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phoneNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const customers = await Customer.find(query)
      .populate('projects', 'name status')
      .sort({ createdAt: -1 });
    
    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific customer by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid customer ID' });
    }

    const customer = await Customer.findById(id).populate('projects', 'name status');
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    
    res.json(customer);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Update a customer
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid customer ID' });
    }

    const customer = await Customer.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json(customer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a customer
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid customer ID' });
    }

    const customer = await Customer.findByIdAndDelete(id);
    
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.json({ message: 'Customer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router; 