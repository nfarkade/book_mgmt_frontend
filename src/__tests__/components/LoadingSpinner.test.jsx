import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../../components/LoadingSpinner';

describe('LoadingSpinner Component', () => {
  test('renders spinner with default size', () => {
    render(<LoadingSpinner />);
    
    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner-medium');
  });

  test('renders spinner with small size', () => {
    render(<LoadingSpinner size="small" />);
    
    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner-small');
  });

  test('renders spinner with medium size', () => {
    render(<LoadingSpinner size="medium" />);
    
    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner-medium');
  });

  test('renders spinner with large size', () => {
    render(<LoadingSpinner size="large" />);
    
    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner-large');
  });

  test('renders without message when message prop is not provided', () => {
    render(<LoadingSpinner />);
    
    const message = screen.queryByText(/loading/i);
    expect(message).not.toBeInTheDocument();
  });

  test('renders with message when message prop is provided', () => {
    const testMessage = 'Loading data...';
    render(<LoadingSpinner message={testMessage} />);
    
    expect(screen.getByText(testMessage)).toBeInTheDocument();
    expect(screen.getByText(testMessage)).toHaveClass('loading-message');
  });

  test('renders container with correct class', () => {
    render(<LoadingSpinner />);
    
    const container = document.querySelector('.loading-spinner-container');
    expect(container).toBeInTheDocument();
  });

  test('renders both spinner and message when both are provided', () => {
    const testMessage = 'Please wait...';
    render(<LoadingSpinner size="large" message={testMessage} />);
    
    const spinner = document.querySelector('.spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('spinner-large');
    expect(screen.getByText(testMessage)).toBeInTheDocument();
  });

  test('handles empty string message', () => {
    render(<LoadingSpinner message="" />);
    
    const message = screen.queryByText(/loading/i);
    expect(message).not.toBeInTheDocument();
  });

  test('renders with different message texts', () => {
    const messages = [
      'Loading...',
      'Please wait',
      'Fetching data',
      'Processing request'
    ];

    messages.forEach(msg => {
      const { unmount } = render(<LoadingSpinner message={msg} />);
      expect(screen.getByText(msg)).toBeInTheDocument();
      unmount();
    });
  });
});
