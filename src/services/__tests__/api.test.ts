import { projectApi, phaseApi, taskApi } from '../api';
import { mockProject, mockPhase, mockTask } from '../../mocks/handlers';

describe('API Services', () => {
  describe('Project API', () => {
    it('fetches all projects', async () => {
      const response = await projectApi.getAll();
      expect(response.status).toBe('success');
      expect(response.data).toEqual([mockProject]);
    });

    it('fetches a single project', async () => {
      const response = await projectApi.getOne('1');
      expect(response.status).toBe('success');
      expect(response.data).toEqual(mockProject);
    });

    it('creates a project', async () => {
      const newProject = {
        name: 'New Project',
        estimatedBudget: 100000,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        description: 'New project description',
        stakeholders: ['John Doe']
      };

      const response = await projectApi.create(newProject);
      expect(response.status).toBe('success');
      expect(response.data).toHaveProperty('name', newProject.name);
    });

    it('updates a project', async () => {
      const update = {
        name: 'Updated Project'
      };

      const response = await projectApi.update('1', update);
      expect(response.status).toBe('success');
      expect(response.data).toHaveProperty('name', update.name);
    });
  });

  describe('Phase API', () => {
    it('fetches all phases for a project', async () => {
      const response = await phaseApi.getAllForProject('1');
      expect(response.status).toBe('success');
      expect(response.data).toEqual([mockPhase]);
    });

    it('fetches a single phase', async () => {
      const response = await phaseApi.getOne('1', '1');
      expect(response.status).toBe('success');
      expect(response.data).toEqual(mockPhase);
    });

    it('creates a phase', async () => {
      const newPhase = {
        name: 'New Phase',
        estimatedBudget: 50000,
        startDate: '2024-01-01',
        endDate: '2024-06-30',
        description: 'New phase description'
      };

      const response = await phaseApi.create('1', newPhase);
      expect(response.status).toBe('success');
      expect(response.data).toHaveProperty('name', newPhase.name);
    });

    it('updates a phase', async () => {
      const update = {
        name: 'Updated Phase'
      };

      const response = await phaseApi.update('1', '1', update);
      expect(response.status).toBe('success');
      expect(response.data).toHaveProperty('name', update.name);
    });
  });

  describe('Task API', () => {
    it('fetches all tasks for a phase', async () => {
      const response = await taskApi.getAllForPhase('1', '1');
      expect(response.status).toBe('success');
      expect(response.data).toEqual([mockTask]);
    });

    it('creates a task', async () => {
      const newTask = {
        name: 'New Task',
        description: 'New task description',
        startDate: '2024-01-01',
        endDate: '2024-03-31',
        status: 'todo',
        priority: 'medium',
        estimatedHours: 100
      };

      const response = await taskApi.create('1', '1', newTask);
      expect(response.status).toBe('success');
      expect(response.data).toHaveProperty('name', newTask.name);
    });

    it('updates a task', async () => {
      const update = {
        name: 'Updated Task'
      };

      const response = await taskApi.update('1', '1', '1', update);
      expect(response.status).toBe('success');
      expect(response.data).toHaveProperty('name', update.name);
    });
  });
}); 