import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from './Loading';

describe('Loading Component', () => {
  it('renders loading spinner with default props', () => {
    render(<Loading />);
    const loadingElement = screen.getByRole('status');
    expect(loadingElement).toBeInTheDocument();
  });

  it('renders loading spinner with custom text', () => {
    const customText = 'Custom loading text';
    render(<Loading text={customText} />);
    expect(screen.getByText(customText)).toBeInTheDocument();
  });

  it('renders full screen loading when fullScreen prop is true', () => {
    render(<Loading fullScreen />);
    const fullScreenContainer = screen.getByTestId('loading-container');
    expect(fullScreenContainer).toHaveClass('fixed inset-0');
  });

  it('applies correct size class based on size prop', () => {
    render(<Loading size="lg" />);
    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveClass('w-8 h-8');
  });
}); 