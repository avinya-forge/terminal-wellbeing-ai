import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the Terminal component
jest.mock('./components/Terminal', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="terminal-component">Terminal Component</div>
  };
});

describe('App Component', () => {
  it('renders Terminal component immediately', () => {
    render(<App />);
    
    // Terminal component should be rendered immediately
    expect(screen.getByTestId('terminal-component')).toBeInTheDocument();
  });
});
