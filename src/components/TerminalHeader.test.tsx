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
    const dots = document.querySelectorAll('.status-indicator');
    expect(dots.length).toBe(3);
  });

  it('renders with model loaded state when specified', () => {
    render(<TerminalHeader modelLoaded={true} />);
    
    // Check for model status text
    // The text in the component is dynamic: "AI Model: Ready" vs "AI Model: Using fallback responses"
    // However, the test should expect specific text based on the prop
    // The component renders:
    // <span>{modelLoaded ? 'AI Model: Ready' : 'AI Model: Using fallback responses'}</span>
    // So if modelLoaded is true, we expect 'AI Model: Ready'
    expect(screen.getByText(/AI Model: Ready/i)).toBeInTheDocument();
    
    // Check for green status indicator
    const greenDot = document.querySelector('.status-green');
    expect(greenDot).toBeInTheDocument();
  });
});
