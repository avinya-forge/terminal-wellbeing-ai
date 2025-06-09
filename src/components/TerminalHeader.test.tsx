import React from 'react';
import { render, screen } from '@testing-library/react';
import TerminalHeader from './TerminalHeader';

describe('TerminalHeader Component', () => {
  it('renders with model not loaded state by default', () => {
    render(<TerminalHeader />);
    
    // Check for terminal title
    expect(screen.getByText('WellBeing.sh')).toBeInTheDocument();
    
    // Check for model status text
    expect(screen.getByText('AI Model: Using fallback responses')).toBeInTheDocument();
    
    // Check for status indicators (dots)
    const dots = document.querySelectorAll('.rounded-full');
    expect(dots.length).toBe(3);
  });

  it('renders with model loaded state when specified', () => {
    render(<TerminalHeader modelLoaded={true} />);
    
    // Check for model status text
    expect(screen.getByText('AI Model: Ready')).toBeInTheDocument();
    
    // Check for green status indicator
    const greenDot = document.querySelector('.bg-green-500');
    expect(greenDot).toBeInTheDocument();
  });
});
