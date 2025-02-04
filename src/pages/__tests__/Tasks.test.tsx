import { screen, waitFor } from '@testing-library/react';
import { render } from '../../test/test-utils';
import Tasks from '../Tasks';
import { mockProject, mockPhase, mockTask } from '../../mocks/handlers';

jest.mock('react-router-dom', async () => ({
  ...await jest.requireActual('react-router-dom'),
  useParams: () => ({
    projectId: mockProject._id,
    phaseId: mockPhase._id
  })
}));

describe('Tasks Page', () => {
  it('renders tasks list', async () => {
    render(<Tasks />);

    // Check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check if task is rendered
    expect(screen.getByText(mockTask.name)).toBeInTheDocument();
    expect(screen.getByText(`${mockTask.actualHours} / ${mockTask.estimatedHours}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockTask.completion}%`)).toBeInTheDocument();
  });

  it('displays task details correctly', async () => {
    render(<Tasks />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check status badge
    const statusBadge = screen.getByText(
      mockTask.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    );
    expect(statusBadge).toBeInTheDocument();

    // Check priority badge
    const priorityBadge = screen.getByText(
      mockTask.priority.charAt(0).toUpperCase() + mockTask.priority.slice(1)
    );
    expect(priorityBadge).toBeInTheDocument();

    // Check dates
    const startDate = new Date(mockTask.startDate).toLocaleDateString();
    const endDate = new Date(mockTask.endDate).toLocaleDateString();
    expect(screen.getByText(`${startDate} - ${endDate}`)).toBeInTheDocument();

    // Check description
    expect(screen.getByText(mockTask.description)).toBeInTheDocument();
  });

  it('shows assigned team members', async () => {
    render(<Tasks />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    mockTask.assignedTo.forEach(member => {
      expect(screen.getByText(member)).toBeInTheDocument();
    });
  });

  it('has working navigation buttons', async () => {
    const { user } = render(<Tasks />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check if Back to Phases button exists and is clickable
    const backButton = screen.getByRole('button', { name: /back to phases/i });
    expect(backButton).toBeInTheDocument();
    await user.click(backButton);
    expect(window.location.pathname).toBe(`/projects/${mockProject._id}/phases`);
  });

  it('shows add task button', async () => {
    render(<Tasks />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    const addButton = screen.getByRole('button', { name: /add task/i });
    expect(addButton).toBeInTheDocument();
  });
}); 