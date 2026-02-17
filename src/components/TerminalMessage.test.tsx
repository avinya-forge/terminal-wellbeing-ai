import { render, screen, act } from '@testing-library/react';
import TerminalMessage from './TerminalMessage';
import { Message } from '../types/Message';

describe('TerminalMessage Component', () => {
  // Mock for setTimeout to control typewriter effect
  jest.useFakeTimers();

  const userMessage: Message = {
    id: '1',
    content: 'Hello there',
    sender: 'user',
    timestamp: new Date().toISOString()
  };

  const botMessage: Message = {
    id: '2',
    content: 'Hi! How can I help you today?',
    sender: 'bot',
    timestamp: new Date().toISOString()
  };

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('renders user message immediately without typewriter effect', () => {
    render(<TerminalMessage message={userMessage} />);
    
    // Check for prompt
    expect(screen.getByText('>')).toBeInTheDocument();
    
    // Check for full message content immediately
    expect(screen.getByText('Hello there')).toBeInTheDocument();
    
    // No cursor should be shown for user messages
    expect(screen.queryByText('|')).not.toBeInTheDocument();
  });

  it('renders bot message with typewriter effect', () => {
    render(<TerminalMessage message={botMessage} />);
    
    // Check for prompt
    expect(screen.getByText('$')).toBeInTheDocument();
    
    // Initially, only part of the message should be visible
    // and the cursor should be shown
    expect(screen.queryByText('Hi! How can I help you today?')).not.toBeInTheDocument();
    expect(screen.getByText('|')).toBeInTheDocument();
    
    // Advance timers to complete the typewriter effect
    act(() => {
      // Advance enough to type the full message
      // 15ms per character * message length
      jest.advanceTimersByTime(15 * botMessage.content.length + 100);
    });
    
    // Now the full message should be visible
    expect(screen.getByText('Hi! How can I help you today?')).toBeInTheDocument();
    
    // Cursor should be hidden after typing is complete
    expect(screen.queryByText('|')).not.toBeInTheDocument();
  });

  it('applies different styles based on message sender', () => {
    const { rerender } = render(<TerminalMessage message={userMessage} />);
    
    // User message should have user-message class
    const userMessageElement = screen.getByText('Hello there').parentElement;
    expect(userMessageElement).toHaveClass('user-message');
    
    // Rerender with bot message
    rerender(<TerminalMessage message={botMessage} />);
    
    // Bot message should have bot-message class
    act(() => {
      jest.advanceTimersByTime(15 * botMessage.content.length + 100);
    });
    
    const botMessageElement = screen.getByText('Hi! How can I help you today?').parentElement;
    expect(botMessageElement).toHaveClass('bot-message');
  });
});
