import { render, screen } from '@testing-library/react';
import Loading from '../ui/loading';

describe('Loading', () => {
  it('renders loading spinner', () => {
    render(<Loading />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('renders with custom text', () => {
    const text = 'Loading data...';
    render(<Loading text={text} />);
    expect(screen.getByText(text)).toBeInTheDocument();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<Loading size="sm" />);
    expect(screen.getByRole('status')).toHaveClass('h-4 w-4');

    rerender(<Loading size="md" />);
    expect(screen.getByRole('status')).toHaveClass('h-8 w-8');

    rerender(<Loading size="lg" />);
    expect(screen.getByRole('status')).toHaveClass('h-16 w-16');
  });

  it('renders in fullscreen mode', () => {
    render(<Loading fullScreen />);
    expect(screen.getByRole('status').parentElement?.parentElement).toHaveClass(
      'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm'
    );
  });

  it('renders in inline mode by default', () => {
    render(<Loading />);
    expect(screen.getByRole('status').parentElement).toHaveClass(
      'flex flex-col items-center justify-center gap-4'
    );
  });
}); 