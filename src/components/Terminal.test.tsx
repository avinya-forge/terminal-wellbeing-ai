import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import Terminal from './Terminal';
import * as aiModel from '../services/ai';
import * as commands from '../commands';
import { setPrivacyMode } from '../utils/sessionManager';

// Mock the AI model and commands modules
jest.mock('../services/ai', () => ({
  initializeModel: jest.fn().mockResolvedValue(true),
  generateResponse: jest.fn().mockResolvedValue('This is a test response')
}));

jest.mock('../commands', () => ({
  processCommand: jest.fn().mockImplementation(async (input) => {
    if (input.toLowerCase().includes('help')) {
      return 'Help information';
    }
    if (input.toLowerCase().includes('resources')) {
      return 'Resources information';
    }
    return 'Command processed';
  }),
  formatTimestamp: jest.fn().mockReturnValue('12:34')
}));

jest.mock('../utils/sessionManager', () => ({
  setPrivacyMode: jest.fn(),
  getPrivacyMode: jest.fn().mockReturnValue(false),
}));

// Mock TerminalOutput to avoid animation delays in integration tests,
// but let's make sure it handles onScrollToBottom so we can test the effect.
jest.mock('./TerminalOutput', () => {
  return {
    __esModule: true,
    default: ({ messages, onScrollToBottom }: any) => {
      // call scroll on render to simulate effect trigger
      setTimeout(onScrollToBottom, 0);
      return (
        <div data-testid="terminal-output">
          {messages.map((m: any) => (
            <div key={m.id}>{m.content}</div>
          ))}
        </div>
      )
    }
  };
});

describe('Terminal Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.localStorage.clear();

    // Mock scrollIntoView
    window.HTMLElement.prototype.scrollIntoView = jest.fn();

    // Mock matchMedia
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }));
  });

  it('renders the terminal with welcome messages', async () => {
    render(<Terminal />);
    expect(screen.getByText('WellBeing.sh')).toBeInTheDocument();
    expect(await screen.findByPlaceholderText(/Type a message/i)).toBeInTheDocument();
  });

  it('handles the clear command directly (no slash)', async () => {
    render(<Terminal />);
    
    const inputElement = await screen.findByPlaceholderText(/Type a message/i);
    await waitFor(() => expect(inputElement).not.toBeDisabled());

    fireEvent.change(inputElement, { target: { value: 'clear' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });

    await waitFor(() => {
      expect(screen.queryByText('clear')).not.toBeInTheDocument();
    });
  });

  it('handles empty whitespace message by ignoring', async () => {
    render(<Terminal />);
    
    const inputElement = await screen.findByPlaceholderText(/Type a message/i);
    await waitFor(() => expect(inputElement).not.toBeDisabled());

    fireEvent.change(inputElement, { target: { value: '    ' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    // Commands shouldn't be called
    expect(commands.processCommand).not.toHaveBeenCalled();
  });

  it('handles privacy command toggle', async () => {
    render(<Terminal />);
    
    const inputElement = await screen.findByPlaceholderText(/Type a message/i);
    await waitFor(() => expect(inputElement).not.toBeDisabled());

    fireEvent.change(inputElement, { target: { value: '/privacy' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    expect(setPrivacyMode).toHaveBeenCalledWith(true);
    
    await waitFor(() => {
      expect(screen.getByText(/Privacy Mode ENABLED/i)).toBeInTheDocument();
    });
  });

  it('handles processCommand failure gracefully', async () => {
    (commands.processCommand as jest.Mock).mockRejectedValueOnce(new Error('Process error'));
    
    render(<Terminal />);
    
    const inputElement = await screen.findByPlaceholderText(/Type a message/i);
    await waitFor(() => expect(inputElement).not.toBeDisabled());

    fireEvent.change(inputElement, { target: { value: 'cause error' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    await waitFor(() => {
      expect(screen.getByText(/Sorry, I encountered an error/i)).toBeInTheDocument();
    });
  });

  it('scrolls to bottom based on reduced motion preference', async () => {
    // Set reduced motion to true
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: query.includes('prefers-reduced-motion: reduce'),
    }));
    
    render(<Terminal />);
    
    const inputElement = await screen.findByPlaceholderText(/Type a message/i);
    await waitFor(() => expect(inputElement).not.toBeDisabled());

    fireEvent.change(inputElement, { target: { value: 'scroll text' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });
    
    await waitFor(() => {
      expect(window.HTMLElement.prototype.scrollIntoView).toHaveBeenCalledWith({ behavior: 'auto' });
    });
  });

  it('focuses input when clicking the scrollable region', async () => {
    render(<Terminal />);

    const inputElement = await screen.findByPlaceholderText(/Type a message/i);
    const scrollRegion = screen.getByLabelText('Terminal Output Scrollable Region');

    inputElement.blur();
    expect(inputElement).not.toHaveFocus();

    fireEvent.click(scrollRegion);

    expect(inputElement).toHaveFocus();
  });

  it('activates panic mode without slash', async () => {
    render(<Terminal />);

    const inputElement = await screen.findByPlaceholderText(/Type a message/i);
    await waitFor(() => expect(inputElement).not.toBeDisabled());

    fireEvent.change(inputElement, { target: { value: 'panic' } });
    fireEvent.keyDown(inputElement, { key: 'Enter', code: 'Enter', charCode: 13 });

    expect(await screen.findByText('Crisis Resources')).toBeInTheDocument();
  });
});
