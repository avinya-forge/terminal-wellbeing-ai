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
  });

  it('renders bot message with typewriter effect', () => {
    render(<TerminalMessage message={botMessage} />);
    
    // Check for prompt
    expect(screen.getByText('$')).toBeInTheDocument();
    
    // Initially, only part of the message should be visible
    expect(screen.queryByText('Hi! How can I help you today?')).not.toBeInTheDocument();
    
    // Advance timers to complete the typewriter effect
    act(() => {
      // Advance enough to type the full message
      // 15ms per character * message length
      jest.advanceTimersByTime(15 * botMessage.content.length + 100);
    });
    
    // Now the full message should be visible
    expect(screen.getByText('Hi! How can I help you today?')).toBeInTheDocument();
  });

  it('applies different styles based on message sender', () => {
    const { rerender } = render(<TerminalMessage message={userMessage} />);
    
    // User message style
    const userMessageElement = screen.getByText('Hello there').parentElement;
    expect(userMessageElement).toHaveStyle({ color: 'hsl(var(--foreground))' });
    
    // Rerender with bot message
    rerender(<TerminalMessage message={botMessage} />);
    
    // Bot message style
    act(() => {
      jest.advanceTimersByTime(15 * botMessage.content.length + 100);
    });
    
    const botMessageElement = screen.getByText('Hi! How can I help you today?').parentElement;
    expect(botMessageElement).toHaveStyle({ color: 'hsl(var(--primary))' });
  });

  it('respects animate=false for bot messages', () => {
    const onComplete = jest.fn();
    render(<TerminalMessage message={botMessage} animate={false} onComplete={onComplete} />);

    // Should be visible immediately
    expect(screen.getByText('Hi! How can I help you today?')).toBeInTheDocument();

    // onComplete should be called immediately
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('calls onComplete after animation finishes', () => {
    const onComplete = jest.fn();
    render(<TerminalMessage message={botMessage} animate={true} onComplete={onComplete} />);

    // Initially not called
    expect(onComplete).not.toHaveBeenCalled();

    // Advance timers
    act(() => {
      jest.advanceTimersByTime(15 * botMessage.content.length + 100);
    });

    // Should be called now
    expect(onComplete).toHaveBeenCalledTimes(1);
  });
});
