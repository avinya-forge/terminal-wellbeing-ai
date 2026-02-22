import { render, screen } from '@testing-library/react';
import TypingIndicator from './TypingIndicator';

describe('TypingIndicator Component', () => {
  it('renders default label "Thinking"', () => {
    render(<TypingIndicator />);
    expect(screen.getByText('Thinking')).toBeInTheDocument();
  });

  it('renders custom label', () => {
    render(<TypingIndicator label="Loading" />);
    expect(screen.getByText('Loading')).toBeInTheDocument();
  });

  it('renders 3 animated dots', () => {
    render(<TypingIndicator />);
    const dots = screen.getAllByText('.');
    expect(dots).toHaveLength(3);

    // Check if they have animation class
    dots.forEach(dot => {
      expect(dot).toHaveClass('animate-pulse');
    });
  });

  it('has correct accessibility attributes', () => {
    render(<TypingIndicator />);
    const container = screen.getByRole('status');
    expect(container).toHaveAttribute('aria-label', 'Thinking...');
  });
});
