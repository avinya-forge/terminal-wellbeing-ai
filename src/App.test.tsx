import { render, screen, waitFor, act } from '@testing-library/react';
import App from './App';

// Mock the Terminal component
jest.mock('./components/Terminal', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="terminal-component">Terminal Component</div>
  };
});

describe('App Component', () => {
  // Mock for setTimeout to control loading state
  jest.useFakeTimers();

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('shows loading state initially', () => {
    render(<App />);
    
    // Check for loading state (skeleton)
    expect(screen.getByLabelText(/Loading application/i)).toBeInTheDocument();
    
    // Terminal component should not be rendered yet
    expect(screen.queryByTestId('terminal-component')).not.toBeInTheDocument();
  });

  it('renders Terminal component after loading completes', async () => {
    render(<App />);
    
    // Advance timers to complete loading
    act(() => {
      jest.advanceTimersByTime(500);
    });
    
    // Wait for the Terminal component to appear
    await waitFor(() => {
      expect(screen.getByTestId('terminal-component')).toBeInTheDocument();
    });
    
    // Loading skeleton should be gone
    expect(screen.queryByLabelText(/Loading application/i)).not.toBeInTheDocument();
  });
});
