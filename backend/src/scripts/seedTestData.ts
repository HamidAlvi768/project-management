import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Customer from '../models/Customer';
import Project from '../models/Project';
import Phase from '../models/Phase';
import Task from '../models/Task';
import Inventory from '../models/Inventory';
import CustomUnit from '../models/CustomUnit';
import TaskInventory from '../models/TaskInventory';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB Atlas
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB Atlas');

    // Clear existing data
    await Promise.all([
      Customer.deleteMany({}),
      Project.deleteMany({}),
      Phase.deleteMany({}),
      Task.deleteMany({}),
      Inventory.deleteMany({}),
      CustomUnit.deleteMany({}),
      TaskInventory.deleteMany({})
    ]);

    // Create Custom Units
    const units = await CustomUnit.create([
      { name: 'Square Meters', symbol: 'm²', type: 'area' },
      { name: 'Cubic Meters', symbol: 'm³', type: 'volume' },
      { name: 'Man Hours', symbol: 'MH', type: 'time' }
    ]);

    // Create Customers
    const customers = await Customer.create([
      {
        name: 'John Smith Construction',
        email: 'john@construction.com',
        phoneNumber: '+1234567890',
        address: '123 Builder St, Construction City',
        status: 'active',
        notes: 'Premium client for commercial projects'
      },
      {
        name: 'Sarah Development Corp',
        email: 'sarah@development.com',
        phoneNumber: '+1987654321',
        address: '456 Developer Ave, Business District',
        status: 'new',
        notes: 'Interested in residential projects'
      }
    ]);

    // Create Projects
    const projects = await Project.create([
      {
        name: 'Commercial Complex Alpha',
        customer: customers[0]._id,
        estimatedBudget: 2000000,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-12-31'),
        status: 'ongoing',
        description: 'Modern commercial complex with office spaces',
        stakeholders: ['Project Manager', 'Site Engineer', 'Architect'],
        completion: 0
      },
      {
        name: 'Residential Tower Beta',
        customer: customers[1]._id,
        estimatedBudget: 1500000,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2025-02-28'),
        status: 'planning',
        description: 'Luxury residential tower with 20 floors',
        stakeholders: ['Lead Architect', 'Civil Engineer', 'Interior Designer'],
        completion: 0
      }
    ]);

    // Create Phases
    const phases = await Phase.create([
      {
        name: 'Foundation Work',
        project: projects[0]._id,
        estimatedBudget: 300000,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-03-15'),
        status: 'in-progress',
        description: 'Foundation and basement construction',
        laborCost: 100000,
        materialCost: 150000,
        equipmentCost: 50000,
        completion: 0
      },
      {
        name: 'Structural Work',
        project: projects[0]._id,
        estimatedBudget: 500000,
        startDate: new Date('2024-03-16'),
        endDate: new Date('2024-06-30'),
        status: 'pending',
        description: 'Main building structure and framework',
        laborCost: 200000,
        materialCost: 250000,
        equipmentCost: 50000,
        completion: 0
      }
    ]);

    // Create Inventory Items
    const inventory = await Inventory.create([
      {
        name: 'Cement',
        quantity: 1000,
        unit: units[0]._id,
        unitPrice: 15,
        category: 'Construction Materials',
        location: 'Main Warehouse',
        minimumStock: 100,
        description: 'Portland Cement Type I/II'
      },
      {
        name: 'Steel Rebar',
        quantity: 500,
        unit: units[1]._id,
        unitPrice: 45,
        category: 'Construction Materials',
        location: 'Steel Yard',
        minimumStock: 50,
        description: 'Grade 60 Steel Reinforcement Bars'
      }
    ]);

    // Create Tasks
    const tasks = await Task.create([
      {
        name: 'Site Excavation',
        phase: phases[0]._id,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-02-15'),
        status: 'in-progress',
        priority: 'high',
        assignedTo: ['Site Engineer', 'Equipment Operator'],
        description: 'Excavation work for foundation',
        estimatedCost: 50000,
        actualCost: 0,
        completion: 0
      },
      {
        name: 'Foundation Concrete Pour',
        phase: phases[0]._id,
        startDate: new Date('2024-02-16'),
        endDate: new Date('2024-03-01'),
        status: 'pending',
        priority: 'high',
        assignedTo: ['Concrete Team Lead', 'Quality Inspector'],
        description: 'Concrete pouring for foundation',
        estimatedCost: 75000,
        actualCost: 0,
        completion: 0
      }
    ]);

    // Create Task Inventory Associations
    await TaskInventory.create([
      {
        task: tasks[0]._id,
        inventory: inventory[0]._id,
        quantityRequired: 200,
        quantityUsed: 0,
        status: 'allocated'
      },
      {
        task: tasks[1]._id,
        inventory: inventory[1]._id,
        quantityRequired: 100,
        quantityUsed: 0,
        status: 'allocated'
      }
    ]);

    console.log('Test data seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedDatabase(); 