import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the Terminal component
jest.mock('./components/Terminal', () => {
  return {
    __esModule: true,
    default: () => <div data-testid="terminal-component">Terminal Component</div>
  };
});

import { applyTheme } from './utils/themes';
import { fireEvent } from '@testing-library/react';

jest.mock('./utils/themes', () => ({
  applyTheme: jest.fn()
}));

describe('App Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();
  });

  it('renders Terminal component immediately', () => {
    render(<App />);
    expect(screen.getByTestId('terminal-component')).toBeInTheDocument();
  });

  it('applies default modern theme when localStorage is empty', () => {
    render(<App />);
    expect(applyTheme).toHaveBeenCalledWith('modern');
  });

  it('applies plain string theme from localStorage', () => {
    window.localStorage.setItem('terminal_theme', 'monokai');
    render(<App />);
    expect(applyTheme).toHaveBeenCalledWith('monokai');
  });

  it('applies parsed legacy JSON theme from localStorage', () => {
    window.localStorage.setItem('terminal_theme', '"dracula"');
    render(<App />);
    expect(applyTheme).toHaveBeenCalledWith('dracula');
  });

  it('falls back to modern theme if JSON parsing fails', () => {
    window.localStorage.setItem('terminal_theme', '"broken_json');
    render(<App />);
    expect(applyTheme).toHaveBeenCalledWith('modern');
  });

  it('skip-link behavior correctly updates styles on focus/blur', () => {
    render(<App />);
    const skipLink = screen.getByText('Skip to terminal input');

    expect(skipLink).toHaveStyle({ left: '-9999px' });

    fireEvent.focus(skipLink);
    expect(skipLink).toHaveStyle({ left: '0px' });

    fireEvent.blur(skipLink);
    expect(skipLink).toHaveStyle({ left: '-9999px' });
  });
});
