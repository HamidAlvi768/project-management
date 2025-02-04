import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskModal from './TaskModal';
import { ITask } from '../services/types';

// Mock the toast function
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: jest.fn(),
  }),
}));

describe('TaskModal Component', () => {
  const mockOnSave = jest.fn();
  const mockOnClose = jest.fn();
  const mockDependencies: ITask[] = [];
  
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    projectId: '1',
    phaseId: '1',
    dependencies: mockDependencies,
    task: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the modal with empty form for new task', () => {
    render(<TaskModal {...defaultProps} />);
    
    expect(screen.getByText('Create Task')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/priority/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assigned to/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/estimated hours/i)).toBeInTheDocument();
  });

  it('renders the modal with task data for editing', () => {
    const mockTask: ITask = {
      id: '1',
      name: 'Test Task',
      description: 'Test Description',
      startDate: '2024-03-01',
      endDate: '2024-03-10',
      status: 'not-started',
      priority: 'medium',
      assignedTo: 'user1',
      estimatedHours: 8,
      dependencies: [],
      projectId: '1',
      phaseId: '1',
    };

    render(<TaskModal {...defaultProps} task={mockTask} />);
    
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-03-01')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-03-10')).toBeInTheDocument();
    expect(screen.getByDisplayValue('8')).toBeInTheDocument();
  });

  it('validates required fields on form submission', async () => {
    render(<TaskModal {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Start date is required')).toBeInTheDocument();
      expect(screen.getByText('End date is required')).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('submits form with valid data', async () => {
    const user = userEvent.setup();
    render(<TaskModal {...defaultProps} />);

    await user.type(screen.getByLabelText(/name/i), 'New Task');
    await user.type(screen.getByLabelText(/description/i), 'New Description');
    await user.type(screen.getByLabelText(/start date/i), '2024-03-01');
    await user.type(screen.getByLabelText(/end date/i), '2024-03-10');
    await user.type(screen.getByLabelText(/estimated hours/i), '8');
    
    const submitButton = screen.getByRole('button', { name: /save/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Task',
        description: 'New Description',
        startDate: '2024-03-01',
        endDate: '2024-03-10',
        estimatedHours: 8,
      }));
    });
  });

  it('closes modal when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskModal {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
}); 