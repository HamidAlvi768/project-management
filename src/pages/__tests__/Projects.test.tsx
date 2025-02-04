import { screen, waitFor } from '@testing-library/react';
import { render } from '../../test/test-utils';
import Projects from '../Projects';
import { mockProject } from '../../mocks/handlers';

describe('Projects Page', () => {
  it('renders projects list', async () => {
    render(<Projects />);

    // Check loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check if project is rendered
    expect(screen.getByText(mockProject.name)).toBeInTheDocument();
    expect(screen.getByText(`PKR ${mockProject.actualCost.toLocaleString()}`)).toBeInTheDocument();
    expect(screen.getByText(`${mockProject.completion}%`)).toBeInTheDocument();
  });

  it('displays project details correctly', async () => {
    render(<Projects />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check status badge
    const statusBadge = screen.getByText(mockProject.status.charAt(0).toUpperCase() + mockProject.status.slice(1));
    expect(statusBadge).toBeInTheDocument();

    // Check dates
    const startDate = new Date(mockProject.startDate).toLocaleDateString();
    const endDate = new Date(mockProject.endDate).toLocaleDateString();
    expect(screen.getByText(`${startDate} - ${endDate}`)).toBeInTheDocument();

    // Check budget variance
    const variance = mockProject.budgetVariance;
    const varianceText = variance <= 0 
      ? `Under budget: PKR ${Math.abs(variance).toLocaleString()}`
      : `Over budget: PKR ${variance.toLocaleString()}`;
    expect(screen.getByText(varianceText)).toBeInTheDocument();
  });

  it('shows project counts', async () => {
    render(<Projects />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(`Phases: ${mockProject.phaseCount}`)).toBeInTheDocument();
    expect(screen.getByText(`Tasks: ${mockProject.taskCount}`)).toBeInTheDocument();
  });

  it('has working navigation buttons', async () => {
    const { user } = render(<Projects />);

    await waitFor(() => {
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
    });

    // Check if View Phases button exists and is clickable
    const viewPhasesButton = screen.getByRole('button', { name: /view phases/i });
    expect(viewPhasesButton).toBeInTheDocument();
    await user.click(viewPhasesButton);
    expect(window.location.pathname).toBe(`/projects/${mockProject._id}/phases`);
  });
}); 