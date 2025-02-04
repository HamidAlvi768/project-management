import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../../services/api';

// Mock data
export const mockProject = {
  _id: '1',
  name: 'Test Project',
  estimatedBudget: 100000,
  actualCost: 80000,
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  status: 'ongoing',
  description: 'Test project description',
  completion: 50,
  stakeholders: ['John Doe', 'Jane Smith'],
  phaseCount: 2,
  taskCount: 5,
  budgetVariance: -20000,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01'
};

export const mockPhase = {
  _id: '1',
  name: 'Test Phase',
  estimatedBudget: 50000,
  actualCost: 40000,
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  status: 'in-progress',
  description: 'Test phase description',
  completion: 60,
  taskCount: 3,
  budgetVariance: -10000,
  laborCost: 20000,
  materialCost: 15000,
  equipmentCost: 5000,
  dependencies: []
};

export const mockTask = {
  _id: '1',
  name: 'Test Task',
  description: 'Test task description',
  startDate: '2024-01-01',
  endDate: '2024-03-31',
  status: 'in-progress',
  priority: 'high',
  completion: 70,
  estimatedHours: 100,
  actualHours: 80,
  assignedTo: ['John Doe'],
  dependencies: []
};

export const handlers = [
  // Projects
  http.get(`${BASE_URL}/projects`, () => {
    return HttpResponse.json({
      status: 'success',
      results: 1,
      pagination: { page: 1, limit: 10, total: 1, pages: 1 },
      data: [mockProject]
    });
  }),

  http.get(`${BASE_URL}/projects/:projectId`, () => {
    return HttpResponse.json({
      status: 'success',
      data: mockProject
    });
  }),

  // Phases
  http.get(`${BASE_URL}/projects/:projectId/phases`, () => {
    return HttpResponse.json({
      status: 'success',
      results: 1,
      pagination: { page: 1, limit: 10, total: 1, pages: 1 },
      data: [mockPhase]
    });
  }),

  http.get(`${BASE_URL}/projects/:projectId/phases/:phaseId`, () => {
    return HttpResponse.json({
      status: 'success',
      data: mockPhase
    });
  }),

  // Tasks
  http.get(`${BASE_URL}/phases/:phaseId/tasks`, () => {
    return HttpResponse.json({
      status: 'success',
      results: 1,
      pagination: { page: 1, limit: 10, total: 1, pages: 1 },
      data: [mockTask]
    });
  }),

  http.get(`${BASE_URL}/tasks/:taskId`, () => {
    return HttpResponse.json({
      status: 'success',
      data: mockTask
    });
  }),

  // Test endpoint
  http.get('/api/test', () => {
    return HttpResponse.json({ message: 'Test API response' });
  }),
]; 