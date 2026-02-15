import { render, screen } from '@testing-library/react';
import TerminalOutput from './TerminalOutput';
import { Message } from './Terminal';

// Mock the TerminalMessage component
jest.mock('./TerminalMessage', () => {
  return {
    __esModule: true,
    default: ({ message }: { message: Message }) => (
      <div data-testid="terminal-message">
        {message.sender}: {message.content}
      </div>
    )
  };
});

describe('TerminalOutput Component', () => {
  const sampleMessages: Message[] = [
    {
      id: '1',
      content: 'Hello there',
      sender: 'user',
      timestamp: new Date()
    },
    {
      id: '2',
      content: 'Hi! How can I help you today?',
      sender: 'bot',
      timestamp: new Date()
    }
  ];

  it('renders messages correctly', () => {
    render(<TerminalOutput messages={sampleMessages} isTyping={false} />);
    
    // Check if all messages are rendered
    const messageElements = screen.getAllByTestId('terminal-message');
    expect(messageElements.length).toBe(2);
    
    // Check content of messages through the mock
    expect(messageElements[0].textContent).toContain('user: Hello there');
    expect(messageElements[1].textContent).toContain('bot: Hi! How can I help you today?');
  });

  it('shows typing indicator when isTyping is true', () => {
    render(<TerminalOutput messages={sampleMessages} isTyping={true} />);
    
    // Check for typing indicator
    expect(screen.getByText('>')).toBeInTheDocument();
    expect(screen.getByText('Thinking')).toBeInTheDocument();
    
    // The animation dots should be present
    const animatedElement = screen.getByText('...');
    expect(animatedElement).toBeInTheDocument();
    expect(animatedElement).toHaveClass('animate-pulse');
  });

  it('does not show typing indicator when isTyping is false', () => {
    render(<TerminalOutput messages={sampleMessages} isTyping={false} />);
    
    // Typing indicator should not be present
    expect(screen.queryByText('Thinking')).not.toBeInTheDocument();
  });

  it('renders correctly with empty messages array', () => {
    render(<TerminalOutput messages={[]} isTyping={false} />);
    
    // No message elements should be rendered
    const messageElements = screen.queryAllByTestId('terminal-message');
    expect(messageElements.length).toBe(0);
  });
});
